/* ══════════════════════════════════════════════════
   KINETIC STUDIO — Titouan Borde Portfolio Script
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════
     DOT GRID — Generative Background
     ════════════════════════════════ */
  const canvas = document.getElementById('dotGrid');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, cols, rows;
    const spacing = 40;
    const dotBase = 1.2;
    const interactRadius = 150;
    let mouseX = -9999, mouseY = -9999;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cols = Math.ceil(W / spacing) + 1;
      rows = Math.ceil(H / spacing) + 1;
    }

    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      mouseX = -9999;
      mouseY = -9999;
    });

    function getAccentColor() {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const accent = getAccentColor();

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * spacing;
          const y = r * spacing;
          const dx = mouseX - x;
          const dy = mouseY - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let radius = dotBase;
          let alpha = 0.15;

          if (dist < interactRadius) {
            const t = 1 - dist / interactRadius;
            radius = dotBase + t * 3;
            alpha = 0.15 + t * 0.6;
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = accent;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    draw();
  }

  /* ════════════════════════════════
     SCROLL PROGRESS BAR
     ════════════════════════════════ */
  const scrollBar = document.getElementById('scrollProgress');
  function updateProgress() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    if (scrollBar) scrollBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ════════════════════════════════
     NAV — Scroll Effects
     ════════════════════════════════ */
  const nav = document.getElementById('topnav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  function updateNav() {
    // Scrolled state
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }

    // Active link
    let current = '';
    sections.forEach(s => {
      const top = s.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.4) current = s.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ════════════════════════════════
     SCROLL REVEAL ANIMATIONS
     ════════════════════════════════ */
  const reveals = document.querySelectorAll('.anim-reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObs.observe(el));

  /* ════════════════════════════════
     MAGNETIC BUTTON EFFECT
     ════════════════════════════════ */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.25;
        const dy = (e.clientY - cy) * 0.25;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    });
  }

  /* ════════════════════════════════
     THEME TOGGLE
     ════════════════════════════════ */
  const themeBtn = document.getElementById('toggleTheme');
  if (themeBtn) {
    // Check saved preference
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.body.classList.add('light-theme');
      themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      themeBtn.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  /* ════════════════════════════════
     HERO TEXT — Scramble Animation
     ════════════════════════════════ */
  const roleLine = document.querySelector('.visual-code');
  if (roleLine) {
    const codeLines = roleLine.querySelectorAll('.code-line');
    codeLines.forEach((line, i) => {
      line.style.opacity = '0';
      line.style.transform = 'translateX(-10px)';
      line.style.transition = `all 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${0.8 + i * 0.15}s`;
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transform = 'translateX(0)';
      }, 100);
    });
  }

  /* ════════════════════════════════
     CONTACT FORM — EmailJS
     ════════════════════════════════ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('.btn-submit');
      const btnText = btn.querySelector('.btn-text');
      const btnIcon = btn.querySelector('.btn-icon');
      const originalText = btnText.textContent;
      const originalIcon = btnIcon.innerHTML;

      btnText.textContent = 'Envoi en cours...';
      btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      emailjs.sendForm('service_4a3pj9b', 'template_j71c1xs', this)
        .then(() => {
          btnText.textContent = 'Message envoyé !';
          btnIcon.innerHTML = '<i class="fas fa-check"></i>';
          btn.style.background = '#10b981';
          btn.style.opacity = '1';
          this.reset();
          setTimeout(() => {
            btnText.textContent = originalText;
            btnIcon.innerHTML = originalIcon;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        }, () => {
          btnText.textContent = 'Erreur, réessayez';
          btnIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
          btn.style.background = '#ef4444';
          btn.style.opacity = '1';
          setTimeout(() => {
            btnText.textContent = originalText;
            btnIcon.innerHTML = originalIcon;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        });
    });
  }

  /* ════════════════════════════════
     SMOOTH SCROLL for nav links
     ════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ════════════════════════════════
     PROJECT CARDS — Tilt on hover
     ════════════════════════════════ */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.project-card, .project-featured, .project-card-v2').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const intensity = card.classList.contains('project-featured') ? 2 : 5;
        card.style.transform = `
          perspective(800px)
          rotateY(${x * intensity}deg)
          rotateX(${-y * intensity}deg)
          translateY(-${card.classList.contains('project-card-v2') ? 6 : 0}px)
        `;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => { card.style.transition = ''; }, 600);
      });
    });
  }

  /* ════════════════════════════════
     STAT COUNTERS — Animate on scroll
     ════════════════════════════════ */
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  if (statNumbers.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1200;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObs.observe(el));
  }

  /* ════════════════════════════════
     SKILL NODES — Float animation
     ════════════════════════════════ */
  document.querySelectorAll('.skill-node').forEach((node, i) => {
    const offset = i * 1.5;
    node.style.animation = `nodeFloat ${4 + i * 0.5}s ease-in-out ${offset}s infinite`;
  });

  // Add floating keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes nodeFloat {
      0%, 100% { margin-top: 0; }
      50% { margin-top: -8px; }
    }
  `;
  document.head.appendChild(style);

  /* ════════════════════════════════
     KEYBOARD NAV
     ════════════════════════════════ */
  document.addEventListener('keydown', e => {
    const sects = document.querySelectorAll('.section');
    let idx = Array.from(sects).findIndex(s => {
      const r = s.getBoundingClientRect();
      return r.top >= 0 && r.top < window.innerHeight;
    });
    if (e.key === 'ArrowDown' && idx < sects.length - 1) {
      e.preventDefault();
      sects[idx + 1].scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' && idx > 0) {
      e.preventDefault();
      sects[idx - 1].scrollIntoView({ behavior: 'smooth' });
    }
  });

});
