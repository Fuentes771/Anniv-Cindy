// utils/preload.js — controlled image preloading
const cache = new Map();

export function preloadImage(src) {
  if (cache.has(src)) return cache.get(src);
  const p = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
  cache.set(src, p);
  return p;
}

export function preloadImages(srcs) {
  return Promise.all(srcs.map(preloadImage));
}
