'use client'

import PreviewBanner from '@/components/store/PreviewBanner'
import StoreTheme from '@/components/store/StoreTheme'
import { PreviewProvider } from '@/contexts/PreviewContext'
import type { PreviewQuery } from '@/lib/preview-paths'
import type { ThemeConfig } from '@/types/store'
import type { ReactNode } from 'react'

type PreviewStorefrontShellProps = {
  children: ReactNode
  previewQuery: PreviewQuery
  themeConfig: ThemeConfig
}

export default function PreviewStorefrontShell({
  children,
  previewQuery,
  themeConfig,
}: PreviewStorefrontShellProps) {
  return (
    <PreviewProvider previewQuery={previewQuery}>
      <StoreTheme themeConfig={themeConfig}>
        <PreviewBanner />
        {children}
      </StoreTheme>
    </PreviewProvider>
  )
}
