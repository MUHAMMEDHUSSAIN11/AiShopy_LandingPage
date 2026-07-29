'use client'

import { useCallback, useMemo, useState, useTransition } from 'react'
import CatalogProductList from '@/components/store/CatalogProductList'
import CategoryToggler from '@/components/store/CategoryToggler'
import ProductSearchBar from '@/components/store/ProductSearchBar'
import StoreHeader from '@/components/store/StoreHeader'
import StoreSidebar from '@/components/store/StoreSidebar'
import StoreSidebarPanel from '@/components/store/StoreSidebarPanel'
import { useCartReconcile } from '@/hooks/use-cart-reconcile'
import { flattenCategories, type Category } from '@/types/category'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

const ALL_CATEGORY: Category = { id: '', name: 'All' }

type StoreCatalogSimpleProps = {
  storeSlug: string
  store: Store
  categories: Category[]
  initialProducts: Product[]
  previewMode?: boolean
}

/** Classic template: header, search, and a category filter button (drawer only — no persistent sidebar). */
export default function StoreCatalogSimple({
  storeSlug,
  store,
  categories,
  initialProducts,
  previewMode,
}: StoreCatalogSimpleProps) {
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  useCartReconcile(storeSlug, initialProducts)

  const sidebarCategories = useMemo(() => [ALL_CATEGORY, ...categories], [categories])

  const activeCategoryName = useMemo(() => {
    if (!activeCategoryId) return ALL_CATEGORY.name
    return (
      flattenCategories(categories).find((category) => category.id === activeCategoryId)?.name ??
      'All'
    )
  }, [activeCategoryId, categories])

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setActiveCategoryId(categoryId)
      setSidebarOpen(false)
      startTransition(async () => {
        if (previewMode) {
          setProducts(
            categoryId
              ? initialProducts.filter((p) => p.categoryId === categoryId)
              : initialProducts,
          )
          return
        }
        const params = new URLSearchParams({ storeSlug })
        if (categoryId) params.set('category_id', categoryId)
        const response = await fetch(`/api/catalog?${params.toString()}`)
        if (!response.ok) return
        const catalog = (await response.json()) as { products: Product[] }
        setProducts(catalog.products)
      })
    },
    [storeSlug, previewMode, initialProducts],
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

  return (
    <div className="catalog-classic min-h-screen bg-store-bg-shell template-page-enter">
      <StoreHeader store={store} />

      <StoreSidebarPanel
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={sidebarCategories}
        activeCategoryId={activeCategoryId}
        onCategoryChange={handleCategoryChange}
      />

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <div className="rounded-xl border border-store-border bg-store-bg p-3 shadow-sm sm:p-4">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryToggler open={sidebarOpen} onClick={() => setSidebarOpen((o) => !o)} />
            <div className="min-w-0 flex-1">
              <ProductSearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-store-border pt-3 text-sm text-store-muted">
            <span className="font-semibold text-store-text">
              {activeCategoryName}
              <span className="font-normal text-store-muted"> · Catalog</span>
            </span>
            <span>
              {filteredProducts.length} items
              {searchQuery.trim() ? ` · “${searchQuery.trim()}”` : ''}
              {isPending ? ' · Updating…' : ''}
            </span>
          </div>
        </div>

        <div className="mt-5">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-store-border bg-store-bg px-6 py-16 text-center">
              <p className="text-lg font-medium text-store-text">No products found</p>
              <p className="mt-2 text-sm text-store-muted">Try another category or search.</p>
            </div>
          ) : (
            <CatalogProductList storeSlug={storeSlug} products={filteredProducts} template="classic" />
          )}
        </div>
      </div>
    </div>
  )
}
