'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePreview, useStoreHref } from '@/contexts/PreviewContext'
import { useStoreTemplate } from '@/contexts/StoreTemplateContext'
import {
  createCartOrder,
  lookupCustomerByPhone,
  uploadPaymentProof,
  verifyRazorpayPayment,
} from '@/lib/customer'
import {
  getRazorpayThemeColor,
  loadRazorpayScript,
  type RazorpayHandlerResponse,
} from '@/lib/razorpay'
import { checkoutSchema, phoneSchema, type CheckoutFormData } from '@/lib/checkout-schema'
import { formatPrice } from '@/lib/format'
import type { OrderCreateResponse, ShippingAddress } from '@/types/customer'
import { getEnabledPaymentMethods, getStoreUpiDetails, type Store } from '@/types/store'
import type { StoreTemplateId } from '@/types/store'

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
  previewMode?: boolean
  layout?: StoreTemplateId
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
  previewMode: previewModeProp,
  layout: layoutProp,
}: CheckoutExperienceProps) {
  const router = useRouter()
  const { isPreview } = usePreview()
  const getHref = useStoreHref()
  const layoutFromContext = useStoreTemplate()
  const layout = layoutProp ?? layoutFromContext
  const shellClass =
    layout === 'boutique'
      ? 'checkout-boutique'
      : layout === 'modern'
        ? 'checkout-modern'
        : 'checkout-classic'
  const buttonRound = layout === 'modern' ? 'rounded-md' : 'rounded-full'
  const previewMode = previewModeProp ?? isPreview
  const inputBaseClass =
    'bg-store-bg text-store-text border-store-border placeholder:text-store-muted'
  const orderSummaryClass =
    layout === 'modern'
      ? 'space-y-3 border-0 bg-store-subtle'
      : layout === 'classic'
        ? 'space-y-3 border-b border-store-border pb-4'
        : 'space-y-3 rounded-2xl border border-store-border bg-store-bg p-4 shadow-sm'

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
  const [processingLabel, setProcessingLabel] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [redirecting, setRedirecting] = useState(false)

  const isRazorpay = paymentMethod === 'razorpay'
  const upiDetails = useMemo(() => getStoreUpiDetails(store), [store])
  const [proofUrl, setProofUrl] = useState('')
  const [proofPreview, setProofPreview] = useState('')
  const [proofUploading, setProofUploading] = useState(false)
  const [proofError, setProofError] = useState('')
  const proofInputRef = useRef<HTMLInputElement>(null)

  const isUpi = paymentMethod === 'upi'
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Warm the Razorpay checkout script ahead of time when the store offers it, so
  // the modal can open instantly once the order (and payment session) is created.
  useEffect(() => {
    if (paymentOptions.some((option) => option.key === 'razorpay')) {
      loadRazorpayScript().catch(() => {
        // Ignore preload failures; startRazorpayCheckout retries and surfaces errors.
      })
    }
  }, [paymentOptions])

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
      if (previewMode) {
        setSavedAddresses([])
        setForm({ ...emptyForm, phone_number: cleaned, name: 'Demo Customer' })
        setStep('details')
        return
      }

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
    setProcessingLabel('Creating order…')
    try {
      if (previewMode) {
        finishWithSuccess('DEMO-001')
        return
      }

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

      if (isRazorpay) {
        // Razorpay continues asynchronously via the checkout modal callbacks.
        await startRazorpayCheckout(response)
        return
      }

      finishWithSuccess(response.orderId)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to place your order. Please try again.',
      )
      setLoading(false)
      setProcessingLabel('')
    }
  }

  const finishWithSuccess = (orderId: string) => {
    setRedirecting(true)
    onOrderPlaced?.()
    router.push(getHref(`/order/success?orderId=${encodeURIComponent(orderId)}`))
  }

  const startRazorpayCheckout = async (order: OrderCreateResponse) => {
    if (!order.razorpay || !order.checkoutToken) {
      // The backend returns `data.razorpay` + `data.checkout_token` only when the
      // store has Razorpay configured. If they're missing, the order was still
      // created (pending) but the payment session could not be generated.
  
      throw new Error(
        'Online payment could not be started for this store. Your order is saved as pending — please choose another payment method or contact the store.',
      )
    }

    const Razorpay = await loadRazorpayScript()

    const rzp = new Razorpay({
      key: order.razorpay.keyId,
      amount: order.razorpay.amount,
      currency: order.razorpay.currency,
      order_id: order.razorpay.orderId,
      name: store.name,
      description: order.orderNumber ? `Order ${order.orderNumber}` : 'Order payment',
      image: store.logoUrl,
      prefill: { name: form.name, contact: form.phone_number },
      theme: { color: getRazorpayThemeColor(store.themeConfig) },
      handler: (response) => {
        void confirmRazorpayPayment(order, response)
      },
      modal: {
        ondismiss: () => {
          setLoading(false)
          setProcessingLabel('')
          setSubmitError(
            'Payment was not completed. Your order is saved as pending — you can place the order again to retry payment.',
          )
        },
      },
    })

    rzp.on('payment.failed', () => {
      setLoading(false)
      setProcessingLabel('')
      setSubmitError('Payment failed. Your order is pending — please try again.')
    })

    setProcessingLabel('Waiting for payment…')
    rzp.open()
  }

  const confirmRazorpayPayment = async (
    order: OrderCreateResponse,
    response: RazorpayHandlerResponse,
  ) => {
    setLoading(true)
    setProcessingLabel('Confirming payment…')
    try {
      const result = await verifyRazorpayPayment(store.slug, order.orderId, {
        checkoutToken: order.checkoutToken ?? '',
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      })

      if (!result.success) {
        throw new Error('We could not confirm your payment. Please contact support.')
      }

      finishWithSuccess(order.orderId)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'We could not confirm your payment. Please contact support.',
      )
      setLoading(false)
      setProcessingLabel('')
    }
  }

  const showInlineOrderSummary = layout !== 'boutique' && layout !== 'modern'

  return (
    <>
    <div className={shellClass}>
      {layout === 'modern' ? (
        <p className="checkout-step-label mb-3">
          Step {step === 'phone' ? '1' : '2'} — {step === 'phone' ? 'Verify phone' : 'Delivery & pay'}
        </p>
      ) : null}
    <div className="checkout-panel space-y-8">
      {showInlineOrderSummary ? (
      <div className={orderSummaryClass}>
        {items.map((item) => (
          <div
            key={item.variantId ? `${item.productId}:${item.variantId}` : item.productId}
            className="flex gap-4 border-b border-store-border pb-3 last:border-0 last:pb-0"
          >
            {item.imageUrl ? (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-store-subtle">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="64px" />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-store-text">{item.name}</p>
              {item.variantName ? <p className="text-sm text-store-muted">{item.variantName}</p> : null}
              <p className="mt-1 text-sm text-store-muted">
                Qty {item.quantity} · {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-store-border pt-3 font-bold text-store-text">
          <span>Total</span>
          <span className="text-store-primary">{formatPrice(totalPrice)}</span>
        </div>
      </div>
      ) : null}

      {step === 'phone' ? (
        <form onSubmit={handlePhoneCheck} className="w-full space-y-4">
          <div>
            <h2 className="text-lg font-bold text-store-text">Enter your phone number</h2>
            <p className="mt-1 text-sm text-store-muted">
              We&apos;ll check for saved delivery addresses on your account.
            </p>
          </div>

          <div className="w-full">
            <label htmlFor="phone-check" className="block text-sm font-medium text-store-text">
              Phone Number
            </label>
            <input
              id="phone-check"
              type="tel"
              inputMode="numeric"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={`mt-1 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-store-primary/20 ${inputBaseClass} ${
                phoneError ? 'border-red-400' : 'focus:border-store-primary'
              }`}
              placeholder="10-digit mobile number"
            />
            {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${buttonRound} bg-store-primary py-3 text-sm font-semibold text-white hover:bg-store-primary-hover disabled:opacity-60`}
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-store-text">Delivery details</h2>
              <p className="mt-1 text-sm text-store-muted">Phone: {form.phone_number}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="text-sm font-medium text-store-primary hover:underline"
            >
              Change
            </button>
          </div>

          {savedAddresses.length > 0 ? (
            <button
              type="button"
              onClick={() => setAddressModalOpen(true)}
              className="flex w-full items-center justify-between rounded-xl border border-store-border bg-store-bg px-4 py-3 text-left text-sm transition hover:border-store-primary"
            >
              {selectedAddressIndex !== null && savedAddresses[selectedAddressIndex] ? (
                <span className="min-w-0">
                  <span className="font-semibold text-store-text">
                    {savedAddresses[selectedAddressIndex].name || 'Saved address'}
                  </span>
                  <span className="mt-0.5 block truncate text-store-muted">
                    {summariseAddress(savedAddresses[selectedAddressIndex])}
                  </span>
                </span>
              ) : (
                <span className="font-medium text-store-primary">Choose a saved address</span>
              )}
              <span className="ml-3 shrink-0 text-sm font-medium text-store-primary">Change</span>
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
            <p className="text-sm font-semibold text-store-text">Payment method</p>
            <div className="space-y-2">
              {paymentOptions.map((option) => {
                const isSelected = paymentMethod === option.key
                return (
                  <label
                    key={option.key}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                      isSelected
                        ? 'border-store-primary bg-store-primary-soft'
                        : 'border-store-border bg-store-bg hover:border-store-primary'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={option.key}
                      checked={isSelected}
                      onChange={() => setPaymentMethod(option.key)}
                      className="h-4 w-4 accent-store-primary"
                    />
                    <span className="font-medium text-store-text">{option.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {isRazorpay ? (
            <p className="rounded-xl border border-store-primary/30 bg-store-primary-soft px-4 py-3 text-xs text-store-muted">
              You&apos;ll complete a secure payment of {formatPrice(totalPrice)} via Razorpay after
              placing the order. Your order is confirmed only once payment succeeds.
            </p>
          ) : null}

          {isUpi ? (
            <div className="space-y-3 rounded-xl border border-store-primary/30 bg-store-primary-soft p-4">
              <div>
                <p className="text-sm font-semibold text-store-text">Pay via UPI</p>
                <p className="mt-1 text-xs text-store-muted">
                  Send {formatPrice(totalPrice)} to the UPI ID below, then upload a screenshot of the
                  payment to confirm your order.
                </p>
              </div>

              {upiDetails?.vpa || upiDetails?.qrImageUrl ? (
                <div className="flex items-center gap-4 rounded-lg border border-store-border bg-store-bg p-3">
                  {upiDetails?.qrImageUrl ? (
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-store-subtle">
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
                      <p className="font-semibold text-store-text">{upiDetails.displayName}</p>
                    ) : null}
                    {upiDetails?.vpa ? (
                      <p className="mt-0.5 break-all font-mono text-store-text">{upiDetails.vpa}</p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div>
                <label className="block text-sm font-medium text-store-text">
                  Upload payment screenshot <span className="text-red-500">*</span>
                </label>

                {proofPreview ? (
                  <div className="mt-2 flex items-start gap-3">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-store-border bg-store-bg">
                      {/* Local object URL / remote URL preview — plain img avoids next/image host config. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={proofPreview}
                        alt="Payment proof preview"
                        className="h-full w-full object-cover"
                      />
                      {proofUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-store-bg/70">
                          <span className="text-xs font-medium text-store-text">Uploading…</span>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      {proofUrl && !proofUploading ? (
                        <span className="inline-flex items-center gap-1 font-medium text-store-primary">
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
                        className="text-left font-medium text-store-muted hover:text-red-500 disabled:opacity-50"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => proofInputRef.current?.click()}
                        disabled={proofUploading}
                        className="text-left font-medium text-store-primary hover:underline disabled:opacity-50"
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
                    className="mt-2 flex w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-store-border bg-store-bg px-4 py-6 text-sm text-store-muted transition hover:border-store-primary hover:text-store-primary disabled:opacity-60"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V18a2 2 0 002 2h14a2 2 0 002-2v-1.5M16 8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="font-medium">{proofUploading ? 'Uploading…' : 'Tap to upload screenshot'}</span>
                    <span className="text-xs text-store-muted">PNG, JPG or WebP · up to 5MB</span>
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
            <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={loading || proofUploading}
            className={`w-full ${buttonRound} bg-store-primary py-3.5 text-sm font-semibold text-white hover:bg-store-primary-hover disabled:opacity-60`}
          >
            {loading
              ? processingLabel || 'Placing Order...'
              : proofUploading
                ? 'Uploading proof...'
                : isRazorpay
                  ? 'Pay & Place Order'
                  : 'Place Order'}
          </button>
        </form>
      )}
    </div>
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
          className="flex max-h-[85vh] w-full max-w-md flex-col rounded-t-2xl bg-store-bg shadow-xl sm:rounded-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-store-border px-5 py-4">
            <div>
              <h3 className="text-lg font-bold text-store-text">Choose delivery address</h3>
              <p className="mt-0.5 text-sm text-store-muted">Select a saved address or add a new one.</p>
            </div>
            <button
              type="button"
              onClick={() => setAddressModalOpen(false)}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-store-muted transition hover:bg-store-subtle hover:text-store-text"
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
                      ? 'border-store-primary bg-store-primary-soft'
                      : 'border-store-border bg-store-bg hover:border-store-primary'
                  }`}
                >
                  <span className="font-semibold text-store-text">{address.name || 'Saved address'}</span>
                  <span className="mt-0.5 block text-store-muted">{summariseAddress(address)}</span>
                  {address.phone_number ? (
                    <span className="mt-0.5 block text-xs text-store-muted">{address.phone_number}</span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="border-t border-store-border px-5 py-4">
            <button
              type="button"
              onClick={handleUseNewAddress}
              className="w-full rounded-full border border-dashed border-store-primary px-4 py-3 text-sm font-semibold text-store-primary transition hover:bg-store-primary-soft"
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
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-store-text">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-store-primary/20 bg-store-bg text-store-text border-store-border placeholder:text-store-muted ${
          error ? 'border-red-400' : 'focus:border-store-primary'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
