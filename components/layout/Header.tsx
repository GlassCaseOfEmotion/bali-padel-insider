'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/news', label: 'News' },
  { href: '/events', label: 'Events' },
  { href: '/interviews', label: 'Interviews' },
  { href: '/players', label: 'Players' },
  { href: '/rankings', label: 'Rankings' },
  { href: '/clubs', label: 'Clubs' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-[20px] shadow-[0_4px_30px_rgba(58,50,22,0.07)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative flex items-center h-16">

          {/* Logo — left */}
          <Link
            href="/"
            className="font-display text-xl font-black tracking-tight text-primary uppercase shrink-0"
          >
            Bali Padel Insider
          </Link>

          {/* Nav — absolutely centred */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`font-display text-sm font-bold uppercase tracking-tight px-4 py-2 rounded-[0.75rem] transition-all ${
                    active
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-muted hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Join Club CTA — right */}
          <button
            type="button"
            className="hidden md:flex ml-auto items-center gap-2 bg-tertiary-container text-on-tertiary-container font-display font-bold text-sm uppercase tracking-widest px-5 py-2 rounded-[3rem] hover:brightness-95 transition-all shrink-0"
          >
            Join Club
          </button>

        </div>
      </div>
    </header>
  )
}
