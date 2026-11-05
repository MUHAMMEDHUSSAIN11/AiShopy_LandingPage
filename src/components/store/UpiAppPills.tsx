'use client'

import type { MouseEvent } from 'react'
import type { UpiAppId, UpiAppLink } from '@/lib/upi-pay-link'

const LOGO: Record<
  Exclude<UpiAppId, 'upi'>,
  { src: string; alt: string; className: string; label?: string }
> = {
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
    label: 'Paytm',
  },
}

type UpiAppPillsProps = {
  apps: UpiAppLink[]
  pillRound: string
}

function openUpiHref(event: MouseEvent<HTMLAnchorElement>, href: string) {
  // Keep href for accessibility / long-press; force navigation on tap so iOS
  // Safari treats it as a user gesture when opening UPI / payment apps.
  event.preventDefault()
  window.location.href = href
}

export default function UpiAppPills({ apps, pillRound }: UpiAppPillsProps) {
  if (apps.length === 0) return null

  const primary = apps.find((app) => app.id === 'upi')
  const others = apps.filter((app) => app.id !== 'upi')

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-store-muted">Pay with</p>

      {primary ? (
        <a
          href={primary.href}
          onClick={(event) => openUpiHref(event, primary.href)}
          className={`inline-flex w-full items-center justify-center gap-2 border border-store-primary bg-store-primary px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 ${pillRound}`}
        >
          {primary.label}
        </a>
      ) : null}

      {others.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {others.map((app) => {
            const logo = LOGO[app.id as Exclude<UpiAppId, 'upi'>]
            return (
              <a
                key={app.id}
                href={app.href}
                onClick={(event) => openUpiHref(event, app.href)}
                className={`inline-flex items-center gap-2 border border-store-border bg-store-bg px-3 py-2 text-sm font-medium text-store-text transition hover:border-store-primary ${pillRound}`}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`shrink-0 object-contain ${logo.className}`}
                />
                {logo.label}
              </a>
            )
          })}
        </div>
      ) : null}

      <p className="text-xs text-store-muted">
        On a phone this opens your UPI app with the amount filled. If nothing opens, pay
        with the UPI ID or QR above, then upload a screenshot.
      </p>
    </div>
  )
}
