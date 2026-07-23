/**
 * Centralised, validated access to environment-driven configuration.
 *
 * All external URLs are sourced from environment variables here so that nothing
 * is hardcoded in the codebase. Set these in Vercel (Project Settings →
 * Environment Variables) and in a local `.env.local` file for development.
 *
 * `NEXT_PUBLIC_*` variables are inlined into the browser bundle at build time,
 * so they must be present when `next build` runs.
 */

function requireEnv(name: string, value: string | undefined): string {
  const trimmed = value?.trim()
  if (!trimmed) {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        'Set it in Vercel (Project Settings → Environment Variables) and in .env.local.',
    )
  }
  return trimmed.replace(/\/$/, '')
}

/**
 * Base URL of the AiShopy backend API.
 * Public because the storefront calls it directly from the browser.
 */
export const AISHOPY_API_URL = requireEnv(
  'NEXT_PUBLIC_AISHOPY_API_URL',
  process.env.NEXT_PUBLIC_AISHOPY_API_URL,
)

/**
 * Marketing / platform site URL used for the storefront "Powered by" link.
 */
export const PLATFORM_URL = requireEnv(
  'NEXT_PUBLIC_PLATFORM_URL',
  process.env.NEXT_PUBLIC_PLATFORM_URL,
)
