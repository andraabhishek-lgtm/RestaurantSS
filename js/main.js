/* ============================================================
   ÉCLAT FINE DINING — MAIN JAVASCRIPT
   ============================================================ */

'use strict';

/* ─── Utility Helpers ────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on  = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

/* ─── DOM Ready ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initLenis();
  initAOS();
  initNavbar();
  initMobileMenu();
  initCursor();
  initScrollProgress();
  initBackToTop();
  initAccordions();
  initTabs();
  initForms();
  initCountUp();
  initTyped();
  initParticles();
  initGSAP();
  initToastSystem();
});

/* ─── Loader ─────────────────────────────────────────────── */
function initLoader() {
  const loader = qs('#loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 800);
  });
  setTimeout(() => loader.classList.add('hidden'), 3000);
}

/* ─── Lenis Smooth Scroll ────────────────────────────────── */
let lenisInstance;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });
  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (typeof ScrollTrigger !== 'undefined') {
    lenisInstance.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
  }
}

/* ─── AOS ────────────────────────────────────────────────── */
function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
    delay: 0,
  });
}

/* ─── GSAP Animations ────────────────────────────────────── */
function initGSAP() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero content stagger
  const heroEls = qsa('.gsap-hero-item');
  if (heroEls.length) {
    gsap.from(heroEls, {
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.3,
    });
  }

  // Section reveals
  qsa('.gsap-reveal').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });
  });

  // Gold line decoration
  qsa('.gold-line').forEach(line => {
    gsap.from(line, {
      scrollTrigger: { trigger: line, start: 'top 90%' },
      scaleX: 0,
      transformOrigin: 'left',
      duration: 1.2,
      ease: 'power4.out',
    });
  });

  // Parallax BG images
  qsa('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.3;
    gsap.to(el, {
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      y: `${speed * 120}%`,
      ease: 'none',
    });
  });

  // Float animation for floating cards
  qsa('.gsap-float').forEach((el, i) => {
    gsap.to(el, {
      y: -16,
      duration: 2.5 + i * 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.8,
    });
  });
}

/* ─── Navbar ─────────────────────────────────────────────── */
function initNavbar() {
  const navbar = qs('#navbar');
  if (!navbar) return;

  const updateNav = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  // Active link
  const links = qsa('.nav-link');
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ─── Mobile Menu ────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = qs('.hamburger');
  const mobileMenu = qs('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  qsa('.mobile-menu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ─── Custom Cursor ──────────────────────────────────────── */
function initCursor() {
  if (window.innerWidth < 1025) return;
  const dot  = qs('.cursor-dot');
  const ring = qs('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  (function animRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animRing);
  })();

  qsa('a,button,[data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expand'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
  });
}

/* ─── Scroll Progress Bar ────────────────────────────────── */
function initScrollProgress() {
  const bar = qs('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    bar.style.transform = `scaleX(${pct})`;
  }, { passive: true });
}

/* ─── Back to Top ────────────────────────────────────────── */
function initBackToTop() {
  const btn = qs('#backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => {
    if (lenisInstance) lenisInstance.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── Accordions (FAQ) ───────────────────────────────────── */
function initAccordions() {
  qsa('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      qsa('.accordion-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ─── Tabs ───────────────────────────────────────────────── */
function initTabs() {
  qsa('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-tabs]');
      if (!group) return;
      const target = btn.dataset.tab;
      qsa('.tab-btn', group).forEach(b => b.classList.remove('active'));
      qsa('.tab-content', group).forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const content = qs(`[data-tab-content="${target}"]`, group);
      if (content) content.classList.add('active');
    });
  });
}

/* ─── Form Helpers ───────────────────────────────────────── */
function initForms() {
  // Password toggle
  qsa('.pwd-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = qs('input', btn.closest('.input-icon-wrap'));
      if (!input) return;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.innerHTML = isText
        ? '<i class="fa-regular fa-eye"></i>'
        : '<i class="fa-regular fa-eye-slash"></i>';
    });
  });

  // Password strength
  const pwdInput = qs('#password, #signup-password');
  if (pwdInput) {
    pwdInput.addEventListener('input', () => {
      updatePasswordStrength(pwdInput.value);
    });
  }

  // Reservation date min
  const dateInput = qs('#res-date, #reservation-date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Newsletter forms
  qsa('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = qs('input[type="email"]', form);
      if (input?.value) {
        showToast('Thank you! You\'re now subscribed to ÉCLAT updates.', 'success');
        input.value = '';
      }
    });
  });

  // Contact form
  const contactForm = qs('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Your message has been sent. We\'ll respond within 24 hours.', 'success');
      contactForm.reset();
    });
  }

  // Reservation form
  const resForm = qs('#reservation-form');
  if (resForm) {
    resForm.addEventListener('submit', e => {
      e.preventDefault();
      showReservationSuccess();
    });
  }
}

