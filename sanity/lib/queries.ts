// Homepage
export const homepageQuery = `
  *[_type == "homepage"][0] {
    featuredArticle -> {
      title, slug, excerpt, coverImage, publishedAt,
      "authorName": author->name
    },
    featuredEvents[] -> {
      title, slug, date, eventType, coverImage,
      "venueName": venue->name
    },
    featuredPlayers[] -> {
      name, slug, photo, currentRanking, nationality
    }
  }
`

// Articles
// GROQ slice [0...$limit] is inclusive, so limit: 49 returns 50 items (indices 0-49)
export const latestArticlesQuery = `
  *[_type == "article"] | order(publishedAt desc) [0...$limit] {
    title, slug, excerpt, coverImage, publishedAt, category,
    "authorName": author->name
  }
`

export const articleBySlugQuery = `
  *[_type == "article" && slug.current == $slug][0] {
    title, slug, excerpt, coverImage, publishedAt, category, body,
    "author": author->{ name, photo, bio }
  }
`

// Events
// GROQ slice [0...$limit] is inclusive, so limit: 19 returns 20 items (indices 0-19)
export const upcomingEventsQuery = `
  *[_type == "event" && date >= now()] | order(date asc) [0...$limit] {
    title, slug, date, eventType, coverImage,
    "venue": venue->{ name, slug }
  }
`

export const allEventsQuery = `
  *[_type == "event"] | order(date desc) {
    title, slug, date, eventType, coverImage,
    "venue": venue->{ name, slug }
  }
`

export const eventBySlugQuery = `
  *[_type == "event" && slug.current == $slug][0] {
    title, slug, date, endDate, eventType, level, excerpt, coverImage, description,
    registrationUrl, bracketUrl, registrationDeadline,
    prizePool,
    schedule[] { phase, datetime, isFeatured },
    sponsors,
    shuttleInfo, conciergeEmail,
    "venue": venue->{
      name, slug,
      "address": location.address,
      "lat": location.lat,
      "lng": location.lng
    }
  }
`

// Interviews
export const allInterviewsQuery = `
  *[_type == "interview"] | order(publishedAt desc) {
    title, slug, publishedAt, coverImage,
    "subject": subject->{ name, slug, currentRanking },
    "excerpt": body[0].children[0].text
  }
`

export const interviewBySlugQuery = `
  *[_type == "interview" && slug.current == $slug][0] {
    title, slug, publishedAt, coverImage, body,
    category, readTime, excerpt, pullQuote,
    ctaTitle, ctaBody, ctaUrl,
    "videoPlaybackId": video.asset->playbackId,
    "subject": subject->{
      name, slug,
      racket, racketImage, racketDescription, racketUrl,
      shoes, shoesImage, shoesDescription, shoesUrl
    },
    "related": *[_type == "interview" && slug.current != $slug] | order(publishedAt desc) [0..2] {
      title, slug, coverImage, category,
      "subject": subject->{ name }
    }
  }
`

// Players
export const allPlayersQuery = `
  *[_type == "player"] | order(currentRanking asc) {
    name, slug, photo, currentRanking, nationality,
    "homeClubName": homeClub->name
  }
`

export const playerBySlugQuery = `
  *[_type == "player" && slug.current == $slug][0] {
    name, slug, photo, currentRanking, nationality, bio, tier,
    winRate, matchesPlayed, smashPower, titles, isClubMvp,
    recentResults[] { tournamentName, opponent, score, isWin },
    islandMindsetQ1, islandMindsetA1, islandMindsetQ2, islandMindsetA2,
    preMatchRitual, secretTalent, favouritePlaylist, recoveryRoutine,
    racket, racketDescription, racketImage, racketUrl,
    shoes, shoesDescription, shoesImage, shoesUrl,
    grip, gripDescription, gripImage, gripUrl,
    bag, bagDescription, bagImage, bagUrl,
    partners[] { name, url },
    "homeClub": homeClub->{ name, slug },
    "interviews": *[_type == "interview" && references(^._id)] | order(publishedAt desc) [0..2] {
      title, slug, coverImage, excerpt
    }
  }
`

// Rankings
export const rankingByCategoryQuery = `
  *[_type == "ranking" && category == $category] | order(publishedAt desc) [0] {
    category, publishedAt,
    entries[] {
      rank, points,
      "player": player->{ name, slug, photo, nationality }
    }
  }
`

// Clubs
export const allClubsQuery = `
  *[_type == "club"] | order(isPremium desc, name asc) {
    name, slug, logo, coverPhoto, courts, facilities,
    isPremium, rating, pricePerHour,
    "address": location.address,
    "lat": location.lat,
    "lng": location.lng
  }
`

export const clubBySlugQuery = `
  *[_type == "club" && slug.current == $slug][0] {
    _id, name, slug, logo, coverPhoto, description,
    location, courts, facilities,
    website, instagram, whatsapp
  }
`

export const eventsByClubQuery = `
  *[_type == "event" && venue._ref == $clubId] | order(date desc) [0...5] {
    title, slug, date, eventType, coverImage
  }
`

export const playersByClubQuery = `
  *[_type == "player" && homeClub._ref == $clubId] | order(currentRanking asc) [0...10] {
    name, slug, photo, currentRanking, nationality
  }
`
