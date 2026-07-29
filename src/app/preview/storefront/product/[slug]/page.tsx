import { notFound } from 'next/navigation'
import PreviewStorefrontShell from '@/components/store/PreviewStorefrontShell'
import { getTemplatePack } from '@/components/store/templates'
import { getDemoProductBySlug } from '@/lib/demo-fixtures'
import { buildPreviewStoreContext } from '@/lib/preview-store'

type PreviewProductPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ template?: string; primary?: string; mode?: string }>
}

export default async function PreviewProductPage({
  params,
  searchParams,
}: PreviewProductPageProps) {
  const { slug } = await params
  const product = getDemoProductBySlug(slug)
  if (!product) notFound()

  const ctx = buildPreviewStoreContext(await searchParams)
  const ProductView = getTemplatePack(ctx.themeConfig.template).ProductDetail

  return (
    <PreviewStorefrontShell previewQuery={ctx.query} themeConfig={ctx.themeConfig}>
      <ProductView store={ctx.store} product={product} />
    </PreviewStorefrontShell>
  )
}
