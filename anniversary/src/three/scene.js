// Scene + uniforms shared by every photo material (one object, many references).
import * as THREE from 'three';
import { BG } from '../content/scenes.js';

let scene;

export const globals = {
  uTime:     { value: 0 },
  uDim:      { value: 1 },          // 1 = full image, 0 = background only (Letter, ending)
  uFogColor: { value: new THREE.Color(BG) },
  uFogNear:  { value: 9 },
  uFogFar:   { value: 24 },
  uGrain:    { value: 0.02 },
};

export function initScene() {
  scene = new THREE.Scene();
  scene.background = null; // renderer clears with the fog colour
  return scene;
}

export function getScene() { return scene; }
