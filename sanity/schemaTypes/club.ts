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
    defineField({ name: 'isPremium', title: 'Premium Club', type: 'boolean' }),
    defineField({ name: 'rating', title: 'Rating (0–5)', type: 'number' }),
    defineField({ name: 'pricePerHour', title: 'Price per Hour (USD)', type: 'number' }),
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
        defineField({ name: 'lat', title: 'Latitude', type: 'number', description: 'e.g. -8.8291 for Uluwatu' }),
        defineField({ name: 'lng', title: 'Longitude', type: 'number', description: 'e.g. 115.0849 for Uluwatu' }),
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
        list: [
          'Lights', 'Pro Shop', 'Cafe', 'Bar', 'Restaurant',
          'Changing Rooms', 'Showers', 'Parking', 'Pool',
          'Spa', 'Gym', 'WiFi', 'Ice Bath', 'Smoothie Bar',
        ],
      },
    }),
    defineField({ name: 'website', type: 'url' }),
    defineField({ name: 'instagram', type: 'url' }),
    defineField({ name: 'whatsapp', type: 'string' }),
  ],
})
