'use client'

import { useState } from 'react'
import { waitlistSchema, type WaitlistFormData } from '@/lib/schemas'
import StoreUrlHighlight from '@/components/StoreUrlHighlight'
import { CONTACT_EMAIL } from '@/lib/constants'

type FormErrors = Partial<Record<keyof WaitlistFormData, string>>

const initialForm: WaitlistFormData = {
  name: '',
  email: '',
  storeName: '',
}

export default function WaitlistForm() {
  const [form, setForm] = useState<WaitlistFormData>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (field: keyof WaitlistFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    const result = waitlistSchema.safeParse(form)

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof WaitlistFormData
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        throw new Error(data.error ?? 'Something went wrong')
      }

      setSubmitted(true)
    } catch {
      setSubmitError(`Could not join the waitlist right now. Please try again or email us at ${CONTACT_EMAIL}.`)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="text-3xl">🎉</div>
        <h3 className="mt-3 text-xl font-bold text-brand-dark">You&apos;re on the list!</h3>
        <p className="mt-2 text-gray-600">
          Thanks {form.name}! We&apos;ll reach out at {form.email} when AiShopy is ready for you.
        </p>
        {form.storeName && (
          <div className="mt-4 flex justify-center">
            <StoreUrlHighlight storeName={form.storeName} size="sm" />
          </div>
        )}
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-100 md:p-8"
    >
      <h3 className="text-lg font-bold text-brand-dark">Get Started Free</h3>
      <p className="mt-1 text-sm text-gray-500">Join the waitlist and start selling smarter.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-brand-green/20 ${
              errors.name ? 'border-red-400' : 'border-gray-200 focus:border-brand-green'
            }`}
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-brand-green/20 ${
              errors.email ? 'border-red-400' : 'border-gray-200 focus:border-brand-green'
            }`}
            placeholder="you@business.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
            Store Name <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="storeName"
            type="text"
            value={form.storeName}
            onChange={(e) => handleChange('storeName', e.target.value)}
            className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-brand-green/20 ${
              errors.storeName ? 'border-red-400' : 'border-gray-200 focus:border-brand-green'
            }`}
            placeholder="yourstore"
          />
          <div className="mt-3">
            <p className="mb-1.5 text-xs text-gray-500">Your store will be at:</p>
            <StoreUrlHighlight
              storeName={form.storeName.trim() || 'yourstore'}
              size="sm"
            />
          </div>
          {errors.storeName && <p className="mt-1 text-xs text-red-500">{errors.storeName}</p>}
        </div>
      </div>

      {submitError && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-brand-green py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Joining...' : 'Get Started Free'}
      </button>
    </form>
  )
}
