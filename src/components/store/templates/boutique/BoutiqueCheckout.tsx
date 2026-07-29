'use client'

import Link from 'next/link'
import CartCheckoutForm from '@/components/store/CartCheckoutForm'
import type { CheckoutTemplateProps } from '@/components/store/templates/types'
import { useStoreHref } from '@/contexts/PreviewContext'
import { useCartStore } from '@/stores/cart-store'
import { formatPrice } from '@/lib/format'

export default function BoutiqueCheckout({ store, previewMode }: CheckoutTemplateProps) {
  const getHref = useStoreHref()
  const items = useCartStore((state) => state.items)
  const totalPrice = useCartStore((state) => state.totalPrice())

  return (
    <div className="checkout-boutique min-h-screen bg-store-bg-shell template-page-enter">
      <header className="border-b border-store-border bg-store-bg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href={getHref('/cart')} className="text-sm font-medium text-store-primary">
            ← Back to cart
          </Link>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-store-muted">Checkout</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_300px] lg:items-start">
        <div className="min-w-0 rounded-3xl bg-store-subtle p-4 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-store-muted">
            <svg className="h-4 w-4 shrink-0 text-store-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure checkout
          </div>
          <h1 className="marketplace-title text-2xl font-bold text-store-text">Delivery & payment</h1>
          <p className="mt-1 text-sm text-store-muted">Enter your details to complete the order.</p>
          <div className="mt-6 w-full min-w-0">
            <CartCheckoutForm store={store} previewMode={previewMode} layout="boutique" />
          </div>
        </div>

        <aside className="rounded-3xl border border-store-border bg-store-bg p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-xs font-bold uppercase tracking-wide text-store-muted">In your cart</h2>
          <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2 text-store-muted">
                <span className="truncate">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium text-store-text">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-dashed border-store-border pt-4 font-bold text-store-text">
            <span>Total</span>
            <span className="text-store-primary">{formatPrice(totalPrice)}</span>
          </div>
        </aside>
      </main>
    </div>
  )
}
