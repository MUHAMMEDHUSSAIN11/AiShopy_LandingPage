type ProductAvailabilityProps = {
  label: string
  outOfStock: boolean
  soldOut?: boolean
  className?: string
  size?: 'sm' | 'md'
}

/** Stock labels always use fixed semantic colors (not brand primary). */
export default function ProductAvailability({
  label,
  outOfStock,
  soldOut,
  className = '',
  size = 'sm',
}: ProductAvailabilityProps) {
  const tone = outOfStock
    ? soldOut
      ? 'text-store-muted'
      : 'text-store-stock-out'
    : 'text-store-stock-in'

  return (
    <p
      className={`font-medium ${size === 'md' ? 'text-sm' : 'text-xs'} ${tone} ${className}`.trim()}
    >
      {label}
    </p>
  )
}
