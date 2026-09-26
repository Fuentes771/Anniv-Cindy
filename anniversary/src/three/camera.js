// Shared perspective camera
import * as THREE from 'three';

let camera;

export function initCamera() {
  camera = new THREE.PerspectiveCamera(
    50,                                    // FOV
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );
  camera.position.set(0, 0, 5);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  return camera;
}

export function getCamera() { return camera; }
