import { NextResponse } from 'next/server'
import { AishopyApiError, fetchPublicCatalog } from '@/lib/aishopy-api'

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

  try {
    const catalog = await fetchPublicCatalog(storeSlug)
    const product = catalog.products.find((item) => item.slug === slug)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof AishopyApiError) {
      if (error.code === 'STORE_NOT_RESOLVED') {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 502 })
    }

    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 })
  }
}
