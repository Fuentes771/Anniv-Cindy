import { defineConfig } from 'vite';

// Hosts allowed to reach the dev/preview server (e.g. through a Cloudflare Tunnel).
const allowedHosts = ['anniv.antiquetech.web.id', '.trycloudflare.com'];

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 5173,
    host: true,
    allowedHosts,
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 800,
  },
});
