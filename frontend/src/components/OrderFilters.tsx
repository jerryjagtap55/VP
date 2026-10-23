import { useId } from 'react';
import { ORDER_STATUSES } from '../../../shared/order.ts';
import type { StatusFilter } from '../utils/filterOrders.ts';

const STATUS_FILTERS: readonly StatusFilter[] = ['All', ...ORDER_STATUSES];

interface OrderFiltersProps {
  query: string;
  status: StatusFilter;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: StatusFilter) => void;
}

export function OrderFilters({
  query,
  status,
  onQueryChange,
  onStatusChange,
}: OrderFiltersProps) {
  const searchId = useId();

  return (
    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="md:w-80">
        <label
          htmlFor={searchId}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Search
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Order ID or customer name"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-2 focus:outline-blue-600/30"
        />
      </div>

      <div
        role="group"
        aria-label="Filter by status"
        className="flex flex-wrap gap-2"
      >
        {STATUS_FILTERS.map((filter) => {
          const isActive = filter === status;
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={isActive}
              onClick={() => onStatusChange(filter)}
              className={
                isActive
                  ? 'rounded-full border border-gray-900 bg-gray-900 px-3 py-1 text-sm font-medium text-white'
                  : 'rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100'
              }
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
