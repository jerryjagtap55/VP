import type { OrderSummary } from '../../../shared/api.ts';
import { ORDER_STATUSES } from '../../../shared/order.ts';
import { countOrdersByStatus } from '../utils/countOrders.ts';
import { StatusBadge } from './StatusBadge.tsx';

interface SummaryCardsProps {
  orders: OrderSummary[];
}

export function SummaryCards({ orders }: SummaryCardsProps) {
  const counts = countOrdersByStatus(orders);

  return (
    <section aria-label="Order summary" className="mb-6">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <dt className="text-sm text-gray-600">Total orders</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {orders.length}
          </dd>
        </div>
        {ORDER_STATUSES.map((status) => (
          <div
            key={status}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <dt>
              <StatusBadge status={status} />
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {counts[status]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
