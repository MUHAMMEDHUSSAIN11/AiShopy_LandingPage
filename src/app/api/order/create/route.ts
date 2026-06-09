import { NextResponse } from 'next/server'
import { findProductById, findStoreBySlug } from '@/lib/mock-data'
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

    const store = findStoreBySlug(body.storeSlug)
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const product = findProductById(body.productId)
    if (!product || product.storeId !== store.id) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (!isValidCustomer(body.customer)) {
      return NextResponse.json({ error: 'Invalid customer details' }, { status: 400 })
    }

    // TODO: Persist order to production database and notify merchant app.
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
