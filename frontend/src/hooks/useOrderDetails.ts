import { useEffect, useState } from 'react';
import type { OrderDetails } from '../../../shared/api.ts';
import type { OrderStatus } from '../../../shared/order.ts';
import { ApiError, getErrorMessage } from '../api/client.ts';
import { fetchOrder, updateOrderStatus } from '../api/orders.ts';

type OrderDetailsState =
  | { status: 'loading' }
  | { status: 'not-found'; message: string }
  | { status: 'error'; message: string }
  | { status: 'success'; order: OrderDetails };

export function useOrderDetails(orderId: string) {
  const [state, setState] = useState<OrderDetailsState>({ status: 'loading' });
  const [reloadCount, setReloadCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadOrder() {
      try {
        const order = await fetchOrder(orderId);
        if (!ignore) {
          setState({ status: 'success', order });
        }
      } catch (error) {
        if (ignore) {
          return;
        }
        if (error instanceof ApiError && error.status === 404) {
          setState({ status: 'not-found', message: error.message });
        } else {
          setState({ status: 'error', message: getErrorMessage(error) });
        }
      }
    }

    loadOrder();

    return () => {
      ignore = true;
    };
  }, [orderId, reloadCount]);

  function reload() {
    setState({ status: 'loading' });
    setReloadCount((count) => count + 1);
  }

  // Pessimistic update: the screen changes only after the API confirms.
  async function changeStatus(
    newStatus: OrderStatus,
  ): Promise<OrderDetails | null> {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setState({ status: 'success', order: updatedOrder });
      return updatedOrder;
    } catch (error) {
      setUpdateError(getErrorMessage(error));
      return null;
    } finally {
      setIsUpdating(false);
    }
  }

  return { state, reload, changeStatus, isUpdating, updateError };
}
