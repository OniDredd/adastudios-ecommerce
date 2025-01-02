'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-peach px-4">
      <div className="text-center">
        <h2 className="text-xl font-medium text-main-maroon mb-4">
          Something went wrong
        </h2>
        <p className="text-main-maroon/80 mb-8 max-w-md">
          We apologize for the inconvenience. An error occurred while processing your request.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="bg-main-maroon text-secondary-peach px-6 py-2 rounded-lg hover:bg-main-maroon/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-block border border-main-maroon text-main-maroon px-6 py-2 rounded-lg hover:bg-main-maroon hover:text-secondary-peach transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
