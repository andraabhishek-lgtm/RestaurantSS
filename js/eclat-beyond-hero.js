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

  /* ──────────────────────────────────────────────────────
     9. SERVICES DROPDOWN — desktop hover + mobile inject
  ────────────────────────────────────────────────────── */
  function initServicesDropdown() {
    const SERVICE_PAGES = ['bar.html', 'rooms.html', 'valet.html'];
    const curPage = window.location.pathname.split('/').pop() || 'index.html';
    const isServicePage = SERVICE_PAGES.includes(curPage);

    // ── Desktop hover ──────────────────────────────────
    document.querySelectorAll('.nav-dropdown-item').forEach(item => {
      let closeTimer = null;
      item.addEventListener('mouseenter', () => { clearTimeout(closeTimer); item.classList.add('is-open'); });
      item.addEventListener('mouseleave', () => { closeTimer = setTimeout(() => item.classList.remove('is-open'), 200); });
      const trigger = item.querySelector('.nav-dropdown-trigger');
      if (trigger) {
        trigger.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); item.classList.toggle('is-open'); });
      }
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.nav-dropdown-item'))
        document.querySelectorAll('.nav-dropdown-item.is-open').forEach(el => el.classList.remove('is-open'));
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape')
        document.querySelectorAll('.nav-dropdown-item.is-open').forEach(el => el.classList.remove('is-open'));
    });

    // ── Active state ───────────────────────────────────
    if (isServicePage) {
      document.querySelectorAll('.nav-dropdown-trigger').forEach(t => t.classList.add('services-active'));
      document.querySelectorAll('.nav-dropdown-link').forEach(link => {
        if (link.getAttribute('href') === curPage) link.classList.add('active');
      });
    }

    // ── Mobile inject ──────────────────────────────────
    const mobileRoot = document.querySelector('.mobile-menu .mobile-nav-links, .mobile-menu');
    if (!mobileRoot || mobileRoot.querySelector('[data-srv]')) return;

    const wrap = document.createElement('div');
    wrap.setAttribute('data-srv', '1');
    wrap.style.cssText = 'display:flex;flex-direction:column;';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-link mobile-nav-link';
    btn.style.cssText = 'display:flex;align-items:center;justify-content:space-between;width:100%;background:none;border:none;cursor:pointer;font-family:inherit;';
    if (isServicePage) btn.style.color = '#C9A84C';
    btn.innerHTML = 'Services <i class="fa-solid fa-chevron-down" style="font-size:0.65rem;transition:transform 0.28s;opacity:0.7;"></i>';

    const children = document.createElement('div');
    children.style.cssText = 'display:none;padding:4px 0 6px 14px;border-left:2px solid rgba(201,168,76,0.30);margin:2px 0 4px;';

    [['bar.html','Bar'],['rooms.html','Rooms'],['valet.html','Valet Parking']].forEach(([href, label]) => {
      const a = document.createElement('a');
      a.href = href;
      a.className = 'nav-link mobile-nav-link';
      a.style.cssText = 'font-size:0.85rem;padding:4px 0 4px 8px;display:block;';
      a.textContent = label;
      if (curPage === href) { a.style.color = '#C9A84C'; a.style.borderLeft = '2px solid #C9A84C'; a.style.marginLeft = '-2px'; a.style.paddingLeft = '10px'; }
      children.appendChild(a);
    });

    const arrow = btn.querySelector('i');
    btn.addEventListener('click', () => {
      const open = children.style.display !== 'none' && children.style.display !== '';
      children.style.display = open ? 'none' : 'block';
      if (arrow) arrow.style.transform = open ? '' : 'rotate(180deg)';
    });

    if (isServicePage) {
      children.style.display = 'block';
      if (arrow) arrow.style.transform = 'rotate(180deg)';
    }

    wrap.appendChild(btn);
    wrap.appendChild(children);

    const anchor = mobileRoot.querySelector('a[href="events.html"]') || mobileRoot.querySelector('a.btn, a[href="reservation.html"].btn');
    if (anchor && anchor.href && anchor.href.includes('events.html')) {
      anchor.insertAdjacentElement('afterend', wrap);
    } else if (anchor) {
      anchor.insertAdjacentElement('beforebegin', wrap);
    } else {
      mobileRoot.appendChild(wrap);
    }
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
    initServicesDropdown();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
