'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createCartOrder, lookupCustomerByPhone } from '@/lib/customer'
import { checkoutSchema, phoneSchema, type CheckoutFormData } from '@/lib/checkout-schema'
import { formatPrice } from '@/lib/format'
import type { ShippingAddress } from '@/types/customer'
import { getEnabledPaymentMethods, type Store } from '@/types/store'

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
type Step = 'phone' | 'details' | 'success'

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
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]?.key ?? '')
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [orderId, setOrderId] = useState('')

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0 && step !== 'success') {
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

      if (response.addresses.length > 0) {
        setSelectedAddressIndex(0)
        setForm(addressToForm(response.addresses[0], cleaned))
      } else {
        setSelectedAddressIndex(null)
        setForm({ ...emptyForm, phone_number: cleaned, name: response.name ?? '' })
      }

      setStep('details')
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
  }

  const handleUseNewAddress = () => {
    setSelectedAddressIndex(null)
    setForm({ ...emptyForm, phone_number: form.phone_number })
    setErrors({})
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
      })
      setOrderId(response.orderId)
      onOrderPlaced?.()
      setStep('success')
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to place your order. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="text-4xl">✓</div>
        <h2 className="mt-4 text-2xl font-bold text-brand-dark">Order Placed!</h2>
        <p className="mt-2 text-gray-600">
          Your order <span className="font-semibold">{orderId}</span> has been submitted to{' '}
          {store.name}. They will contact you shortly.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
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
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Saved addresses</p>
              <div className="space-y-2">
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
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={handleUseNewAddress}
                  className={`w-full rounded-xl border border-dashed px-4 py-3 text-left text-sm font-medium transition ${
                    selectedAddressIndex === null
                      ? 'border-brand-green text-brand-green'
                      : 'border-gray-300 text-gray-600 hover:border-brand-green hover:text-brand-green'
                  }`}
                >
                  + Enter a new address
                </button>
              </div>
            </div>
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

          {submitError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-green py-3.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      )}
    </div>
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
