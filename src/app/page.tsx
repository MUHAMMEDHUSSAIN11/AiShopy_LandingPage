import StoreCatalog from '@/components/store/StoreCatalog'
import LandingPage from '@/components/landing/LandingPage'
import { getStoreSlugFromHeaders } from '@/lib/server-api'

export default async function HomePage() {
  const storeSlug = await getStoreSlugFromHeaders()

  if (storeSlug) {
    return <StoreCatalog storeSlug={storeSlug} />
  }

  return <LandingPage />
}
