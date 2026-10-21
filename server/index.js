'use strict';
const nodemailer = require('nodemailer');
const { loadConfig } = require('./src/config');
const { createMailer } = require('./src/mailer');
const { createApp } = require('./src/app');

let config;
try {
  config = loadConfig();
} catch (err) {
  console.error(`[portfolio-api] ${err.message}`);
  process.exit(1);
}

const transport = nodemailer.createTransport({ ...config.smtp, tls: { rejectUnauthorized: true } });
const app = createApp({ mailer: createMailer(transport, config.mail), allowedOrigins: config.allowedOrigins });

const server = app.listen(config.port, config.host, () => {
  console.error(`[portfolio-api] listening on ${config.host}:${config.port}`);
  // Surface bad SMTP credentials at boot rather than on the first visitor's message.
  transport.verify().catch((err) => console.error('[portfolio-api] SMTP check failed:', err.message));
});

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
