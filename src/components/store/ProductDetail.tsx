import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

type ProductDetailProps = {
  store: Store
  product: Product
}

export default function ProductDetail({ store, product }: ProductDetailProps) {
  const outOfStock = product.stock <= 0
  const primaryImage = product.imageUrls[0]

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

            {product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.imageUrls.slice(1).map((url) => (
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
            <p className="text-sm font-medium text-gray-500">SKU: {product.sku}</p>
            <h1 className="mt-2 text-2xl font-bold text-brand-dark sm:text-3xl">{product.name}</h1>
            <p className="mt-4 text-3xl font-bold text-brand-green">{formatPrice(product.price)}</p>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  outOfStock
                    ? 'bg-red-100 text-red-700'
                    : product.stock <= 5
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-brand-green'
                }`}
              >
                {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
              </span>
            </div>

            <p className="mt-6 leading-relaxed text-gray-600">{product.description}</p>

            {outOfStock ? (
              <button
                type="button"
                disabled
                className="mt-8 w-full cursor-not-allowed rounded-full bg-gray-200 px-6 py-4 text-base font-semibold text-gray-500"
              >
                Out of Stock
              </button>
            ) : (
              <Link
                href={`/checkout/${product.id}`}
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
