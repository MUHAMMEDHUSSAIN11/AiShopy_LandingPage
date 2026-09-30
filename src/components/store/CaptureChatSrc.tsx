'use client'

import { useEffect } from 'react'
import { persistChatSrc } from '@/lib/chat-attribution'

export default function CaptureChatSrc() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const src = new URLSearchParams(window.location.search).get('src')
    if (src) persistChatSrc(src)
  }, [])

  return null
}
