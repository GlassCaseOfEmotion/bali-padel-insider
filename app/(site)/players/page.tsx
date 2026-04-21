import { fetchAllPlayers } from '@/sanity/lib/fetch'
import { PlayerCard } from '@/components/cards/PlayerCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Players' }
export const revalidate = 60

export default async function PlayersPage() {
  const players = await fetchAllPlayers()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-on-surface mb-10">Players</h1>
      {players?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {players.map((player: { name: string; slug: { current: string } }) => (
            <PlayerCard key={player.slug.current} player={player} />
          ))}
        </div>
      ) : (
        <p className="font-body text-on-surface-muted text-center py-20">No players added yet.</p>
      )}
    </div>
  )
}
