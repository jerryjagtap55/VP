import { readFileSync } from 'node:fs';
import type { Order } from '../../../shared/order.ts';
import { isOrder } from '../validation.ts';

const DATA_FILE = new URL('../../data/orders.json', import.meta.url);

function loadOrders(): Map<string, Order> {
  const data: unknown = JSON.parse(readFileSync(DATA_FILE, 'utf8'));

  if (!Array.isArray(data) || !data.every(isOrder)) {
    throw new Error(`Invalid order data in ${DATA_FILE.pathname}`);
  }

  return new Map(data.map((order) => [order.id, order]));
}

// Loaded once at startup; status updates live in memory until the server restarts.
const orders = loadOrders();

export function findAllOrders(): Order[] {
  return [...orders.values()];
}

export function findOrderById(id: string): Order | undefined {
  return orders.get(id);
}

export function saveOrder(order: Order): void {
  orders.set(order.id, order);
}
