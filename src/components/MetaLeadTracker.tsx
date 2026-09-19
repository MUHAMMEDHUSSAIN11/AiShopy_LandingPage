'use client'

import { useEffect } from 'react'
import { PLAY_STORE_URL } from '@/lib/constants'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

function isPlayStoreClick(href: string) {
  return href.startsWith(PLAY_STORE_URL) || href.includes('play.google.com/store/apps/details?id=com.aishopy.app')
}

/**
 * Sends Meta Lead when someone clicks through to Google Play from the marketing site.
 */
export default function MetaLeadTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest('a')
      if (!link?.href || !isPlayStoreClick(link.href)) return
      window.fbq?.('track', 'Lead')
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
