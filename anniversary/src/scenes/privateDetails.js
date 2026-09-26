// SCENE 05 — Private Details
// Density drops. The camera barely moves; small inserts rest slightly soft and
// come into focus under the pointer (blur → sharp, tiny scale). On touch the
// frame nearest the centre of the screen is the sharp one — nothing is
// hover-only (AC-06). Supporting motion: micro rotation settling on reveal.
import { lerp3, easeSine, damp } from '../utils/math.js';

const REST_BLUR = 0.3;

// [x, y, z, rotZ, height]
const DESKTOP = [
  [-2.65,  0.95, -0.4,  0.035, 1.55],
  [-0.85,  1.3,  -1.3, -0.02,  1.15],
  [ 0.95,  0.8,  -0.2,  0.02,  1.6],
  [ 2.75,  1.0,  -1.1, -0.03,  1.3],
  [-2.0,  -1.05, -0.9, -0.02,  1.45],
  [-0.2,  -0.95,  0.2,  0.03,  1.25],
  [ 1.6,  -1.25, -0.7, -0.015, 1.1],
  [ 3.25, -0.6,  -1.9,  0.025, 1.35],
];
const MOBILE = [
  [-0.5,  1.0,  0.0,  0.03, 1.35],
  [ 0.55, 0.4, -0.8, -0.02, 1.3],
  [-0.45,-0.75,-0.5, -0.025,1.3],
  [ 0.5, -1.35, 0.0,  0.02, 1.2],
];

export default {
  build(ctx) {
    const slots = ctx.mobile ? MOBILE : DESKTOP;
    slots.forEach(([x, y, z, rz, h], i) => {
      ctx.add(ctx.photos[i % ctx.photos.length], {
        height: h, pos: [x, y, z], rot: [0, 0, rz], blur: REST_BLUR,
      });
    });
  },

  pose(q, ctx) {
    const t = easeSine(q);
    const z0 = ctx.mobile ? 6.4 : 6.3;
    return {
      pos: lerp3([0, 0.05, z0], [0.15, -0.1, z0 - 0.6], t),
      target: [0.1, 0, -1],
    };
  },

  update(q, dt, ctx) {
    const e = ctx.engine;
    const active = ctx.reduced ? null : (e.touch ? e.nearestToCentre(ctx.planes) : e.pick(ctx.planes));
    if (!e.touch) e.setCursorHover(!!active, 'details');
    const k = damp(6, dt);

    for (const p of ctx.planes) {
      const u = p.uniforms;
      const isActive = p === active;
      const blurGoal = ctx.reduced ? 0 : isActive ? 0 : REST_BLUR;
      u.uBlur.value += (blurGoal - u.uBlur.value) * k;

      const s = isActive ? 1.035 : 1; // PRD §11: 1–4 % scale
      p.mesh.scale.x += (p.base.scale.x * s - p.mesh.scale.x) * k;
      p.mesh.scale.y += (p.base.scale.y * s - p.mesh.scale.y) * k;

      // micro rotation: tilted a little more while unrevealed, settles as it appears
      p.mesh.rotation.z = p.base.rot.z * (1 + (1 - u.uReveal.value) * 2.5);
    }
  },

  leave(ctx) {
    ctx.engine.setCursorHover(false, 'details');
  },
};
