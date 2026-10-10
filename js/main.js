/**
 * SHYAM LIBRARY - JAVASCRIPT CONTROLLER
 * Handles scroll effects, scrollspy navigation, mobile drawer, 
 * intersection observer animations, and interactive forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const allNavLinks = document.querySelectorAll('a[href^="#"]');
  const contactForm = document.getElementById('contactForm');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const heroVideo = document.getElementById('heroVideo');

  /* --------------------------------------------------------------------------
     1. Sticky Navbar & Scroll Management
     -------------------------------------------------------------------------- */
  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Initial check

  /* --------------------------------------------------------------------------
     2. Mobile Menu Toggle
     -------------------------------------------------------------------------- */
  function toggleMobileMenu(forceClose = false) {
    const shouldClose = forceClose || mobileDrawer.classList.contains('is-open');
    if (shouldClose) {
      mobileDrawer.classList.remove('is-open');
      drawerOverlay.classList.remove('is-open');
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      mobileDrawer.classList.add('is-open');
      drawerOverlay.classList.add('is-open');
      mobileToggle.classList.add('is-active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => toggleMobileMenu(true));
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  /* --------------------------------------------------------------------------
     3. Smooth Anchor Scrolling & Scrollspy (Active Nav Indicator)
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id], header[id], main[id]');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 140; // Offset for header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Desktop links
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Mobile links
        mobileNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  allNavLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     4. Intersection Observer for Scroll Reveal Animations
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver isn't supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* --------------------------------------------------------------------------
     5. Back to Top Button
     -------------------------------------------------------------------------- */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. Video Background Assurance
     -------------------------------------------------------------------------- */
  if (heroVideo) {
    // Ensure video plays smoothly across all mobile/desktop browser policies
    heroVideo.muted = true;
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback, attempt on user interaction
        document.addEventListener('click', () => {
          heroVideo.play().catch(() => {});
        }, { once: true });
      });
    }
  }

  /* --------------------------------------------------------------------------
     7. Interactive Contact Form & Toast Feedback
     -------------------------------------------------------------------------- */
  function showToast(message, icon = 'check_circle') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="material-symbols-outlined fill">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('userName')?.value.trim();
      const phone = document.getElementById('userPhone')?.value.trim();
      const shift = document.getElementById('userShift')?.value;
      const message = document.getElementById('userMessage')?.value.trim();

      if (!name || !phone) {
        showToast('Please enter your name and phone number.', 'error');
        return;
      }

      // Format WhatsApp message with user details
      let waText = `*New Seat Inquiry - Shyam Library*\n\n`;
      waText += `👤 *Name:* ${name}\n`;
      waText += `📞 *Phone:* ${phone}\n`;
      if (shift) {
        waText += `⏰ *Preferred Shift:* ${shift}\n`;
      }
      if (message) {
        waText += `💬 *Message:* ${message}\n`;
      }

      // WhatsApp target number from contact details: 091987 53349 (919198753349)
      const waNumber = '919198753349';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

      showToast(`Opening WhatsApp to send your inquiry, ${name}...`, 'chat');

      // Open WhatsApp in new tab
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 500);

      contactForm.reset();
    });
  }
});
