import type { ReactNode } from 'react'

import StoreTheme from '@/components/store/StoreTheme'
import { getStoreSlugFromHeaders } from '@/lib/server-api'
import { getStoreBySlug } from '@/lib/store'

type StoreThemedSkeletonProps = {
  children: ReactNode
}

/** Wraps storefront loading UI in the store theme so dark palettes apply to skeletons. */
export default async function StoreThemedSkeleton({ children }: StoreThemedSkeletonProps) {
  const storeSlug = await getStoreSlugFromHeaders()
  if (!storeSlug) return <>{children}</>

  try {
    const store = await getStoreBySlug(storeSlug)
    return (
      <StoreTheme themeConfig={store.themeConfig}>
        <div className="min-h-screen bg-store-bg-shell">{children}</div>
      </StoreTheme>
    )
  } catch {
    return <>{children}</>
  }
}
