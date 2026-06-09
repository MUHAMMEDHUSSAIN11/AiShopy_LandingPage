import { NextResponse } from 'next/server'
import { AishopyApiError, fetchPublicCatalog } from '@/lib/aishopy-api'

type RouteContext = {
  params: Promise<{ slug: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params

  try {
    const catalog = await fetchPublicCatalog(slug)
    return NextResponse.json(catalog.store)
  } catch (error) {
    if (error instanceof AishopyApiError) {
      if (error.code === 'STORE_NOT_RESOLVED') {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 502 })
    }

    return NextResponse.json({ error: 'Failed to load store' }, { status: 500 })
  }
}
