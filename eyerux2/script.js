if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function initPageAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  // Kill old scroll triggers so they don't pile up
  ScrollTrigger.getAll().forEach(t => t.kill());

  // HERO TEXT animation
  if (document.querySelector("#heroTitle span")) {
    gsap.from("#heroTitle span", { y: 40, opacity: 0, duration: 1, delay: 0.5 });
  }
  if (document.querySelector("#heroTitle h1")) {
    gsap.from("#heroTitle h1", { y: 60, opacity: 0, duration: 1, delay: 0.7 });
  }
  if (document.querySelector("#heroTitle p")) {
    gsap.from("#heroTitle p", { y: 40, opacity: 0, duration: 1, delay: 1 });
  }
  if (document.querySelector("#heroTitle .btn")) {
    gsap.from("#heroTitle .btn", { y: 30, opacity: 0, duration: 1, delay: 1.3 });
  }

  // HERO IMAGE animation
  if (document.querySelector("#heroGraphic")) {
    gsap.from("#heroGraphic", { x: 100, opacity: 0, duration: 1.5, delay: 0.8 });
  }

  // ABOUT CARDS animation (scroll)
  const premiumCards = gsap.utils.toArray(".premium-card");
  if (premiumCards.length > 0) {
    premiumCards.forEach((card, i) => {
      // Exclude cards that are part of other specific grids handled below
      if (card.closest('#serviceGrid') || card.closest('#contact')) return;

      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1
      });
    });
  }

  // SERVICES GRID animation
  if (document.querySelector("#serviceGrid .premium-card")) {
    gsap.from("#serviceGrid .premium-card", {
      scrollTrigger: {
        trigger: "#serviceGrid",
        start: "top 80%"
      },
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.15
    });
  }

  // TESTIMONIALS animation
  if (document.querySelector("#testimonials .testimonial-card")) {
    gsap.from("#testimonials .testimonial-card", {
      scrollTrigger: {
        trigger: "#testimonials",
        start: "top 80%"
      },
      y: 70,
      opacity: 0,
      duration: 1,
      stagger: 0.2
    });
  }

  // CONTACT animation
  if (document.querySelector("#contact .premium-card") || document.querySelector("#contact .contact-form")) {
    gsap.from("#contact .premium-card, #contact .contact-form", {
      scrollTrigger: {
        trigger: "#contact",
        start: "top 80%"
      },
      x: -50,
      opacity: 0,
      duration: 1,
      stagger: 0.2
    });
  }

  // Re-initialize AOS if used on the new page
  if (typeof AOS !== 'undefined') {
    AOS.refreshHard();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Initialize animations on first load
  initPageAnimations();

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  function toggleMenu() {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');

    // Toggle icon between bars and times
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
      body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
      body.style.overflow = ''; // Restore scrolling
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  // Close menu when clicking on a link
  if (navLinks) {
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        if (navLinks.classList.contains('active')) {
          toggleMenu();
        }
      }
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks && menuToggle && !navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
      toggleMenu();
    }
  });

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
      toggleMenu();
    }
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
        toggleMenu();
      }
    }, 250);
  });

  // PJAX Navigation Logic (No Blink)
  initPjax();

  // Initial active link setup based on current URL
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  updateActiveLinks(currentPage);
});

function initPjax() {
  // Intercept link clicks
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');

    // Only intercept local relative HTML links or root link
    if (!href ||
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#') ||
      link.target === '_blank') {
      return;
    }

    e.preventDefault();
    const targetUrl = link.href;

    fetch(targetUrl)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Update Title
        document.title = doc.title;

        // Keep the navbar, replace everything else in body
        const newBodyNodes = Array.from(doc.body.children);

        // Remove the navbar from new doc so we don't insert a duplicate
        const newNav = doc.body.querySelector('.navbar');
        if (newNav) newNav.remove();

        // Remove old elements except the navbar
        Array.from(document.body.children).forEach(child => {
          if (!child.classList.contains('navbar') && child.tagName !== 'SCRIPT') {
            child.remove();
          }
        });

        // Insert new nodes BEFORE the first script tag (for neatness)
        const firstScript = document.body.querySelector('script');

        newBodyNodes.forEach(child => {
          // Skip the navbar and scripts from the AJAX payload
          if (!child.classList.contains('navbar') && child.tagName !== 'SCRIPT') {
            if (firstScript) {
              document.body.insertBefore(child, firstScript);
            } else {
              document.body.appendChild(child);
            }
          }
        });

        // Update history
        history.pushState(null, '', targetUrl);

        // Scroll to top
        window.scrollTo(0, 0);

        // Re-initialize animations
        initPageAnimations();

        // Update active link highlighting
        updateActiveLinks(href);
      })
      .catch(err => {
        console.error('PJAX Error:', err);
        // Fallback to normal navigation
        window.location.href = targetUrl;
      });
  });

  // Handle back/forward buttons
  window.addEventListener('popstate', function () {
    // Fallback mechanism: just reload to ensure correct state
    window.location.reload();
  });
}

function updateActiveLinks(href) {
  if (!href) return;
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === href || (href === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });
}
