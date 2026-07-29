const HEX_RE = /^#[0-9A-Fa-f]{6}$/

export type PreviewQuery = {
  template?: string
  primary?: string
  mode?: string
}

export function buildPreviewQueryString(query: PreviewQuery): string {
  const params = new URLSearchParams()
  if (query.template) params.set('template', query.template)
  if (query.primary && HEX_RE.test(query.primary)) params.set('primary', query.primary)
  if (query.mode) params.set('mode', query.mode)
  const s = params.toString()
  return s ? `?${s}` : ''
}

export function previewHref(path: string, query: PreviewQuery): string {
  const base = path.startsWith('/') ? `/preview/storefront${path}` : `/preview/storefront/${path}`
  if (path === '' || path === '/') return `/preview/storefront${buildPreviewQueryString(query)}`
  return `${base}${buildPreviewQueryString(query)}`
}

export function parsePreviewQuery(searchParams: {
  template?: string
  primary?: string
  mode?: string
}): PreviewQuery {
  return {
    template: searchParams.template,
    primary: searchParams.primary,
    mode: searchParams.mode,
  }
}
