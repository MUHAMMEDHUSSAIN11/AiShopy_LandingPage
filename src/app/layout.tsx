import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

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
