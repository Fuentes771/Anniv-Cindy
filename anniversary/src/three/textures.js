// Texture cache with reference counting (PRD §30: dispose what a scene no
// longer needs, never keep all 60 photos resident on the GPU).
// Decoding goes through createImageBitmap when available, off the main thread.
import * as THREE from 'three';

const cache = new Map(); // src → { refs, promise, texture }
let renderer = null;
let anisotropy = 1;
let resident = 0;

const bitmapLoader = typeof createImageBitmap === 'function'
  ? new THREE.ImageBitmapLoader().setOptions({ imageOrientation: 'flipY', premultiplyAlpha: 'none' })
  : null;
const imageLoader = new THREE.TextureLoader();

export function configureTextures(r, { anisotropy: a = 1 } = {}) {
  renderer = r;
  anisotropy = a;
}

function loadTexture(src) {
  if (bitmapLoader) {
    return new Promise((resolve, reject) => {
      bitmapLoader.load(src, bitmap => {
        const tex = new THREE.Texture(bitmap);
        tex.flipY = false; // already flipped by createImageBitmap
        resolve(tex);
      }, undefined, reject);
    });
  }
  return imageLoader.loadAsync(src);
}

/** Resolve a texture for `src`, loading it once and counting users. */
export function acquire(src) {
  let entry = cache.get(src);
  if (!entry) {
    entry = { refs: 0, texture: null, promise: null };
    entry.promise = loadTexture(src).then(tex => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = anisotropy;
      tex.generateMipmaps = true; // mip bias is how the shader blurs
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.needsUpdate = true;
      entry.texture = tex;
      resident++;
      if (renderer) renderer.initTexture(tex); // upload now, not on first visible frame
      if (entry.refs <= 0) evict(src, entry);
      return tex;
    });
    cache.set(src, entry);
  }
  entry.refs++;
  return entry.promise;
}

/** Drop one user; the GPU copy is freed when nobody holds it. */
export function release(src) {
  const entry = cache.get(src);
  if (!entry) return;
  entry.refs--;
  if (entry.refs <= 0 && entry.texture) evict(src, entry);
}

function evict(src, entry) {
  if (cache.get(src) !== entry) return;
  cache.delete(src);
  const img = entry.texture.image;
  entry.texture.dispose();
  if (img && typeof img.close === 'function') img.close();
  entry.texture = null;
  resident--;
}

export function textureStats() {
  return { resident, cached: cache.size };
}
