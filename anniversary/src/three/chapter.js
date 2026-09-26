// Chapter — one spatial scene living in its own region of the world.
//
// Wraps a scene definition (src/scenes/*.js) with the shared lifecycle:
//   build  → planes created (no GPU memory yet)
//   load   → textures acquired (window: current ±1)
//   show   → group visible
//   enter  → one-time reveal + scene hook
//   unload → textures released (window: ≥ 3 away)
import * as THREE from 'three';
import gsap from 'gsap';
import { createPhotoPlane } from './photoPlane.js';
import { photosForChapter } from '../content/photos.js';

export function createChapter(contract, def, engine) {
  const group = new THREE.Group();
  group.name = contract.id;
  group.position.fromArray(contract.origin);
  group.visible = false;

  const planes = [];
  let built = false;
  let loaded = false;
  let revealed = false;

  const ctx = {
    contract,
    group,
    planes,
    engine,
    photos: photosForChapter(contract.id),
    state: {},
    get mobile() { return engine.mobile; },
    get reduced() { return engine.reduced; },
    get tier() { return engine.tier; },

    /** Add a photo plane to this chapter. */
    add(photo, opts = {}) {
      const plane = createPhotoPlane(photo, { grade: contract.grade, ...opts });
      plane.manualReveal = !!opts.manualReveal;
      plane.focusable = !!opts.focusable;
      group.add(plane.mesh);
      planes.push(plane);
      return plane;
    },
  };

  function build() {
    if (built) return;
    built = true;
    def.build?.(ctx);
    engine.scene.add(group);
  }

  function reveal() {
    let i = 0;
    for (const plane of planes) {
      if (plane.manualReveal) continue;
      const delay = i++ * 0.14;
      const run = () => {
        if (engine.reduced) {
          gsap.to(plane.uniforms.uReveal, { value: 1, duration: 0.6, ease: 'power1.out' });
        } else {
          gsap.to(plane.uniforms.uReveal, { value: 1, duration: 2.2, delay, ease: 'power2.out' });
        }
      };
      plane.loaded ? run() : plane.load().then(run);
    }
  }

  return {
    id: contract.id,
    contract,
    group,
    planes,
    ctx,

    build,

    load() {
      build();
      if (loaded) return Promise.resolve();
      loaded = true;
      return Promise.all(planes.map(p => p.load()));
    },

    unload() {
      if (!loaded) return;
      loaded = false;
      planes.forEach(p => p.unload());
    },

    setVisible(v) {
      group.visible = v && built;
    },

    enter() {
      if (!revealed) {
        revealed = true;
        reveal();
      }
      def.enter?.(ctx);
    },

    leave() {
      def.leave?.(ctx);
    },

    /** Camera pose in world space for local progress q ∈ [0, 1]. */
    pose(q) {
      const { pos, target } = def.pose(q, ctx);
      const o = contract.origin;
      return {
        pos: [pos[0] + o[0], pos[1] + o[1], pos[2] + o[2]],
        target: [target[0] + o[0], target[1] + o[1], target[2] + o[2]],
      };
    },

    /** Dim factor for the whole canvas while this chapter is current. */
    dim(q) {
      return def.dim ? def.dim(q, ctx) : 1;
    },

    update(q, dt, camera) {
      if (!group.visible) return;
      def.update?.(q, dt, ctx);
      for (const p of planes) p.updateFade(camera);
    },
  };
}
