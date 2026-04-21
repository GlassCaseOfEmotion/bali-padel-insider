import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'sugezanr',
  dataset: 'production',
  token: 'skCQDfRcQrLdsjYRPipzpeSSNbuDHliJ0rAFB5WuXViJke9zLclvE8cJYIrwLvbEUSiB6LnrhJ9dNDqBGjYUxVBlCnRYQSnCRB1loLEtMQZLm9Yx0BwDYoQIJtChWdtiq34CrhDAhdzZYgHxMQ4H3YUSChnBA3TEeQrsNig8KMni0UkH9QvF',
  apiVersion: '2021-06-07',
  useCdn: false,
})

// ── FIND IDs ──────────────────────────────────────────────────────────────────
const [event] = await client.fetch(`*[_type=="event" && slug.current=="bali-mixed-doubles-2026"]{_id}`)
const [interview] = await client.fetch(`*[_type=="interview" && slug.current=="sari-wulandari-rewriting-possible"]{_id}`)

console.log('Event ID:', event._id)
console.log('Interview ID:', interview._id)

// ── PATCH EVENT ───────────────────────────────────────────────────────────────
// Registration deadline: 48 hours from now
const deadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

await client
  .patch(event._id)
  .set({
    endDate: '2026-06-09T18:00:00.000Z',
    level: 'Pro & Intermediate',
    excerpt: 'Elevate your game where the jungle meets the sea. Experience Bali\'s most prestigious mixed doubles tournament of 2026.',
    registrationUrl: 'https://example.com/register',
    bracketUrl: 'https://example.com/bracket',
    registrationDeadline: deadline,
    prizePool: {
      total: 25000,
      first: 'Gold / $12,000',
      second: 'Silver / $8,000',
      third: 'Bronze / $5,000',
    },
    schedule: [
      { _key: 'sched-1', phase: 'Registration Opens', datetime: 'Friday, 8:00 AM — 10:00 PM', isFeatured: false },
      { _key: 'sched-2', phase: 'Quarter & Semi Finals', datetime: 'Saturday, 10:00 AM — 8:00 PM', isFeatured: false },
      { _key: 'sched-3', phase: 'Championship Sunday', datetime: 'Sunday, 12:00 PM — 6:00 PM', isFeatured: true },
    ],
    sponsors: ['Volt Sports', 'Bali Botanics', 'Island Hydration', 'Peak Gear', 'Oceanic Co.'],
    shuttleInfo: 'Complimentary pickup available from major Seminyak and Canggu resorts for all registered competitors.',
    conciergeEmail: 'events@balipadelinsider.com',
  })
  .commit()

console.log('✅ Event patched')

// ── PATCH INTERVIEW ───────────────────────────────────────────────────────────
await client
  .patch(interview._id)
  .set({
    category: 'The Pro Series',
    readTime: 12,
    excerpt: 'The best padel player Indonesia has ever produced opens up about the spiritual side of the sport, finding flow in the Bali humidity, and why your next game is won before you step onto the court.',
    pullQuote: 'Padel isn\'t just about the smash. It\'s about the chess game played at 120 beats per minute. If your mind isn\'t calm, the walls become your enemies instead of your allies.',
    ctaTitle: 'Train with Sari',
    ctaBody: 'Join our exclusive Masterclass series. Limited to 8 players per session. Book your spot before they sell out.',
    ctaUrl: 'https://example.com/masterclass',
    body: [
      {
        _key: 'body-1',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c1', _type: 'span', text: 'Sari Wulandari sits cross-legged on the stone steps of Bali Padel Club, her eyes fixed on the vibrant green canopy surrounding Court 1. She\'s just finished a three-hour session in the humid morning heat, yet she looks remarkably composed. For Sari, the environment is as much a part of her training as the drills themselves.', marks: [] }],
        markDefs: [],
      },
      {
        _key: 'body-2',
        _type: 'block',
        style: 'h3',
        children: [{ _key: 'c2', _type: 'span', text: 'Finding Stillness in the Swing', marks: [] }],
        markDefs: [],
      },
      {
        _key: 'body-3',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c3', _type: 'span', text: '"Most players focus on the mechanics — the grip, the footwork, the swing path," Wulandari says, gesturing toward the courts. "And those are vital. But when you are at 5-5 in the third set and the humidity is 90%, mechanics start to fail. That\'s when the Bali Mindset kicks in."', marks: [] }],
        markDefs: [],
      },
      {
        _key: 'body-4',
        _type: 'block',
        style: 'blockquote',
        children: [{ _key: 'c4', _type: 'span', text: 'Every court has a soul. In Bali, you don\'t fight the heat — you use it to melt your opponent\'s resolve.', marks: [] }],
        markDefs: [],
      },
      {
        _key: 'body-5',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c5', _type: 'span', text: 'Wulandari moved to Uluwatu last year, seeking a lifestyle that mirrored the kinetic energy of her sport. She believes the island\'s natural rhythm has fundamentally changed her approach to professional competition.', marks: [] }],
        markDefs: [],
      },
      {
        _key: 'body-6',
        _type: 'block',
        style: 'h3',
        children: [{ _key: 'c6', _type: 'span', text: 'The Technical Edge', marks: [] }],
        markDefs: [],
      },
      {
        _key: 'body-7',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c7', _type: 'span', text: 'BPI: You came from badminton. How long did it take padel to feel natural?', marks: [] }],
        markDefs: [],
      },
      {
        _key: 'body-8',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c8', _type: 'span', text: 'SW: Physically, about three months. My footwork transferred immediately. The mental model took longer — badminton is solo, padel is constant communication with your partner. That was the real adjustment.', marks: [] }],
        markDefs: [],
      },
      {
        _key: 'body-9',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c9', _type: 'span', text: 'BPI: What drives you competitively right now?', marks: [] }],
        markDefs: [],
      },
      {
        _key: 'body-10',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c10', _type: 'span', text: 'SW: I want to play at an international level. I want to test myself against the best women in the world. Bali gave me the foundation — now I need to take it global.', marks: [] }],
        markDefs: [],
      },
    ],
  })
  .commit()

console.log('✅ Interview patched')
console.log('Done. Reload your browser to see the changes.')
