import CartPageContent from '@/components/store/CartPageContent'
import type { CartTemplateProps } from '@/components/store/templates/types'

export default function ClassicCart({ store }: CartTemplateProps) {
  return <CartPageContent store={store} layout="classic" showHeader />
}
