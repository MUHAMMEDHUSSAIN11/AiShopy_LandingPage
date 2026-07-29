'use client'

import { useEffect } from 'react'
import type { Category } from '@/types/category'

type SortOption = 'default' | 'price-asc' | 'price-desc'

type ModernFilterPanelProps = {
  open: boolean
  onClose: () => void
  filterChips: Category[]
  activeCategoryId: string
  onCategoryChange: (categoryId: string) => void
  sort: SortOption
  onSortChange: (sort: SortOption) => void
}

export default function ModernFilterPanel({
  open,
  onClose,
  filterChips,
  activeCategoryId,
  onCategoryChange,
  sort,
  onSortChange,
}: ModernFilterPanelProps) {
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ''
      return
    }

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    if (isDesktop) return

    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId)
    onClose()
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r-2 border-store-text/10 bg-store-bg shadow-xl transition-transform duration-300 ease-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!open}
        aria-label="Filters"
      >
        <div className="flex items-center justify-between border-b border-store-border px-4 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-store-muted">Filters</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-store-border text-store-muted transition hover:bg-store-subtle hover:text-store-text"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-store-muted">Category</p>
          <ul className="mt-3 space-y-1">
            {filterChips.map((chip) => {
              const active = chip.id === activeCategoryId
              return (
                <li key={chip.id || 'all'}>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(chip.id)}
                    className={`w-full rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${
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

          <div className="mt-8 border-t border-store-border pt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-store-muted">Sort</p>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="mt-3 w-full rounded-md border border-store-border bg-store-bg px-3 py-2.5 text-sm text-store-text"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>
      </aside>
    </>
  )
}
