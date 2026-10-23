import type { OrderDetails, OrderSummary } from '../../../shared/api.ts';
import {
  ALLOWED_TRANSITIONS,
  canTransition,
  type Order,
  type OrderStatus,
} from '../../../shared/order.ts';
import { AppError } from '../errors.ts';
import {
  findAllOrders,
  findOrderById,
  saveOrder,
} from '../repositories/orderRepository.ts';

// Money is summed in whole cents to avoid floating-point drift (19.95 * 3 !== 59.85).
function toCents(amount: number): number {
  return Math.round(amount * 100);
}

function toOrderDetails(order: Order): OrderDetails {
  const items = order.items.map((item) => ({
    ...item,
    lineTotal: (toCents(item.unitPrice) * item.quantity) / 100,
  }));
  const totalCents = items.reduce(
    (sum, item) => sum + toCents(item.lineTotal),
    0,
  );

  return { ...order, items, total: totalCents / 100 };
}

function toOrderSummary(order: Order): OrderSummary {
  const { id, customerName, orderDate, status } = order;
  return {
    id,
    customerName,
    orderDate,
    status,
    total: toOrderDetails(order).total,
  };
}

function getExistingOrder(id: string): Order {
  const order = findOrderById(id);

  if (!order) {
    throw new AppError(404, 'ORDER_NOT_FOUND', `Order ${id} was not found`);
  }

  return order;
}

export function listOrders(): OrderSummary[] {
  return findAllOrders().map(toOrderSummary);
}

export function getOrder(id: string): OrderDetails {
  return toOrderDetails(getExistingOrder(id));
}

export function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
): OrderDetails {
  const order = getExistingOrder(id);

  if (!canTransition(order.status, newStatus)) {
    const allowed = ALLOWED_TRANSITIONS[order.status];
    const hint =
      allowed.length > 0
        ? `Allowed: ${allowed.join(', ')}.`
        : `${order.status} orders cannot be modified.`;
    throw new AppError(
      400,
      'INVALID_STATUS_TRANSITION',
      `Cannot change order ${id} from ${order.status} to ${newStatus}. ${hint}`,
    );
  }

  const updatedOrder: Order = { ...order, status: newStatus };
  saveOrder(updatedOrder);
  return toOrderDetails(updatedOrder);
}
