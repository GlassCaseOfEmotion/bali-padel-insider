'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { href: '/news',       label: 'News' },
  { href: '/events',     label: 'Events' },
  { href: '/interviews', label: 'Interviews' },
  { href: '/players',    label: 'Players' },
  { href: '/rankings',   label: 'Rankings' },
  { href: '/clubs',      label: 'Clubs' },
]

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => { setIsMenuOpen(false) }, [pathname])

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-[20px] shadow-[0_4px_30px_rgba(58,50,22,0.07)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative flex items-center h-16">

          {/* Logo */}
          <Link href="/" className="font-headline text-xl font-black tracking-tight text-primary uppercase shrink-0">
            Bali Padel Insider
          </Link>

          {/* Desktop nav — centred */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`font-headline text-sm font-bold uppercase tracking-tight pb-1 transition-colors ${
                    active
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-on-surface-muted hover:text-on-surface border-b-2 border-transparent'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <button
            type="button"
            className="hidden md:flex ml-auto items-center bg-primary text-on-primary font-headline font-bold text-sm uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-primary-dim transition-colors shrink-0"
          >
            Join Club
          </button>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((p) => !p)}
            className="md:hidden ml-auto flex flex-col justify-center items-center gap-[5px] w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
          >
            <span className={`block h-[2px] w-5 bg-on-surface rounded-full transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-[2px] w-5 bg-on-surface rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-[2px] w-5 bg-on-surface rounded-full transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>

        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="bg-surface/95 backdrop-blur-[20px] px-6 pb-6 pt-2 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className={`font-headline text-base font-bold uppercase tracking-tight px-4 py-3 rounded-full transition-colors ${
                  active
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-muted hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {label}
              </Link>
            )
          })}
          <button
            type="button"
            className="mt-3 w-full bg-primary text-on-primary font-headline font-bold text-sm uppercase tracking-widest px-6 py-3 rounded-full hover:bg-primary-dim transition-colors"
          >
            Join Club
          </button>
        </nav>
      </div>
    </header>
  )
}
