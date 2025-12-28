"use client";

import { Printer, Download } from "lucide-react";

interface PrintButtonProps {
  title?: string;
  showPDF?: boolean;
}

export default function PrintButton({ title = "Print", showPDF = false }: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  const handlePDF = async () => {
    // For PDF, we use the browser's built-in "Save as PDF" feature
    // This is triggered through the print dialog
    window.print();
  };

  return (
    <div className="flex gap-2 print:hidden">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
        title={title}
      >
        <Printer size={16} />
        <span className="hidden sm:inline">Print</span>
      </button>
      {showPDF && (
        <button
          onClick={handlePDF}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
          title="Save as PDF"
        >
          <Download size={16} />
          <span className="hidden sm:inline">PDF</span>
        </button>
      )}
    </div>
  );
}
