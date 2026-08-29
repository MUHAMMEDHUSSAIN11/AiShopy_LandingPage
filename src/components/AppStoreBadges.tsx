import { PLAY_STORE_URL } from '@/lib/constants'

type AppStoreBadgesProps = {
  size?: 'sm' | 'md'
  className?: string
}

function GooglePlayBadge({ compact }: { compact: boolean }) {
  return (
    <svg
      viewBox="0 0 135 40"
      aria-hidden="true"
      className={compact ? 'h-10 w-auto' : 'h-12 w-auto'}
    >
      <rect width="135" height="40" rx="6" fill="#000000" />
      <path
        d="M9.5 7.8c-.3.3-.5.8-.5 1.4v21.6c0 .6.2 1.1.5 1.4l.1.1 12.1-12.1v-.3L9.6 7.7l-.1.1z"
        fill="#2196F3"
      />
      <path
        d="M27.2 20.3 12.1 35.4c.4.4 1 .7 1.7.7.6 0 1.2-.2 1.7-.6l13.6-7.8-1.9-1.9z"
        fill="#FFC107"
      />
      <path
        d="M27.2 20.3 12.1 5.2c.5-.4 1.1-.6 1.7-.6.7 0 1.3.3 1.7.7l15.1 15.1-1.9 1.9z"
        fill="#4CAF50"
      />
      <path
        d="M27.2 20.3 12.1 35.4l15.1-15.1L12.1 5.2l15.1 15.1z"
        fill="#F44336"
      />
      <text x="44" y="15" fill="#FFFFFF" fontSize="7" fontFamily="Arial, sans-serif">
        GET IT ON
      </text>
      <text x="44" y="28" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif">
        Google Play
      </text>
    </svg>
  )
}

function AppStoreBadge({ compact }: { compact: boolean }) {
  return (
    <svg
      viewBox="0 0 135 40"
      aria-hidden="true"
      className={compact ? 'h-10 w-auto' : 'h-12 w-auto'}
    >
      <rect width="135" height="40" rx="6" fill="#000000" />
      <path
        d="M22.5 20.2c0-2.4 1.3-4.5 3.2-5.7-.9-1.3-2.3-2.1-3.9-2.1-1.6 0-2.9.7-4.1.7-1.3 0-2.5-.7-4-.7-2 0-3.8 1.2-4.8 3.1-2.1 3.6-.5 8.9 1.5 11.8 1 1.4 2.2 3 3.8 2.9 1.5 0 2.1-1 3.9-1 1.8 0 2.3 1 3.9 1 1.6 0 2.6-1.4 3.6-2.8.7-1 1-1.6 1.6-2.8-4.1-1.6-4.7-7.4-.7-9.4zM20.1 8.8c.9-1.1 1.5-2.6 1.3-4.1-1.3.1-2.8.8-3.7 1.9-.8.9-1.5 2.4-1.3 3.8 1.4.1 2.8-.7 3.7-1.6z"
        fill="#FFFFFF"
      />
      <text x="44" y="15" fill="#FFFFFF" fontSize="7" fontFamily="Arial, sans-serif">
        Download on the
      </text>
      <text x="44" y="28" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif">
        App Store
      </text>
    </svg>
  )
}

export default function AppStoreBadges({
  size = 'md',
  className = '',
}: AppStoreBadgesProps) {
  const compact = size === 'sm'

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get AiShopy on Google Play"
        className="inline-flex transition hover:opacity-90"
      >
        <GooglePlayBadge compact={compact} />
      </a>

      <div className="relative inline-flex" aria-label="AiShopy on the App Store — coming soon">
        <div className="opacity-55">
          <AppStoreBadge compact={compact} />
        </div>
        <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/45 px-2">
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-black">
            Coming Soon
          </span>
        </span>
      </div>
    </div>
  )
}
