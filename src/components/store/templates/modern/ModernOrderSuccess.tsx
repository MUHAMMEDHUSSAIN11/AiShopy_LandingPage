'use client'

import Link from 'next/link'
import OrderSuccessCelebration from '@/components/store/OrderSuccessCelebration'
import type { OrderSuccessTemplateProps } from '@/components/store/templates/types'
import { useStoreHref } from '@/contexts/PreviewContext'

export default function ModernOrderSuccess({ store, orderId }: OrderSuccessTemplateProps) {
  const getHref = useStoreHref()

  return (
    <div className="min-h-screen bg-store-bg template-page-enter">
      <OrderSuccessCelebration orderId={orderId} storeName={store.name} />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-store-primary text-3xl text-white">
            ✓
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-store-primary">Step 3 · Done</p>
            <h1 className="mt-1 text-2xl font-bold text-store-text">You&apos;re all set</h1>
            <p className="mt-2 text-sm text-store-muted">
              {orderId ? (
                <>
                  Order <span className="font-semibold text-store-text">{orderId}</span> is with{' '}
                  {store.name}.
                </>
              ) : (
                <>Your demo order was sent to {store.name}.</>
              )}
            </p>
            <Link
              href={getHref('/')}
              className="mt-5 inline-flex rounded-md bg-store-primary px-5 py-2.5 text-sm font-semibold text-white"
            >
              Back to products
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
