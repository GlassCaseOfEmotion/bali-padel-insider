import { render, screen } from '@testing-library/react'
import { ArticleCard } from '@/components/cards/ArticleCard'

const mockArticle = {
  title: 'Bali Open 2025 Recap',
  slug: { current: 'bali-open-2025-recap' },
  excerpt: 'An exciting weekend at Seminyak Padel Club.',
  coverImage: null,
  publishedAt: '2026-01-15T10:00:00Z',
  category: 'news',
  authorName: 'Jane Smith',
}

describe('ArticleCard', () => {
  it('renders the article title', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('Bali Open 2025 Recap')).toBeInTheDocument()
  })

  it('renders the article excerpt', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('An exciting weekend at Seminyak Padel Club.')).toBeInTheDocument()
  })

  it('links to the correct URL', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/news/bali-open-2025-recap')
  })
})
