import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function LegalPageLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="AiShopy" width={120} height={32} className="h-8 w-auto" />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 transition hover:text-brand-green"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">{children}</main>

      <Footer />
    </div>
  )
}
