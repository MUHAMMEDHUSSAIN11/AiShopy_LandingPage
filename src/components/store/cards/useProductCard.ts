'use client'

import { useRef, useState } from 'react'
import {
  buildCartLineFromProduct,
  getCardPriceLabel,
  getDefaultVariant,
  getProductStockLabel,
  isProductInStock,
  isProductSoldOut,
} from '@/lib/product-utils'
import { useCartStore } from '@/stores/cart-store'
import { buildCartItemId } from '@/types/cart'
import type { Product } from '@/types/product'

/**
 * Shared cart/stock state for all product card styles, so the classic,
 * minimal and bold cards only differ in presentation.
 */
export function useProductCard(storeSlug: string, product: Product) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)
  const isAddingRef = useRef(false)

  const defaultVariantId = getDefaultVariant(product)?.id
  const cartItemId = buildCartItemId(product.id, defaultVariantId)
  const inCart = useCartStore((state) => state.items.some((line) => line.id === cartItemId))

  const imageUrl = product.imageUrls[0]
  const soldOut = isProductSoldOut(product)
  const outOfStock = !isProductInStock(product)
  const availabilityLabel = getProductStockLabel(product)
  const { price, prefix, compareAtPrice } = getCardPriceLabel(product)

  const handleAddToCart = () => {
    if (outOfStock || isAddingRef.current) return

    isAddingRef.current = true
    addItem(storeSlug, buildCartLineFromProduct(product))
    setAdded(true)
    window.setTimeout(() => {
      setAdded(false)
      isAddingRef.current = false
    }, 600)
  }

  return {
    imageUrl,
    soldOut,
    outOfStock,
    availabilityLabel,
    price,
    prefix,
    compareAtPrice,
    added,
    inCart,
    handleAddToCart,
  }
}
