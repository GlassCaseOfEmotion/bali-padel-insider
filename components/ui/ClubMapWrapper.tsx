'use client'

import dynamic from 'next/dynamic'

const ClubMap = dynamic(() => import('./ClubMap'), { ssr: false })

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

export default function ClubMapWrapper({ clubs }: { clubs: ClubPin[] }) {
  return <ClubMap clubs={clubs} />
}
