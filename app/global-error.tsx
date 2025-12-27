'use client';

import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-tn-background flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-50 rounded-full">
                <AlertCircle size={32} className="text-red-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-tn-text mb-2">Critical Error</h1>
            <p className="text-gray-600 mb-6">
              A critical error occurred. Please refresh the page and try again.
            </p>

            <button
              onClick={() => reset()}
              className="w-full px-6 py-3 bg-tn-primary text-white rounded-lg font-medium hover:bg-tn-primary/90 transition-colors"
            >
              Refresh Page
            </button>

            <p className="text-xs text-gray-500 mt-4">
              If the problem persists, please try clearing your browser cache.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
