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

// Enable smooth scrolling only after load so an initial #hash lands instantly
window.addEventListener('load', () => document.documentElement.classList.add('smooth'));
