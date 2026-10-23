import type { OrderSummary } from '../../../shared/api.ts';

export type SortField = 'orderDate' | 'total' | 'customerName';
export type SortDirection = 'asc' | 'desc';

export interface OrderSort {
  field: SortField;
  direction: SortDirection;
}

type Comparator = (a: OrderSummary, b: OrderSummary) => number;

// Each comparator sorts ascending; descending flips the sign.
const COMPARATORS: Record<SortField, Comparator> = {
  // ISO dates (YYYY-MM-DD) sort correctly as plain text.
  orderDate: (a, b) => a.orderDate.localeCompare(b.orderDate),
  total: (a, b) => a.total - b.total,
  customerName: (a, b) => a.customerName.localeCompare(b.customerName),
};

export function sortOrders(
  orders: OrderSummary[],
  { field, direction }: OrderSort,
): OrderSummary[] {
  const sign = direction === 'asc' ? 1 : -1;
  const compare = COMPARATORS[field];

  // toSorted() returns a new array; sort() would mutate the original (React state).
  return orders.toSorted(
    (a, b) => sign * compare(a, b) || a.id.localeCompare(b.id),
  );
}
