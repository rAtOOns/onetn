/**
 * Tamil locale-aware formatting utilities
 * Provides formatting for numbers, dates, and currency in Tamil
 */

// Tamil numerals (0-9)
const TAMIL_NUMERALS = ["௦", "௧", "௨", "௩", "௪", "௫", "௬", "௭", "௮", "௯"];

// Tamil month names
export const TAMIL_MONTHS = [
  "ஜனவரி",
  "பிப்ரவரி",
  "மார்ச்",
  "ஏப்ரல்",
  "மே",
  "ஜூன்",
  "ஜூலை",
  "ஆகஸ்ட்",
  "செப்டம்பர்",
  "அக்டோபர்",
  "நவம்பர்",
  "டிசம்பர்",
];

// Tamil day names
export const TAMIL_DAYS = [
  "ஞாயிறு",
  "திங்கள்",
  "செவ்வாய்",
  "புதன்",
  "வியாழன்",
  "வெள்ளி",
  "சனி",
];

// Tamil number words (for number to words conversion)
const TAMIL_ONES = [
  "",
  "ஒன்று",
  "இரண்டு",
  "மூன்று",
  "நான்கு",
  "ஐந்து",
  "ஆறு",
  "ஏழு",
  "எட்டு",
  "ஒன்பது",
];

const TAMIL_TENS = [
  "",
  "பத்து",
  "இருபது",
  "முப்பது",
  "நாற்பது",
  "ஐம்பது",
  "அறுபது",
  "எழுபது",
  "எண்பது",
  "தொண்ணூறு",
];

/**
 * Convert Arabic numerals to Tamil numerals
 */
export function toTamilNumerals(num: number | string): string {
  return String(num)
    .split("")
    .map((char) => {
      const digit = parseInt(char, 10);
      return isNaN(digit) ? char : TAMIL_NUMERALS[digit];
    })
    .join("");
}

/**
 * Format number with Indian numbering system (lakhs, crores)
 * Works for both Tamil and English display
 */
export function formatIndianNumber(
  num: number,
  options?: { locale?: "en" | "ta"; decimals?: number }
): string {
  const { locale = "en", decimals = 0 } = options || {};

  if (isNaN(num)) return locale === "ta" ? "₹௦" : "₹0";

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  // Format with Indian numbering system
  const formatted = absNum.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (locale === "ta") {
    return sign + "₹" + toTamilNumerals(formatted);
  }

  return sign + "₹" + formatted;
}

/**
 * Format currency with word representation (lakhs/crores)
 */
export function formatCurrencyWords(
  num: number,
  options?: { locale?: "en" | "ta" }
): string {
  const { locale = "en" } = options || {};

  if (isNaN(num) || num === 0) {
    return locale === "ta" ? "₹௦" : "₹0";
  }

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum >= 10000000) {
    // Crores
    const crores = absNum / 10000000;
    const formatted = crores.toFixed(2).replace(/\.?0+$/, "");
    if (locale === "ta") {
      return `${sign}₹${toTamilNumerals(formatted)} கோடி`;
    }
    return `${sign}₹${formatted} Cr`;
  } else if (absNum >= 100000) {
    // Lakhs
    const lakhs = absNum / 100000;
    const formatted = lakhs.toFixed(2).replace(/\.?0+$/, "");
    if (locale === "ta") {
      return `${sign}₹${toTamilNumerals(formatted)} லட்சம்`;
    }
    return `${sign}₹${formatted} L`;
  } else if (absNum >= 1000) {
    // Thousands
    const thousands = absNum / 1000;
    const formatted = thousands.toFixed(2).replace(/\.?0+$/, "");
    if (locale === "ta") {
      return `${sign}₹${toTamilNumerals(formatted)} ஆயிரம்`;
    }
    return `${sign}₹${formatted}K`;
  }

  return formatIndianNumber(num, { locale });
}

/**
 * Format date in Tamil
 */
export function formatTamilDate(
  date: Date | string,
  options?: { format?: "short" | "long" | "full" }
): string {
  const { format = "long" } = options || {};
  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "தவறான தேதி";

  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();

  switch (format) {
    case "short":
      return `${toTamilNumerals(day)}/${toTamilNumerals(month + 1)}/${toTamilNumerals(year)}`;
    case "full":
      return `${TAMIL_DAYS[d.getDay()]}, ${toTamilNumerals(day)} ${TAMIL_MONTHS[month]} ${toTamilNumerals(year)}`;
    case "long":
    default:
      return `${toTamilNumerals(day)} ${TAMIL_MONTHS[month]} ${toTamilNumerals(year)}`;
  }
}

