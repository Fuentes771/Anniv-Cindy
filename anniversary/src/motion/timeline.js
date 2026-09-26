// DOM reveal helpers (GSAP). Text stays in HTML, never in WebGL (PRD §31.5).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, reducedMotion } from './easing.js';

gsap.registerPlugin(ScrollTrigger);

/** Enter per PRD §22: opacity, 16–24px, blur 8→0 — a limited combination. */
export function revealText(targets, overrides = {}) {
  if (reducedMotion) {
    return gsap.set(targets, { opacity: 1, y: 0, filter: 'none' });
  }
  return gsap.fromTo(targets,
    { opacity: 0, y: 18, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: ease.out, stagger: 0.12, ...overrides }
  );
}

/** Reveal each element once as it scrolls into view. */
export function revealOnScroll(elements, { start = 'top 82%' } = {}) {
  const els = [...elements];
  if (!els.length) return;
  if (reducedMotion) {
    gsap.set(els, { opacity: 1, y: 0, filter: 'none' });
    return;
  }
  gsap.set(els, { opacity: 0, y: 18, filter: 'blur(8px)' });
  ScrollTrigger.batch(els, {
    start,
    once: true,
    onEnter: batch => gsap.to(batch, {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 1.6, ease: ease.out, stagger: 0.18,
    }),
  });
}

export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
