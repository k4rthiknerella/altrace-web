/* ============================================================
   ALTRACE — Shared JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* --- Nav scroll state --- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Mobile hamburger --- */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --- Scroll-triggered fade-in and stagger-reveal --- */
  const animEls = document.querySelectorAll('.fade-in, .stagger-reveal');
  if (animEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    animEls.forEach(el => observer.observe(el));
  }

  /* --- Product page step tabs --- */
  const stepTabs = document.querySelectorAll('.step-tab');
  const stepContents = document.querySelectorAll('.step-content');
  if (stepTabs.length > 0) {
    stepTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.step;
        stepTabs.forEach(t => t.classList.remove('active'));
        stepContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const content = document.getElementById(target);
        if (content) content.classList.add('active');
      });
    });
  }

  /* --- Request Access form --- */
  const form = document.getElementById('access-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Attempt Formspree submission
      fetch('https://formspree.io/f/FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(res => {
          if (!res.ok) throw new Error('API not available');
          showSuccess();
        })
        .catch(() => {
          // Fallback: mailto
          const subject = encodeURIComponent('Altrace Early Access Request');
          const body = encodeURIComponent(
            `Name: ${data.firstName} ${data.lastName}\n` +
            `Email: ${data.email}\n` +
            `Company: ${data.company}\n` +
            `Role: ${data.role}\n` +
            `Use case: ${data.useCase || 'N/A'}\n` +
            `Agents in production: ${data.agentCount || 'N/A'}`
          );
          window.location.href = `mailto:hello@altrace.io?subject=${subject}&body=${body}`;
          showSuccess();
        });
    });
  }

  function showSuccess() {
    const formEl = document.getElementById('access-form');
    const successEl = document.getElementById('form-success');
    if (formEl) formEl.style.display = 'none';
    if (successEl) successEl.classList.add('show');
  }

  /* --- Homepage CTA form --- */
  const ctaForm = document.getElementById('cta-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = ctaForm.querySelector('input[type="email"]').value;
      if (email) {
        window.location.href = `request-access.html?email=${encodeURIComponent(email)}`;
      }
    });
  }

  /* --- Pre-fill email from URL param --- */
  const urlParams = new URLSearchParams(window.location.search);
  const emailParam = urlParams.get('email');
  if (emailParam) {
    const emailInput = document.querySelector('input[name="email"]');
    if (emailInput) emailInput.value = emailParam;
  }

  /* --- Set active nav link --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

})();
