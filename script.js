/**
 * ================================================
 * PORTFOLIO JAVASCRIPT  —  script.js
 * Author: Your Name
 *
 * Sections:
 *   1.  Navbar  — scroll effect & active-link highlight
 *   2.  Hamburger / mobile nav
 *   3.  Typewriter effect  (Hero)
 *   4.  Scroll-reveal animations
 *   5.  Learning progress bars  (animate on scroll)
 *   6.  Back-to-Top floating button
 *   7.  Contact form  — validation + Web3Forms fetch
 *   8.  Smooth anchor scrolling  (progressive enhancement)
 * ================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── tiny helpers ── */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];


  /* ================================================
     1.  NAVBAR — SCROLL EFFECT & ACTIVE LINK
  ================================================ */

  const navbar = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  /* Add .scrolled class to give the navbar a glass background after 50 px */
  function onNavbarScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  /* Highlight the nav-link that matches the currently-visible section */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', active);
        });
      });
    },
    { rootMargin: '0px 0px -60% 0px', threshold: 0 }
  );

  sections.forEach((s) => sectionObserver.observe(s));
  window.addEventListener('scroll', onNavbarScroll, { passive: true });
  onNavbarScroll(); // run once immediately


  /* ================================================
     2.  HAMBURGER / MOBILE NAV
  ================================================ */

  const hamburger = $('#hamburger');
  const mobileMenu = $('#nav-links');

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () =>
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu()
  );

  /* Close on nav-link click */
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) closeMenu();
  });

  /* Close when user taps/clicks outside the navbar */
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) closeMenu();
  });


  /* ================================================
     3.  TYPEWRITER EFFECT  (Hero section)
  ================================================ */

  const typewriterEl = $('#typewriter-text');

  // Words to cycle through
  const WORDS = [
    'AI/ML Enthusiast',
    'Aspiring AI Engineer',
    'Future Full Stack Developer',
    'Problem Solver',
    'Tech Learner',
  ];

  // Timing (ms)
  const TYPE_SPEED = 80;
  const DELETE_SPEED = 45;
  const PAUSE_AFTER_TYPED = 1800;
  const PAUSE_AFTER_DELETED = 400;

  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tick() {
    const word = WORDS[wordIdx];

    if (deleting) {
      // Erase one character
      charIdx--;
      typewriterEl.textContent = word.slice(0, charIdx);

      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % WORDS.length;
        setTimeout(tick, PAUSE_AFTER_DELETED);
      } else {
        setTimeout(tick, DELETE_SPEED);
      }
    } else {
      // Type one character
      charIdx++;
      typewriterEl.textContent = word.slice(0, charIdx);

      if (charIdx === word.length) {
        deleting = true;
        setTimeout(tick, PAUSE_AFTER_TYPED);
      } else {
        setTimeout(tick, TYPE_SPEED);
      }
    }
  }

  if (typewriterEl) {
    setTimeout(tick, 900); // slight delay lets hero fade-in complete first
  }


  /* ================================================
     4.  SCROLL-REVEAL ANIMATIONS
  ================================================ */

  /*
   * We programmatically add the CSS class `reveal` to a set of elements.
   * When an element enters the viewport, we add `visible`, which triggers
   * the CSS transition defined in style.css (.reveal → .reveal.visible).
   */

  const REVEAL_SELECTORS = [
    '.section-header',
    '.social-card',
    '.about-profile-card',
    '.card',            // catches about-cards, learning-cards, project-cards
    '.skill-card',
  ];

  // Collect all elements, deduplicate with a Set
  const revealEls = [...new Set(
    REVEAL_SELECTORS.flatMap((sel) => $$(sel))
  )];

  revealEls.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -70px 0px', threshold: 0.07 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));


  /* ================================================
     5.  LEARNING PROGRESS BARS  (animate on scroll)
  ================================================ */

  /*
   * Each .learning-bar has  style="--bar-width: 45%; --bar-color: #a78bfa;"
   * set inline in HTML.  We animate `width` from 0 to --bar-width once the
   * card enters the viewport.  The CSS transition on .learning-bar handles
   * the visual animation.
   */

  const learningBars = $$('.learning-bar');

  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const targetWidth = bar.style.getPropertyValue('--bar-width') || '0%';
        bar.style.width = targetWidth;
        barObserver.unobserve(bar);
      });
    },
    { threshold: 0.4 }
  );

  learningBars.forEach((bar) => barObserver.observe(bar));


  /* ================================================
     6.  BACK-TO-TOP FLOATING BUTTON
  ================================================ */

  const bttBtn = $('#back-to-top-btn');

  /* Show button after scrolling 400 px */
  function onBttScroll() {
    const show = window.scrollY > 400;

    if (show) {
      bttBtn.removeAttribute('hidden');
      // rAF ensures the display change is painted before we add opacity class
      requestAnimationFrame(() => bttBtn.classList.add('visible'));
    } else {
      bttBtn.classList.remove('visible');
      bttBtn.addEventListener(
        'transitionend',
        () => { if (!bttBtn.classList.contains('visible')) bttBtn.setAttribute('hidden', ''); },
        { once: true }
      );
    }
  }

  window.addEventListener('scroll', onBttScroll, { passive: true });

  bttBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );


  /* ================================================
     7.  CONTACT FORM  — validation + Web3Forms fetch
  ================================================ */

  const form = $('#contact-form');

  if (form) {

    /* Field references */
    const fields = {
      name: { input: $('#contact-name'), error: $('#name-error') },
      email: { input: $('#contact-email'), error: $('#email-error') },
      subject: { input: $('#contact-subject'), error: $('#subject-error') },
      message: { input: $('#contact-message'), error: $('#message-error') },
    };

    const submitBtn = $('#form-submit-btn');
    const formStatus = $('#form-status');

    /* ── helpers ── */

    function isEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    function setError(key, msg) {
      fields[key].input.classList.add('error');
      fields[key].error.textContent = msg;
    }

    function clearError(key) {
      fields[key].input.classList.remove('error');
      fields[key].error.textContent = '';
    }

    /* Validate all fields. Returns true when everything is OK. */
    function validate() {
      let ok = true;
      const name = fields.name.input.value.trim();
      const email = fields.email.input.value.trim();
      const subject = fields.subject.input.value.trim();
      const message = fields.message.input.value.trim();

      if (!name) { setError('name', 'Please enter your full name.'); ok = false; } else clearError('name');
      if (!email) { setError('email', 'Please enter your email address.'); ok = false; }
      else if (!isEmail(email)) { setError('email', 'Please enter a valid email.'); ok = false; }
      else clearError('email');
      if (!subject) { setError('subject', 'Please enter a subject.'); ok = false; } else clearError('subject');
      if (!message) { setError('message', 'Please enter your message.'); ok = false; }
      else if (message.length < 10) { setError('message', 'Message is too short (min 10 chars).'); ok = false; }
      else clearError('message');

      return ok;
    }

    /* Real-time validation on blur for each field */
    Object.entries(fields).forEach(([key, { input }]) => {
      input.addEventListener('blur', () => validate());
    });

    /* ── show status banner ── */
    function showStatus(msg, type) {
      formStatus.textContent = msg;
      formStatus.className = `form-status ${type}`;
      formStatus.removeAttribute('hidden');
      if (type === 'success') {
        setTimeout(() => {
          formStatus.setAttribute('hidden', '');
          formStatus.className = 'form-status';
        }, 6000);
      }
    }

    /* ── toggle loading state on submit button ── */
    function setLoading(on) {
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      submitBtn.disabled = on;
      if (on) {
        btnText.setAttribute('hidden', '');
        btnLoading.removeAttribute('hidden');
        btnLoading.style.display = 'inline-flex';
      } else {
        btnText.removeAttribute('hidden');
        btnLoading.setAttribute('hidden', '');
        btnLoading.style.display = '';
      }
    }

    /* ── form submit ── */
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate()) return;

      setLoading(true);
      formStatus.setAttribute('hidden', '');

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: new FormData(form),
        });
        const data = await res.json();

        if (data.success) {
          showStatus('🎉 Message sent! I\'ll get back to you soon.', 'success');
          form.reset();
          Object.keys(fields).forEach(clearError);
        } else {
          showStatus(data.message || 'Something went wrong. Please try again.', 'error');
        }
      } catch {
        showStatus('Network error. Check your connection and try again.', 'error');
      } finally {
        setLoading(false);
      }
    });

  } // end if form


  /* ================================================
     8.  SMOOTH ANCHOR SCROLLING  (progressive enhancement)
  ================================================ */

  /*
   * CSS `scroll-behavior: smooth` handles this in most modern browsers,
   * but we add JS fallback handling with navbar offset compensation.
   */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


}); // end DOMContentLoaded
