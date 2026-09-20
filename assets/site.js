(() => {
  const header = document.querySelector('#site-header');
  const headerCta = document.querySelector('#header-cta');
  const hero = document.querySelector('#top');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');

  // Sticky header treatment.
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Per design: show the header CTA only after the first hero screen is gone.
  if (hero && headerCta && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      headerCta.classList.toggle('visible', !entry.isIntersecting);
    }, { threshold: 0.12 });
    heroObserver.observe(hero);
  }

  // Scroll-reveal animation with progressive enhancement.
  const revealEls = [...document.querySelectorAll('[data-reveal]')];
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  // Mobile menu.
  const closeMenu = () => {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };
  menuToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Mark the current nav section while scrolling.
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(link => link.removeAttribute('aria-current'));
      const active = navLinks.find(link => link.getAttribute('href') === `#${visible.target.id}`);
      active?.setAttribute('aria-current', 'page');
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0,.2,.5] });
    sections.forEach(section => sectionObserver.observe(section));
  }
})();
