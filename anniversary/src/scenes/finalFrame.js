// SCENE 10 — Final Frame
// One hero plane, slow pull-back, final DOM line reveal.
import { createPhotoPlane } from '../three/photoPlane.js';
import { getScene } from '../three/scene.js';
import { getCamera } from '../three/camera.js';
import { scrollScene } from '../motion/scroll.js';
import { reducedMotion, ease } from '../motion/easing.js';
import { photosByScene } from '../content/photos.js';
import { letter } from '../content/letter.js';
import { isMobile } from '../utils/viewport.js';
import gsap from 'gsap';

let plane;
let scrollTrigger;

export async function initFinalFrame() {
  // Populate final line
  const finalLineEl = document.getElementById('final-line');
  if (finalLineEl && letter.finalLine) {
    finalLineEl.textContent = letter.finalLine;
  }

  // Hero photo — prefer img-48 (mirror scratches = documentary character per PRD §17)
  const assets     = photosByScene('opening').filter(a => a.id === 'img-48');
  const asset      = assets[0] || photosByScene('opening')[0];
  const threeScene = getScene();
  const camera     = getCamera();

  plane = createPhotoPlane({
    src: asset.srcs.hero || asset.srcs.content,
    width: asset.origW,
    height: asset.origH,
    planeHeight: isMobile() ? 4 : 3.8,
    position: { x: 0, y: 0, z: 0 },
    parallax: 0.08,
  });

  threeScene.add(plane.mesh);
  await plane.load();
  gsap.to(plane.mesh.material, { opacity: 1, duration: 2.0, ease: ease.out });

  if (!reducedMotion) {
    const trigger = document.querySelector('[data-scene="finalFrame"]');
    scrollTrigger = scrollScene({
      trigger,
      onUpdate: (prog) => {
        // slow pull-back: z 4.5 → 6
        camera.position.z = 4.5 + prog * 1.5;
        camera.position.y = prog * 0.1;

        // final line reveal in second half
        if (prog > 0.5 && finalLineEl) {
          const lineProg = (prog - 0.5) * 2;
          gsap.to(finalLineEl, {
            opacity: lineProg,
            y: 20 * (1 - lineProg),
            duration: 0.01,
            overwrite: 'auto',
          });
        }
      },
    });
  } else {
    if (finalLineEl) finalLineEl.style.opacity = '1';
  }
}

export function tickFinalFrame() {
  plane && plane.tick();
}

export function disposeFinalFrame() {
  scrollTrigger && scrollTrigger.kill();
  if (plane) {
    getScene().remove(plane.mesh);
    plane.dispose();
    plane = null;
  }
}
