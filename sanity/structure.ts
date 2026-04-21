import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('homepage').title('Homepage'),
      S.divider(),
      S.documentTypeListItem('article').title('Articles'),
      S.documentTypeListItem('feature').title('Features'),
      S.documentTypeListItem('interview').title('Interviews'),
      S.documentTypeListItem('event').title('Events'),
      S.documentTypeListItem('ranking').title('Rankings'),
      S.divider(),
      S.documentTypeListItem('player').title('Players'),
      S.documentTypeListItem('club').title('Clubs'),
      S.documentTypeListItem('author').title('Authors'),
    ])
