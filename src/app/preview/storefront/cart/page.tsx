import PreviewStorefrontShell from '@/components/store/PreviewStorefrontShell'
import { getTemplatePack } from '@/components/store/templates'
import { buildPreviewStoreContext } from '@/lib/preview-store'

type PreviewCartPageProps = {
  searchParams: Promise<{ template?: string; primary?: string; mode?: string }>
}

export default async function PreviewCartPage({ searchParams }: PreviewCartPageProps) {
  const ctx = buildPreviewStoreContext(await searchParams)
  const Cart = getTemplatePack(ctx.themeConfig.template).Cart

  return (
    <PreviewStorefrontShell previewQuery={ctx.query} themeConfig={ctx.themeConfig}>
      <Cart store={ctx.store} />
    </PreviewStorefrontShell>
  )
}
