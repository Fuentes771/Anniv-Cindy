// SCENE 08 — Quiet Counterpoint
// Breath before letter: near-static, two planes, simple fade.
import gsap from 'gsap';
import { createPhotoPlane } from '../three/photoPlane.js';
import { getScene } from '../three/scene.js';
import { getCamera } from '../three/camera.js';
import { scrollScene } from '../motion/scroll.js';
import { reducedMotion } from '../motion/easing.js';
import { photosByScene } from '../content/photos.js';
import { revealPlane } from '../motion/timeline.js';
import { isMobile } from '../utils/viewport.js';

let planes = [];
let scrollTrigger;

export async function initQuietCounterpoint() {
  const assets     = photosByScene('quietCounterpoint');
  const threeScene = getScene();
  const camera     = getCamera();
  const mobile     = isMobile();
  const count      = mobile ? 1 : 2;

  const POSITIONS = [
    { x:  0.0, y:  0.0, z: 0.0, h: 3.2, opacity: 1.0 },
    { x: -1.6, y: -0.5, z: -1.2, h: 2.6, opacity: 0.55 },
  ];

  for (let i = 0; i < count; i++) {
    const asset = assets[i % assets.length];
    const pos   = POSITIONS[i];

    const plane = createPhotoPlane({
      src: asset.srcs.content,
      width: asset.origW,
      height: asset.origH,
      planeHeight: pos.h,
      position: { x: pos.x, y: pos.y, z: pos.z },
      parallax: 0.06,
    });

    threeScene.add(plane.mesh);
    planes.push({ plane, targetOpacity: pos.opacity });
    await plane.load();

    gsap.to(plane.mesh.material, {
      opacity: pos.opacity,
      duration: 2.0,
      delay: i * 0.3,
      ease: 'power2.out',
    });
  }

  if (!reducedMotion) {
    const trigger = document.querySelector('[data-scene="quietCounterpoint"]');
    scrollTrigger = scrollScene({
      trigger,
      onUpdate: (prog) => {
        camera.position.z = 5 - prog * 0.1;
      },
    });
  }
}

export function tickQuietCounterpoint() {
  planes.forEach(({ plane }) => plane.tick());
}

export function disposeQuietCounterpoint() {
  scrollTrigger && scrollTrigger.kill();
  const threeScene = getScene();
  planes.forEach(({ plane }) => { threeScene.remove(plane.mesh); plane.dispose(); });
  planes = [];
}
