const EXTRA_DARK_BACKGROUND = '#000000'
const LEGACY_DARK_BACKGROUND = '#111111'

/** Detect Extra Dark, including stores saved with the removed Dark surface. */
export function isExtraDarkStoreBackground(hex?: string | null): boolean {
  const normalized = hex?.toUpperCase()
  return normalized === EXTRA_DARK_BACKGROUND || normalized === LEGACY_DARK_BACKGROUND
}
