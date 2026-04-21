import type { Metadata } from 'next'
import { Lexend, Manrope } from 'next/font/google'
import './globals.css'

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Bali Padel Insider', template: '%s | Bali Padel Insider' },
  description: 'Premium padel media platform for the Bali community.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} ${manrope.variable} font-body bg-surface text-on-surface antialiased`}>
        {children}
      </body>
    </html>
  )
}
