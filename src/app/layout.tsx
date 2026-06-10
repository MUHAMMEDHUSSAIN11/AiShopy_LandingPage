import type { Metadata } from 'next'
import { inter } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'AiShopy — Turn WhatsApp & Instagram Chats Into Sales',
  description:
    'AiShopy helps businesses sell products through WhatsApp and Instagram with an AI-powered sales assistant, online storefront, and order tracking.',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  )
}
