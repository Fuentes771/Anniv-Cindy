// SCENE 06 — Night / Event Space
// Dark environment: horizontal drift, depth separation via opacity layers.
import { createPhotoPlane } from '../three/photoPlane.js';
import { getScene } from '../three/scene.js';
import { getCamera } from '../three/camera.js';
import { scrollScene } from '../motion/scroll.js';
import { onPointer } from '../motion/pointer.js';
import { reducedMotion } from '../motion/easing.js';
import { photosByScene } from '../content/photos.js';
import gsap from 'gsap';
import { ease } from '../motion/easing.js';
import { isMobile } from '../utils/viewport.js';

const LAYOUT = [
  { x:  0.0, y:  0.0, z:  0.0, opacity: 1.0   },
  { x: -2.2, y:  0.3, z: -1.8, opacity: 0.72   },
  { x:  2.0, y: -0.4, z: -3.0, opacity: 0.55   },
  { x: -0.8, y: -1.2, z: -4.5, opacity: 0.38   },
];

let planes = [];
let offPointer;
let scrollTrigger;

export async function initNightSpace() {
  const assets     = photosByScene('nightSpace');
  const threeScene = getScene();
  const camera     = getCamera();
  const mobile     = isMobile();
  const count      = mobile ? 2 : LAYOUT.length;

  for (let i = 0; i < count; i++) {
    const asset  = assets[i % assets.length];
    const layout = LAYOUT[i];

    const plane = createPhotoPlane({
      src: asset.srcs.content,
      width: asset.origW,
      height: asset.origH,
      planeHeight: 3.4,
      position: { x: layout.x, y: layout.y, z: layout.z },
      parallax: asset.parallaxStrength * (1 - i * 0.15),
    });

    threeScene.add(plane.mesh);
    planes.push(plane);
    await plane.load();

    // Reveal to target opacity (depth-based bokeh sim via opacity)
    gsap.to(plane.mesh.material, {
      opacity: layout.opacity,
      duration: 1.4,
      delay: i * 0.2,
      ease: ease.out,
    });
  }

  offPointer = onPointer((nx, ny) => {
    planes.forEach((p, i) => {
      const str = 1 - i * 0.18;
      p.setParallax(nx * -0.035 * str, ny * 0.02 * str);
    });
  });

  if (!reducedMotion) {
    const trigger = document.querySelector('[data-scene="nightSpace"]');
    scrollTrigger = scrollScene({
      trigger,
      onUpdate: (prog) => {
        camera.position.x = -1 + prog * 2;
        camera.position.z =  5 - prog * 0.5;
      },
    });
  }
}

export function tickNightSpace() {
  planes.forEach(p => p.tick());
}

export function disposeNightSpace() {
  offPointer && offPointer();
  scrollTrigger && scrollTrigger.kill();
  const threeScene = getScene();
  planes.forEach(p => { threeScene.remove(p.mesh); p.dispose(); });
  planes = [];
}
