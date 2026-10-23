import { ErrorMessage } from './components/ErrorMessage.tsx';
import { OrderTable } from './components/OrderTable.tsx';
import { OrderTableSkeleton } from './components/OrderTableSkeleton.tsx';
import { useOrders } from './hooks/useOrders.ts';

export default function App() {
  const { state, reload } = useOrders();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Order Management Dashboard</h1>

      {state.status === 'loading' && <OrderTableSkeleton />}

      {state.status === 'error' && (
        <ErrorMessage message={state.message} onRetry={reload} />
      )}

      {state.status === 'success' && <OrderTable orders={state.orders} />}
    </main>
  );
}
