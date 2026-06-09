import { NextResponse } from 'next/server'

const AISHOOPY_API_URL =
  process.env.AISHOOPY_API_URL?.replace(/\/$/, '') ?? 'https://aishopy.up.railway.app'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    mode: 'production',
    catalogApi: `${AISHOOPY_API_URL}/api/public/catalog`,
    endpoints: [
      { method: 'GET', path: '/api/health', description: 'This endpoint — API discovery' },
      {
        method: 'GET',
        path: '/api/catalog?storeSlug={slug}',
        example: '/api/catalog?storeSlug=my-shop',
      },
      { method: 'GET', path: '/api/store/{slug}', example: '/api/store/my-shop' },
      {
        method: 'GET',
        path: '/api/products?storeSlug={slug}',
        example: '/api/products?storeSlug=my-shop',
      },
      {
        method: 'GET',
        path: '/api/products?id={productId}&storeSlug={slug}',
        example: '/api/products?id=1&storeSlug=my-shop',
      },
      {
        method: 'GET',
        path: '/api/product/{slug}?storeSlug={slug}',
        example: '/api/product/black-shirt?storeSlug=my-shop',
      },
      {
        method: 'POST',
        path: '/api/customer/check',
        body: { phone: '9876543210' },
        description: 'Mock customer lookup until production API is connected',
      },
      {
        method: 'POST',
        path: '/api/order/create',
        body: {
          storeSlug: 'my-shop',
          productId: '1',
          customer: {
            name: 'Test User',
            phone: '9999999999',
            addressLine1: '123 Test St',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560001',
          },
        },
        description: 'Mock order creation until production API is connected',
      },
    ],
  })
}
