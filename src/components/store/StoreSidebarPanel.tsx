'use client'

import { useEffect } from 'react'
import StoreSidebar from '@/components/store/StoreSidebar'

type StoreSidebarPanelProps = {
  open: boolean
  onClose: () => void
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export default function StoreSidebarPanel({
  open,
  onClose,
  categories,
  activeCategory,
  onCategoryChange,
}: StoreSidebarPanelProps) {
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

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!open}
        aria-label="Store menu"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <p className="text-sm font-semibold tracking-wide text-brand-dark">Menu</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-brand-dark"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <StoreSidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          onClose={onClose}
        />
      </aside>
    </>
  )
}
