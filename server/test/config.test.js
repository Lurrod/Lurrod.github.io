'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadConfig } = require('../src/config');

const env = {
  PORT: '3400',
  MAIL_USER: 'contact@titouan-borde.com',
  MAIL_PASS: 'secret',
  MAIL_TO: 'contact@titouan-borde.com',
  ALLOWED_ORIGINS: 'https://titouan-borde.com, https://www.titouan-borde.com',
};

test('reads a complete environment', () => {
  const c = loadConfig(env);
  assert.equal(c.port, 3400);
  assert.equal(c.host, '127.0.0.1');
  assert.deepEqual(c.smtp, { host: 'ssl0.ovh.net', port: 465, secure: true, auth: { user: 'contact@titouan-borde.com', pass: 'secret' } });
  assert.deepEqual(c.mail, { from: 'contact@titouan-borde.com', to: 'contact@titouan-borde.com' });
  assert.deepEqual(c.allowedOrigins, ['https://titouan-borde.com', 'https://www.titouan-borde.com']);
});

test('SMTP host and port can be overridden', () => {
  const c = loadConfig({ ...env, SMTP_HOST: 'smtp.example.com', SMTP_PORT: '587' });
  assert.equal(c.smtp.host, 'smtp.example.com');
  assert.equal(c.smtp.port, 587);
  assert.equal(c.smtp.secure, false);
});

test('fails fast, naming every missing variable', () => {
  assert.throws(() => loadConfig({ PORT: '3400' }), (err) => {
    for (const name of ['MAIL_USER', 'MAIL_PASS', 'MAIL_TO', 'ALLOWED_ORIGINS']) assert.match(err.message, new RegExp(name));
    return true;
  });
});

test('rejects an invalid port', () => {
  assert.throws(() => loadConfig({ ...env, PORT: 'abc' }), /PORT/);
});

test('rejects an invalid SMTP port', () => {
  assert.throws(() => loadConfig({ ...env, SMTP_PORT: '46x' }), /SMTP_PORT/);
  assert.throws(() => loadConfig({ ...env, SMTP_PORT: '0' }), /SMTP_PORT/);
});
