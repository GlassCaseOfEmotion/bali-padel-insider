const NATIONALITY_TO_FLAG: Record<string, string> = {
  Afghan: '🇦🇫', Albanian: '🇦🇱', Algerian: '🇩🇿', American: '🇺🇸',
  Argentine: '🇦🇷', Australian: '🇦🇺', Austrian: '🇦🇹',
  Bahraini: '🇧🇭', Belgian: '🇧🇪', Bolivian: '🇧🇴', Brazilian: '🇧🇷',
  British: '🇬🇧', Bulgarian: '🇧🇬',
  Canadian: '🇨🇦', Chilean: '🇨🇱', Chinese: '🇨🇳', Colombian: '🇨🇴',
  Croatian: '🇭🇷', Czech: '🇨🇿',
  Danish: '🇩🇰', Dutch: '🇳🇱',
  Ecuadorian: '🇪🇨', Egyptian: '🇪🇬', Emirati: '🇦🇪',
  Finnish: '🇫🇮', French: '🇫🇷',
  German: '🇩🇪', Greek: '🇬🇷',
  Hungarian: '🇭🇺',
  Indian: '🇮🇳', Indonesian: '🇮🇩', Iranian: '🇮🇷', Irish: '🇮🇪', Israeli: '🇮🇱', Italian: '🇮🇹',
  Japanese: '🇯🇵', Jordanian: '🇯🇴',
  Kenyan: '🇰🇪', Korean: '🇰🇷', Kuwaiti: '🇰🇼',
  Malaysian: '🇲🇾', Mexican: '🇲🇽', Moroccan: '🇲🇦',
  'New Zealander': '🇳🇿', Norwegian: '🇳🇴',
  Pakistani: '🇵🇰', Paraguayan: '🇵🇾', Peruvian: '🇵🇪', Philippine: '🇵🇭', Polish: '🇵🇱', Portuguese: '🇵🇹',
  Qatari: '🇶🇦',
  Romanian: '🇷🇴', Russian: '🇷🇺',
  Saudi: '🇸🇦', Serbian: '🇷🇸', Singaporean: '🇸🇬', Slovak: '🇸🇰', 'South African': '🇿🇦', Spanish: '🇪🇸', Swedish: '🇸🇪', Swiss: '🇨🇭',
  Thai: '🇹🇭', Turkish: '🇹🇷',
  Uruguayan: '🇺🇾',
  Venezuelan: '🇻🇪', Vietnamese: '🇻🇳',
}

export function nationalityFlag(nationality: string): string {
  return NATIONALITY_TO_FLAG[nationality] ?? ''
}
