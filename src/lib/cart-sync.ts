import { buildCartItemId, type CartItem } from '@/types/cart'
import {
  buildCartLineFromProduct,
  isProductInStock,
  isVariantPurchasable,
} from '@/lib/product-utils'
import type { Product } from '@/types/product'

export type AvailableCartItem = Omit<CartItem, 'quantity'>

/**
 * Builds the set of cart items that are currently purchasable from the live
 * catalog. Used to reconcile a persisted cart: anything not in this list has
 * been deleted, deactivated, or sold out and should be removed from the cart.
 */
export function buildAvailableCartItems(products: Product[]): AvailableCartItem[] {
  const available: AvailableCartItem[] = []

  for (const product of products) {
    if (product.variants.length > 0) {
      for (const variant of product.variants) {
        if (!isVariantPurchasable(variant)) continue
        const line = buildCartLineFromProduct(product, variant)
        available.push({ ...line, id: buildCartItemId(line.productId, line.variantId) })
      }
    } else if (isProductInStock(product)) {
      const line = buildCartLineFromProduct(product)
      available.push({ ...line, id: buildCartItemId(line.productId, line.variantId) })
    }
  }

  return available
}
