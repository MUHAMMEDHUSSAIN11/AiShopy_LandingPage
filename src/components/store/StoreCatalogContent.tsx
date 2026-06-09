'use client'

import { useCallback, useMemo, useState, useTransition } from 'react'
import StoreHeader from '@/components/store/StoreHeader'
import StoreSidebarPanel from '@/components/store/StoreSidebarPanel'
import CategoryToggler from '@/components/store/CategoryToggler'
import ProductSearchBar from '@/components/store/ProductSearchBar'
import ProductGrid from '@/components/store/ProductGrid'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

const ALL_CATEGORY: Category = { id: '', name: 'All' }

type StoreCatalogContentProps = {
  storeSlug: string
  store: Store
  categories: Category[]
  initialProducts: Product[]
}

export default function StoreCatalogContent({
  storeSlug,
  store,
  categories,
  initialProducts,
}: StoreCatalogContentProps) {
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const sidebarCategories = useMemo(() => [ALL_CATEGORY, ...categories], [categories])

  const activeCategoryName = useMemo(() => {
    if (!activeCategoryId) return ALL_CATEGORY.name
    return categories.find((category) => category.id === activeCategoryId)?.name ?? 'All'
  }, [activeCategoryId, categories])

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setActiveCategoryId(categoryId)

      startTransition(async () => {
        const params = new URLSearchParams({ storeSlug })
        if (categoryId) params.set('category_id', categoryId)

        const response = await fetch(`/api/catalog?${params.toString()}`)
        if (!response.ok) return

        const catalog = (await response.json()) as { products: Product[] }
        setProducts(catalog.products)
      })
    },
    [storeSlug],
  )

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return products

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.categoryName.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query),
    )
  }, [products, searchQuery])

  const toggleSidebar = () => setSidebarOpen((open) => !open)

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader store={store} cartCount={0} />

      <StoreSidebarPanel
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={sidebarCategories}
        activeCategoryId={activeCategoryId}
        onCategoryChange={handleCategoryChange}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex items-center gap-3">
          <CategoryToggler open={sidebarOpen} onClick={toggleSidebar} />
          <div className="min-w-0 flex-1">
            <ProductSearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            {activeCategoryId ? (
              <span className="font-medium text-gray-700 lg:hidden">{activeCategoryName} · </span>
            ) : null}
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            {searchQuery.trim() ? ` for "${searchQuery.trim()}"` : ''}
            {isPending ? ' · Updating…' : ''}
          </span>
        </div>

        <div className="mt-4">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
              <p className="text-lg font-medium text-gray-700">No products found</p>
              <p className="mt-2 text-sm text-gray-500">Try a different search or category.</p>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  )
}
