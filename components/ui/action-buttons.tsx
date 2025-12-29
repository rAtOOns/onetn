"use client";

import { Copy, Printer, Download, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { useToast } from "./toast";

interface ActionButtonsProps {
  onCopy?: () => string; // Returns text to copy
  onPrint?: () => void;
  onExport?: () => void;
  copyLabel?: string;
  printLabel?: string;
  exportLabel?: string;
  className?: string;
  resultRef?: React.RefObject<HTMLElement>; // For copying formatted results
}

export function ActionButtons({
  onCopy,
  onPrint,
  onExport,
  copyLabel = "Copy",
  printLabel = "Print",
  exportLabel = "Export PDF",
  className = "",
  resultRef,
}: ActionButtonsProps) {
  const [copied, setCopied] = useState(false);
  const { success, error } = useToast();

  const handleCopy = useCallback(async () => {
    try {
      let textToCopy = "";

      if (onCopy) {
        textToCopy = onCopy();
      } else if (resultRef?.current) {
        textToCopy = resultRef.current.innerText;
      }

      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      error("Failed to copy");
    }
  }, [onCopy, resultRef, success, error]);

  const handlePrint = useCallback(() => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  }, [onPrint]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {(onCopy || resultRef) && (
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-tn-primary hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={copyLabel}
        >
          {copied ? (
            <Check size={16} className="text-emerald-600" />
          ) : (
            <Copy size={16} />
          )}
          <span className="hidden sm:inline">{copied ? "Copied" : copyLabel}</span>
        </button>
      )}

      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-tn-primary hover:bg-gray-100 rounded-lg transition-colors print:hidden"
        aria-label={printLabel}
      >
        <Printer size={16} />
        <span className="hidden sm:inline">{printLabel}</span>
      </button>

      {onExport && (
        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-tn-primary hover:bg-gray-100 rounded-lg transition-colors print:hidden"
          aria-label={exportLabel}
        >
          <Download size={16} />
          <span className="hidden sm:inline">{exportLabel}</span>
        </button>
      )}
    </div>
  );
}

// Utility function to format calculator results for copying
export function formatResultsForCopy(
  title: string,
  results: Array<{ label: string; value: string | number }>
): string {
  const lines = [
    title,
    "=".repeat(40),
    "",
    ...results.map((r) => `${r.label}: ${r.value}`),
    "",
    "---",
    `Generated on: ${new Date().toLocaleDateString("en-IN")}`,
    "Source: One TN Portal (onetn-portal.app)",
  ];
  return lines.join("\n");
}
