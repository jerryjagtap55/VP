import { useEffect, useState } from 'react';
import type { OrderDetails } from '../../../shared/api.ts';
import { ApiError, getErrorMessage } from '../api/client.ts';
import { fetchOrder } from '../api/orders.ts';

type OrderDetailsState =
  | { status: 'loading' }
  | { status: 'not-found'; message: string }
  | { status: 'error'; message: string }
  | { status: 'success'; order: OrderDetails };

export function useOrderDetails(orderId: string) {
  const [state, setState] = useState<OrderDetailsState>({ status: 'loading' });
  const [reloadCount, setReloadCount] = useState(0);

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

  return { state, reload };
}
