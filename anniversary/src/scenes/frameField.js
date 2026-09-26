// SCENE 02 — Frame Field
// 5–7 portrait planes at varying depth, lateral camera drift on scroll.
import * as THREE from 'three';
import gsap from 'gsap';
import { createPhotoPlane } from '../three/photoPlane.js';
import { getScene } from '../three/scene.js';
import { getCamera } from '../three/camera.js';
import { scrollScene } from '../motion/scroll.js';
import { onPointer } from '../motion/pointer.js';
import { ease, reducedMotion } from '../motion/easing.js';
import { photosByScene } from '../content/photos.js';
import { getSceneById } from '../content/scenes.js';
import { revealPlane } from '../motion/timeline.js';
import { isMobile } from '../utils/viewport.js';

// Asymmetric layout — positions hand-tuned per PRD §5.2
const LAYOUT = [
  { x: -2.2, y:  0.6, z: -0.8, ry:  0.06, scale: 1.0 },
  { x:  1.8, y: -0.4, z: -1.5, ry: -0.08, scale: 0.88 },
  { x: -0.5, y:  0.2, z:  0.2, ry:  0.03, scale: 1.05 },
  { x:  0.9, y:  1.0, z: -2.2, ry: -0.05, scale: 0.80 },
  { x: -1.6, y: -0.9, z: -3.0, ry:  0.10, scale: 0.72 },
  { x:  2.5, y:  0.5, z: -0.5, ry: -0.04, scale: 0.90 },
  { x:  0.2, y: -1.5, z: -1.0, ry:  0.02, scale: 0.95 },
];

let planes = [];
let offPointer;
let scrollTrigger;

export async function initFrameField() {
  const contract = getSceneById('frameField');
  const assets   = photosByScene('frameField');
  const threeScene = getScene();
  const camera   = getCamera();
  const mobile   = isMobile();

  const count = mobile ? 3 : Math.min(assets.length, 7);

  for (let i = 0; i < count; i++) {
    const asset  = assets[i % assets.length];
    const layout = LAYOUT[i];

    const plane = createPhotoPlane({
      src: asset.srcs.content,
      width: asset.origW,
      height: asset.origH,
      planeHeight: 3.0 * layout.scale,
      position: { x: layout.x, y: layout.y, z: layout.z },
      rotation: { x: 0, y: layout.ry, z: 0 },
      parallax: asset.parallaxStrength * (1 - i * 0.08),
      placeholder: asset.placeholder,
    });

    threeScene.add(plane.mesh);
    planes.push(plane);

    // staggered load + reveal
    await plane.load();
    revealPlane(plane.mesh.material, i * 0.15);
  }

  offPointer = onPointer((nx, ny) => {
    planes.forEach((p, i) => {
      const str = 1 - i * 0.12;
      p.setParallax(nx * -0.04 * str, ny * 0.03 * str);
    });
  });

  if (!reducedMotion) {
    const trigger = document.querySelector('[data-scene="frameField"]');
    scrollTrigger = scrollScene({
      trigger,
      onUpdate: (prog) => {
        // lateral drift
        camera.position.x = -1.5 + prog * 3.0;
        camera.position.y =  0.3 - prog * 0.5;
        camera.position.z =  5.0 - prog * 0.5;
      },
    });
  }
}

export function tickFrameField() {
  planes.forEach(p => p.tick());
}

export function disposeFrameField() {
  offPointer && offPointer();
  scrollTrigger && scrollTrigger.kill();
  const threeScene = getScene();
  planes.forEach(p => { threeScene.remove(p.mesh); p.dispose(); });
  planes = [];
}
