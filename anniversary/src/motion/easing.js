// Easing vocabulary + reduced-motion state (PRD §22, §29).
// GSAP ease names, kept in one place so motion stays consistent.
export const ease = {
  out:    'power3.out',
  inOut:  'power2.inOut',
  in:     'power3.in',
  scene:  'expo.out',     // scene-level reveals
  gentle: 'power1.out',   // ambient drift
  ui:     'power2.out',   // 100–300 ms control feedback
};

const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const listeners = new Set();

export let reducedMotion = reducedQuery.matches;

reducedQuery.addEventListener('change', e => {
  reducedMotion = e.matches;
  listeners.forEach(fn => fn(reducedMotion));
});

export function onReducedMotionChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
