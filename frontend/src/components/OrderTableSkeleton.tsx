const PLACEHOLDER_ROWS = 6;

export function OrderTableSkeleton() {
  return (
    <div role="status" className="rounded-lg border border-gray-200">
      <span className="sr-only">Loading orders…</span>

      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="flex gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3">
          <div className="h-3 w-16 rounded bg-gray-300" />
          <div className="h-3 flex-1 rounded bg-gray-300" />
          <div className="hidden h-3 w-20 rounded bg-gray-300 sm:block" />
          <div className="h-3 w-20 rounded bg-gray-300" />
          <div className="h-3 w-16 rounded bg-gray-300" />
        </div>

        {Array.from({ length: PLACEHOLDER_ROWS }, (_, row) => (
          <div
            key={row}
            className="flex items-center gap-4 border-b border-gray-100 px-4 py-4 last:border-b-0"
          >
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-4 flex-1 rounded bg-gray-200" />
            <div className="hidden h-4 w-20 rounded bg-gray-200 sm:block" />
            <div className="h-6 w-20 rounded-full bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
