import Link from 'next/link';
import { FileText, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-tn-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="text-6xl font-bold text-tn-primary/20">404</div>
          </div>

          <h1 className="text-2xl font-bold text-tn-text mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            The document or page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Go to Homepage
            </Link>

            <Link
              href="/go"
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              Browse GOs
            </Link>

            <Link
              href="/search"
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              <Search size={18} />
              Search GOs
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            If you think this is a mistake, please{' '}
            <a href="mailto:contact@onetn.in" className="text-tn-primary hover:underline">
              contact us
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
