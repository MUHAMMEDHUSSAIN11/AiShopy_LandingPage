import type { CSSProperties } from 'react'
import { isDarkStoreBackground, isExtraDarkStoreBackground } from '@/lib/store-surface'
import type { StoreTemplateId, ThemeConfig } from '@/types/store'

const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

function hexToRgbTriple(hex: string): string | null {
  const value = hex.slice(1)
  const full =
    value.length === 3
      ? value
          .split('')
          .map((char) => char + char)
          .join('')
      : value

  const num = Number.parseInt(full, 16)
  if (Number.isNaN(num)) return null

  return `${(num >> 16) & 255} ${(num >> 8) & 255} ${num & 255}`
}

/**
 * Builds the inline-style CSS variable overrides for a store's theme.
 * Returns undefined when there is nothing to override, so stores without
 * a theme_config render the default palette from globals.css unchanged.
 *
 * Only valid #RGB/#RRGGBB values are applied — anything else is ignored
 * rather than producing broken CSS.
 */
export function getThemeStyle(themeConfig?: ThemeConfig | null): CSSProperties | undefined {
  const colors = themeConfig?.colors
  if (!colors) return undefined

  const style: Record<string, string> = {}
  const dark = isDarkStoreBackground(colors.background)
  const extraDark = isExtraDarkStoreBackground(colors.background)

  if (colors.primary && HEX_COLOR_RE.test(colors.primary)) {
    const rgb = hexToRgbTriple(colors.primary)
    if (rgb) style['--store-primary-rgb'] = rgb
  }

  if (colors.background && HEX_COLOR_RE.test(colors.background)) {
    const rgb = hexToRgbTriple(colors.background)
    if (rgb) {
      style['--store-bg-rgb'] = rgb
      if (extraDark) {
        style['--store-bg-shell'] = '#000000'
      } else {
        style['--store-bg-shell'] = dark
          ? `color-mix(in srgb, rgb(${rgb}) 92%, #ffffff)`
          : `color-mix(in srgb, rgb(${rgb}) 97%, #000000)`
      }
    }
  }

  if (colors.text && HEX_COLOR_RE.test(colors.text)) {
    const rgb = hexToRgbTriple(colors.text)
    if (rgb) style['--store-text-rgb'] = rgb
  }

  if (dark || extraDark) {
    style['--store-muted-rgb'] = '161 161 170'
    style['--store-border-rgb'] = '63 63 70'
    style['--store-subtle-rgb'] = '39 39 42'
  } else {
    style['--store-muted-rgb'] = '107 114 128'
    style['--store-border-rgb'] = '229 231 235'
    style['--store-subtle-rgb'] = '249 250 251'
  }

  return Object.keys(style).length > 0 ? (style as CSSProperties) : undefined
}

export function getTemplateId(themeConfig?: ThemeConfig | null): StoreTemplateId {
  const t = themeConfig?.template
  return t === 'boutique' || t === 'modern' ? t : 'classic'
}

export function isDarkTheme(themeConfig?: ThemeConfig | null): boolean {
  return isDarkStoreBackground(themeConfig?.colors?.background)
}
