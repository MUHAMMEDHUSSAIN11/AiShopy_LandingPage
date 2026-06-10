import Link from 'next/link'
import { notFound } from 'next/navigation'
import BackLink from '@/components/store/BackLink'
import CartCheckoutForm from '@/components/store/CartCheckoutForm'
import StoreHeader from '@/components/store/StoreHeader'
import { getStoreSlugFromHeaders } from '@/lib/server-api'
import { getStoreBySlug, StoreNotFoundError } from '@/lib/store'

export default async function CheckoutPage() {
  const storeSlug = await getStoreSlugFromHeaders()

  if (!storeSlug) {
    notFound()
  }

  try {
    const store = await getStoreBySlug(storeSlug)

    return (
      <div className="min-h-screen bg-gray-50">
        <StoreHeader store={store} />

        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <BackLink href="/cart" label="Back to cart" />
          <div className="mb-6 mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-brand-dark">Checkout</h1>
              <p className="mt-1 text-sm text-gray-500">Complete your order request</p>
            </div>
            <Link href="/cart" className="text-sm font-medium text-brand-green hover:underline">
              Edit cart
            </Link>
          </div>

          <CartCheckoutForm store={store} />
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
