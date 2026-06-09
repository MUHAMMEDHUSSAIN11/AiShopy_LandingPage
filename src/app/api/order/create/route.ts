import { NextResponse } from 'next/server'
import { AishopyApiError, fetchPublicCatalog } from '@/lib/aishopy-api'
import type { CustomerDetails, OrderCreateRequest, OrderCreateResponse } from '@/types/customer'

function isValidCustomer(customer: CustomerDetails): boolean {
  return (
    customer.name.trim().length >= 2 &&
    customer.phone.replace(/\D/g, '').length >= 10 &&
    customer.addressLine1.trim().length >= 3 &&
    customer.city.trim().length >= 2 &&
    customer.state.trim().length >= 2 &&
    customer.pincode.replace(/\D/g, '').length === 6
  )
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderCreateRequest

    if (!body.storeSlug || !body.productId || !body.customer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let catalog
    try {
      catalog = await fetchPublicCatalog(body.storeSlug, { productId: body.productId })
    } catch (error) {
      if (error instanceof AishopyApiError && error.code === 'STORE_NOT_RESOLVED') {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 })
      }
      throw error
    }

    const product = catalog.products[0]
    if (!product || product.storeId !== catalog.store.id) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (!isValidCustomer(body.customer)) {
      return NextResponse.json({ error: 'Invalid customer details' }, { status: 400 })
    }

    // TODO: Persist order to production API when available.
    const orderId = `ORD${Date.now().toString(36).toUpperCase()}`

    const response: OrderCreateResponse = {
      success: true,
      orderId,
    }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
