import {
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_STORE,
  DEMO_STORE_SLUG,
  themeFromPreviewQuery,
} from '@/lib/demo-fixtures'
import { parsePreviewQuery, type PreviewQuery } from '@/lib/preview-paths'
import type { Store, ThemeConfig } from '@/types/store'

export type PreviewStoreContext = {
  query: PreviewQuery
  themeConfig: ThemeConfig
  store: Store
  storeSlug: string
}

export function buildPreviewStoreContext(searchParams: {
  template?: string
  primary?: string
  mode?: string
}): PreviewStoreContext {
  const query = parsePreviewQuery(searchParams)
  const themeConfig = themeFromPreviewQuery(query.template, query.primary, query.mode)
  const store: Store = { ...DEMO_STORE, themeConfig }

  return {
    query,
    themeConfig,
    store,
    storeSlug: DEMO_STORE_SLUG,
  }
}

export { DEMO_CATEGORIES, DEMO_PRODUCTS }
