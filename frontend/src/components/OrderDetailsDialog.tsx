import { useEffect, useId, useRef, type MouseEvent } from 'react';
import type { OrderDetails } from '../../../shared/api.ts';
import { useOrderDetails } from '../hooks/useOrderDetails.ts';
import { formatCurrency, formatDate } from '../utils/format.ts';
import { ErrorMessage } from './ErrorMessage.tsx';
import { StatusBadge } from './StatusBadge.tsx';

interface OrderDetailsDialogProps {
  orderId: string;
  onClose: () => void;
}

export function OrderDetailsDialog({
  orderId,
  onClose,
}: OrderDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { state, reload } = useOrderDetails(orderId);

  // Open as a modal once mounted. The check avoids a second showModal() when
  // StrictMode runs this effect twice in development.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  // Every way of closing (button, Esc, backdrop) goes through dialog.close(),
  // which fires the native "close" event and so calls onClose exactly once.
  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    // Clicks on the backdrop target the <dialog> itself, not its content.
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto w-full max-w-2xl rounded-lg p-0 shadow-xl backdrop:bg-gray-900/50"
    >
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold">
            Order {orderId}
          </h2>
          <button
            type="button"
            onClick={closeDialog}
            className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            Close
          </button>
        </div>

        {state.status === 'loading' && (
          <p role="status" className="py-8 text-center text-gray-600">
            Loading order details…
          </p>
        )}

        {state.status === 'not-found' && (
          <ErrorMessage message={state.message} />
        )}

        {state.status === 'error' && (
          <ErrorMessage message={state.message} onRetry={reload} />
        )}

        {state.status === 'success' && (
          <OrderDetailsContent order={state.order} />
        )}
      </div>
    </dialog>
  );
}

function OrderDetailsContent({ order }: { order: OrderDetails }) {
  return (
    <>
      <dl className="mb-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-gray-500">Customer</dt>
          <dd className="font-medium">{order.customerName}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Order date</dt>
          <dd className="font-medium">{formatDate(order.orderDate)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Status</dt>
          <dd>
            <StatusBadge status={order.status} />
          </dd>
        </div>
      </dl>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <caption className="sr-only">Items in order {order.id}</caption>
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th scope="col" className="px-4 py-2 font-semibold">
                Product
              </th>
              <th scope="col" className="px-4 py-2 text-right font-semibold">
                Quantity
              </th>
              <th scope="col" className="px-4 py-2 text-right font-semibold">
                Unit price
              </th>
              <th scope="col" className="px-4 py-2 text-right font-semibold">
                Line total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td className="px-4 py-2">{item.productName}</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {item.quantity}
                </td>
                <td className="px-4 py-2 text-right whitespace-nowrap tabular-nums">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="px-4 py-2 text-right whitespace-nowrap tabular-nums">
                  {formatCurrency(item.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="px-4 py-2 text-right font-semibold"
              >
                Order total
              </th>
              <td className="px-4 py-2 text-right font-semibold whitespace-nowrap tabular-nums">
                {formatCurrency(order.total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
