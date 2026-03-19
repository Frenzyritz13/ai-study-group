import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md p-8 text-center">
        <p aria-hidden="true" className="mb-2 text-6xl font-bold text-gray-200">
          404
        </p>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Page not found
        </h2>
        <p className="mb-8 text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
