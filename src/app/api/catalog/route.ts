import { NextResponse } from 'next/server'
import { AishopyApiError, fetchPublicCatalog } from '@/lib/aishopy-api'
import type { CatalogQueryParams } from '@/types/catalog'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const storeSlug = searchParams.get('storeSlug')

  if (!storeSlug) {
    return NextResponse.json({ error: 'storeSlug is required' }, { status: 400 })
  }

  const params: CatalogQueryParams = {
    categoryId: searchParams.get('category_id') ?? undefined,
    productId: searchParams.get('product_id') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
    minPrice: searchParams.has('min_price')
      ? Number(searchParams.get('min_price'))
      : undefined,
    maxPrice: searchParams.has('max_price')
      ? Number(searchParams.get('max_price'))
      : undefined,
  }

  try {
    const catalog = await fetchPublicCatalog(storeSlug, params)
    return NextResponse.json(catalog)
  } catch (error) {
    if (error instanceof AishopyApiError) {
      const isStoreNotFound =
        error.code === 'STORE_NOT_RESOLVED' ||
        error.message.toLowerCase().includes('store not found') ||
        error.message.toLowerCase().includes('could not resolve store')

      if (isStoreNotFound) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 })
      }

      return NextResponse.json({ error: error.message }, { status: 502 })
    }

    return NextResponse.json({ error: 'Failed to load catalog' }, { status: 500 })
  }
}
