import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import request from 'supertest';
import { app } from './app.ts';

// Supertest sends requests straight to the Express app; no server or port is needed.
// The order data lives in memory, so tests that change an order use one no other test reads.

describe('GET /orders', () => {
  it('returns every order as a summary without items', async () => {
    const response = await request(app).get('/orders');

    assert.equal(response.status, 200);
    assert.equal(response.body.length, 15);
    assert.equal(response.body[0].items, undefined);
  });
});

describe('GET /orders/:id', () => {
  it('returns the order with line totals and a total calculated in cents', async () => {
    const response = await request(app).get('/orders/ORD-1005');

    assert.equal(response.status, 200);
    assert.equal(response.body.items[0].lineTotal, 119.7); // 6 × 19.95
    assert.equal(response.body.total, 206.8);
  });

  it('returns 404 with a structured error for an unknown order', async () => {
    const response = await request(app).get('/orders/ORD-9999');

    assert.equal(response.status, 404);
    assert.equal(response.body.error.code, 'ORDER_NOT_FOUND');
  });
});

describe('PATCH /orders/:id', () => {
  it('applies an allowed transition and keeps it for later requests', async () => {
    const update = await request(app)
      .patch('/orders/ORD-1008')
      .send({ status: 'Processing' });

    assert.equal(update.status, 200);
    assert.equal(update.body.status, 'Processing');

    const reread = await request(app).get('/orders/ORD-1008');
    assert.equal(reread.body.status, 'Processing');
  });

  it('rejects changes to a completed order', async () => {
    const response = await request(app)
      .patch('/orders/ORD-1003')
      .send({ status: 'Cancelled' });

    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'INVALID_STATUS_TRANSITION');
  });

  it('rejects a status that does not exist', async () => {
    const response = await request(app)
      .patch('/orders/ORD-1012')
      .send({ status: 'Shipped' });

    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'VALIDATION_ERROR');
  });

  it('rejects a body that is not valid JSON', async () => {
    const response = await request(app)
      .patch('/orders/ORD-1012')
      .set('Content-Type', 'application/json')
      .send('{bad');

    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'VALIDATION_ERROR');
  });

  it('rejects a body larger than the 10 KB limit', async () => {
    const response = await request(app)
      .patch('/orders/ORD-1012')
      .send({ status: 'Processing', padding: 'x'.repeat(20_000) });

    assert.equal(response.status, 413);
    assert.equal(response.body.error.code, 'PAYLOAD_TOO_LARGE');
  });

  it('returns 404 when the order does not exist', async () => {
    const response = await request(app)
      .patch('/orders/ORD-9999')
      .send({ status: 'Processing' });

    assert.equal(response.status, 404);
  });
});
