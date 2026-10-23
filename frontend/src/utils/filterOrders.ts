import type { OrderSummary } from '../../../shared/api.ts';
import type { OrderStatus } from '../../../shared/order.ts';

export type StatusFilter = OrderStatus | 'All';

export interface OrderFilterCriteria {
  query: string;
  status: StatusFilter;
}

export function filterOrders(
  orders: OrderSummary[],
  { query, status }: OrderFilterCriteria,
): OrderSummary[] {
  const normalizedQuery = query.trim().toLowerCase();

  return orders.filter((order) => {
    const matchesStatus = status === 'All' || order.status === status;
    const matchesQuery =
      normalizedQuery === '' ||
      order.id.toLowerCase().includes(normalizedQuery) ||
      order.customerName.toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });
}
