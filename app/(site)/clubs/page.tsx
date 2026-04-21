import { fetchAllClubs } from '@/sanity/lib/fetch'
import { ClubCard } from '@/components/cards/ClubCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Clubs' }
export const revalidate = 60

export default async function ClubsPage() {
  const clubs = await fetchAllClubs()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-on-surface mb-10">Clubs</h1>
      {clubs?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club: { name: string; slug: { current: string } }) => (
            <ClubCard key={club.slug.current} club={club} />
          ))}
        </div>
      ) : (
        <p className="font-body text-on-surface-muted text-center py-20">No clubs listed yet.</p>
      )}
    </div>
  )
}