function updatePasswordStrength(val) {
  const bars = qsa('.pwd-strength-bar');
  if (!bars.length) return;
  let strength = 0;
  if (val.length >= 8) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++;

  bars.forEach((bar, i) => {
    bar.classList.remove('weak', 'medium', 'strong');
    if (i < strength) {
      if (strength <= 1) bar.classList.add('weak');
      else if (strength <= 3) bar.classList.add('medium');
      else bar.classList.add('strong');
    }
  });
  const label = qs('#pwd-strength-label');
  if (label) {
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    label.textContent = labels[strength] || '';
    label.className = `text-xs font-medium ${strength <= 1 ? 'text-red-400' : strength <= 3 ? 'text-yellow-400' : 'text-green-400'}`;
  }
}

function showReservationSuccess() {
  const form = qs('#reservation-form');
  const success = qs('#reservation-success');
  if (form) form.style.display = 'none';
  if (success) success.style.display = 'flex';
  showToast('Reservation confirmed! Check your email for details.', 'success');
}

/* ─── CountUp ────────────────────────────────────────────── */
function initCountUp() {
  if (typeof CountUp === 'undefined') return;
  const counters = qsa('[data-countup]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const val = parseFloat(el.dataset.countup);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const decimals = (val % 1 !== 0) ? 1 : 0;
        const cu = new CountUp(el, val, {
          startVal: 0,
          duration: 2.5,
          prefix,
          suffix,
          decimalPlaces: decimals,
          useEasing: true,
        });
        cu.start();
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ─── Typed.js ───────────────────────────────────────────── */
function initTyped() {
  const typedEl = qs('#typed-text');
  if (!typedEl || typeof Typed === 'undefined') return;
  new Typed('#typed-text', {
    strings: typedEl.dataset.strings
      ? JSON.parse(typedEl.dataset.strings)
      : ['Fine Dining', 'Unforgettable Moments', 'Culinary Art'],
    typeSpeed: 60,
    backSpeed: 35,
    backDelay: 2200,
    loop: true,
    cursorChar: '|',
  });
}

/* ─── Particles ──────────────────────────────────────────── */
function initParticles() {
  const containers = qsa('.particles-bg');
  containers.forEach(container => {
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        width:${1 + Math.random() * 2}px;
        height:${1 + Math.random() * 2}px;
        animation-duration:${6 + Math.random() * 10}s;
        animation-delay:${Math.random() * 8}s;
        opacity:${0.1 + Math.random() * 0.4};
      `;
      container.appendChild(p);
    }
  });
}

/* ─── Toast System ───────────────────────────────────────── */
function initToastSystem() {
  if (!qs('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message, type = 'info', duration = 4000) {
  const container = qs('.toast-container');
  if (!container) return;
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  const colors = { success: '#34D399', error: '#F87171', info: '#C9A84C' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${icons[type]}" style="color:${colors[type]};font-size:1.1rem;flex-shrink:0"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
window.showToast = showToast;

/* ─── Lightbox ───────────────────────────────────────────── */
function initLightbox() {
  const lightbox = qs('#lightbox');
  if (!lightbox) return;
  const img  = qs('#lightbox-img', lightbox);
  const close = qs('.lightbox-close', lightbox);
  const prev  = qs('.lightbox-prev', lightbox);
  const next  = qs('.lightbox-next', lightbox);
  let items = [], currentIdx = 0;

  qsa('[data-lightbox]').forEach((el, i) => {
    el.addEventListener('click', () => {
      items = qsa('[data-lightbox]');
      currentIdx = i;
      openLightbox(items[i].dataset.lightbox || items[i].src || qs('img', items[i])?.src);
    });
  });

  function openLightbox(src) {
    img.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  close?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  prev?.addEventListener('click', () => {
    currentIdx = (currentIdx - 1 + items.length) % items.length;
    img.src = items[currentIdx].dataset.lightbox || qs('img', items[currentIdx])?.src;
  });
  next?.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % items.length;
    img.src = items[currentIdx].dataset.lightbox || qs('img', items[currentIdx])?.src;
  });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prev?.click();
    if (e.key === 'ArrowRight') next?.click();
  });
}
document.addEventListener('DOMContentLoaded', initLightbox);

/* ─── Vanilla Tilt ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof VanillaTilt === 'undefined') return;
  VanillaTilt.init(qsa('[data-tilt]'), {
    max: 8,
    speed: 400,
    glare: true,
    'max-glare': 0.1,
    scale: 1.02,
  });
});

/* ─── Sidebar Toggle (Dashboard) ────────────────────────── */
const sidebarToggle = qs('#sidebar-toggle');
const sidebar = qs('.sidebar');
sidebarToggle?.addEventListener('click', () => {
  sidebar?.classList.toggle('open');
});

/* ─── Modal Helpers ──────────────────────────────────────── */
function openModal(id) {
  const overlay = qs(`#${id}`);
  overlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const overlay = qs(`#${id}`);
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
}
window.openModal = openModal;
window.closeModal = closeModal;

qsa('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
  qs('.modal-close', overlay)?.addEventListener('click', () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── Auth Page Helpers ──────────────────────────────────── */
const loginForm = qs('#login-form');
loginForm?.addEventListener('submit', e => {
  e.preventDefault();
  const email = qs('#email', loginForm)?.value;
  if (!email) return;
  showToast('Welcome back! Redirecting to your dashboard...', 'success');
  setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
});

const signupForm = qs('#signup-form');
signupForm?.addEventListener('submit', e => {
  e.preventDefault();
  showToast('Account created successfully! Welcome to ÉCLAT.', 'success');
  setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
});

const forgotForm = qs('#forgot-form');
forgotForm?.addEventListener('submit', e => {
  e.preventDefault();
  const step1 = qs('#step-email');
  const step2 = qs('#step-otp');
  if (step1 && step2) {
    step1.style.display = 'none';
    step2.style.display = 'block';
    showToast('OTP sent to your email address.', 'info');
  }
});

const otpForm = qs('#otp-form');
otpForm?.addEventListener('submit', e => {
  e.preventDefault();
  const step2 = qs('#step-otp');
  const step3 = qs('#step-reset');
  if (step2 && step3) {
    step2.style.display = 'none';
    step3.style.display = 'block';
  }
});

const resetForm = qs('#reset-form');
resetForm?.addEventListener('submit', e => {
  e.preventDefault();
  const step3 = qs('#step-reset');
  const step4 = qs('#step-success');
  if (step3 && step4) {
    step3.style.display = 'none';
    step4.style.display = 'flex';
    showToast('Password reset successful! Please login.', 'success');
  }
});

/* ─── OTP Input ──────────────────────────────────────────── */
qsa('.otp-input').forEach((input, i, arr) => {
  input.addEventListener('input', () => {
    if (input.value && arr[i + 1]) arr[i + 1].focus();
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Backspace' && !input.value && arr[i - 1]) arr[i - 1].focus();
  });
});

/* ─── Chart Init Helpers ─────────────────────────────────── */
window.createLineChart = function(id, labels, data, label) {
  const ctx = qs(`#${id}`);
  if (!ctx || typeof Chart === 'undefined') return;
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: '#C9A84C',
        backgroundColor: 'rgba(201,168,76,0.08)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#C9A84C',
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#A09880', font: { family: 'Outfit' } } } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6B6358', font: { family: 'Outfit' } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6B6358', font: { family: 'Outfit' } } }
      }
    }
  });
};

window.createDoughnutChart = function(id, labels, data) {
  const ctx = qs(`#${id}`);
  if (!ctx || typeof Chart === 'undefined') return;
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: ['#C9A84C','#6B1D3A','#3B4A6B','#2D4A3E','#6B4A1D'], borderWidth: 0 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '70%',
      plugins: { legend: { position: 'bottom', labels: { color: '#A09880', padding: 16, font: { family: 'Outfit' } } } }
    }
  });
};

