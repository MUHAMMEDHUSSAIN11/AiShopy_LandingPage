'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import BackLink from '@/components/store/BackLink'
import ProductImageGallery from '@/components/store/ProductImageGallery'
import CartIcon from '@/components/store/CartIcon'
import { formatPrice } from '@/lib/format'
import {
  buildCartLineFromProduct,
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
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

type ProductDetailClientProps = {
  store: Store
  product: Product
}

export default function ProductDetailClient({ store, product }: ProductDetailClientProps) {
  const router = useRouter()
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, line) => sum + line.quantity, 0),
  )
  const addItem = useCartStore((state) => state.addItem)
  const isAddingRef = useRef(false)

  const optionGroups = useMemo(() => getVariantOptionGroups(product.variants), [product.variants])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaultVariant = getDefaultVariant(product)
    return defaultVariant?.options ?? {}
  })
  const [addedMessage, setAddedMessage] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const selectedVariant = useMemo(() => {
    if (product.variants.length === 0) return null
    return findVariantByOptions(product.variants, selectedOptions)
  }, [product.variants, selectedOptions])

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
      router.push('/checkout')
      return
    }

    setAddedMessage('Added to cart')
    window.setTimeout(() => {
      setAddedMessage('')
      isAddingRef.current = false
      setIsAdding(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <BackLink href="/" label={`Back to ${store.name}`} />
          <CartIcon count={cartCount} onClick={() => router.push('/cart')} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductImageGallery images={images} alt={product.name} />

          <div>
            <p className="text-sm font-medium text-gray-500">
              SKU: {selectedVariant?.sku || product.sku}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-brand-dark sm:text-3xl">{product.name}</h1>

            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <p className="text-3xl font-bold text-brand-green">{formatPrice(price)}</p>
              {compareAtPrice ? (
                <p className="text-lg text-gray-400 line-through">{formatPrice(compareAtPrice)}</p>
              ) : null}
            </div>

            <p
              className={`mt-2 text-sm font-medium ${
                inStock ? 'text-brand-green' : 'text-gray-400'
              }`}
            >
              {availabilityLabel}
            </p>

            {optionGroups.length > 0 && (
              <div className="mt-6 space-y-4">
                {optionGroups.map((group) => (
                  <div key={group.key}>
                    <p className="text-sm font-semibold text-gray-700">{group.key}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.values.map((value) => {
                        const isSelected = selectedOptions[group.key] === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleOptionSelect(group.key, value)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                              isSelected
                                ? 'border-brand-green bg-brand-green text-white'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-brand-green'
                            }`}
                          >
                            {value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {selectedLabel ? (
                  <p className="text-sm text-gray-500">Selected: {selectedLabel}</p>
                ) : null}
              </div>
            )}

            {addedMessage ? (
              <p className="mt-4 text-sm font-medium text-brand-green">{addedMessage}</p>
            ) : null}

            <p className="mt-6 leading-relaxed text-gray-600">{product.description}</p>

            {!inStock ? (
              <button
                type="button"
                disabled
                className="mt-8 w-full cursor-not-allowed rounded-full bg-gray-200 px-6 py-4 text-base font-semibold text-gray-500"
              >
                {soldOut ? 'Sold Out' : 'Out of Stock'}
              </button>
            ) : (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={isAdding}
                  onClick={() => handleAddToCart(false)}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-brand-green px-6 py-4 text-base font-semibold text-brand-green transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  disabled={isAdding}
                  onClick={() => handleAddToCart(true)}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-green px-6 py-4 text-base font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Buy Now
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
