/**
 * Tamil Text Validator Library
 * Rule-based (non-AI) spell checking for Tamil text
 *
 * Uses:
 * - Dictionary lookup for valid words
 * - Confusion rules for similar-sounding letters (ண/ன/ந, ல/ள/ழ, ர/ற)
 * - Common misspelling patterns
 * - Levenshtein distance for suggestions
 */

import {
  TAMIL_DICTIONARY,
  MISSPELLINGS,
  getSuggestions,
  WORDS_WITH_ZHA,
  WORDS_WITH_RETROFLEX_N,
  WORDS_WITH_RA,
} from './tamil-dictionary';

export interface SpellError {
  word: string;
  position: number;
  length: number;
  type: 'spelling' | 'consonant' | 'vowel' | 'pulli' | 'grammar';
  suggestion: string;
  suggestions: string[];
  rule: string;
  ruleTamil: string;
  severity: 'error' | 'warning' | 'info';
}

export interface SpellCheckResult {
  text: string;
  errors: SpellError[];
  correctedText: string;
  isValid: boolean;
  stats: {
    totalWords: number;
    errorCount: number;
    spellingErrors: number;
    consonantErrors: number;
  };
}

// Tamil Unicode range
const TAMIL_REGEX = /[\u0B80-\u0BFF]+/g;
const TAMIL_WORD_REGEX = /[\u0B80-\u0BFF]+/g;

/**
 * Check if text contains Tamil characters
 */
export function containsTamil(text: string): boolean {
  return /[\u0B80-\u0BFF]/.test(text);
}

/**
 * Extract Tamil words from text
 */
function extractTamilWords(text: string): Array<{ word: string; position: number }> {
  const words: Array<{ word: string; position: number }> = [];
  let match;

  const regex = new RegExp(TAMIL_WORD_REGEX.source, 'g');
  while ((match = regex.exec(text)) !== null) {
    words.push({
      word: match[0],
      position: match.index,
    });
  }

  return words;
}

/**
 * Check consonant confusion rules
 */
function checkConsonantConfusion(word: string): { suggestion: string; rule: string; ruleTamil: string } | null {
  // Check ழ confusion (ல/ள → ழ)
  for (const correctWord of WORDS_WITH_ZHA) {
    // Generate wrong versions by replacing ழ with ல or ள
    const wrongWithLa = correctWord.replace(/ழ/g, 'ல');
    const wrongWithLLa = correctWord.replace(/ழ/g, 'ள');

    if (word === wrongWithLa || word === wrongWithLLa) {
      return {
        suggestion: correctWord,
        rule: `Use ழ instead of ${word.includes('ல') ? 'ல' : 'ள'}`,
        ruleTamil: `${word.includes('ல') ? 'ல' : 'ள'} க்கு பதிலாக ழ பயன்படுத்தவும்`,
      };
    }
  }

  // Check ண confusion (ன → ண)
  for (const correctWord of WORDS_WITH_RETROFLEX_N) {
    const wrongWithNa = correctWord.replace(/ண/g, 'ன');

    if (word === wrongWithNa) {
      return {
        suggestion: correctWord,
        rule: 'Use ண (retroflex n) instead of ன',
        ruleTamil: 'ன க்கு பதிலாக ண பயன்படுத்தவும்',
      };
    }
  }

  // Check ற confusion (ர → ற)
  for (const correctWord of WORDS_WITH_RA) {
    const wrongWithRa = correctWord.replace(/ற/g, 'ர');

    if (word === wrongWithRa) {
      return {
        suggestion: correctWord,
        rule: 'Use ற (alveolar r) instead of ர',
        ruleTamil: 'ர க்கு பதிலாக ற பயன்படுத்தவும்',
      };
    }
  }

  return null;
}

/**
 * Main spell check function
 */
export function spellCheck(text: string): SpellCheckResult {
  const errors: SpellError[] = [];
  const words = extractTamilWords(text);
  let correctedText = text;

  let spellingErrors = 0;
  let consonantErrors = 0;

  for (const { word, position } of words) {
    // Skip very short words (single characters)
    if (word.length < 2) continue;

    // 1. Check misspellings dictionary first (known errors)
    const misspelling = MISSPELLINGS[word];
    if (misspelling) {
      errors.push({
        word,
        position,
        length: word.length,
        type: 'spelling',
        suggestion: misspelling.correct,
        suggestions: [misspelling.correct],
        rule: misspelling.rule,
        ruleTamil: misspelling.ruleTamil,
        severity: 'error',
      });
      spellingErrors++;
      continue;
    }

    // 2. Check consonant confusion rules
    const consonantError = checkConsonantConfusion(word);
    if (consonantError) {
      errors.push({
        word,
        position,
        length: word.length,
        type: 'consonant',
        suggestion: consonantError.suggestion,
        suggestions: [consonantError.suggestion],
        rule: consonantError.rule,
        ruleTamil: consonantError.ruleTamil,
        severity: 'error',
      });
      consonantErrors++;
      continue;
    }

    // 3. Check if word is in dictionary
    if (!TAMIL_DICTIONARY.has(word)) {
      // Get suggestions using Levenshtein distance
      const suggestions = getSuggestions(word);

      if (suggestions.length > 0) {
        errors.push({
          word,
          position,
          length: word.length,
          type: 'spelling',
          suggestion: suggestions[0],
          suggestions,
          rule: 'Word not found in dictionary',
          ruleTamil: 'சொல் அகராதியில் இல்லை',
          severity: 'warning',
        });
        spellingErrors++;
      }
    }
  }

  // Generate corrected text
  const sortedErrors = [...errors].sort((a, b) => b.position - a.position);
  for (const error of sortedErrors) {
    if (error.suggestion) {
      correctedText =
        correctedText.slice(0, error.position) +
        error.suggestion +
        correctedText.slice(error.position + error.length);
    }
  }

  return {
    text,
    errors,
    correctedText,
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    stats: {
      totalWords: words.length,
      errorCount: errors.length,
      spellingErrors,
      consonantErrors,
    },
  };
}

