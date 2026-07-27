'use client'

import Image from 'next/image'
import Link from 'next/link'
import ProductAvailability from '@/components/store/ProductAvailability'
import { useProductCard } from '@/components/store/cards/useProductCard'
import { useStoreHref } from '@/contexts/PreviewContext'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types/product'

type ProductCardClassicProps = {
  storeSlug: string
  product: Product
}

export default function ProductCardClassic({ storeSlug, product }: ProductCardClassicProps) {
  const getHref = useStoreHref()
  const {
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
  } = useProductCard(storeSlug, product)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-store-border bg-store-bg shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link
        href={getHref(`/product/${product.slug}`)}
        className="relative aspect-square overflow-hidden bg-store-subtle"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-store-muted">No image</div>
        )}
        {outOfStock ? (
          <span className="absolute left-3 top-3 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-white">
            {soldOut ? 'Sold Out' : 'Out of stock'}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <Link href={getHref(`/product/${product.slug}`)}>
          <h2 className="line-clamp-2 text-sm font-semibold text-store-text hover:text-store-primary sm:text-base">
            {product.name}
          </h2>
        </Link>

        <div className="flex flex-wrap items-baseline gap-2">
          <p className="text-base font-bold text-store-primary sm:text-lg">
            {prefix ? `${prefix} ` : ''}
            {formatPrice(price)}
          </p>
          {compareAtPrice ? (
            <p className="text-xs text-store-muted line-through sm:text-sm">
              {formatPrice(compareAtPrice)}
            </p>
          ) : null}
        </div>

        <ProductAvailability
          label={availabilityLabel}
          outOfStock={outOfStock}
          soldOut={soldOut}
        />

        <div className="mt-auto flex flex-col gap-2 pt-1 sm:flex-row">
          <Link
            href={getHref(`/product/${product.slug}`)}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-store-border bg-store-bg px-4 py-2.5 text-xs font-semibold text-store-text transition hover:border-store-text hover:bg-store-subtle sm:text-sm"
          >
            View
          </Link>
          {!outOfStock && inCart ? (
            <Link
              href={getHref('/cart')}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-store-primary bg-store-primary-soft px-4 py-2.5 text-xs font-semibold text-store-primary sm:text-sm"
            >
              Cart
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-store-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-store-primary-hover disabled:cursor-not-allowed disabled:bg-store-subtle disabled:text-store-muted sm:text-sm"
            >
              {outOfStock ? (soldOut ? 'Sold Out' : 'Out of Stock') : added ? 'Added ✓' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
