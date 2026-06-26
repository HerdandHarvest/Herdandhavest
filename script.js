/**
 * Herd & Harvest Popcorn — script.js
 *
 * Modules:
 *  1. Mobile Navigation Toggle
 *  2. FAQ Accordion
 *  3. Scroll Fade-In (IntersectionObserver)
 *  4. Interest Bar Animations
 *  5. Notify Me Buttons
 *  6. Buy Now Buttons (placeholder until Stripe links added)
 *  7. Email Signup Form
 */

/* ── DOM-ready wrapper ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqAccordion();
  initScrollFadeIn();
  initInterestBars();
  initNotifyButtons();
  initBuyButtons();

});


/* ── 1. MOBILE NAVIGATION TOGGLE ───────────────────────────── */
function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ── 2. FAQ ACCORDION ───────────────────────────────────────── */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');

    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          const otherAnswer = other.querySelector('.faq-a');
          otherAnswer.hidden = true;
        }
      });

      // Toggle this item
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.hidden = isOpen;
    });
  });
}


/* ── 3. SCROLL FADE-IN ──────────────────────────────────────── */
function initScrollFadeIn() {
  const elements = document.querySelectorAll('.fade-in');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach(el => observer.observe(el));
}


/* ── 4. INTEREST BAR ANIMATIONS ────────────────────────────── */
function initInterestBars() {
  const fills = document.querySelectorAll('.interest-fill');

  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill      = entry.target;
          const targetPct = fill.dataset.width || '0';
          // small delay so the CSS transition is visible
          requestAnimationFrame(() => {
            fill.style.width = `${targetPct}%`;
          });
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach(fill => observer.observe(fill));
}


/* ── 5. NOTIFY ME BUTTONS ───────────────────────────────────── */
function initNotifyButtons() {
  document.querySelectorAll('.btn--notify').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.dataset.product || 'this product';
      btn.textContent = '✓ We\'ll Notify You!';
      btn.classList.add('notified');
      btn.disabled = true;

      // Optional: you could POST to a backend / form service here
      // e.g. fetch('/api/notify', { method: 'POST', body: JSON.stringify({ product }) });
      console.info(`[Notify] Interest registered for: ${product}`);
    });
  });
}


/* ── 6. BUY NOW BUTTONS ─────────────────────────────────────── */
/**
 * Replace the href on each .btn--buy with your real Stripe
 * Checkout link. Until then, clicking shows a friendly message.
 *
 * Stripe links map — fill these in:
 *   'Avocado Oil Popcorn'  : 'https://buy.stripe.com/YOUR_LINK_1'
 *   'Harvest Ranch Popcorn': 'https://buy.stripe.com/YOUR_LINK_2'
 *   'Sugar Harvest Popcorn': 'https://buy.stripe.com/YOUR_LINK_3'
 */
const STRIPE_LINKS = {
  'Avocado Oil Popcorn'  : 'https://buy.stripe.com/5kQ00jf7jaVb1Vu7WT0oM00',
  'Harvest Ranch Popcorn': 'https://buy.stripe.com/cNi4gze3f0gx7fO5OL0oM02',
  'Sugar Harvest Popcorn': 'https://buy.stripe.com/00w7sL6ANd3j2Zyfpl0oM03',
};

function initBuyButtons() {
  document.querySelectorAll('.btn--buy').forEach(btn => {
    const product = btn.dataset.product || '';
    const link    = STRIPE_LINKS[product];

    if (link) {
      btn.href = link;
      btn.target = '_blank';
      btn.rel    = 'noopener';
    } else {
      // No Stripe link yet — intercept click
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`Stripe checkout for "${product}" coming soon! Check back shortly.`);
      });
    }
  });
}



