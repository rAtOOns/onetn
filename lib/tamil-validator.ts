/**
 * Tamil Text Validator Library - Master Level
 * Rule-based (non-AI) spell checking for Tamil text
 *
 * Features:
 * - 3000+ word dictionary lookup
 * - Consonant confusion detection (ண/ன/ந, ல/ள/ழ, ர/ற)
 * - Vowel length error detection (குறில்/நெடில்)
 * - Grantha letter detection (ஜ, ஷ, ஸ, ஹ)
 * - Spoken vs Written Tamil (வழூஉச்சொல்)
 * - Pulli (்) placement errors
 * - Levenshtein distance for suggestions
 */

import {
  TAMIL_DICTIONARY,
  MISSPELLINGS,
  getSuggestions,
  WORDS_WITH_ZHA,
  WORDS_WITH_RETROFLEX_N,
  WORDS_WITH_RA,
  WORDS_WITH_DENTAL_N,
  hasGranthaLetters,
  DICTIONARY_SIZE,
  MISSPELLING_COUNT,
} from './tamil-dictionary';

export interface SpellError {
  word: string;
  position: number;
  length: number;
  type: 'spelling' | 'consonant' | 'vowel' | 'pulli' | 'grammar' | 'grantha';
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
    vowelErrors: number;
    grammarErrors: number;
    granthaWarnings: number;
  };
}

// Tamil Unicode range
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
 * Check consonant confusion rules (ழ, ண, ற)
 */
function checkConsonantConfusion(word: string): { suggestion: string; rule: string; ruleTamil: string; type: 'consonant' } | null {
  // Check ழ confusion (ல/ள → ழ)
  for (const correctWord of WORDS_WITH_ZHA) {
    const wrongWithLa = correctWord.replace(/ழ/g, 'ல');
    const wrongWithLLa = correctWord.replace(/ழ/g, 'ள');

    if (word === wrongWithLa || word === wrongWithLLa) {
      return {
        suggestion: correctWord,
        rule: `Use ழ instead of ${word.includes('ல') ? 'ல' : 'ள'}`,
        ruleTamil: `${word.includes('ல') ? 'ல' : 'ள'} க்கு பதிலாக ழ பயன்படுத்தவும்`,
        type: 'consonant',
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
        type: 'consonant',
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
        type: 'consonant',
      };
    }
  }

  // Check ந confusion at word start
  for (const correctWord of WORDS_WITH_DENTAL_N) {
    // ந at start replaced with ன or ண
    if (correctWord.startsWith('ந')) {
      const wrongWithNa = correctWord.replace(/^ந/, 'ன');
      const wrongWithNNa = correctWord.replace(/^ந/, 'ண');

      if (word === wrongWithNa || word === wrongWithNNa) {
        return {
          suggestion: correctWord,
          rule: 'Use ந (dental n) at word start',
          ruleTamil: 'சொல்லின் முதலில் ந பயன்படுத்தவும்',
          type: 'consonant',
        };
      }
    }
  }

  return null;
}

/**
 * Check for Grantha letters (ஜ, ஷ, ஸ, ஹ)
 */
function checkGranthaLetters(word: string): { suggestion: string; rule: string; ruleTamil: string } | null {
  if (hasGranthaLetters(word)) {
    // Skip common acceptable Grantha words (months, names)
    const acceptableGrantha = ['ஜனவரி', 'ஜூன்', 'ஜூலை', 'ஜூலை', 'ஸ்ரீ'];
    if (acceptableGrantha.includes(word)) {
      return null;
    }

    return {
      suggestion: word, // Keep original but warn
      rule: 'Contains Grantha letters (ஜ, ஷ, ஸ, ஹ) - consider Tamil alternatives',
      ruleTamil: 'கிரந்த எழுத்துகள் (ஜ, ஷ, ஸ, ஹ) உள்ளன - தூய தமிழ் மாற்றம் பரிசீலிக்கவும்',
    };
  }
  return null;
}

/**
 * Check for common pulli errors
 */
