import { defineField, defineType } from 'sanity'

export const player = defineType({
  name: 'player',
  title: 'Player',
  type: 'document',
  groups: [
    { name: 'core', title: 'Core Info', default: true },
    { name: 'stats', title: 'Stats' },
    { name: 'interview', title: 'Island Mindset Q&A' },
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
    defineField({
      name: 'tier',
      title: 'Player Tier',
      type: 'string',
      description: 'e.g. Master Pro, Pro, Amateur',
      group: 'core',
    }),
    defineField({ name: 'bio', type: 'text', group: 'core' }),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true }, group: 'core' }),
    defineField({ name: 'currentRanking', type: 'number', group: 'core' }),
    defineField({
      name: 'homeClub',
      type: 'reference',
      to: [{ type: 'club' }],
      group: 'core',
    }),

    // Stats
    defineField({ name: 'winRate', title: 'Career Win Rate', description: 'e.g. 89%', type: 'string', group: 'stats' }),
    defineField({ name: 'matchesPlayed', type: 'number', group: 'stats' }),
    defineField({ name: 'smashPower', title: 'Smash Power (km/h)', type: 'number', group: 'stats' }),
    defineField({ name: 'titles', type: 'number', group: 'stats' }),
    defineField({ name: 'isClubMvp', title: 'Club MVP', type: 'boolean', group: 'stats' }),
    defineField({
      name: 'recentResults',
      title: 'Recent Results',
      type: 'array',
      group: 'stats',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'tournamentName', type: 'string' }),
            defineField({ name: 'opponent', type: 'string', description: 'e.g. Final vs. David K.' }),
            defineField({ name: 'score', type: 'string', description: 'e.g. 6-2, 6-4' }),
            defineField({ name: 'isWin', title: 'Win?', type: 'boolean' }),
          ],
          preview: {
            select: { title: 'tournamentName', subtitle: 'score' },
          },
        },
      ],
    }),

    // Island Mindset Q&A
    defineField({ name: 'islandMindsetQ1', title: 'Question 1', type: 'string', group: 'interview' }),
    defineField({ name: 'islandMindsetA1', title: 'Answer 1', type: 'text', group: 'interview' }),
    defineField({ name: 'islandMindsetQ2', title: 'Question 2', type: 'string', group: 'interview' }),
    defineField({ name: 'islandMindsetA2', title: 'Answer 2', type: 'text', group: 'interview' }),

    // Off the Court
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
