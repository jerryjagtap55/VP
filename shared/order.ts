export const ORDER_STATUSES = [
  'Pending',
  'Processing',
  'Completed',
  'Cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  /** ISO date, YYYY-MM-DD */
  orderDate: string;
  status: OrderStatus;
  items: OrderItem[];
}

export const ALLOWED_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> =
  {
    Pending: ['Processing', 'Cancelled'],
    Processing: ['Completed', 'Cancelled'],
    Completed: [],
    Cancelled: [],
  };

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  return ORDER_STATUSES.some((status) => status === value);
}
