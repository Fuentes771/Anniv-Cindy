// PhotoMaterial — the single shader every photograph is drawn with.
//
// One program, per-plane uniforms. It does only what the photos need:
//   • cover-crop around a focal point, so faces/hands are never cut (PRD §20)
//   • reveal: noisy wipe + blur→sharp via mip bias (PRD §7, §22)
//   • scene-level grade: tint / saturation / black point (PRD §18)
//   • slit mask for the mirror passage (PRD §23 B)
//   • proximity fade when the camera passes through a frame (PRD §23 A)
//   • fog + dim toward the background, fine grain (PRD §4.3)
// No bloom, no chromatic aberration, no displacement on faces.
import * as THREE from 'three';
import { globals } from './scene.js';
import { GRADES } from '../content/scenes.js';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uHasMap;
  uniform vec3  uColor;
  uniform vec2  uCover;
  uniform vec2  uOffset;
  uniform float uReveal;
  uniform float uBlur;
  uniform float uOpacity;
  uniform float uFade;
  uniform vec3  uTint;
  uniform float uSat;
  uniform float uBlack;
  uniform vec4  uMask;     // x: centre (uv), y: half width, z: softness, w: enabled
  uniform float uTime;
  uniform float uDim;
  uniform float uGrain;
  uniform vec3  uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;

  varying vec2 vUv;
  varying float vDepth;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Soft focus: a small rotated ring of taps at a moderate mip bias. Smoother
  // than a single high-bias lookup, which turns blocky on low-res sources.
  vec3 sampleSoft(vec2 uv, float bias) {
    if (bias < 0.05) return texture2D(uMap, uv).rgb;
    vec2 r = vec2(0.0065, 0.0065 * uCover.x / max(uCover.y, 0.001)) * bias;
    float b = bias * 0.55;
    vec3 c = texture2D(uMap, uv, b).rgb * 0.2;
    c += texture2D(uMap, uv + r * vec2( 0.95,  0.31), b).rgb * 0.16;
    c += texture2D(uMap, uv + r * vec2(-0.31,  0.95), b).rgb * 0.16;
    c += texture2D(uMap, uv + r * vec2(-0.95, -0.31), b).rgb * 0.16;
    c += texture2D(uMap, uv + r * vec2( 0.31, -0.95), b).rgb * 0.16;
    c += texture2D(uMap, uv + r * vec2( 0.59,  0.81) * 0.5, b).rgb * 0.16;
    return c;
  }

  void main() {
    vec2 uv = uOffset + vUv * uCover;

    // Unrevealed = soft; revealed = sharp. uBlur adds depth-of-field / hover softness.
    float bias = uBlur * 4.0 + (1.0 - uReveal) * 3.5;
    vec3 col = uColor;
    if (uHasMap > 0.5) col = sampleSoft(uv, bias);

    // Grade (linear space).
    float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col = mix(vec3(l), col, uSat) * uTint;
    col = clamp((col - uBlack) / (1.0 - uBlack), 0.0, 1.0);
    col -= pow(max(col - 0.82, 0.0), vec3(2.0)) * 1.2; // restrained highlights

    // Grain: atmosphere, not a filter.
    col += (hash(vUv * vec2(1733.0, 977.0) + fract(uTime * 0.61)) - 0.5) * uGrain;

    // Reveal: an organic wipe rising from the bottom edge.
    float n = vnoise(vUv * vec2(4.0, 6.0)) * 0.38 + vUv.y * 0.62;
    float reveal = smoothstep(n, n + 0.25, uReveal * 1.25);

    // Slit mask (mirror seam).
    float mask = 1.0;
    if (uMask.w > 0.5) {
      float d = abs(vUv.x - uMask.x);
      mask = 1.0 - smoothstep(uMask.y, uMask.y + uMask.z, d);
    }

    // Hairline anti-aliased edge instead of a border.
    vec2 e = smoothstep(vec2(0.0), vec2(0.004), vUv) * smoothstep(vec2(0.0), vec2(0.004), 1.0 - vUv);

    float alpha = reveal * mask * e.x * e.y * uOpacity * uFade;

    float fog = smoothstep(uFogNear, uFogFar, vDepth);
    col = mix(col, uFogColor, fog);
    // uDim is perceptual (0.05 should look like 5 %), so convert to linear light.
    col = mix(uFogColor, col, pow(uDim, 2.2));

    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

/**
 * Compute UV scale/offset so an image of `imageAspect` covers a plane of
 * `planeAspect`, keeping `focal` (0–1, y down) as centred as the crop allows.
 */
export function coverUv(imageAspect, planeAspect, focal = { x: 0.5, y: 0.5 }) {
  const cover = new THREE.Vector2(1, 1);
  const offset = new THREE.Vector2(0, 0);
  if (imageAspect > planeAspect) {
    cover.x = planeAspect / imageAspect;
    offset.x = THREE.MathUtils.clamp(focal.x - cover.x / 2, 0, 1 - cover.x);
  } else if (imageAspect < planeAspect) {
    cover.y = imageAspect / planeAspect;
    const fy = 1 - focal.y; // texture v runs bottom → top
    offset.y = THREE.MathUtils.clamp(fy - cover.y / 2, 0, 1 - cover.y);
  }
  return { cover, offset };
}

export function createPhotoMaterial({ imageAspect, planeAspect, focal, grade = 'neutral', color = '#1a1a1a' }) {
  const g = GRADES[grade] || GRADES.neutral;
  const { cover, offset } = coverUv(imageAspect, planeAspect, focal);

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    uniforms: {
      uMap:     { value: null },
      uHasMap:  { value: 0 },
      uColor:   { value: new THREE.Color(color) },
      uCover:   { value: cover },
      uOffset:  { value: offset },
      uReveal:  { value: 0 },
      uBlur:    { value: 0 },
      uOpacity: { value: 1 },
      uFade:    { value: 1 },
      uTint:    { value: new THREE.Vector3(...g.tint) },
      uSat:     { value: g.sat },
      uBlack:   { value: g.black },
      uMask:    { value: new THREE.Vector4(0.5, 1, 0.02, 0) },
      // shared references — updating globals updates every material
      uTime:     globals.uTime,
      uDim:      globals.uDim,
      uGrain:    globals.uGrain,
      uFogColor: globals.uFogColor,
      uFogNear:  globals.uFogNear,
      uFogFar:   globals.uFogFar,
    },
  });
}
