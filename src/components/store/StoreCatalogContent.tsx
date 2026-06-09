'use client'

import { useMemo, useState } from 'react'
import StoreHeader from '@/components/store/StoreHeader'
import StoreSidebarPanel from '@/components/store/StoreSidebarPanel'
import CategoryToggler from '@/components/store/CategoryToggler'
import ProductSearchBar from '@/components/store/ProductSearchBar'
import ProductGrid from '@/components/store/ProductGrid'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

type StoreCatalogContentProps = {
  store: Store
  products: Product[]
}

export default function StoreCatalogContent({ store, products }: StoreCatalogContentProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((product) => product.category))].sort()
    return ['All', ...unique]
  }, [products])

  const filteredProducts = useMemo(() => {
    let result = products

    if (activeCategory !== 'All') {
      result = result.filter((product) => product.category === activeCategory)
    }

    const query = searchQuery.trim().toLowerCase()
    if (query) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query),
      )
    }

    return result
  }, [products, activeCategory, searchQuery])

  const toggleSidebar = () => setSidebarOpen((open) => !open)

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader store={store} cartCount={0} />

      <StoreSidebarPanel
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
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
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            {searchQuery.trim() ? ` for "${searchQuery.trim()}"` : ''}
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
