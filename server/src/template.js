'use strict';

// Palette of the site (DA "Biomorphic Glow"). Email clients ignore CSS
// variables and most <style> rules, so every style below is inline.
const C = Object.freeze({
  void: '#050505', surface: '#101010', elevated: '#151517',
  ivory: '#F7F5F2', dim: '#9C9A97', faint: '#6B6A68',
  lavender: '#BFA8FF', paleblue: '#A8D9FF', cream: '#FFF2E4',
  line: '#1E1E21',
});
const FONT = "'Hanken Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif";
const PREHEADER_MAX = 140;

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Everything the visitor typed goes through this before reaching the HTML. */
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ENTITIES[ch]);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'long', timeStyle: 'short' }).format(date);
}

const versionLabel = (lang) => (lang === 'en' ? 'version anglaise' : 'version française');

const preheaderOf = (message) => {
  const flat = message.replace(/\s+/g, ' ').trim();
  return flat.length > PREHEADER_MAX ? `${flat.slice(0, PREHEADER_MAX)}…` : flat;
};

const firstName = (name) => name.split(/\s+/)[0];

/**
 * @param {{name: string, email: string, message: string, lang: string}} contact  validated input
 * @param {Date} date
 * @returns {string} full HTML document
 */
function renderHtml({ name, email, message, lang }, date) {
  const n = escapeHtml(name);
  const e = escapeHtml(email);
  const body = escapeHtml(message).replace(/\n/g, '<br>');
  const reply = `mailto:${e}?subject=${encodeURIComponent('Re: votre message sur titouan-borde.com')}`;
  const meta = `${escapeHtml(formatDate(date))} · ${versionLabel(lang)}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>Nouveau message de ${n}</title>
</head>
<body style="margin:0;padding:0;background:${C.void};">
<div class="preheader" style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.void};">${escapeHtml(preheaderOf(message))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.void}" style="background:${C.void};">
  <tr><td align="center" style="padding:48px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;font-family:${FONT};">

      <tr><td style="padding:0 8px 22px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:${C.faint};">
        Titouan Borde &nbsp;·&nbsp; Portfolio
      </td></tr>

      <tr><td bgcolor="${C.surface}" style="background:${C.surface};border:1px solid ${C.line};border-radius:24px;overflow:hidden;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td height="2" bgcolor="${C.lavender}" style="height:2px;line-height:2px;font-size:0;background:${C.lavender};background-image:linear-gradient(90deg,${C.paleblue},${C.lavender} 50%,${C.cream});">&nbsp;</td></tr>
          <tr><td style="padding:40px 36px 12px;">
            <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:${C.lavender};">Nouveau message</div>
            <div style="margin-top:14px;font-size:30px;line-height:1.15;font-weight:300;letter-spacing:-.01em;color:${C.ivory};">${n}</div>
            <div style="margin-top:8px;font-size:15px;"><a href="mailto:${e}" style="color:${C.paleblue};text-decoration:none;">${e}</a></div>
            <div style="margin-top:6px;font-size:12px;letter-spacing:.04em;color:${C.faint};">${meta}</div>
          </td></tr>
          <tr><td style="padding:22px 36px 8px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td bgcolor="${C.elevated}" style="background:${C.elevated};border-radius:18px;padding:26px 26px;font-size:15px;line-height:1.75;color:${C.ivory};">${body}</td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:28px 36px 40px;">
            <a href="${reply}" style="display:inline-block;padding:14px 28px;border-radius:44px;background:${C.ivory};color:${C.void};font-size:14px;font-weight:500;letter-spacing:.04em;text-decoration:none;">Répondre à ${escapeHtml(firstName(name))} &nbsp;→</a>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:22px 8px 0;font-size:12px;line-height:1.7;color:${C.faint};">
        Répondre à ce mail écrit directement à ${n}.<br>
        Envoyé depuis le formulaire de contact de <a href="https://titouan-borde.com" style="color:${C.dim};text-decoration:none;">titouan-borde.com</a>.
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/** Plain-text fallback for clients that do not render HTML. */
function renderText({ name, email, message, lang }, date) {
  return [
    'NOUVEAU MESSAGE — titouan-borde.com',
    '',
    `Nom   : ${name}`,
    `Email : ${email}`,
    `Reçu  : ${formatDate(date)} (${versionLabel(lang)})`,
    '',
    message,
    '',
    '—',
    `Répondre à ce mail écrit directement à ${name}.`,
  ].join('\n');
}

module.exports = { escapeHtml, formatDate, renderHtml, renderText };
