import PreviewStorefrontShell from '@/components/store/PreviewStorefrontShell'
import { getTemplatePack } from '@/components/store/templates'
import {
  buildPreviewStoreContext,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
} from '@/lib/preview-store'

type PreviewCatalogPageProps = {
  searchParams: Promise<{ template?: string; primary?: string; mode?: string }>
}

export default async function PreviewCatalogPage({ searchParams }: PreviewCatalogPageProps) {
  const ctx = buildPreviewStoreContext(await searchParams)
  const Catalog = getTemplatePack(ctx.themeConfig.template).Catalog

  return (
    <PreviewStorefrontShell previewQuery={ctx.query} themeConfig={ctx.themeConfig}>
      <Catalog
        storeSlug={ctx.storeSlug}
        store={ctx.store}
        categories={DEMO_CATEGORIES}
        initialProducts={DEMO_PRODUCTS}
        previewMode
      />
    </PreviewStorefrontShell>
  )
}
