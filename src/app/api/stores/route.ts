import { NextResponse } from 'next/server'
import { getAllStores, getStoreProductCount } from '@/lib/mock-data'

/**
 * TODO: Replace with production store listing API.
 */
export async function GET() {
  const stores = getAllStores().map((store) => ({
    ...store,
    productCount: getStoreProductCount(store.slug),
  }))

  return NextResponse.json(stores)
}
