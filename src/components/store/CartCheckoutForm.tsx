'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { checkCustomer, createCartOrder } from '@/lib/customer'
import { checkoutSchema, phoneSchema, type CheckoutFormData } from '@/lib/checkout-schema'
import { formatPrice } from '@/lib/format'
import { useCartStore } from '@/stores/cart-store'
import type { Store } from '@/types/store'

type CartCheckoutFormProps = {
  store: Store
}

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>

const emptyForm: CheckoutFormData = {
  name: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
}

export default function CartCheckoutForm({ store }: CartCheckoutFormProps) {
  const items = useCartStore((state) => state.items)
  const totalPrice = useCartStore((state) => state.totalPrice())
  const clearCart = useCartStore((state) => state.clearCart)

  const [step, setStep] = useState<'phone' | 'details' | 'success'>('phone')
  const [phoneInput, setPhoneInput] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [form, setForm] = useState<CheckoutFormData>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [orderId, setOrderId] = useState('')

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
        <p className="text-lg font-medium text-gray-700">Your cart is empty</p>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  const handlePhoneCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setPhoneError('')
    setLoading(true)

    const cleaned = phoneInput.replace(/\D/g, '')
    const result = phoneSchema.safeParse({ phone: cleaned })

    if (!result.success) {
      setPhoneError(result.error.errors[0]?.message ?? 'Invalid phone number')
      setLoading(false)
      return
    }

    try {
      const response = await checkCustomer(cleaned)
      const customer = response.customer
      setForm({
        ...emptyForm,
        phone: cleaned,
        name: response.exists && customer?.name ? customer.name : '',
        addressLine1: customer?.addressLine1 ?? '',
        addressLine2: customer?.addressLine2 ?? '',
        city: customer?.city ?? '',
        state: customer?.state ?? '',
        pincode: customer?.pincode ?? '',
      })
      setStep('details')
    } catch {
      setPhoneError('Could not verify phone number. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    const result = checkoutSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof CheckoutFormData
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message
        }
      })
      setErrors(fieldErrors)
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
        customer: {
          ...result.data,
          addressLine2: result.data.addressLine2 || undefined,
        },
      })
      setOrderId(response.orderId)
      clearCart()
      setStep('success')
    } catch {
      setSubmitError('Failed to place your order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="text-4xl">✓</div>
        <h2 className="mt-4 text-2xl font-bold text-brand-dark">Order Request Placed!</h2>
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
          <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
            {item.imageUrl ? (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="64px" />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-brand-dark">{item.name}</p>
              {item.variantName ? (
                <p className="text-sm text-gray-500">{item.variantName}</p>
              ) : null}
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
              We&apos;ll check if you&apos;re a returning customer.
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-brand-dark">Delivery details</h2>
              <p className="mt-1 text-sm text-gray-500">Phone: {form.phone}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="text-sm font-medium text-brand-green hover:underline"
            >
              Change
            </button>
          </div>

          <CheckoutField
            id="name"
            label="Full Name"
            value={form.name}
            error={errors.name}
            onChange={(v) => handleChange('name', v)}
          />
          <CheckoutField
            id="addressLine1"
            label="Address Line 1"
            value={form.addressLine1}
            error={errors.addressLine1}
            onChange={(v) => handleChange('addressLine1', v)}
          />
          <CheckoutField
            id="addressLine2"
            label="Address Line 2 (optional)"
            value={form.addressLine2 ?? ''}
            error={errors.addressLine2}
            onChange={(v) => handleChange('addressLine2', v)}
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
              id="state"
              label="State"
              value={form.state}
              error={errors.state}
              onChange={(v) => handleChange('state', v)}
            />
          </div>
          <CheckoutField
            id="pincode"
            label="Pincode"
            value={form.pincode}
            error={errors.pincode}
            onChange={(v) => handleChange('pincode', v.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
          />

          {submitError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-green py-3.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? 'Placing Order...' : 'Place Order Request'}
          </button>

          <p className="text-center text-xs text-gray-400">
            No payment required now. The store will confirm your order.
          </p>
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
