'use client';

import Link from 'next/link';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-tn-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-50 rounded-full">
              <AlertCircle size={32} className="text-red-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-tn-text mb-2">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-6">
            We encountered an error while processing your request. Please try again.
          </p>

          {error.message && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error details
              </summary>
              <p className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-700 font-mono overflow-auto">
                {error.message}
              </p>
            </details>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              Try again
            </button>
            <Link
              href="/"
              className="flex-1 btn-outline flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
