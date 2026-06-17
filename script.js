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
     2. Smooth-scroll anchor links
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
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
      header.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.4)' : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     4. Buy button — guard against placeholder link
     ---------------------------------------------------------- */
  const buyBtn = document.querySelector('.btn-buy');
  if (buyBtn) {
    const href = buyBtn.getAttribute('href') || '';
    if (href.includes('[PASTE') || href.trim() === '' || href === '#') {
      buyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        alert('Payment link not yet configured. Please add your Stripe Payment Link to index.html.');
      });
      console.warn('[Herd & Harvest] Buy button Stripe link is a placeholder.');
    }
  }

  /* ----------------------------------------------------------
     5. Lazy-load images (IntersectionObserver)
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
      lazyImages.forEach(function (img) { imgObserver.observe(img); });
    }
  }

  /* ----------------------------------------------------------
     6. Beef & Bacon Interest Counter
        Uses window.storage (shared persistent storage) so the
        count is real and shared across all visitors.
        localStorage tracks whether THIS browser has already voted
        so we don't let one person inflate the number.
     ---------------------------------------------------------- */
  const STORAGE_KEY   = 'beefbacon-interest-count';
  const VOTED_KEY     = 'hh_bb_voted';          // localStorage flag

  const countEl  = document.getElementById('interest-count');
  const btn      = document.getElementById('interest-btn');
  const noteEl   = document.getElementById('interest-note');

  if (!countEl || !btn || !noteEl) return; // elements not on page

  const hasVoted = localStorage.getItem(VOTED_KEY) === '1';

  // Fetch and display the current count on load
  async function loadCount() {
    try {
      const result = await window.storage.get(STORAGE_KEY, true); // shared=true
      const count = parseInt(result.value, 10) || 0;
      setCount(count);
    } catch (_) {
      // Key doesn't exist yet — start at 0
      setCount(0);
    }
  }

  function setCount(n) {
    countEl.textContent = n.toLocaleString();
  }

  function bumpAnimation() {
    countEl.classList.add('bump');
    countEl.addEventListener('transitionend', function () {
      countEl.classList.remove('bump');
    }, { once: true });
  }

  // Apply already-voted state on load
  if (hasVoted) {
    markVoted();
  }

  function markVoted() {
    btn.disabled = true;
    btn.textContent = '✓ You\'re on the list';
    noteEl.textContent = 'We\'ll let you know the moment it launches.';
    noteEl.classList.add('voted');
  }

  // Handle button click
  btn.addEventListener('click', async function () {
    if (hasVoted || btn.disabled) return;

    // Optimistic UI update
    btn.disabled = true;
    const current = parseInt(countEl.textContent.replace(/,/g, ''), 10) || 0;
    const next = current + 1;
    setCount(next);
    bumpAnimation();
    markVoted();
    localStorage.setItem(VOTED_KEY, '1');

    // Persist to shared storage
    try {
      await window.storage.set(STORAGE_KEY, String(next), true); // shared=true
    } catch (err) {
      console.warn('[Herd & Harvest] Could not save interest count:', err);
    }
  });

  // Load count on page ready
  loadCount();

})();
