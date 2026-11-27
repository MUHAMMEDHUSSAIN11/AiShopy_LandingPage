export const CONTACT_EMAIL = 'aishopyapp@gmail.com'
export const COMPANY_NAME = 'BaytCode Technologies Pvt Ltd'
export const STOREFRONT_DOMAIN = 'AiShopy.io'
export const PRIVACY_URL = 'https://www.aishopy.io/privacy'
export const TERMS_URL = 'https://www.aishopy.io/terms'
export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.aishopy.app'
export const APP_STORE_URL = 'https://apps.apple.com/in/app/aishopy/id6802297718'
export const WEB_APP_URL = 'https://app.aishopy.io'
export const WEB_APP_LOGIN_URL = `${WEB_APP_URL}/login`

/** Digits + country code. Set NEXT_PUBLIC_AISHOPY_WHATSAPP_NUMBER on the landing deployment. */
const AISHOPY_WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_AISHOPY_WHATSAPP_NUMBER ?? '').replace(
  /\D/g,
  '',
)

export const AISHOPY_WHATSAPP_CHAT_TEXT =
  'Hi AiShopy, I am checking the website and want to know more.'

/** wa.me link with the starter message, or null when the env number is missing/invalid. */
export function whatsAppChatUrl(): string | null {
  if (!/^\d{8,15}$/.test(AISHOPY_WHATSAPP_NUMBER)) return null
  return `https://wa.me/${AISHOPY_WHATSAPP_NUMBER}?text=${encodeURIComponent(AISHOPY_WHATSAPP_CHAT_TEXT)}`
}
