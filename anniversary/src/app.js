// app.js — lifecycle and scene orchestration (PRD §32.2).
//
// One renderer, one camera, one scroll. Chapters live in their own regions of
// the world; each frame the scroll position is mapped to a camera goal, the rig
// follows, and only the chapters near the camera are loaded and drawn.
import * as THREE from 'three';
import gsap from 'gsap';

import { initRenderer, onResize, setMaxDpr } from './three/renderer.js';
import { initCamera, fitCamera, createRig } from './three/camera.js';
import { initScene, globals } from './three/scene.js';
import { configureTextures, textureStats } from './three/textures.js';
import { createChapter } from './three/chapter.js';
import { disposeGroup } from './three/dispose.js';

import { initPointer, updatePointer, pointer } from './motion/pointer.js';
import { initScroll, readScroll, measure } from './motion/scroll.js';
import { reducedMotion, onReducedMotionChange } from './motion/easing.js';
import { revealText, revealOnScroll, refreshScrollTriggers } from './motion/timeline.js';

import { chapters as contracts, ENTRY_POSE, ENTRY_FOG } from './content/scenes.js';

import opening from './scenes/opening.js';
import frameField from './scenes/frameField.js';
import environmentalDepth from './scenes/environmentalDepth.js';
import reflectivePassage from './scenes/reflectivePassage.js';
import privateDetails from './scenes/privateDetails.js';
import nightSpace from './scenes/nightSpace.js';
import coupleArchive from './scenes/coupleArchive.js';
import quietCounterpoint from './scenes/quietCounterpoint.js';
import letterScene, { initLetterReveal } from './scenes/letter.js';
import finalFrame from './scenes/finalFrame.js';
import { initEntry } from './scenes/entry.js';

import { initAudio, unlockAudio, setAudioLevel } from './audio/controller.js';
import { buildChapters, el } from './ui/chapters.js';
import { initProgress, showProgress, setProgress } from './ui/progress.js';
import { initControls } from './ui/controls.js';
import { initCursor, enableCursor, setCursorHover, updateCursor } from './ui/cursor.js';
import { initDebug, updateDebug } from './ui/debug.js';

import { detectTier, createFpsMonitor, TIERS } from './utils/performance.js';
import { isMobile, isTouch } from './utils/viewport.js';
import { lerp, lerp3, clamp, easeInOut, damp } from './utils/math.js';

const DEFS = {
  opening, frameField, environmentalDepth, reflectivePassage, privateDetails,
  nightSpace, coupleArchive, quietCounterpoint, letter: letterScene, finalFrame,
};

// Where the camera holds in each chapter under prefers-reduced-motion.
const REDUCED_Q = { opening: 0.25, frameField: 0.15, reflectivePassage: 0.4, coupleArchive: 0.6, finalFrame: 1 };

const raycaster = new THREE.Raycaster();
const _v = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _n = new THREE.Vector3();
const _ndc = new THREE.Vector2();

