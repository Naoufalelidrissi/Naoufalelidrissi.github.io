/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — NAOUFAL BOUKHACHA ELIDRISSI
   animations.js — Scroll Reveal · Stagger · Micro-interactions
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ───────────────────────────────────────────
   1. SCROLL REVEAL — IntersectionObserver
─────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on element index within its parent
      const siblings = Array.from(entry.target.parentElement.children);
      const index    = siblings.indexOf(entry.target);
      const delay    = Math.min(index * 80, 400); // max 400ms stagger

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px',
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ───────────────────────────────────────────
   2. COUNTER ANIMATION for stat cards
─────────────────────────────────────────── */
function animateCounter(el, target, suffix = '') {
  const duration = 1200;
  const start    = performance.now();

  function update(timestamp) {
    const elapsed  = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numberEl = entry.target.querySelector('.stat-number');
      if (numberEl) {
        const raw    = numberEl.textContent.trim();
        const num    = parseInt(raw);
        const suffix = raw.replace(/[0-9]/g, '');
        animateCounter(numberEl, num, suffix);
      }
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
  statObserver.observe(card);
});

/* ───────────────────────────────────────────
   3. TIMELINE DOTS — pulse on reveal
─────────────────────────────────────────── */
const timelineDotObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('dot-active');
      timelineDotObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.8 });

document.querySelectorAll('.timeline-dot').forEach(dot => {
  timelineDotObserver.observe(dot);
});

/* ───────────────────────────────────────────
   4. SKILL TAGS — staggered pop-in
─────────────────────────────────────────── */
const skillCatObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const tags = entry.target.querySelectorAll('.skill-tags span');
      tags.forEach((tag, i) => {
        setTimeout(() => {
          tag.classList.add('tag-visible');
        }, i * 60);
      });
      skillCatObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => {
  skillCatObserver.observe(cat);
});

/* ───────────────────────────────────────────
   5. AWARD CARDS — bounce-in on scroll
─────────────────────────────────────────── */
const awardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.award-card');
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('award-visible'), i * 100);
      });
      awardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const awardsGrid = document.querySelector('.awards-grid');
if (awardsGrid) awardObserver.observe(awardsGrid);

/* ───────────────────────────────────────────
   6. HERO — stagger reveal on load
─────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  const heroReveals = document.querySelectorAll('.section-hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 150);
  });
});

/* ───────────────────────────────────────────
   7. MAGNETIC BUTTONS (subtle pull effect)
─────────────────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect   = btn.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width  / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    const factor = 0.25;
    btn.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ───────────────────────────────────────────
   8. PROJECT CARDS — tilt effect on hover
─────────────────────────────────────────── */
document.querySelectorAll('.project-card, .exp-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - 0.5;
    const y      = (e.clientY - rect.top)  / rect.height - 0.5;
    const tiltX  = y * -6;
    const tiltY  = x *  6;
    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
    setTimeout(() => { card.style.transition = ''; }, 400);
  });
}); 