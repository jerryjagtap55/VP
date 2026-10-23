import { describe, expect, it } from 'vitest';
import { makeOrder } from '../test/makeOrder.ts';
import { filterOrders } from './filterOrders.ts';

const orders = [
  makeOrder({
    id: 'ORD-1001',
    customerName: 'ABC Veterinary Clinic',
    status: 'Pending',
  }),
  makeOrder({
    id: 'ORD-1002',
    customerName: 'Paws & Claws Animal Hospital',
    status: 'Processing',
  }),
  makeOrder({
    id: 'ORD-1011',
    customerName: 'ABC Veterinary Clinic',
    status: 'Completed',
  }),
];

function ids(result: { id: string }[]) {
  return result.map((order) => order.id);
}

describe('filterOrders', () => {
  it('returns every order when there is no query and the status is All', () => {
    expect(ids(filterOrders(orders, { query: '', status: 'All' }))).toEqual([
      'ORD-1001',
      'ORD-1002',
      'ORD-1011',
    ]);
  });

  it('matches part of an order ID', () => {
    expect(ids(filterOrders(orders, { query: '1002', status: 'All' }))).toEqual(
      ['ORD-1002'],
    );
  });

  it('matches customer names ignoring case and surrounding spaces', () => {
    expect(
      ids(filterOrders(orders, { query: '  paws ', status: 'All' })),
    ).toEqual(['ORD-1002']);
  });

  it('applies the search and the status filter together', () => {
    expect(
      ids(filterOrders(orders, { query: 'abc', status: 'Completed' })),
    ).toEqual(['ORD-1011']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterOrders(orders, { query: 'zzz', status: 'All' })).toEqual([]);
  });
});
