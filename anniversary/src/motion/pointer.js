// Pointer module — handles mouse/touch movement → subtle camera + plane tilt
import { normalizePointer, reducedMotion } from './easing.js';

const state = {
  nx: 0, ny: 0,         // normalized -1..1
  rawX: 0, rawY: 0,
  listeners: [],
};

export function initPointer() {
  if (reducedMotion) return; // skip all pointer response

  window.addEventListener('pointermove', (e) => {
    state.rawX = e.clientX;
    state.rawY = e.clientY;
    const { x, y } = normalizePointer(e.clientX, e.clientY);
    state.nx = x;
    state.ny = y;
    state.listeners.forEach(fn => fn(state.nx, state.ny));
  });
}

// Register a callback for pointer updates
export function onPointer(fn) {
  state.listeners.push(fn);
  return () => {
    state.listeners = state.listeners.filter(f => f !== fn);
  };
}

export function getPointer() {
  return { nx: state.nx, ny: state.ny };
}
