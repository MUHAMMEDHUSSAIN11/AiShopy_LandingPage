'use client'

import { useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createCartOrder, lookupCustomerByPhone, uploadPaymentProof } from '@/lib/customer'
import { checkoutSchema, phoneSchema, type CheckoutFormData } from '@/lib/checkout-schema'
import { formatPrice } from '@/lib/format'
import type { ShippingAddress } from '@/types/customer'
import { getEnabledPaymentMethods, getStoreUpiDetails, type Store } from '@/types/store'

const MAX_PROOF_SIZE_BYTES = 5 * 1024 * 1024 // 5MB, matches the upload API limit.

export type CheckoutLineItem = {
  productId: string
  variantId?: string
  name: string
  variantName?: string
  price: number
  quantity: number
  imageUrl?: string
}

type CheckoutExperienceProps = {
  store: Store
  items: CheckoutLineItem[]
  emptyState?: ReactNode
  onOrderPlaced?: () => void
}

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>
type Step = 'phone' | 'details'

const FALLBACK_PAYMENT_METHOD = { key: 'cod', label: 'Cash on Delivery' }

const emptyForm: CheckoutFormData = {
  name: '',
  phone_number: '',
  address: '',
  city: '',
  district: '',
  state: '',
  postcode: '',
}

function addressToForm(address: ShippingAddress, fallbackPhone: string): CheckoutFormData {
  return {
    name: address.name ?? '',
    phone_number: (address.phone_number || fallbackPhone).replace(/\D/g, '').slice(0, 10),
    address: address.address ?? '',
    city: address.city ?? '',
    district: address.district ?? '',
    state: address.state ?? '',
    postcode: (address.postcode ?? '').replace(/\D/g, '').slice(0, 6),
  }
}

function summariseAddress(address: ShippingAddress): string {
  return [address.address, address.city, address.district, address.state, address.postcode]
    .filter((part) => part && part.trim().length > 0)
    .join(', ')
}

