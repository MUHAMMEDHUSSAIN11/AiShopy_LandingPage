import type { Product, ProductVariant } from '@/types/product'

export function isVariantPurchasable(variant: ProductVariant): boolean {
  if (!variant.isActive || variant.markAsSold) return false
  if (variant.markAsNonInventory) return true
  return variant.stock > 0
}

export function isProductInStock(product: Product): boolean {
  if (product.markAsSold) return false
  if (product.markAsNonInventory) return true

  const activeVariants = product.variants.filter((variant) => variant.isActive)
  if (activeVariants.length > 0) {
    return activeVariants.some(isVariantPurchasable)
  }

  if (!product.trackInventory) return true
  return product.stock > 0
}

export function getProductStockLabel(product: Product, variant?: ProductVariant | null): string {
  if (variant) {
    if (variant.markAsSold || (!variant.markAsNonInventory && variant.stock <= 0)) {
      return 'Out of stock'
    }
    if (variant.markAsNonInventory) return 'In stock'
    return `${variant.stock} in stock`
  }

  if (!isProductInStock(product)) return 'Out of stock'
  if (product.markAsNonInventory || !product.trackInventory) return 'In stock'
  if (product.variants.length > 0) return 'Select options'
  return `${product.stock} in stock`
}

export function getDisplayPrice(product: Product, variant?: ProductVariant | null): number {
  return variant?.price ?? product.price
}

export function getCompareAtPrice(product: Product, variant?: ProductVariant | null): number | undefined {
  const compareAt = variant?.compareAtPrice ?? product.compareAtPrice
  if (!compareAt || compareAt <= 0) return undefined
  const price = getDisplayPrice(product, variant)
  return compareAt > price ? compareAt : undefined
}

export function getCardPriceLabel(product: Product): { price: number; prefix?: string } {
  const purchasableVariants = product.variants.filter(isVariantPurchasable)
  if (purchasableVariants.length === 0) {
    return { price: product.price }
  }

  const lowest = Math.min(...purchasableVariants.map((variant) => variant.price))
  return { price: lowest, prefix: 'From' }
}

export function findVariantById(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants.find((variant) => variant.id === variantId)
}

export function getVariantOptionGroups(
  variants: ProductVariant[],
): { key: string; values: string[] }[] {
  const groups = new Map<string, Set<string>>()

  for (const variant of variants) {
    for (const [key, value] of Object.entries(variant.options)) {
      if (!groups.has(key)) groups.set(key, new Set())
      groups.get(key)!.add(value)
    }
  }

  return [...groups.entries()].map(([key, values]) => ({
    key,
    values: [...values],
  }))
}

export function findVariantByOptions(
  variants: ProductVariant[],
  selected: Record<string, string>,
): ProductVariant | undefined {
  return variants.find((variant) =>
    Object.entries(selected).every(([key, value]) => variant.options[key] === value),
  )
}

export function getDefaultVariant(product: Product): ProductVariant | undefined {
  return product.variants.find(isVariantPurchasable) ?? product.variants[0]
}

export function getProductImages(product: Product, variant?: ProductVariant | null): string[] {
  if (variant?.imageUrl) {
    return [variant.imageUrl, ...product.imageUrls.filter((url) => url !== variant.imageUrl)]
  }
  return product.imageUrls
}
