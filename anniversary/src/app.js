// app.js — lifecycle and scene orchestration
import { initRenderer, getRenderer } from './three/renderer.js';
import { initCamera, getCamera } from './three/camera.js';
import { initScene, getScene } from './three/scene.js';

import { initPointer } from './motion/pointer.js';

import { initEntry } from './scenes/entry.js';
import { initOpening, tickOpening, disposeOpening }                         from './scenes/opening.js';
import { initFrameField, tickFrameField, disposeFrameField }                from './scenes/frameField.js';
import { initEnvironmentalDepth, tickEnvironmentalDepth, disposeEnvironmentalDepth } from './scenes/environmentalDepth.js';
import { initReflectivePassage, tickReflectivePassage, disposeReflectivePassage }    from './scenes/reflectivePassage.js';
import { initPrivateDetails, tickPrivateDetails, disposePrivateDetails }    from './scenes/privateDetails.js';
import { initNightSpace, tickNightSpace, disposeNightSpace }                from './scenes/nightSpace.js';
import { initCoupleArchive, tickCoupleArchive, disposeCoupleArchive }       from './scenes/coupleArchive.js';
import { initQuietCounterpoint, tickQuietCounterpoint, disposeQuietCounterpoint } from './scenes/quietCounterpoint.js';
import { initLetter, disposeLetter }                                        from './scenes/letter.js';
import { initFinalFrame, tickFinalFrame, disposeFinalFrame }                from './scenes/finalFrame.js';

import { unlockAudio } from './audio/controller.js';
import { initCursor } from './ui/cursor.js';
import { initControls, showControls, initProgress } from './ui/controls.js';

import { criticalPhotos } from './content/photos.js';
import { preloadImages } from './utils/preload.js';

// Tickers for active scenes (IntersectionObserver manages which are active)
const tickers = new Map();

function registerTick(id, fn) { tickers.set(id, fn); }

async function onEnter() {
  // User clicked Enter — unlock audio, show controls
  unlockAudio();
  showControls();
  initProgress();

  // Show scroll container
  const scrollContainer = document.getElementById('scroll-container');
  scrollContainer.style.display = 'block';

  // Init all scenes in background (lazy via IntersectionObserver)
  // Critical scenes first
  await initOpening();
  registerTick('opening', tickOpening);

  // Lazy init remaining scenes when their section enters viewport
  const lazyInits = {
    frameField:          () => initFrameField().then(()          => registerTick('frameField', tickFrameField)),
    environmentalDepth:  () => initEnvironmentalDepth().then(()  => registerTick('environmentalDepth', tickEnvironmentalDepth)),
    reflectivePassage:   () => initReflectivePassage().then(()   => registerTick('reflectivePassage', tickReflectivePassage)),
    privateDetails:      () => initPrivateDetails().then(()      => registerTick('privateDetails', tickPrivateDetails)),
    nightSpace:          () => initNightSpace().then(()          => registerTick('nightSpace', tickNightSpace)),
    coupleArchive:       () => initCoupleArchive().then(()       => registerTick('coupleArchive', tickCoupleArchive)),
    quietCounterpoint:   () => initQuietCounterpoint().then(()   => registerTick('quietCounterpoint', tickQuietCounterpoint)),
    letter:              () => { initLetter(); },
    finalFrame:          () => initFinalFrame().then(()          => registerTick('finalFrame', tickFinalFrame)),
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.dataset.scene;
      if (entry.isIntersecting && lazyInits[id]) {
        lazyInits[id]();
        delete lazyInits[id]; // init once
      }
    });
  }, { rootMargin: '200px 0px', threshold: 0 });

  document.querySelectorAll('[data-scene]').forEach(el => {
    if (el.dataset.scene !== 'entry') io.observe(el);
  });
}

export async function initApp() {
  // Three.js core
  const renderer = initRenderer();
  const camera   = initCamera();
  const scene    = initScene();

  // Pointer
  initPointer();

  // UI
  initCursor();
  initControls();

  // Preload critical assets in background
  preloadImages(criticalPhotos.map(p => p.srcs.content)).catch(() => {});

  // Entry scene (visible immediately)
  initEntry({ onEnter });

  // Render loop
  function animate() {
    requestAnimationFrame(animate);
    tickers.forEach(fn => fn());
    renderer.render(scene, camera);
  }
  animate();
}
