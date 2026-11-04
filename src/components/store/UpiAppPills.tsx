import type { UpiAppId, UpiAppLink } from '@/lib/upi-pay-link'

function GPayMark() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4285F4] text-[10px] font-bold text-white">
      G
    </span>
  )
}

function PhonePeMark() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5F259F] text-[9px] font-bold text-white">
      Pe
    </span>
  )
}

function PaytmMark() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00BAF2] text-[8px] font-bold text-white">
      Pay
    </span>
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
