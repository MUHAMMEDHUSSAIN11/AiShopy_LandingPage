import { NextResponse } from 'next/server'
import { AishopyApiError, fetchPublicCatalog } from '@/lib/aishopy-api'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const storeSlug = searchParams.get('storeSlug')
  const productId = searchParams.get('id')
  const categoryId = searchParams.get('category_id') ?? undefined

  if (!storeSlug) {
    return NextResponse.json({ error: 'storeSlug is required' }, { status: 400 })
  }

  try {
    const catalog = await fetchPublicCatalog(storeSlug, {
      categoryId,
      productId: productId ?? undefined,
    })

    if (productId) {
      const product = catalog.products[0]
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      return NextResponse.json([product])
    }

    return NextResponse.json(catalog.products)
  } catch (error) {
    if (error instanceof AishopyApiError) {
      if (error.code === 'STORE_NOT_RESOLVED') {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 502 })
    }

    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}
