import { Router } from 'express';
import {
  getOrder,
  listOrders,
  updateOrderStatus,
} from '../services/orderService.ts';
import { parseUpdateStatusRequest } from '../validation.ts';

export const orderRouter = Router();

orderRouter.get('/', (_req, res) => {
  res.json(listOrders());
});

orderRouter.get('/:id', (req, res) => {
  res.json(getOrder(req.params.id));
});

orderRouter.patch('/:id', (req, res) => {
  const status = parseUpdateStatusRequest(req.body);
  res.json(updateOrderStatus(req.params.id, status));
});
