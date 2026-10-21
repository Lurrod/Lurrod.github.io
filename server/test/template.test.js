'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { escapeHtml, renderHtml, renderText, formatDate } = require('../src/template');

const contact = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Bonjour,\nun projet à vous proposer.\n\nÀ bientôt',
  lang: 'fr',
};
const date = new Date('2026-10-22T08:05:00Z');

test('escapeHtml neutralises every HTML-significant character', () => {
  assert.equal(escapeHtml(`<script>alert("x")</script> & 'y'`),
    '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;');
});

test('formatDate renders Paris time in French', () => {
  assert.match(formatDate(date), /22 octobre 2026/);
  assert.match(formatDate(date), /10:05/);
});

test('renderHtml shows the name, a mailto link and the message', () => {
  const html = renderHtml(contact, date);
  assert.match(html, /Ada Lovelace/);
  assert.match(html, /href="mailto:ada@example\.com"/);
  assert.match(html, /un projet à vous proposer\./);
  assert.match(html, /22 octobre 2026/);
});

test('renderHtml keeps the visitor line breaks', () => {
  const html = renderHtml(contact, date);
  assert.match(html, /Bonjour,<br>un projet à vous proposer\.<br><br>À bientôt/);
});

test('renderHtml escapes everything the visitor typed', () => {
  const html = renderHtml({
    name: '<img src=x onerror=alert(1)>',
    email: 'a"b@example.com',
    message: '<script>steal()</script>',
    lang: 'fr',
  }, date);
  assert.doesNotMatch(html, /<script>steal/);
  assert.doesNotMatch(html, /<img src=x/);
  assert.match(html, /&lt;script&gt;steal\(\)&lt;\/script&gt;/);
  assert.match(html, /mailto:a&quot;b@example\.com/);
});

test('renderHtml includes a hidden preview line from the message', () => {
  const html = renderHtml({ ...contact, message: 'Premier\nmot ' + 'x'.repeat(300) }, date);
  const preheader = html.match(/<div class="preheader"[^>]*>([^<]*)<\/div>/);
  assert.ok(preheader, 'preheader present');
  assert.match(preheader[1], /^Premier mot x+…$/);
  assert.ok(preheader[1].length <= 141);
});

test('renderHtml says which version of the site the message came from', () => {
  assert.match(renderHtml({ ...contact, lang: 'en' }, date), /version anglaise/);
  assert.match(renderHtml(contact, date), /version française/);
});

test('renderText is a complete plain-text fallback', () => {
  const text = renderText(contact, date);
  assert.match(text, /Ada Lovelace/);
  assert.match(text, /ada@example\.com/);
  assert.match(text, /Bonjour,\nun projet à vous proposer\.\n\nÀ bientôt/);
  assert.match(text, /22 octobre 2026/);
  assert.match(text, /version française/);
});
