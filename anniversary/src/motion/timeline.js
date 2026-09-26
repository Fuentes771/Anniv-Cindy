// Timeline helpers — thin wrappers over GSAP for scene animation
import gsap from 'gsap';
import { ease } from './easing.js';

/**
 * Fade in a set of elements with stagger.
 */
export function fadeIn(targets, overrides = {}) {
  return gsap.fromTo(targets,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.1, ease: ease.out, stagger: 0.12, ...overrides }
  );
}

/**
 * Fade out targets.
 */
export function fadeOut(targets, overrides = {}) {
  return gsap.to(targets, {
    opacity: 0, duration: 0.7, ease: ease.in, ...overrides
  });
}

/**
 * Reveal a Three.js plane opacity via GSAP (targets material.opacity).
 */
export function revealPlane(material, delay = 0) {
  return gsap.to(material, {
    opacity: 1, duration: 1.4, delay, ease: ease.out
  });
}

/**
 * Hide a Three.js plane.
 */
export function hidePlane(material) {
  return gsap.to(material, { opacity: 0, duration: 0.8, ease: ease.in });
}