export async function initApp() {
  history.scrollRestoration = 'manual';

  let tier = detectTier();
  const tierCfg = () => TIERS[tier];

  // ── Three core ─────────────────────────────────────────────
  const renderer = initRenderer(document.getElementById('experience'), { dpr: tierCfg().dpr });
  const camera = initCamera();
  const scene = initScene();
  const rig = createRig(camera);
  configureTextures(renderer, { anisotropy: tierCfg().anisotropy });
  globals.uGrain.value = tierCfg().grain;

  // ── DOM ────────────────────────────────────────────────────
  const chaptersRoot = document.getElementById('chapters');
  const sections = buildChapters(chaptersRoot);
  const sectionById = Object.fromEntries(sections.map(s => [s.dataset.scene, s]));
  const focusBack = document.getElementById('focus-back');

  initPointer();
  initCursor();
  initAudio();
  initControls();
  initProgress();
  initDebug();

  // ── Engine facade handed to scene modules ──────────────────
  let focus = null; // { plane, pose, scrollY, button }

  const engine = {
    scene,
    camera,
    tier,
    mobile: isMobile(),
    touch: isTouch(),
    reduced: reducedMotion,
    pointer: pointer.smooth,
    get focusedPlane() { return focus ? focus.plane : null; },

    sectionOf: id => sectionById[id],
    setCursorHover,

    pick(planes) {
      if (!pointer.active || engine.touch) return null;
      return pickNdc(pointer.ndc.x, pointer.ndc.y, planes);
    },

    pickAt(clientX, clientY, planes) {
      return pickNdc((clientX / innerWidth) * 2 - 1, -(clientY / innerHeight) * 2 + 1, planes);
    },

    nearestToCentre(planes) {
      let best = null;
      let bestD = Infinity;
      for (const p of planes) {
        if (!isPickable(p)) continue;
        p.mesh.getWorldPosition(_v).project(camera);
        if (_v.z > 1) continue;
        const d = _v.x * _v.x + _v.y * _v.y;
        if (d < bestD) { bestD = d; best = p; }
      }
      return best;
    },

    focusPlane(plane, button = null) {
      const pose = focusPose(plane);
      focus = { plane, pose, scrollY: window.scrollY, button };
      document.body.classList.add('is-focused');
      focusBack.hidden = false;
    },

    releaseFocus() {
      if (!focus) return;
      const { button } = focus;
      focus = null;
      document.body.classList.remove('is-focused');
      focusBack.hidden = true;
      if (button && document.activeElement === focusBack) button.focus({ preventScroll: true });
    },

    /** Keyboard access to the archive frames: one real button per plane. */
    buildFocusButtons(ctx) {
      const section = sectionById[ctx.contract.id];
      section.querySelector('.focus-list')?.remove();
      section.querySelector('.chapter__hint')?.remove();
      const list = el('div', { class: 'focus-list', role: 'group', 'aria-label': 'Frames' });
      ctx.planes.forEach((plane, i) => {
        const btn = el('button', {
          type: 'button',
          class: 'focus-list__btn t-index',
          text: `Frame ${String(i + 1).padStart(2, '0')}`,
          'aria-label': `Lihat frame ${i + 1}${plane.photo.alt ? `: ${plane.photo.alt}` : ''}`,
        });
        btn.addEventListener('click', () => engine.focusPlane(plane, btn));
        list.append(btn);
      });
      const hint = el('p', {
        class: 'chapter__hint t-index',
        'aria-hidden': 'true',
        text: engine.touch ? 'tap a frame' : 'select a frame',
      });
      // inside the sticky meta: focusing a button never scrolls the page away
      const meta = section.querySelector('.chapter__meta') || section;
      meta.append(hint, list);
    },
  };

  function isPickable(p) {
    const u = p.uniforms;
    return p.mesh.parent?.visible && u.uReveal.value > 0.5 && u.uFade.value > 0.5 && u.uOpacity.value > 0.3;
  }

  function pickNdc(x, y, planes) {
    _ndc.set(x, y);
    raycaster.setFromCamera(_ndc, camera);
    const meshes = planes.filter(isPickable).map(p => p.mesh);
    const hit = raycaster.intersectObjects(meshes, false)[0];
    return hit ? hit.object.userData.plane : null;
  }

  function focusPose(plane) {
    plane.mesh.getWorldPosition(_v);
    plane.mesh.getWorldQuaternion(_q);
    _n.set(0, 0, 1).applyQuaternion(_q);
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const dH = plane.height / 0.74 / (2 * tanV);
    const dW = plane.width / 0.86 / (2 * tanV * camera.aspect);
    const d = Math.max(dH, dW);
    const c = _v.toArray();
    return { pos: [c[0] + _n.x * d, c[1] + _n.y * d, c[2] + _n.z * d], target: c };
  }

  focusBack.addEventListener('click', () => engine.releaseFocus());
  window.addEventListener('keydown', e => { if (e.key === 'Escape') engine.releaseFocus(); });

  // ── World ──────────────────────────────────────────────────
  // Build every chapter up front: meshes + DOM hooks only, no textures yet.
  let world = contracts.map(c => createChapter(c, DEFS[c.id], engine));
  world.forEach(ch => ch.build());
  let current = -1;
  let phase = 'entry';

  function applyWindow(index) {
    world.forEach((ch, i) => {
      const d = i - index;
      if (Math.abs(d) <= 1) { ch.load(); ch.setVisible(true); }
      else if (d === 2 || d === -2) { if (d === 2) ch.load(); ch.setVisible(false); }
      else { ch.setVisible(false); ch.unload(); }
    });
  }

  function setChapter(index) {
    if (index === current) return;
    const prev = current;
    current = index;
    if (prev >= 0) world[prev].leave();
    engine.releaseFocus();
    applyWindow(index);
    world[index].enter();
    setProgress(index);
    setAudioLevel(world[index].contract.audio);
    document.body.dataset.chapter = world[index].id;

    // Quiet cut under reduced motion: no travel, just a short fade (PRD §23 D).
    if (engine.reduced && prev >= 0) {
      gsap.fromTo(state, { cut: 0 }, { cut: 1, duration: 0.6, ease: 'power1.out' });
    }
  }

  function rebuildWorld() {
    world.forEach(ch => { ch.leave(); disposeGroup(ch.group, scene); });
    world = contracts.map(c => createChapter(c, DEFS[c.id], engine));
    world.forEach(ch => ch.build());
    const idx = Math.max(current, 0);
    current = -1;
    if (phase === 'entry') { world[0].load(); world[0].setVisible(true); world[0].enter(); }
    else setChapter(idx);
  }

  // ── Frame state ────────────────────────────────────────────
  const state = { cut: 1, dim: 1, fogNear: ENTRY_FOG[0], fogFar: ENTRY_FOG[1] };
  const bg = new THREE.Color(contracts[0].bg);
  const bgGoal = new THREE.Color();
  let lastBgHex = '';

  function innerQ(i, local) {
    const T = i === 0 ? 0 : world[i].contract.enter;
    const p = local(i);
    return T ? clamp((p - T) / (1 - T)) : p;
  }

  function journeyGoal() {
    const { index, progress, local } = readScroll();
    setChapter(index);
    const ch = world[index];

    let pose;
    if (focus) {
      pose = focus.pose;
      if (Math.abs(window.scrollY - focus.scrollY) > 90) engine.releaseFocus();
    } else if (engine.reduced) {
      pose = ch.pose(REDUCED_Q[ch.id] ?? 0.5);
    } else {
      const T = index === 0 ? 0 : ch.contract.enter;
      if (progress < T) {
        const a = world[index - 1].pose(1);
        const b = ch.pose(0);
        const t = easeInOut(progress / T);
        pose = { pos: lerp3(a.pos, b.pos, t), target: lerp3(a.target, b.target, t) };
      } else {
        pose = ch.pose(T ? (progress - T) / (1 - T) : progress);
      }
    }
    rig.setGoal(pose.pos, pose.target);
    return { index, local, ch };
  }

  // ── Loop ───────────────────────────────────────────────────
  const fps = createFpsMonitor(tier, next => {
    tier = next;
    engine.tier = next;
    setMaxDpr(TIERS[next].dpr);
    globals.uGrain.value = TIERS[next].grain;
  });

  let last = performance.now();
  let debugAcc = 0;

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (document.hidden) return;

    globals.uTime.value = now / 1000;
    updatePointer(dt, !engine.reduced);
    updateCursor(dt);

    let sway = contracts[0].sway;
    let dimGoal = 1;
    let fogGoal = ENTRY_FOG;
    let bgHex = contracts[0].bg;

    if (phase === 'entry') {
      rig.setGoal(ENTRY_POSE.pos, ENTRY_POSE.target);
      world[0].update(0, dt, camera);
    } else {
      const { index, local, ch } = journeyGoal();
      sway = ch.contract.sway;
      fogGoal = ch.contract.fog;
      bgHex = ch.contract.bg;
      dimGoal = ch.dim(innerQ(index, local));
      for (let i = Math.max(0, index - 1); i <= Math.min(world.length - 1, index + 1); i++) {
        world[i].update(innerQ(i, local), dt, camera);
      }
    }

    rig.update(dt, pointer.smooth, engine.reduced ? 0 : sway);

    const k = damp(2.2, dt);
    state.dim = lerp(state.dim, dimGoal, k);
    state.fogNear = lerp(state.fogNear, fogGoal[0], k);
    state.fogFar = lerp(state.fogFar, fogGoal[1], k);
    globals.uDim.value = state.dim * state.cut;
    globals.uFogNear.value = state.fogNear;
    globals.uFogFar.value = state.fogFar;

    bg.lerp(bgGoal.set(bgHex), k);
    globals.uFogColor.value.copy(bg);
    renderer.setClearColor(bg, 1);
    const hex = `#${bg.getHexString()}`;
    if (hex !== lastBgHex) {
      lastBgHex = hex;
      document.documentElement.style.setProperty('--bg-live', hex);
    }

    renderer.render(scene, camera);
    fps.sample(dt);

    debugAcc += dt;
    if (debugAcc > 0.25) {
      debugAcc = 0;
      const t = textureStats();
      updateDebug({
        fps: fps.fps.toFixed(0),
        tier,
        chapter: current >= 0 ? world[current].id : 'entry',
        textures: `${t.resident} resident / ${renderer.info.memory.textures} gpu`,
        visible: world.filter(c => c.group.visible).map(c => c.id).join(', '),
        calls: renderer.info.render.calls,
        dim: globals.uDim.value.toFixed(3),
      });
    }
  }

  // ── Resize / preference changes ────────────────────────────
  let rebuildTimer = 0;
  onResize((w, h) => {
    fitCamera(w, h);
    engine.touch = isTouch();
    const mobile = isMobile();
    if (mobile !== engine.mobile) {
      engine.mobile = mobile;
      clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(rebuildWorld, 250);
    }
    if (focus) focus.pose = focusPose(focus.plane);
  });

  onReducedMotionChange(v => { engine.reduced = v; });

  // ── Entry: the opening frame waits far away in the dark ────
  world[0].load();
  world[0].setVisible(true);
  world[0].enter();
  rig.setGoal(ENTRY_POSE.pos, ENTRY_POSE.target);
  rig.snap();
  requestAnimationFrame(frame);

  const entry = initEntry({ onEnter });

  // Critical assets: the opening hero, then the first frames of the field.
  const critical = [world[0], world[1]];
  critical.forEach(c => c.build());
  const criticalPlanes = critical.flatMap(c => c.planes);
  let done = 0;
  const tick = () => entry.setProgress(++done / criticalPlanes.length);
  const heroReady = world[0].load();
  world[1].load();
  criticalPlanes.forEach(p => p.load().then(tick));
  await Promise.race([heroReady, new Promise(r => setTimeout(r, 6000))]);
  entry.ready();

  function onEnter() {
    unlockAudio(); // inside the click gesture (PRD §12)

    phase = 'journey';
    document.body.classList.add('is-entered');
    chaptersRoot.hidden = false;
    window.scrollTo(0, 0);
    initScroll(sections);
    measure();
    showProgress();
    enableCursor();

    // Slow, cinematic first flight from the far entry pose into the opening.
    rig.lambda = engine.reduced ? 3.2 : 0.9;
    if (!engine.reduced) gsap.to(rig, { lambda: 3.2, duration: 4, delay: 1.2, ease: 'power1.in' });

    revealText(sectionById.opening.querySelectorAll('[data-reveal-hero]'), { delay: engine.reduced ? 0 : 1.4, stagger: 0.18 });
    revealOnScroll(document.querySelectorAll('.chapter__meta:not(.chapter__meta--opening)'), { start: 'top 70%' });
    initLetterReveal(sectionById.letter);
    requestAnimationFrame(() => { measure(); refreshScrollTriggers(); });
    document.fonts?.ready.then(() => { measure(); refreshScrollTriggers(); });
  }
}
