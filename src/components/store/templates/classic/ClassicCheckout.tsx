'use client'

import Link from 'next/link'
import BackLink from '@/components/store/BackLink'
import CartCheckoutForm from '@/components/store/CartCheckoutForm'
import StoreHeader from '@/components/store/StoreHeader'
import type { CheckoutTemplateProps } from '@/components/store/templates/types'
import { useStoreHref } from '@/contexts/PreviewContext'

export default function ClassicCheckout({ store, previewMode }: CheckoutTemplateProps) {
  const getHref = useStoreHref()

  return (
    <div className="checkout-classic min-h-screen bg-store-bg-shell template-page-enter">
      <StoreHeader store={store} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <BackLink href={getHref('/cart')} label="Back to cart" />
        <div className="mb-6 mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-store-text">Checkout</h1>
            <p className="mt-1 text-sm text-store-muted">Complete your order request</p>
          </div>
          <Link href={getHref('/cart')} className="text-sm font-medium text-store-primary hover:underline">
            Edit cart
          </Link>
        </div>
        <CartCheckoutForm store={store} previewMode={previewMode} layout="classic" />
      </main>
    </div>
  )
}
