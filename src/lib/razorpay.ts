export type RazorpayHandlerResponse = {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description?: string
  image?: string
  prefill?: { name?: string; contact?: string; email?: string }
  notes?: Record<string, string>
  theme?: { color?: string }
  handler: (response: RazorpayHandlerResponse) => void
  modal?: { ondismiss?: () => void }
}

export type RazorpayInstance = {
  open: () => void
  on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor
  }
}

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'
const LOAD_TIMEOUT_MS = 15000

// Dedupes concurrent load attempts. Reset to null on failure so a later retry
// can start a fresh load instead of awaiting a dead promise.
let loadPromise: Promise<RazorpayConstructor> | null = null

/**
 * Loads the Razorpay Checkout script once and resolves with the constructor.
 * Subsequent calls reuse the already-loaded global (or an in-flight load).
 *
 * Handles the edge cases the previous implementation missed:
 * - an existing <script> tag that already errored (previously hung forever),
 * - a script that loads but never defines window.Razorpay,
 * - a load that never completes (network stall) via a timeout,
 * so the checkout never gets stuck on "Waiting for payment…".
 */
export function loadRazorpayScript(): Promise<RazorpayConstructor> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay can only be loaded in the browser.'))
  }

  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay)
  }

  if (loadPromise) {
    return loadPromise
  }

  loadPromise = new Promise<RazorpayConstructor>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    const script = existing ?? document.createElement('script')

    let settled = false
    let timeoutId = 0

    const succeed = (ctor: RazorpayConstructor) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      resolve(ctor)
    }

    const fail = (message: string, removeScript: boolean) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      // Allow a future call to retry with a fresh <script> element.
      loadPromise = null
      if (removeScript) script.remove()
      reject(new Error(message))
    }

    const handleLoad = () => {
      if (window.Razorpay) {
        succeed(window.Razorpay)
      } else {
        fail('Razorpay failed to initialise. Please try again.', !existing)
      }
    }

    const handleError = () => {
      fail('Could not load Razorpay. Please check your connection.', true)
    }

    timeoutId = window.setTimeout(() => {
      fail('Razorpay took too long to load. Please try again.', !existing)
    }, LOAD_TIMEOUT_MS)

    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)

    if (!existing) {
      script.src = SCRIPT_SRC
      script.async = true
      document.body.appendChild(script)
    }
  })

  return loadPromise
}
