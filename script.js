// NoVa Elite — interaction layer

// Sticky nav: fade to the light treatment as soon as the user starts scrolling
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
const setMenu = (open) => {
  links.classList.toggle('open', open);
  document.documentElement.classList.toggle('menu-open', open);
};
toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// Scroll-reveal (content is visible by default; html.js opts into the animation)
const reveals = document.querySelectorAll('.reveal');
const revealAll = () => reveals.forEach(el => el.classList.add('in'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(el => io.observe(el));
  // Fire hero immediately, and guarantee nothing stays hidden if something stalls
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('in'));
  window.addEventListener('load', () => setTimeout(revealAll, 1200));
} else {
  revealAll();
}

// Open Calendly popup from buttons without depending on the badge snippet
let calendlyScriptLoaded = false;
let calendlyCssLoaded = false;

const openCalendlyWidget = (url) => {
  const initialize = () => {
    if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
      window.Calendly.initPopupWidget({ url });
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!calendlyCssLoaded) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(style);
    calendlyCssLoaded = true;
  }

  if (!calendlyScriptLoaded) {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
      calendlyScriptLoaded = true;
      initialize();
    };
    document.body.appendChild(script);
    return;
  }

  initialize();
};

document.querySelectorAll('[data-calendly-open]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const url = button.getAttribute('data-calendly-open');
    if (url) openCalendlyWidget(url);
  });
});

// Allow the acceptance marquees to be dragged while paused on hover
const marqueeTracks = document.querySelectorAll('.m-track');
marqueeTracks.forEach((track) => {
  let dragging = false;
  let startX = 0;
  let startOffset = 0;

  const readOffset = () => {
    const raw = getComputedStyle(track).getPropertyValue('--marquee-offset').trim();
    const value = parseFloat(raw);
    return Number.isNaN(value) ? 0 : value;
  };

  const setOffset = (value) => {
    track.style.setProperty('--marquee-offset', `${value}px`);
  };

  track.addEventListener('pointerdown', (event) => {
    dragging = true;
    startX = event.clientX;
    startOffset = readOffset();
    track.classList.add('dragging');
    track.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });

  track.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const delta = (event.clientX - startX)
    setOffset(startOffset + delta);
  });

  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('dragging');
    track.releasePointerCapture?.(event?.pointerId);
  };

  track.addEventListener('pointerup', stopDragging);
  track.addEventListener('pointercancel', stopDragging);
});

// Enable smooth scrolling only after load so an initial #hash lands instantly
window.addEventListener('load', () => document.documentElement.classList.add('smooth'));
