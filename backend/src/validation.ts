import {
  isOrderStatus,
  ORDER_STATUSES,
  type Order,
  type OrderItem,
  type OrderStatus,
} from '../../shared/order.ts';
import { AppError } from './errors.ts';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isOrderItem(value: unknown): value is OrderItem {
  return (
    isRecord(value) &&
    typeof value.productId === 'string' &&
    typeof value.productName === 'string' &&
    typeof value.quantity === 'number' &&
    Number.isInteger(value.quantity) &&
    value.quantity > 0 &&
    typeof value.unitPrice === 'number' &&
    value.unitPrice >= 0
  );
}

export function isOrder(value: unknown): value is Order {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.customerName === 'string' &&
    typeof value.orderDate === 'string' &&
    ISO_DATE.test(value.orderDate) &&
    isOrderStatus(value.status) &&
    Array.isArray(value.items) &&
    value.items.every(isOrderItem)
  );
}

export function parseUpdateStatusRequest(body: unknown): OrderStatus {
  const status = isRecord(body) ? body.status : undefined;

  if (!isOrderStatus(status)) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      `"status" must be one of: ${ORDER_STATUSES.join(', ')}`,
    );
  }

  return status;
}
