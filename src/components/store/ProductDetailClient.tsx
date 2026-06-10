'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/format'
import {
  findVariantByOptions,
  getCompareAtPrice,
  getDefaultVariant,
  getDisplayPrice,
  getProductImages,
  getProductStockLabel,
  getVariantOptionGroups,
  isProductInStock,
  isVariantPurchasable,
} from '@/lib/product-utils'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

type ProductDetailClientProps = {
  store: Store
  product: Product
}

export default function ProductDetailClient({ store, product }: ProductDetailClientProps) {
  const optionGroups = useMemo(() => getVariantOptionGroups(product.variants), [product.variants])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaultVariant = getDefaultVariant(product)
    return defaultVariant?.options ?? {}
  })

  const selectedVariant = useMemo(() => {
    if (product.variants.length === 0) return null
    return findVariantByOptions(product.variants, selectedOptions) ?? getDefaultVariant(product) ?? null
  }, [product.variants, selectedOptions])

  const images = getProductImages(product, selectedVariant)
  const primaryImage = images[0]
  const price = getDisplayPrice(product, selectedVariant)
  const compareAtPrice = getCompareAtPrice(product, selectedVariant)
  const inStock = selectedVariant
    ? isVariantPurchasable(selectedVariant)
    : isProductInStock(product)
  const stockLabel = getProductStockLabel(product, selectedVariant)

  const checkoutHref = selectedVariant
    ? `/checkout/${product.id}?variant=${selectedVariant.id}`
    : `/checkout/${product.id}`

  const handleOptionSelect = (key: string, value: string) => {
    setSelectedOptions((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-brand-green">
            ← Back to {store.name}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(1).map((url) => (
                  <div
                    key={url}
                    className="relative aspect-square overflow-hidden rounded-lg border border-gray-200"
                  >
                    <Image src={url} alt={product.name} fill className="object-cover" sizes="100px" />
                  </div>
                ))}
              </div>
            )}
          </div>

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
                {selectedVariant ? (
                  <p className="text-sm text-gray-500">Selected: {selectedVariant.name}</p>
                ) : null}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  !inStock
                    ? 'bg-red-100 text-red-700'
                    : stockLabel.includes('Select')
                      ? 'bg-gray-100 text-gray-700'
                      : stockLabel.includes('5') || stockLabel === 'In stock'
                        ? 'bg-green-100 text-brand-green'
                        : 'bg-amber-100 text-amber-700'
                }`}
              >
                {stockLabel}
              </span>
            </div>

            <p className="mt-6 leading-relaxed text-gray-600">{product.description}</p>

            {!inStock ? (
              <button
                type="button"
                disabled
                className="mt-8 w-full cursor-not-allowed rounded-full bg-gray-200 px-6 py-4 text-base font-semibold text-gray-500"
              >
                Out of Stock
              </button>
            ) : (
              <Link
                href={checkoutHref}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-brand-green px-6 py-4 text-base font-semibold text-white transition hover:bg-emerald-600"
              >
                Buy Now
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
