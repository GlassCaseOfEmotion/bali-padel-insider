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
    defineField({ name: 'preMatchRitual', type: 'text', group: 'offTheCourt' }),
    defineField({ name: 'secretTalent', type: 'text', group: 'offTheCourt' }),
    defineField({ name: 'favouritePlaylist', type: 'string', group: 'offTheCourt' }),
    defineField({ name: 'recoveryRoutine', type: 'text', group: 'offTheCourt' }),
    defineField({ name: 'racket', type: 'string', group: 'inMyBag' }),
    defineField({ name: 'shoes', type: 'string', group: 'inMyBag' }),
    defineField({ name: 'grip', type: 'string', group: 'inMyBag' }),
    defineField({ name: 'bag', type: 'string', group: 'inMyBag' }),
  ],
})
