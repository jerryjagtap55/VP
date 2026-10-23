import type { OrderStatus } from '../../../shared/order.ts';

// Complete class names so Tailwind can find them when scanning the source.
const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-800 ring-amber-600/20',
  Processing: 'bg-blue-100 text-blue-800 ring-blue-600/20',
  Completed: 'bg-green-100 text-green-800 ring-green-600/20',
  Cancelled: 'bg-gray-100 text-gray-700 ring-gray-500/20',
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
