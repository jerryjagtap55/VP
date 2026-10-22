import express, { type Request, type Response } from 'express';

const app = express();
const port = 3000;
const broken: string = 'hello';

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

