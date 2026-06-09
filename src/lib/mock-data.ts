import type { CustomerProfile } from '@/types/customer'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

type ProductSeed = Omit<Product, 'category'>

/**
 * TODO: Replace with production database queries when backend is connected.
 */
export const MOCK_STORES: Store[] = [
  {
    id: '1',
    name: 'Fashion Hub',
    slug: 'fashionhub',
    description: 'Premium fashion store for modern wardrobes.',
    logoUrl: '/logo.png',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
  },
  {
    id: '2',
    name: 'Mobile World',
    slug: 'mobileworld',
    description: 'Latest smartphones, gadgets, and accessories.',
    logoUrl: '/logo.png',
    bannerUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=400&fit=crop',
  },
]

/**
 * TODO: Replace with production database queries when backend is connected.
 */
export const MOCK_PRODUCTS: ProductSeed[] = [
  {
    id: 'p1',
    storeId: '1',
    sku: 'FH-SHIRT-001',
    slug: 'black-cotton-shirt',
    name: 'Black Cotton Shirt',
    description:
      'Premium cotton shirt with a relaxed fit. Perfect for casual and semi-formal occasions.',
    price: 799,
    stock: 24,
    imageUrls: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1622445275463-ada2a1584f66?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p2',
    storeId: '1',
    sku: 'FH-DRESS-002',
    slug: 'floral-summer-dress',
    name: 'Floral Summer Dress',
    description: 'Lightweight floral dress ideal for warm weather and outdoor events.',
    price: 1299,
    stock: 12,
    imageUrls: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p3',
    storeId: '1',
    sku: 'FH-SHOE-003',
    slug: 'white-sneakers',
    name: 'White Sneakers',
    description: 'Comfortable everyday sneakers with cushioned sole and breathable upper.',
    price: 2499,
    stock: 8,
    imageUrls: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p4',
    storeId: '1',
    sku: 'FH-JACKET-004',
    slug: 'denim-jacket',
    name: 'Denim Jacket',
    description: 'Classic denim jacket with durable stitching and timeless style.',
    price: 1899,
    stock: 0,
    imageUrls: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p7',
    storeId: '1',
    sku: 'FH-SHIRT-005',
    slug: 'navy-formal-shirt',
    name: 'Navy Blue Formal Shirt',
    description:
      'Crisp formal shirt with a slim fit. Ideal for office wear and business meetings.',
    price: 999,
    stock: 18,
    imageUrls: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p8',
    storeId: '1',
    sku: 'FH-TEE-006',
    slug: 'red-casual-tee',
    name: 'Red Casual T-Shirt',
    description: 'Soft cotton tee with a modern fit. A wardrobe essential for everyday style.',
    price: 499,
    stock: 35,
    imageUrls: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p9',
    storeId: '1',
    sku: 'FH-DRESS-007',
    slug: 'emerald-maxi-dress',
    name: 'Emerald Maxi Dress',
    description:
      'Elegant floor-length dress with flowing fabric. Perfect for parties and evening events.',
    price: 2199,
    stock: 6,
    imageUrls: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p10',
    storeId: '1',
    sku: 'FH-BELT-008',
    slug: 'leather-belt',
    name: 'Genuine Leather Belt',
    description: 'Handcrafted leather belt with a brushed metal buckle. Fits waist sizes 28–36.',
    price: 699,
    stock: 20,
    imageUrls: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p11',
    storeId: '1',
    sku: 'FH-SHOE-009',
    slug: 'brown-leather-loafers',
    name: 'Brown Leather Loafers',
    description: 'Hand-stitched loafers with cushioned insole. Smart casual footwear for all seasons.',
    price: 3299,
    stock: 9,
    imageUrls: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p12',
    storeId: '1',
    sku: 'FH-SAREE-010',
    slug: 'silk-banarasi-saree',
    name: 'Silk Banarasi Saree',
    description:
      'Traditional Banarasi silk saree with intricate zari work. Includes matching blouse piece.',
    price: 5499,
    stock: 4,
    imageUrls: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p13',
    storeId: '1',
    sku: 'FH-SHOE-011',
    slug: 'running-shoes',
    name: 'Performance Running Shoes',
    description:
      'Lightweight running shoes with responsive cushioning and breathable mesh upper.',
    price: 2799,
    stock: 14,
    imageUrls: [
      'https://images.unsplash.com/photo-1606107557195-0a29cbf1f2b2?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p14',
    storeId: '1',
    sku: 'FH-BLAZER-012',
    slug: 'charcoal-wool-blazer',
    name: 'Charcoal Wool Blazer',
    description:
      'Tailored wool-blend blazer with notch lapels. Elevates any smart-casual outfit.',
    price: 3999,
    stock: 7,
    imageUrls: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p15',
    storeId: '1',
    sku: 'FH-BAG-013',
    slug: 'canvas-tote-bag',
    name: 'Canvas Tote Bag',
    description: 'Spacious everyday tote with inner pocket. Durable canvas with leather handles.',
    price: 899,
    stock: 22,
    imageUrls: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p16',
    storeId: '1',
    sku: 'FH-POLO-014',
    slug: 'striped-polo-shirt',
    name: 'Striped Polo Shirt',
    description: 'Classic striped polo in breathable pique cotton. Great for weekend outings.',
    price: 849,
    stock: 16,
    imageUrls: [
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p17',
    storeId: '1',
    sku: 'FH-JEANS-015',
    slug: 'high-waist-jeans',
    name: 'High-Waist Slim Jeans',
    description:
      'Stretch denim jeans with a flattering high-rise fit. Available in classic indigo wash.',
    price: 1599,
    stock: 11,
    imageUrls: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p18',
    storeId: '1',
    sku: 'FH-ACC-016',
    slug: 'aviator-sunglasses',
    name: 'Aviator Sunglasses',
    description:
      'UV400 polarized aviator sunglasses with metal frame. Includes protective carry case.',
    price: 1199,
    stock: 28,
    imageUrls: [
      'https://images.unsplash.com/photo-1572635196233-1594d0751589?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p19',
    storeId: '1',
    sku: 'FH-KURTA-017',
    slug: 'cotton-kurta-set',
    name: 'Cotton Kurta Set',
    description:
      'Breathable cotton kurta with matching pyjama. Comfortable ethnic wear for festivals and gatherings.',
    price: 1799,
    stock: 13,
    imageUrls: [
      'https://images.unsplash.com/photo-1610030469667-1d78808f1a0e?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p20',
    storeId: '1',
    sku: 'FH-HOODIE-018',
    slug: 'grey-pullover-hoodie',
    name: 'Grey Pullover Hoodie',
    description:
      'Cozy fleece-lined hoodie with kangaroo pocket. Unisex fit for relaxed everyday comfort.',
    price: 1399,
    stock: 0,
    imageUrls: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p5',
    storeId: '2',
    sku: 'MW-PHONE-001',
    slug: 'smartphone-pro',
    name: 'Smartphone Pro',
    description: 'Flagship smartphone with advanced camera and all-day battery life.',
    price: 45999,
    stock: 15,
    imageUrls: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p6',
    storeId: '2',
    sku: 'MW-BUDS-002',
    slug: 'wireless-earbuds',
    name: 'Wireless Earbuds',
    description: 'Noise-cancelling wireless earbuds with premium sound quality.',
    price: 2999,
    stock: 30,
    imageUrls: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p21',
    storeId: '2',
    sku: 'MW-TAB-003',
    slug: 'tablet-pro-11',
    name: 'Tablet Pro 11"',
    description: '11-inch tablet with stylus support, 128GB storage, and all-day battery.',
    price: 32999,
    stock: 10,
    imageUrls: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p22',
    storeId: '2',
    sku: 'MW-WATCH-004',
    slug: 'smart-watch-series',
    name: 'Smart Watch Series X',
    description: 'Fitness tracking, heart-rate monitor, GPS, and 7-day battery life.',
    price: 8999,
    stock: 18,
    imageUrls: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p23',
    storeId: '2',
    sku: 'MW-PB-005',
    slug: 'power-bank-20000',
    name: 'Power Bank 20000mAh',
    description: 'Fast-charging power bank with dual USB-C ports and LED display.',
    price: 1499,
    stock: 45,
    imageUrls: [
      'https://images.unsplash.com/photo-1609091839311-ffe7952936fb?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p24',
    storeId: '2',
    sku: 'MW-CABLE-006',
    slug: 'usb-c-braided-cable',
    name: 'USB-C Braided Cable 2m',
    description: 'Durable braided nylon cable supporting 60W fast charging and data transfer.',
    price: 399,
    stock: 80,
    imageUrls: [
      'https://images.unsplash.com/photo-1625948517791-4c9bf572fceb?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p25',
    storeId: '2',
    sku: 'MW-CASE-007',
    slug: 'silicone-phone-case',
    name: 'Silicone Phone Case',
    description: 'Soft-touch silicone case with raised edges for screen and camera protection.',
    price: 599,
    stock: 55,
    imageUrls: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p26',
    storeId: '2',
    sku: 'MW-STAND-008',
    slug: 'aluminium-laptop-stand',
    name: 'Aluminium Laptop Stand',
    description: 'Ergonomic adjustable stand compatible with laptops up to 17 inches.',
    price: 1899,
    stock: 22,
    imageUrls: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p27',
    storeId: '2',
    sku: 'MW-SPK-009',
    slug: 'bluetooth-speaker',
    name: 'Portable Bluetooth Speaker',
    description: '360° sound with IPX7 waterproof rating and 12-hour playtime.',
    price: 3499,
    stock: 16,
    imageUrls: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p28',
    storeId: '2',
    sku: 'MW-HEADSET-010',
    slug: 'gaming-headset',
    name: 'Gaming Headset 7.1',
    description: 'Surround sound gaming headset with noise-cancelling mic and RGB lighting.',
    price: 4299,
    stock: 12,
    imageUrls: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p29',
    storeId: '2',
    sku: 'MW-CHG-011',
    slug: '65w-fast-charger',
    name: '65W GaN Fast Charger',
    description: 'Compact GaN charger with dual ports — charges phone and laptop simultaneously.',
    price: 2199,
    stock: 0,
    imageUrls: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p30',
    storeId: '2',
    sku: 'MW-PROT-012',
    slug: 'tempered-glass-protector',
    name: 'Tempered Glass Screen Protector',
    description: '9H hardness tempered glass with oleophobic coating. Easy bubble-free install.',
    price: 299,
    stock: 100,
    imageUrls: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p31',
    storeId: '2',
    sku: 'MW-SSD-013',
    slug: 'portable-ssd-1tb',
    name: 'Portable SSD 1TB',
    description: 'Pocket-sized SSD with 1050MB/s read speed. USB 3.2 Gen 2 compatible.',
    price: 7999,
    stock: 8,
    imageUrls: [
      'https://images.unsplash.com/photo-1597872200969-2b65d8cdc2b2?w=600&h=600&fit=crop',
    ],
  },
  {
    id: 'p32',
    storeId: '2',
    sku: 'MW-TV-014',
    slug: 'smart-tv-stick',
    name: 'Smart TV Stick 4K',
    description: '4K HDR streaming stick with voice remote and built-in Chromecast support.',
    price: 4999,
    stock: 20,
    imageUrls: [
      'https://images.unsplash.com/photo-1593359677873-a84807b2126f?w=600&h=600&fit=crop',
    ],
  },
]

/**
 * TODO: Replace with production customer database lookup.
 */
export const MOCK_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'c1',
    phone: '9876543210',
    name: 'Rahul Sharma',
    addressLine1: '42 MG Road',
    addressLine2: 'Near City Mall',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
  },
  {
    id: 'c2',
    phone: '9123456789',
    name: 'Priya Patel',
    addressLine1: '15 Park Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  },
  {
    id: 'c3',
    phone: '9988776655',
    name: 'Ananya Reddy',
    addressLine1: '88 Jubilee Hills',
    addressLine2: 'Road No. 36',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
  },
  {
    id: 'c4',
    phone: '8765432109',
    name: 'Vikram Singh',
    addressLine1: '7 Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
  },
  {
    id: 'c5',
    phone: '9001234567',
    name: 'Meera Nair',
    addressLine1: '23 Marine Drive',
    addressLine2: 'Apt 4B',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682001',
  },
]

export function getAllStores(): Store[] {
  return MOCK_STORES
}

export function getStoreProductCount(storeSlug: string): number {
  return findProductsByStoreSlug(storeSlug).length
}

const PRODUCT_CATEGORY_MAP: Record<string, string> = {
  p1: 'Shirts',
  p2: 'Dresses',
  p3: 'Shoes',
  p4: 'Jackets',
  p7: 'Shirts',
  p8: 'Shirts',
  p9: 'Dresses',
  p10: 'Accessories',
  p11: 'Shoes',
  p12: 'Ethnic',
  p13: 'Shoes',
  p14: 'Jackets',
  p15: 'Accessories',
  p16: 'Shirts',
  p17: 'Bottoms',
  p18: 'Accessories',
  p19: 'Ethnic',
  p20: 'Jackets',
  p5: 'Phones',
  p6: 'Audio',
  p21: 'Tablets',
  p22: 'Wearables',
  p23: 'Accessories',
  p24: 'Accessories',
  p25: 'Accessories',
  p26: 'Accessories',
  p27: 'Audio',
  p28: 'Audio',
  p29: 'Accessories',
  p30: 'Accessories',
  p31: 'Storage',
  p32: 'Streaming',
}

function withCategory(product: ProductSeed): Product {
  return {
    ...product,
    category: product.category ?? PRODUCT_CATEGORY_MAP[product.id] ?? 'Other',
  }
}

export function findStoreBySlug(slug: string): Store | undefined {
  return MOCK_STORES.find((store) => store.slug === slug)
}

export function findProductsByStoreSlug(storeSlug: string): Product[] {
  const store = findStoreBySlug(storeSlug)
  if (!store) return []
  return MOCK_PRODUCTS.filter((product) => product.storeId === store.id).map(withCategory)
}

export function findProductBySlug(storeSlug: string, productSlug: string): Product | undefined {
  return findProductsByStoreSlug(storeSlug).find((product) => product.slug === productSlug)
}

export function findProductById(productId: string): Product | undefined {
  const product = MOCK_PRODUCTS.find((item) => item.id === productId)
  return product ? withCategory(product) : undefined
}

export function findCustomerByPhone(phone: string): CustomerProfile | undefined {
  return MOCK_CUSTOMERS.find((customer) => customer.phone === phone)
}
