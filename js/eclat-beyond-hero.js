/**
 * eclat-beyond-hero.js
 * ÉCLAT Fine Dining — Dark Luxury Interactions
 * Scroll reveal · Navbar shrink · Staggered children · Stat glow
 */
(function () {
  'use strict';

  const EASE = 'cubic-bezier(0.25,0.46,0.45,0.94)';

  /* ──────────────────────────────────────────────────────
     1. INJECT RUNTIME KEYFRAMES & SHRINK RULE
  ────────────────────────────────────────────────────── */
  function injectStyles() {
    const s = document.createElement('style');
    s.id = 'bh-runtime';
    s.textContent = `
      @keyframes bh-stat-glow {
        0%,100% { text-shadow: 0 0 8px rgba(201,168,76,0); }
        50%      { text-shadow: 0 0 22px rgba(201,168,76,0.55),
                               0 0 44px rgba(201,168,76,0.25); }
      }
      @keyframes bh-border-glow {
        0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
        50%      { box-shadow: 0 0 20px 4px rgba(201,168,76,0.22); }
      }
      #navbar.bh-shrunk,
      .navbar.bh-shrunk { height: 62px !important; }
    `;
    document.head.appendChild(s);
  }

  /* ──────────────────────────────────────────────────────
     2. NAVBAR — shrink + dark glass after 60px
  ────────────────────────────────────────────────────── */
  function initNavbar() {
    const nav = document.querySelector('#navbar, .navbar[id]');
    if (!nav) return;
    let raf = false;

    function update() {
      const past = window.scrollY > 60;
      nav.classList.toggle('scrolled', past);
      nav.classList.toggle('bh-shrunk', past);
      raf = false;
    }

    window.addEventListener('scroll', () => {
      if (!raf) { raf = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ──────────────────────────────────────────────────────
     3. SCROLL REVEAL — IntersectionObserver
  ────────────────────────────────────────────────────── */
  function initScrollReveal() {
    // Individual card/element selectors
    const CARD_SEL = [
      '.food-card', '.chef-card', '.event-card', '.testi-card',
      '.neo-card', '.newsletter-wrap', '.group.rounded-2xl',
      '.rounded-2xl.overflow-hidden.cursor-pointer',
    ].join(',');

    // Section header selectors (reveal as a unit)
    const HDR_SEL = '.section-header, .section-eyebrow + .section-title';

    // Stat items
    const STAT_SEL = '.stat-number, .stat-label';

    const all = document.querySelectorAll(
      `${CARD_SEL}, ${HDR_SEL}, ${STAT_SEL}`
    );

    all.forEach(el => {
      if (!el.closest('.hero')) el.classList.add('bh-reveal');
    });

    // Stagger sibling cards inside grids
    const gridWrappers = document.querySelectorAll(
      '[class*="grid"]:not(.hero *)'
    );
    gridWrappers.forEach(grid => {
      const cards = grid.querySelectorAll(
        '.food-card, .chef-card, .event-card, .testi-card, .glass-card'
      );
      cards.forEach((card, i) => {
        card.classList.add('bh-reveal');
        card.style.transitionDelay = `${i * 0.10}s`;
      });
    });

    // Gallery items — stagger within their grid
    const galGrids = document.querySelectorAll(
      '[class*="grid"]:has(.rounded-2xl)'
    );
    galGrids.forEach(grid => {
      grid.querySelectorAll('.rounded-2xl').forEach((item, i) => {
        item.classList.add('bh-reveal');
        item.style.transitionDelay = `${i * 0.07}s`;
      });
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('bh-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('.bh-reveal').forEach(el => io.observe(el));
  }

  /* ──────────────────────────────────────────────────────
     4. STAT NUMBERS — gold glow animation on enter
  ────────────────────────────────────────────────────── */
  function initStatGlow() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'bh-stat-glow 2.4s ease-in-out infinite';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    stats.forEach(el => io.observe(el));
  }

  /* ──────────────────────────────────────────────────────
     5. RESERVATION CTA — pulse glow on the section border
  ────────────────────────────────────────────────────── */
  function initCtaGlow() {
    const btns = document.querySelectorAll('.btn-gold.btn-xl, .btn-gold.btn-lg');
    btns.forEach(btn => {
      const section = btn.closest('section, .section');
      if (!section || section.classList.contains('hero')) return;
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            section.style.animation = 'bh-border-glow 3s ease-in-out infinite';
            io.unobserve(section);
          }
        });
      }, { threshold: 0.4 });
      io.observe(section);
    });
  }

  /* ──────────────────────────────────────────────────────
     6. FOOTER LINKS — left-slide on hover (progressive)
  ────────────────────────────────────────────────────── */
  function initFooterLinks() {
    document.querySelectorAll('.footer-link').forEach((link, i) => {
      link.style.transition = `color 0.3s, padding-left 0.3s`;
      link.style.transitionDelay = '0s';
    });
  }

  /* ──────────────────────────────────────────────────────
     7. INPUT GOLD FOCUS RING (newsletter + forms)
  ────────────────────────────────────────────────────── */
  function initInputEffects() {
    document.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('focus', () => {
        input.style.borderColor = '#C9A84C';
        input.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.15)';
      });
      input.addEventListener('blur', () => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      });
    });
  }

  /* ──────────────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────────────── */
  /* ──────────────────────────────────────────────────────
     8. PAGE BANNER SWIPER — fade + Ken Burns on all inner pages
  ────────────────────────────────────────────────────── */
  function initPageBannerSwiper() {
    if (!document.querySelector('.page-banner-swiper')) return;
    if (typeof Swiper === 'undefined') {
      // Swiper not yet loaded — retry once it arrives
      window.addEventListener('load', initPageBannerSwiper);
      return;
    }
    new Swiper('.page-banner-swiper', {
      loop:        true,
      effect:      'fade',
      fadeEffect:  { crossFade: true },
      speed:       1600,
      autoplay:    { delay: 5000, disableOnInteraction: false },
      allowTouchMove: false,
      preloadImages:  false,
      lazy:        { loadPrevNext: true }
    });
  }

  function boot() {
    injectStyles();
    initNavbar();
    initPageBannerSwiper();
    initScrollReveal();
    initStatGlow();
    initCtaGlow();
    initFooterLinks();
    initInputEffects();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