window.createBarChart = function(id, labels, data, label) {
  const ctx = qs(`#${id}`);
  if (!ctx || typeof Chart === 'undefined') return;
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: 'rgba(201,168,76,0.6)',
        borderColor: '#C9A84C',
        borderWidth: 1,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#A09880', font: { family: 'Outfit' } } } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#6B6358' } },
        y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#6B6358' } }
      }
    }
  });
};

/* ─── Wishlist Toggle ────────────────────────────────────── */
qsa('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    const isActive = btn.classList.contains('active');
    btn.style.color = isActive ? '#C9A84C' : '';
    showToast(isActive ? 'Added to your wishlist.' : 'Removed from wishlist.', isActive ? 'success' : 'info');
  });
});

/* ─── Menu Search & Filter ───────────────────────────────── */
const menuSearch = qs('#menu-search');
menuSearch?.addEventListener('input', () => {
  const val = menuSearch.value.toLowerCase();
  qsa('.food-card').forEach(card => {
    const title = qs('.food-card-title', card)?.textContent.toLowerCase() || '';
    card.closest('[data-menu-item]')
      ? (card.closest('[data-menu-item]').style.display = title.includes(val) ? '' : 'none')
      : (card.style.display = title.includes(val) ? '' : 'none');
  });
});

/* ─── Copy to Clipboard ──────────────────────────────────── */
qsa('[data-copy]').forEach(btn => {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(btn.dataset.copy).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  });
});
