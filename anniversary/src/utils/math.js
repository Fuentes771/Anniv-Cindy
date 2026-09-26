// utils/math.js — small math helpers (no dependency)
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, min = 0, max = 1) => Math.min(Math.max(v, min), max);
export const mapRange = (v, inMin, inMax, outMin = 0, outMax = 1) =>
  outMin + clamp((v - inMin) / (inMax - inMin)) * (outMax - outMin);

export function smoothstep(e0, e1, x) {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

export const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeIn    = t => t * t * t;
export const easeOut   = t => 1 - Math.pow(1 - t, 3);
export const easeSine  = t => -(Math.cos(Math.PI * t) - 1) / 2;

export const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

// Frame-rate independent damping factor for lerp(current, goal, k).
export const damp = (lambda, dt) => 1 - Math.exp(-lambda * dt);
