export function getStorefrontPortalRoot(): HTMLElement {
  return document.querySelector<HTMLElement>('.store-theme') ?? document.body
}
