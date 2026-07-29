'use client'

import Link from 'next/link'
import CartCheckoutForm from '@/components/store/CartCheckoutForm'
import type { CheckoutTemplateProps } from '@/components/store/templates/types'
import { useStoreHref } from '@/contexts/PreviewContext'
import { useCartStore } from '@/stores/cart-store'
import { formatPrice } from '@/lib/format'

export default function ModernCheckout({ store, previewMode }: CheckoutTemplateProps) {
  const getHref = useStoreHref()
  const items = useCartStore((state) => state.items)
  const totalPrice = useCartStore((state) => state.totalPrice())

  return (
    <div className="checkout-modern min-h-screen bg-store-bg template-page-enter">
      <div className="border-b border-store-border bg-store-bg-shell">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex gap-3 text-xs font-bold uppercase tracking-wide">
            <Link href={getHref('/cart')} className="text-store-muted hover:text-store-primary">
              Cart
            </Link>
            <span className="text-store-muted">/</span>
            <span className="text-store-primary">Checkout</span>
            <span className="text-store-muted">/</span>
            <span className="text-store-muted">Confirm</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-store-text">Shipping & pay</h1>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <div className="w-full min-w-0 rounded-md border border-store-border bg-store-bg-shell p-4 sm:p-6">
              <CartCheckoutForm store={store} previewMode={previewMode} layout="modern" />
            </div>
            <p className="mt-4 text-center text-sm text-store-muted">
              <Link href={getHref('/')} className="text-store-primary hover:underline">
                Return to store
              </Link>
            </p>
          </div>

          <div className="rounded-md border-2 border-store-primary/20 bg-store-bg p-5 h-fit">
            <p className="text-xs font-bold uppercase text-store-muted">Order</p>
            <ul className="mt-3 space-y-2 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span className="text-store-muted">
                    {item.quantity}× {item.name}
                  </span>
                  <span className="font-medium text-store-text">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-store-border pt-3 text-base font-bold text-store-text">
              <span>Total</span>
              <span className="text-store-primary">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
