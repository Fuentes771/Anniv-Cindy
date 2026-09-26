// Dispose helpers. Photo planes share one geometry (never disposed) and
// release textures through the cache, so only materials are freed here.
export function disposeMaterial(material) {
  if (!material) return;
  material.dispose();
}

export function disposeGroup(group, scene) {
  if (!group) return;
  if (scene) scene.remove(group);
  group.traverse(obj => {
    if (obj.isMesh && obj.userData.plane) obj.userData.plane.dispose();
  });
}
