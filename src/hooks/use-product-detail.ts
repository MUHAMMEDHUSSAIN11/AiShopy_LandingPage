'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStoreHref } from '@/contexts/PreviewContext'
import {
  buildCartLineFromProduct,
  findVariantById,
  findVariantByOptions,
  formatSelectedOptionsLabel,
  getCompareAtPrice,
  getDefaultVariant,
  getDisplayPrice,
  getProductImages,
  getProductStockLabel,
  getVariantOptionGroups,
  isProductInStock,
  isProductSoldOut,
  isVariantPurchasable,
  resolveVariantForSelection,
} from '@/lib/product-utils'
import { useCartStore } from '@/stores/cart-store'
import { buildCartItemId } from '@/types/cart'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

export function useProductDetail(
  store: Store,
  product: Product,
  initialVariantId?: string,
) {
  const router = useRouter()
  const getHref = useStoreHref()
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, line) => sum + line.quantity, 0),
  )
  const addItem = useCartStore((state) => state.addItem)
  const isAddingRef = useRef(false)

  const optionGroups = useMemo(() => getVariantOptionGroups(product.variants), [product.variants])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    if (initialVariantId) {
      const variant = findVariantById(product, initialVariantId)
      if (variant?.options) return variant.options
    }
    const defaultVariant = getDefaultVariant(product)
    return defaultVariant?.options ?? {}
  })
  const [addedMessage, setAddedMessage] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const selectedVariant = useMemo(() => {
    if (product.variants.length === 0) return null
    return findVariantByOptions(product.variants, selectedOptions)
  }, [product.variants, selectedOptions])

  const cartItemId = buildCartItemId(product.id, selectedVariant?.id)
  const inCart = useCartStore((state) => state.items.some((line) => line.id === cartItemId))

  const images = getProductImages(product, selectedVariant)
  const price = getDisplayPrice(product, selectedVariant)
  const compareAtPrice = getCompareAtPrice(product, selectedVariant)
  const inStock = selectedVariant
    ? isVariantPurchasable(selectedVariant)
    : isProductInStock(product)
  const soldOut = isProductSoldOut(product, selectedVariant)
  const availabilityLabel = getProductStockLabel(product, selectedVariant)
  const selectedLabel = formatSelectedOptionsLabel(optionGroups, selectedOptions)

  const handleOptionSelect = (key: string, value: string) => {
    const { options } = resolveVariantForSelection(product.variants, selectedOptions, key, value)
    setSelectedOptions(options)
    setAddedMessage('')
  }

  const handleAddToCart = (goToCheckout = false) => {
    if (!inStock || isAddingRef.current) return

    isAddingRef.current = true
    setIsAdding(true)

    addItem(store.slug, buildCartLineFromProduct(product, selectedVariant))

    if (goToCheckout) {
      router.push(getHref('/checkout'))
      return
    }

    setAddedMessage('Added to cart')
    window.setTimeout(() => {
      setAddedMessage('')
      isAddingRef.current = false
      setIsAdding(false)
    }, 600)
  }

  const goToCart = () => router.push(getHref('/cart'))
  const goHome = () => router.push(getHref('/'))

  return {
    store,
    product,
    cartCount,
    optionGroups,
    selectedOptions,
    addedMessage,
    isAdding,
    images,
    price,
    compareAtPrice,
    inStock,
    soldOut,
    availabilityLabel,
    selectedLabel,
    inCart,
    handleOptionSelect,
    handleAddToCart,
    goToCart,
    goHome,
    getHref,
  }
}
