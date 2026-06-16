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

export function isProductSoldOut(product: Product, variant?: ProductVariant | null): boolean {
  if (variant) return variant.markAsSold
  return product.markAsSold
}

export function getProductStockLabel(product: Product, variant?: ProductVariant | null): string {
  if (variant) {
    if (variant.markAsSold) return 'Sold Out'
    if (!variant.markAsNonInventory && variant.stock <= 0) return 'Out of stock'
    return 'Available'
  }

  if (product.markAsSold) return 'Sold Out'
  if (!isProductInStock(product)) return 'Out of stock'
  return 'Available'
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

export function getCardPriceLabel(product: Product): {
  price: number
  prefix?: string
  compareAtPrice?: number
} {
  const purchasableVariants = product.variants.filter(isVariantPurchasable)
  if (purchasableVariants.length === 0) {
    return {
      price: product.price,
      compareAtPrice: getCompareAtPrice(product),
    }
  }

  const lowest = Math.min(...purchasableVariants.map((variant) => variant.price))
  const lowestVariant = purchasableVariants.find((variant) => variant.price === lowest)
  return {
    price: lowest,
    prefix: 'From',
    compareAtPrice: getCompareAtPrice(product, lowestVariant),
  }
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

export function resolveVariantForSelection(
  variants: ProductVariant[],
  current: Record<string, string>,
  changedKey: string,
  changedValue: string,
): { options: Record<string, string>; variant: ProductVariant | null } {
  const withChange = { ...current, [changedKey]: changedValue }
  const exact = findVariantByOptions(variants, withChange)
  if (exact) {
    return { options: { ...exact.options }, variant: exact }
  }

  const candidates = variants.filter((variant) => variant.options[changedKey] === changedValue)
  const variant = candidates.find(isVariantPurchasable) ?? candidates[0]
  if (variant) {
    return { options: { ...variant.options }, variant }
  }

  return { options: withChange, variant: null }
}

export function formatSelectedOptionsLabel(
  optionGroups: { key: string; values: string[] }[],
  selectedOptions: Record<string, string>,
): string {
  return optionGroups
    .map((group) => selectedOptions[group.key])
    .filter(Boolean)
    .join(' / ')
}

export function getDefaultVariant(product: Product): ProductVariant | undefined {
  return product.variants.find(isVariantPurchasable) ?? product.variants[0]
}

export function buildCartLineFromProduct(product: Product, variant?: ProductVariant | null) {
  const resolvedVariant = variant ?? getDefaultVariant(product) ?? null
  const price = getDisplayPrice(product, resolvedVariant)
  const images = getProductImages(product, resolvedVariant)

  const markAsNonInventory = resolvedVariant
    ? resolvedVariant.markAsNonInventory
    : product.markAsNonInventory || !product.trackInventory

  const maxQuantity = markAsNonInventory
    ? undefined
    : resolvedVariant
      ? resolvedVariant.stock
      : product.stock

  return {
    productId: product.id,
    variantId: resolvedVariant?.id,
    slug: product.slug,
    name: product.name,
    variantName: resolvedVariant?.name,
    price,
    imageUrl: images[0] ?? '',
    markAsNonInventory,
    maxQuantity,
  }
}

export function getProductImages(product: Product, variant?: ProductVariant | null): string[] {
  if (variant?.imageUrl) {
    return [variant.imageUrl, ...product.imageUrls.filter((url) => url !== variant.imageUrl)]
  }
  return product.imageUrls
}
