'use client'

import { useCallback, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CatalogProductList from '@/components/store/CatalogProductList'
import CartIcon from '@/components/store/CartIcon'
import ProductSearchBar from '@/components/store/ProductSearchBar'
import ModernFilterPanel from '@/components/store/templates/modern/ModernFilterPanel'
import ModernFilterToggle from '@/components/store/templates/modern/ModernFilterToggle'
import type { CatalogTemplateProps } from '@/components/store/templates/types'
import { useStoreHref } from '@/contexts/PreviewContext'
import { useCartReconcile } from '@/hooks/use-cart-reconcile'
import { useCartStore } from '@/stores/cart-store'
import { flattenCategories, type Category } from '@/types/category'
import type { Product } from '@/types/product'

const ALL_CATEGORY: Category = { id: '', name: 'All' }

export default function ModernCatalog({
  storeSlug,
  store,
  categories,
  initialProducts,
  previewMode,
}: CatalogTemplateProps) {
  const router = useRouter()
  const getHref = useStoreHref()
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, line) => sum + line.quantity, 0),
  )

  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc'>('default')
  const [filterOpen, setFilterOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  useCartReconcile(storeSlug, initialProducts)

  const filterChips = useMemo(
    () => [ALL_CATEGORY, ...flattenCategories(categories)],
    [categories],
  )

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
    [previewMode, initialProducts, storeSlug],
  )

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    let list = products
    if (query) {
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.categoryName.toLowerCase().includes(query),
      )
    }
    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price)
    return list
  }, [products, searchQuery, sort])

  const activeCategoryName = useMemo(() => {
    if (!activeCategoryId) return ALL_CATEGORY.name
    return filterChips.find((chip) => chip.id === activeCategoryId)?.name ?? ALL_CATEGORY.name
  }, [activeCategoryId, filterChips])

  return (
    <div className="catalog-modern min-h-screen bg-store-bg-shell template-page-enter">
      <ModernFilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filterChips={filterChips}
        activeCategoryId={activeCategoryId}
        onCategoryChange={handleCategoryChange}
        sort={sort}
        onSortChange={setSort}
      />

      <header className="sticky top-0 z-30 border-b-2 border-store-text/10 bg-store-bg">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href={getHref('/')}
            className="text-base font-black uppercase tracking-tight text-store-text"
          >
            {store.name}
          </Link>
          <div className="min-w-[200px] flex-1">
            <ProductSearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <CartIcon count={cartCount} onClick={() => router.push(getHref('/cart'))} />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[240px_1fr]">
        <aside className="catalog-modern-filters hidden border-r border-store-border bg-store-bg p-4 lg:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-store-muted">
            Filters
          </p>
          <ul className="mt-4 space-y-1">
            {filterChips.map((chip) => {
              const active = chip.id === activeCategoryId
              return (
                <li key={chip.id || 'all'}>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(chip.id)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                      active
                        ? 'bg-store-text text-store-bg'
                        : 'text-store-text hover:bg-store-subtle'
                    }`}
                  >
                    {chip.name}
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="mt-8 border-t border-store-border pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-store-muted">
              Sort
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="mt-2 w-full rounded-md border border-store-border bg-store-bg px-3 py-2 text-sm text-store-text"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-6">
          <div className="mb-4 flex flex-wrap items-center gap-3 lg:hidden">
            <ModernFilterToggle open={filterOpen} onClick={() => setFilterOpen((open) => !open)} />
            <p className="min-w-0 flex-1 text-sm font-medium text-store-text">
              <span className="text-store-muted">Category:</span> {activeCategoryName}
            </p>
          </div>

          <div className="mb-4 flex items-end justify-between gap-4 border-b border-store-border pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-store-primary">
                Storefront
              </p>
              <h1 className="text-2xl font-black text-store-text">{activeCategoryName}</h1>
            </div>
            <p className="text-sm text-store-muted">
              {filteredProducts.length} results{isPending ? '…' : ''}
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-store-border p-12 text-center">
              <p className="font-bold text-store-text">No matches</p>
            </div>
          ) : (
            <CatalogProductList
              storeSlug={storeSlug}
              products={filteredProducts}
              template="modern"
            />
          )}
        </main>
      </div>
    </div>
  )
}
