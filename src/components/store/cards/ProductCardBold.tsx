'use client'

import Image from 'next/image'
import Link from 'next/link'
import ShareProductButton from '@/components/store/ShareProductButton'
import { useProductCard } from '@/components/store/cards/useProductCard'
import { buildStorefrontProductShareUrl } from '@/lib/share-product'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types/product'

type ProductCardBoldProps = {
  storeSlug: string
  product: Product
  publicUrl?: string
}

/** High-contrast card with a colored footer bar and a prominent add-to-cart CTA. */
export default function ProductCardBold({ storeSlug, product, publicUrl }: ProductCardBoldProps) {
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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-store-bg shadow-md transition hover:-translate-y-1 hover:shadow-lg">
      <div className="absolute right-2 top-2 z-10">
        <ShareProductButton
          title={product.name}
          url={buildStorefrontProductShareUrl({ publicUrl, productSlug: product.slug })}
        />
      </div>
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain"
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

      <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-4">
        <Link href={`/product/${product.slug}`}>
          <h2 className="line-clamp-2 text-sm font-bold text-store-text hover:text-store-primary sm:text-base">
            {product.name}
          </h2>
        </Link>
        <p className={`mt-1 text-xs font-medium ${outOfStock ? 'text-gray-400' : 'text-store-primary'}`}>
          {availabilityLabel}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 bg-store-primary px-3 py-3 sm:px-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white sm:text-base">
            {prefix ? `${prefix} ` : ''}
            {formatPrice(price)}
          </p>
          {compareAtPrice ? (
            <p className="text-xs text-white/70 line-through">{formatPrice(compareAtPrice)}</p>
          ) : null}
        </div>

        {!outOfStock && inCart ? (
          <Link
            href="/cart"
            className="shrink-0 rounded-full bg-store-bg px-4 py-2 text-xs font-bold text-store-primary shadow-sm transition hover:opacity-90 sm:text-sm"
          >
            Go to Cart
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="shrink-0 rounded-full bg-store-bg px-4 py-2 text-xs font-bold text-store-primary shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-white sm:text-sm"
          >
            {outOfStock ? (soldOut ? 'Sold Out' : 'Out of Stock') : added ? 'Added ✓' : 'Add to Cart'}
          </button>
        )}
      </div>
    </article>
  )
}
