// SCENE 03 — Environmental Depth
// Landscape/environmental planes at depth layers, lateral camera movement.
import { createPhotoPlane } from '../three/photoPlane.js';
import { getScene } from '../three/scene.js';
import { getCamera } from '../three/camera.js';
import { scrollScene } from '../motion/scroll.js';
import { onPointer } from '../motion/pointer.js';
import { reducedMotion } from '../motion/easing.js';
import { photosByScene } from '../content/photos.js';
import { revealPlane } from '../motion/timeline.js';
import { isMobile } from '../utils/viewport.js';

const LAYOUT = [
  { x:  0.0, y:  0.0, z:  0.0, ry:  0.0,  h: 3.2 },
  { x: -2.5, y:  0.3, z: -1.2, ry:  0.08, h: 2.8 },
  { x:  2.8, y: -0.2, z: -2.0, ry: -0.06, h: 2.5 },
  { x: -1.2, y: -0.8, z: -3.0, ry:  0.04, h: 2.2 },
  { x:  1.5, y:  0.5, z: -0.6, ry: -0.05, h: 2.9 },
];

let planes = [];
let offPointer;
let scrollTrigger;

export async function initEnvironmentalDepth() {
  const assets     = photosByScene('environmentalDepth');
  const threeScene = getScene();
  const camera     = getCamera();
  const mobile     = isMobile();
  const count      = mobile ? 2 : Math.min(assets.length, 5);

  for (let i = 0; i < count; i++) {
    const asset  = assets[i % assets.length];
    const layout = LAYOUT[i];

    const plane = createPhotoPlane({
      src: asset.srcs.content,
      width: asset.origW,
      height: asset.origH,
      planeHeight: layout.h,
      position: { x: layout.x, y: layout.y, z: layout.z },
      rotation: { x: 0, y: layout.ry, z: 0 },
      parallax: asset.parallaxStrength,
    });

    threeScene.add(plane.mesh);
    planes.push(plane);
    await plane.load();
    revealPlane(plane.mesh.material, i * 0.18);
  }

  offPointer = onPointer((nx, ny) => {
    planes.forEach((p, i) => {
      const str = 0.8 - i * 0.12;
      p.setParallax(nx * -0.03 * str, ny * 0.02 * str);
    });
  });

  if (!reducedMotion) {
    const trigger = document.querySelector('[data-scene="environmentalDepth"]');
    scrollTrigger = scrollScene({
      trigger,
      onUpdate: (prog) => {
        camera.position.x = -2 + prog * 4;
        camera.position.y =  0.5 - prog * 0.8;
        camera.position.z =  5.5 - prog * 0.7;
      },
    });
  }
}

export function tickEnvironmentalDepth() {
  planes.forEach(p => p.tick());
}

export function disposeEnvironmentalDepth() {
  offPointer && offPointer();
  scrollTrigger && scrollTrigger.kill();
  const threeScene = getScene();
  planes.forEach(p => { threeScene.remove(p.mesh); p.dispose(); });
  planes = [];
}
