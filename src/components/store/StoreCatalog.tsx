import StoreCatalogContent from '@/components/store/StoreCatalogContent'
import ErrorMessage from '@/components/store/ErrorMessage'
import { getProducts } from '@/lib/product'
import { getStoreBySlug, StoreNotFoundError } from '@/lib/store'

type StoreCatalogProps = {
  storeSlug: string
}

export default async function StoreCatalog({ storeSlug }: StoreCatalogProps) {
  try {
    const [store, products] = await Promise.all([
      getStoreBySlug(storeSlug),
      getProducts(storeSlug),
    ])

    return <StoreCatalogContent store={store} products={products} />
  } catch (error) {
    if (error instanceof StoreNotFoundError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <ErrorMessage
            title="Store not found"
            message={`We couldn't find a store at "${storeSlug}". Please check the URL and try again.`}
          />
        </div>
      )
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <ErrorMessage
          title="Something went wrong"
          message="We couldn't load this store. Please refresh and try again."
        />
      </div>
    )
  }
}
