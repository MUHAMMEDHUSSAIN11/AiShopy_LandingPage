import StorePageSkeleton from '@/components/store/skeletons/StorePageSkeleton'
import StoreThemedSkeleton from '@/components/store/skeletons/StoreThemedSkeleton'
import { getStoreSlugFromHeaders } from '@/lib/server-api'

export default async function Loading() {
  const storeSlug = await getStoreSlugFromHeaders()

  if (storeSlug) {
    return (
      <StoreThemedSkeleton>
        <StorePageSkeleton />
      </StoreThemedSkeleton>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
    </div>
  )
}
