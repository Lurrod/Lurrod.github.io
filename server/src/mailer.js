'use strict';
const { renderHtml, renderText } = require('./template');

/**
 * Builds the outgoing message. Sent from the site mailbox (the SMTP server
 * only relays its own address), with the visitor as Reply-To so answering
 * from the inbox goes straight back to them. The HTML body escapes all
 * visitor input (see template.js); a plain-text version is always attached.
 */
function buildMail(contact, { from, to, date = new Date() }) {
  return {
    from: { name: `Portfolio — ${contact.name}`, address: from },
    to,
    replyTo: { name: contact.name, address: contact.email },
    subject: `Nouveau message de ${contact.name}`,
    text: renderText(contact, date),
    html: renderHtml(contact, date),
  };
}

/** Wraps a nodemailer-compatible transport ({ sendMail }) into { send(contact) }. */
function createMailer(transport, { from, to } = {}) {
  if (!from) throw new Error('createMailer: "from" is required');
  if (!to) throw new Error('createMailer: "to" is required');
  return {
    send: (contact) => transport.sendMail(buildMail(contact, { from, to })),
  };
}

module.exports = { buildMail, createMailer };
