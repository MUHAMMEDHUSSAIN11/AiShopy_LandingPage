'use client'

import type { ComponentType } from 'react'
import ProductCardBold from '@/components/store/cards/ProductCardBold'
import ProductCardClassic from '@/components/store/cards/ProductCardClassic'
import ProductCardMinimal from '@/components/store/cards/ProductCardMinimal'
import type { Product } from '@/types/product'
import type { ProductCardStyle } from '@/types/store'

type ProductCardProps = {
  storeSlug: string
  product: Product
  cardStyle?: ProductCardStyle
}

const CARD_STYLES: Record<ProductCardStyle, ComponentType<{ storeSlug: string; product: Product }>> = {
  classic: ProductCardClassic,
  minimal: ProductCardMinimal,
  bold: ProductCardBold,
}

/** Dispatches to the card style chosen in theme_config.productCard (default: classic). */
export default function ProductCard({ storeSlug, product, cardStyle }: ProductCardProps) {
  const Card = (cardStyle && CARD_STYLES[cardStyle]) || CARD_STYLES.classic
  return <Card storeSlug={storeSlug} product={product} />
}
