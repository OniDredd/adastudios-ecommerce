import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-peach px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-main-maroon mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-main-maroon mb-4">
          Page Not Found
        </h2>
        <p className="text-main-maroon/80 mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            className="bg-main-maroon text-secondary-peach px-6 py-2 rounded-lg hover:bg-main-maroon/90 transition-colors inline-block"
          >
            Return Home
          </Link>
          <Link
            href="/shop"
            className="border border-main-maroon text-main-maroon px-6 py-2 rounded-lg hover:bg-main-maroon hover:text-secondary-peach transition-colors inline-block"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
