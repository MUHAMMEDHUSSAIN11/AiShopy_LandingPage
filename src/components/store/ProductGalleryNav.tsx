type ProductGalleryNavProps = {
  onPrevious: () => void
  onNext: () => void
  activeIndex: number
  total: number
  variant?: 'rounded' | 'square'
}

export default function ProductGalleryNav({
  onPrevious,
  onNext,
  activeIndex,
  total,
  variant = 'rounded',
}: ProductGalleryNavProps) {
  const buttonClass =
    variant === 'square'
      ? 'h-9 w-9 rounded-md'
      : 'h-10 w-10 rounded-full sm:h-11 sm:w-11'

  return (
    <>
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous image"
        className={`absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60 active:scale-95 sm:left-3 ${buttonClass}`}
      >
        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next image"
        className={`absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60 active:scale-95 sm:right-3 ${buttonClass}`}
      >
        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-sm">
        {activeIndex + 1} / {total}
      </div>
    </>
  )
}
