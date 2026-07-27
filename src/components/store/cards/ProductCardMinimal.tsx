'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useProductCard } from '@/components/store/cards/useProductCard'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types/product'

type ProductCardMinimalProps = {
  storeSlug: string
  product: Product
}

/** Image-forward borderless card with a quiet text CTA and subtle hover. */
export default function ProductCardMinimal({ storeSlug, product }: ProductCardMinimalProps) {
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
    <article className="group flex flex-col">
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
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

      <div className="flex flex-1 flex-col pt-3">
        <Link href={`/product/${product.slug}`}>
          <h2 className="line-clamp-2 text-sm font-medium text-store-text transition group-hover:text-store-primary sm:text-base">
            {product.name}
          </h2>
        </Link>

        <div className="mt-1 flex flex-wrap items-baseline gap-2">
          <p className="text-sm font-semibold text-store-text sm:text-base">
            {prefix ? `${prefix} ` : ''}
            {formatPrice(price)}
          </p>
          {compareAtPrice ? (
            <p className="text-xs text-gray-400 line-through">{formatPrice(compareAtPrice)}</p>
          ) : null}
        </div>

        <p className={`mt-0.5 text-xs ${outOfStock ? 'text-gray-400' : 'text-store-primary'}`}>
          {availabilityLabel}
        </p>

        <div className="mt-2">
          {!outOfStock && inCart ? (
            <Link
              href="/cart"
              className="inline-flex items-center gap-1 text-xs font-semibold text-store-primary transition hover:underline sm:text-sm"
            >
              Go to Cart →
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="inline-flex items-center gap-1 text-xs font-semibold text-store-primary transition hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline sm:text-sm"
            >
              {outOfStock ? (soldOut ? 'Sold Out' : 'Out of Stock') : added ? 'Added ✓' : '+ Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