/**
 * Format date in both English and Tamil
 */
export function formatBilingualDate(
  date: Date | string,
  options?: { format?: "short" | "long" }
): { en: string; ta: string } {
  const { format = "long" } = options || {};
  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return { en: "Invalid date", ta: "தவறான தேதி" };
  }

  const enOptions: Intl.DateTimeFormatOptions =
    format === "short"
      ? { day: "2-digit", month: "2-digit", year: "numeric" }
      : { day: "numeric", month: "long", year: "numeric" };

  return {
    en: d.toLocaleDateString("en-IN", enOptions),
    ta: formatTamilDate(d, { format }),
  };
}

/**
 * Format percentage in Tamil
 */
export function formatTamilPercentage(value: number): string {
  return `${toTamilNumerals(value)}%`;
}

/**
 * Get Tamil ordinal suffix
 */
export function getTamilOrdinal(num: number): string {
  const ordinals: Record<number, string> = {
    1: "முதல்",
    2: "இரண்டாம்",
    3: "மூன்றாம்",
    4: "நான்காம்",
    5: "ஐந்தாம்",
    6: "ஆறாம்",
    7: "ஏழாம்",
    8: "எட்டாம்",
    9: "ஒன்பதாம்",
    10: "பத்தாம்",
  };

  return ordinals[num] || `${toTamilNumerals(num)}ஆம்`;
}

/**
 * Format duration in Tamil (years, months, days)
 */
export function formatTamilDuration(
  years: number,
  months: number,
  days: number
): string {
  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${toTamilNumerals(years)} வருடம்`);
  }
  if (months > 0) {
    parts.push(`${toTamilNumerals(months)} மாதம்`);
  }
  if (days > 0) {
    parts.push(`${toTamilNumerals(days)} நாள்`);
  }

  return parts.length > 0 ? parts.join(" ") : "௦ நாள்";
}

/**
 * Format bilingual duration
 */
export function formatBilingualDuration(
  years: number,
  months: number,
  days: number
): { en: string; ta: string } {
  const enParts: string[] = [];
  const taParts: string[] = [];

  if (years > 0) {
    enParts.push(`${years} year${years > 1 ? "s" : ""}`);
    taParts.push(`${toTamilNumerals(years)} வருடம்`);
  }
  if (months > 0) {
    enParts.push(`${months} month${months > 1 ? "s" : ""}`);
    taParts.push(`${toTamilNumerals(months)} மாதம்`);
  }
  if (days > 0) {
    enParts.push(`${days} day${days > 1 ? "s" : ""}`);
    taParts.push(`${toTamilNumerals(days)} நாள்`);
  }

  return {
    en: enParts.length > 0 ? enParts.join(", ") : "0 days",
    ta: taParts.length > 0 ? taParts.join(" ") : "௦ நாள்",
  };
}

/**
 * Common Tamil phrases for calculators
 */
export const TAMIL_PHRASES = {
  // Labels
  basicPay: "அடிப்படை சம்பளம்",
  dearnessAllowance: "அகவிலைப்படி",
  houseRentAllowance: "வீட்டு வாடகை படி",
  grossSalary: "மொத்த சம்பளம்",
  netSalary: "கையில் கிடைக்கும் சம்பளம்",
  totalDeductions: "மொத்த பிடித்தம்",
  pension: "ஓய்வூதியம்",
  gratuity: "நன்கொடை",
  service: "பணிக்காலம்",
  age: "வயது",
  years: "வருடங்கள்",
  months: "மாதங்கள்",
  days: "நாட்கள்",

  // Actions
  calculate: "கணக்கிடு",
  reset: "மீட்டமை",
  print: "அச்சிடு",
  copy: "நகலெடு",

  // Results
  result: "முடிவு",
  total: "மொத்தம்",
  summary: "சுருக்கம்",

  // Status
  loading: "ஏற்றுகிறது...",
  error: "பிழை",
  success: "வெற்றி",

  // Common
  yes: "ஆம்",
  no: "இல்லை",
  select: "தேர்வு செய்க",
  enterValue: "மதிப்பை உள்ளிடவும்",
} as const;

/**
 * Get bilingual label
 */
export function getBilingualLabel(
  english: string,
  tamil: string
): { en: string; ta: string } {
  return { en: english, ta: tamil };
}
