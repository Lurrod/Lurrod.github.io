'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateContact, isSpam, LIMITS } = require('../src/validate');

const valid = { nom: 'Ada Lovelace', email: 'ada@example.com', message: 'Bonjour, un projet à vous proposer.' };

test('accepts a well-formed message and returns trimmed values', () => {
  const r = validateContact({ nom: '  Ada  ', email: ' ADA@Example.com ', message: '  Bonjour, un projet à vous proposer.  ' });
  assert.equal(r.ok, true);
  assert.deepEqual(r.value, { name: 'Ada', email: 'ADA@Example.com', message: 'Bonjour, un projet à vous proposer.', lang: 'fr' });
});

test('lang is "en" only when explicitly sent, "fr" otherwise', () => {
  assert.equal(validateContact({ ...valid, lang: 'en' }).value.lang, 'en');
  assert.equal(validateContact({ ...valid, lang: 'de' }).value.lang, 'fr');
  assert.equal(validateContact({ ...valid, lang: ['en'] }).value.lang, 'fr');
  assert.equal(validateContact(valid).value.lang, 'fr');
});

test('does not mutate its input', () => {
  const input = { ...valid, nom: '  Ada  ' };
  validateContact(input);
  assert.equal(input.nom, '  Ada  ');
});

test('rejects a missing or non-object body', () => {
  for (const body of [undefined, null, 'x', 42, []]) {
    const r = validateContact(body);
    assert.equal(r.ok, false);
    assert.ok(r.errors.nom && r.errors.email && r.errors.message);
  }
});

test('rejects non-string fields', () => {
  const r = validateContact({ nom: 12, email: ['a@b.co'], message: { x: 1 } });
  assert.equal(r.ok, false);
  assert.deepEqual(Object.keys(r.errors).sort(), ['email', 'message', 'nom']);
});

test('rejects an empty name and a name over the limit', () => {
  assert.ok(validateContact({ ...valid, nom: '   ' }).errors.nom);
  assert.ok(validateContact({ ...valid, nom: 'a'.repeat(LIMITS.name + 1) }).errors.nom);
});

test('rejects line breaks in the name (header injection)', () => {
  assert.ok(validateContact({ ...valid, nom: 'Ada\r\nBcc: x@evil.com' }).errors.nom);
});

test('rejects malformed emails', () => {
  for (const email of ['', 'ada', 'ada@', '@example.com', 'ada@example', 'a b@example.com', 'ada@example.com\nBcc: x@y.z']) {
    assert.ok(validateContact({ ...valid, email }).errors.email, `should reject ${JSON.stringify(email)}`);
  }
});

test('rejects an email over the limit', () => {
  const email = 'a'.repeat(LIMITS.email) + '@example.com';
  assert.ok(validateContact({ ...valid, email }).errors.email);
});

test('rejects a message that is too short or too long', () => {
  assert.ok(validateContact({ ...valid, message: 'court' }).errors.message);
  assert.ok(validateContact({ ...valid, message: 'a'.repeat(LIMITS.message + 1) }).errors.message);
});

test('keeps line breaks in the message but strips other control characters', () => {
  const r = validateContact({ ...valid, message: 'Ligne un\nLigne deux\u0000\u0007 fin du message' });
  assert.equal(r.ok, true);
  assert.equal(r.value.message, 'Ligne un\nLigne deux fin du message');
});

test('isSpam flags a filled honeypot only', () => {
  assert.equal(isSpam({ ...valid, website: 'http://spam.example' }), true);
  assert.equal(isSpam({ ...valid, website: '' }), false);
  assert.equal(isSpam(valid), false);
  assert.equal(isSpam(null), false);
});
