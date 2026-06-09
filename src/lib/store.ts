import { getCatalog } from '@/lib/catalog'
import type { Store } from '@/types/store'

export class StoreNotFoundError extends Error {
  constructor(slug: string) {
    super(`Store not found: ${slug}`)
    this.name = 'StoreNotFoundError'
  }
}

export async function getStoreBySlug(slug: string): Promise<Store> {
  try {
    const catalog = await getCatalog(slug)
    return catalog.store
  } catch (error) {
    if (error instanceof Error && error.message.includes('Store not found')) {
      throw new StoreNotFoundError(slug)
    }
    throw error
  }
}
