'use client'

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { previewHref, type PreviewQuery } from '@/lib/preview-paths'

type PreviewContextValue = {
  isPreview: boolean
  previewQuery: PreviewQuery
  getHref: (path: string) => string
}

const PreviewContext = createContext<PreviewContextValue>({
  isPreview: false,
  previewQuery: {},
  getHref: (path) => path,
})

export function PreviewProvider({
  children,
  previewQuery,
}: {
  children: ReactNode
  previewQuery: PreviewQuery
}) {
  const getHref = useCallback(
    (path: string) => previewHref(path, previewQuery),
    [previewQuery],
  )

  const value = useMemo(
    () => ({
      isPreview: true,
      previewQuery,
      getHref,
    }),
    [previewQuery, getHref],
  )

  return <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
}

export function usePreview() {
  return useContext(PreviewContext)
}

/** Preview-aware href; on live storefront returns the path unchanged. */
export function useStoreHref() {
  const { getHref } = usePreview()
  return getHref
}
