'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildMail, createMailer } = require('../src/mailer');

const contact = { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Bonjour,\nun projet à vous proposer.', lang: 'fr' };
const opts = { from: 'contact@titouan-borde.com', to: 'contact@titouan-borde.com' };

test('buildMail sends from the site mailbox and replies to the visitor', () => {
  const mail = buildMail(contact, opts);
  assert.deepEqual(mail.from, { name: 'Portfolio — Ada Lovelace', address: 'contact@titouan-borde.com' });
  assert.equal(mail.to, 'contact@titouan-borde.com');
  assert.deepEqual(mail.replyTo, { name: 'Ada Lovelace', address: 'ada@example.com' });
  assert.equal(mail.subject, 'Nouveau message de Ada Lovelace');
});

test('buildMail carries both an HTML body and a plain-text fallback', () => {
  const { text, html } = buildMail(contact, opts);
  assert.match(text, /Bonjour,\nun projet à vous proposer\./);
  assert.match(html, /^<!DOCTYPE html>/);
  assert.match(html, /Bonjour,<br>un projet à vous proposer\./);
});

test('createMailer forwards the built message to the transport', async () => {
  const sent = [];
  const mailer = createMailer({ sendMail: async (m) => { sent.push(m); return { messageId: '1' }; } }, opts);
  await mailer.send(contact);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].replyTo.address, 'ada@example.com');
});

test('createMailer propagates transport errors', async () => {
  const mailer = createMailer({ sendMail: async () => { throw new Error('SMTP down'); } }, opts);
  await assert.rejects(mailer.send(contact), /SMTP down/);
});

test('createMailer requires from and to', () => {
  assert.throws(() => createMailer({ sendMail: async () => {} }, { from: '', to: 'x@y.z' }), /from/);
  assert.throws(() => createMailer({ sendMail: async () => {} }, { from: 'x@y.z' }), /to/);
});
