export interface PaymentMethod {
  enabled: boolean
}

export type StorePaymentMethods = Record<string, PaymentMethod>

export interface Store {
  id: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
  bannerUrl?: string
  paymentMethods?: StorePaymentMethods
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery',
  razorpay: 'Razorpay',
  upi: 'UPI',
}

export function getEnabledPaymentMethods(store: Store): { key: string; label: string }[] {
  if (!store.paymentMethods) return []

  return Object.entries(store.paymentMethods)
    .filter(([, method]) => method.enabled)
    .map(([key]) => ({
      key,
      label: PAYMENT_METHOD_LABELS[key] ?? key.toUpperCase(),
    }))
}
