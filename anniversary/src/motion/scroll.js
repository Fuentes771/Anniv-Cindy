// Scroll system — maps scroll progress to scene progress via GSAP ScrollTrigger
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from './easing.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Create a ScrollTrigger-driven tween.
 * @param {object} opts
 * @param {Element} opts.trigger
 * @param {string}  [opts.start='top bottom']
 * @param {string}  [opts.end='bottom top']
 * @param {function} opts.onUpdate - called with progress 0..1
 */
export function scrollScene(opts) {
  const { trigger, start = 'top bottom', end = 'bottom top', onUpdate } = opts;

  // ponytail: skip animation setup under reduced-motion, still call onUpdate(1) so content shows
  if (reducedMotion) {
    onUpdate && onUpdate(1);
    return null;
  }

  return ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub: 1.2,
    onUpdate: (self) => onUpdate && onUpdate(self.progress),
  });
}

export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach(st => st.kill());
}
