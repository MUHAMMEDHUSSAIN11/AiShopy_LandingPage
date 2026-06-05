'use client'

import Image from 'next/image'
import FadeIn from '@/components/motion/FadeIn'
import { CONTACT_EMAIL } from '@/lib/constants'

export default function Footer() {
  return (
    <FadeIn direction="up">
      <footer className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="AiShopy" width={120} height={32} className="h-7 w-auto" />
              <span className="text-sm text-gray-500">Turn chats into sales with AI.</span>
            </div>
            <div className="flex flex-col items-center gap-1 md:items-end">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-sm text-gray-500 transition hover:text-brand-green"
              >
                {CONTACT_EMAIL}
              </a>
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} AiShopy. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </FadeIn>
  )
}
