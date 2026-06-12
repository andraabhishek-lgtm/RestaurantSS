/**
 * eclat-footer.js
 * Injects the unified ÉCLAT footer on every content page.
 * Removes any existing <footer> first, then appends the new one.
 */
(function () {
  'use strict';

  var SOCIAL_404 = '404.html';

  var SOCIALS = [
    { icon: 'fab fa-facebook-f',  label: 'Facebook'  },
    { icon: 'fab fa-x-twitter',   label: 'X'         },
    { icon: 'fab fa-instagram',   label: 'Instagram' },
    { icon: 'fab fa-linkedin-in', label: 'LinkedIn'  },
    { icon: 'fab fa-youtube',     label: 'YouTube'   },
  ];

  var QUICK_LINKS = [
    ['index.html',       'Home'],
    ['about.html',       'About Us'],
    ['menu.html',        'Our Menu'],
    ['events.html',      'Events'],
    ['gallery.html',     'Gallery'],
    ['blog.html',        'Blog'],
    ['contact.html',     'Contact'],
  ];

  var SERVICES = [
    ['bar.html',         'The Bar'],
    ['rooms.html',       'Guest Rooms'],
    ['valet.html',       'Valet Parking'],
    ['reservation.html', 'Reservations'],
    ['chefs.html',       'Our Chefs'],
    ['testimonials.html','Testimonials'],
  ];

  var SUPPORT = [
    ['faq.html',         'FAQ'],
    ['privacy.html',     'Privacy Policy'],
    ['terms.html',       'Terms of Use'],
    ['contact.html',     'Contact Us'],
    ['reservation.html', 'Book a Table'],
  ];

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    if (children) children.forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }

  function linkList(items) {
    return items.map(function (pair) {
      return el('li', {}, [
        el('a', { href: pair[0], class: 'ef-link', html: pair[1] })
      ]);
    });
  }

  function buildFooter() {
    var style = document.createElement('style');
    style.id = 'ef-styles';
    style.textContent = [
      '.ef-footer{background:#080c14;border-top:1px solid rgba(201,168,76,0.18);padding:72px 0 0;font-family:inherit;}',
      '.ef-container{max-width:1240px;margin:0 auto;padding:0 28px;}',
      '.ef-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:56px;padding-bottom:56px;}',
      /* Brand col */
      '.ef-brand-logo{display:flex;align-items:center;gap:12px;margin-bottom:6px;}',
      '.ef-brand-logo img{height:38px;width:auto;}',
      '.ef-brand-name{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.7rem;font-weight:600;color:#F5F0E8;letter-spacing:0.06em;}',
      '.ef-brand-sub{font-size:0.68rem;letter-spacing:0.22em;text-transform:uppercase;color:#C9A84C;margin-bottom:18px;}',
      '.ef-brand-desc{color:rgba(245,240,232,0.50);font-size:0.86rem;line-height:1.78;margin-bottom:28px;max-width:240px;}',
      '.ef-socials{display:flex;gap:10px;}',
      '.ef-social-btn{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);display:flex;align-items:center;justify-content:center;color:rgba(245,240,232,0.55);font-size:0.85rem;text-decoration:none;transition:background 0.25s,border-color 0.25s,color 0.25s;}',
      '.ef-social-btn:hover{background:rgba(201,168,76,0.18);border-color:rgba(201,168,76,0.55);color:#C9A84C;}',
      /* Columns */
      '.ef-col-heading{font-size:0.78rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#F5F0E8;margin-bottom:0;padding-bottom:14px;border-bottom:2px solid #C9A84C;display:inline-block;margin-bottom:22px;}',
      '.ef-col ul{list-style:none;margin:0;padding:0;}',
      '.ef-link{display:block;color:rgba(245,240,232,0.50);font-size:0.87rem;text-decoration:none;padding:5px 0;transition:color 0.22s,padding-left 0.22s;}',
      '.ef-link:hover{color:#C9A84C;padding-left:6px;}',
      /* Bottom bar */
      '.ef-bottom{border-top:1px solid rgba(245,240,232,0.07);padding:22px 0;}',
      '.ef-bottom-inner{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;}',
      '.ef-copy{color:rgba(245,240,232,0.28);font-size:0.76rem;}',
      '.ef-bottom-links{display:flex;gap:24px;}',
      '.ef-bottom-links a{color:rgba(245,240,232,0.32);font-size:0.76rem;text-decoration:none;transition:color 0.2s;}',
      '.ef-bottom-links a:hover{color:#C9A84C;}',
      /* Responsive */
      '@media(max-width:900px){.ef-grid{grid-template-columns:1fr 1fr;gap:36px;}}',
      '@media(max-width:540px){.ef-grid{grid-template-columns:1fr;gap:28px;}.ef-bottom-inner{flex-direction:column;text-align:center;}.ef-bottom-links{justify-content:center;}}',
    ].join('');

    if (!document.getElementById('ef-styles')) {
      document.head.appendChild(style);
    }

    /* ── Brand column ── */
    var socialEls = SOCIALS.map(function (s) {
      return el('a', { href: SOCIAL_404, class: 'ef-social-btn', 'aria-label': s.label,
                        html: '<i class="' + s.icon + '"></i>' });
    });

    var brandCol = el('div', { class: 'ef-col' }, [
      el('div', { class: 'ef-brand-logo' }, [
        el('img', { src: 'images/stackly_logo.webp', alt: 'ÉCLAT logo' }),
      ]),
      el('p', { class: 'ef-brand-sub', html: 'Fine Dining' }),
      el('p', { class: 'ef-brand-desc', html: 'Award-winning French-Asian fine dining in the heart of New York City — where every meal tells a story.' }),
      el('div', { class: 'ef-socials' }, socialEls),
    ]);

    /* ── Link columns ── */
    function makeCol(heading, items) {
      return el('div', { class: 'ef-col' }, [
        el('h4', { class: 'ef-col-heading', html: heading }),
        el('ul', {}, linkList(items)),
      ]);
    }

    /* ── Grid ── */
    var grid = el('div', { class: 'ef-grid' }, [
      brandCol,
      makeCol('Quick Links',  QUICK_LINKS),
      makeCol('Our Services', SERVICES),
      makeCol('Support',      SUPPORT),
    ]);

    /* ── Bottom bar ── */
    var bottomLinks = el('div', { class: 'ef-bottom-links' }, [
      el('a', { href: 'privacy.html', html: 'Privacy Policy' }),
      el('a', { href: 'terms.html',   html: 'Terms of Use'   }),
      el('a', { href: 'contact.html', html: 'Contact'         }),
    ]);

    var bottom = el('div', { class: 'ef-bottom' }, [
      el('div', { class: 'ef-bottom-inner ef-container' }, [
        el('p', { class: 'ef-copy', html: '&copy; ' + new Date().getFullYear() + ' ÉCLAT Fine Dining. All rights reserved.' }),
        bottomLinks,
      ]),
    ]);

    var inner = el('div', { class: 'ef-container' }, [grid]);

    var footer = el('footer', { class: 'ef-footer' }, [inner, bottom]);
    return footer;
  }

  function inject() {
    /* Remove any existing <footer> */
    document.querySelectorAll('footer').forEach(function (f) { f.remove(); });
    document.body.appendChild(buildFooter());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
