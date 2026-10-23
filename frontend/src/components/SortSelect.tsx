import { useId } from 'react';
import type { OrderSort } from '../utils/sortOrders.ts';

interface SortOption {
  label: string;
  sort: OrderSort;
}

// Field and direction are combined so each option says exactly what you get.
const SORT_OPTIONS: readonly SortOption[] = [
  { label: 'Newest first', sort: { field: 'orderDate', direction: 'desc' } },
  { label: 'Oldest first', sort: { field: 'orderDate', direction: 'asc' } },
  { label: 'Total: high to low', sort: { field: 'total', direction: 'desc' } },
  { label: 'Total: low to high', sort: { field: 'total', direction: 'asc' } },
  { label: 'Customer: A-Z', sort: { field: 'customerName', direction: 'asc' } },
  {
    label: 'Customer: Z-A',
    sort: { field: 'customerName', direction: 'desc' },
  },
];

// <select> values must be strings, so each sort is identified as "field-direction".
function toOptionValue({ field, direction }: OrderSort): string {
  return `${field}-${direction}`;
}

interface SortSelectProps {
  sort: OrderSort;
  onSortChange: (sort: OrderSort) => void;
}

export function SortSelect({ sort, onSortChange }: SortSelectProps) {
  const selectId = useId();

  function handleChange(value: string) {
    const option = SORT_OPTIONS.find(
      (candidate) => toOptionValue(candidate.sort) === value,
    );
    if (option) {
      onSortChange(option.sort);
    }
  }

  return (
    <div>
      <label
        htmlFor={selectId}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        Sort by
      </label>
      <select
        id={selectId}
        value={toOptionValue(sort)}
        onChange={(event) => handleChange(event.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-2 focus:outline-blue-600/30 sm:w-56"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.label} value={toOptionValue(option.sort)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
