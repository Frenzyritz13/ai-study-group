export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-screen items-center justify-center bg-gray-50"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
        />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  );
}
