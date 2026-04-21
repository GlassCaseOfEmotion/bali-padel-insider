# Bali Padel Insider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium editorial media platform for the Bali padel community — news, events, interviews (with video), player profiles, clubs, and rankings — using Next.js App Router, Sanity CMS, Mux video, and Tailwind CSS.

**Architecture:** Next.js App Router renders all pages statically (SSG) with ISR (revalidate=60) so published content goes live within a minute. Sanity manages all content types via its Studio UI embedded at `/studio`. Mux handles video upload, transcoding, and HLS streaming for interview pages.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 3, Sanity v3, next-sanity, @sanity/image-url, @portabletext/react, sanity-plugin-mux-input, @mux/mux-player-react, Jest, React Testing Library

---

## File Map

```
/
├── app/
│   ├── layout.tsx                        # Root layout: html/body/globals.css only
│   ├── globals.css                       # Tailwind directives
│   ├── (site)/
│   │   ├── layout.tsx                    # Site layout: Header + Footer wrapper
│   │   ├── page.tsx                      # Homepage
│   │   ├── news/
│   │   │   ├── page.tsx                  # News index
│   │   │   └── [slug]/page.tsx           # Article detail
│   │   ├── events/
│   │   │   ├── page.tsx                  # Events index
│   │   │   └── [slug]/page.tsx           # Event detail
│   │   ├── interviews/
│   │   │   ├── page.tsx                  # Interviews index
│   │   │   └── [slug]/page.tsx           # Interview detail (with Mux player)
│   │   ├── players/
│   │   │   ├── page.tsx                  # Players index
│   │   │   └── [slug]/page.tsx           # Player profile
│   │   ├── rankings/
│   │   │   └── page.tsx                  # Rankings with men/women/mixed tabs
│   │   └── clubs/
│   │       ├── page.tsx                  # Clubs directory
│   │       └── [slug]/page.tsx           # Club detail
│   └── studio/
│       ├── layout.tsx                    # Minimal layout (no Header/Footer)
│       └── [[...tool]]/page.tsx          # Sanity Studio
├── components/
│   ├── layout/
│   │   ├── Header.tsx                    # Site nav
│   │   └── Footer.tsx                    # Site footer
│   ├── cards/
│   │   ├── ArticleCard.tsx               # News card (title, excerpt, date, category)
│   │   ├── EventCard.tsx                 # Event card (title, date, venue, type)
│   │   ├── InterviewCard.tsx             # Interview card (title, subject, date)
│   │   ├── PlayerCard.tsx                # Player card (name, ranking, nationality)
│   │   └── ClubCard.tsx                  # Club card (name, courts, location)
│   └── ui/
│       ├── PortableText.tsx              # Renders Sanity Portable Text blocks
│       └── MuxVideoPlayer.tsx            # Client component wrapping @mux/mux-player-react
├── sanity/
│   ├── schemaTypes/
│   │   ├── index.ts                      # Exports all schema types array
│   │   ├── article.ts
│   │   ├── author.ts
│   │   ├── club.ts
│   │   ├── event.ts
│   │   ├── interview.ts
│   │   ├── player.ts
│   │   ├── ranking.ts
│   │   └── homepage.ts
│   └── lib/
│       ├── client.ts                     # Sanity client (useCdn: true)
│       ├── queries.ts                    # All GROQ queries
│       └── urlFor.ts                     # Image URL builder helper
├── __tests__/
│   └── components/
│       ├── ArticleCard.test.tsx
│       ├── EventCard.test.tsx
│       ├── InterviewCard.test.tsx
│       ├── PlayerCard.test.tsx
│       └── ClubCard.test.tsx
├── sanity.config.ts                      # Sanity Studio config (root, imported by Studio page)
├── next.config.ts
├── tailwind.config.ts
├── jest.config.ts
└── jest.setup.ts
```

---

## Task 1: Initialize Next.js Project and Git

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts` (all via create-next-app)

- [ ] **Step 1: Scaffold Next.js project**

Run from the `BaliPadelInsider` directory:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias="@/*"
```
When prompted: answer No to "Would you like to use Turbopack?". Accept all other defaults.

- [ ] **Step 2: Verify the project runs**

```bash
npm run dev
```
Expected: server starts at `http://localhost:3000` with no errors.

- [ ] **Step 3: Initialize git and make first commit**

```bash
git init
git add .
git commit -m "feat: initialize Next.js project"
```

---

## Task 2: Install All Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Sanity, Mux, and supporting packages**

```bash
npm install sanity next-sanity @sanity/image-url @portabletext/react sanity-plugin-mux-input @mux/mux-player-react @sanity/vision
```

- [ ] **Step 2: Install test dependencies**

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install sanity, mux, and test dependencies"
```

---

## Task 3: Configure next.config.ts and Environment Variables

**Files:**
- Modify: `next.config.ts`
- Create: `.env.local`, `.env.local.example`

- [ ] **Step 1: Update next.config.ts to allow Sanity and Mux image domains**

Replace the contents of `next.config.ts`:
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'image.mux.com' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 2: Create .env.local.example**

```bash
cat > .env.local.example << 'EOF'
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
EOF
```

- [ ] **Step 3: Create .env.local with your actual values**

You will fill in values after the Sanity project is created in Task 4. For now:
```bash
cp .env.local.example .env.local
```

- [ ] **Step 4: Add .env.local to .gitignore**

Open `.gitignore` and confirm `.env.local` is listed (create-next-app adds it by default). If not, add:
```
.env.local
```

- [ ] **Step 5: Commit**

```bash
git add next.config.ts .env.local.example .gitignore
git commit -m "feat: configure image domains and env var template"
```

---

## Task 4: Create Sanity Project and Populate Environment Variables

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Create a Sanity project**

Run:
```bash
npx sanity@latest init
```
When prompted:
- "Create new project" → Yes
- Project name → `Bali Padel Insider`
- Dataset → `production`
- Output path → press Enter to use current directory
- Template → "Clean project with no predefined schemas"

This will print your **Project ID** — copy it.

- [ ] **Step 2: Get a read API token**

Go to [sanity.io/manage](https://sanity.io/manage), select your project → API → Tokens → Add API token.
- Label: `next-app-read`
- Permissions: Viewer
- Copy the token.

- [ ] **Step 3: Get Mux API credentials**

Go to [dashboard.mux.com](https://dashboard.mux.com) → Settings → API Access Tokens → Generate new token.
- Permissions: Mux Video (Read + Write)
- Copy Token ID and Token Secret.

- [ ] **Step 4: Fill in .env.local**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token_here
MUX_TOKEN_ID=your_mux_token_id_here
MUX_TOKEN_SECRET=your_mux_token_secret_here
```

