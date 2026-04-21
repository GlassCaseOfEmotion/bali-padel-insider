import Link from 'next/link'

const NAV_LINKS = [
  { href: '/news', label: 'News' },
  { href: '/events', label: 'Events' },
  { href: '/interviews', label: 'Interviews' },
  { href: '/players', label: 'Players' },
  { href: '/rankings', label: 'Rankings' },
  { href: '/clubs', label: 'Clubs' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-[16px] shadow-[0_2px_24px_rgba(58,50,22,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-[-0.02em] text-on-surface"
          >
            Bali Padel Insider
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-sm font-medium text-on-surface-muted hover:text-on-surface transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
