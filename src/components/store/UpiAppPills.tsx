import type { UpiAppId, UpiAppLink } from '@/lib/upi-pay-link'

const LOGO: Record<UpiAppId, { src: string; alt: string; className: string; label?: string }> = {
  gpay: {
    src: '/logos/google-pay.png',
    alt: 'Google Pay',
    className: 'h-6 w-6',
    label: 'Google Pay',
  },
  phonepe: {
    src: '/logos/phonepe.png',
    alt: 'PhonePe',
    className: 'h-6 w-6',
    label: 'PhonePe',
  },
  paytm: {
    src: '/logos/paytm.png',
    alt: 'Paytm',
    className: 'h-5 w-auto',
  },
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
        {apps.map((app) => {
          const logo = LOGO[app.id]
          return (
            <a
              key={app.id}
              href={app.href}
              className={`inline-flex items-center gap-2 border border-store-border bg-store-bg px-3 py-2 text-sm font-medium text-store-text transition hover:border-store-primary ${pillRound}`}
            >
              <img src={logo.src} alt={logo.alt} className={`shrink-0 object-contain ${logo.className}`} />
              {logo.label}
            </a>
          )
        })}
      </div>
      <p className="text-xs text-store-muted">
        On a phone this opens that app with the amount filled. Then upload a screenshot.
      </p>
    </div>
  )
}