function checkPulliErrors(word: string): { suggestion: string; rule: string; ruleTamil: string } | null {
  // Common patterns where pulli is missing
  const pulliPatterns = [
    { wrong: /செயது/, correct: 'செய்து', rule: 'Add pulli after ய', ruleTamil: 'ய க்குப் பின் புள்ளி தேவை' },
    { wrong: /வநது/, correct: 'வந்து', rule: 'Add pulli after ந', ruleTamil: 'ந க்குப் பின் புள்ளி தேவை' },
    { wrong: /இருகிற/, correct: 'இருக்கிற', rule: 'Add pulli: க்கி', ruleTamil: 'க்கி என்று எழுதவும்' },
    { wrong: /செயகிற/, correct: 'செய்கிற', rule: 'Add pulli after ய', ruleTamil: 'ய்க என்று எழுதவும்' },
  ];

  for (const pattern of pulliPatterns) {
    if (pattern.wrong.test(word)) {
      return {
        suggestion: word.replace(pattern.wrong, pattern.correct),
        rule: pattern.rule,
        ruleTamil: pattern.ruleTamil,
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
  let vowelErrors = 0;
  let grammarErrors = 0;
  let granthaWarnings = 0;

  for (const { word, position } of words) {
    // Skip very short words (single characters)
    if (word.length < 2) continue;

    // 1. Check misspellings dictionary first (known errors)
    const misspelling = MISSPELLINGS[word];
    if (misspelling && misspelling.correct !== word) {
      const errorType = misspelling.type || 'spelling';
      errors.push({
        word,
        position,
        length: word.length,
        type: errorType as SpellError['type'],
        suggestion: misspelling.correct,
        suggestions: [misspelling.correct],
        rule: misspelling.rule,
        ruleTamil: misspelling.ruleTamil,
        severity: errorType === 'grammar' ? 'warning' : 'error',
      });

      if (errorType === 'consonant') consonantErrors++;
      else if (errorType === 'vowel') vowelErrors++;
      else if (errorType === 'grammar') grammarErrors++;
      else spellingErrors++;
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

    // 3. Check pulli errors
    const pulliError = checkPulliErrors(word);
    if (pulliError) {
      errors.push({
        word,
        position,
        length: word.length,
        type: 'pulli',
        suggestion: pulliError.suggestion,
        suggestions: [pulliError.suggestion],
        rule: pulliError.rule,
        ruleTamil: pulliError.ruleTamil,
        severity: 'error',
      });
      spellingErrors++;
      continue;
    }

    // 4. Check for Grantha letters (warning only)
    const granthaWarning = checkGranthaLetters(word);
    if (granthaWarning) {
      errors.push({
        word,
        position,
        length: word.length,
        type: 'grantha',
        suggestion: granthaWarning.suggestion,
        suggestions: [],
        rule: granthaWarning.rule,
        ruleTamil: granthaWarning.ruleTamil,
        severity: 'info',
      });
      granthaWarnings++;
      // Don't continue - still check dictionary
    }

    // 5. Check if word is in dictionary
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
    if (error.suggestion && error.severity !== 'info') {
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
      vowelErrors,
      grammarErrors,
      granthaWarnings,
    },
  };
}

/**
 * Get error type label
 */
export function getErrorTypeLabel(type: SpellError['type']): { english: string; tamil: string; color: string } {
  const labels: Record<SpellError['type'], { english: string; tamil: string; color: string }> = {
    spelling: { english: 'Spelling', tamil: 'எழுத்துப்பிழை', color: 'red' },
    consonant: { english: 'Consonant', tamil: 'மெய்யெழுத்து', color: 'orange' },
    vowel: { english: 'Vowel', tamil: 'உயிரெழுத்து', color: 'yellow' },
    pulli: { english: 'Pulli', tamil: 'புள்ளி', color: 'purple' },
    grammar: { english: 'Grammar', tamil: 'இலக்கணம்', color: 'blue' },
    grantha: { english: 'Grantha', tamil: 'கிரந்தம்', color: 'gray' },
  };
  return labels[type];
}

// Common formal Tamil phrases for reference
export const FORMAL_PHRASES = {
  salutations: [
    { phrase: 'மதிப்புற்குரிய ஐயா', meaning: 'Respected Sir' },
    { phrase: 'மதிப்புற்குரிய அம்மா', meaning: 'Respected Madam' },
    { phrase: 'மாண்புமிகு', meaning: 'Honorable' },
    { phrase: 'அன்புள்ள', meaning: 'Dear' },
  ],
  closings: [
    { phrase: 'இப்படிக்கு', meaning: 'Yours truly' },
    { phrase: 'தங்கள் பணிவுள்ள', meaning: 'Your obedient' },
    { phrase: 'மரியாதையுடன்', meaning: 'With respect' },
    { phrase: 'நன்றியுடன்', meaning: 'With thanks' },
    { phrase: 'அன்புடன்', meaning: 'With love' },
  ],
  requests: [
    { phrase: 'தாழ்மையுடன் கேட்டுக்கொள்கிறேன்', meaning: 'I humbly request' },
    { phrase: 'அனுமதிக்குமாறு கேட்டுக்கொள்கிறேன்', meaning: 'I request permission' },
    { phrase: 'நடவடிக்கை எடுக்குமாறு கேட்டுக்கொள்கிறேன்', meaning: 'I request action' },
    { phrase: 'தேவையான உதவி செய்யுமாறு கோருகிறேன்', meaning: 'I request necessary help' },
  ],
  connectors: [
    { phrase: 'மேலும்', meaning: 'Furthermore' },
    { phrase: 'எனவே', meaning: 'Therefore' },
    { phrase: 'ஆகையால்', meaning: 'Hence' },
    { phrase: 'இருப்பினும்', meaning: 'However' },
    { phrase: 'அதன்படி', meaning: 'Accordingly' },
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
      tip: 'ண comes after ட/ண, ன at word end, ந at word start',
      tipTamil: 'ண - ட/ண க்குப் பின், ன - சொல் இறுதியில், ந - சொல் முதலில்',
    },
    {
      letters: ['ல', 'ள', 'ழ'],
      name: '"L" sounds / ல-வகை',
      description: 'ல (alveolar), ள (retroflex), ழ (approximant)',
      examples: ['வேலை (ல)', 'வாள் (ள)', 'தமிழ் (ழ)'],
      tip: 'ழ is unique to Tamil, appears in words like தமிழ், அழகு, வழி',
      tipTamil: 'ழ தமிழுக்கே உரியது: தமிழ், அழகு, வழி போன்ற சொற்களில்',
    },
    {
      letters: ['ர', 'ற'],
      name: '"R" sounds / ர-வகை',
      description: 'ர (tap), ற (trill)',
      examples: ['மரம் (ர)', 'அறை (ற)'],
      tip: 'ற is stronger, used in words like அறை, முறை, நிறை',
      tipTamil: 'ற வலிமையானது: அறை, முறை, நிறை போன்ற சொற்களில்',
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
    {
      short: 'எ', long: 'ஏ',
      description: 'Short எ vs Long ஏ',
      examples: ['எது (short)', 'ஏன் (long)'],
    },
    {
      short: 'ஒ', long: 'ஓ',
      description: 'Short ஒ vs Long ஓ',
      examples: ['ஒன்று (short)', 'ஓடு (long)'],
    },
  ],
  grantha: {
    letters: ['ஜ', 'ஷ', 'ஸ', 'ஹ'],
    name: 'Grantha Letters / கிரந்த எழுத்துகள்',
    description: 'Sanskrit-origin letters used in Tamil',
    alternatives: [
      { grantha: 'ஜ', tamil: 'ச', example: 'ஜனம் → சனம்' },
      { grantha: 'ஷ', tamil: 'ட', example: 'ஷட் → சட்' },
      { grantha: 'ஸ', tamil: 'ச', example: 'ஸ்ரீ → திரு' },
      { grantha: 'ஹ', tamil: 'க', example: 'ஹரி → அரி' },
    ],
  },
  spokenVsWritten: {
    name: 'Spoken vs Written / பேச்சு vs எழுத்து',
    description: 'Common colloquial forms that should be formal in writing',
    examples: [
      { spoken: 'வேணும்', written: 'வேண்டும்' },
      { spoken: 'இல்ல', written: 'இல்லை' },
      { spoken: 'எதுக்கு', written: 'எதற்கு' },
      { spoken: 'அதுக்கு', written: 'அதற்கு' },
      { spoken: 'போயிட்டேன்', written: 'போய்விட்டேன்' },
      { spoken: 'வந்துட்டேன்', written: 'வந்துவிட்டேன்' },
      { spoken: 'செஞ்சேன்', written: 'செய்தேன்' },
      { spoken: 'குடு', written: 'கொடு' },
    ],
  },
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
      vowelErrors: result.stats.vowelErrors,
      pulliErrors: 0,
      spellingErrors: result.stats.spellingErrors,
      grammarErrors: result.stats.grammarErrors,
    },
  };
}

// Export stats for UI
export const SPELL_CHECKER_STATS = {
  dictionarySize: DICTIONARY_SIZE,
  misspellingPatterns: MISSPELLING_COUNT,
  version: '2.0',
};

export type ValidationResult = ReturnType<typeof validateTamilText>;
export type ValidationError = ValidationResult['errors'][number];
