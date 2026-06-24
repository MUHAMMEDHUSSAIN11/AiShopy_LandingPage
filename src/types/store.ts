export interface PaymentMethod {
  enabled: boolean
  // UPI-only metadata (where the customer should send the payment).
  vpa?: string
  displayName?: string
  qrImageUrl?: string
}

export type StorePaymentMethods = Record<string, PaymentMethod>

export interface StoreUpiDetails {
  vpa?: string
  displayName?: string
  qrImageUrl?: string
}

export function getStoreUpiDetails(store: Store): StoreUpiDetails | null {
  const upi = store.paymentMethods?.upi
  if (!upi || !upi.enabled) return null
  return {
    vpa: upi.vpa,
    displayName: upi.displayName,
    qrImageUrl: upi.qrImageUrl,
  }
}

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
