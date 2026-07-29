type CategoryTogglerProps = {
  open: boolean
  onClick: () => void
}

export default function CategoryToggler({ open, onClick }: CategoryTogglerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close categories' : 'Open categories'}
      aria-expanded={open}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-store-bg shadow-sm transition active:scale-95 ${
        open
          ? 'border-store-primary bg-store-primary-soft text-store-primary'
          : 'border-gray-200 text-gray-600 hover:border-store-primary/40 hover:bg-store-primary-soft hover:text-store-primary'
      }`}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75v-.008zm0 5.25h.007v.008H3.75v-.008z"
        />
      </svg>
    </button>
  )
}
