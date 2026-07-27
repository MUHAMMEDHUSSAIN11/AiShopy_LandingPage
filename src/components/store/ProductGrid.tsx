'use client'

import CatalogProductList from '@/components/store/CatalogProductList'
import { useStoreTemplate } from '@/contexts/StoreTemplateContext'
import type { Product } from '@/types/product'
import type { StoreTemplateId } from '@/types/store'

type ProductGridProps = {
  storeSlug: string
  products: Product[]
  template?: StoreTemplateId
}

export default function ProductGrid(props: ProductGridProps) {
  const templateFromContext = useStoreTemplate()
  const template = props.template ?? templateFromContext
  return <CatalogProductList {...props} template={template} />
}