/**
 * Get error type label
 */
export function getErrorTypeLabel(type: SpellError['type']): { english: string; tamil: string } {
  const labels: Record<SpellError['type'], { english: string; tamil: string }> = {
    spelling: { english: 'Spelling', tamil: 'எழுத்துப்பிழை' },
    consonant: { english: 'Consonant', tamil: 'மெய்யெழுத்து' },
    vowel: { english: 'Vowel', tamil: 'உயிரெழுத்து' },
    pulli: { english: 'Pulli', tamil: 'புள்ளி' },
    grammar: { english: 'Grammar', tamil: 'இலக்கணம்' },
  };
  return labels[type];
}

// Common formal Tamil phrases for reference
export const FORMAL_PHRASES = {
  salutations: [
    { phrase: 'மதிப்புற்குரிய ஐயா', meaning: 'Respected Sir' },
    { phrase: 'மதிப்புற்குரிய அம்மா', meaning: 'Respected Madam' },
    { phrase: 'மாண்புமிகு', meaning: 'Honorable' },
  ],
  closings: [
    { phrase: 'இப்படிக்கு', meaning: 'Yours truly' },
    { phrase: 'தங்கள் பணிவுள்ள', meaning: 'Your obedient' },
    { phrase: 'மரியாதையுடன்', meaning: 'With respect' },
    { phrase: 'நன்றியுடன்', meaning: 'With thanks' },
  ],
  requests: [
    { phrase: 'தாழ்மையுடன் கேட்டுக்கொள்கிறேன்', meaning: 'I humbly request' },
    { phrase: 'அனுமதிக்குமாறு கேட்டுக்கொள்கிறேன்', meaning: 'I request permission' },
    { phrase: 'நடவடிக்கை எடுக்குமாறு கேட்டுக்கொள்கிறேன்', meaning: 'I request action' },
  ],
  connectors: [
    { phrase: 'மேலும்', meaning: 'Furthermore' },
    { phrase: 'எனவே', meaning: 'Therefore' },
    { phrase: 'ஆகையால்', meaning: 'Hence' },
    { phrase: 'இருப்பினும்', meaning: 'However' },
  ],
};

// Confusion rules reference for UI display
export const CONFUSION_RULES = {
  consonants: [
    {
      letters: ['ண', 'ன', 'ந'],
      name: '"N" sounds / ந-வகை',
      description: 'ண (retroflex), ன (alveolar), ந (dental)',
      examples: ['பணம் (ண)', 'மனம் (ன)', 'நான் (ந)'],
    },
    {
      letters: ['ல', 'ள', 'ழ'],
      name: '"L" sounds / ல-வகை',
      description: 'ல (alveolar), ள (retroflex), ழ (approximant)',
      examples: ['வேலை (ல)', 'வாள் (ள)', 'தமிழ் (ழ)'],
    },
    {
      letters: ['ர', 'ற'],
      name: '"R" sounds / ர-வகை',
      description: 'ர (tap), ற (trill)',
      examples: ['மரம் (ர)', 'அறை (ற)'],
    },
  ],
  vowels: [
    {
      short: 'அ', long: 'ஆ',
      description: 'Short அ vs Long ஆ',
      examples: ['அவர் (short)', 'ஆசிரியர் (long)'],
    },
    {
      short: 'இ', long: 'ஈ',
      description: 'Short இ vs Long ஈ',
      examples: ['இது (short)', 'ஈடு (long)'],
    },
    {
      short: 'உ', long: 'ஊ',
      description: 'Short உ vs Long ஊ',
      examples: ['உள்ளது (short)', 'ஊர் (long)'],
    },
  ],
};

// Export for backwards compatibility
export function validateTamilText(text: string) {
  const result = spellCheck(text);
  return {
    isValid: result.isValid,
    errors: result.errors.map(e => ({
      type: e.type,
      original: e.word,
      suggestion: e.suggestion,
      position: e.position,
      length: e.length,
      message: e.rule,
      messageTamil: e.ruleTamil,
      severity: e.severity,
    })),
    correctedText: result.correctedText,
    stats: {
      totalErrors: result.stats.errorCount,
      consonantErrors: result.stats.consonantErrors,
      vowelErrors: 0,
      pulliErrors: 0,
      spellingErrors: result.stats.spellingErrors,
      grammarErrors: 0,
    },
  };
}

export type ValidationResult = ReturnType<typeof validateTamilText>;
export type ValidationError = ValidationResult['errors'][number];
