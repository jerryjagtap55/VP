import type { OrderSummary } from '../../../shared/api.ts';
import type { OrderStatus } from '../../../shared/order.ts';

export function countOrdersByStatus(
  orders: OrderSummary[],
): Record<OrderStatus, number> {
  // Record<OrderStatus, …> makes TypeScript require a starting count for every status.
  const counts: Record<OrderStatus, number> = {
    Pending: 0,
    Processing: 0,
    Completed: 0,
    Cancelled: 0,
  };

  for (const order of orders) {
    counts[order.status] += 1;
  }

  return counts;
}
