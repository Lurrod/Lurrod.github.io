'use strict';
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../src/app');

const ORIGIN = 'https://titouan-borde.com';
const valid = { nom: 'Ada Lovelace', email: 'ada@example.com', message: 'Bonjour, un projet à vous proposer.' };

let sent;
let logged;
const quietLogger = { error: (...args) => { logged.push(args); } };

const build = (overrides = {}) => createApp({
  mailer: { send: async (c) => { sent.push(c); } },
  allowedOrigins: [ORIGIN],
  rateLimit: { windowMs: 60_000, max: 100 },
  logger: quietLogger,
  ...overrides,
});

beforeEach(() => { sent = []; logged = []; });

const post = (app, body, origin = ORIGIN) => {
  const req = request(app).post('/api/contact').set('Content-Type', 'application/json');
  return (origin ? req.set('Origin', origin) : req).send(body);
};

test('GET /api/health answers ok', async () => {
  const res = await request(build()).get('/api/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { success: true, data: { status: 'ok' }, error: null });
});

test('a valid message is sent and acknowledged', async () => {
  const res = await post(build(), valid);
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { success: true, data: null, error: null });
  assert.deepEqual(sent, [{ name: 'Ada Lovelace', email: 'ada@example.com', message: 'Bonjour, un projet à vous proposer.', lang: 'fr' }]);
});

test('an invalid message is rejected with the faulty fields', async () => {
  const res = await post(build(), { ...valid, email: 'pas-un-email' });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error, 'invalid');
  assert.deepEqual(Object.keys(res.body.data.fields), ['email']);
  assert.equal(sent.length, 0);
});

test('a filled honeypot is acknowledged but never sent', async () => {
  const res = await post(build(), { ...valid, website: 'http://spam.example' });
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(sent.length, 0);
});

test('requests from another origin are refused', async () => {
  const res = await post(build(), valid, 'https://evil.example');
  assert.equal(res.status, 403);
  assert.equal(res.body.error, 'forbidden_origin');
  assert.equal(sent.length, 0);
});

test('requests without an Origin header are refused', async () => {
  const res = await post(build(), valid, null);
  assert.equal(res.status, 403);
  assert.equal(sent.length, 0);
});

test('a mail transport failure returns 502 and is logged', async () => {
  const app = build({ mailer: { send: async () => { throw new Error('SMTP down'); } } });
  const res = await post(app, valid);
  assert.equal(res.status, 502);
  assert.deepEqual(res.body, { success: false, data: null, error: 'send_failed' });
  assert.equal(logged.length, 1);
  assert.doesNotMatch(JSON.stringify(res.body), /SMTP down/);
});

test('malformed JSON is a 400, not a crash', async () => {
  const res = await request(build()).post('/api/contact')
    .set('Origin', ORIGIN).set('Content-Type', 'application/json').send('{"nom":');
  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'bad_request');
});

test('an oversized body is refused', async () => {
  const res = await post(build(), { ...valid, message: 'a'.repeat(20_000) });
  assert.equal(res.status, 413);
  assert.equal(res.body.error, 'too_large');
});

test('the contact route is rate limited per client', async () => {
  const app = build({ rateLimit: { windowMs: 60_000, max: 2 } });
  assert.equal((await post(app, valid)).status, 200);
  assert.equal((await post(app, valid)).status, 200);
  const res = await post(app, valid);
  assert.equal(res.status, 429);
  assert.equal(res.body.error, 'rate_limited');
  assert.equal(sent.length, 2);
});

test('unknown routes return a 404 envelope', async () => {
  const res = await request(build()).get('/api/nope');
  assert.equal(res.status, 404);
  assert.deepEqual(res.body, { success: false, data: null, error: 'not_found' });
});

test('createApp refuses to start without allowed origins or mailer', () => {
  assert.throws(() => createApp({ mailer: { send: async () => {} }, allowedOrigins: [] }), /allowedOrigins/);
  assert.throws(() => createApp({ allowedOrigins: [ORIGIN] }), /mailer/);
});
