import { NextResponse } from 'next/server'

const AISHOPY_API_URL =
  process.env.AISHOPY_API_URL?.replace(/\/$/, '')
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    mode: 'production',
    catalogApi: `${AISHOPY_API_URL}/api/public/catalog`,
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
        body: { storeSlug: 'my-shop', phone_number: '9876543210' },
        description: 'Customer lookup via GET /api/public/customers/by-phone',
      },
      {
        method: 'POST',
        path: '/api/order/create',
        body: {
          storeSlug: 'my-shop',
          items: [{ productId: '1', variantId: '10', quantity: 2 }],
          shippingAddress: {
            name: 'Test User',
            phone_number: '9999999999',
            address: '123 Test St',
            city: 'Bengaluru',
            district: 'Bengaluru Urban',
            state: 'Karnataka',
            postcode: '560001',
          },
          paymentMethod: 'cod',
        },
        description: 'Order creation via POST /api/public/orders',
      },
    ],
  })
}
