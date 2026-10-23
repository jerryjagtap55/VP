import type { OrderSummary } from '../../../shared/api.ts';
import { formatCurrency, formatDate } from '../utils/format.ts';
import { StatusBadge } from './StatusBadge.tsx';

interface OrderTableProps {
  orders: OrderSummary[];
  emptyMessage?: string;
}

export function OrderTable({
  orders,
  emptyMessage = 'There are no orders yet.',
}: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">
        {emptyMessage}
      </p>
    );
  }

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
