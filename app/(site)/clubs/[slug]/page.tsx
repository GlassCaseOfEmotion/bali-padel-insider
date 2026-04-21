import { fetchClubBySlug } from '@/sanity/lib/fetch'
import { PortableText } from '@/components/ui/PortableText'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const club = await fetchClubBySlug(slug)
  return { title: club?.name ?? 'Club' }
}

export default async function ClubPage({ params }: Props) {
  const { slug } = await params
  const club = await fetchClubBySlug(slug)

  if (!club) notFound()

  const facilities: string[] = club.facilities ?? []

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {club.coverPhoto && (
        <div className="relative h-64 rounded-[2rem] overflow-hidden bg-surface-container-high mb-8">
          <Image
            src={urlFor(club.coverPhoto as SanityImageSource).width(1200).height(512).url()}
            alt={club.name}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}
      <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-on-surface">{club.name}</h1>

      <div className="mt-4 flex flex-wrap gap-4 font-body text-sm text-on-surface-muted">
        {club.courts?.count && (
          <span>{club.courts.count} courts{club.courts.surfaceType ? ` · ${club.courts.surfaceType}` : ''}</span>
        )}
        {club.location?.address && <span>{club.location.address}</span>}
      </div>

      {facilities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {facilities.map((f: string) => (
            <span
              key={f}
              className="font-body text-xs font-medium uppercase tracking-wide px-3 py-1 rounded-full bg-surface-container text-on-surface-muted"
            >
              {f}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-4">
        {club.website && (
          <a href={club.website} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-primary hover:underline">
            Website
          </a>
        )}
        {club.instagram && (
          <a href={club.instagram} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-primary hover:underline">
            Instagram
          </a>
        )}
        {club.whatsapp && (
          <a href={`https://wa.me/${club.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-primary hover:underline">
            WhatsApp
          </a>
        )}
      </div>

      {club.description && (
        <div className="mt-8">
          <PortableText value={club.description} />
        </div>
      )}
    </div>
  )
}
