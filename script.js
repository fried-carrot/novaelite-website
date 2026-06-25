// NoVa Elite — interaction layer

// Sticky nav: switch to light treatment once past the dark hero
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.7);
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
