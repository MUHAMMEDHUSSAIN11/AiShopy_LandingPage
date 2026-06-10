'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BackLink from '@/components/store/BackLink'
import StoreHeader from '@/components/store/StoreHeader'
import { formatPrice } from '@/lib/format'
import { useCartStore } from '@/stores/cart-store'
import type { Store } from '@/types/store'

type CartPageContentProps = {
  store: Store
}

export default function CartPageContent({ store }: CartPageContentProps) {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const totalPrice = useCartStore((state) => state.totalPrice())

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader store={store} />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <BackLink href="/" label={`Back to ${store.name}`} />
        <h1 className="mt-4 text-2xl font-bold text-brand-dark">Your Cart</h1>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
            <p className="text-lg font-medium text-gray-700">Your cart is empty</p>
            <Link
              href="/"
              className="mt-4 inline-flex rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-semibold text-brand-dark hover:text-brand-green"
                    >
                      {item.name}
                    </Link>
                    {item.variantName ? (
                      <p className="mt-1 text-sm text-gray-500">{item.variantName}</p>
                    ) : null}
                    <p className="mt-2 font-bold text-brand-green">{formatPrice(item.price)}</p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-gray-200">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-lg text-gray-600 hover:text-brand-green"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-lg text-gray-600 hover:text-brand-green"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-sm font-medium text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="shrink-0 font-semibold text-brand-dark">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-brand-green">{formatPrice(totalPrice)}</span>
              </div>
              <button
                type="button"
                onClick={() => router.push('/checkout')}
                className="mt-4 w-full rounded-full bg-brand-green py-3.5 text-sm font-semibold text-white hover:bg-emerald-600"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
