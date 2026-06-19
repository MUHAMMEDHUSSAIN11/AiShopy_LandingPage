import { cache } from 'react'
import { AishopyApiError, fetchPublicStore } from '@/lib/aishopy-api'
import type { Store } from '@/types/store'

export class StoreNotFoundError extends Error {
  constructor(slug: string) {
    super(`Store not found: ${slug}`)
    this.name = 'StoreNotFoundError'
  }
}

/**
 * Resolves the store for a tenant from the dedicated `/api/public/store`
 * endpoint. Wrapped in React `cache()` so the layout and every page/component
 * in the same server request share a single fetch instead of re-fetching.
 */
export const getStoreBySlug = cache(async (slug: string): Promise<Store> => {
  try {
    return await fetchPublicStore(slug)
  } catch (error) {
    if (error instanceof AishopyApiError && error.code === 'STORE_NOT_RESOLVED') {
      throw new StoreNotFoundError(slug)
    }
    if (error instanceof Error && error.message.includes('Store not found')) {
      throw new StoreNotFoundError(slug)
    }
    throw error
  }
})
