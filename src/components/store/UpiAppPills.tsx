import type { UpiAppId, UpiAppLink } from '@/lib/upi-pay-link'

function GPayMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function PhonePeMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#5F259F" />
      <path
        fill="#FFFFFF"
        d="M7.6 5.8h5.05c2.85 0 4.7 1.55 4.7 3.95 0 1.72-.86 2.95-2.28 3.52L17.6 18.2h-2.7l-2.55-4.55H9.9V18.2H7.6V5.8zm2.3 2.05v4.05h2.45c1.42 0 2.28-.72 2.28-1.98 0-1.28-.86-2.07-2.28-2.07H9.9z"
      />
    </svg>
  )
}

function PaytmMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#00BAF2" />
      <path
        fill="#012B72"
        d="M6.4 7.1h4.35c2.35 0 3.85 1.28 3.85 3.28 0 2.02-1.5 3.32-3.85 3.32H8.7V16.9H6.4V7.1zm2.3 1.85v2.9h1.92c1.18 0 1.85-.58 1.85-1.45 0-.86-.67-1.45-1.85-1.45H8.7z"
      />
      <rect x="6.4" y="17.15" width="11.2" height="1.55" rx="0.4" fill="#012B72" />
    </svg>
  )
}

function AppMark({ id }: { id: UpiAppId }) {
  if (id === 'gpay') return <GPayMark />
  if (id === 'phonepe') return <PhonePeMark />
  return <PaytmMark />
}

type UpiAppPillsProps = {
  apps: UpiAppLink[]
  pillRound: string
}

export default function UpiAppPills({ apps, pillRound }: UpiAppPillsProps) {
  if (apps.length === 0) return null

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-store-muted">Pay with</p>
      <div className="flex flex-wrap gap-2">
        {apps.map((app) => (
          <a
            key={app.id}
            href={app.href}
            className={`inline-flex items-center gap-2 border border-store-border bg-store-bg px-3 py-2 text-sm font-medium text-store-text transition hover:border-store-primary ${pillRound}`}
          >
            <AppMark id={app.id} />
            {app.label}
          </a>
        ))}
      </div>
      <p className="text-xs text-store-muted">
        On a phone this opens that app with the amount filled. Then upload a screenshot.
      </p>
    </div>
  )
}
