'use strict';
const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { validateContact, isSpam } = require('./validate');

// Every response uses the same envelope.
const ok = (data = null) => ({ success: true, data, error: null });
const fail = (error, data = null) => ({ success: false, data, error });

/**
 * @param {object} deps
 * @param {{send: (contact) => Promise}} deps.mailer
 * @param {string[]} deps.allowedOrigins  exact origins allowed to post the form
 * @param {{windowMs: number, max: number}} [deps.rateLimit]
 * @param {{error: Function}} [deps.logger]
 */
function createApp({ mailer, allowedOrigins, rateLimit: limits = { windowMs: 15 * 60_000, max: 5 }, logger = console } = {}) {
  if (!mailer || typeof mailer.send !== 'function') throw new Error('createApp: a mailer is required');
  if (!Array.isArray(allowedOrigins) || !allowedOrigins.length) throw new Error('createApp: allowedOrigins must not be empty');
  const origins = new Set(allowedOrigins);

  const app = express();
  app.disable('x-powered-by');
  // Apache proxies from loopback: trust it so rate limiting sees the visitor's IP.
  app.set('trust proxy', 'loopback');

  app.get('/api/health', (req, res) => res.json(ok({ status: 'ok' })));

  const contactLimiter = rateLimit({
    windowMs: limits.windowMs,
    limit: limits.max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json(fail('rate_limited')),
  });

  // The form only ever posts from the site itself: browsers always send Origin
  // on a cross-site or same-site POST, so a missing or foreign one is refused.
  const sameSiteOnly = (req, res, next) => (
    origins.has(req.get('Origin')) ? next() : res.status(403).json(fail('forbidden_origin'))
  );

  app.post('/api/contact', contactLimiter, sameSiteOnly, express.json({ limit: '10kb' }), async (req, res) => {
    if (isSpam(req.body)) return res.json(ok());

    const result = validateContact(req.body);
    if (!result.ok) return res.status(400).json(fail('invalid', { fields: result.errors }));

    try {
      await mailer.send(result.value);
      return res.json(ok());
    } catch (err) {
      logger.error('[contact] send failed', { message: err.message, code: err.code, ip: req.ip });
      return res.status(502).json(fail('send_failed'));
    }
  });

  app.use((req, res) => res.status(404).json(fail('not_found')));

  // Body-parser errors (malformed JSON, oversized payload) and anything unexpected.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') return res.status(413).json(fail('too_large'));
    if (err.type === 'entity.parse.failed') return res.status(400).json(fail('bad_request'));
    logger.error('[app] unexpected error', { message: err.message, path: req.path });
    return res.status(500).json(fail('server_error'));
  });

  return app;
}

module.exports = { createApp };
