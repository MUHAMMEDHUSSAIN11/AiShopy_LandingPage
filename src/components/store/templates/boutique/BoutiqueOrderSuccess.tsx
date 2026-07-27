'use client'

import Link from 'next/link'
import OrderSuccessCelebration from '@/components/store/OrderSuccessCelebration'
import type { OrderSuccessTemplateProps } from '@/components/store/templates/types'
import { useStoreHref } from '@/contexts/PreviewContext'

export default function BoutiqueOrderSuccess({ store, orderId }: OrderSuccessTemplateProps) {
  const getHref = useStoreHref()

  return (
    <div className="success-boutique min-h-screen bg-store-bg-shell px-4 py-12 template-page-enter">
      <OrderSuccessCelebration orderId={orderId} storeName={store.name} />
      <main className="mx-auto max-w-lg">
        <div className="relative overflow-hidden rounded-3xl border border-store-border bg-store-bg shadow-md">
          <div className="h-2 bg-store-primary" />
          <div className="border-b border-dashed border-store-border px-6 py-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-store-muted">Receipt</p>
            <h1 className="marketplace-title mt-3 text-2xl font-bold text-store-text">Order received</h1>
            {orderId ? (
              <p className="mt-2 font-mono text-sm text-store-primary">#{orderId}</p>
            ) : null}
            <p className="mt-4 text-sm text-store-muted">
              {store.name} will confirm your order and reach out for delivery.
            </p>
          </div>
          <div className="flex flex-col gap-3 p-6 sm:flex-row sm:justify-center">
            <Link
              href={getHref('/')}
              className="inline-flex justify-center rounded-full bg-store-text px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white"
            >
              Back to marketplace
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
