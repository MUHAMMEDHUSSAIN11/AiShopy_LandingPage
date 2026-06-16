import type {
  CartOrderItem,
  CustomerByPhoneResponse,
  OrderCreateResponse,
  ShippingAddress,
} from '@/types/customer'

export async function lookupCustomerByPhone(
  storeSlug: string,
  phoneNumber: string,
): Promise<CustomerByPhoneResponse> {
  const response = await fetch('/api/customer/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeSlug, phone_number: phoneNumber }),
  })

  if (!response.ok) {
    throw new Error('Failed to verify customer. Please try again.')
  }

  return response.json() as Promise<CustomerByPhoneResponse>
}

export async function createCartOrder(
  storeSlug: string,
  payload: {
    items: CartOrderItem[]
    shippingAddress: ShippingAddress
    paymentMethod: string
  },
): Promise<OrderCreateResponse> {
  const response = await fetch('/api/order/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeSlug, ...payload }),
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(data?.error ?? 'Failed to place order. Please try again.')
  }

  return response.json() as Promise<OrderCreateResponse>
}
