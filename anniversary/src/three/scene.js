// Three.js scene wrapper
import * as THREE from 'three';

let scene;

export function initScene() {
  scene = new THREE.Scene();
  scene.background = null; // transparent — HTML bg handles color
  return scene;
}

export function getScene() { return scene; }
