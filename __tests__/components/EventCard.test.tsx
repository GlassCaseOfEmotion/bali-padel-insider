import { render, screen } from '@testing-library/react'
import { EventCard } from '@/components/cards/EventCard'

const mockEvent = {
  title: 'Bali Padel Open 2026',
  slug: { current: 'bali-padel-open-2026' },
  date: '2026-06-15T09:00:00Z',
  eventType: 'tournament',
  coverImage: null,
  venue: { name: 'Seminyak Padel Club', slug: { current: 'seminyak-padel-club' } },
}

describe('EventCard', () => {
  it('renders the event title', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('Bali Padel Open 2026')).toBeInTheDocument()
  })

  it('renders the venue name', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('Seminyak Padel Club')).toBeInTheDocument()
  })

  it('links to the correct URL', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/events/bali-padel-open-2026')
  })

  it('renders the formatted event date', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('15 June 2026')).toBeInTheDocument()
  })
})
