import { useState } from 'react';
import { ErrorMessage } from './components/ErrorMessage.tsx';
import { OrderFilters } from './components/OrderFilters.tsx';
import { OrderTable } from './components/OrderTable.tsx';
import { OrderTableSkeleton } from './components/OrderTableSkeleton.tsx';
import { useOrders } from './hooks/useOrders.ts';
import { filterOrders, type StatusFilter } from './utils/filterOrders.ts';

export default function App() {
  const { state, reload } = useOrders();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  // Derived during render, not stored in state, so it can never be out of sync.
  const visibleOrders =
    state.status === 'success'
      ? filterOrders(state.orders, { query, status: statusFilter })
      : [];

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Order Management Dashboard</h1>

      {state.status === 'loading' && <OrderTableSkeleton />}

      {state.status === 'error' && (
        <ErrorMessage message={state.message} onRetry={reload} />
      )}

      {state.status === 'success' && (
        <>
          <OrderFilters
            query={query}
            status={statusFilter}
            onQueryChange={setQuery}
            onStatusChange={setStatusFilter}
          />
          <p aria-live="polite" className="mb-2 text-sm text-gray-600">
            Showing {visibleOrders.length} of {state.orders.length} orders
          </p>
          <OrderTable
            orders={visibleOrders}
            emptyMessage={
              state.orders.length > 0
                ? 'No orders match your search and filter.'
                : undefined
            }
          />
        </>
      )}
    </main>
  );
}
