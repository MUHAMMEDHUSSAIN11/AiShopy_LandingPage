import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Domain not connected yet',
  description: 'This domain is saved, and the store opens after the domain is verified.',
  robots: { index: false, follow: false },
}

export default function DomainPendingPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f6f6f4] px-6 text-[#171717]">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold tracking-tight">This domain is not connected yet</h1>
        <p className="mt-3 text-base leading-relaxed text-[#525252]">
          The store owner still needs to finish connecting this domain. The store opens here after
          that is done.
        </p>
      </div>
    </main>
  )
}
