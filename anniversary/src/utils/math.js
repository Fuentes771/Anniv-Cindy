// utils/math.js — small math helpers
export function lerp(a, b, t) { return a + (b - a) * t; }
export function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
export function mapRange(v, inMin, inMax, outMin, outMax) {
  return outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
}
