// SCENE 01 — Opening Frame
// Hero photo on a plane, slow camera push-in on scroll.
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

let planes = [];
let offPointer;
let scrollTrigger;

export async function initOpening() {
  const contract = getSceneById('opening');
  const assets   = photosByScene('opening').slice(0, 1); // one hero
  const threeScene = getScene();
  const camera     = getCamera();

  // Camera initial position
  camera.position.set(...Object.values(contract.cameraStart));

  for (const asset of assets) {
    const plane = createPhotoPlane({
      src: asset.srcs.hero || asset.srcs.content,
      width: asset.origW,
      height: asset.origH,
      planeHeight: isMobile() ? 4 : 3.6,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      parallax: asset.parallaxStrength,
      placeholder: asset.placeholder,
    });
    threeScene.add(plane.mesh);
    planes.push(plane);
    await plane.load();
    revealPlane(plane.mesh.material, 0.2);
  }

  // Pointer parallax
  offPointer = onPointer((nx, ny) => {
    planes.forEach(p => {
      p.setParallax(nx * -0.03, ny * 0.02);
      gsap.to(camera.rotation, {
        x: ny * 0.02, y: nx * -0.02,
        duration: 1.2, ease: ease.gentle, overwrite: 'auto'
      });
    });
  });

  // Scroll → camera push
  if (!reducedMotion) {
    const trigger = document.querySelector('[data-scene="opening"]');
    scrollTrigger = scrollScene({
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (p) => {
        // push from z=6 → z=4.2
        camera.position.z = 6 - p * 1.8;
        camera.position.y = p * -0.15;
      },
    });
  }
}

export function tickOpening() {
  planes.forEach(p => p.tick());
}

export function disposeOpening() {
  offPointer && offPointer();
  scrollTrigger && scrollTrigger.kill();
  const threeScene = getScene();
  planes.forEach(p => {
    threeScene.remove(p.mesh);
    p.dispose();
  });
  planes = [];
}
