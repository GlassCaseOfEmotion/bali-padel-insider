import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="font-bold text-sm tracking-tight">
          Bali Padel Insider
        </Link>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Bali Padel Insider. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
