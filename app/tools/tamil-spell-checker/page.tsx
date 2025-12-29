"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Copy,
  RotateCcw,
  FileText,
  Sparkles,
  BookOpen,
} from "lucide-react";
import {
  validateTamilText,
  ValidationError,
  ValidationResult,
  getErrorTypeLabel,
  FORMAL_PHRASES,
  containsTamil,
} from "@/lib/tamil-validator";

export default function TamilSpellCheckerPage() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [showPhrases, setShowPhrases] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleValidate = useCallback(() => {
    if (!inputText.trim()) {
      setResult(null);
      return;
    }
    const validationResult = validateTamilText(inputText);
    setResult(validationResult);
  }, [inputText]);

  const handleApplyCorrections = () => {
    if (result) {
      setInputText(result.correctedText);
      // Re-validate with corrected text
      const newResult = validateTamilText(result.correctedText);
      setResult(newResult);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInputText("");
    setResult(null);
  };

  const insertPhrase = (phrase: string) => {
    setInputText((prev) => prev + (prev ? " " : "") + phrase);
  };

  const getSeverityIcon = (severity: ValidationError["severity"]) => {
    switch (severity) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityClass = (severity: ValidationError["severity"]) => {
    switch (severity) {
      case "error":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "info":
        return "border-blue-200 bg-blue-50";
    }
  };

  const hasTamilText = containsTamil(inputText);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/tools"
            className="inline-flex items-center text-sm text-gray-600 hover:text-tn-primary mb-3"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Tools
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tamil Spell Checker
              </h1>
              <p className="text-sm text-gray-600">
                தமிழ் எழுத்துப்பிழை சரிபார்ப்பான்
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Input/Output Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Input Section */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText size={18} />
                  Enter Tamil Text / தமிழ் உரை உள்ளிடவும்
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPhrases(!showPhrases)}
                    className="text-sm px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex items-center gap-1"
                  >
                    <BookOpen size={14} />
                    Phrases
                  </button>
                  <button
                    onClick={handleClear}
                    className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1"
                  >
                    <RotateCcw size={14} />
                    Clear
                  </button>
                </div>
              </div>

              {/* Formal Phrases Panel */}
              {showPhrases && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <h3 className="text-sm font-medium text-purple-800 mb-2">
                    Common Formal Phrases / பொதுவான முறையான சொற்றொடர்கள்
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-purple-600 mb-1">
                        Salutations / வணக்கம்
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {FORMAL_PHRASES.salutations.map((item) => (
                          <button
                            key={item.phrase}
                            onClick={() => insertPhrase(item.phrase)}
                            className="text-xs px-2 py-1 bg-white border border-purple-200 rounded hover:bg-purple-100"
                            title={item.meaning}
                          >
                            {item.phrase}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 mb-1">
                        Closings / முடிவுரை
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {FORMAL_PHRASES.closings.map((item) => (
                          <button
                            key={item.phrase}
                            onClick={() => insertPhrase(item.phrase)}
                            className="text-xs px-2 py-1 bg-white border border-purple-200 rounded hover:bg-purple-100"
                            title={item.meaning}
                          >
                            {item.phrase}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 mb-1">
                        Connectors / இணைப்புச் சொற்கள்
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {FORMAL_PHRASES.connectors.map((item) => (
                          <button
                            key={item.phrase}
                            onClick={() => insertPhrase(item.phrase)}
                            className="text-xs px-2 py-1 bg-white border border-purple-200 rounded hover:bg-purple-100"
                            title={item.meaning}
                          >
                            {item.phrase}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 mb-1">
                        Requests / கோரிக்கைகள்
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {FORMAL_PHRASES.requests.map((item) => (
                          <button
                            key={item.phrase}
                            onClick={() => insertPhrase(item.phrase)}
                            className="text-xs px-2 py-1 bg-white border border-purple-200 rounded hover:bg-purple-100"
                            title={item.meaning}
                          >
                            {item.phrase}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="தமிழில் எழுதுங்கள்... (Type in Tamil...)"
                className="w-full h-48 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}
              />

              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-gray-500">
                  {inputText.length} characters
                  {!hasTamilText && inputText.length > 0 && (
                    <span className="ml-2 text-yellow-600">
                      (No Tamil text detected)
                    </span>
                  )}
                </div>
                <button
                  onClick={handleValidate}
                  disabled={!inputText.trim()}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Check Text / சரிபார்
                </button>
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">
                    Validation Results / சரிபார்ப்பு முடிவுகள்
                  </h2>
                  {result.isValid ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                      <CheckCircle size={14} />
                      No errors found
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {result.stats.totalErrors} issue(s) found
                    </span>
                  )}
                </div>

                {/* Stats */}
                {result.stats.totalErrors > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {result.stats.spellingErrors}
                      </div>
                      <div className="text-xs text-gray-600">Spelling</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {result.stats.consonantErrors}
                      </div>
                      <div className="text-xs text-gray-600">Consonant</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {result.stats.vowelErrors}
                      </div>
                      <div className="text-xs text-gray-600">Vowel</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {result.stats.pulliErrors}
                      </div>
                      <div className="text-xs text-gray-600">Pulli</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {result.stats.grammarErrors}
                      </div>
                      <div className="text-xs text-gray-600">Grammar</div>
                    </div>
                  </div>
                )}

                {/* Error List */}
                {result.errors.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Issues Found / கண்டறியப்பட்ட பிழைகள்
                    </h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {result.errors.map((error, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${getSeverityClass(error.severity)}`}
                        >
                          <div className="flex items-start gap-2">
                            {getSeverityIcon(error.severity)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-gray-900">
                                  &quot;{error.original}&quot;
                                </span>
                                <span className="text-gray-400">→</span>
                                <span className="font-medium text-green-700">
                                  &quot;{error.suggestion}&quot;
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-white rounded-full border">
                                  {getErrorTypeLabel(error.type).tamil}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {error.messageTamil}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Corrected Text */}
                {result.correctedText !== inputText && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Corrected Text / திருத்தப்பட்ட உரை
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(result.correctedText)}
                          className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1"
                        >
                          <Copy size={14} />
                          {copied ? "Copied!" : "Copy"}
                        </button>
                        <button
                          onClick={handleApplyCorrections}
                          className="text-sm px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                        >
                          <CheckCircle size={14} />
                          Apply All
                        </button>
                      </div>
                    </div>
                    <div
                      className="p-4 bg-green-50 border border-green-200 rounded-lg text-lg"
                      style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}
                    >
                      {result.correctedText}
                    </div>
                  </div>
                )}

                {result.isValid && (
                  <div className="flex items-center justify-center p-6 text-green-600">
                    <CheckCircle size={24} className="mr-2" />
                    <span className="text-lg">
                      Your text looks good! / உங்கள் உரை சரியாக உள்ளது!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Help & Reference */}
          <div className="space-y-4">
            {/* Quick Reference */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Common Confusions / பொதுவான குழப்பங்கள்
              </h3>

              <div className="space-y-4 text-sm">
                {/* N sounds */}
                <div>
                  <h4 className="font-medium text-purple-700 mb-2">
                    &quot;N&quot; Sounds / ந-வகை ஒலிகள்
                  </h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-tamil text-lg">ண</span>
                      <span>Retroflex (பணம், மணி)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-tamil text-lg">ன</span>
                      <span>Alveolar (மனம், தனம்)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-tamil text-lg">ந</span>
                      <span>Dental (நான், நீ)</span>
                    </div>
                  </div>
                </div>

                {/* L sounds */}
                <div>
                  <h4 className="font-medium text-purple-700 mb-2">
                    &quot;L&quot; Sounds / ல-வகை ஒலிகள்
                  </h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-tamil text-lg">ல</span>
                      <span>Alveolar (வேலை, பால்)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-tamil text-lg">ள</span>
                      <span>Retroflex (வாள், தோள்)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-tamil text-lg">ழ</span>
                      <span>Approximant (தமிழ், பழம்)</span>
                    </div>
                  </div>
                </div>

                {/* R sounds */}
                <div>
                  <h4 className="font-medium text-purple-700 mb-2">
                    &quot;R&quot; Sounds / ர-வகை ஒலிகள்
                  </h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-tamil text-lg">ர</span>
                      <span>Tap (மரம், கரை)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-tamil text-lg">ற</span>
                      <span>Trill (அறை, சிறை)</span>
                    </div>
                  </div>
                </div>

                {/* Vowels */}
                <div>
                  <h4 className="font-medium text-purple-700 mb-2">
                    Vowel Length / உயிர் நீளம்
                  </h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Short / குறில்</span>
                      <span className="font-tamil">அ இ உ எ ஒ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Long / நெடில்</span>
                      <span className="font-tamil">ஆ ஈ ஊ ஏ ஓ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grantha Letters */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Grantha Letters / கிரந்த எழுத்துகள்
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Used for Sanskrit/foreign words. Prefer Tamil alternatives when
                possible.
              </p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {["ஜ", "ஷ", "ஸ", "ஹ"].map((letter) => (
                  <div
                    key={letter}
                    className="p-2 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <span className="text-2xl font-tamil">{letter}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <p>ஜ → ச (சனவரி)</p>
                <p>ஷ → ச/ட (சரத்து)</p>
                <p>ஸ → ச (சிலை)</p>
                <p>ஹ → அ/க (அரி)</p>
              </div>
            </div>

            {/* Pulli Info */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Pulli Mark / புள்ளி
              </h3>
              <div className="text-center mb-3">
                <span className="text-4xl font-tamil">க் vs க</span>
              </div>
              <p className="text-sm text-gray-600">
                The pulli (்) removes the inherent vowel from a consonant.
              </p>
              <div className="mt-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>க = ka</span>
                  <span>க் = k</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ம = ma</span>
                  <span>ம் = m</span>
                </div>
              </div>
            </div>

            {/* Link to Letter Drafts */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white">
              <h3 className="font-semibold mb-2">Write Official Letters</h3>
              <p className="text-sm text-purple-100 mb-3">
                Use our Letter Drafts tool to write professional Tamil letters
                with built-in spell checking.
              </p>
              <Link
                href="/drafts"
                className="inline-block px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50"
              >
                Go to Letter Drafts →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Google Fonts for Tamil */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap");
        .font-tamil {
          font-family: "Noto Sans Tamil", sans-serif;
        }
      `}</style>
    </div>
  );
}
