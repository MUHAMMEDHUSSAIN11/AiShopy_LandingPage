import Link from 'next/link'
import { getStoreSlugFromHeaders } from '@/lib/server-api'

export default async function NotFound() {
  const storeSlug = await getStoreSlugFromHeaders()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <p className="text-6xl font-bold text-brand-green">404</p>
      <h1 className="mt-4 text-2xl font-bold text-brand-dark">Page not found</h1>
      <p className="mt-2 max-w-md text-gray-600">
        {storeSlug
          ? "The page you're looking for doesn't exist in this store."
          : "The page you're looking for doesn't exist."}
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
      >
        {storeSlug ? 'Back to store' : 'Go home'}
      </Link>
    </div>
  )
}
