'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function DocumentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-tn-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-yellow-50 rounded-full">
              <AlertCircle size={32} className="text-yellow-600" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-tn-text mb-2 text-center">
            Error Loading Documents
          </h1>
          <p className="text-gray-600 text-center mb-6">
            We encountered an issue while loading the documents. Please try again.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="flex-1 px-4 py-2 bg-tn-primary text-white rounded-lg font-medium hover:bg-tn-primary/90 transition-colors text-center"
            >
              Try Again
            </button>
            <Link
              href="/documents"
              className="flex-1 px-4 py-2 border border-tn-primary text-tn-primary rounded-lg font-medium hover:bg-tn-primary/10 transition-colors text-center"
            >
              Reload
            </Link>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 mt-4 text-tn-primary hover:text-tn-highlight transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
