import { getApiBaseUrl } from '@/lib/server-api'
import type { Store } from '@/types/store'

export class StoreNotFoundError extends Error {
  constructor(slug: string) {
    super(`Store not found: ${slug}`)
    this.name = 'StoreNotFoundError'
  }
}

export async function getStoreBySlug(slug: string): Promise<Store> {
  const baseUrl = await getApiBaseUrl()
  const response = await fetch(`${baseUrl}/api/store/${slug}`, {
    cache: 'no-store',
  })

  if (response.status === 404) {
    throw new StoreNotFoundError(slug)
  }

  if (!response.ok) {
    throw new Error('Failed to load store. Please try again.')
  }

  return response.json() as Promise<Store>
}
