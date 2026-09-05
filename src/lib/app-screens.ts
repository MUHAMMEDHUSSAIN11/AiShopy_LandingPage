export type AppScreenSlide = {
  src: string
  alt: string
  label: string
}

/**
 * Hero carousel order = how AiShopy works in ~10 seconds:
 * run your store in the app → AI sells on WhatsApp → customers buy on your site.
 */
export const APP_SCREEN_SLIDES: readonly AppScreenSlide[] = [
  {
    src: '/landing/app-screens/whatsapp-aireply.png',
    alt: 'WhatsApp AI auto-reply sending product photos, price, and buy link',
    label: 'AI replies on WhatsApp',
  },
  {
    src: '/landing/app-screens/products-dark.jpg',
    alt: 'Manage your product catalog in the AiShopy app',
    label: 'Manage products',
  },
  {
    src: '/landing/app-screens/product-variants-black.png',
    alt: 'Edit product sizes, colors, price, and stock',
    label: 'Sizes, colors & stock',
  },
  {
    src: '/landing/app-screens/orders-light.jpg',
    alt: 'Track customer orders and COD status',
    label: 'Track orders',
  },
  {
    src: '/landing/app-screens/admin-dashboard.jpg',
    alt: 'Connect WhatsApp, Instagram, Chat Boat, staff, and domain',
    label: 'Connect channels',
  },
  {
    src: '/landing/app-screens/website-Custom.jpeg',
    alt: 'Choose a storefront template for your branded website',
    label: 'Design your website',
  },
  {
    src: '/landing/app-screens/website-custom-colour.png',
    alt: 'Customize storefront theme and brand accent colors',
    label: 'Brand colors',
  },
  {
    src: '/landing/app-screens/store-website.png',
    alt: 'Customer-facing storefront catalog on your aishopy.io link',
    label: 'Your live store',
  },
  {
    src: '/landing/app-screens/store-productDetails.png',
    alt: 'Customer product detail page with gallery and variants',
    label: 'Customer product page',
  },
  {
    src: '/landing/app-screens/store-cartPage.png',
    alt: 'Customer cart with total and proceed to checkout',
    label: 'Cart & checkout',
  },
  {
    src: '/landing/app-screens/dashboard.png',
    alt: 'AiShopy owner dashboard with products, orders, chats, and sales',
    label: 'Dashboard overview',
  },
] as const
