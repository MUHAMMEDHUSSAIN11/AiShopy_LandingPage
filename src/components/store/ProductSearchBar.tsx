'use client'

type ProductSearchBarProps = {
  value: string
  onChange: (value: string) => void
}

export default function ProductSearchBar({ value, onChange }: ProductSearchBarProps) {
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products..."
        className="glass-input w-full rounded-xl border border-gray-200 bg-store-bg py-2.5 pl-11 pr-4 text-sm text-store-text outline-none transition placeholder:text-gray-400 focus:border-store-primary focus:ring-2 focus:ring-store-primary/20"
      />
    </div>
  )
}
