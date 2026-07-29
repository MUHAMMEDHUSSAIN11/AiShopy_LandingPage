import { STOREFRONT_DOMAIN } from '@/lib/constants'
import { PLATFORM_URL } from '@/lib/env'

type SidebarWatermarkProps = {
  className?: string
}

export default function SidebarWatermark({ className = '' }: SidebarWatermarkProps) {
  return (
    <div className={`border-t border-gray-100 px-4 py-4 ${className}`}>
      <a
        href={PLATFORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-xs tracking-wide text-gray-400 transition hover:text-store-primary"
      >
        Powered by{' '}
        <span className="font-semibold text-store-primary/80 hover:text-store-primary">
          {STOREFRONT_DOMAIN}
        </span>
      </a>
    </div>
  )
}
