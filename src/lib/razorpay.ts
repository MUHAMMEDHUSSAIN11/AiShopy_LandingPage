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

/**
 * Loads the Razorpay Checkout script once and resolves with the constructor.
 * Subsequent calls reuse the already-loaded global.
 */
export function loadRazorpayScript(): Promise<RazorpayConstructor> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Razorpay can only be loaded in the browser.'))
      return
    }

    if (window.Razorpay) {
      resolve(window.Razorpay)
      return
    }

    const finish = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay)
      } else {
        reject(new Error('Razorpay failed to initialise. Please try again.'))
      }
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', finish)
      existing.addEventListener('error', () =>
        reject(new Error('Could not load Razorpay. Please check your connection.')),
      )
      return
    }

    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = finish
    script.onerror = () =>
      reject(new Error('Could not load Razorpay. Please check your connection.'))
    document.body.appendChild(script)
  })
}
