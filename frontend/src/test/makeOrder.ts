import type { OrderSummary } from '../../../shared/api.ts';

// Builds a valid order so each test only spells out the fields it cares about.
export function makeOrder(overrides: Partial<OrderSummary> = {}): OrderSummary {
  return {
    id: 'ORD-0001',
    customerName: 'Test Clinic',
    orderDate: '2026-10-01',
    status: 'Pending',
    total: 100,
    ...overrides,
  };
}
