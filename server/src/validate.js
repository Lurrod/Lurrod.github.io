'use strict';

const LIMITS = Object.freeze({ name: 100, email: 254, messageMin: 10, message: 5000 });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Everything below U+0020 except tab and line feed, plus DEL.
const CONTROL_RE = /[\u0000-\u0008\u000B-\u001F\u007F]/g;

const asString = (v) => (typeof v === 'string' ? v : null);

const checkName = (raw) => {
  if (raw === null) return { error: 'Nom requis.' };
  if (/[\r\n]/.test(raw)) return { error: 'Le nom ne peut pas contenir de retour à la ligne.' };
  const name = raw.replace(CONTROL_RE, '').trim();
  if (!name) return { error: 'Nom requis.' };
  if (name.length > LIMITS.name) return { error: `Nom trop long (${LIMITS.name} caractères max).` };
  return { value: name };
};

const checkEmail = (raw) => {
  if (raw === null) return { error: 'Email requis.' };
  const email = raw.trim();
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) return { error: 'Email invalide.' };
  return { value: email };
};

const checkMessage = (raw) => {
  if (raw === null) return { error: 'Message requis.' };
  const message = raw.replace(/\r\n?/g, '\n').replace(CONTROL_RE, '').trim();
  if (message.length < LIMITS.messageMin) return { error: `Message trop court (${LIMITS.messageMin} caractères min).` };
  if (message.length > LIMITS.message) return { error: `Message trop long (${LIMITS.message} caractères max).` };
  return { value: message };
};

/**
 * Validates the contact form payload. Never mutates its input.
 * @returns {{ok: true, value: {name, email, message}} | {ok: false, errors: Object<string,string>}}
 */
function validateContact(body) {
  const src = body && typeof body === 'object' && !Array.isArray(body) ? body : {};
  const checks = {
    nom: checkName(asString(src.nom)),
    email: checkEmail(asString(src.email)),
    message: checkMessage(asString(src.message)),
  };
  const errors = Object.fromEntries(
    Object.entries(checks).filter(([, c]) => c.error).map(([field, c]) => [field, c.error]),
  );
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name: checks.nom.value,
      email: checks.email.value,
      message: checks.message.value,
      lang: src.lang === 'en' ? 'en' : 'fr', // page the form was sent from
    },
  };
}

/** The form carries a hidden "website" field that only bots fill in. */
function isSpam(body) {
  return Boolean(body && typeof body.website === 'string' && body.website.trim());
}

module.exports = { validateContact, isSpam, LIMITS };
