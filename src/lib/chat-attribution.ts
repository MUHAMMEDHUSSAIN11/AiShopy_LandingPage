export const CHAT_SRC_COOKIE = 'aishopy_chat_src'
const CHAT_SRC_RE = /^(wa|ig)_(\d+)$/i
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export function isValidChatSrc(raw: string | null | undefined): boolean {
  return Boolean(raw?.trim().match(CHAT_SRC_RE))
}

export function parseChatSrc(raw: string | null | undefined): number | null {
  const match = raw?.trim().match(CHAT_SRC_RE)
  if (!match) return null
  const conversationId = Number(match[2])
  if (!Number.isInteger(conversationId) || conversationId <= 0) return null
  return conversationId
}

export function persistChatSrc(src: string): void {
  if (typeof document === 'undefined') return
  if (!isValidChatSrc(src)) return
  document.cookie = `${CHAT_SRC_COOKIE}=${encodeURIComponent(src.trim())}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax`
}

export function readChatSrc(): string | null {
  if (typeof document === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const fromQuery = params.get('src')
  if (isValidChatSrc(fromQuery)) {
    persistChatSrc(fromQuery!)
    return fromQuery!.trim()
  }

  const cookies = document.cookie.split(';')
  for (const part of cookies) {
    const [name, ...rest] = part.trim().split('=')
    if (name !== CHAT_SRC_COOKIE) continue
    const value = decodeURIComponent(rest.join('='))
    return isValidChatSrc(value) ? value : null
  }
  return null
}

export function readChatConversationId(): number | null {
  return parseChatSrc(readChatSrc())
}
