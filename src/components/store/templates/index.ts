import type { ComponentType } from 'react'
import BoutiqueCatalog from '@/components/store/templates/boutique/BoutiqueCatalog'
import BoutiqueCart from '@/components/store/templates/boutique/BoutiqueCart'
import BoutiqueCheckout from '@/components/store/templates/boutique/BoutiqueCheckout'
import BoutiqueOrderSuccess from '@/components/store/templates/boutique/BoutiqueOrderSuccess'
import BoutiqueProduct from '@/components/store/templates/boutique/BoutiqueProduct'
import ClassicCatalog from '@/components/store/templates/classic/ClassicCatalog'
import ClassicCart from '@/components/store/templates/classic/ClassicCart'
import ClassicCheckout from '@/components/store/templates/classic/ClassicCheckout'
import ClassicOrderSuccess from '@/components/store/templates/classic/ClassicOrderSuccess'
import ClassicProduct from '@/components/store/templates/classic/ClassicProduct'
import ModernCatalog from '@/components/store/templates/modern/ModernCatalog'
import ModernCart from '@/components/store/templates/modern/ModernCart'
import ModernCheckout from '@/components/store/templates/modern/ModernCheckout'
import ModernOrderSuccess from '@/components/store/templates/modern/ModernOrderSuccess'
import ModernProduct from '@/components/store/templates/modern/ModernProduct'
import type {
  CartTemplateProps,
  CatalogTemplateProps,
  CheckoutTemplateProps,
  OrderSuccessTemplateProps,
  ProductTemplateProps,
} from '@/components/store/templates/types'
import type { StoreTemplateId } from '@/types/store'

export type { CatalogTemplateProps } from '@/components/store/templates/types'

export type TemplatePack = {
  Catalog: ComponentType<CatalogTemplateProps>
  ProductDetail: ComponentType<ProductTemplateProps>
  Cart: ComponentType<CartTemplateProps>
  Checkout: ComponentType<CheckoutTemplateProps>
  OrderSuccess: ComponentType<OrderSuccessTemplateProps>
}

const TEMPLATE_PACKS: Record<StoreTemplateId, TemplatePack> = {
  classic: {
    Catalog: ClassicCatalog,
    ProductDetail: ClassicProduct,
    Cart: ClassicCart,
    Checkout: ClassicCheckout,
    OrderSuccess: ClassicOrderSuccess,
  },
  boutique: {
    Catalog: BoutiqueCatalog,
    ProductDetail: BoutiqueProduct,
    Cart: BoutiqueCart,
    Checkout: BoutiqueCheckout,
    OrderSuccess: BoutiqueOrderSuccess,
  },
  modern: {
    Catalog: ModernCatalog,
    ProductDetail: ModernProduct,
    Cart: ModernCart,
    Checkout: ModernCheckout,
    OrderSuccess: ModernOrderSuccess,
  },
}

/** @deprecated Use getTemplatePack().Catalog */
export function getCatalogTemplate(template?: StoreTemplateId) {
  return getTemplatePack(template).Catalog
}

export function getTemplatePack(template?: StoreTemplateId): TemplatePack {
  return (template && TEMPLATE_PACKS[template]) || TEMPLATE_PACKS.classic
}
