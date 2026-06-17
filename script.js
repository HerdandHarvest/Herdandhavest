/**
 * Herd & Harvest — script.js
 * Lightweight, no-dependency JS for site interactions.
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. Footer year
     ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     2. Smooth-scroll anchor links (supplement CSS scroll-behavior
        for browsers / reduced-motion contexts)
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'start',
      });

      // Move focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ----------------------------------------------------------
     3. Header shadow on scroll
     ---------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.4)';
      } else {
        header.style.boxShadow = 'none';
      }
    };

    // Passive listener for performance
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ----------------------------------------------------------
     4. Buy button — guard against placeholder link
     ---------------------------------------------------------- */
  const buyBtn = document.querySelector('.btn-buy');
  if (buyBtn) {
    const href = buyBtn.getAttribute('href') || '';
    const isPlaceholder = href.includes('[PASTE') || href.trim() === '' || href === '#';

    if (isPlaceholder) {
      buyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        alert('Payment link not yet configured. Please add your Stripe Payment Link to index.html.');
      });
      // Visual hint in dev that link needs updating
      console.warn(
        '[Herd & Harvest] Buy button Stripe link is a placeholder. ' +
        'Update the href in index.html before publishing.'
      );
    }
  }

  /* ----------------------------------------------------------
     5. Lazy-load product image (IntersectionObserver)
        Enhances performance on mobile — the hero image has
        loading="eager" but any future gallery images can use
        data-src and class="lazy" to opt in here.
     ---------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img.lazy[data-src]');

    if (lazyImages.length > 0) {
      const imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imgObserver.unobserve(img);
          }
        });
      }, { rootMargin: '200px 0px' });

      lazyImages.forEach(function (img) {
        imgObserver.observe(img);
      });
    }
  }

})();
