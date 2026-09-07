import type { Metadata } from 'next'
import StoreCatalog from '@/components/store/StoreCatalog'
import LandingPage from '@/components/landing/LandingPage'
import SeoJsonLd from '@/components/SeoJsonLd'
import {
  buildMarketingMetadata,
  buildStoreMetadata,
} from '@/lib/og-metadata'
import { getStoreSlugFromHeaders } from '@/lib/server-api'
import { getStoreBySlug, StoreNotFoundError } from '@/lib/store'

export async function generateMetadata(): Promise<Metadata> {
  const storeSlug = await getStoreSlugFromHeaders()

  if (!storeSlug) {
    return buildMarketingMetadata()
  }

  try {
    const store = await getStoreBySlug(storeSlug)
    return buildStoreMetadata(store)
  } catch (error) {
    if (error instanceof StoreNotFoundError) {
      return buildMarketingMetadata()
    }
    return buildMarketingMetadata()
  }
}

export default async function HomePage() {
  const storeSlug = await getStoreSlugFromHeaders()

  if (storeSlug) {
    return <StoreCatalog storeSlug={storeSlug} />
  }

  return (
    <>
      <SeoJsonLd />
      <LandingPage />
    </>
  )
}
