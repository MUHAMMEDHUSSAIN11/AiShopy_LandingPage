import { cache } from 'react'
import { fetchPublicStore } from '@/lib/aishopy-api'
import { getCatalog } from '@/lib/catalog'
import type { Store } from '@/types/store'

export class StoreNotFoundError extends Error {
  constructor(slug: string) {
    super(`Store not found: ${slug}`)
    this.name = 'StoreNotFoundError'
  }
}

/**
 * Resolves the store for a tenant. Prefers the dedicated `/api/public/store`
 * endpoint, but falls back to the catalog-derived store if that endpoint is
 * unavailable or returns an unexpected shape, so storefront pages never break.
 * Wrapped in React `cache()` so all server components in one request share a
 * single resolution instead of re-fetching.
 */
export const getStoreBySlug = cache(async (slug: string): Promise<Store> => {
  try {
    return await fetchPublicStore(slug)
  } catch {
    // Fall through to the proven catalog-derived store below.
  }

  try {
    const catalog = await getCatalog(slug)
    return catalog.store
  } catch (error) {
    if (error instanceof Error && error.message.includes('Store not found')) {
      throw new StoreNotFoundError(slug)
    }
    throw error
  }
})
