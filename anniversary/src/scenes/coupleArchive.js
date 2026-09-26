// SCENE 07 — Couple Archive
// Emotional core. No grid: an asymmetric deep archive, 3–5 depth layers.
// Dominant: stack displacement — the frames start stacked behind the primary
// and slide out to their places (PRD §23 C). Supporting: pointer hierarchy
// (primary tilts most, secondaries lag). Interaction: select a frame and the
// camera flies to it; Esc / back / scrolling returns.
import { lerp, lerp3, smoothstep, easeInOut, easeSine, damp } from '../utils/math.js';

// [x, y, z, height] — first is the primary.
const DESKTOP = [
  [ 0.25,  0.05,  0.0, 3.4],
  [-2.55,  0.75, -1.4, 2.6],
  [ 2.8,  -0.9,  -2.2, 1.85],
  [-1.5,  -1.6,  -3.3, 1.6],
  [ 2.3,   1.45, -4.2, 1.9],
];
const MOBILE = [
  [ 0.0,  0.3,  0.0, 3.0],
  [-0.5, -1.15, -1.6, 2.1],
  [ 0.5,  1.35, -2.6, 1.3],
];

export default {
  build(ctx) {
    const slots = ctx.mobile ? MOBILE : DESKTOP;
    ctx.state.slots = slots;
    slots.forEach(([x, y, z, h], i) => {
      const plane = ctx.add(ctx.photos[i % ctx.photos.length], {
        height: h, pos: [x, y, z], focusable: true,
      });
      plane.layer = i; // 0 = primary
    });
    ctx.engine.buildFocusButtons(ctx);
  },

  pose(q, ctx) {
    const t = easeSine(q);
    const z0 = ctx.mobile ? 7.0 : 7.6;
    return {
      pos: lerp3([0, 0.1, z0], [0.2, 0.05, z0 - 1.3], t),
      target: [0.1, 0, -1.6],
    };
  },

  update(q, dt, ctx) {
    const open = ctx.reduced ? 1 : easeInOut(smoothstep(0.0, 0.45, q));
    const p = ctx.engine.pointer;
    const focused = ctx.engine.focusedPlane;
    const k = damp(5, dt);

    ctx.planes.forEach((plane, i) => {
      const [x, y, z] = ctx.state.slots[i];
      const m = plane.mesh;

      if (i > 0) {
        // stacked just behind the primary → displaced to its slot
        const sx = 0.25 + i * 0.07;
        const sy = 0.05 - i * 0.05;
        const sz = -0.3 * i;
        m.position.set(lerp(sx, x, open), lerp(sy, y, open), lerp(sz, z, open));
        m.rotation.z = lerp((i % 2 ? -1 : 1) * 0.05, (i % 2 ? -1 : 1) * 0.012, open);
      }

      if (!ctx.reduced) {
        // hierarchy: primary ~3°, secondaries progressively less
        const w = i === 0 ? 1 : 0.35 / i;
        m.rotation.y += (p.x * 0.05 * w - m.rotation.y) * k;
        m.rotation.x += (-p.y * 0.035 * w - m.rotation.x) * k;
      }

      const opacityGoal = focused && focused !== plane ? 0.14 : 1;
      plane.uniforms.uOpacity.value += (opacityGoal - plane.uniforms.uOpacity.value) * k;
    });

    if (!ctx.engine.touch) {
      ctx.engine.setCursorHover(!focused && !!ctx.engine.pick(ctx.planes), 'archive');
    }
  },

  enter(ctx) {
    const e = ctx.engine;
    ctx.state.onClick = ev => {
      if (ev.target.closest('button, a, nav')) return;
      const hit = e.pickAt(ev.clientX, ev.clientY, ctx.planes);
      if (hit && hit !== e.focusedPlane) e.focusPlane(hit);
      else if (e.focusedPlane) e.releaseFocus();
    };
    window.addEventListener('click', ctx.state.onClick);
  },

  leave(ctx) {
    window.removeEventListener('click', ctx.state.onClick);
    ctx.engine.releaseFocus();
    ctx.engine.setCursorHover(false, 'archive');
  },
};
