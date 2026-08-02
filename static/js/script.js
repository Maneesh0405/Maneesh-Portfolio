/**
 * Velicheti Maneesh Chowdari - Software Engineer Portfolio
 * Pure Vanilla JavaScript (Tab-Based Single View Portfolio Architecture)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------------------------------------------------------
  // 1. TAB-BASED SECTION SWITCHING ENGINE (Instant Switch with 300ms Fade)
  // ---------------------------------------------------------------------------
  const tabSections = document.querySelectorAll('.tab-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  const validTabs = ['home', 'education', 'skills', 'projects', 'certificates', 'contact'];

  /**
   * Show a section by id and hide all others.
   * Uses direct `display` manipulation per requirements (display:none/block).
   * Adds a short fade-in class for the 200ms animation.
   */
  function showSection(sectionId) {
    const cleanId = (sectionId || '').replace(/^#/, '').toLowerCase();
    const targetId = validTabs.includes(cleanId) ? cleanId : 'home';

    // 1. Hide all sections (display:none)
    tabSections.forEach(sec => {
      sec.style.display = 'none';
      sec.classList.remove('fade-in');
    });

    // 2. Remove active class from all nav links
    navLinks.forEach(link => link.classList.remove('active'));

    // 3. Show only the selected section (display:block)
    const target = document.getElementById(targetId);
    if (!target) return;
    target.style.display = 'block';
    // trigger fade-in animation via class
    target.classList.add('fade-in');

    // 4. Activate the corresponding nav link (match data-target)
    navLinks.forEach(link => {
      if (link.getAttribute('data-target') === targetId) {
        link.classList.add('active');
      }
    });

    // 5. Close mobile nav if open
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      if (navToggle) {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }

  // Handle clicks on elements with `data-target` to switch sections (no scrolling)
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-target]');
    if (!el) return;
    const target = el.getAttribute('data-target');
    if (target && validTabs.includes(target)) {
      e.preventDefault();
      showSection(target);
    }
  });

  // Initial state: hide all sections then show only Home
  tabSections.forEach(sec => sec.style.display = 'none');
  showSection('home');

  // ---------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER TOGGLE
  // ---------------------------------------------------------------------------
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 4. BACK TO TOP BUTTON
  // ---------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  // ---------------------------------------------------------------------------
  // 5. TOAST NOTIFICATION FUNCTION
  // ---------------------------------------------------------------------------
  function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    if (!toast || !toastMessage || !toastIcon) return;

    toastMessage.textContent = message;
    if (isError) {
      toast.classList.add('error');
      toastIcon.innerHTML = '&#10007;'; // cross
    } else {
      toast.classList.remove('error');
      toastIcon.innerHTML = '&#10003;'; // check
    }

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // ---------------------------------------------------------------------------
  // 6. AJAX CONTACT FORM SUBMISSION
  // ---------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const submitBtn = document.getElementById('submit-btn');
    const btnSpinner = document.getElementById('btn-spinner');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous error states
      const errorSpans = contactForm.querySelectorAll('.form-error');
      errorSpans.forEach(span => span.textContent = '');
      const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
      inputs.forEach(input => input.classList.remove('is-invalid'));

      // Extract Form Values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      // Frontend Validation
      let hasError = false;
      if (!name || name.length < 2) {
        document.getElementById('name-error').textContent = 'Please enter your name (minimum 2 characters).';
        document.getElementById('name').classList.add('is-invalid');
        hasError = true;
      }

      const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$'*/;
      const simpleEmailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
      if (!email || !simpleEmailRegex.test(email)) {
        document.getElementById('email-error').textContent = 'Please provide a valid email address.';
        document.getElementById('email').classList.add('is-invalid');
        hasError = true;
      }

      if (!subject || subject.length < 3) {
        document.getElementById('subject-error').textContent = 'Please enter a subject (minimum 3 characters).';
        document.getElementById('subject').classList.add('is-invalid');
        hasError = true;
      }

      if (!message || message.length < 10) {
        document.getElementById('message-error').textContent = 'Message must be at least 10 characters long.';
        document.getElementById('message').classList.add('is-invalid');
        hasError = true;
      }

      if (hasError) return;

      // Set Loading State
      if (submitBtn) submitBtn.disabled = true;
      if (btnSpinner) btnSpinner.style.display = 'inline-block';
      if (btnText) btnText.textContent = 'Sending...';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ name, email, subject, message })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showToast(result.message || 'Your message has been sent successfully!');
          contactForm.reset();
        } else {
          if (result.errors) {
            for (const [field, msg] of Object.entries(result.errors)) {
              const errSpan = document.getElementById(`${field}-error`);
              const inputField = document.getElementById(field);
              if (errSpan) errSpan.textContent = msg;
              if (inputField) inputField.classList.add('is-invalid');
            }
          }
          showToast(result.message || 'Failed to submit form. Please check your inputs.', true);
        }
      } catch (err) {
        showToast('Network error occurred. Please check your connection and try again.', true);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnSpinner) btnSpinner.style.display = 'none';
        if (btnText) btnText.textContent = 'Send Message';
      }
    });
  }

});
