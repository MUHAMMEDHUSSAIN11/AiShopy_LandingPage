'use client'

import { useCallback, useMemo, useState, useTransition } from 'react'
import CatalogProductList from '@/components/store/CatalogProductList'
import CategoryToggler from '@/components/store/CategoryToggler'
import ProductSearchBar from '@/components/store/ProductSearchBar'
import StoreSidebar from '@/components/store/StoreSidebar'
import StoreSidebarPanel from '@/components/store/StoreSidebarPanel'
import MarketplaceCategoryNav from '@/components/store/templates/boutique/MarketplaceCategoryNav'
import MarketplaceHeader from '@/components/store/templates/boutique/MarketplaceHeader'
import { useCartReconcile } from '@/hooks/use-cart-reconcile'
import { flattenCategories, type Category } from '@/types/category'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

const ALL_CATEGORY: Category = { id: '', name: 'All' }

type StoreCatalogMarketplaceProps = {
  storeSlug: string
  store: Store
  categories: Category[]
  initialProducts: Product[]
  previewMode?: boolean
}

/**
 * Boutique “marketplace” layout: persistent category sidebar on desktop,
 * hamburger + drawer on mobile, editorial product grid.
 */
export default function StoreCatalogMarketplace({
  storeSlug,
  store,
  categories,
  initialProducts,
  previewMode,
}: StoreCatalogMarketplaceProps) {
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
    <div className="catalog-boutique min-h-screen bg-store-bg-shell template-page-enter">
      <MarketplaceHeader store={store} />

      <StoreSidebarPanel
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={sidebarCategories}
        activeCategoryId={activeCategoryId}
        onCategoryChange={handleCategoryChange}
      />

      <div className="mx-auto flex max-w-7xl">
        <aside className="catalog-marketplace-sidebar hidden w-60 shrink-0 border-r border-store-border bg-store-bg lg:block">
          <div className="sticky top-[57px] max-h-[calc(100vh-57px)] overflow-y-auto">
            <p className="border-b border-store-border px-4 py-3 text-xs font-bold uppercase tracking-wider text-store-muted">
              Shop by category
            </p>
            <MarketplaceCategoryNav
              categories={sidebarCategories}
              activeCategoryId={activeCategoryId}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1 px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryToggler open={sidebarOpen} onClick={() => setSidebarOpen((o) => !o)} />
            <div className="min-w-0 flex-1">
              <ProductSearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-2 border-b border-store-border pb-4">
            <div>
              <h2 className="marketplace-title text-2xl font-bold text-store-text sm:text-3xl">
                {activeCategoryName}
              </h2>
              <p className="mt-1 text-sm text-store-muted">
                Marketplace · {filteredProducts.length} items
                {searchQuery.trim() ? ` · “${searchQuery.trim()}”` : ''}
                {isPending ? ' · Updating…' : ''}
              </p>
            </div>
          </div>

          <div className="mt-8">
            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-store-border bg-store-bg px-6 py-16 text-center">
                <p className="text-lg font-medium text-store-text">No products found</p>
                <p className="mt-2 text-sm text-store-muted">Try another category or search.</p>
              </div>
            ) : (
              <CatalogProductList
                storeSlug={storeSlug}
                products={filteredProducts}
                template="boutique"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
