// SCENE 05 — Private Details
// Small inserts — blur→sharp reveal, low motion, pointer proximity only.
import { createPhotoPlane } from '../three/photoPlane.js';
import { getScene } from '../three/scene.js';
import { scrollScene } from '../motion/scroll.js';
import { reducedMotion } from '../motion/easing.js';
import { photosByScene } from '../content/photos.js';
import { isMobile } from '../utils/viewport.js';
import gsap from 'gsap';
import { ease } from '../motion/easing.js';

// Small scattered positions, low z-depth variation
const LAYOUT = [
  { x: -1.8, y:  0.8, z:  0.2, scale: 0.70 },
  { x:  1.5, y:  0.3, z: -0.5, scale: 0.65 },
  { x: -0.4, y: -1.0, z:  0.0, scale: 0.75 },
  { x:  2.0, y: -0.8, z: -1.0, scale: 0.60 },
  { x: -2.2, y: -0.2, z: -0.8, scale: 0.68 },
  { x:  0.6, y:  1.2, z: -0.3, scale: 0.62 },
];

let planes = [];
let scrollTrigger;

export async function initPrivateDetails() {
  const assets     = photosByScene('privateDetails');
  const threeScene = getScene();
  const mobile     = isMobile();
  const count      = mobile ? 2 : Math.min(assets.length, LAYOUT.length);

  for (let i = 0; i < count; i++) {
    const asset  = assets[i % assets.length];
    const layout = LAYOUT[i];

    const plane = createPhotoPlane({
      src: asset.srcs.content,
      width: asset.origW,
      height: asset.origH,
      planeHeight: 2.2 * layout.scale,
      position: { x: layout.x, y: layout.y, z: layout.z },
      parallax: 0.06,
    });

    threeScene.add(plane.mesh);
    planes.push(plane);
  }

  // Stagger load + blur-to-sharp via opacity reveal
  for (let i = 0; i < planes.length; i++) {
    await planes[i].load();
    gsap.to(planes[i].mesh.material, {
      opacity: 0.82,
      delay: i * 0.12,
      duration: 1.6,
      ease: ease.out,
    });
    // micro rotation
    gsap.fromTo(planes[i].mesh.rotation,
      { z: (Math.random() - 0.5) * 0.04 },
      { z: 0, duration: 2.0, ease: ease.out, delay: i * 0.12 }
    );
  }

  if (!reducedMotion) {
    const trigger = document.querySelector('[data-scene="privateDetails"]');
    scrollTrigger = scrollScene({
      trigger,
      onUpdate: (prog) => {
        // subtle y drift as scroll progresses
        planes.forEach((p, i) => {
          p.mesh.position.y = LAYOUT[i].y + prog * 0.3 * (i % 2 === 0 ? 1 : -1);
        });
      },
    });
  }
}

export function tickPrivateDetails() {
  planes.forEach(p => p.tick());
}

export function disposePrivateDetails() {
  scrollTrigger && scrollTrigger.kill();
  const threeScene = getScene();
  planes.forEach(p => { threeScene.remove(p.mesh); p.dispose(); });
  planes = [];
}
