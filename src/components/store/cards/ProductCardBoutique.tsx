'use client'

import Image from 'next/image'
import Link from 'next/link'
import ProductAvailability from '@/components/store/ProductAvailability'
import { useProductCard } from '@/components/store/cards/useProductCard'
import { useStoreHref } from '@/contexts/PreviewContext'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types/product'

type ProductCardBoutiqueProps = {
  storeSlug: string
  product: Product
}

/** Boutique: editorial card — compact 2-col mobile, taller editorial on sm+. */
export default function ProductCardBoutique({ storeSlug, product }: ProductCardBoutiqueProps) {
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
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-store-bg shadow-md ring-1 ring-store-border/60 transition duration-500 hover:shadow-xl sm:rounded-3xl">
      <Link
        href={getHref(`/product/${product.slug}`)}
        className="relative aspect-square overflow-hidden bg-store-subtle sm:aspect-[4/5]"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-store-muted">No image</div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 hidden p-4 text-center text-white sm:block">
          <p className="text-lg font-semibold tracking-wide">{product.name}</p>
          <p className="mt-1 text-sm font-medium opacity-90">
            {prefix ? `${prefix} ` : ''}
            {formatPrice(price)}
          </p>
        </div>
      </Link>

      <div className="flex flex-col items-center gap-2 px-3 py-3 text-center sm:gap-3 sm:px-5 sm:py-5">
        <Link href={getHref(`/product/${product.slug}`)} className="sm:hidden">
          <h2 className="line-clamp-2 text-xs font-semibold text-store-text">{product.name}</h2>
        </Link>
        <p className="text-sm font-bold text-store-primary sm:hidden">
          {prefix ? `${prefix} ` : ''}
          {formatPrice(price)}
        </p>

        <ProductAvailability
          label={availabilityLabel}
          outOfStock={outOfStock}
          soldOut={soldOut}
          size="sm"
        />
        {compareAtPrice ? (
          <p className="-mt-1 text-xs text-store-muted line-through">{formatPrice(compareAtPrice)}</p>
        ) : null}

        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:max-w-xs sm:flex-col">
          <Link
            href={getHref(`/product/${product.slug}`)}
            className="rounded-full border border-store-border px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-store-text transition hover:bg-store-subtle sm:px-5 sm:py-3 sm:text-xs"
          >
            <span className="sm:hidden">View</span>
            <span className="hidden sm:inline">View piece</span>
          </Link>
          {!outOfStock && inCart ? (
            <Link
              href={getHref('/cart')}
              className="rounded-full bg-store-primary px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-white sm:px-5 sm:py-3 sm:text-xs"
            >
              Cart
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="rounded-full bg-store-text px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-store-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:py-3 sm:text-xs"
            >
              {outOfStock ? (
                'N/A'
              ) : added ? (
                '✓'
              ) : (
                <>
                  <span className="sm:hidden">Add</span>
                  <span className="hidden sm:inline">Add to Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
