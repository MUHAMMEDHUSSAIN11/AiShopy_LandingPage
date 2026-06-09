import { NextResponse } from 'next/server'
import { findProductById, findProductsByStoreSlug } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('id')
  const storeSlug = searchParams.get('storeSlug')

  if (productId) {
    const product = findProductById(productId)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json([product])
  }

  if (!storeSlug) {
    return NextResponse.json({ error: 'storeSlug is required' }, { status: 400 })
  }

  const products = findProductsByStoreSlug(storeSlug)
  return NextResponse.json(products)
}
