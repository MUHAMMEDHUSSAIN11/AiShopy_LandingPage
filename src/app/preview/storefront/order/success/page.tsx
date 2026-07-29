import PreviewStorefrontShell from '@/components/store/PreviewStorefrontShell'
import { getTemplatePack } from '@/components/store/templates'
import { buildPreviewStoreContext } from '@/lib/preview-store'

type PreviewOrderSuccessPageProps = {
  searchParams: Promise<{ template?: string; primary?: string; mode?: string; orderId?: string }>
}

export default async function PreviewOrderSuccessPage({
  searchParams,
}: PreviewOrderSuccessPageProps) {
  const sp = await searchParams
  const ctx = buildPreviewStoreContext(sp)
  const OrderSuccess = getTemplatePack(ctx.themeConfig.template).OrderSuccess

  return (
    <PreviewStorefrontShell previewQuery={ctx.query} themeConfig={ctx.themeConfig}>
      <OrderSuccess store={ctx.store} orderId={sp.orderId ?? 'DEMO-001'} />
    </PreviewStorefrontShell>
  )
}
