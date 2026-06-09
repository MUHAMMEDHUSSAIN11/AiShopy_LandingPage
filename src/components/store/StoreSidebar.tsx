'use client'

import Link from 'next/link'
import { useState } from 'react'
import SidebarWatermark from '@/components/store/SidebarWatermark'
import type { Category } from '@/types/category'

type StoreSidebarProps = {
  categories: Category[]
  activeCategoryId: string
  onCategoryChange: (categoryId: string) => void
  onClose?: () => void
}

export default function StoreSidebar({
  categories,
  activeCategoryId,
  onCategoryChange,
  onClose,
}: StoreSidebarProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(true)

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId)
    const isMobile = window.matchMedia('(max-width: 1023px)').matches
    if (isMobile) onClose?.()
  }

  const navItemClass =
    'flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium tracking-wide text-gray-700 transition hover:bg-green-50 hover:text-brand-green'

  return (
    <div className="flex h-full flex-col">
      <nav aria-label="Store navigation" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          <li>
            <Link href="/" onClick={onClose} className={navItemClass}>
              Home
            </Link>
          </li>

          <li>
            <button
              type="button"
              onClick={() => setCategoriesOpen((open) => !open)}
              aria-expanded={categoriesOpen}
              className={`${navItemClass} justify-between`}
            >
              <span>Categories</span>
              <svg
                className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
                  categoriesOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {categoriesOpen && (
              <ul className="mt-1 space-y-0.5 border-l-2 border-green-100 pl-3">
                {categories.map((category) => (
                  <li key={category.id || 'all'}>
                    <button
                      type="button"
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium tracking-wide transition ${
                        activeCategoryId === category.id
                          ? 'bg-brand-green text-white'
                          : 'text-gray-600 hover:bg-green-50 hover:text-brand-green'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <SidebarWatermark className="shrink-0" />
    </div>
  )
}
