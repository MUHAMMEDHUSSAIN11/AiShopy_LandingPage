type CartIconProps = {
  count?: number
  onClick?: () => void
  className?: string
  badgeRingClassName?: string
}

export default function CartIcon({
  count = 0,
  onClick,
  className,
  badgeRingClassName = 'ring-white',
}: CartIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Shopping cart${count > 0 ? `, ${count} items` : ''}`}
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 hover:text-store-primary ${className ?? ''}`}
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
      {count > 0 && (
        <span
          className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ${badgeRingClassName}`}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
