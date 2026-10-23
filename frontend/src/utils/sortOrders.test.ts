import { describe, expect, it } from 'vitest';
import { makeOrder } from '../test/makeOrder.ts';
import { sortOrders } from './sortOrders.ts';

const orders = [
  makeOrder({ id: 'ORD-A', orderDate: '2026-10-05', total: 50 }),
  makeOrder({ id: 'ORD-B', orderDate: '2026-09-30', total: 200 }),
  makeOrder({ id: 'ORD-C', orderDate: '2026-10-15', total: 50 }),
];

function ids(result: { id: string }[]) {
  return result.map((order) => order.id);
}

describe('sortOrders', () => {
  it('sorts by date, newest first', () => {
    const result = sortOrders(orders, {
      field: 'orderDate',
      direction: 'desc',
    });
    expect(ids(result)).toEqual(['ORD-C', 'ORD-A', 'ORD-B']);
  });

  it('sorts by total, lowest first, using the ID to break ties', () => {
    const result = sortOrders(orders, { field: 'total', direction: 'asc' });
    expect(ids(result)).toEqual(['ORD-A', 'ORD-C', 'ORD-B']);
  });

  it('does not change the original array', () => {
    sortOrders(orders, { field: 'total', direction: 'desc' });
    expect(ids(orders)).toEqual(['ORD-A', 'ORD-B', 'ORD-C']);
  });
});
