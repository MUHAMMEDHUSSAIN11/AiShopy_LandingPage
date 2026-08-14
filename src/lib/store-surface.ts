/** Detect light vs dark storefront from configured background hex. */
export function isDarkStoreBackground(hex?: string | null): boolean {
  if (!hex || !/^#[0-9A-Fa-f]{6}$/.test(hex)) return false
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.45
}

export function isExtraDarkStoreBackground(hex?: string | null): boolean {
  return hex?.toUpperCase() === '#000000'
}
