import { notFound } from 'next/navigation'
import CartPageContent from '@/components/store/CartPageContent'
import { getStoreSlugFromHeaders } from '@/lib/server-api'
import { getStoreBySlug, StoreNotFoundError } from '@/lib/store'

export default async function CartPage() {
  const storeSlug = await getStoreSlugFromHeaders()

  if (!storeSlug) {
    notFound()
  }

  try {
    const store = await getStoreBySlug(storeSlug)
    return <CartPageContent store={store} />
  } catch (error) {
    if (error instanceof StoreNotFoundError) {
      notFound()
    }
    throw error
  }
}
