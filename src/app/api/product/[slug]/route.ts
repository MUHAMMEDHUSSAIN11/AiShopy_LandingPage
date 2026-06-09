import { NextResponse } from 'next/server'
import { findProductBySlug } from '@/lib/mock-data'

type RouteContext = {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params
  const { searchParams } = new URL(request.url)
  const storeSlug = searchParams.get('storeSlug')

  if (!storeSlug) {
    return NextResponse.json({ error: 'storeSlug is required' }, { status: 400 })
  }

  const product = findProductBySlug(storeSlug, slug)

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json(product)
}
