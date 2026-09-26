// Easing constants — cubic-bezier values for GSAP
// Use these instead of inline strings to stay consistent.

export const ease = {
  out:    'power3.out',
  inOut:  'power2.inOut',
  in:     'power3.in',
  scene:  'power4.out',   // scene-level reveals
  gentle: 'power1.out',   // ambient / ambient drift
};

// prefers-reduced-motion check
export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pointer: normalize raw clientX/Y to -1..1 range
export function normalizePointer(clientX, clientY) {
  return {
    x:  (clientX / window.innerWidth)  * 2 - 1,
    y: -(clientY / window.innerHeight) * 2 + 1,
  };
}
