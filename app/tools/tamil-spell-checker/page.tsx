"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Copy,
  RotateCcw,
  Sparkles,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import {
  spellCheck,
  SpellError,
  SpellCheckResult,
  getErrorTypeLabel,
  CONFUSION_RULES,
  containsTamil,
} from "@/lib/tamil-validator";

export default function TamilSpellCheckerPage() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<SpellCheckResult | null>(null);
  const [selectedError, setSelectedError] = useState<SpellError | null>(null);
  const [copied, setCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-check when text changes (debounced)
  useEffect(() => {
    if (!inputText.trim()) {
      setResult(null);
      setSelectedError(null);
      return;
    }

    const timer = setTimeout(() => {
      const checkResult = spellCheck(inputText);
      setResult(checkResult);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputText]);

  const handleFix = useCallback((error: SpellError) => {
    const newText =
      inputText.slice(0, error.position) +
      error.suggestion +
      inputText.slice(error.position + error.length);
    setInputText(newText);
    setSelectedError(null);
  }, [inputText]);

  const handleFixAll = useCallback(() => {
    if (result) {
      setInputText(result.correctedText);
      setSelectedError(null);
    }
  }, [result]);

  const handleCopy = async () => {
    const textToCopy = result?.correctedText || inputText;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
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
    setSelectedError(null);
  };

  const handleIgnore = (error: SpellError) => {
    if (result) {
      setResult({
        ...result,
        errors: result.errors.filter(e => e.position !== error.position),
      });
    }
    setSelectedError(null);
  };

  // Render text with error highlights
  const renderHighlightedText = () => {
    if (!result || result.errors.length === 0) {
      return inputText;
    }

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    const sortedErrors = [...result.errors].sort((a, b) => a.position - b.position);

    sortedErrors.forEach((error, index) => {
      // Add text before error
      if (error.position > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {inputText.slice(lastIndex, error.position)}
          </span>
        );
      }

      // Add highlighted error
      const isSelected = selectedError?.position === error.position;
      parts.push(
        <span
          key={`error-${index}`}
          onClick={() => setSelectedError(isSelected ? null : error)}
          className={`
            cursor-pointer border-b-2 transition-all
            ${error.severity === 'error'
              ? 'border-red-500 bg-red-100 hover:bg-red-200'
              : 'border-yellow-500 bg-yellow-100 hover:bg-yellow-200'}
            ${isSelected ? 'ring-2 ring-blue-500 rounded' : ''}
          `}
        >
          {error.word}
        </span>
      );

      lastIndex = error.position + error.length;
    });

    // Add remaining text
    if (lastIndex < inputText.length) {
      parts.push(
        <span key="text-end">{inputText.slice(lastIndex)}</span>
      );
    }

    return parts;
  };

  const hasTamilText = containsTamil(inputText);
  const errorCount = result?.errors.length || 0;
  const hasErrors = errorCount > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/tools"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Tamil Spell Checker
                  </h1>
                  <p className="text-xs text-gray-500">
                    தமிழ் எழுத்துப்பிழை சரிபார்ப்பான்
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {hasErrors && (
                <button
                  onClick={handleFixAll}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1"
                >
                  <Check size={14} />
                  <span className="hidden sm:inline">Fix All</span>
                  <span className="sm:hidden">Fix</span>
                </button>
              )}
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button
                onClick={handleClear}
                className="p-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 max-w-4xl">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {result && (
              <>
                {result.isValid ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                    <CheckCircle size={14} />
                    பிழை இல்லை (No errors)
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errorCount} பிழை{errorCount > 1 ? 'கள்' : ''} ({errorCount} error{errorCount > 1 ? 's' : ''})
                  </span>
                )}
              </>
            )}
          </div>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <Info size={14} />
            {showGuide ? 'Hide' : 'Show'} Guide
            {showGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Quick Guide (Collapsible) */}
        {showGuide && (
          <div className="mb-4 bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h3 className="font-semibold text-purple-800 mb-3">
              Common Tamil Letter Confusions / பொதுவான எழுத்துக் குழப்பங்கள்
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {CONFUSION_RULES.consonants.map((rule, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    {rule.letters.map((letter, i) => (
                      <span key={i} className="text-2xl font-tamil text-purple-700">
                        {letter}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-800">{rule.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {rule.examples.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Input Area */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Input Section with Highlights */}
          <div className="relative">
            {/* Highlighted preview layer */}
            <div
              className="absolute inset-0 p-4 pointer-events-none overflow-auto whitespace-pre-wrap break-words text-lg leading-relaxed"
              style={{
                fontFamily: "'Noto Sans Tamil', sans-serif",
                color: 'transparent',
              }}
              aria-hidden="true"
            >
              {inputText}
            </div>

            {/* Editable textarea */}
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="தமிழில் எழுதுங்கள்... (Type in Tamil...)"
              className="w-full min-h-[200px] p-4 text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
              style={{
                fontFamily: "'Noto Sans Tamil', sans-serif",
                background: 'transparent',
              }}
            />
          </div>

          {/* Highlighted Text Preview (when errors exist) */}
          {hasErrors && (
            <div className="border-t">
              <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  பிழைகளை சரிசெய்ய கிளிக் செய்யவும் (Click errors to fix)
                </span>
              </div>
              <div
                className="p-4 text-lg leading-relaxed whitespace-pre-wrap break-words"
                style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}
              >
                {renderHighlightedText()}
              </div>
            </div>
          )}

          {/* Selected Error Detail */}
          {selectedError && (
            <div className="border-t bg-blue-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-tamil line-through text-red-600">
                      {selectedError.word}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-xl font-tamil text-green-600 font-medium">
                      {selectedError.suggestion}
                    </span>
                    <span className="px-2 py-0.5 bg-white rounded text-xs border">
                      {getErrorTypeLabel(selectedError.type).tamil}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {selectedError.ruleTamil}
                  </p>
                  {selectedError.suggestions.length > 1 && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Other suggestions:</span>
                      {selectedError.suggestions.slice(1, 4).map((s, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            handleFix({ ...selectedError, suggestion: s });
                          }}
                          className="text-sm px-2 py-0.5 bg-white border rounded hover:bg-gray-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFix(selectedError)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1"
                  >
                    <Check size={16} />
                    Fix / சரி
                  </button>
                  <button
                    onClick={() => handleIgnore(selectedError)}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 flex items-center gap-1"
                  >
                    <X size={16} />
                    Ignore
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Stats */}
          <div className="px-4 py-2 bg-gray-50 border-t flex items-center justify-between text-sm text-gray-500">
            <span>
              {inputText.length} எழுத்துகள் (characters)
              {!hasTamilText && inputText.length > 0 && (
                <span className="ml-2 text-yellow-600">
                  • தமிழ் எழுத்துகள் இல்லை
                </span>
              )}
            </span>
            {result && (
              <span>
                {result.stats.totalWords} சொற்கள் checked
              </span>
            )}
          </div>
        </div>

        {/* Error List (Mobile-friendly) */}
        {hasErrors && (
          <div className="mt-4 bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-4 py-3 bg-red-50 border-b">
              <h3 className="font-semibold text-red-800">
                கண்டறியப்பட்ட பிழைகள் (Errors Found)
              </h3>
            </div>
            <div className="divide-y max-h-64 overflow-y-auto">
              {result?.errors.map((error, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedError(error)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between ${
                    selectedError?.position === error.position ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      error.severity === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-tamil line-through text-red-600">
                          {error.word}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="font-tamil text-green-600 font-medium">
                          {error.suggestion}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {error.ruleTamil}
                      </p>
                    </div>
                  </div>
                  <ChevronLeft size={16} className="text-gray-400 rotate-180" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Success Message */}
        {result && result.isValid && inputText.trim() && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-1">
              உங்கள் உரை சரியாக உள்ளது!
            </h3>
            <p className="text-green-600">Your text looks good - no errors found!</p>
          </div>
        )}

        {/* Link to Letter Drafts */}
        <div className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">அரசு கடிதங்கள் எழுத வேண்டுமா?</h3>
              <p className="text-sm text-purple-100">
                Use our Letter Drafts tool to write official Tamil letters
              </p>
            </div>
            <Link
              href="/drafts"
              className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 whitespace-nowrap"
            >
              Letter Drafts →
            </Link>
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
