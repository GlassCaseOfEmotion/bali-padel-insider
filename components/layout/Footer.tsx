import Link from 'next/link'

const NAV_LINKS = [
  { href: '/news',       label: 'News' },
  { href: '/events',     label: 'Events' },
  { href: '/interviews', label: 'Interviews' },
  { href: '/players',    label: 'Players' },
  { href: '/rankings',   label: 'Rankings' },
  { href: '/clubs',      label: 'Clubs' },
]

export function Footer() {
  return (
    <footer className="bg-surface-container mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8 mb-10">
          <Link href="/" className="font-headline text-lg font-black tracking-tight text-primary uppercase shrink-0">
            Bali Padel Insider
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-headline text-sm font-bold uppercase tracking-tight text-on-surface-muted hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="font-body text-sm text-on-surface-muted">
          © {new Date().getFullYear()} Bali Padel Insider. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
