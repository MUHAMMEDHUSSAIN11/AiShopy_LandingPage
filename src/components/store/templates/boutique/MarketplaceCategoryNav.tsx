'use client'

import type { Category } from '@/types/category'

type MarketplaceCategoryNavProps = {
  categories: Category[]
  activeCategoryId: string
  onCategoryChange: (categoryId: string) => void
}

export default function MarketplaceCategoryNav({
  categories,
  activeCategoryId,
  onCategoryChange,
}: MarketplaceCategoryNavProps) {
  return (
    <nav aria-label="Shop by category" className="px-3 py-4">
      <ul className="space-y-1.5">
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id
          return (
            <li key={category.id || 'all'}>
              <button
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`w-full rounded-full px-4 py-2.5 text-left text-sm font-medium transition ${
                  isActive
                    ? 'bg-store-primary text-white shadow-sm'
                    : 'text-store-muted hover:bg-store-subtle hover:text-store-text'
                }`}
              >
                {category.name}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
