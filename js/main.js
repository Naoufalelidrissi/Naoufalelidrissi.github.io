/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — NAOUFAL BOUKHACHA ELIDRISSI
   main.js — Navbar · Typed Text · Active Nav · Scroll Logic
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ───────────────────────────────────────────
   1. NAVBAR — scroll effect + toggle mobile
─────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});

// Close menu on link click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

/* ───────────────────────────────────────────
   2. ACTIVE NAV LINK on scroll
─────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

/* ───────────────────────────────────────────
   3. TYPED TEXT EFFECT (Hero)
─────────────────────────────────────────── */
const phrases = [
  'Réseaux Électriques HTA/BT',
  'Courants Forts (CFO)',
  'EMS & SCADA',
  'Maintenance Prédictive',
  'Énergies Renouvelables',
  'Commande FOC & MPPT',
];

const typedEl = document.getElementById('typed-text');
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingSpeed = 65;

function typeEffect() {
  if (!typedEl) return;

  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 35;
  } else {
    typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 65;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    // Pause at end
    typingSpeed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingSpeed = 400;
  }

  setTimeout(typeEffect, typingSpeed);
}

// Start after short delay
setTimeout(typeEffect, 1000);

/* ───────────────────────────────────────────
   4. SMOOTH SCROLL for anchor links
─────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ───────────────────────────────────────────
   5. LANGUAGE BARS ANIMATION
   (triggered when #about enters viewport)
─────────────────────────────────────────── */
const langFills = document.querySelectorAll('.lang-fill');

function animateLangBars() {
  langFills.forEach(fill => {
    fill.style.width = fill.style.getPropertyValue('--fill') || getComputedStyle(fill).getPropertyValue('--fill');
  });
}

const aboutSection = document.getElementById('about');
if (aboutSection) {
  const langObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(animateLangBars, 400);
        langObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  langObserver.observe(aboutSection);
}

/* ───────────────────────────────────────────
   7. MODAL — Ouvrir / Fermer
─────────────────────────────────────────── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('active');
  document.body.classList.add('modal-open');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.classList.remove('modal-open');
}

// Fermer si clic en dehors de la modal-box
function closeModalOutside(event, id) {
  if (event.target.classList.contains('modal-overlay')) {
    closeModal(id);
  }
}

// Fermer avec la touche Echap
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.classList.remove('modal-open');
  }
});
const yearEl = document.querySelector('.footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ───────────────────────────────────────────
   8. CARROUSEL — Fonctions
─────────────────────────────────────────── */
const carouselState = {};

function carouselGoTo(carouselId, index) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const slides  = carousel.querySelectorAll('.carousel-slide');
  const thumbs  = carousel.querySelectorAll('.carousel-thumb');
  const suffix  = carouselId.replace('carousel-', '');
  const counter = document.getElementById('counter-' + suffix);

  const total = slides.length;
  index = ((index % total) + total) % total;
  carouselState[carouselId] = index;

  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
  if (counter) counter.textContent = `${index + 1} / ${total}`;
}

function carouselMove(carouselId, direction) {
  const current = carouselState[carouselId] || 0;
  carouselGoTo(carouselId, current + direction);
}

// Support swipe tactile mobile
function initCarouselSwipe(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  let startX = 0;
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) carouselMove(carouselId, diff > 0 ? 1 : -1);
  }, { passive: true });
}

// Réinitialiser le carrousel à l'image 1 quand on ouvre la modal
const _origOpenModal = openModal;
window.openModal = function(id) {
  _origOpenModal(id);
  const carouselId = 'carousel-' + id.replace('modal-', '');
  carouselGoTo(carouselId, 0);
};

window.addEventListener('DOMContentLoaded', () => {
  ['carousel-eolien', 'carousel-hybride', 'carousel-onduleur', 'carousel-drone'].forEach(id => {
    carouselState[id] = 0;
    initCarouselSwipe(id);
  });
});