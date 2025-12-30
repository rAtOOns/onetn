import { THIRUKKURAL_DATA, type Thirukkural } from './thirukkural-data';

/**
 * Get today's Thirukkural based on day of year
 * Cycles through all 1330 kurals (approximately 3.6 years per cycle)
 */
export function getTodaysKural(): Thirukkural {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Cycle through 1330 kurals
  const kuralIndex = dayOfYear % 1330;

  return THIRUKKURAL_DATA[kuralIndex];
}

/**
 * Get a specific Thirukkural by its number (1-1330)
 */
export function getKuralByNumber(number: number): Thirukkural | null {
  if (number < 1 || number > 1330) return null;
  return THIRUKKURAL_DATA[number - 1];
}

/**
 * Get the next Thirukkural after today's
 * Useful for future "next kural" navigation
 */
export function getNextKural(): Thirukkural {
  const today = getTodaysKural();
  const nextNumber = today.number === 1330 ? 1 : today.number + 1;
  return THIRUKKURAL_DATA[nextNumber - 1];
}

/**
 * Get the previous Thirukkural before today's
 * Useful for future "previous kural" navigation
 */
export function getPreviousKural(): Thirukkural {
  const today = getTodaysKural();
  const prevNumber = today.number === 1 ? 1330 : today.number - 1;
  return THIRUKKURAL_DATA[prevNumber - 1];
}

/**
 * Get all kurals in a specific section
 * section: 'அறத்துப்பால்' | 'பொருட்பால்' | 'காமத்துப்பால்'
 */
export function getKuralsBySection(section: string): Thirukkural[] {
  return THIRUKKURAL_DATA.filter((kural) => kural.section === section);
}

/**
 * Get all kurals in a specific chapter
 */
export function getKuralsByChapter(chapterEn: string): Thirukkural[] {
  return THIRUKKURAL_DATA.filter((kural) => kural.chapterEn === chapterEn);
}

/**
 * Search kurals by keyword in translation or chapter name
 */
export function searchKurals(keyword: string): Thirukkural[] {
  const lowerKeyword = keyword.toLowerCase();
  return THIRUKKURAL_DATA.filter(
    (kural) =>
      kural.translation.toLowerCase().includes(lowerKeyword) ||
      kural.chapter.toLowerCase().includes(lowerKeyword) ||
      kural.chapterEn.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * Get a random Thirukkural
 */
export function getRandomKural(): Thirukkural {
  const randomIndex = Math.floor(Math.random() * 1330);
  return THIRUKKURAL_DATA[randomIndex];
}
