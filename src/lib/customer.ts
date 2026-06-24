import type {
  CartOrderItem,
  CustomerByPhoneResponse,
  OrderCreateResponse,
  OrderRazorpayDetails,
  RazorpayVerifyResult,
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
  url.searchParams.set('phone', phoneNumber)

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
    ...((customer?.shipping_addresses as unknown[]) ?? []),
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

export async function uploadPaymentProof(storeSlug: string, file: File): Promise<string> {
  const formData = new FormData()
  formData.append('image', file)

  let response: Response
  try {
    response = await fetch(`${PUBLIC_API_BASE}/api/public/uploads/payment-proof`, {
      method: 'POST',
      headers: { 'X-Store-Slug': storeSlug },
      body: formData,
    })
  } catch {
    throw new Error('Could not upload the image. Please check your connection and try again.')
  }

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null

  if (!response.ok || (body && 'error' in body)) {
    throw new Error(readErrorMessage(body, 'Failed to upload payment proof. Please try again.'))
  }

  const data = ((body?.data as Record<string, unknown>) ?? body ?? {}) as Record<string, unknown>
  const url = typeof data.url === 'string' ? data.url : undefined

  if (!url) {
    throw new Error('Upload succeeded but no image URL was returned.')
  }

  return url
}

export async function createCartOrder(
  storeSlug: string,
  payload: {
    items: CartOrderItem[]
    shippingAddress: ShippingAddress
    paymentMethod: string
    paymentProofUrl?: string
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
      ...(payload.paymentProofUrl ? { payment_proof_url: payload.paymentProofUrl } : {}),
      shipping_address: payload.shippingAddress,
      notes: payload.notes ?? '',
    }),
  })

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null

  if (!response.ok || (body && 'error' in body)) {
    throw new Error(readErrorMessage(body, 'Failed to place order. Please try again.'))
  }

  const data = ((body?.data as Record<string, unknown>) ?? body ?? {}) as Record<string, unknown>
  const order = (data.order as Record<string, unknown> | undefined) ?? {}

  // The id can live at data.order.id (current API), or various flatter shapes.
  // IDs may be integers or strings — accept either and normalise to a string.
  // Guard explicitly so a numeric id of 0 isn't dropped.
  const orderId =
    order.id ??
    order.order_number ??
    data.order_id ??
    data.id ??
    data.order_number ??
    order.checkout_token ??
    data.checkout_token ??
    body?.order_id ??
    body?.orderId

  if (orderId === undefined || orderId === null || orderId === '') {
    throw new Error('Order created but no order ID returned')
  }

  const orderNumber =
    typeof order.order_number === 'string' ? (order.order_number as string) : undefined

  const checkoutToken =
    (typeof data.checkout_token === 'string' ? (data.checkout_token as string) : undefined) ??
    (typeof order.checkout_token === 'string' ? (order.checkout_token as string) : undefined)

  let razorpay: OrderRazorpayDetails | undefined
  const rz = data.razorpay as Record<string, unknown> | undefined
  if (rz && typeof rz.key_id === 'string' && typeof rz.order_id === 'string') {
    razorpay = {
      keyId: rz.key_id,
      orderId: rz.order_id,
      amount: Number(rz.amount) || 0,
      currency: typeof rz.currency === 'string' ? rz.currency : 'INR',
    }
  }

  return { success: true, orderId: String(orderId), orderNumber, checkoutToken, razorpay }
}

export async function verifyRazorpayPayment(
  storeSlug: string,
  orderId: string,
  payload: {
    checkoutToken: string
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
  },
): Promise<RazorpayVerifyResult> {
  const response = await fetch(
    `${PUBLIC_API_BASE}/api/public/orders/${encodeURIComponent(orderId)}/verify-payment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Store-Slug': storeSlug,
      },
      body: JSON.stringify({
        checkout_token: payload.checkoutToken,
        razorpay_order_id: payload.razorpayOrderId,
        razorpay_payment_id: payload.razorpayPaymentId,
        razorpay_signature: payload.razorpaySignature,
      }),
    },
  )

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null

  if (!response.ok || (body && 'error' in body)) {
    throw new Error(readErrorMessage(body, 'Payment verification failed. Please contact support.'))
  }

  const data = ((body?.data as Record<string, unknown>) ?? body ?? {}) as Record<string, unknown>
  const paymentStatus = typeof data.payment_status === 'string' ? data.payment_status : undefined

  return {
    success: paymentStatus ? paymentStatus === 'paid' : true,
    paymentStatus,
    orderStatus: typeof data.order_status === 'string' ? data.order_status : undefined,
    orderNumber: typeof data.order_number === 'string' ? data.order_number : undefined,
  }
}
