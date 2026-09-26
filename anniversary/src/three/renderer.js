// Single shared WebGLRenderer (PRD §32.1) — opaque, cleared with the current fog colour.
import * as THREE from 'three';
import { globals } from './scene.js';

let renderer;
let maxDpr = 2;
const listeners = new Set();

export function initRenderer(container, { dpr = 2 } = {}) {
  maxDpr = dpr;
  renderer = new THREE.WebGLRenderer({
    antialias: dpr < 2,           // high-DPR screens don't need MSAA on flat planes
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(globals.uFogColor.value, 1);
  container.appendChild(renderer.domElement);

  resize();
  new ResizeObserver(resize).observe(container);
  return renderer;
}

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.setSize(w, h, false);
  listeners.forEach(fn => fn(w, h));
}

export function onResize(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setMaxDpr(dpr) {
  maxDpr = dpr;
  resize();
}

export function getRenderer() { return renderer; }
