import StoreCatalogContent from '@/components/store/StoreCatalogContent'
import ErrorMessage from '@/components/store/ErrorMessage'
import { getCatalog } from '@/lib/catalog'
import { getStoreBySlug, StoreNotFoundError } from '@/lib/store'

type StoreCatalogProps = {
  storeSlug: string
}

export default async function StoreCatalog({ storeSlug }: StoreCatalogProps) {
  try {
    // The catalog endpoint only returns categories/products (no store object),
    // so resolve the store (name, logo, payment methods) from the dedicated
    // store endpoint, consistent with the product/cart pages.
    const [store, catalog] = await Promise.all([
      getStoreBySlug(storeSlug),
      getCatalog(storeSlug),
    ])

    return (
      <StoreCatalogContent
        storeSlug={storeSlug}
        store={store}
        categories={catalog.categories}
        initialProducts={catalog.products}
      />
    )
  } catch (error) {
    if (error instanceof StoreNotFoundError || (error instanceof Error && error.message === 'Store not found')) {
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
