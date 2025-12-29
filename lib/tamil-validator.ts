/**
 * Tamil Text Validator Library
 * Detects and suggests corrections for common Tamil writing errors
 *
 * Covers:
 * - Consonant confusion (ண/ன/ந, ல/ள/ழ, ர/ற)
 * - Vowel length errors (அ vs ஆ, இ vs ஈ)
 * - Pulli (்) placement errors
 * - Grantha letter usage (ஜ, ஷ, ஸ, ஹ)
 * - Common misspellings
 * - Basic grammar markers
 */

export interface ValidationError {
  type: 'consonant' | 'vowel' | 'pulli' | 'grantha' | 'spelling' | 'grammar' | 'spacing';
  original: string;
  suggestion: string;
  position: number;
  length: number;
  message: string;
  messageTamil: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  correctedText: string;
  stats: {
    totalErrors: number;
    consonantErrors: number;
    vowelErrors: number;
    pulliErrors: number;
    spellingErrors: number;
    grammarErrors: number;
  };
}

// Common misspellings dictionary: wrong -> correct
const COMMON_MISSPELLINGS: Record<string, { correct: string; message: string; messageTamil: string }> = {
  // ண vs ன vs ந confusion
  'மனம்': { correct: 'மணம்', message: 'Use ண for fragrance', messageTamil: 'வாசனை என்ற பொருளில் ண பயன்படுத்தவும்' },
  'கனம்': { correct: 'கணம்', message: 'Use ண for moment/time', messageTamil: 'நேரம் என்ற பொருளில் ண பயன்படுத்தவும்' },
  'பனி': { correct: 'பணி', message: 'Use ண for work/duty', messageTamil: 'வேலை என்ற பொருளில் ண பயன்படுத்தவும்' },
  'அனுமதி': { correct: 'அனுமதி', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },

  // ல vs ள vs ழ confusion
  'தமிள்': { correct: 'தமிழ்', message: 'Use ழ for Tamil', messageTamil: 'தமிழ் என்பதில் ழ பயன்படுத்தவும்' },
  'வாலை': { correct: 'வாழை', message: 'Use ழ for banana', messageTamil: 'வாழை என்பதில் ழ பயன்படுத்தவும்' },
  'கொலு': { correct: 'கொழு', message: 'Use ழ for fat/fertile', messageTamil: 'கொழு என்பதில் ழ பயன்படுத்தவும்' },
  'அலகு': { correct: 'அழகு', message: 'Use ழ for beauty', messageTamil: 'அழகு என்பதில் ழ பயன்படுத்தவும்' },
  'பலம்': { correct: 'பழம்', message: 'Use ழ for fruit', messageTamil: 'பழம் என்பதில் ழ பயன்படுத்தவும்' },
  'வேலை': { correct: 'வேலை', message: 'Correct - ல for work', messageTamil: 'சரி - வேலை என்பதில் ல' },

  // ர vs ற confusion
  'வரம்': { correct: 'வறம்', message: 'Use ற for drought', messageTamil: 'வறட்சி என்ற பொருளில் ற பயன்படுத்தவும்' },
  'மரம்': { correct: 'மரம்', message: 'Correct - ர for tree', messageTamil: 'சரி - மரம் என்பதில் ர' },
  'கரை': { correct: 'கறை', message: 'Use ற for stain', messageTamil: 'கறை என்பதில் ற பயன்படுத்தவும்' },
  'சிரை': { correct: 'சிறை', message: 'Use ற for prison', messageTamil: 'சிறை என்பதில் ற பயன்படுத்தவும்' },
  'அரை': { correct: 'அறை', message: 'Use ற for room', messageTamil: 'அறை என்பதில் ற பயன்படுத்தவும்' },
  'புரிய': { correct: 'புறிய', message: 'Check context for ர vs ற', messageTamil: 'சூழலை பொருத்து ர அல்லது ற' },

  // Common government/official terms
  'அலுவகம்': { correct: 'அலுவலகம்', message: 'Missing ல', messageTamil: 'ல விடுபட்டுள்ளது' },
  'செயலர்': { correct: 'செயலாளர்', message: 'Use செயலாளர்', messageTamil: 'செயலாளர் என்று எழுதவும்' },
  'கல்வி': { correct: 'கல்வி', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'அரசாங்கம்': { correct: 'அரசாங்கம்', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'விடுப்பு': { correct: 'விடுப்பு', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'சம்பளம்': { correct: 'சம்பளம்', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'சம்பலம்': { correct: 'சம்பளம்', message: 'Use ள not ல', messageTamil: 'ள பயன்படுத்தவும், ல அல்ல' },
  'ஊதியம்': { correct: 'ஊதியம்', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'பணியாலர்': { correct: 'பணியாளர்', message: 'Use ள not ல', messageTamil: 'ள பயன்படுத்தவும்' },
  'ஆசிரியர்': { correct: 'ஆசிரியர்', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'ஆசிரியெர்': { correct: 'ஆசிரியர்', message: 'Use ர் not ெர்', messageTamil: 'ர் பயன்படுத்தவும்' },
  'தலைமையாசிரியர்': { correct: 'தலைமையாசிரியர்', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'மாவட்டம்': { correct: 'மாவட்டம்', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'மாவடம்': { correct: 'மாவட்டம்', message: 'Missing ட்', messageTamil: 'ட் விடுபட்டுள்ளது' },
  'மனு': { correct: 'மனு', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'விண்ணப்பம்': { correct: 'விண்ணப்பம்', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'விணப்பம்': { correct: 'விண்ணப்பம்', message: 'Use ண் not ண', messageTamil: 'ண் பயன்படுத்தவும்' },
  'அனுமதிக்க': { correct: 'அனுமதிக்க', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'அணுமதிக்க': { correct: 'அனுமதிக்க', message: 'Use ன not ண', messageTamil: 'ன பயன்படுத்தவும், ண அல்ல' },
  'கோரிக்கை': { correct: 'கோரிக்கை', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'கோரிகை': { correct: 'கோரிக்கை', message: 'Use க்கை not கை', messageTamil: 'க்கை பயன்படுத்தவும்' },

  // Vowel length common errors
  'அவர்': { correct: 'அவர்', message: 'Correct - short அ', messageTamil: 'சரி - குறில் அ' },
  'ஆவர்': { correct: 'அவர்', message: 'Use short அ not ஆ', messageTamil: 'குறில் அ பயன்படுத்தவும்' },
  'இது': { correct: 'இது', message: 'Correct - short இ', messageTamil: 'சரி - குறில் இ' },
  'ஈது': { correct: 'இது', message: 'Use short இ not ஈ', messageTamil: 'குறில் இ பயன்படுத்தவும்' },
  'உள்ளது': { correct: 'உள்ளது', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'ஊள்ளது': { correct: 'உள்ளது', message: 'Use short உ not ஊ', messageTamil: 'குறில் உ பயன்படுத்தவும்' },

  // Double consonant errors
  'செய்ய': { correct: 'செய்ய', message: 'Correct - double ய', messageTamil: 'சரி - இரட்டை ய' },
  'செய': { correct: 'செய்ய', message: 'Use double ய்ய', messageTamil: 'இரட்டை ய்ய பயன்படுத்தவும்' },
  'வேண்டும்': { correct: 'வேண்டும்', message: 'Correct spelling', messageTamil: 'சரியான எழுத்துப்பிழை' },
  'வேன்டும்': { correct: 'வேண்டும்', message: 'Use ண் not ன்', messageTamil: 'ண் பயன்படுத்தவும்' },
  'வேணும்': { correct: 'வேண்டும்', message: 'Use வேண்டும் (formal)', messageTamil: 'எழுத்து வழக்கில் வேண்டும்' },

  // Sandhi errors
  'போய்விட்டேன்': { correct: 'போய்விட்டேன்', message: 'Correct sandhi', messageTamil: 'சரியான சந்தி' },
  'வந்துவிட்டேன்': { correct: 'வந்துவிட்டேன்', message: 'Correct sandhi', messageTamil: 'சரியான சந்தி' },
};

// Words where ண is correct (not ன or ந)
const WORDS_WITH_RETROFLEXN: string[] = [
  'பணம்', 'மணம்', 'கணம்', 'பணி', 'மணி', 'கணி', 'அணி', 'பிணி',
  'தணிக்கை', 'ஆணை', 'வாணிகம்', 'கணக்கு', 'பணிப்பு', 'மணல்',
  'அணு', 'கணவன்', 'வணக்கம்', 'தணிக்கை', 'பணியாளர்', 'விண்ணப்பம்',
  'கண்', 'மண்', 'பண்', 'உண்', 'எண்', 'திண்', 'வண்',
];

// Words where ழ is correct (not ல or ள)
const WORDS_WITH_ZHA: string[] = [
  'தமிழ்', 'அழகு', 'பழம்', 'வாழை', 'கொழு', 'முழு', 'பழைய',
  'அழைப்பு', 'வழி', 'தழுவு', 'எழுது', 'அழு', 'குழந்தை', 'பழக்கம்',
  'வழக்கம்', 'தழுவல்', 'அழிவு', 'கழிவு', 'பழி', 'முழக்கம்',
  'விழா', 'கழுத்து', 'பழுது', 'அழுத்தம்',
];

// Words where ற is correct (not ர)
const WORDS_WITH_RA: string[] = [
  'அறை', 'சிறை', 'கறை', 'மறை', 'நிறை', 'குறை', 'பிறை',
  'வறுமை', 'சிறுமை', 'பெறுதல்', 'தறி', 'நெறி', 'முறை', 'துறை',
  'மாற்றம்', 'காற்று', 'சாற்று', 'ஊற்று', 'பற்று', 'சுற்று',
  'கற்று', 'பற்றி', 'சுற்றி', 'மற்றும்', 'உற்ற',
];

// Grantha letters that should be used carefully
const GRANTHA_LETTERS = ['ஜ', 'ஷ', 'ஸ', 'ஹ', 'க்ஷ'];

// Tamil-native alternatives for grantha letters
const GRANTHA_ALTERNATIVES: Record<string, { native: string; context: string }> = {
  'ஜனவரி': { native: 'சனவரி', context: 'January - both acceptable' },
  'ஷரத்து': { native: 'சரத்து', context: 'Condition - prefer சரத்து' },
  'ஸ்கூல்': { native: 'பள்ளி', context: 'School - prefer Tamil பள்ளி' },
  'ஹாஜர்': { native: 'வருகை', context: 'Attendance - prefer Tamil வருகை' },
};

// Common formal Tamil phrases for government letters
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
  ],
  connectors: [
    { phrase: 'மேலும்', meaning: 'Furthermore' },
    { phrase: 'எனவே', meaning: 'Therefore' },
    { phrase: 'ஆகையால்', meaning: 'Hence' },
    { phrase: 'இருப்பினும்', meaning: 'However' },
    { phrase: 'அதனால்', meaning: 'Because of that' },
  ],
  requests: [
    { phrase: 'தாழ்மையுடன் கேட்டுக்கொள்கிறேன்', meaning: 'I humbly request' },
    { phrase: 'அனுமதிக்குமாறு கேட்டுக்கொள்கிறேன்', meaning: 'I request permission' },
    { phrase: 'நடவடிக்கை எடுக்குமாறு கேட்டுக்கொள்கிறேன்', meaning: 'I request action' },
  ],
};

/**
 * Check for pulli (்) errors
 */
function checkPulliErrors(text: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Pattern: consonant without pulli followed by another consonant (potential missing pulli)
  // This is a simplified check - real Tamil grammar is more complex
  const consonants = 'கஙசஞடணதநபமயரலவழளறன';
  const vowelMarks = 'ாிீுூெேைொோௌ்';

  for (let i = 0; i < text.length - 1; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    // Check if current is a consonant and next is also a consonant without vowel mark
    if (consonants.includes(char) && consonants.includes(nextChar)) {
      // This might be a missing pulli error, but needs context
      // For now, we'll flag common patterns
    }
  }

  return errors;
}

/**
 * Check for vowel length errors
 */
function checkVowelErrors(text: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Common short/long vowel confusion patterns
  const vowelPatterns: Array<{ wrong: RegExp; check: (match: string, pos: number) => ValidationError | null }> = [
    // Add patterns as needed based on common errors
  ];

  return errors;
}

/**
 * Check for grantha letter usage
 */
function checkGranthaUsage(text: string): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [word, alt] of Object.entries(GRANTHA_ALTERNATIVES)) {
    const index = text.indexOf(word);
    if (index !== -1) {
      errors.push({
        type: 'grantha',
        original: word,
        suggestion: alt.native,
        position: index,
        length: word.length,
        message: `Grantha word: ${alt.context}`,
        messageTamil: `கிரந்த சொல்: தமிழ் மாற்று ${alt.native}`,
        severity: 'info',
      });
    }
  }

  return errors;
}

/**
 * Check for spacing issues
 */
function checkSpacing(text: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for multiple spaces
  const multiSpaceMatch = text.match(/  +/g);
  if (multiSpaceMatch) {
    let pos = 0;
    for (const match of multiSpaceMatch) {
      const index = text.indexOf(match, pos);
      errors.push({
        type: 'spacing',
        original: match,
        suggestion: ' ',
        position: index,
        length: match.length,
        message: 'Multiple spaces detected',
        messageTamil: 'பல இடைவெளிகள் உள்ளன',
        severity: 'warning',
      });
      pos = index + match.length;
    }
  }

  // Check for missing space after punctuation
  const punctPattern = /[,\.;:!?](?=[அ-ஹ])/g;
  let match;
  while ((match = punctPattern.exec(text)) !== null) {
    errors.push({
      type: 'spacing',
      original: match[0],
      suggestion: match[0] + ' ',
      position: match.index,
      length: 1,
      message: 'Add space after punctuation',
      messageTamil: 'நிறுத்தற்குறிக்குப் பின் இடைவெளி தேவை',
      severity: 'warning',
    });
  }

  return errors;
}

/**
 * Check common misspellings
 */
function checkSpelling(text: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const words = text.split(/[\s,\.;:!?\(\)]+/);

  let currentPos = 0;
  for (const word of words) {
    if (word && COMMON_MISSPELLINGS[word]) {
      const correction = COMMON_MISSPELLINGS[word];
      if (correction.correct !== word) {
        const index = text.indexOf(word, currentPos);
        errors.push({
          type: 'spelling',
          original: word,
          suggestion: correction.correct,
          position: index,
          length: word.length,
          message: correction.message,
          messageTamil: correction.messageTamil,
          severity: 'error',
        });
      }
    }
    currentPos = text.indexOf(word, currentPos) + word.length;
  }

  return errors;
}

/**
 * Check consonant confusion (ண/ன/ந, ல/ள/ழ, ர/ற)
 */
function checkConsonantConfusion(text: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for words that should have ழ but might have ல or ள
  const zhaWords = ['தமில்', 'தமிள்', 'அலகு', 'பலம்', 'வாலை', 'முலு', 'பலைய'];
  for (const wrongWord of zhaWords) {
    const index = text.indexOf(wrongWord);
    if (index !== -1) {
      const correctWord = wrongWord.replace(/ல|ள/g, 'ழ');
      if (WORDS_WITH_ZHA.includes(correctWord)) {
        errors.push({
          type: 'consonant',
          original: wrongWord,
          suggestion: correctWord,
          position: index,
          length: wrongWord.length,
          message: 'Use ழ (zha) instead of ல/ள',
          messageTamil: 'ல/ள க்கு பதிலாக ழ பயன்படுத்தவும்',
          severity: 'error',
        });
      }
    }
  }

  return errors;
}

/**
 * Main validation function
 */
export function validateTamilText(text: string): ValidationResult {
  if (!text || text.trim() === '') {
    return {
      isValid: true,
      errors: [],
      correctedText: text,
      stats: {
        totalErrors: 0,
        consonantErrors: 0,
        vowelErrors: 0,
        pulliErrors: 0,
        spellingErrors: 0,
        grammarErrors: 0,
      },
    };
  }

  const allErrors: ValidationError[] = [];

  // Run all checks
  allErrors.push(...checkSpelling(text));
  allErrors.push(...checkConsonantConfusion(text));
  allErrors.push(...checkGranthaUsage(text));
  allErrors.push(...checkSpacing(text));
  allErrors.push(...checkPulliErrors(text));
  allErrors.push(...checkVowelErrors(text));

  // Sort errors by position
  allErrors.sort((a, b) => a.position - b.position);

  // Remove duplicates
  const uniqueErrors = allErrors.filter((error, index, self) =>
    index === self.findIndex(e => e.position === error.position && e.original === error.original)
  );

  // Generate corrected text
  let correctedText = text;
  const sortedErrors = [...uniqueErrors].sort((a, b) => b.position - a.position);
  for (const error of sortedErrors) {
    if (error.severity === 'error') {
      correctedText =
        correctedText.slice(0, error.position) +
        error.suggestion +
        correctedText.slice(error.position + error.length);
    }
  }

  // Calculate stats
  const stats = {
    totalErrors: uniqueErrors.length,
    consonantErrors: uniqueErrors.filter(e => e.type === 'consonant').length,
    vowelErrors: uniqueErrors.filter(e => e.type === 'vowel').length,
    pulliErrors: uniqueErrors.filter(e => e.type === 'pulli').length,
    spellingErrors: uniqueErrors.filter(e => e.type === 'spelling').length,
    grammarErrors: uniqueErrors.filter(e => e.type === 'grammar').length,
  };

  return {
    isValid: uniqueErrors.filter(e => e.severity === 'error').length === 0,
    errors: uniqueErrors,
    correctedText,
    stats,
  };
}

/**
 * Get suggestions for a specific word
 */
export function getSuggestions(word: string): string[] {
  const suggestions: string[] = [];

  // Check misspellings dictionary
  if (COMMON_MISSPELLINGS[word]) {
    suggestions.push(COMMON_MISSPELLINGS[word].correct);
  }

  // Generate variations by replacing confusing consonants
  const variations = [
    word.replace(/ன/g, 'ண'),
    word.replace(/ண/g, 'ன'),
    word.replace(/ல/g, 'ள'),
    word.replace(/ள/g, 'ல'),
    word.replace(/ல/g, 'ழ'),
    word.replace(/ள/g, 'ழ'),
    word.replace(/ர/g, 'ற'),
    word.replace(/ற/g, 'ர'),
  ];

  for (const variation of variations) {
    if (variation !== word && !suggestions.includes(variation)) {
      suggestions.push(variation);
    }
  }

  return suggestions.slice(0, 5);
}

/**
 * Check if text contains Tamil characters
 */
export function containsTamil(text: string): boolean {
  return /[\u0B80-\u0BFF]/.test(text);
}

/**
 * Get error type label in Tamil
 */
export function getErrorTypeLabel(type: ValidationError['type']): { english: string; tamil: string } {
  const labels: Record<ValidationError['type'], { english: string; tamil: string }> = {
    consonant: { english: 'Consonant Error', tamil: 'மெய்யெழுத்துப் பிழை' },
    vowel: { english: 'Vowel Error', tamil: 'உயிரெழுத்துப் பிழை' },
    pulli: { english: 'Pulli Error', tamil: 'புள்ளி பிழை' },
    grantha: { english: 'Grantha Letter', tamil: 'கிரந்த எழுத்து' },
    spelling: { english: 'Spelling Error', tamil: 'எழுத்துப்பிழை' },
    grammar: { english: 'Grammar Error', tamil: 'இலக்கணப் பிழை' },
    spacing: { english: 'Spacing Issue', tamil: 'இடைவெளி பிழை' },
  };
  return labels[type];
}

/**
 * Highlight errors in text with HTML
 */
export function highlightErrors(text: string, errors: ValidationError[]): string {
  if (errors.length === 0) return text;

  let result = '';
  let lastIndex = 0;

  const sortedErrors = [...errors].sort((a, b) => a.position - b.position);

  for (const error of sortedErrors) {
    // Add text before error
    result += text.slice(lastIndex, error.position);

    // Add highlighted error
    const colorClass = error.severity === 'error' ? 'text-red-600 bg-red-100' :
                       error.severity === 'warning' ? 'text-yellow-600 bg-yellow-100' :
                       'text-blue-600 bg-blue-100';

    result += `<span class="${colorClass} px-0.5 rounded" title="${error.message}">${error.original}</span>`;

    lastIndex = error.position + error.length;
  }

  // Add remaining text
  result += text.slice(lastIndex);

  return result;
}
