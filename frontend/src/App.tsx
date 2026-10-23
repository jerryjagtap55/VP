import { OrderTableSkeleton } from './components/OrderTableSkeleton.tsx';
import { useOrders } from './hooks/useOrders.ts';

export default function App() {
  const { state, reload } = useOrders();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Order Management Dashboard</h1>

      {state.status === 'loading' && <OrderTableSkeleton />}

      {state.status === 'error' && (
        <div
          role="alert"
          className="rounded border border-red-300 bg-red-50 p-4"
        >
          <p className="text-red-800">{state.message}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-3 rounded bg-red-700 px-3 py-1 text-white"
          >
            Try again
          </button>
        </div>
      )}

      {state.status === 'success' && (
        <>
          <p className="mb-4">{state.orders.length} orders loaded</p>
          <ul className="space-y-1">
            {state.orders.map((order) => (
              <li key={order.id}>
                {order.id} · {order.customerName} · {order.status} · $
                {order.total}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