---

## Task 5: Set Up Jest and React Testing Library

**Files:**
- Create: `jest.config.ts`, `jest.setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Write jest.config.ts**

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 2: Write jest.setup.ts**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Add test script to package.json**

Open `package.json` and add to the `"scripts"` section:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 4: Verify Jest runs**

```bash
npm test -- --passWithNoTests
```
Expected: output shows "Test Suites: 0 passed" with no errors.

- [ ] **Step 5: Commit**

```bash
git add jest.config.ts jest.setup.ts package.json
git commit -m "feat: configure jest and react testing library"
```

---

## Task 6: Define Root App Layout and Globals

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`
- Create: `app/(site)/layout.tsx`, `app/studio/layout.tsx`

- [ ] **Step 1: Write the root layout (html/body only)**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'Bali Padel Insider', template: '%s | Bali Padel Insider' },
  description: 'Premium padel media platform for the Bali community.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Write globals.css with Tailwind directives**

Replace `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 3: Create the (site) layout with Header and Footer placeholders**

Create `app/(site)/layout.tsx`:
```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Create the Studio layout (no Header/Footer)**

Create `app/studio/layout.tsx`:
```tsx
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 5: Commit**

```bash
git add app/
git commit -m "feat: add root and site route group layouts"
```

---

## Task 7: Build Header and Footer Components

**Files:**
- Create: `components/layout/Header.tsx`, `components/layout/Footer.tsx`

- [ ] **Step 1: Write Header.tsx**

Create `components/layout/Header.tsx`:
```tsx
import Link from 'next/link'

const navLinks = [
  { href: '/news', label: 'News' },
  { href: '/events', label: 'Events' },
  { href: '/interviews', label: 'Interviews' },
  { href: '/players', label: 'Players' },
  { href: '/rankings', label: 'Rankings' },
  { href: '/clubs', label: 'Clubs' },
]

export function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl tracking-tight">
            Bali Padel Insider
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Write Footer.tsx**

Create `components/layout/Footer.tsx`:
```tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="font-bold text-sm tracking-tight">
          Bali Padel Insider
        </Link>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Bali Padel Insider. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/
git commit -m "feat: add Header and Footer layout components"
```

---

## Task 8: Sanity Schemas — Article and Author

**Files:**
- Create: `sanity/schemaTypes/article.ts`, `sanity/schemaTypes/author.ts`

- [ ] **Step 1: Write article.ts**

Create `sanity/schemaTypes/article.ts`:
```typescript
import { defineField, defineType } from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: ['news', 'feature', 'opinion'] },
    }),
    defineField({ name: 'excerpt', type: 'text', rows: 3 }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
  ],
})
```

- [ ] **Step 2: Write author.ts**

Create `sanity/schemaTypes/author.ts`:
```typescript
import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({ name: 'bio', type: 'text' }),
    defineField({
      name: 'photo',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})
```

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/
git commit -m "feat: add article and author sanity schemas"
```

---

## Task 9: Sanity Schemas — Club and Event

**Files:**
- Create: `sanity/schemaTypes/club.ts`, `sanity/schemaTypes/event.ts`

- [ ] **Step 1: Write club.ts**

Create `sanity/schemaTypes/club.ts`:
```typescript
import { defineField, defineType } from 'sanity'

export const club = defineType({
  name: 'club',
  title: 'Club',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'coverPhoto', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'location',
      type: 'object',
      fields: [
        defineField({ name: 'address', type: 'string' }),
        defineField({ name: 'googleMapsUrl', type: 'url' }),
      ],
    }),
    defineField({
      name: 'courts',
      type: 'object',
      fields: [
        defineField({ name: 'count', type: 'number' }),
        defineField({ name: 'surfaceType', type: 'string' }),
      ],
    }),
    defineField({
      name: 'facilities',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ['Lights', 'Pro Shop', 'Cafe', 'Changing Rooms', 'Parking', 'Showers'],
      },
    }),
    defineField({ name: 'website', type: 'url' }),
    defineField({ name: 'instagram', type: 'url' }),
    defineField({ name: 'whatsapp', type: 'string' }),
  ],
})
```

- [ ] **Step 2: Write event.ts**

Create `sanity/schemaTypes/event.ts`:
```typescript
import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'date', type: 'datetime' }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: [{ type: 'club' }],
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      options: { list: ['tournament', 'social', 'clinic'] },
    }),
  ],
})
```

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/club.ts sanity/schemaTypes/event.ts
git commit -m "feat: add club and event sanity schemas"
```

---

## Task 10: Sanity Schemas — Player Profile

**Files:**
- Create: `sanity/schemaTypes/player.ts`

- [ ] **Step 1: Write player.ts**

Create `sanity/schemaTypes/player.ts`:
```typescript
import { defineField, defineType } from 'sanity'

export const player = defineType({
  name: 'player',
  title: 'Player',
  type: 'document',
  groups: [
    { name: 'core', title: 'Core Info', default: true },
    { name: 'offTheCourt', title: 'Off The Court' },
    { name: 'inMyBag', title: 'In My Bag' },
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: 'core',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      group: 'core',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'nationality', type: 'string', group: 'core' }),
    defineField({ name: 'bio', type: 'text', group: 'core' }),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true }, group: 'core' }),
    defineField({ name: 'currentRanking', type: 'number', group: 'core' }),
    defineField({
      name: 'homeClub',
      type: 'reference',
      to: [{ type: 'club' }],
      group: 'core',
    }),
    // Off The Court
    defineField({ name: 'preMatchRitual', type: 'text', group: 'offTheCourt' }),
    defineField({ name: 'secretTalent', type: 'text', group: 'offTheCourt' }),
    defineField({ name: 'favouritePlaylist', type: 'string', group: 'offTheCourt' }),
    defineField({ name: 'recoveryRoutine', type: 'text', group: 'offTheCourt' }),
    // In My Bag
    defineField({ name: 'racket', type: 'string', group: 'inMyBag' }),
    defineField({ name: 'shoes', type: 'string', group: 'inMyBag' }),
    defineField({ name: 'grip', type: 'string', group: 'inMyBag' }),
    defineField({ name: 'bag', type: 'string', group: 'inMyBag' }),
  ],
})
```

