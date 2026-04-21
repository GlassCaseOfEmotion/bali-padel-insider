import { render, screen } from '@testing-library/react'
import { ClubCard } from '@/components/cards/ClubCard'

const mockClub = {
  name: 'Seminyak Padel Club',
  slug: { current: 'seminyak-padel-club' },
  coverPhoto: null,
  courts: { count: 4, surfaceType: 'artificial grass' },
  address: 'Jl. Raya Seminyak, Bali',
}

describe('ClubCard', () => {
  it('renders the club name', () => {
    render(<ClubCard club={mockClub} />)
    expect(screen.getByText('Seminyak Padel Club')).toBeInTheDocument()
  })

  it('renders the court count', () => {
    render(<ClubCard club={mockClub} />)
    expect(screen.getByText(/4 courts/)).toBeInTheDocument()
  })

  it('links to the correct URL', () => {
    render(<ClubCard club={mockClub} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/clubs/seminyak-padel-club')
  })

  it('renders the address', () => {
    render(<ClubCard club={mockClub} />)
    expect(screen.getByText('Jl. Raya Seminyak, Bali')).toBeInTheDocument()
  })
})
