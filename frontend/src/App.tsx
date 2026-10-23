import { useState } from 'react';
import { ErrorMessage } from './components/ErrorMessage.tsx';
import { OrderDetailsDialog } from './components/OrderDetailsDialog.tsx';
import { OrderFilters } from './components/OrderFilters.tsx';
import { OrderTable } from './components/OrderTable.tsx';
import { OrderTableSkeleton } from './components/OrderTableSkeleton.tsx';
import { SummaryCards } from './components/SummaryCards.tsx';
import { sortOrders, type OrderSort } from './utils/sortOrders.ts';
import { useOrders } from './hooks/useOrders.ts';
import { filterOrders, type StatusFilter } from './utils/filterOrders.ts';

export default function App() {
  const { state, reload, setOrderStatus } = useOrders();
  const [sort, setSort] = useState<OrderSort>({
    field: 'orderDate',
    direction: 'desc',
  });
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Derived during render, not stored in state, so it can never be out of sync.
  const visibleOrders =
    state.status === 'success'
      ? sortOrders(
          filterOrders(state.orders, { query, status: statusFilter }),
          sort,
        )
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
          <SummaryCards orders={state.orders} />
          <OrderFilters
            query={query}
            status={statusFilter}
            onQueryChange={setQuery}
            onStatusChange={setStatusFilter}
            sort={sort}
            onSortChange={setSort}
          />
          <p aria-live="polite" className="mb-2 text-sm text-gray-600">
            Showing {visibleOrders.length} of {state.orders.length} orders
          </p>
          <OrderTable
            orders={visibleOrders}
            onViewDetails={setSelectedOrderId}
            emptyMessage={
              state.orders.length > 0
                ? 'No orders match your search and filter.'
                : undefined
            }
          />
        </>
      )}

      {selectedOrderId !== null && (
        <OrderDetailsDialog
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onStatusChanged={(order) => setOrderStatus(order.id, order.status)}
        />
      )}
    </main>
  );
}
