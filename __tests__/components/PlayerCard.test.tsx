import { render, screen } from '@testing-library/react'
import { PlayerCard } from '@/components/cards/PlayerCard'

const mockPlayer = {
  name: 'Marco Garcia',
  slug: { current: 'marco-garcia' },
  photo: null,
  currentRanking: 1,
  nationality: 'Spanish',
  homeClubName: 'Seminyak Padel Club',
}

describe('PlayerCard', () => {
  it('renders the player name', () => {
    render(<PlayerCard player={mockPlayer} />)
    expect(screen.getByText('Marco Garcia')).toBeInTheDocument()
  })

  it('renders the ranking', () => {
    render(<PlayerCard player={mockPlayer} />)
    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('links to the correct URL', () => {
    render(<PlayerCard player={mockPlayer} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/players/marco-garcia')
  })
})
