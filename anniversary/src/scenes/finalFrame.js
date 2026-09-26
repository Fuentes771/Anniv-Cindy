// SCENE 10 — Final Frame · "a small world"
// Back to the frame we entered through. The camera slowly pulls back and every
// frame passed on the way re-appears around it, small and far, as one archive —
// the world that exists because of the anniversary (PRD §46). Then the visuals
// stop, dim, and only the final line remains (PRD §7 Scene 10).
import { lerp, smoothstep, easeInOut } from '../utils/math.js';
import { journeyPhotos } from '../content/photos.js';
import { TIERS } from '../utils/performance.js';

export default {
  build(ctx) {
    const [hero] = ctx.photos;
    ctx.state.hero = ctx.add(hero, { height: ctx.mobile ? 3.1 : 3.3 });

    const limit = Math.min(TIERS[ctx.tier].archive, ctx.mobile ? 14 : Infinity);
    const others = journeyPhotos().filter(p => p.key !== hero.key).slice(0, limit);
    const sx = ctx.mobile ? 0.62 : 1.45;
    const sy = ctx.mobile ? 1.15 : 0.78;

    ctx.state.archive = others.map((photo, i) => {
      // golden-angle spiral: even, organic spacing without a grid
      const a = i * 2.39996 + 0.9;
      const r = 1.2 + Math.sqrt(i + 1) * 1.2;
      const plane = ctx.add(photo, {
        height: 1.25 + ((i * 7) % 5) * 0.16,
        pos: [Math.cos(a) * r * sx, Math.sin(a) * r * sy, -2.2 - r * 1.1 - (i % 3) * 0.7],
        rot: [0, -Math.cos(a) * 0.08, ((i % 5) - 2) * 0.01],
        quality: 'thumb',
        manualReveal: true,
      });
      plane.revealAt = 0.14 + 0.5 * (i / others.length);
      return plane;
    });
  },

  pose(q, ctx) {
    const pull = easeInOut(smoothstep(0.04, 0.86, q));
    const far = ctx.mobile ? 23 : 21;
    return {
      pos: [0, lerp(0, 0.9, pull), lerp(5.2, far, pull)],
      target: [0, lerp(0, -0.4, pull), -5],
    };
  },

  update(q, dt, ctx) {
    for (const p of ctx.state.archive) {
      p.uniforms.uReveal.value = ctx.reduced ? 1 : smoothstep(p.revealAt, p.revealAt + 0.12, q);
    }
    const line = ctx.engine.sectionOf('finalFrame')?.querySelector('.final__line');
    if (line) {
      const t = smoothstep(0.84, 0.95, q);
      line.style.opacity = t.toFixed(3);
      line.style.transform = ctx.reduced ? 'none' : `translateY(${(1 - t) * 14}px)`;
    }
  },

  // Visual stops; only the line is left.
  dim(q) {
    return 1 - 0.82 * smoothstep(0.8, 0.96, q);
  },
};