export default function CheckoutExperience({
  store,
  items,
  emptyState,
  onOrderPlaced,
}: CheckoutExperienceProps) {
  const router = useRouter()

  const paymentOptions = useMemo(() => {
    const enabled = getEnabledPaymentMethods(store)
    return enabled.length > 0 ? enabled : [FALLBACK_PAYMENT_METHOD]
  }, [store])

  const [step, setStep] = useState<Step>('phone')
  const [phoneInput, setPhoneInput] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [form, setForm] = useState<CheckoutFormData>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]?.key ?? '')
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [redirecting, setRedirecting] = useState(false)

  const upiDetails = useMemo(() => getStoreUpiDetails(store), [store])
  const [proofUrl, setProofUrl] = useState('')
  const [proofPreview, setProofPreview] = useState('')
  const [proofUploading, setProofUploading] = useState(false)
  const [proofError, setProofError] = useState('')
  const proofInputRef = useRef<HTMLInputElement>(null)

  const isUpi = paymentMethod === 'upi'
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0 && !redirecting) {
    return <>{emptyState}</>
  }

  const handlePhoneCheck = async (event: React.FormEvent) => {
    event.preventDefault()
    setPhoneError('')

    const cleaned = phoneInput.replace(/\D/g, '')
    const result = phoneSchema.safeParse({ phone_number: cleaned })
    if (!result.success) {
      setPhoneError(result.error.errors[0]?.message ?? 'Invalid phone number')
      return
    }

    setLoading(true)
    try {
      const response = await lookupCustomerByPhone(store.slug, cleaned)
      setSavedAddresses(response.addresses)
      setSelectedAddressIndex(null)
      setForm({ ...emptyForm, phone_number: cleaned, name: response.name ?? '' })
      setStep('details')

      // If the customer has saved addresses, let them pick one in a modal;
      // otherwise they simply fill in a new address.
      if (response.addresses.length > 0) {
        setAddressModalOpen(true)
      }
    } catch {
      setPhoneError('Could not verify phone number. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectSavedAddress = (index: number) => {
    const address = savedAddresses[index]
    if (!address) return
    setSelectedAddressIndex(index)
    setForm(addressToForm(address, form.phone_number))
    setErrors({})
    setAddressModalOpen(false)
  }

  const handleUseNewAddress = () => {
    setSelectedAddressIndex(null)
    setForm({ ...emptyForm, phone_number: form.phone_number })
    setErrors({})
    setAddressModalOpen(false)
  }

  const handleProofChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setProofError('')
    setSubmitError('')

    if (!file.type.startsWith('image/')) {
      setProofError('Please select an image file.')
      return
    }

    if (file.size > MAX_PROOF_SIZE_BYTES) {
      setProofError('Image is too large. Please upload a file under 5MB.')
      return
    }

    // Reset any previous upload while the new one is in flight.
    setProofUrl('')
    setProofPreview(URL.createObjectURL(file))
    setProofUploading(true)

    try {
      const url = await uploadPaymentProof(store.slug, file)
      setProofUrl(url)
    } catch (error) {
      setProofError(
        error instanceof Error ? error.message : 'Failed to upload payment proof. Please try again.',
      )
      setProofPreview('')
    } finally {
      setProofUploading(false)
    }
  }

  const handleRemoveProof = () => {
    setProofUrl('')
    setProofPreview('')
    setProofError('')
    if (proofInputRef.current) {
      proofInputRef.current.value = ''
    }
  }

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setSelectedAddressIndex(null)
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitError('')

    const result = checkoutSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof CheckoutFormData
        if (!fieldErrors[field]) fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    if (!paymentMethod) {
      setSubmitError('Please select a payment method.')
      return
    }

    if (isUpi) {
      if (proofUploading) {
        setSubmitError('Please wait for the payment proof to finish uploading.')
        return
      }
      if (!proofUrl) {
        setProofError('Please upload your UPI payment screenshot to continue.')
        setSubmitError('Payment proof is required for UPI orders.')
        return
      }
    }

    setLoading(true)
    try {
      const response = await createCartOrder(store.slug, {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddress: result.data,
        paymentMethod,
        paymentProofUrl: isUpi ? proofUrl : undefined,
      })
      setRedirecting(true)
      onOrderPlaced?.()
      router.push(`/order/success?orderId=${encodeURIComponent(response.orderId)}`)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to place your order. Please try again.',
      )
      setLoading(false)
    }
  }

  return (
    <>
    <div className="space-y-8">
      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {items.map((item) => (
          <div
            key={item.variantId ? `${item.productId}:${item.variantId}` : item.productId}
            className="flex gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
          >
            {item.imageUrl ? (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="64px" />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-brand-dark">{item.name}</p>
              {item.variantName ? <p className="text-sm text-gray-500">{item.variantName}</p> : null}
              <p className="mt-1 text-sm text-gray-600">
                Qty {item.quantity} · {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 font-bold">
          <span>Total</span>
          <span className="text-brand-green">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {step === 'phone' ? (
        <form onSubmit={handlePhoneCheck} className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-brand-dark">Enter your phone number</h2>
            <p className="mt-1 text-sm text-gray-500">
              We&apos;ll check for saved delivery addresses on your account.
            </p>
          </div>

          <div>
            <label htmlFor="phone-check" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone-check"
              type="tel"
              inputMode="numeric"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={`mt-1 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-green/20 ${
                phoneError ? 'border-red-400' : 'border-gray-200 focus:border-brand-green'
              }`}
              placeholder="10-digit mobile number"
            />
            {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-green py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-brand-dark">Delivery details</h2>
              <p className="mt-1 text-sm text-gray-500">Phone: {form.phone_number}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="text-sm font-medium text-brand-green hover:underline"
            >
              Change
            </button>
          </div>

          {savedAddresses.length > 0 ? (
            <button
              type="button"
              onClick={() => setAddressModalOpen(true)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm transition hover:border-brand-green"
            >
              {selectedAddressIndex !== null && savedAddresses[selectedAddressIndex] ? (
                <span className="min-w-0">
                  <span className="font-semibold text-brand-dark">
                    {savedAddresses[selectedAddressIndex].name || 'Saved address'}
                  </span>
                  <span className="mt-0.5 block truncate text-gray-500">
                    {summariseAddress(savedAddresses[selectedAddressIndex])}
                  </span>
                </span>
              ) : (
                <span className="font-medium text-brand-green">Choose a saved address</span>
              )}
              <span className="ml-3 shrink-0 text-sm font-medium text-brand-green">Change</span>
            </button>
          ) : null}

          <div className="space-y-4">
            <CheckoutField
              id="name"
              label="Full Name"
              value={form.name}
              error={errors.name}
              onChange={(v) => handleChange('name', v)}
            />
            <CheckoutField
              id="phone_number"
              label="Phone Number"
              value={form.phone_number}
              error={errors.phone_number}
              onChange={(v) => handleChange('phone_number', v.replace(/\D/g, '').slice(0, 10))}
              inputMode="numeric"
            />
            <CheckoutField
              id="address"
              label="Address"
              value={form.address}
              error={errors.address}
              onChange={(v) => handleChange('address', v)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckoutField
                id="city"
                label="City"
                value={form.city}
                error={errors.city}
                onChange={(v) => handleChange('city', v)}
              />
              <CheckoutField
                id="district"
                label="District"
                value={form.district}
                error={errors.district}
                onChange={(v) => handleChange('district', v)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckoutField
                id="state"
                label="State"
                value={form.state}
                error={errors.state}
                onChange={(v) => handleChange('state', v)}
              />
              <CheckoutField
                id="postcode"
                label="Postcode"
                value={form.postcode}
                error={errors.postcode}
                onChange={(v) => handleChange('postcode', v.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Payment method</p>
            <div className="space-y-2">
              {paymentOptions.map((option) => {
                const isSelected = paymentMethod === option.key
                return (
                  <label
                    key={option.key}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                      isSelected
                        ? 'border-brand-green bg-green-50'
                        : 'border-gray-200 bg-white hover:border-brand-green'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={option.key}
                      checked={isSelected}
                      onChange={() => setPaymentMethod(option.key)}
                      className="h-4 w-4 accent-brand-green"
                    />
                    <span className="font-medium text-brand-dark">{option.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {isUpi ? (
            <div className="space-y-3 rounded-xl border border-brand-green/30 bg-green-50/40 p-4">
              <div>
                <p className="text-sm font-semibold text-brand-dark">Pay via UPI</p>
                <p className="mt-1 text-xs text-gray-600">
                  Send {formatPrice(totalPrice)} to the UPI ID below, then upload a screenshot of the
                  payment to confirm your order.
                </p>
              </div>

              {upiDetails?.vpa || upiDetails?.qrImageUrl ? (
                <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-3">
                  {upiDetails?.qrImageUrl ? (
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={upiDetails.qrImageUrl}
                        alt="UPI QR code"
                        fill
                        className="object-contain"
                        sizes="96px"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 text-sm">
                    {upiDetails?.displayName ? (
                      <p className="font-semibold text-brand-dark">{upiDetails.displayName}</p>
                    ) : null}
                    {upiDetails?.vpa ? (
                      <p className="mt-0.5 break-all font-mono text-gray-700">{upiDetails.vpa}</p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload payment screenshot <span className="text-red-500">*</span>
                </label>

                {proofPreview ? (
                  <div className="mt-2 flex items-start gap-3">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                      {/* Local object URL / remote URL preview — plain img avoids next/image host config. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={proofPreview}
                        alt="Payment proof preview"
                        className="h-full w-full object-cover"
                      />
                      {proofUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                          <span className="text-xs font-medium text-brand-dark">Uploading…</span>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      {proofUrl && !proofUploading ? (
                        <span className="inline-flex items-center gap-1 font-medium text-brand-green">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Uploaded
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={handleRemoveProof}
                        disabled={proofUploading}
                        className="text-left font-medium text-gray-500 hover:text-red-500 disabled:opacity-50"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => proofInputRef.current?.click()}
                        disabled={proofUploading}
                        className="text-left font-medium text-brand-green hover:underline disabled:opacity-50"
                      >
                        Replace image
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => proofInputRef.current?.click()}
                    disabled={proofUploading}
                    className="mt-2 flex w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-6 text-sm text-gray-500 transition hover:border-brand-green hover:text-brand-green disabled:opacity-60"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V18a2 2 0 002 2h14a2 2 0 002-2v-1.5M16 8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="font-medium">{proofUploading ? 'Uploading…' : 'Tap to upload screenshot'}</span>
                    <span className="text-xs text-gray-400">PNG, JPG or WebP · up to 5MB</span>
                  </button>
                )}

                <input
                  ref={proofInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProofChange}
                />

                {proofError ? <p className="mt-2 text-xs text-red-500">{proofError}</p> : null}
              </div>
            </div>
          ) : null}

          {submitError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={loading || proofUploading}
            className="w-full rounded-full bg-brand-green py-3.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? 'Placing Order...' : proofUploading ? 'Uploading proof...' : 'Place Order'}
          </button>
        </form>
      )}
    </div>

    {addressModalOpen ? (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Choose delivery address"
        onClick={() => setAddressModalOpen(false)}
      >
        <div
          className="flex max-h-[85vh] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h3 className="text-lg font-bold text-brand-dark">Choose delivery address</h3>
              <p className="mt-0.5 text-sm text-gray-500">Select a saved address or add a new one.</p>
            </div>
            <button
              type="button"
              onClick={() => setAddressModalOpen(false)}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-brand-dark"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-5 py-4">
            {savedAddresses.map((address, index) => {
              const isSelected = selectedAddressIndex === index
              return (
                <button
                  key={`${address.address}-${index}`}
                  type="button"
                  onClick={() => handleSelectSavedAddress(index)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                    isSelected
                      ? 'border-brand-green bg-green-50'
                      : 'border-gray-200 bg-white hover:border-brand-green'
                  }`}
                >
                  <span className="font-semibold text-brand-dark">{address.name || 'Saved address'}</span>
                  <span className="mt-0.5 block text-gray-500">{summariseAddress(address)}</span>
                  {address.phone_number ? (
                    <span className="mt-0.5 block text-xs text-gray-400">{address.phone_number}</span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="border-t border-gray-100 px-5 py-4">
            <button
              type="button"
              onClick={handleUseNewAddress}
              className="w-full rounded-full border border-dashed border-brand-green px-4 py-3 text-sm font-semibold text-brand-green transition hover:bg-green-50"
            >
              + Enter a new address
            </button>
          </div>
        </div>
      </div>
    ) : null}
    </>
  )
}

type CheckoutFieldProps = {
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  inputMode?: 'text' | 'numeric'
}

function CheckoutField({ id, label, value, error, onChange, inputMode = 'text' }: CheckoutFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green/20 ${
          error ? 'border-red-400' : 'border-gray-200 focus:border-brand-green'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