- [ ] **Step 2: Commit**

```bash
git add sanity/schemaTypes/player.ts
git commit -m "feat: add player profile sanity schema with field groups"
```

---

## Task 11: Sanity Schemas — Interview, Ranking, and Homepage

**Files:**
- Create: `sanity/schemaTypes/interview.ts`, `sanity/schemaTypes/ranking.ts`, `sanity/schemaTypes/homepage.ts`, `sanity/schemaTypes/index.ts`

- [ ] **Step 1: Write interview.ts**

Create `sanity/schemaTypes/interview.ts`:
```typescript
import { defineField, defineType } from 'sanity'

export const interview = defineType({
  name: 'interview',
  title: 'Interview',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subject',
      type: 'reference',
      to: [{ type: 'player' }],
    }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'mux.video',
    }),
    defineField({
      name: 'body',
      title: 'Transcript / Summary',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})
```

- [ ] **Step 2: Write ranking.ts**

Create `sanity/schemaTypes/ranking.ts`:
```typescript
import { defineField, defineType } from 'sanity'

export const ranking = defineType({
  name: 'ranking',
  title: 'Ranking',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      type: 'string',
      options: { list: ['men', 'women', 'mixed'] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({
      name: 'entries',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'player',
              type: 'reference',
              to: [{ type: 'player' }],
            }),
            defineField({ name: 'rank', type: 'number' }),
            defineField({ name: 'points', type: 'number' }),
          ],
          preview: {
            select: { title: 'player.name', subtitle: 'rank' },
            prepare({ title, subtitle }) {
              return { title, subtitle: `Rank #${subtitle}` }
            },
          },
        },
      ],
    }),
  ],
})
```

- [ ] **Step 3: Write homepage.ts**

Create `sanity/schemaTypes/homepage.ts`:
```typescript
import { defineField, defineType } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'featuredArticle',
      type: 'reference',
      to: [{ type: 'article' }],
    }),
    defineField({
      name: 'featuredEvents',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'event' }] }],
    }),
    defineField({
      name: 'featuredPlayers',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'player' }] }],
    }),
  ],
})
```

- [ ] **Step 4: Write the schema index**

Create `sanity/schemaTypes/index.ts`:
```typescript
import { article } from './article'
import { author } from './author'
import { club } from './club'
import { event } from './event'
import { homepage } from './homepage'
import { interview } from './interview'
import { player } from './player'
import { ranking } from './ranking'

export const schemaTypes = [
  article,
  author,
  club,
  event,
  homepage,
  interview,
  player,
  ranking,
]
```

- [ ] **Step 5: Commit**

```bash
git add sanity/schemaTypes/
git commit -m "feat: add interview, ranking, homepage schemas and schema index"
```

---

## Task 12: Sanity Studio Config and Studio Route

**Files:**
- Create: `sanity.config.ts`, `app/studio/[[...tool]]/page.tsx`

- [ ] **Step 1: Write sanity.config.ts at root**

Create `sanity.config.ts`:
```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { muxInput } from 'sanity-plugin-mux-input'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'bali-padel-insider',
  title: 'Bali Padel Insider',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool(), visionTool(), muxInput()],
  schema: { types: schemaTypes },
})
```

- [ ] **Step 2: Create the Studio page route**

Create `app/studio/[[...tool]]/page.tsx`:
```tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

- [ ] **Step 3: Start dev server and verify Studio loads**

```bash
npm run dev
```
Open `http://localhost:3000/studio` — you should see the Sanity Studio login screen.

- [ ] **Step 4: Commit**

```bash
git add sanity.config.ts app/studio/
git commit -m "feat: add sanity studio config and /studio route"
```

---

## Task 13: Sanity Client, Image Helper, and GROQ Queries

**Files:**
- Create: `sanity/lib/client.ts`, `sanity/lib/urlFor.ts`, `sanity/lib/queries.ts`

- [ ] **Step 1: Write client.ts**

Create `sanity/lib/client.ts`:
```typescript
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
```

- [ ] **Step 2: Write urlFor.ts**

Create `sanity/lib/urlFor.ts`:
```typescript
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
```

- [ ] **Step 3: Write queries.ts**

Create `sanity/lib/queries.ts`:
```typescript
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
    title, slug, date, eventType, coverImage, description,
    "venue": venue->{ name, slug, location }
  }
`

// Interviews
export const allInterviewsQuery = `
  *[_type == "interview"] | order(publishedAt desc) {
    title, slug, publishedAt, coverImage,
    "subject": subject->{ name, slug }
  }
`

export const interviewBySlugQuery = `
  *[_type == "interview" && slug.current == $slug][0] {
    title, slug, publishedAt, coverImage, body,
    "videoPlaybackId": video.asset->playbackId,
    "subject": subject->{ name, slug, photo }
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
    name, slug, photo, currentRanking, nationality, bio,
    preMatchRitual, secretTalent, favouritePlaylist, recoveryRoutine,
    racket, shoes, grip, bag,
    "homeClub": homeClub->{ name, slug }
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
  *[_type == "club"] | order(name asc) {
    name, slug, logo, coverPhoto, courts,
    "address": location.address
  }
`

export const clubBySlugQuery = `
  *[_type == "club" && slug.current == $slug][0] {
    name, slug, logo, coverPhoto, description,
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
```

- [ ] **Step 4: Commit**

```bash
git add sanity/lib/
git commit -m "feat: add sanity client, image url helper, and groq queries"
```

---

## Task 14: Shared UI Components — PortableText and MuxVideoPlayer

**Files:**
- Create: `components/ui/PortableText.tsx`, `components/ui/MuxVideoPlayer.tsx`

- [ ] **Step 1: Write PortableText.tsx**

