import type { OrderSummary } from '../../../shared/api.ts';
import { OrderCardList } from './OrderCardList.tsx';
import { OrderTable } from './OrderTable.tsx';

interface OrderListProps {
  orders: OrderSummary[];
  onViewDetails: (orderId: string) => void;
  emptyMessage?: string;
}

// Cards on small screens, a table from the md breakpoint (768px) up.
// The hidden layout uses display: none, so screen readers only meet one of them.
export function OrderList({
  orders,
  onViewDetails,
  emptyMessage = 'There are no orders yet.',
}: OrderListProps) {
  if (orders.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">
        {emptyMessage}
      </p>
    );
  }

  return (
    <>
      <div className="md:hidden">
        <OrderCardList orders={orders} onViewDetails={onViewDetails} />
      </div>
      <div className="hidden md:block">
        <OrderTable orders={orders} onViewDetails={onViewDetails} />
      </div>
    </>
  );
}
