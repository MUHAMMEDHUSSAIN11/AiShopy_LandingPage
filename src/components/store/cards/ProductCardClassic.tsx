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

/* Button icons render only under the Extra Dark surface — `glass-only` keeps
   them hidden so Light and Dark stay visually identical. */
function EyeIcon() {
  return (
    <svg
      className="glass-only h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg
      className="glass-only h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12A1.125 1.125 0 0119.75 21.75H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
      />
    </svg>
  )
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
    <article className="glass-card group flex flex-col overflow-hidden rounded-2xl border border-store-border bg-store-bg shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
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
            className="glass-btn inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-store-border bg-store-bg px-4 py-2.5 text-xs font-semibold text-store-text transition hover:border-store-text hover:bg-store-subtle sm:text-sm"
          >
            <EyeIcon />
            View
          </Link>
          {!outOfStock && inCart ? (
            <Link
              href={getHref('/cart')}
              className="glass-btn-accent inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-store-primary bg-store-primary-soft px-4 py-2.5 text-xs font-semibold text-store-primary sm:text-sm"
            >
              <BagIcon />
              Cart
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="glass-btn-accent inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-store-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-store-primary-hover disabled:cursor-not-allowed disabled:bg-store-subtle disabled:text-store-muted sm:text-sm"
            >
              {outOfStock ? null : <BagIcon />}
              {outOfStock ? (soldOut ? 'Sold Out' : 'Out of Stock') : added ? 'Added ✓' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
