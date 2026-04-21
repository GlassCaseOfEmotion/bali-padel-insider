import { cache } from 'react'
import { client } from './client'
import {
  articleBySlugQuery,
  eventBySlugQuery,
  interviewBySlugQuery,
  playerBySlugQuery,
  clubBySlugQuery,
  allPlayersQuery,
  allClubsQuery,
  rankingByCategoryQuery,
} from './queries'

export const fetchArticleBySlug = cache((slug: string) =>
  client.fetch(articleBySlugQuery, { slug })
)

export const fetchEventBySlug = cache((slug: string) =>
  client.fetch(eventBySlugQuery, { slug })
)

export const fetchInterviewBySlug = cache((slug: string) =>
  client.fetch(interviewBySlugQuery, { slug })
)

export const fetchPlayerBySlug = cache((slug: string) =>
  client.fetch(playerBySlugQuery, { slug })
)

export const fetchClubBySlug = cache((slug: string) =>
  client.fetch(clubBySlugQuery, { slug })
)

export const fetchAllPlayers = cache(() =>
  client.fetch(allPlayersQuery)
)

export const fetchAllClubs = cache(() =>
  client.fetch(allClubsQuery)
)

export const fetchRankingByCategory = cache((category: string) =>
  client.fetch(rankingByCategoryQuery, { category })
)
