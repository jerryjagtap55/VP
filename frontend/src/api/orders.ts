import type {
  OrderDetails,
  OrderSummary,
  UpdateOrderStatusRequest,
} from '../../../shared/api.ts';
import type { OrderStatus } from '../../../shared/order.ts';
import { request } from './client.ts';

export function fetchOrders(): Promise<OrderSummary[]> {
  return request('/orders');
}

export function fetchOrder(id: string): Promise<OrderDetails> {
  return request(`/orders/${encodeURIComponent(id)}`);
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<OrderDetails> {
  const body: UpdateOrderStatusRequest = { status };
  return request(`/orders/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body,
  });
}
