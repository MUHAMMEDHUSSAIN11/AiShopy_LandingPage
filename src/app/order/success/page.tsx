import Link from 'next/link'
import { notFound } from 'next/navigation'
import OrderSuccessCelebration from '@/components/store/OrderSuccessCelebration'
import StoreHeader from '@/components/store/StoreHeader'
import { getStoreSlugFromHeaders } from '@/lib/server-api'
import { getStoreBySlug, StoreNotFoundError } from '@/lib/store'

type OrderSuccessPageProps = {
  searchParams: Promise<{ orderId?: string }>
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const storeSlug = await getStoreSlugFromHeaders()
  const { orderId } = await searchParams

  if (!storeSlug) {
    notFound()
  }

  try {
    const store = await getStoreBySlug(storeSlug)

    return (
      <div className="min-h-screen bg-gray-50">
        <StoreHeader store={store} />

        <OrderSuccessCelebration orderId={orderId} storeName={store.name} />

        <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
            <div className="text-4xl">✓</div>
            <h1 className="mt-4 text-2xl font-bold text-brand-dark">Order Placed!</h1>
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
              href="/"
              className="mt-6 inline-block rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    if (error instanceof StoreNotFoundError) {
      notFound()
    }
    throw error
  }
}
