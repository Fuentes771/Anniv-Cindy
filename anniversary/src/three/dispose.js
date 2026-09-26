// Dispose Three.js objects safely
export function disposeMesh(mesh) {
  if (!mesh) return;
  if (mesh.geometry) mesh.geometry.dispose();
  if (mesh.material) {
    const mat = mesh.material;
    if (mat.map) mat.map.dispose();
    if (mat.normalMap) mat.normalMap.dispose();
    mat.dispose();
  }
}

export function disposeGroup(group) {
  if (!group) return;
  group.traverse((obj) => {
    if (obj.isMesh) disposeMesh(obj);
  });
}
