'use strict';

const REQUIRED = ['MAIL_USER', 'MAIL_PASS', 'MAIL_TO', 'ALLOWED_ORIGINS'];

const parsePort = (raw, name) => {
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`Invalid ${name}: ${raw}`);
  return port;
};

/** Reads and validates the environment. Throws once, listing everything missing. */
function loadConfig(env = process.env) {
  const missing = REQUIRED.filter((name) => !env[name] || !env[name].trim());
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);

  const port = parsePort(env.PORT || 3400, 'PORT');
  const smtpPort = parsePort(env.SMTP_PORT || 465, 'SMTP_PORT');
  return {
    port,
    host: '127.0.0.1', // reachable only through the Apache reverse proxy
    smtp: {
      host: env.SMTP_HOST || 'ssl0.ovh.net',
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: env.MAIL_USER.trim(), pass: env.MAIL_PASS },
    },
    mail: { from: env.MAIL_USER.trim(), to: env.MAIL_TO.trim() },
    allowedOrigins: env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
  };
}

module.exports = { loadConfig };
