import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import type { Store, ThemeConfig } from '@/types/store'

export const DEMO_STORE_SLUG = 'demo-store'

export const DEMO_STORE: Store = {
  id: 'demo',
  name: 'Demo Boutique',
  slug: DEMO_STORE_SLUG,
  description: 'Sample products to preview your storefront template and colors.',
  logoUrl: 'https://picsum.photos/seed/aishopy-demo-logo/120/120',
  bannerUrl: 'https://picsum.photos/seed/aishopy-demo-banner/1200/400',
  paymentMethods: {
    cod: { enabled: true },
    upi: { enabled: true, vpa: 'demo@upi', displayName: 'Demo Store' },
  },
  themeConfig: undefined,
}

export const DEMO_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'New Arrivals' },
  { id: 'cat-2', name: 'Best Sellers' },
  { id: 'cat-3', name: 'Accessories' },
]

function demoProduct(
  index: number,
  categoryId: string,
  categoryName: string,
  name: string,
  price: number,
): Product {
  const slug = `demo-product-${index}`
  return {
    id: `prod-${index}`,
    storeId: 'demo',
    sku: `DEMO-${index}`,
    slug,
    name,
    description: `${name} — sample product for template preview.`,
    price,
    compareAtPrice: price + 200,
    stock: 25,
    trackInventory: true,
    markAsSold: false,
    markAsNonInventory: false,
    categoryId,
    categoryName,
    imageUrls: [`https://picsum.photos/seed/${slug}/600/600`],
    variants: [],
  }
}

export const DEMO_PRODUCTS: Product[] = [
  demoProduct(1, 'cat-1', 'New Arrivals', 'Linen Summer Shirt', 1299),
  demoProduct(2, 'cat-1', 'New Arrivals', 'Classic Denim Jacket', 2499),
  demoProduct(3, 'cat-2', 'Best Sellers', 'Everyday Tote Bag', 899),
  demoProduct(4, 'cat-2', 'Best Sellers', 'Wireless Earbuds', 1999),
  demoProduct(5, 'cat-2', 'Best Sellers', 'Ceramic Coffee Mug', 499),
  demoProduct(6, 'cat-3', 'Accessories', 'Leather Wallet', 799),
  demoProduct(7, 'cat-3', 'Accessories', 'Minimal Watch', 3499),
  demoProduct(8, 'cat-3', 'Accessories', 'Canvas Cap', 599),
  demoProduct(9, 'cat-1', 'New Arrivals', 'Running Sneakers', 2999),
  demoProduct(10, 'cat-2', 'Best Sellers', 'Scented Candle', 699),
]

export function getDemoProductBySlug(slug: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.slug === slug)
}

export const LIGHT_COLORS = { primary: '#2DB84C', background: '#FFFFFF', text: '#1A1A1A' }
export const DARK_COLORS = { primary: '#2DB84C', background: '#111111', text: '#FAFAFA' }

export function themeFromPreviewQuery(
  template?: string | null,
  primary?: string | null,
  mode?: string | null,
): ThemeConfig {
  const validTemplate =
    template === 'boutique' || template === 'modern' ? template : 'classic'
  const hex = primary && /^#[0-9A-Fa-f]{6}$/.test(primary) ? primary : LIGHT_COLORS.primary
  const colors = mode === 'dark' ? { ...DARK_COLORS, primary: hex } : { ...LIGHT_COLORS, primary: hex }
  return { template: validTemplate, colors }
}
