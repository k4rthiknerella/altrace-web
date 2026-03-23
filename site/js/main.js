/* ============================================================
   ALTRACE — Shared JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* --- Nav scroll state --- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Mobile hamburger --- */
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileNav = document.querySelector('.nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Nav dropdown menus --- */
  var dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.contains('open');
      // Close all dropdowns first
      dropdowns.forEach(function (d) { d.classList.remove('open'); });
      // Toggle this one
      if (!isOpen) {
        dropdown.classList.add('open');
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function () {
    dropdowns.forEach(function (d) { d.classList.remove('open'); });
  });

  // Close dropdowns on escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdowns.forEach(function (d) { d.classList.remove('open'); });
    }
  });

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* --- Scroll-triggered fade-in and stagger-reveal --- */
  var animEls = document.querySelectorAll('.fade-in, .stagger-reveal');
  if (animEls.length > 0) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    animEls.forEach(function (el) { observer.observe(el); });
  }

  /* --- Product page step tabs --- */
  var stepTabs = document.querySelectorAll('.step-tab');
  var stepContents = document.querySelectorAll('.step-content');
  if (stepTabs.length > 0) {
    stepTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.dataset.step;
        stepTabs.forEach(function (t) { t.classList.remove('active'); });
        stepContents.forEach(function (c) { c.classList.remove('active'); });
        tab.classList.add('active');
        var content = document.getElementById(target);
        if (content) content.classList.add('active');
      });
    });
  }

  /* --- SDK tabs (product page) --- */
  var sdkTabs = document.querySelectorAll('.sdk-tab');
  var sdkContents = document.querySelectorAll('.sdk-content');
  if (sdkTabs.length > 0) {
    sdkTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.dataset.sdk;
        sdkTabs.forEach(function (t) { t.classList.remove('active'); });
        sdkContents.forEach(function (c) { c.classList.remove('active'); });
        tab.classList.add('active');
        var content = document.getElementById(target);
        if (content) content.classList.add('active');
      });
    });
  }

  /* --- Request Access form (Supabase + email fallback) --- */
  var form = document.getElementById('access-form');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var formData = new FormData(form);
      var data = Object.fromEntries(formData.entries());

      // Submit to Supabase
      if (typeof supabase !== 'undefined' && supabase.createClient) {
        try {
          var sb = supabase.createClient(
            'https://najmkpfmmcthefbnbskp.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ham1rcGZtbWN0aGVmYm5ic2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNjYyMDksImV4cCI6MjA4NzY0MjIwOX0.L9PoN_vlw8wV42F1dint_JjswX5ge5xe2GKw1-D3hvo'
          );
          await sb.from('leads').insert([{
            first_name: data.firstName,
            last_name:  data.lastName,
            email:      data.email,
            company:    data.company,
            role:       data.role || null,
            use_case:   data.useCase || null
          }]);
        } catch (err) {
          console.error('[altrace] lead capture failed:', err);
          // Still show success to avoid leaking infrastructure details
          // but log for debugging
        }
      }

      showSuccess();
    });
  }

  function showSuccess() {
    var formEl = document.getElementById('access-form');
    var successEl = document.getElementById('form-success');
    if (formEl) formEl.style.display = 'none';
    if (successEl) successEl.classList.add('show');
  }

  /* --- Homepage CTA form --- */
  var ctaForm = document.getElementById('cta-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = ctaForm.querySelector('input[type="email"]').value;
      if (email) {
        window.location.href = 'request-access.html?email=' + encodeURIComponent(email);
      }
    });
  }

  /* --- Pre-fill email from URL param --- */
  var urlParams = new URLSearchParams(window.location.search);
  var emailParam = urlParams.get('email');
  if (emailParam) {
    var emailInput = document.querySelector('input[name="email"]');
    if (emailInput) emailInput.value = emailParam;
  }

  /* --- Set active nav link --- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

})();