Create `components/ui/PortableText.tsx`:
```tsx
import { PortableText as SanityPortableText } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'

interface Props {
  value: PortableTextBlock[]
}

export function PortableText({ value }: Props) {
  return (
    <div className="prose prose-gray max-w-none">
      <SanityPortableText value={value} />
    </div>
  )
}
```

- [ ] **Step 2: Write MuxVideoPlayer.tsx**

Create `components/ui/MuxVideoPlayer.tsx`:
```tsx
'use client'

import MuxPlayer from '@mux/mux-player-react'

interface Props {
  playbackId: string
  title?: string
}

export function MuxVideoPlayer({ playbackId, title }: Props) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={{ video_title: title ?? 'Interview' }}
      className="w-full aspect-video rounded-lg overflow-hidden"
    />
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/
git commit -m "feat: add PortableText and MuxVideoPlayer shared components"
```

---

## Task 15: Card Components — ArticleCard and EventCard

**Files:**
- Create: `components/cards/ArticleCard.tsx`, `components/cards/EventCard.tsx`
- Create: `__tests__/components/ArticleCard.test.tsx`, `__tests__/components/EventCard.test.tsx`

- [ ] **Step 1: Write failing test for ArticleCard**

Create `__tests__/components/ArticleCard.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- ArticleCard
```
Expected: FAIL with "Cannot find module '@/components/cards/ArticleCard'"

- [ ] **Step 3: Write ArticleCard.tsx**

Create `components/cards/ArticleCard.tsx`:
```tsx
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/urlFor'

interface Article {
  title: string
  slug: { current: string }
  excerpt?: string
  coverImage?: unknown
  publishedAt?: string
  category?: string
  authorName?: string
}

interface Props {
  article: Article
}

export function ArticleCard({ article }: Props) {
  return (
    <Link href={`/news/${article.slug.current}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors">
        {article.coverImage && (
          <div className="relative h-48 bg-gray-100">
            <Image
              src={urlFor(article.coverImage).width(600).height(400).url()}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-4">
          {article.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {article.category}
            </span>
          )}
          <h3 className="mt-1 font-bold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
          )}
          {article.authorName && (
            <p className="mt-3 text-xs text-gray-400">{article.authorName}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- ArticleCard
```
Expected: 3 tests pass.

- [ ] **Step 5: Write failing test for EventCard**

Create `__tests__/components/EventCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { EventCard } from '@/components/cards/EventCard'

const mockEvent = {
  title: 'Bali Padel Open 2026',
  slug: { current: 'bali-padel-open-2026' },
  date: '2026-06-15T09:00:00Z',
  eventType: 'tournament',
  coverImage: null,
  venue: { name: 'Seminyak Padel Club', slug: { current: 'seminyak-padel-club' } },
}

describe('EventCard', () => {
  it('renders the event title', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('Bali Padel Open 2026')).toBeInTheDocument()
  })

  it('renders the venue name', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('Seminyak Padel Club')).toBeInTheDocument()
  })

  it('links to the correct URL', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/events/bali-padel-open-2026')
  })
})
```

- [ ] **Step 6: Run test — expect FAIL**

```bash
npm test -- EventCard
```
Expected: FAIL with "Cannot find module '@/components/cards/EventCard'"

- [ ] **Step 7: Write EventCard.tsx**

Create `components/cards/EventCard.tsx`:
```tsx
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/urlFor'

interface Event {
  title: string
  slug: { current: string }
  date?: string
  eventType?: string
  coverImage?: unknown
  venue?: { name: string; slug: { current: string } }
}

interface Props {
  event: Event
}

