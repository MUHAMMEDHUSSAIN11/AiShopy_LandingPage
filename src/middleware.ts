import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DOMAIN_PENDING_HEADER, STORE_SLUG_HEADER } from '@/lib/tenant'

const RESERVED_SUBDOMAINS = new Set(['www', 'api', 'app', 'admin', 'mail'])
const PLATFORM_HOSTS = new Set(['aishopy.io', 'www.aishopy.io', 'localhost', '127.0.0.1'])

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

async function resolveCustomDomain(host: string): Promise<{ slug: string | null; pending: boolean }> {
  const hostname = host.split(':')[0].toLowerCase()
  if (!hostname || PLATFORM_HOSTS.has(hostname)) return { slug: null, pending: false }
  if (hostname.endsWith('.aishopy.io') || hostname.endsWith('.localhost')) {
    return { slug: null, pending: false }
  }

  const api = process.env.NEXT_PUBLIC_AISHOPY_API_URL?.replace(/\/$/, '')
  if (!api) return { slug: null, pending: false }

  try {
    const response = await fetch(
      `${api}/api/public/resolve-host?host=${encodeURIComponent(hostname)}`,
      { headers: { Accept: 'application/json' } },
    )
    if (!response.ok) return { slug: null, pending: false }
    const body = (await response.json()) as { data?: { slug?: string | null; pending?: boolean } }
    const slug = body.data?.slug?.trim() || null
    return { slug, pending: body.data?.pending === true && !slug }
  } catch {
    return { slug: null, pending: false }
  }
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const subdomainSlug = extractStoreSlug(host)
  const custom = subdomainSlug ? { slug: null, pending: false } : await resolveCustomDomain(host)
  const storeSlug = subdomainSlug ?? custom.slug

  if (custom.pending) {
    const url = request.nextUrl.clone()
    url.pathname = '/domain-pending'
    url.search = ''
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(DOMAIN_PENDING_HEADER, '1')
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
  }

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
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|favicon-16.png|favicon-32.png|favicon-48.png|apple-touch-icon.png|app-icon.png|icon-192.png|icon-512.png|site.webmanifest|logo.png).*)',
  ],
}
