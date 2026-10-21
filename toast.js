/* Toasts — success / error / info notifications in the site's DA.
   Usage: toast({ type: 'success' | 'error' | 'info', title, message, duration })
   The thin light bar at the bottom is the timer: it pauses while the toast is
   hovered or focused, and the toast leaves when it runs out. */
(function () {
  'use strict';
  const MAX_VISIBLE = 3;
  const DURATION = { success: 5000, info: 6000, error: 8000 };
  const LEAVE_MS = 350;
  const reduceMo = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const closeLabel = (document.documentElement.lang || 'fr').toLowerCase().startsWith('en') ? 'Close' : 'Fermer';
  const CLOSE_ICON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  // The live region exists before any toast so screen readers announce additions.
  const region = document.createElement('div');
  region.className = 'toasts';
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-relevant', 'additions');
  document.body.append(region);

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const dismiss = (node) => {
    if (node.classList.contains('out')) return;
    node.classList.add('out');
    setTimeout(() => node.remove(), LEAVE_MS);
  };

  const build = (type, title, message, ms) => {
    const node = el('div', 'toast ' + type);
    node.setAttribute('role', type === 'error' ? 'alert' : 'status');
    node.style.setProperty('--d', ms + 'ms');

    const body = el('div', 'toast-body');
    body.append(el('p', 'toast-title', title));
    if (message) body.append(el('p', 'toast-msg', message));

    const close = el('button', 'toast-x');
    close.type = 'button';
    close.setAttribute('aria-label', closeLabel);
    close.innerHTML = CLOSE_ICON;
    close.addEventListener('click', () => dismiss(node));

    node.append(el('span', 'toast-orb'), body, close);
    if (ms > 0) node.append(el('span', 'toast-bar'));
    return node;
  };

  function toast({ type = 'info', title = '', message = '', duration } = {}) {
    const kind = Object.prototype.hasOwnProperty.call(DURATION, type) ? type : 'info';
    const ms = typeof duration === 'number' ? duration : DURATION[kind];
    const node = build(kind, title, message, ms);
    region.append(node);

    const live = [...region.children].filter(n => !n.classList.contains('out'));
    live.slice(0, Math.max(0, live.length - MAX_VISIBLE)).forEach(dismiss);

    requestAnimationFrame(() => requestAnimationFrame(() => node.classList.add('in')));
    if (ms > 0) {
      // Reduced motion disables the bar's animation, so fall back to a plain timer.
      if (reduceMo) setTimeout(() => dismiss(node), ms);
      else node.querySelector('.toast-bar').addEventListener('animationend', () => dismiss(node));
    }
    return { dismiss: () => dismiss(node) };
  }

  window.toast = toast;
})();
