'use client'

import { useState, useCallback } from 'react'
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import Link from 'next/link'

interface ClubPin {
  slug: string
  name: string
  address?: string
  lat: number
  lng: number
  isPremium?: boolean
  rating?: number
  courts?: { count?: number }
}

interface Props {
  clubs: ClubPin[]
}

const BALI_CENTER = { latitude: -8.4095, longitude: 115.1889, zoom: 9.5 }

export default function ClubMap({ clubs }: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const [popupSlug, setPopupSlug] = useState<string | null>(null)

  const handleMarkerClick = useCallback((slug: string) => {
    setPopupSlug((prev) => (prev === slug ? null : slug))
  }, [])

  if (!token) {
    return (
      <div className="w-full h-full rounded-[2rem] bg-surface-container-high flex items-center justify-center">
        <p className="font-body text-on-surface-variant text-sm text-center px-8">
          Map requires <code className="font-mono bg-surface-container px-1 py-0.5 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> in <code className="font-mono bg-surface-container px-1 py-0.5 rounded">.env.local</code>
        </p>
      </div>
    )
  }

  const pinsWithCoords = clubs.filter((c) => c.lat && c.lng)
  const activeClub = pinsWithCoords.find((c) => c.slug === popupSlug)

  return (
    <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
      <Map
        mapboxAccessToken={token}
        initialViewState={BALI_CENTER}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {pinsWithCoords.map((club) => (
          <Marker
            key={club.slug}
            latitude={club.lat}
            longitude={club.lng}
            anchor="center"
            onClick={() => handleMarkerClick(club.slug)}
          >
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-125 ${
                club.isPremium
                  ? 'bg-secondary text-on-secondary'
                  : popupSlug === club.slug
                  ? 'bg-primary text-on-primary scale-125'
                  : 'bg-primary text-on-primary'
              }`}
              style={{ fontSize: 16 }}
              aria-label={club.name}
            >
              🎾
            </button>
          </Marker>
        ))}

        {activeClub && (
          <Popup
            latitude={activeClub.lat}
            longitude={activeClub.lng}
            anchor="bottom"
            offset={24}
            closeButton={false}
            onClose={() => setPopupSlug(null)}
            className="club-map-popup"
          >
            <div className="bg-surface rounded-[1rem] p-3 shadow-xl min-w-[180px]">
              <p className="font-headline font-black text-xs uppercase tracking-widest text-primary mb-1">
                {activeClub.isPremium ? '★ Premium' : 'Club'}
              </p>
              <p className="font-headline font-bold text-base text-on-surface mb-1">{activeClub.name}</p>
              {activeClub.address && (
                <p className="font-body text-[10px] text-on-surface-variant mb-2">{activeClub.address}</p>
              )}
              {activeClub.courts?.count && (
                <p className="font-body text-[10px] text-on-surface-variant mb-3">
                  {activeClub.courts.count} {activeClub.courts.count === 1 ? 'Court' : 'Courts'}
                </p>
              )}
              <Link
                href={`/clubs/${activeClub.slug}`}
                className="block bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-center hover:bg-primary-dim transition-colors"
              >
                View Club →
              </Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
