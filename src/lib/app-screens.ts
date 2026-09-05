export type AppScreenSlide = {
  src: string
  alt: string
  label: string
}

/** Curated owner-app screenshots for the hero phone carousel. */
export const APP_SCREEN_SLIDES: readonly AppScreenSlide[] = [
  {
    src: '/landing/app-screens/products-light.jpg',
    alt: 'AiShopy products list in light mode',
    label: 'Products',
  },
  {
    src: '/landing/app-screens/products-dark.jpg',
    alt: 'AiShopy products list in dark mode',
    label: 'Products',
  },
  {
    src: '/landing/app-screens/product-detail.jpg',
    alt: 'AiShopy product detail and inventory',
    label: 'Product detail',
  },
  {
    src: '/landing/app-screens/orders-light.jpg',
    alt: 'AiShopy orders list with status pills',
    label: 'Orders',
  },
  {
    src: '/landing/app-screens/admin-dashboard.jpg',
    alt: 'AiShopy admin dashboard for channels and staff',
    label: 'Admin',
  },
  {
    src: '/landing/app-screens/create-order.jpg',
    alt: 'AiShopy create order flow',
    label: 'Create order',
  },
] as const
