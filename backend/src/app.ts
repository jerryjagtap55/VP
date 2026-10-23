import express from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './middleware/errorHandlers.ts';
import { orderRouter } from './routes/orderRoutes.ts';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/orders', orderRouter);

app.use(notFoundHandler);
app.use(errorHandler);
