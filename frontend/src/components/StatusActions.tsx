import {
  ALLOWED_TRANSITIONS,
  type OrderStatus,
} from '../../../shared/order.ts';

// Button text for moving an order *into* each status.
const ACTION_LABELS: Record<OrderStatus, string> = {
  Pending: 'Move to Pending',
  Processing: 'Start processing',
  Completed: 'Mark as completed',
  Cancelled: 'Cancel order',
};

interface StatusActionsProps {
  currentStatus: OrderStatus;
  isUpdating: boolean;
  onChangeStatus: (newStatus: OrderStatus) => void;
}

export function StatusActions({
  currentStatus,
  isUpdating,
  onChangeStatus,
}: StatusActionsProps) {
  const nextStatuses = ALLOWED_TRANSITIONS[currentStatus];

  if (nextStatuses.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        {currentStatus} orders can no longer be changed.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {nextStatuses.map((nextStatus) => (
        <button
          key={nextStatus}
          type="button"
          disabled={isUpdating}
          onClick={() => onChangeStatus(nextStatus)}
          className={
            nextStatus === 'Cancelled'
              ? 'rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50'
              : 'rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-50'
          }
        >
          {ACTION_LABELS[nextStatus]}
        </button>
      ))}
      {isUpdating && (
        <span role="status" className="text-sm text-gray-600">
          Updating…
        </span>
      )}
    </div>
  );
}
