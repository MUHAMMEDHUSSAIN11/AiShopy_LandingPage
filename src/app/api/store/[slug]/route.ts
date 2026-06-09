import { NextResponse } from 'next/server'
import { findStoreBySlug } from '@/lib/mock-data'

type RouteContext = {
  params: Promise<{ slug: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params
  const store = findStoreBySlug(slug)

  if (!store) {
    return NextResponse.json({ error: 'Store not found' }, { status: 404 })
  }

  return NextResponse.json(store)
}
