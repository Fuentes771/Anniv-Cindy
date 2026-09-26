// Pointer — raw position for picking, damped value for motion (PRD §10).
// Touch devices and reduced motion get no pointer-driven movement.
import { damp } from '../utils/math.js';
import { isTouch } from '../utils/viewport.js';

const state = {
  ndc: { x: 0, y: 0 },       // raw, -1..1 (y up) — for raycasting
  target: { x: 0, y: 0 },
  smooth: { x: 0, y: 0 },    // damped — for camera sway / tilt
  client: { x: -100, y: -100 },
  active: false,              // pointer seen at least once
};

export function initPointer() {
  window.addEventListener('pointermove', e => {
    state.client.x = e.clientX;
    state.client.y = e.clientY;
    state.ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
    state.ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
    state.active = true;
    if (e.pointerType === 'mouse') {
      state.target.x = state.ndc.x;
      state.target.y = state.ndc.y;
    }
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    state.target.x = 0;
    state.target.y = 0;
  });
}

export function updatePointer(dt, enabled) {
  const tx = enabled && !isTouch() ? state.target.x : 0;
  const ty = enabled && !isTouch() ? state.target.y : 0;
  const k = damp(2.4, dt);
  state.smooth.x += (tx - state.smooth.x) * k;
  state.smooth.y += (ty - state.smooth.y) * k;
}

export const pointer = state;
