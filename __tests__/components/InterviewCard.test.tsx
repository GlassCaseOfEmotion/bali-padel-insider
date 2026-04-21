import { render, screen } from '@testing-library/react'
import { InterviewCard } from '@/components/cards/InterviewCard'

const mockInterview = {
  title: 'Five Minutes with Marco Garcia',
  slug: { current: 'five-minutes-marco-garcia' },
  publishedAt: '2026-02-01T10:00:00Z',
  coverImage: null,
  subject: { name: 'Marco Garcia', slug: { current: 'marco-garcia' } },
}

describe('InterviewCard', () => {
  it('renders the interview title', () => {
    render(<InterviewCard interview={mockInterview} />)
    expect(screen.getByText('Five Minutes with Marco Garcia')).toBeInTheDocument()
  })

  it('renders the subject name', () => {
    render(<InterviewCard interview={mockInterview} />)
    expect(screen.getByText('Marco Garcia')).toBeInTheDocument()
  })

  it('links to the correct URL', () => {
    render(<InterviewCard interview={mockInterview} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/interviews/five-minutes-marco-garcia')
  })
})
