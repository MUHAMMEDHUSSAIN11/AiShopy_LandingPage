type StoreUrlHighlightProps = {
  storeName?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg md:text-xl',
} as const

export default function StoreUrlHighlight({
  storeName = 'yourstore',
  size = 'md',
  className = '',
}: StoreUrlHighlightProps) {
  return (
    <span
      className={`inline-flex items-center rounded-xl border border-green-200 bg-white font-mono font-semibold shadow-sm ${sizeClasses[size]} ${className}`}
    >
      <span className="text-brand-green">{storeName}</span>
      <span className="text-gray-400">.aishopy.com</span>
    </span>
  )
}
