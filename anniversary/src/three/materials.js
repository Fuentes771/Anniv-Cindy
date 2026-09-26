// Shared material presets — reuse across scenes to reduce GPU objects
import * as THREE from 'three';

// Basic photo material — clone per plane (share geometry if same size)
export function makePhotoMaterial(texture) {
  return new THREE.MeshBasicMaterial({
    map: texture || null,
    transparent: true,
    opacity: 0,
    side: THREE.FrontSide,
  });
}
