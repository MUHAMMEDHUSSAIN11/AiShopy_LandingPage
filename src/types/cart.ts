export interface CartItem {
  id: string
  productId: string
  variantId?: string
  slug: string
  name: string
  variantName?: string
  price: number
  imageUrl: string
  quantity: number
  markAsNonInventory: boolean
  maxQuantity?: number
}

export function buildCartItemId(productId: string, variantId?: string): string {
  return variantId ? `${productId}:${variantId}` : productId
}

export function getCartItemMaxQuantity(item: CartItem): number | undefined {
  if (item.markAsNonInventory) return undefined
  return item.maxQuantity
}

export function canIncreaseCartQuantity(item: CartItem): boolean {
  const max = getCartItemMaxQuantity(item)
  if (max === undefined) return true
  return item.quantity < max
}
