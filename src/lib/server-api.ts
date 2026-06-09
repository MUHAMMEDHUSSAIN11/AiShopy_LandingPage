import 'server-only'
import { headers } from 'next/headers'
import { STORE_SLUG_HEADER } from '@/lib/tenant'

/**
 * Resolves the base URL for internal API calls from server components.
 *
 * Subdomain hosts like fashionhub.localhost:3000 work in the browser but often
 * fail in Node.js server-side fetch. Loop back via 127.0.0.1 in development.
 *
 * TODO: Set NEXT_PUBLIC_APP_URL in production for reliable server-side fetches.
 */
export async function getApiBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }

  const headerList = await headers()
  const host = headerList.get('host')

  if (!host) {
    return 'http://127.0.0.1:3000'
  }

  const [hostname, port = '3000'] = host.split(':')
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

  const isLocalDev =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost')

  if (isLocalDev) {
    return `${protocol}://127.0.0.1:${port}`
  }

  return `${protocol}://${host}`
}

export async function getStoreSlugFromHeaders(): Promise<string | null> {
  const headerList = await headers()
  return headerList.get(STORE_SLUG_HEADER)
}
