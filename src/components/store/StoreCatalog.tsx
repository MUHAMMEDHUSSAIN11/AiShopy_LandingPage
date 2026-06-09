import StoreCatalogContent from '@/components/store/StoreCatalogContent'
import ErrorMessage from '@/components/store/ErrorMessage'
import { getCatalog } from '@/lib/catalog'
import { StoreNotFoundError } from '@/lib/store'

type StoreCatalogProps = {
  storeSlug: string
}

export default async function StoreCatalog({ storeSlug }: StoreCatalogProps) {
  try {
    const catalog = await getCatalog(storeSlug)

    return (
      <StoreCatalogContent
        storeSlug={storeSlug}
        store={catalog.store}
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
