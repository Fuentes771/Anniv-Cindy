// PhotoPlane — the core spatial primitive (PRD §8.2–8.3).
//
// A photograph on a flat plane in world space. All planes share one unit
// geometry and one shader program; each owns its material uniforms and a
// reference on its texture in the cache.
//
// Loading order: dominant colour → 24px blur placeholder → real derivative.
import * as THREE from 'three';
import { createPhotoMaterial } from './materials.js';
import { acquire, release } from './textures.js';
import { smoothstep } from '../utils/math.js';

const UNIT_PLANE = new THREE.PlaneGeometry(1, 1);
const _normal = new THREE.Vector3();
const _toCam = new THREE.Vector3();
const _world = new THREE.Vector3();
const _quat = new THREE.Quaternion();

/**
 * @param {object} photo   merged record from content/photos.js
 * @param {object} opts
 * @param {number} opts.height      world-space height
 * @param {number} [opts.aspect]    plane aspect (w/h); defaults to the photo's — no crop
 * @param {number[]} [opts.pos]     [x, y, z] relative to the chapter group
 * @param {number[]} [opts.rot]     [x, y, z] radians
 * @param {string} [opts.quality]   'thumb' | 'content' | 'hero'
 * @param {string} [opts.grade]
 * @param {number} [opts.blur]      resting blur 0–1
 * @param {boolean} [opts.passable] fade out as the camera passes through (default true)
 */
export function createPhotoPlane(photo, opts = {}) {
  const imageAspect = photo.width / photo.height;
  const {
    height = 3,
    aspect = imageAspect,
    pos = [0, 0, 0],
    rot = [0, 0, 0],
    quality = 'content',
    grade = 'neutral',
    blur = 0,
    passable = true,
  } = opts;

  const material = createPhotoMaterial({
    imageAspect,
    planeAspect: aspect,
    focal: photo.focal,
    grade,
    color: photo.dominantColor,
  });
  const u = material.uniforms;
  u.uBlur.value = blur;

  const mesh = new THREE.Mesh(UNIT_PLANE, material);
  mesh.scale.set(height * aspect, height, 1);
  mesh.position.fromArray(pos);
  mesh.rotation.set(rot[0], rot[1], rot[2]);

  const base = {
    pos: mesh.position.clone(),
    rot: mesh.rotation.clone(),
    scale: mesh.scale.clone(),
  };

  let heldSrc = null;          // full-resolution texture we hold a ref on
  let heldPlaceholder = false;
  let hasFull = false;
  let readyPromise = null;

  function srcFor(q) {
    return photo.srcs[q] || photo.srcs.content;
  }

  function setMap(tex) {
    u.uMap.value = tex;
    u.uHasMap.value = tex ? 1 : 0;
  }

  const plane = {
    mesh,
    photo,
    base,
    uniforms: u,
    width: height * aspect,
    height,
    quality,

    /** Load (or reload) the texture for the current quality. */
    load() {
      const src = srcFor(plane.quality);
      if (heldSrc === src && readyPromise) return readyPromise;

      if (!heldPlaceholder && photo.placeholder) {
        heldPlaceholder = true;
        acquire(photo.placeholder).then(tex => {
          if (heldPlaceholder && !hasFull) setMap(tex);
        }).catch(() => {});
      }

      const previous = heldSrc;
      heldSrc = src;
      readyPromise = acquire(src).then(tex => {
        if (heldSrc !== src) return; // superseded or unloaded meanwhile
        hasFull = true;
        setMap(tex);
        if (previous && previous !== src) release(previous);
        if (heldPlaceholder) { heldPlaceholder = false; release(photo.placeholder); }
      }).catch(err => {
        console.warn('[photo] failed to load', src, err);
      });
      return readyPromise;
    },

    /** Swap derivative (e.g. thumb for the final overview). */
    setQuality(q) {
      if (q === plane.quality) return readyPromise || Promise.resolve();
      plane.quality = q;
      return heldSrc ? plane.load() : Promise.resolve();
    },

    /** Free GPU memory; the plane falls back to its dominant colour. */
    unload() {
      if (heldSrc) release(heldSrc);
      if (heldPlaceholder) release(photo.placeholder);
      heldSrc = null;
      heldPlaceholder = false;
      hasFull = false;
      readyPromise = null;
      setMap(null);
    },

    get loaded() { return hasFull; },

    /**
     * Camera passage: fade the frame as the camera comes within ~1.5 units in
     * front of it (only when the camera is actually inside its footprint),
     * and hide it once the camera is behind.
     */
    updateFade(camera) {
      if (!passable) return;
      mesh.getWorldPosition(_world);
      mesh.getWorldQuaternion(_quat);
      _normal.set(0, 0, 1).applyQuaternion(_quat);
      _toCam.copy(camera.position).sub(_world);
      const along = _toCam.dot(_normal);
      if (along <= 0) { u.uFade.value = 0; return; }
      const lateral = Math.sqrt(Math.max(_toCam.lengthSq() - along * along, 0));
      const footprint = Math.max(plane.width, plane.height) * 0.5 + 0.35;
      u.uFade.value = lateral > footprint ? 1 : smoothstep(0.35, 1.7, along);
    },

    dispose() {
      plane.unload();
      material.dispose();
    },
  };

  mesh.userData.plane = plane;
  return plane;
}
