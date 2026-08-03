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
      document.body.classList.remove('nav-open');
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
      document.body.classList.toggle('nav-open', isOpen);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
  }

});
