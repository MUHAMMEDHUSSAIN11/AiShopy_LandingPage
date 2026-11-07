'use client'

import { useState, type MouseEvent } from 'react'

type ShareProductButtonProps = {
  title: string
  url: string
  className?: string
}

function absoluteShareUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url
  if (typeof window === 'undefined') return url
  const path = url.startsWith('/') ? url : `/${url}`
  return `${window.location.origin}${path}`
}

function ShareIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
      />
    </svg>
  )
}

export default function ShareProductButton({ title, url, className }: ShareProductButtonProps) {
  const [copied, setCopied] = useState(false)

  const onShare = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const shareUrl = absoluteShareUrl(url)
    const payload = { title, url: shareUrl, text: title }
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(payload)
        return
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
    }
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      aria-label={copied ? 'Link copied' : 'Share product'}
      onClick={(event) => void onShare(event)}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-store-border bg-store-bg text-store-text shadow-sm ${className ?? ''}`}
    >
      {copied ? <span className="text-[10px] font-bold">OK</span> : <ShareIcon />}
    </button>
  )
}
