'use strict';

/**
 * Builds the outgoing message. Sent from the site mailbox (the SMTP server
 * only relays its own address), with the visitor as Reply-To so answering
 * from the inbox goes straight back to them. Plain text only: nothing the
 * visitor typed is ever interpreted as HTML.
 */
function buildMail({ name, email, message }, { from, to }) {
  return {
    from: { name: `Portfolio — ${name}`, address: from },
    to,
    replyTo: { name, address: email },
    subject: `Nouveau message de ${name}`,
    text: [
      `Nom   : ${name}`,
      `Email : ${email}`,
      '',
      message,
      '',
      '—',
      'Envoyé depuis le formulaire de contact de titouan-borde.com',
    ].join('\n'),
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
