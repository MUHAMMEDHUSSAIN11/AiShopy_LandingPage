'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { CartTemplateProps } from '@/components/store/templates/types'
import { useStoreHref } from '@/contexts/PreviewContext'
import { useCartReconcile } from '@/hooks/use-cart-reconcile'
import { formatPrice } from '@/lib/format'
import { useCartStore } from '@/stores/cart-store'
import { canIncreaseCartQuantity } from '@/types/cart'

export default function ModernCart({ store }: CartTemplateProps) {
  const router = useRouter()
  const getHref = useStoreHref()
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const totalPrice = useCartStore((state) => state.totalPrice())

  useCartReconcile(store.slug)

  return (
    <div className="cart-modern min-h-screen bg-store-bg-shell template-page-enter">
      <header className="border-b border-store-border bg-store-bg">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href={getHref('/')} className="text-sm font-medium text-store-primary">
            ← Store
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-store-muted">{store.name}</span>
        </div>
        <div className="mx-auto flex max-w-3xl gap-2 px-4 pb-3 text-xs font-semibold uppercase tracking-wide">
          <span className="text-store-primary">1. Cart</span>
          <span className="text-store-muted">2. Details</span>
          <span className="text-store-muted">3. Done</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-xl font-bold text-store-text">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-8 rounded-md border border-store-border bg-store-bg p-10 text-center">
            <p className="text-store-muted">No items yet.</p>
            <Link href={getHref('/')} className="mt-4 inline-block text-sm font-semibold text-store-primary">
              Shop products
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-4 hidden grid-cols-[1fr_100px_120px_80px] gap-2 border-b border-store-border pb-2 text-xs font-bold uppercase text-store-muted sm:grid">
              <span>Product</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Price</span>
              <span />
            </div>
            <ul className="mt-2 space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-md border border-store-border bg-store-bg p-3 sm:grid sm:grid-cols-[1fr_100px_120px_80px] sm:items-center sm:gap-2 sm:border-0 sm:border-b sm:p-4 sm:pb-4"
                >
                  <div className="flex gap-3 sm:contents">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-store-subtle sm:row-span-1">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="56px" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1 sm:min-w-0">
                      <div className="flex items-start justify-between gap-2 sm:block">
                        <Link
                          href={getHref(`/product/${item.slug}`)}
                          className="font-medium text-store-text hover:text-store-primary"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 text-xs font-medium text-store-stock-out sm:hidden"
                        >
                          Remove
                        </button>
                      </div>
                      {item.variantName ? (
                        <p className="text-xs text-store-muted">{item.variantName}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 sm:mt-0 sm:justify-center">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-store-border text-store-text hover:bg-store-subtle"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-store-text">{item.quantity}</span>
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-store-border text-store-text hover:bg-store-subtle disabled:opacity-40"
                        disabled={!canIncreaseCartQuantity(item)}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-store-text sm:hidden">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <p className="hidden text-right font-semibold text-store-text sm:block">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <div className="hidden text-right sm:block">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-xs font-medium text-store-stock-out"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between border-t border-store-border pt-4">
              <span className="font-bold text-store-text">Subtotal</span>
              <span className="text-lg font-bold text-store-primary">{formatPrice(totalPrice)}</span>
            </div>
            <button
              type="button"
              onClick={() => router.push(getHref('/checkout'))}
              className="mt-4 w-full rounded-md bg-store-primary py-3.5 text-sm font-semibold text-white hover:bg-store-primary-hover"
            >
              Continue to checkout
            </button>
          </>
        )}
      </main>
    </div>
  )
}
