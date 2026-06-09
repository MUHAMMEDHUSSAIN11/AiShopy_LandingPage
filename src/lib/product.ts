import { getApiBaseUrl } from '@/lib/server-api'
import type { Product } from '@/types/product'

export class ProductNotFoundError extends Error {
  constructor(slug: string) {
    super(`Product not found: ${slug}`)
    this.name = 'ProductNotFoundError'
  }
}

export async function getProducts(storeSlug: string): Promise<Product[]> {
  const baseUrl = await getApiBaseUrl()
  const params = new URLSearchParams({ storeSlug })
  const response = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to load products. Please try again.')
  }

  return response.json() as Promise<Product[]>
}

export async function getProduct(storeSlug: string, productSlug: string): Promise<Product> {
  const baseUrl = await getApiBaseUrl()
  const params = new URLSearchParams({ storeSlug })
  const response = await fetch(
    `${baseUrl}/api/product/${productSlug}?${params.toString()}`,
    { cache: 'no-store' },
  )

  if (response.status === 404) {
    throw new ProductNotFoundError(productSlug)
  }

  if (!response.ok) {
    throw new Error('Failed to load product. Please try again.')
  }

  return response.json() as Promise<Product>
}

export async function getProductById(productId: string): Promise<Product | null> {
  const baseUrl = await getApiBaseUrl()
  const response = await fetch(`${baseUrl}/api/products?id=${productId}`, {
    cache: 'no-store',
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to load product. Please try again.')
  }

  const products = (await response.json()) as Product[]
  return products[0] ?? null
}
