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
}

export function buildCartItemId(productId: string, variantId?: string): string {
  return variantId ? `${productId}:${variantId}` : productId
}
