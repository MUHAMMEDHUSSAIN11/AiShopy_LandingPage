'use client'

import Image from 'next/image'
import Link from 'next/link'
import ProductAvailability from '@/components/store/ProductAvailability'
import { useProductCard } from '@/components/store/cards/useProductCard'
import { useStoreHref } from '@/contexts/PreviewContext'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types/product'

type ProductCardModernProps = {
  storeSlug: string
  product: Product
}

/** Modern: sharp grid tile, left accent bar, compact actions. */
export default function ProductCardModern({ storeSlug, product }: ProductCardModernProps) {
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
    <article className="glass-card group flex h-full flex-col overflow-hidden rounded-lg border border-store-border bg-store-bg shadow-sm transition hover:border-store-primary hover:shadow-md">
      <div className="flex min-h-0 flex-1 border-l-4 border-store-primary">
        <Link
          href={getHref(`/product/${product.slug}`)}
          className="relative aspect-square w-full overflow-hidden bg-store-subtle sm:aspect-[5/4]"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition duration-300 group-hover:opacity-95"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-store-muted">—</div>
          )}
        </Link>
      </div>

      <div className="flex flex-col gap-1.5 p-2 sm:gap-2 sm:p-3">
        <Link href={getHref(`/product/${product.slug}`)}>
          <h2 className="line-clamp-2 text-xs font-bold text-store-text sm:text-sm">{product.name}</h2>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-store-primary sm:text-base">
            {prefix ? `${prefix} ` : ''}
            {formatPrice(price)}
          </p>
          {compareAtPrice ? (
            <p className="text-[10px] text-store-muted line-through sm:text-xs">
              {formatPrice(compareAtPrice)}
            </p>
          ) : null}
        </div>
        <ProductAvailability
          label={availabilityLabel}
          outOfStock={outOfStock}
          soldOut={soldOut}
          size="sm"
        />

        <div className="mt-0.5 grid grid-cols-2 gap-1.5 sm:mt-1 sm:gap-2">
          <Link
            href={getHref(`/product/${product.slug}`)}
            className="rounded-md border border-store-border py-1.5 text-center text-[10px] font-semibold text-store-text hover:bg-store-subtle sm:py-2 sm:text-xs"
          >
            Details
          </Link>
          {!outOfStock && inCart ? (
            <Link
              href={getHref('/cart')}
              className="rounded-md bg-store-primary py-1.5 text-center text-[10px] font-semibold text-white sm:py-2 sm:text-xs"
            >
              Cart
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="rounded-md bg-store-text py-1.5 text-[10px] font-semibold text-store-bg disabled:cursor-not-allowed disabled:opacity-40 sm:py-2 sm:text-xs"
            >
              {outOfStock ? 'N/A' : added ? '✓' : '+ Add'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
