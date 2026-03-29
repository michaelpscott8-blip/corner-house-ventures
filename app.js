/* ============================================================
   CORNER HOUSE VENTURES — JavaScript
   ============================================================ */
(function () {
  'use strict';

  /* Header — scroll state */
  var header = document.querySelector('.site-header');
  if (header) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          header.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* Mobile menu */
  var navToggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('.nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      var isOpen = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* Scroll reveal */
  function initReveal() {
    var revealEls = [
      '.section-label', '.section-intro', '.section-body',
      '.pullquote', '.founder-placeholder',
      '.hero-headline', '.hero-sub', '.hero-actions',
      '.contact-columns', '.contact-form',
      'h2'
    ];
    var childRevealEls = ['.feature-list', '.dash-list', '.process-grid', '.two-col-list'];
    var imageRevealEls = ['.image-strip', '.fullbleed-image'];

    revealEls.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('reveal');
      });
    });
    childRevealEls.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('reveal-children');
      });
    });
    imageRevealEls.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('reveal-image');
      });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal, .reveal-children, .reveal-image').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* Teaser gate modal */
  function initModal() {
    var overlay = document.getElementById('teaser-gate');
    var closeBtn = document.getElementById('modal-close');
    var form = document.getElementById('teaser-form');
    var success = document.getElementById('modal-success');
    if (!overlay) return;

    /* Open */
    document.querySelectorAll('a[href="#teaser-gate"]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    /* Close */
    function closeModal() {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
    });

    /* Submit — send details to FormSubmit, then trigger PDF download */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      data.append('_subject', 'Teaser download — ' + (data.get('name') || 'Unknown'));
      data.append('_template', 'box');
      data.append('_captcha', 'false');

      fetch('https://formsubmit.co/ajax/michael@cornerhouseventures.com', {
        method: 'POST',
        body: data
      }).then(function () {
        /* Show success, trigger download */
        form.style.display = 'none';
        success.style.display = 'block';
        var link = document.createElement('a');
        link.href = './assets/CHV-Investment-Teaser.pdf';
        link.download = 'CHV-Investment-Teaser.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        /* Reset after delay */
        setTimeout(function () {
          closeModal();
          form.reset();
          form.style.display = '';
          success.style.display = 'none';
        }, 3000);
      }).catch(function () {
        /* If email fails, still give them the PDF */
        var link = document.createElement('a');
        link.href = './assets/CHV-Investment-Teaser.pdf';
        link.download = 'CHV-Investment-Teaser.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        closeModal();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initReveal(); initModal(); });
  } else {
    initReveal();
    initModal();
  }
})();
