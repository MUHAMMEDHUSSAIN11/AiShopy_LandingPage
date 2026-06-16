'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/format'
import {
  buildCartLineFromProduct,
  getCardPriceLabel,
  getProductStockLabel,
  isProductInStock,
  isProductSoldOut,
} from '@/lib/product-utils'
import { useCartStore } from '@/stores/cart-store'
import type { Product } from '@/types/product'

type ProductCardProps = {
  storeSlug: string
  product: Product
}

export default function ProductCard({ storeSlug, product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)
  const isAddingRef = useRef(false)

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

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">No image</div>
        )}
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-gray-900/80 px-2.5 py-1 text-xs font-semibold text-white">
            {soldOut ? 'Sold Out' : 'Out of stock'}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.slug}`}>
          <h2 className="line-clamp-2 font-semibold text-brand-dark hover:text-brand-green">
            {product.name}
          </h2>
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <p className="text-lg font-bold text-brand-green">
            {prefix ? `${prefix} ` : ''}
            {formatPrice(price)}
          </p>
          {compareAtPrice ? (
            <p className="text-sm text-gray-400 line-through">{formatPrice(compareAtPrice)}</p>
          ) : null}
        </div>

        <p
          className={`mt-1 text-xs font-medium ${
            outOfStock ? 'text-gray-400' : 'text-brand-green'
          }`}
        >
          {availabilityLabel}
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-4 py-2.5 text-sm font-semibold text-brand-dark transition hover:border-brand-dark hover:bg-gray-50"
          >
            View Product
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="w-full rounded-full bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          >
            {outOfStock ? (soldOut ? 'Sold Out' : 'Out of Stock') : added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
