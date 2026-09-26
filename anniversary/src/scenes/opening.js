// SCENE 01 — Opening Frame
// One hero on a plane. Dominant: slow camera push. Supporting: shallow tilt.
// The chapter ends with the camera passing *through* the frame (PRD §23 A).
import { lerp, smoothstep, easeIn } from '../utils/math.js';

export default {
  build(ctx) {
    const [hero] = ctx.photos;
    ctx.state.hero = ctx.add(hero, {
      height: ctx.mobile ? 3.3 : 3.4,
      quality: 'hero',
    });
  },

  pose(q, ctx) {
    // Hold wide for the first half (typography reads), then push in and through.
    const hold = smoothstep(0, 0.6, q);
    const push = easeIn(smoothstep(0.55, 1, q));
    const z = lerp(lerp(7.4, 5.6, hold), 0.9, push);
    // mobile: camera sits lower → frame reads higher, title gets the bottom third
    const drop = ctx.mobile ? lerp(-1.05, 0, push) : 0;
    return {
      pos: [0, lerp(0.12, -0.04, q) + drop, z],
      target: [0, drop, -4],
    };
  },

  update(q, dt, ctx) {
    const { hero } = ctx.state;
    // typography steps aside before the push so it never sits on the magnified frame
    const meta = ctx.engine.sectionOf('opening')?.querySelector('.chapter__meta--opening');
    if (meta) meta.style.opacity = (1 - smoothstep(0.42, 0.6, q)).toFixed(3);
    if (!hero || ctx.reduced) return;
    const p = ctx.engine.pointer;
    // 2° max on the primary plane (PRD §10)
    hero.mesh.rotation.y = p.x * 0.035;
    hero.mesh.rotation.x = -p.y * 0.022;
  },
};
