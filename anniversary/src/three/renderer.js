// Three.js renderer — single shared WebGLRenderer
import * as THREE from 'three';

let renderer;

export function initRenderer() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const container = document.getElementById('experience');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onResize);

  return renderer;
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function getRenderer() { return renderer; }
