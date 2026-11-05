type MetaTechProviderBadgeProps = {
  variant: 'bar' | 'chip' | 'footer'
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 3.2l7.2 2.4v6.3c0 4.4-2.9 7.7-7.2 9.1-4.3-1.4-7.2-4.7-7.2-9.1V5.6L12 3.2z"
        className="fill-brand-green/15 stroke-brand-green"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.8 12.1l2.2 2.2 4.4-4.6"
        className="stroke-brand-green"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function MetaTechProviderBadge({ variant }: MetaTechProviderBadgeProps) {
  const label = 'AiShopy is an official Meta Tech Provider'

  if (variant === 'footer') {
    return (
      <p className="text-sm text-gray-400" aria-label={label}>
        AiShopy is an official Meta Tech Provider for the WhatsApp Business Platform.
      </p>
    )
  }

  if (variant === 'chip') {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-brand-green"
        aria-label={label}
      >
        <ShieldIcon className="h-4 w-4 shrink-0" />
        Official Meta Tech Provider
      </div>
    )
  }

  return (
    <div
      className="flex h-9 items-center justify-center border-b border-gray-200 bg-gray-50 px-4"
      aria-label={label}
    >
      <p className="flex items-center gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-900 sm:text-xs">
        <ShieldIcon className="h-4 w-4 shrink-0" />
        <span>Official Meta Tech Provider</span>
        <span className="hidden font-medium normal-case tracking-normal text-gray-500 sm:inline">
          · WhatsApp Business Platform
        </span>
      </p>
    </div>
  )
}
