import { getCatalog } from '@/lib/catalog'
import type { Product } from '@/types/product'

export class ProductNotFoundError extends Error {
  constructor(slug: string) {
    super(`Product not found: ${slug}`)
    this.name = 'ProductNotFoundError'
  }
}

export async function getProducts(
  storeSlug: string,
  categoryId?: string,
): Promise<Product[]> {
  const catalog = await getCatalog(storeSlug, { categoryId })
  return catalog.products
}

export async function getProduct(storeSlug: string, productSlug: string): Promise<Product> {
  const catalog = await getCatalog(storeSlug)
  const product = catalog.products.find((item) => item.slug === productSlug)

  if (!product) {
    throw new ProductNotFoundError(productSlug)
  }

  return product
}

export async function getProductById(
  storeSlug: string,
  productId: string,
): Promise<Product | null> {
  const catalog = await getCatalog(storeSlug, { productId })
  return catalog.products[0] ?? null
}
