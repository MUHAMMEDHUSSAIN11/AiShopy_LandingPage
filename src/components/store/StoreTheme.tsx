import type { ReactNode } from 'react'
import { StoreTemplateProvider } from '@/contexts/StoreTemplateContext'
import { getTemplateId, getThemeStyle, isDarkTheme } from '@/lib/store-theme'
import type { ThemeConfig } from '@/types/store'

type StoreThemeProps = {
  themeConfig?: ThemeConfig | null
  children: ReactNode
}

/**
 * Server-rendered wrapper for storefront routes. Applies the store's theme
 * colors as CSS variable overrides via inline style, so every store-*
 * Tailwind token underneath resolves per-store with no client-side flash.
 */
export default function StoreTheme({ themeConfig, children }: StoreThemeProps) {
  const template = getTemplateId(themeConfig)
  const surface = isDarkTheme(themeConfig) ? 'dark' : 'light'

  return (
    <div
      className="store-theme"
      data-template={template}
      data-surface={surface}
      style={getThemeStyle(themeConfig)}
    >
      <StoreTemplateProvider template={template}>{children}</StoreTemplateProvider>
    </div>
  )
}
