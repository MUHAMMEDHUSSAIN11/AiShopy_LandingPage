type ModernFilterToggleProps = {
  open: boolean
  onClick: () => void
}

export default function ModernFilterToggle({ open, onClick }: ModernFilterToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close filters' : 'Open filters'}
      aria-expanded={open}
      className={`flex h-10 shrink-0 items-center gap-2 rounded-md border-2 px-3 text-xs font-bold uppercase tracking-wide transition active:scale-[0.98] lg:hidden ${
        open
          ? 'border-store-text bg-store-text text-store-bg'
          : 'border-store-border bg-store-bg text-store-text hover:border-store-text/40'
      }`}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
      Filters
    </button>
  )
}
