'use client'

import Link from 'next/link'
import OrderSuccessCelebration from '@/components/store/OrderSuccessCelebration'
import StoreHeader from '@/components/store/StoreHeader'
import type { OrderSuccessTemplateProps } from '@/components/store/templates/types'
import { useStoreHref } from '@/contexts/PreviewContext'

export default function ClassicOrderSuccess({ store, orderId }: OrderSuccessTemplateProps) {
  const getHref = useStoreHref()

  return (
    <div className="min-h-screen bg-store-bg-shell template-page-enter">
      <StoreHeader store={store} />
      <OrderSuccessCelebration orderId={orderId} storeName={store.name} />
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-store-primary/30 bg-store-primary-soft p-8 text-center">
          <div className="text-4xl">✓</div>
          <h1 className="mt-4 text-2xl font-bold text-store-text">Order Placed!</h1>
          <p className="mt-2 text-gray-600">
            {orderId ? (
              <>
                Your order <span className="font-semibold">#{orderId}</span> has been submitted to{' '}
                {store.name}.
              </>
            ) : (
              <>Your order has been submitted to {store.name}.</>
            )}{' '}
            They will contact you shortly.
          </p>
          <Link
            href={getHref('/')}
            className="mt-6 inline-block rounded-full bg-store-primary px-6 py-3 text-sm font-semibold text-white hover:bg-store-primary-hover"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    </div>
  )
}
