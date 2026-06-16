import { NextResponse } from 'next/server'
import { AishopyApiError, createPublicOrder, fetchPublicCatalog } from '@/lib/aishopy-api'
import { checkoutSchema } from '@/lib/checkout-schema'
import type { Product, ProductVariant } from '@/types/product'
import { getEnabledPaymentMethods } from '@/types/store'
import type { CartOrderItem, OrderCreateResponse, ShippingAddress } from '@/types/customer'

type OrderBody = {
  storeSlug?: string
  items?: CartOrderItem[]
  shippingAddress?: ShippingAddress
  paymentMethod?: string
}

function variantHasStock(variant: ProductVariant, quantity: number): boolean {
  if (variant.markAsSold) return false
  if (variant.markAsNonInventory) return true
  return variant.stock >= quantity
}

function productHasStock(product: Product, quantity: number): boolean {
  if (product.markAsSold) return false
  if (product.markAsNonInventory || !product.trackInventory) return true
  return product.stock >= quantity
}

export async function POST(request: Request) {
  let body: OrderBody
  try {
    body = (await request.json()) as OrderBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { storeSlug, items, shippingAddress, paymentMethod } = body

  if (!storeSlug || !items?.length || !shippingAddress || !paymentMethod) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const addressResult = checkoutSchema.safeParse(shippingAddress)
  if (!addressResult.success) {
    return NextResponse.json({ error: 'Invalid shipping address' }, { status: 400 })
  }

  let catalog
  try {
    catalog = await fetchPublicCatalog(storeSlug)
  } catch (error) {
    if (error instanceof AishopyApiError && error.code === 'STORE_NOT_RESOLVED') {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }
    throw error
  }

  const enabledMethods = getEnabledPaymentMethods(catalog.store).map((method) => method.key)
  if (enabledMethods.length > 0 && !enabledMethods.includes(paymentMethod)) {
    return NextResponse.json(
      { error: 'Selected payment method is not available' },
      { status: 400 },
    )
  }

  for (const item of items) {
    const quantity = Math.max(1, Math.floor(item.quantity))
    const product = catalog.products.find((entry) => entry.id === item.productId)

    if (!product || product.storeId !== catalog.store.id) {
      return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 })
    }

    if (item.variantId) {
      const variant = product.variants.find((entry) => entry.id === item.variantId)
      if (!variant) {
        return NextResponse.json(
          { error: `Variant not found: ${item.variantId}` },
          { status: 404 },
        )
      }
      if (!variantHasStock(variant, quantity)) {
        return NextResponse.json(
          { error: `${product.name} is no longer available in the requested quantity` },
          { status: 409 },
        )
      }
    } else if (!productHasStock(product, quantity)) {
      return NextResponse.json(
        { error: `${product.name} is no longer available in the requested quantity` },
        { status: 409 },
      )
    }
  }

  try {
    const order = await createPublicOrder(storeSlug, {
      shippingAddress: addressResult.data,
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: Math.max(1, Math.floor(item.quantity)),
      })),
      paymentMethod,
    })

    const response: OrderCreateResponse = { success: true, orderId: order.orderId }
    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof AishopyApiError) {
      return NextResponse.json({ error: error.message }, { status: 502 })
    }
    throw error
  }
}
