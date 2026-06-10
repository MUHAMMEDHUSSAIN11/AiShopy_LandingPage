import type {
  CartOrderItem,
  CustomerCheckResponse,
  CustomerDetails,
  OrderCreateResponse,
} from '@/types/customer'

export async function checkCustomer(phone: string): Promise<CustomerCheckResponse> {
  const response = await fetch('/api/customer/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  })

  if (!response.ok) {
    throw new Error('Failed to verify customer. Please try again.')
  }

  return response.json() as Promise<CustomerCheckResponse>
}

export async function createOrder(
  storeSlug: string,
  productId: string,
  customer: CustomerDetails,
): Promise<OrderCreateResponse> {
  const response = await fetch('/api/order/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeSlug, productId, customer }),
  })

  if (!response.ok) {
    throw new Error('Failed to place order. Please try again.')
  }

  return response.json() as Promise<OrderCreateResponse>
}

export async function createCartOrder(
  storeSlug: string,
  payload: { items: CartOrderItem[]; customer: CustomerDetails },
): Promise<OrderCreateResponse> {
  const response = await fetch('/api/order/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeSlug, items: payload.items, customer: payload.customer }),
  })

  if (!response.ok) {
    throw new Error('Failed to place order. Please try again.')
  }

  return response.json() as Promise<OrderCreateResponse>
}
