import { useId } from 'react';
import { ORDER_STATUSES } from '../../../shared/order.ts';
import type { StatusFilter } from '../utils/filterOrders.ts';
import type { OrderSort } from '../utils/sortOrders.ts';
import { SortSelect } from './SortSelect.tsx';

const STATUS_FILTERS: readonly StatusFilter[] = ['All', ...ORDER_STATUSES];

interface OrderFiltersProps {
  query: string;
  status: StatusFilter;
  sort: OrderSort;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: StatusFilter) => void;
  onSortChange: (sort: OrderSort) => void;
}

export function OrderFilters({
  query,
  status,
  sort,
  onQueryChange,
  onStatusChange,
  onSortChange,
}: OrderFiltersProps) {
  const searchId = useId();

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="sm:flex-1 md:max-w-sm">
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
        <SortSelect sort={sort} onSortChange={onSortChange} />
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
