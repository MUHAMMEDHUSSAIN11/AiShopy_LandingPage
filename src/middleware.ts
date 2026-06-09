import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { STORE_SLUG_HEADER } from '@/lib/tenant'

const RESERVED_SUBDOMAINS = new Set(['www', 'api', 'app', 'admin', 'mail'])

/**
 * Extracts store slug from host for multi-tenant subdomains.
 *
 * Supported patterns:
 * - fashionhub.localhost:3000
 * - fashionhub.aishopy.io
 * - fashionhub.aishopy.io
 */
function extractStoreSlug(host: string): string | null {
  const hostname = host.split(':')[0].toLowerCase()

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null
  }

  if (hostname.endsWith('.localhost')) {
    const slug = hostname.replace('.localhost', '')
    return slug && !RESERVED_SUBDOMAINS.has(slug) ? slug : null
  }

  const platformDomains = ['aishopy.io']

  for (const domain of platformDomains) {
    if (hostname === domain) {
      return null
    }

    if (hostname.endsWith(`.${domain}`)) {
      const slug = hostname.slice(0, -(domain.length + 1))
      if (!slug || slug.includes('.') || RESERVED_SUBDOMAINS.has(slug)) {
        return null
      }
      return slug
    }
  }

  return null
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const storeSlug = extractStoreSlug(host)

  if (!storeSlug) {
    return NextResponse.next()
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(STORE_SLUG_HEADER, storeSlug)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png).*)'],
}
