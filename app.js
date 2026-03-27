/* ============================================================
   CORNER HOUSE VENTURES — Minimal JavaScript
   
   1. Sticky header shadow on scroll
   2. Mobile menu toggle
   3. Smooth-scroll for anchor links (already handled by CSS,
      but this closes the mobile menu on click)
   4. Scroll-reveal animations
   5. Form submit handler (mailto fallback)
   ============================================================ */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. HEADER — add shadow class on scroll
     --------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  if (header) {
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          header.classList.toggle('scrolled', window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  /* ---------------------------------------------------------
     2. MOBILE MENU TOGGLE
     --------------------------------------------------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      const isOpen = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
      });
    });
  }


  /* ---------------------------------------------------------
     3. SCROLL REVEAL (Intersection Observer)
     --------------------------------------------------------- */
  function initReveal() {
    // Apply .reveal class to key elements
    const revealSelectors = [
      '.section-header',
      '.section-intro',
      '.section-body',
      '.pullquote',
      '.about-content',
      '.contact-columns',
      '.contact-form',
      '.hero-label',
      '.hero-headline',
      '.hero-sub',
      '.hero-actions',
      '.founder-placeholder'
    ];

    const childRevealSelectors = [
      '.feature-list',
      '.check-list',
      '.process-grid'
    ];

    revealSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('reveal');
      });
    });

    childRevealSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('reveal-children');
      });
    });

    // Observe
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-children').forEach(function (el) {
      observer.observe(el);
    });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }


  /* ---------------------------------------------------------
     4. FORM HANDLING
     The form uses FormSubmit.co by default. If you want a
     simple mailto fallback instead, uncomment the block below
     and remove the form's action attribute.
     --------------------------------------------------------- */
  /*
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent('New enquiry – Corner House Ventures');
      const body = encodeURIComponent(
        'Name: ' + data.get('name') + '\n' +
        'Company: ' + data.get('company') + '\n' +
        'Role: ' + data.get('role') + '\n' +
        'Email: ' + data.get('email') + '\n' +
        'Type: ' + data.get('type') + '\n' +
        'Message: ' + data.get('message')
      );
      window.open('mailto:info@cornerhouseventures.com?subject=' + subject + '&body=' + body, '_blank');
    });
  }
  */

})();
