import type {
  CartOrderItem,
  CustomerByPhoneResponse,
  OrderCreateResponse,
  ShippingAddress,
} from '@/types/customer'

const PUBLIC_API_BASE = (
  process.env.NEXT_PUBLIC_AISHOPY_API_URL ?? 'https://aishopy.up.railway.app'
).replace(/\/$/, '')

type ApiErrorShape = { error?: { message?: string; code?: string } | string }

function readErrorMessage(body: unknown, fallback: string): string {
  const err = (body as ApiErrorShape | null)?.error
  if (typeof err === 'string') return err
  return err?.message ?? fallback
}

function normaliseAddress(raw: unknown): ShippingAddress {
  const value = (raw ?? {}) as Record<string, unknown>
  const str = (key: string) => (typeof value[key] === 'string' ? (value[key] as string) : '')
  return {
    name: str('name'),
    phone_number: str('phone_number'),
    address: str('address'),
    city: str('city'),
    district: str('district'),
    state: str('state'),
    postcode: str('postcode'),
  }
}

export async function lookupCustomerByPhone(
  storeSlug: string,
  phoneNumber: string,
): Promise<CustomerByPhoneResponse> {
  const url = new URL(`${PUBLIC_API_BASE}/api/public/customers/by-phone`)
  url.searchParams.set('phone_number', phoneNumber)

  let response: Response
  try {
    response = await fetch(url.toString(), {
      headers: { 'X-Store-Slug': storeSlug },
    })
  } catch {
    // Network/CORS failure — never block checkout, fall back to manual entry.
    return { exists: false, addresses: [] }
  }

  if (response.status === 404) {
    return { exists: false, addresses: [] }
  }

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null

  if (!response.ok || (body && 'error' in body)) {
    // Treat any lookup failure as "no saved customer" so the form still works.
    return { exists: false, addresses: [] }
  }

  const data = ((body?.data as Record<string, unknown>) ?? body ?? {}) as Record<string, unknown>
  const customer = (data.customer as Record<string, unknown>) ?? data

  const rawAddresses: unknown[] = [
    ...((data.addresses as unknown[]) ?? []),
    ...((customer?.addresses as unknown[]) ?? []),
    ...(customer?.shipping_address ? [customer.shipping_address] : []),
  ]

  const addresses = rawAddresses
    .map(normaliseAddress)
    .filter((address) => address.address.trim().length > 0)

  const name = typeof customer?.name === 'string' ? (customer.name as string) : undefined

  return {
    exists: Boolean(customer && Object.keys(customer).length > 0) || addresses.length > 0,
    addresses,
    name,
  }
}

export async function createCartOrder(
  storeSlug: string,
  payload: {
    items: CartOrderItem[]
    shippingAddress: ShippingAddress
    paymentMethod: string
    notes?: string
  },
): Promise<OrderCreateResponse> {
  const response = await fetch(`${PUBLIC_API_BASE}/api/public/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Store-Slug': storeSlug,
    },
    body: JSON.stringify({
      items: payload.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        variant_id: item.variantId,
      })),
      payment_method: payload.paymentMethod,
      shipping_address: payload.shippingAddress,
      notes: payload.notes ?? '',
    }),
  })

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null

  if (!response.ok || (body && 'error' in body)) {
    throw new Error(readErrorMessage(body, 'Failed to place order. Please try again.'))
  }

  const data = ((body?.data as Record<string, unknown>) ?? body ?? {}) as Record<string, unknown>
  const orderId =
    data.order_id ?? data.id ?? data.order_number ?? body?.order_id ?? body?.orderId ?? ''

  if (!orderId) {
    throw new Error('Order created but no order ID returned')
  }

  return { success: true, orderId: String(orderId) }
}
