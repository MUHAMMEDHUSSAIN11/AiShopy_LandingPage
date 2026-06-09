import { getApiBaseUrl } from '@/lib/server-api'
import type { Catalog, CatalogQueryParams } from '@/types/catalog'

export async function getCatalog(
  storeSlug: string,
  params: CatalogQueryParams = {},
): Promise<Catalog> {
  const baseUrl = await getApiBaseUrl()
  const searchParams = new URLSearchParams({ storeSlug })

  if (params.categoryId) searchParams.set('category_id', params.categoryId)
  if (params.productId) searchParams.set('product_id', params.productId)
  if (params.sort) searchParams.set('sort', params.sort)
  if (params.minPrice !== undefined) searchParams.set('min_price', String(params.minPrice))
  if (params.maxPrice !== undefined) searchParams.set('max_price', String(params.maxPrice))

  const response = await fetch(`${baseUrl}/api/catalog?${searchParams.toString()}`, {
    cache: 'no-store',
  })

  if (response.status === 404) {
    throw new Error('Store not found')
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(payload?.error ?? 'Failed to load catalog. Please try again.')
  }

  return response.json() as Promise<Catalog>
}
