import PreviewStorefrontShell from '@/components/store/PreviewStorefrontShell'
import { getTemplatePack } from '@/components/store/templates'
import { buildPreviewStoreContext } from '@/lib/preview-store'

type PreviewCheckoutPageProps = {
  searchParams: Promise<{ template?: string; primary?: string; mode?: string }>
}

export default async function PreviewCheckoutPage({ searchParams }: PreviewCheckoutPageProps) {
  const ctx = buildPreviewStoreContext(await searchParams)
  const Checkout = getTemplatePack(ctx.themeConfig.template).Checkout

  return (
    <PreviewStorefrontShell previewQuery={ctx.query} themeConfig={ctx.themeConfig}>
      <Checkout store={ctx.store} previewMode />
    </PreviewStorefrontShell>
  )
}
