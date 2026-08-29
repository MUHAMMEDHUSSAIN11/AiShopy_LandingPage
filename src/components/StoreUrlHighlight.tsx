import { STOREFRONT_DOMAIN } from '@/lib/constants'

type StoreUrlHighlightProps = {
  storeName?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs sm:text-sm',
  md: 'px-4 py-2 text-sm sm:text-base',
  lg: 'px-4 py-2.5 text-base sm:px-6 sm:py-3 sm:text-lg md:text-xl',
} as const

export default function StoreUrlHighlight({
  storeName = 'yourstore',
  size = 'md',
  className = '',
}: StoreUrlHighlightProps) {
  return (
    <span
      className={`inline-flex max-w-full flex-wrap items-center justify-center rounded-xl border border-green-200 bg-white font-mono font-semibold shadow-sm break-all ${sizeClasses[size]} ${className}`}
    >
      <span className="text-brand-green break-all">{storeName}</span>
      <span className="text-gray-400 break-all">.{STOREFRONT_DOMAIN}</span>
    </span>
  )
}
