/* Titouan Borde — portfolio interactions (shared FR / EN) */
(function () {
  'use strict';
  const lang = (document.documentElement.lang || 'fr').toLowerCase();
  const isEN = lang.startsWith('en');
  const T = isEN
    ? { sending: 'Sending…', ok: "Message sent — thanks, I'll get back to you soon.", err: 'Something went wrong. Please retry or email me directly.' }
    : { sending: 'Envoi en cours…', ok: 'Message envoyé — merci, je vous réponds vite.', err: 'Une erreur est survenue. Réessayez ou écrivez-moi directement.' };

  const reduceMo = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Hero reveals immediately */
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('in'));

  /* Nav: scroll state, active link, glow parallax (glows cross left↔right by scroll progress) */
  const nav = document.getElementById('nav');
  const links = [...document.querySelectorAll('.nav-links a')];
  const ids = links.map(a => (a.getAttribute('href') || '').replace('#', '')).filter(Boolean);
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  const plls = [...document.querySelectorAll('.pll')];

  addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', scrollY > 40);
    let cur = ids[0];
    for (const s of sections) { if (scrollY >= s.offsetTop - 160) cur = s.id; }
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) cur = ids[ids.length - 1];
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
    if (!reduceMo && plls.length) {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const prog = Math.min(1, scrollY / max), dist = innerWidth * 0.78;
      plls.forEach(p => { p.style.transform = 'translate3d(' + (p.dataset.dir * prog * dist) + 'px,0,0)'; });
    }
  }, { passive: true });

  /* Mobile menu */
  const burger = document.getElementById('burger');
  if (burger && nav) burger.addEventListener('click', () => nav.classList.toggle('open'));
  links.forEach(a => a.addEventListener('click', () => nav && nav.classList.remove('open')));

  /* Reveal on scroll */
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));

  /* Stat counters */
  const counted = new WeakSet();
  const cio = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (!e.isIntersecting || counted.has(e.target)) return;
      counted.add(e.target);
      const el = e.target, target = +el.dataset.count; let n = 0;
      const step = Math.max(1, Math.round(target / 48));
      const tm = setInterval(() => { n += step; if (n >= target) { n = target; clearInterval(tm); } el.textContent = n; }, 22);
    });
  }, { threshold: .6 });
  document.querySelectorAll('.stat b[data-count]').forEach(el => cio.observe(el));

  /* Hero forms — independent parallax per shape */
  const hfs = [...document.querySelectorAll('.hf')];
  if (hfs.length && !reduceMo) {
    addEventListener('pointermove', (e) => {
      const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
      hfs.forEach(el => { const d = +el.dataset.depth; el.style.transform = 'translate3d(' + (x * d) + 'px,' + (y * d) + 'px,0)'; });
    }, { passive: true });
  }

  /* Footer signature — the inner light follows the pointer with an eased lag */
  const sign = document.querySelector('.foot-sign');
  if (sign && !reduceMo && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const rest = { x: 50, y: 35, i: .55 };
    let target = rest, cur = rest, raf = 0;
    const tick = () => {
      cur = { x: cur.x + (target.x - cur.x) * .07, y: cur.y + (target.y - cur.y) * .07, i: cur.i + (target.i - cur.i) * .05 };
      sign.style.setProperty('--gx', cur.x + '%');
      sign.style.setProperty('--gy', cur.y + '%');
      sign.style.setProperty('--gi', cur.i);
      const settled = Math.abs(target.x - cur.x) < .05 && Math.abs(target.y - cur.y) < .05 && Math.abs(target.i - cur.i) < .002;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const run = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const foot = sign.closest('footer');
    foot.addEventListener('pointermove', (e) => {
      const r = sign.getBoundingClientRect();
      target = { x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100, i: 1 };
      run();
    }, { passive: true });
    foot.addEventListener('pointerleave', () => { target = rest; run(); });
  }

  /* Contact form — EmailJS */
  if (window.emailjs) {
    emailjs.init('9QItNZ3bWwbMtdqwc');
    const form = document.getElementById('contactForm');
    if (form) {
      const status = document.getElementById('formStatus');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const label = btn.querySelector('.bt');
        const original = label.textContent;
        btn.disabled = true; label.textContent = T.sending;
        status.className = 'form-status'; status.textContent = '';
        emailjs.sendForm('service_4a3pj9b', 'template_j71c1xs', this)
          .then(() => { status.className = 'form-status ok'; status.textContent = T.ok; form.reset(); label.textContent = original; btn.disabled = false; })
          .catch(() => { status.className = 'form-status err'; status.textContent = T.err; label.textContent = original; btn.disabled = false; });
      });
    }
  }
})();
