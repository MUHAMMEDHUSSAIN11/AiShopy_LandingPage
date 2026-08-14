const DARK_BACKGROUND = '#000000'
/** Old flat dark surface — treated as Dark for stores saved before glass Dark. */
const LEGACY_FLAT_DARK_BACKGROUND = '#111111'

/** Detect Dark storefront background, including the removed flat #111111 surface. */
export function isDarkStoreBackground(hex?: string | null): boolean {
  const normalized = hex?.toUpperCase()
  return normalized === DARK_BACKGROUND || normalized === LEGACY_FLAT_DARK_BACKGROUND
}
