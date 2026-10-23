import type { OrderSummary } from '../../../shared/api.ts';
import { formatCurrency, formatDate } from '../utils/format.ts';
import { StatusBadge } from './StatusBadge.tsx';

interface OrderCardListProps {
  orders: OrderSummary[];
  onViewDetails: (orderId: string) => void;
}

export function OrderCardList({ orders, onViewDetails }: OrderCardListProps) {
  return (
    <ul aria-label="Customer orders" className="space-y-3">
      {orders.map((order) => (
        <li
          key={order.id}
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-sm text-gray-600">{order.id}</p>
              <p className="font-medium break-words">{order.customerName}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="mt-3 flex items-end justify-between text-sm">
            <span className="text-gray-600">{formatDate(order.orderDate)}</span>
            <span className="text-base font-semibold tabular-nums">
              {formatCurrency(order.total)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onViewDetails(order.id)}
            aria-label={`View details for order ${order.id}`}
            className="mt-3 w-full rounded-md border border-gray-300 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            View details
          </button>
        </li>
      ))}
    </ul>
  );
}
