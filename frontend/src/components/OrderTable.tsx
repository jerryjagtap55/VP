import type { OrderSummary } from '../../../shared/api.ts';
import { formatCurrency, formatDate } from '../utils/format.ts';
import { StatusBadge } from './StatusBadge.tsx';

interface OrderTableProps {
  orders: OrderSummary[];
  onViewDetails: (orderId: string) => void;
}

export function OrderTable({ orders, onViewDetails }: OrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <caption className="sr-only">Customer orders</caption>
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Order ID
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Customer
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Date
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Total
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono whitespace-nowrap">
                {order.id}
              </td>
              <td className="px-4 py-3">{order.customerName}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatDate(order.orderDate)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                {formatCurrency(order.total)}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onViewDetails(order.id)}
                  aria-label={`View details for order ${order.id}`}
                  className="rounded px-2 py-1 font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
