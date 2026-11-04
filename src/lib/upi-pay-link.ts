type BuildUpiPayUrlInput = {
  vpa: string
  payeeName?: string
  amount: number
  note?: string
}

/**
 * NPCI UPI intent used by GPay / PhonePe / Paytm on Android.
 * Does not confirm payment; checkout still requires a screenshot.
 */
export function buildUpiPayUrl({
  vpa,
  payeeName,
  amount,
  note,
}: BuildUpiPayUrlInput): string | null {
  const pa = vpa.trim()
  if (!pa || !Number.isFinite(amount) || amount <= 0) return null

  const params = new URLSearchParams()
  params.set('pa', pa)
  const pn = payeeName?.trim()
  if (pn) params.set('pn', pn.slice(0, 50))
  params.set('am', amount.toFixed(2))
  params.set('cu', 'INR')
  const tn = note?.trim()
  if (tn) params.set('tn', tn.slice(0, 50))

  return `upi://pay?${params.toString()}`
}
