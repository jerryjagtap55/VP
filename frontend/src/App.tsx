import { ALLOWED_TRANSITIONS, ORDER_STATUSES } from '../../shared/order.ts';

export default function App() {
  return (
    <ul className="space-y-2 p-6">
      {ORDER_STATUSES.map((status) => (
        <li key={status}>
          <strong>{status}</strong> →{' '}
          {ALLOWED_TRANSITIONS[status].join(', ') || 'no changes allowed'}
        </li>
      ))}
    </ul>
  );
}
