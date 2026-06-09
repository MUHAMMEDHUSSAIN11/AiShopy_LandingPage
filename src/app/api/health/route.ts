import { NextResponse } from 'next/server'
import { getAllStores, getStoreProductCount } from '@/lib/mock-data'

/**
 * Dummy health + API discovery endpoint.
 * TODO: Remove or restrict in production once real APIs are live.
 */
export async function GET() {
  const stores = getAllStores().map((store) => ({
    slug: store.slug,
    name: store.name,
    productCount: getStoreProductCount(store.slug),
    storefrontUrl: `https://${store.slug}.aishopy.io`,
    localUrl: `http://${store.slug}.localhost:3000`,
  }))

  return NextResponse.json({
    status: 'ok',
    mode: 'dummy',
    message: 'All APIs return mock data. Replace route handlers with production APIs later.',
    stores,
    endpoints: [
      { method: 'GET', path: '/api/health', description: 'This endpoint — API discovery' },
      { method: 'GET', path: '/api/store/{slug}', example: '/api/store/fashionhub' },
      {
        method: 'GET',
        path: '/api/products?storeSlug={slug}',
        example: '/api/products?storeSlug=fashionhub',
      },
      {
        method: 'GET',
        path: '/api/products?id={productId}',
        example: '/api/products?id=p1',
      },
      {
        method: 'GET',
        path: '/api/product/{slug}?storeSlug={slug}',
        example: '/api/product/black-cotton-shirt?storeSlug=fashionhub',
      },
      {
        method: 'POST',
        path: '/api/customer/check',
        body: { phone: '9876543210' },
        description: 'Returns exists:true for mock customers',
      },
      {
        method: 'POST',
        path: '/api/order/create',
        body: {
          storeSlug: 'fashionhub',
          productId: 'p1',
          customer: {
            name: 'Test User',
            phone: '9999999999',
            addressLine1: '123 Test St',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560001',
          },
        },
      },
    ],
    mockCustomers: [
      { phone: '9876543210', name: 'Rahul Sharma' },
      { phone: '9123456789', name: 'Priya Patel' },
      { phone: '9988776655', name: 'Ananya Reddy' },
      { phone: '8765432109', name: 'Vikram Singh' },
      { phone: '9001234567', name: 'Meera Nair' },
    ],
  })
}
