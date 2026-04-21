# Bali Padel Insider — Design Spec

**Date:** 2026-04-21
**Status:** Approved

---

## Overview

Bali Padel Insider is a premium editorial media platform for the Bali padel community. It covers news, events, interviews, player profiles, club listings, and rankings. Content is published by an internal editorial team (including non-technical editors). No user accounts, paywalls, or user-generated content in scope.

**Primary audience:** Locals living in Bali.

---

## Architecture

```
[Sanity Studio]  ──publish──▶  [Sanity Content Lake]
      │                                  │
  video upload                      GROQ queries
      │                                  │
    [Mux]                        [Next.js App Router]
      │                          ├── Static pages (SSG)
   streaming                     └── Dynamic pages (ISR)
      │                                  │
      └──────────────────────────▶   [Vercel]
                                         │
                                [User's Browser]
```

- **Sanity Studio** — hosted at `/studio` on the production domain, editors log in to create and publish content
- **Sanity Content Lake** — Sanity's managed cloud storage; no self-hosted database required
- **Mux** — video hosting service with an official Sanity plugin (`sanity-plugin-mux-input`); editors upload video directly from Studio, Mux handles transcoding and adaptive bitrate streaming (HLS)
- **Next.js App Router** — renders pages as static (SSG) or incrementally regenerated (ISR) so new content goes live quickly
- **Vercel** — automatic deploys on push to `main`; preview deploys on every branch/PR

---

## Content Types (Sanity Schemas)

### Article (News)
- `title` (string)
- `slug` (slug)
- `author` → Author
- `publishedAt` (datetime)
- `category` (string: news / feature / opinion)
- `excerpt` (text)
- `coverImage` (image)
- `body` (Portable Text / rich text)

### Event
- `title` (string)
- `slug` (slug)
- `date` (datetime)
- `venue` → Club
- `description` (Portable Text)
- `coverImage` (image)
- `eventType` (string: tournament / social / clinic)

### Interview
- `title` (string)
- `slug` (slug)
- `subject` → Player Profile
- `publishedAt` (datetime)
- `coverImage` (image)
- `video` (Mux video asset — uploaded via `sanity-plugin-mux-input`)
- `body` (Portable Text — for transcript, summary, or accompanying written content)

### Player Profile
- `name` (string)
- `slug` (slug)
- `nationality` (string)
- `bio` (text)
- `photo` (image)
- `currentRanking` (number)
- `homeClub` → Club
- **Off The Court** *(field group)*
  - `preMatchRitual` (text)
  - `secretTalent` (text)
  - `favouritePlaylist` (text/URL)
  - `recoveryRoutine` (text)
- **In My Bag** *(field group)*
  - `racket` (string)
  - `shoes` (string)
  - `grip` (string)
  - `bag` (string)

### Club
- `name` (string)
- `slug` (slug)
- `logo` (image)
- `coverPhoto` (image)
- `description` (Portable Text)
- `location` (object: address, googleMapsUrl)
- `courts` (object: count, surfaceType)
- `facilities` (array of strings: lights / pro shop / cafe / etc.)
- `website` (url)
- `instagram` (url)
- `whatsapp` (string)

### Ranking
- `category` (string: men / women / mixed)
- `publishedAt` (datetime)
- `entries` (array of: player → Player Profile, rank (number), points (number))

### Author
- `name` (string)
- `slug` (slug)
- `bio` (text)
- `photo` (image)

### Homepage (singleton)
- `featuredArticle` → Article
- `featuredEvents` (array → Event)
- `featuredPlayers` (array → Player Profile)

> All schemas are code files — new fields can be added at any time without migrations. Existing documents simply show new fields as empty.

---

## Page Structure (Routes)

| Route | Description |
|---|---|
| `/` | Homepage — hero, latest news, upcoming events, featured rankings |
| `/news` | News index (paginated) |
| `/news/[slug]` | Article detail page |
| `/events` | Events index (upcoming + past) |
| `/events/[slug]` | Event detail page |
| `/interviews` | Interviews index |
| `/interviews/[slug]` | Interview detail page |
| `/players` | Player profiles index |
| `/players/[slug]` | Player profile page |
| `/rankings` | Rankings page (men / women / mixed tabs) |
| `/clubs` | Clubs directory |
| `/clubs/[slug]` | Club page with linked events and players |
| `/studio` | Sanity Studio (editors only) |

The homepage layout is controlled via the Homepage singleton document in Sanity — editors pin featured stories, events, and players without touching code.

---

## Styling

- **Tailwind CSS** — utility-first styling, standard for Next.js projects
- Visual identity (typography, colour palette, component design) to be derived from Google Stitch mockups provided by the client
- No component library enforced — custom components built to match the premium brand aesthetic

---

## Dev Workflow & Deployment

```
GitHub repo
    │
    ├── main  ──▶ Vercel production
    └── dev   ──▶ Vercel preview (staging)
```

- Local dev: `next dev` — Sanity Studio embedded, runs at `localhost:3000/studio`
- Deploys triggered automatically by push to `main` via Vercel GitHub integration
- Branch/PR preview URLs available for review before merging
- Sanity project ID, API tokens, and Mux API credentials stored as Vercel environment variables — never committed to the repo

---

## Out of Scope (v1)

- User accounts / authentication
- Paid membership / paywalls
- User-generated content (comments, submissions)
- Newsletter / email
- Supabase (may be introduced later for interactive features)
