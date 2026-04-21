/**
 * Seeds the "The Padel Pioneer" feature document using mock data from the Stitch design.
 * Run: node scripts/seed-feature.mjs
 * Requires SANITY_WRITE_TOKEN in .env.local (Editor role)
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local')
    const content = readFileSync(envPath, 'utf8')
    for (const line of content.split('\n')) {
      const match = line.match(/^([^#=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const val = match[2].trim().replace(/^["']|["']$/g, '')
        process.env[key] = val
      }
    }
  } catch { /* env vars already set */ }
}

loadEnv()

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-04-21',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

if (!process.env.SANITY_WRITE_TOKEN) {
  console.error('❌  SANITY_WRITE_TOKEN not set in .env.local')
  process.exit(1)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let keyCounter = 0
function k() { return `feat-key${++keyCounter}` }

function block(text, style = 'normal') {
  return {
    _type: 'block', _key: k(), style, markDefs: [],
    children: [{ _type: 'span', _key: k(), text, marks: [] }],
  }
}

async function img(seed, width, height) {
  const url = `https://picsum.photos/seed/${seed}/${width}/${height}`
  try {
    console.log(`  Uploading image: ${seed}...`)
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const buffer = Buffer.from(await response.arrayBuffer())
    const asset = await client.assets.upload('image', buffer, {
      filename: `${seed}-${width}x${height}.jpg`,
      contentType: 'image/jpeg',
    })
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  } catch (err) {
    console.warn(`  ⚠️  Skipped image ${seed}: ${err.message}`)
    return undefined
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log(`🌴 Seeding feature document to ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID} (${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'})\n`)

  console.log('📸 Uploading images...')
  const coverImage   = await img('pioneer-portrait',  800, 1000)
  const inlineImage1 = await img('padel-action-court', 800, 800)
  const inlineImage2 = await img('padel-club-social',  800, 800)
  const ctaImage     = await img('padel-sunset-court', 800, 1000)
  console.log('  ✅ Images done\n')

  const feature = {
    _id: 'mock-feature-padel-pioneer',
    _type: 'feature',

    title: 'The Padel Pioneer',
    slug: { _type: 'slug', current: 'the-padel-pioneer' },
    badge: 'Executive Spotlight',
    publishedAt: '2026-04-21T08:00:00Z',

    excerpt: "How one visionary sparked Bali's sporting revolution, transforming the island's landscape one court at a time.",

    coverImage,

    stats: [
      { _key: k(), value: '05',   label: 'Clubs Opened' },
      { _key: k(), value: '150+', label: 'Jobs Created' },
      { _key: k(), value: '12K',  label: 'Matches Played' },
      { _key: k(), value: '02',   label: 'Years Active' },
    ],

    pullQuote: "The challenge wasn't just building the courts—it was convincing a surf-centric island that a racquet sport could become their new morning ritual.",
    pullQuoteAttribution: 'On the early days',

    body: [
      block(
        "It started as a passion project during a quiet season in Uluwatu. Looking at the vast landscapes, we saw more than just real estate; we saw the potential for a social ecosystem that combined athletic vigor with Bali's unique hospitality.",
        'normal'
      ),
      block('The Reward of Impact', 'h3'),
      block(
        "Today, we see hundreds of locals and expats competing together every weekend. The jobs we've created—from coaches to court managers—are building futures. That's the real win. Padel is a catalyst for community. It's accessible, it's fast, and in a place like Bali, it's the perfect bridge between wellness and social life.",
        'normal'
      ),
      ...(inlineImage1 ? [{ ...inlineImage1, _key: k() }] : []),
      ...(inlineImage2 ? [{ ...inlineImage2, _key: k() }] : []),
      block(
        "As we look to the next year, the goal remains the same: Kinetic energy in every corner of the island. We aren't done yet.",
        'normal'
      ),
    ],

    ctaHeadline: 'Ready to start your legacy?',
    ctaBody: 'Join our latest league or book a session at our newest Seminyak flagship. Experience the revolution firsthand.',
    ctaPrimaryLabel: 'Join the League',
    ctaPrimaryUrl: '/events',
    ctaSecondaryLabel: 'Book Seminyak',
    ctaSecondaryUrl: '/clubs/bali-padel-club',
    ctaImage,
  }

  console.log('💾 Creating feature document...')
  try {
    await client.createOrReplace(feature)
    console.log('\n✅ Done! Feature document created:')
    console.log(`   /features/the-padel-pioneer`)
  } catch (err) {
    console.error('\n❌ Error:', err.message)
    if (err.details) console.error(JSON.stringify(err.details, null, 2))
    process.exit(1)
  }
}

seed()
