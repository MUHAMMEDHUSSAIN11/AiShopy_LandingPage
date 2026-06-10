import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/format'
import { getCardPriceLabel, isProductInStock } from '@/lib/product-utils'
import type { Product } from '@/types/product'

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.imageUrls[0]
  const outOfStock = !isProductInStock(product)
  const { price, prefix } = getCardPriceLabel(product)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
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
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="line-clamp-2 font-semibold text-brand-dark">{product.name}</h2>
        <p className="mt-2 text-lg font-bold text-brand-green">
          {prefix ? `${prefix} ` : ''}
          {formatPrice(price)}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-brand-green px-4 py-2.5 text-sm font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
        >
          View Product
        </Link>
      </div>
    </article>
  )
}
