// SCENE 04 — Reflective / Masked Passage
// Camera pushes through vertical planes with geometric framing.
import { createPhotoPlane } from '../three/photoPlane.js';
import { getScene } from '../three/scene.js';
import { getCamera } from '../three/camera.js';
import { scrollScene } from '../motion/scroll.js';
import { onPointer } from '../motion/pointer.js';
import { reducedMotion } from '../motion/easing.js';
import { photosByScene } from '../content/photos.js';
import { revealPlane } from '../motion/timeline.js';
import { isMobile } from '../utils/viewport.js';

// Planes arranged as a passage — camera moves through them
const LAYOUT = [
  { x:  0.0, y:  0.0, z:  0.0, h: 3.5 },
  { x: -1.8, y:  0.2, z: -1.5, h: 3.0 },
  { x:  1.6, y: -0.3, z: -2.8, h: 2.8 },
];

let planes = [];
let offPointer;
let scrollTrigger;

export async function initReflectivePassage() {
  const assets     = photosByScene('reflectivePassage');
  const threeScene = getScene();
  const camera     = getCamera();
  const mobile     = isMobile();
  const count      = mobile ? 1 : LAYOUT.length;

  for (let i = 0; i < count; i++) {
    const asset  = assets[i % assets.length];
    const layout = LAYOUT[i];

    const plane = createPhotoPlane({
      src: asset.srcs.content,
      width: asset.origW,
      height: asset.origH,
      planeHeight: layout.h,
      position: { x: layout.x, y: layout.y, z: layout.z },
      parallax: asset.parallaxStrength,
    });

    threeScene.add(plane.mesh);
    planes.push(plane);
    await plane.load();
    revealPlane(plane.mesh.material, i * 0.2);
  }

  offPointer = onPointer((nx, ny) => {
    planes.forEach(p => p.setParallax(nx * -0.025, ny * 0.015));
  });

  if (!reducedMotion) {
    const trigger = document.querySelector('[data-scene="reflectivePassage"]');
    scrollTrigger = scrollScene({
      trigger,
      onUpdate: (prog) => {
        // passage: z moves from 5 → 2.5
        camera.position.z = 5 - prog * 2.5;
        camera.position.x = prog * 0.3;
      },
    });
  }
}

export function tickReflectivePassage() {
  planes.forEach(p => p.tick());
}

export function disposeReflectivePassage() {
  offPointer && offPointer();
  scrollTrigger && scrollTrigger.kill();
  const threeScene = getScene();
  planes.forEach(p => { threeScene.remove(p.mesh); p.dispose(); });
  planes = [];
}
