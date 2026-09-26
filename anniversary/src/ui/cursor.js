// Custom cursor — a small dot that grows over interactive things.
// Only on fine pointers, only after Enter, never a trail (PRD §10).
import { pointer } from '../motion/pointer.js';
import { damp } from '../utils/math.js';

let el;
let enabled = false;
const pos = { x: -100, y: -100 };
const reasons = new Set();

export function initCursor() {
  el = document.getElementById('cursor');
  if (!el || !window.matchMedia('(pointer: fine)').matches) return;

  // Event delegation — works for elements created later (progress ticks, focus buttons).
  document.addEventListener('pointerover', e => {
    el.classList.toggle('is-hover', !!e.target.closest('button, a, [data-cursor]'));
  });
}

export function enableCursor() {
  if (!el || !window.matchMedia('(pointer: fine)').matches) return;
  enabled = true;
  document.body.classList.add('has-cursor');
}

/** Scenes flag hover over WebGL frames (no DOM element to delegate to). */
export function setCursorHover(on, reason = 'scene') {
  if (on) reasons.add(reason); else reasons.delete(reason);
  if (el) el.classList.toggle('is-frame', reasons.size > 0);
}

export function updateCursor(dt) {
  if (!enabled) return;
  const k = damp(22, dt);
  pos.x += (pointer.client.x - pos.x) * k;
  pos.y += (pointer.client.y - pos.y) * k;
  el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
}
