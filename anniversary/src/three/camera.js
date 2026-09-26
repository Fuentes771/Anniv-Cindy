// Camera + rig.
//
// The rig never lets scroll write the camera directly: scroll sets a goal pose,
// the rig follows with frame-rate independent damping, and the pointer adds a
// small offset on top. Because the offset moves the camera (not the photos),
// near frames shift more than far ones — real parallax from real depth.
import * as THREE from 'three';
import { damp } from '../utils/math.js';

let camera;

const DESKTOP_FOV = 40;
const PORTRAIT_FOV = 52; // portrait phones: wider vertical FOV so frames fit the narrow width

export function initCamera() {
  camera = new THREE.PerspectiveCamera(DESKTOP_FOV, window.innerWidth / window.innerHeight, 0.05, 140);
  fitCamera(window.innerWidth, window.innerHeight);
  return camera;
}

export function fitCamera(w, h) {
  const aspect = w / h;
  camera.aspect = aspect;
  camera.fov = aspect < 0.8 ? PORTRAIT_FOV : DESKTOP_FOV;
  camera.updateProjectionMatrix();
}

export function getCamera() { return camera; }

/** Distance at which a plane of height `h` fills `fill` of the viewport height. */
export function distanceToFit(h, fill = 0.8) {
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const byHeight = h / fill / (2 * Math.tan(vFov / 2));
  return byHeight;
}

export function createRig(cam) {
  const pos = new THREE.Vector3();
  const target = new THREE.Vector3();
  const goalPos = new THREE.Vector3();
  const goalTarget = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3();
  const WORLD_UP = new THREE.Vector3(0, 1, 0);
  const look = new THREE.Vector3();

  return {
    lambda: 3.2,

    setGoal(p, t) {
      goalPos.fromArray(p);
      goalTarget.fromArray(t);
    },

    snap() {
      pos.copy(goalPos);
      target.copy(goalTarget);
    },

    /**
     * @param {number} dt
     * @param {{x:number,y:number}} pointer  damped, -1..1
     * @param {number} sway                  world units of pointer offset
     */
    update(dt, pointer, sway) {
      const k = damp(this.lambda, dt);
      pos.lerp(goalPos, k);
      target.lerp(goalTarget, k);

      forward.copy(target).sub(pos).normalize();
      right.crossVectors(forward, WORLD_UP).normalize();
      up.crossVectors(right, forward).normalize();

      cam.position.copy(pos)
        .addScaledVector(right, pointer.x * sway)
        .addScaledVector(up, pointer.y * sway * 0.6);
      look.copy(target).addScaledVector(right, pointer.x * sway * 0.25);
      cam.lookAt(look);
    },

    get position() { return pos; },
  };
}
