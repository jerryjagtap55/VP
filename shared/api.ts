import type { Order, OrderItem, OrderStatus } from './order.ts';

export interface OrderLine extends OrderItem {
  lineTotal: number;
}

export interface OrderSummary extends Omit<Order, 'items'> {
  total: number;
}

export interface OrderDetails extends OrderSummary {
  items: OrderLine[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_STATUS_TRANSITION'
  | 'ORDER_NOT_FOUND'
  | 'PAYLOAD_TOO_LARGE'
  | 'ROUTE_NOT_FOUND'
  | 'INTERNAL_ERROR';

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}
