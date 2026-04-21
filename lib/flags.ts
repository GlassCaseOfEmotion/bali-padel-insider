// ISO 3166-1 alpha-2 codes (lowercase) used by flagcdn.com
const NATIONALITY_TO_CODE: Record<string, string> = {
  Afghan: 'af', Albanian: 'al', Algerian: 'dz', American: 'us',
  Argentine: 'ar', Australian: 'au', Austrian: 'at',
  Bahraini: 'bh', Belgian: 'be', Bolivian: 'bo', Brazilian: 'br',
  British: 'gb', Bulgarian: 'bg',
  Canadian: 'ca', Chilean: 'cl', Chinese: 'cn', Colombian: 'co',
  Croatian: 'hr', Czech: 'cz',
  Danish: 'dk', Dutch: 'nl',
  Ecuadorian: 'ec', Egyptian: 'eg', Emirati: 'ae',
  Finnish: 'fi', French: 'fr',
  German: 'de', Greek: 'gr',
  Hungarian: 'hu',
  Indian: 'in', Indonesian: 'id', Iranian: 'ir', Irish: 'ie', Israeli: 'il', Italian: 'it',
  Japanese: 'jp', Jordanian: 'jo',
  Kenyan: 'ke', Korean: 'kr', Kuwaiti: 'kw',
  Malaysian: 'my', Mexican: 'mx', Moroccan: 'ma',
  'New Zealander': 'nz', Norwegian: 'no',
  Pakistani: 'pk', Paraguayan: 'py', Peruvian: 'pe', Philippine: 'ph', Polish: 'pl', Portuguese: 'pt',
  Qatari: 'qa',
  Romanian: 'ro', Russian: 'ru',
  Saudi: 'sa', Serbian: 'rs', Singaporean: 'sg', Slovak: 'sk', 'South African': 'za',
  Spanish: 'es', Swedish: 'se', Swiss: 'ch',
  Thai: 'th', Turkish: 'tr',
  Uruguayan: 'uy',
  Venezuelan: 've', Vietnamese: 'vn',
}

export function nationalityCode(nationality: string): string {
  return NATIONALITY_TO_CODE[nationality] ?? ''
}
