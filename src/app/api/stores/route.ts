import { NextResponse } from 'next/server'

/**
 * Store listing is resolved per subdomain. Use /api/catalog?storeSlug={slug} instead.
 */
export async function GET() {
  return NextResponse.json([])
}
