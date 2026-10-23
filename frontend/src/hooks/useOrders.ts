import { useEffect, useState } from 'react';
import type { OrderStatus } from '../../../shared/order.ts';
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

  // Called after the API confirms a change, so the list matches the server.
  function setOrderStatus(orderId: string, status: OrderStatus) {
    setState((current) =>
      current.status === 'success'
        ? {
            ...current,
            orders: current.orders.map((order) =>
              order.id === orderId ? { ...order, status } : order,
            ),
          }
        : current,
    );
  }

  return { state, reload, setOrderStatus };
}
