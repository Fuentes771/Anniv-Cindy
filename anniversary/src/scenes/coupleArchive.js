// SCENE 07 — Couple Archive
// Emotional core: asymmetric depth stack, pointer-driven parallax hierarchy.
import { createPhotoPlane } from '../three/photoPlane.js';
import { getScene } from '../three/scene.js';
import { getCamera } from '../three/camera.js';
import { scrollScene } from '../motion/scroll.js';
import { onPointer } from '../motion/pointer.js';
import { reducedMotion, ease } from '../motion/easing.js';
import { photosByScene } from '../content/photos.js';
import { isMobile } from '../utils/viewport.js';
import gsap from 'gsap';

// Asymmetric composition per PRD §7 Scene 07
// Primary (index 0) responds most to pointer; others trail
const LAYOUT = [
  { x:  0.0, y:  0.1, z:  0.0, h: 3.8, parallaxMult: 1.0 },  // primary
  { x: -2.1, y:  0.6, z: -1.0, h: 3.2, parallaxMult: 0.6 },
  { x:  2.4, y: -0.5, z: -2.0, h: 2.8, parallaxMult: 0.4 },
  { x: -0.8, y: -1.2, z: -3.0, h: 2.4, parallaxMult: 0.25 },
  { x:  1.0, y:  1.2, z: -1.5, h: 2.6, parallaxMult: 0.35 },
];

let planes = [];
let offPointer;
let scrollTrigger;

export async function initCoupleArchive() {
  const assets     = photosByScene('coupleArchive')
    .concat(photosByScene('opening'));  // opening heroes reuse here
  const threeScene = getScene();
  const camera     = getCamera();
  const mobile     = isMobile();
  const count      = mobile ? 2 : LAYOUT.length;

  for (let i = 0; i < count; i++) {
    const asset  = assets[i % assets.length];
    const layout = LAYOUT[i];

    const plane = createPhotoPlane({
      src: i === 0 ? (asset.srcs.hero || asset.srcs.content) : asset.srcs.content,
      width: asset.origW,
      height: asset.origH,
      planeHeight: layout.h,
      position: { x: layout.x, y: layout.y, z: layout.z },
      parallax: asset.parallaxStrength * layout.parallaxMult,
    });

    threeScene.add(plane.mesh);
    planes.push({ plane, layout });
    await plane.load();

    gsap.to(plane.mesh.material, {
      opacity: i === 0 ? 1 : 0.75 - i * 0.08,
      duration: 1.6,
      delay: i * 0.18,
      ease: ease.out,
    });
  }

  offPointer = onPointer((nx, ny) => {
    planes.forEach(({ plane, layout }) => {
      plane.setParallax(
        nx * -0.05 * layout.parallaxMult,
        ny *  0.03 * layout.parallaxMult
      );
    });

    // Primary plane slight tilt
    if (planes[0]) {
      gsap.to(planes[0].plane.mesh.rotation, {
        y: nx * 0.04, x: ny * -0.03,
        duration: 1.0, ease: ease.gentle, overwrite: 'auto'
      });
    }
  });

  if (!reducedMotion) {
    const trigger = document.querySelector('[data-scene="coupleArchive"]');
    scrollTrigger = scrollScene({
      trigger,
      onUpdate: (prog) => {
        camera.position.z = 5 - prog * 0.2;
        camera.position.y = prog * -0.1;
      },
    });
  }
}

export function tickCoupleArchive() {
  planes.forEach(({ plane }) => plane.tick());
}

export function disposeCoupleArchive() {
  offPointer && offPointer();
  scrollTrigger && scrollTrigger.kill();
  const threeScene = getScene();
  planes.forEach(({ plane }) => { threeScene.remove(plane.mesh); plane.dispose(); });
  planes = [];
}
