import { useEffect, useState } from 'react';
import type { OrderSummary } from '../../../shared/api.ts';
import { getErrorMessage } from '../api/client.ts';
import { fetchOrders } from '../api/orders.ts';

type OrdersState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; orders: OrderSummary[] };

export function useOrders() {
  const [state, setState] = useState<OrdersState>({ status: 'loading' });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      try {
        const orders = await fetchOrders();
        if (!ignore) {
          setState({ status: 'success', orders });
        }
      } catch (error) {
        if (!ignore) {
          setState({ status: 'error', message: getErrorMessage(error) });
        }
      }
    }

    loadOrders();

    return () => {
      ignore = true;
    };
  }, [reloadCount]);

  function reload() {
    setState({ status: 'loading' });
    setReloadCount((count) => count + 1);
  }

  return { state, reload };
}
