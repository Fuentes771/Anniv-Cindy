// PhotoPlane — the core spatial primitive
// Creates a PlaneGeometry textured with an image, with parallax + hover response.
import * as THREE from 'three';

const loader = new THREE.TextureLoader();

/**
 * @param {object} opts
 * @param {string}  opts.src            - Image URL
 * @param {number}  opts.width          - Original image width (px) — used for aspect ratio
 * @param {number}  opts.height         - Original image height (px)
 * @param {number}  [opts.planeHeight=3] - World-space plane height
 * @param {object}  [opts.position]     - {x, y, z}
 * @param {object}  [opts.rotation]     - {x, y, z} in radians
 * @param {number}  [opts.parallax=0.1] - Parallax strength
 * @param {string}  [opts.placeholder]  - Base64 placeholder shown while loading
 * @returns {{ mesh, load, dispose, setParallax }}
 */
export function createPhotoPlane(opts) {
  const {
    src,
    width,
    height,
    planeHeight = 3,
    position = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0 },
    parallax = 0.1,
    placeholder,
  } = opts;

  const aspect = width / height;
  const planeWidth = planeHeight * aspect;

  const geo = new THREE.PlaneGeometry(planeWidth, planeHeight, 1, 1);

  // Start with placeholder texture if available
  const initTex = placeholder
    ? loader.load(placeholder)
    : new THREE.Texture();

  const mat = new THREE.MeshBasicMaterial({
    map: initTex,
    transparent: true,
    opacity: 0,
    side: THREE.FrontSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(position.x, position.y, position.z);
  mesh.rotation.set(rotation.x, rotation.y, rotation.z);

  // Parallax target (updated by pointer.js)
  const _parallaxTarget = { x: 0, y: 0 };
  const _basePos = { x: position.x, y: position.y, z: position.z };

  function load() {
    return new Promise((resolve) => {
      loader.load(src, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        // Focal point crop via offset/repeat (ponytail: basic crop, upgrade to custom UV if needed)
        mat.map = tex;
        mat.needsUpdate = true;
        resolve();
      });
    });
  }

  function setParallax(nx, ny) {
    // nx, ny = normalized pointer -1..1
    _parallaxTarget.x = nx * parallax;
    _parallaxTarget.y = ny * parallax;
  }

  function tick() {
    // Smooth lerp toward parallax target
    mesh.position.x += (_basePos.x + _parallaxTarget.x - mesh.position.x) * 0.06;
    mesh.position.y += (_basePos.y + _parallaxTarget.y - mesh.position.y) * 0.06;
  }

  function dispose() {
    geo.dispose();
    if (mat.map) mat.map.dispose();
    mat.dispose();
  }

  return { mesh, load, dispose, tick, setParallax };
}
