'use client'

import { motion } from 'framer-motion'
import ProductCardBoutique from '@/components/store/cards/ProductCardBoutique'
import ProductCardClassic from '@/components/store/cards/ProductCardClassic'
import ProductCardModern from '@/components/store/cards/ProductCardModern'
import { useStoreTemplate } from '@/contexts/StoreTemplateContext'
import type { Product } from '@/types/product'
import type { StoreTemplateId } from '@/types/store'

type CatalogProductListProps = {
  storeSlug: string
  products: Product[]
  template?: StoreTemplateId
}

const GRID_CLASS: Record<StoreTemplateId, string> = {
  classic:
    'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4',
  boutique: 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-8 xl:gap-10',
  modern: 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5',
}

export default function CatalogProductList({
  storeSlug,
  products,
  template: templateProp,
}: CatalogProductListProps) {
  const templateFromContext = useStoreTemplate()
  const template = templateProp ?? templateFromContext

  const Card =
    template === 'boutique'
      ? ProductCardBoutique
      : template === 'modern'
        ? ProductCardModern
        : ProductCardClassic

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: template === 'boutique' ? 0.08 : 0.04 },
    },
  }

  const item =
    template === 'boutique'
      ? {
          hidden: { opacity: 0, y: 28 },
          show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
        }
      : template === 'modern'
        ? {
            hidden: { opacity: 0, scale: 0.92 },
            show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
          }
        : {
            hidden: { opacity: 0, x: -8 },
            show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
          }

  return (
    <motion.ul
      key={`${template}-${products.map((p) => p.id).join(',')}`}
      className={`${GRID_CLASS[template]} list-none p-0 m-0`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => (
        <motion.li key={product.id} variants={item} className="template-catalog-item">
          <Card storeSlug={storeSlug} product={product} />
        </motion.li>
      ))}
    </motion.ul>
  )
}
