/**
 * PDF Export utilities for calculator results
 * Uses browser's native print-to-PDF functionality
 */

interface ExportOptions {
  title: string;
  subtitle?: string;
  filename?: string;
}

/**
 * Export element content as PDF using browser print dialog
 */
export function exportToPDF(
  elementId: string,
  options: ExportOptions
): void {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export PDF");
    return;
  }

  // Get current date
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Build print-friendly HTML
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${options.title}</title>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #333;
          padding: 20mm;
        }

        .header {
          text-align: center;
          border-bottom: 2px solid #065f46;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }

        .header h1 {
          color: #065f46;
          font-size: 18pt;
          margin-bottom: 5px;
        }

        .header p {
          color: #666;
          font-size: 10pt;
        }

        .content {
          margin-bottom: 30px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }

        th {
          background-color: #f0fdf4;
          font-weight: 600;
        }

        .highlight {
          background-color: #f0fdf4;
          font-weight: bold;
        }

        .footer {
          position: fixed;
          bottom: 10mm;
          left: 20mm;
          right: 20mm;
          text-align: center;
          font-size: 9pt;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }

        .disclaimer {
          margin-top: 20px;
          padding: 10px;
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          font-size: 10pt;
          color: #92400e;
        }

        @media print {
          body { padding: 15mm; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${options.title}</h1>
        ${options.subtitle ? `<p>${options.subtitle}</p>` : ""}
        <p>Generated on: ${date}</p>
      </div>

      <div class="content">
        ${element.innerHTML}
      </div>

      <div class="disclaimer">
        <strong>Disclaimer:</strong> This is an unofficial calculation for estimation purposes only.
        Actual amounts may vary. Please verify with your DDO or official sources.
      </div>

      <div class="footer">
        One TN Portal | Unofficial Resource for TN Education Department Employees
        <br>
        onetn-portal.app | Generated: ${date}
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

/**
 * Format results data for export
 */
export function formatResultsForExport(
  results: Array<{ label: string; value: string | number; highlight?: boolean }>
): string {
  let html = '<table>';

  for (const row of results) {
    const className = row.highlight ? 'highlight' : '';
    html += `
      <tr class="${className}">
        <td>${row.label}</td>
        <td style="text-align: right; font-weight: ${row.highlight ? 'bold' : 'normal'}">
          ${row.value}
        </td>
      </tr>
    `;
  }

  html += '</table>';
  return html;
}

/**
 * Create exportable results container
 */
export function createExportableResults(
  title: string,
  sections: Array<{
    heading: string;
    rows: Array<{ label: string; value: string | number; highlight?: boolean }>;
  }>
): string {
  let html = '';

  for (const section of sections) {
    html += `<h3 style="margin: 15px 0 10px; color: #065f46;">${section.heading}</h3>`;
    html += formatResultsForExport(section.rows);
  }

  return html;
}