export function EventCard({ event }: Props) {
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <Link href={`/events/${event.slug.current}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors">
        {event.coverImage && (
          <div className="relative h-48 bg-gray-100">
            <Image
              src={urlFor(event.coverImage).width(600).height(400).url()}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-4">
          {event.eventType && (
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {event.eventType}
            </span>
          )}
          <h3 className="mt-1 font-bold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
            {event.title}
          </h3>
          {formattedDate && (
            <p className="mt-2 text-sm text-gray-500">{formattedDate}</p>
          )}
          {event.venue && (
            <p className="mt-1 text-xs text-gray-400">{event.venue.name}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 8: Run test — expect PASS**

```bash
npm test -- EventCard
```
Expected: 3 tests pass.

- [ ] **Step 9: Commit**

```bash
git add components/cards/ __tests__/
git commit -m "feat: add ArticleCard and EventCard with tests"
```

---

## Task 16: Card Components — InterviewCard, PlayerCard, ClubCard

**Files:**
- Create: `components/cards/InterviewCard.tsx`, `components/cards/PlayerCard.tsx`, `components/cards/ClubCard.tsx`
- Create: `__tests__/components/InterviewCard.test.tsx`, `__tests__/components/PlayerCard.test.tsx`, `__tests__/components/ClubCard.test.tsx`

- [ ] **Step 1: Write failing tests for all three cards**

Create `__tests__/components/InterviewCard.test.tsx`:
```tsx
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
```

Create `__tests__/components/PlayerCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { PlayerCard } from '@/components/cards/PlayerCard'

const mockPlayer = {
  name: 'Marco Garcia',
  slug: { current: 'marco-garcia' },
  photo: null,
  currentRanking: 1,
  nationality: 'Spanish',
  homeClubName: 'Seminyak Padel Club',
}

describe('PlayerCard', () => {
  it('renders the player name', () => {
    render(<PlayerCard player={mockPlayer} />)
    expect(screen.getByText('Marco Garcia')).toBeInTheDocument()
  })

  it('renders the ranking', () => {
    render(<PlayerCard player={mockPlayer} />)
    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('links to the correct URL', () => {
    render(<PlayerCard player={mockPlayer} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/players/marco-garcia')
  })
})
```

Create `__tests__/components/ClubCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { ClubCard } from '@/components/cards/ClubCard'

const mockClub = {
  name: 'Seminyak Padel Club',
  slug: { current: 'seminyak-padel-club' },
  logo: null,
  coverPhoto: null,
  courts: { count: 4, surfaceType: 'Artificial Grass' },
  address: 'Jl. Kayu Aya, Seminyak',
}

describe('ClubCard', () => {
  it('renders the club name', () => {
    render(<ClubCard club={mockClub} />)
    expect(screen.getByText('Seminyak Padel Club')).toBeInTheDocument()
  })

  it('renders court count', () => {
    render(<ClubCard club={mockClub} />)
    expect(screen.getByText('4 courts')).toBeInTheDocument()
  })

  it('links to the correct URL', () => {
    render(<ClubCard club={mockClub} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/clubs/seminyak-padel-club')
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- InterviewCard PlayerCard ClubCard
```
Expected: all 3 fail with "Cannot find module"

- [ ] **Step 3: Write InterviewCard.tsx**

Create `components/cards/InterviewCard.tsx`:
```tsx
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/urlFor'

interface Interview {
  title: string
  slug: { current: string }
  publishedAt?: string
  coverImage?: unknown
  subject?: { name: string; slug: { current: string } }
}

interface Props {
  interview: Interview
}

export function InterviewCard({ interview }: Props) {
  const formattedDate = interview.publishedAt
    ? new Date(interview.publishedAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <Link href={`/interviews/${interview.slug.current}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors">
        {interview.coverImage && (
          <div className="relative h-48 bg-gray-100">
            <Image
              src={urlFor(interview.coverImage).width(600).height(400).url()}
              alt={interview.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Interview
          </span>
          <h3 className="mt-1 font-bold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
            {interview.title}
          </h3>
          {interview.subject && (
            <p className="mt-2 text-sm text-gray-500">{interview.subject.name}</p>
          )}
          {formattedDate && (
            <p className="mt-1 text-xs text-gray-400">{formattedDate}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Write PlayerCard.tsx**

Create `components/cards/PlayerCard.tsx`:
```tsx
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/urlFor'

interface Player {
  name: string
  slug: { current: string }
  photo?: unknown
  currentRanking?: number
  nationality?: string
  homeClubName?: string
}

interface Props {
  player: Player
}

export function PlayerCard({ player }: Props) {
  return (
    <Link href={`/players/${player.slug.current}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors">
        {player.photo && (
          <div className="relative h-48 bg-gray-100">
            <Image
              src={urlFor(player.photo).width(400).height(400).url()}
              alt={player.name}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
              {player.name}
            </h3>
            {player.currentRanking && (
              <span className="text-sm font-semibold text-gray-400">
                #{player.currentRanking}
              </span>
            )}
          </div>
          {player.nationality && (
            <p className="mt-1 text-sm text-gray-500">{player.nationality}</p>
          )}
          {player.homeClubName && (
            <p className="mt-1 text-xs text-gray-400">{player.homeClubName}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 5: Write ClubCard.tsx**

Create `components/cards/ClubCard.tsx`:
```tsx
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/urlFor'

interface Club {
  name: string
  slug: { current: string }
  logo?: unknown
  coverPhoto?: unknown
  courts?: { count: number; surfaceType: string }
  address?: string
}

interface Props {
  club: Club
}

export function ClubCard({ club }: Props) {
  const coverImage = club.coverPhoto || club.logo

  return (
    <Link href={`/clubs/${club.slug.current}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors">
        {coverImage && (
          <div className="relative h-40 bg-gray-100">
            <Image
              src={urlFor(coverImage).width(600).height(300).url()}
              alt={club.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
            {club.name}
          </h3>
          {club.courts && (
            <p className="mt-1 text-sm text-gray-500">
              {club.courts.count} courts · {club.courts.surfaceType}
            </p>
          )}
          {club.address && (
            <p className="mt-1 text-xs text-gray-400">{club.address}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 6: Run tests — expect PASS**

```bash
npm test -- InterviewCard PlayerCard ClubCard
```
Expected: 9 tests pass across 3 suites.

- [ ] **Step 7: Commit**

```bash
git add components/cards/ __tests__/
git commit -m "feat: add InterviewCard, PlayerCard, ClubCard with tests"
```

---

## Task 17: Homepage Page

**Files:**
- Create: `app/(site)/page.tsx`

- [ ] **Step 1: Write the homepage**

Create `app/(site)/page.tsx`:
```tsx
import { client } from '@/sanity/lib/client'
import {
  homepageQuery,
  latestArticlesQuery,
  upcomingEventsQuery,
} from '@/sanity/lib/queries'
import { ArticleCard } from '@/components/cards/ArticleCard'
import { EventCard } from '@/components/cards/EventCard'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 60

export default async function HomePage() {
  const [homepage, latestArticles, upcomingEvents] = await Promise.all([
    client.fetch(homepageQuery),
    client.fetch(latestArticlesQuery, { limit: 6 }),
    client.fetch(upcomingEventsQuery, { limit: 3 }),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      {homepage?.featuredArticle && (
        <section className="mb-16">
          <Link href={`/news/${homepage.featuredArticle.slug.current}`} className="group block">
            <div className="relative h-[480px] rounded-2xl overflow-hidden bg-gray-100">
              {homepage.featuredArticle.coverImage && (
                <Image
                  src={urlFor(homepage.featuredArticle.coverImage).width(1400).height(700).url()}
                  alt={homepage.featuredArticle.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                  Featured
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                  {homepage.featuredArticle.title}
                </h1>
                {homepage.featuredArticle.excerpt && (
                  <p className="mt-3 text-gray-200 text-lg line-clamp-2">
                    {homepage.featuredArticle.excerpt}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Latest News */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest News</h2>
          <Link href="/news" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles?.map((article: any) => (
            <ArticleCard key={article.slug.current} article={article} />
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents?.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <Link href="/events" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {upcomingEvents.map((event: any) => (
              <EventCard key={event.slug.current} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Players */}
      {homepage?.featuredPlayers?.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Players</h2>
            <Link href="/players" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {homepage.featuredPlayers.map((player: any) => (
              <Link
                key={player.slug.current}
                href={`/players/${player.slug.current}`}
                className="group text-center"
              >
                <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden bg-gray-100 mb-3">
                  {player.photo && (
                    <Image
                      src={urlFor(player.photo).width(200).height(200).url()}
                      alt={player.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="font-semibold text-sm group-hover:text-gray-600 transition-colors">
                  {player.name}
                </p>
                {player.currentRanking && (
                  <p className="text-xs text-gray-400">#{player.currentRanking}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Start dev server and check the homepage loads**

```bash
npm run dev
```
Open `http://localhost:3000`. Expected: page loads with no errors (sections appear empty until content is added in Studio).

- [ ] **Step 3: Commit**

```bash
git add app/\(site\)/page.tsx
git commit -m "feat: add homepage with hero, news, events, and players sections"
```

---

## Task 18: News Pages

**Files:**
- Create: `app/(site)/news/page.tsx`, `app/(site)/news/[slug]/page.tsx`

- [ ] **Step 1: Write the news index page**

Create `app/(site)/news/page.tsx`:
```tsx
import { client } from '@/sanity/lib/client'
import { latestArticlesQuery } from '@/sanity/lib/queries'
import { ArticleCard } from '@/components/cards/ArticleCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'News' }
export const revalidate = 60

export default async function NewsPage() {
  const articles = await client.fetch(latestArticlesQuery, { limit: 50 })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">News</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.map((article: any) => (
          <ArticleCard key={article.slug.current} article={article} />
        ))}
      </div>
      {articles?.length === 0 && (
        <p className="text-gray-400 text-center py-20">No articles published yet.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Write the article detail page**

Create `app/(site)/news/[slug]/page.tsx`:
```tsx
import { client } from '@/sanity/lib/client'
import { articleBySlugQuery } from '@/sanity/lib/queries'
import { PortableText } from '@/components/ui/PortableText'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await client.fetch(articleBySlugQuery, { slug })
  return { title: article?.title ?? 'Article' }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await client.fetch(articleBySlugQuery, { slug })

  if (!article) notFound()

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {article.category && (
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {article.category}
        </span>
      )}
      <h1 className="mt-2 text-4xl font-bold leading-tight">{article.title}</h1>
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        {article.author?.name && <span>{article.author.name}</span>}
        {publishedDate && <span>{publishedDate}</span>}
      </div>
      {article.coverImage && (
        <div className="relative mt-8 h-80 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={urlFor(article.coverImage).width(1200).height(600).url()}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}
      {article.body && (
        <div className="mt-10">
          <PortableText value={article.body} />
        </div>
      )}
    </article>
  )
}
```

- [ ] **Step 3: Verify pages load**

```bash
npm run dev
```
Open `http://localhost:3000/news`. Expected: page renders with "No articles published yet." message.

- [ ] **Step 4: Commit**

```bash
git add "app/(site)/news/"
git commit -m "feat: add news index and article detail pages"
```

---

## Task 19: Events Pages

**Files:**
- Create: `app/(site)/events/page.tsx`, `app/(site)/events/[slug]/page.tsx`

- [ ] **Step 1: Write the events index page**

Create `app/(site)/events/page.tsx`:
```tsx
import { client } from '@/sanity/lib/client'
import { allEventsQuery, upcomingEventsQuery } from '@/sanity/lib/queries'
import { EventCard } from '@/components/cards/EventCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Events' }
export const revalidate = 60

export default async function EventsPage() {
  const [upcoming, all] = await Promise.all([
    client.fetch(upcomingEventsQuery, { limit: 20 }),
    client.fetch(allEventsQuery),
  ])
  const past = all?.filter(
    (e: any) => !upcoming?.some((u: any) => u.slug.current === e.slug.current)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Events</h1>

      {upcoming?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-500 uppercase tracking-wide text-sm">
            Upcoming
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((event: any) => (
              <EventCard key={event.slug.current} event={event} />
            ))}
          </div>
        </section>
      )}

      {past?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-500 uppercase tracking-wide text-sm">
            Past
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {past.map((event: any) => (
              <EventCard key={event.slug.current} event={event} />
            ))}
          </div>
        </section>
      )}

      {all?.length === 0 && (
        <p className="text-gray-400 text-center py-20">No events published yet.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Write the event detail page**

Create `app/(site)/events/[slug]/page.tsx`:
```tsx
import { client } from '@/sanity/lib/client'
import { eventBySlugQuery } from '@/sanity/lib/queries'
import { PortableText } from '@/components/ui/PortableText'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await client.fetch(eventBySlugQuery, { slug })
  return { title: event?.title ?? 'Event' }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await client.fetch(eventBySlugQuery, { slug })

  if (!event) notFound()

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString('en-AU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {event.eventType && (
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {event.eventType}
        </span>
      )}
      <h1 className="mt-2 text-4xl font-bold leading-tight">{event.title}</h1>
      {formattedDate && (
        <p className="mt-3 text-lg text-gray-600">{formattedDate}</p>
      )}
      {event.venue && (
        <Link
          href={`/clubs/${event.venue.slug.current}`}
          className="mt-1 text-sm text-gray-500 hover:underline"
        >
          {event.venue.name}
          {event.venue.location?.address && ` — ${event.venue.location.address}`}
        </Link>
      )}
      {event.coverImage && (
        <div className="relative mt-8 h-72 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={urlFor(event.coverImage).width(1200).height(600).url()}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}
      {event.description && (
        <div className="mt-10">
          <PortableText value={event.description} />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/events/"
git commit -m "feat: add events index and event detail pages"
```

---

## Task 20: Interviews Pages with Mux Video

**Files:**
- Create: `app/(site)/interviews/page.tsx`, `app/(site)/interviews/[slug]/page.tsx`

- [ ] **Step 1: Write the interviews index page**

Create `app/(site)/interviews/page.tsx`:
```tsx
import { client } from '@/sanity/lib/client'
import { allInterviewsQuery } from '@/sanity/lib/queries'
import { InterviewCard } from '@/components/cards/InterviewCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Interviews' }
export const revalidate = 60

export default async function InterviewsPage() {
  const interviews = await client.fetch(allInterviewsQuery)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Interviews</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews?.map((interview: any) => (
          <InterviewCard key={interview.slug.current} interview={interview} />
        ))}
      </div>
      {interviews?.length === 0 && (
        <p className="text-gray-400 text-center py-20">No interviews published yet.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Write the interview detail page**

Create `app/(site)/interviews/[slug]/page.tsx`:
```tsx
import { client } from '@/sanity/lib/client'
import { interviewBySlugQuery } from '@/sanity/lib/queries'
import { PortableText } from '@/components/ui/PortableText'
import { MuxVideoPlayer } from '@/components/ui/MuxVideoPlayer'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const interview = await client.fetch(interviewBySlugQuery, { slug })
  return { title: interview?.title ?? 'Interview' }
}

export default async function InterviewPage({ params }: Props) {
  const { slug } = await params
  const interview = await client.fetch(interviewBySlugQuery, { slug })

  if (!interview) notFound()

  const publishedDate = interview.publishedAt
    ? new Date(interview.publishedAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Interview
      </span>
      <h1 className="mt-2 text-4xl font-bold leading-tight">{interview.title}</h1>
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        {interview.subject && (
          <Link href={`/players/${interview.subject.slug.current}`} className="hover:underline">
            {interview.subject.name}
          </Link>
        )}
        {publishedDate && <span>{publishedDate}</span>}
      </div>

      {/* Mux Video Player */}
      {interview.videoPlaybackId && (
        <div className="mt-8">
          <MuxVideoPlayer
            playbackId={interview.videoPlaybackId}
            title={interview.title}
          />
        </div>
      )}

      {/* Fallback cover image if no video */}
      {!interview.videoPlaybackId && interview.coverImage && (
        <div className="relative mt-8 h-72 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={urlFor(interview.coverImage).width(1200).height(600).url()}
            alt={interview.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {interview.body && (
        <div className="mt-10">
          <PortableText value={interview.body} />
        </div>
      )}
    </article>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/interviews/"
git commit -m "feat: add interviews index and detail pages with mux video player"
```

---

## Task 21: Players Pages

**Files:**
- Create: `app/(site)/players/page.tsx`, `app/(site)/players/[slug]/page.tsx`

- [ ] **Step 1: Write the players index page**

Create `app/(site)/players/page.tsx`:
```tsx
import { client } from '@/sanity/lib/client'
import { allPlayersQuery } from '@/sanity/lib/queries'
import { PlayerCard } from '@/components/cards/PlayerCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Players' }
export const revalidate = 60

export default async function PlayersPage() {
  const players = await client.fetch(allPlayersQuery)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Players</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {players?.map((player: any) => (
          <PlayerCard key={player.slug.current} player={player} />
        ))}
      </div>
      {players?.length === 0 && (
        <p className="text-gray-400 text-center py-20">No players added yet.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Write the player profile page**

Create `app/(site)/players/[slug]/page.tsx`:
```tsx
import { client } from '@/sanity/lib/client'
import { playerBySlugQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const player = await client.fetch(playerBySlugQuery, { slug })
  return { title: player?.name ?? 'Player' }
}

export default async function PlayerPage({ params }: Props) {
  const { slug } = await params
  const player = await client.fetch(playerBySlugQuery, { slug })

  if (!player) notFound()

  const offTheCourt = [
    { label: 'Pre-match ritual', value: player.preMatchRitual },
    { label: 'Secret talent', value: player.secretTalent },
    { label: 'Favourite playlist', value: player.favouritePlaylist },
    { label: 'Recovery routine', value: player.recoveryRoutine },
  ].filter((item) => item.value)

  const inMyBag = [
    { label: 'Racket', value: player.racket },
    { label: 'Shoes', value: player.shoes },
    { label: 'Grip', value: player.grip },
    { label: 'Bag', value: player.bag },
  ].filter((item) => item.value)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {player.photo && (
          <div className="relative h-48 w-48 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={urlFor(player.photo).width(400).height(400).url()}
              alt={player.name}
              fill
              priority
              className="object-cover object-top"
            />
          </div>
        )}
        <div>
          <h1 className="text-4xl font-bold">{player.name}</h1>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
            {player.currentRanking && (
              <span className="font-semibold">Ranking #{player.currentRanking}</span>
            )}
            {player.nationality && <span>{player.nationality}</span>}
            {player.homeClub && (
              <Link
                href={`/clubs/${player.homeClub.slug.current}`}
                className="hover:underline"
              >
                {player.homeClub.name}
              </Link>
            )}
          </div>
          {player.bio && (
            <p className="mt-4 text-gray-600 leading-relaxed">{player.bio}</p>
          )}
        </div>
      </div>

      {offTheCourt.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Off The Court</h2>
          <dl className="space-y-4">
            {offTheCourt.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {label}
                </dt>
                <dd className="mt-1 text-gray-700">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {inMyBag.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">In My Bag</h2>
          <dl className="grid grid-cols-2 gap-4">
            {inMyBag.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {label}
                </dt>
                <dd className="mt-1 font-medium text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/players/"
git commit -m "feat: add players index and player profile pages"
```

---

## Task 22: Rankings Page

**Files:**
- Create: `app/(site)/rankings/page.tsx`

- [ ] **Step 1: Write the rankings page**

Create `app/(site)/rankings/page.tsx`:
```tsx
import { client } from '@/sanity/lib/client'
import { rankingByCategoryQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Rankings' }
export const revalidate = 60

const CATEGORIES = [
  { key: 'men', label: 'Men' },
  { key: 'women', label: 'Women' },
  { key: 'mixed', label: 'Mixed' },
]

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function RankingsPage({ searchParams }: Props) {
  const { category: categoryParam } = await searchParams
  const activeCategory = CATEGORIES.find((c) => c.key === categoryParam)?.key ?? 'men'

  const ranking = await client.fetch(rankingByCategoryQuery, { category: activeCategory })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Rankings</h1>

      {/* Category tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {CATEGORIES.map(({ key, label }) => (
          <Link
            key={key}
            href={`/rankings?category=${key}`}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeCategory === key
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {ranking?.entries?.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="text-left py-2 w-10">#</th>
              <th className="text-left py-2">Player</th>
              <th className="text-right py-2">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ranking.entries.map((entry: any) => (
              <tr key={entry.rank} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 text-sm font-semibold text-gray-400">{entry.rank}</td>
                <td className="py-3">
                  <Link
                    href={`/players/${entry.player.slug.current}`}
                    className="flex items-center gap-3 hover:underline"
                  >
                    {entry.player.photo && (
                      <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={urlFor(entry.player.photo).width(64).height(64).url()}
                          alt={entry.player.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{entry.player.name}</p>
                      {entry.player.nationality && (
                        <p className="text-xs text-gray-400">{entry.player.nationality}</p>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="py-3 text-right text-sm font-semibold">{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400 text-center py-20">No rankings published yet.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/(site)/rankings/"
git commit -m "feat: add rankings page with category tabs"
```

---

## Task 23: Clubs Pages

**Files:**
- Create: `app/(site)/clubs/page.tsx`, `app/(site)/clubs/[slug]/page.tsx`

- [ ] **Step 1: Write the clubs directory page**

Create `app/(site)/clubs/page.tsx`:
```tsx
import { client } from '@/sanity/lib/client'
import { allClubsQuery } from '@/sanity/lib/queries'
import { ClubCard } from '@/components/cards/ClubCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Clubs' }
export const revalidate = 60

export default async function ClubsPage() {
  const clubs = await client.fetch(allClubsQuery)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Clubs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs?.map((club: any) => (
          <ClubCard key={club.slug.current} club={club} />
        ))}
      </div>
      {clubs?.length === 0 && (
        <p className="text-gray-400 text-center py-20">No clubs added yet.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Write the club detail page**

Create `app/(site)/clubs/[slug]/page.tsx`:
```tsx
import { client } from '@/sanity/lib/client'
import {
  clubBySlugQuery,
  eventsByClubQuery,
  playersByClubQuery,
} from '@/sanity/lib/queries'
import { PortableText } from '@/components/ui/PortableText'
import { EventCard } from '@/components/cards/EventCard'
import { PlayerCard } from '@/components/cards/PlayerCard'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const club = await client.fetch(clubBySlugQuery, { slug })
  return { title: club?.name ?? 'Club' }
}

export default async function ClubPage({ params }: Props) {
  const { slug } = await params
  const club = await client.fetch(clubBySlugQuery, { slug })

  if (!club) notFound()

  const [events, players] = await Promise.all([
    client.fetch(eventsByClubQuery, { clubId: club._id }),
    client.fetch(playersByClubQuery, { clubId: club._id }),
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Cover photo */}
      {club.coverPhoto && (
        <div className="relative h-64 rounded-2xl overflow-hidden bg-gray-100 mb-8">
          <Image
            src={urlFor(club.coverPhoto).width(1200).height(500).url()}
            alt={club.name}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {club.logo && (
          <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={urlFor(club.logo).width(128).height(128).url()}
              alt={`${club.name} logo`}
              fill
              className="object-contain"
            />
          </div>
        )}
        <div>
          <h1 className="text-4xl font-bold">{club.name}</h1>
          {club.location?.address && (
            <p className="text-gray-500 mt-1">{club.location.address}</p>
          )}
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
        {club.courts?.count && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Courts</p>
            <p className="font-semibold mt-1">{club.courts.count}</p>
          </div>
        )}
        {club.courts?.surfaceType && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Surface</p>
            <p className="font-semibold mt-1">{club.courts.surfaceType}</p>
          </div>
        )}
        {club.facilities?.length > 0 && (
          <div className="col-span-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Facilities</p>
            <p className="font-semibold mt-1">{club.facilities.join(' · ')}</p>
          </div>
        )}
      </div>

      {/* Contact links */}
      <div className="flex flex-wrap gap-4 mb-8">
        {club.website && (
          <a
            href={club.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 underline"
          >
            Website
          </a>
        )}
        {club.instagram && (
          <a
            href={club.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 underline"
          >
            Instagram
          </a>
        )}
        {club.whatsapp && (
          <a
            href={`https://wa.me/${club.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 underline"
          >
            WhatsApp
          </a>
        )}
        {club.location?.googleMapsUrl && (
          <a
            href={club.location.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 underline"
          >
            Google Maps
          </a>
        )}
      </div>

      {/* Description */}
      {club.description && (
        <div className="mb-12">
          <PortableText value={club.description} />
        </div>
      )}

      {/* Associated events */}
      {events?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map((event: any) => (
              <EventCard key={event.slug.current} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Associated players */}
      {players?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Players</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {players.map((player: any) => (
              <PlayerCard key={player.slug.current} player={player} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/clubs/"
git commit -m "feat: add clubs directory and club detail pages"
```

---

## Task 24: Run Full Test Suite and Deployment Setup

**Files:**
- Create: `vercel.json` (optional)

- [ ] **Step 1: Run all tests**

```bash
npm test
```
Expected: all tests pass across 5 test suites (ArticleCard, EventCard, InterviewCard, PlayerCard, ClubCard).

- [ ] **Step 2: Run a production build locally to catch any type/build errors**

```bash
npm run build
```
Expected: build succeeds with no errors. Fix any TypeScript or build errors before proceeding.

- [ ] **Step 3: Push to GitHub**

Create a new repository on GitHub named `bali-padel-insider`, then:
```bash
git remote add origin https://github.com/<your-username>/bali-padel-insider.git
git branch -M main
git push -u origin main
```

- [ ] **Step 4: Deploy to Vercel**

Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub → select `bali-padel-insider`.

Under **Environment Variables**, add all five from `.env.local`:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`
- `MUX_TOKEN_ID`
- `MUX_TOKEN_SECRET`

Click Deploy. Wait for the build to complete.

- [ ] **Step 5: Verify production deployment**

Open the Vercel production URL:
- `/` — homepage loads
- `/news` — news index loads
- `/studio` — Sanity Studio loads (log in with your Sanity account)

- [ ] **Step 6: Configure Sanity CORS for production domain**

Go to [sanity.io/manage](https://sanity.io/manage) → your project → API → CORS Origins → Add Origin:
- Add your Vercel production URL (e.g. `https://bali-padel-insider.vercel.app`)
- Check "Allow credentials"

- [ ] **Step 7: Create dev branch**

```bash
git checkout -b dev
git push -u origin dev
```
Vercel will auto-create a preview URL for the `dev` branch.

---

## Self-Review Notes

- All 8 content types from the spec are implemented as Sanity schemas (article, author, club, event, interview, player, ranking, homepage)
- All 13 routes from the spec are implemented as Next.js pages
- Mux video is handled in the interview schema (`mux.video` field) and rendered via `MuxVideoPlayer` client component on the interview detail page
- Player profile "Off The Court" and "In My Bag" field groups are implemented with Sanity's `groups` API
- Club page fetches linked events and players dynamically
- All pages use `revalidate = 60` for ISR
- Studio is isolated in its own layout with no Header/Footer
- All environment variables are documented in `.env.local.example`
- Card components have full test coverage
