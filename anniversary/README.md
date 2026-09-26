# Between Frames — Spatial Personal Archive

Website anniversary 3 tahun (27.09.26). Satu perjalanan kamera yang kontinu melewati
ruang arsip foto. Spesifikasi lengkap: [`../PRD_SPEC_Anniversary_3D_Website_FINAL.md`](../PRD_SPEC_Anniversary_3D_Website_FINAL.md).

Stack: HTML + CSS + Vanilla JS (ES modules) + **Three.js** + **GSAP**. Tanpa framework (PRD §31).

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve dist/
npm run check      # validasi kurasi ↔ manifest ↔ file WebP
```

Tambahkan `?debug` di URL untuk melihat fps, tier kualitas, jumlah tekstur di GPU, dan chapter aktif.

## Yang harus diisi pemilik sebelum dikirim

Semua kata yang tampil ada di **satu file**: [`src/content/letter.js`](src/content/letter.js).
Tidak ada isi yang dikarang — semua `[ … ]` adalah placeholder (PRD §45).

| Apa | Di mana |
|---|---|
| Isi surat (per paragraf) | `letter.body` |
| Tanda tangan | `letter.signature` |
| Kalimat penutup terakhir | `copy.finalLine` |
| Kalimat di bawah judul pembuka (opsional) | `copy.heroStatement` |
| Caption pendek per chapter (opsional) | `copy.captions` |
| Musik | taruh file di `public/assets/audio/music.mp3` (atau ubah `copy.audio.src`) |

Tanpa file musik, tombol sound otomatis disembunyikan — tidak ada error.

## Mengubah kurasi foto

[`src/content/photos.js`](src/content/photos.js) menentukan foto mana masuk chapter mana,
urutannya, focal point, dan alt text. Scene tidak pernah menyebut nama file langsung.

- `chapterPhotos` — urutan foto per chapter (pertama = dominan).
- `excluded` — foto yang sengaja tidak dipakai, beserta alasannya.
- `META` — role, tier, focal point, alt text.

Setelah mengubah, jalankan `npm run check`.

## Pipeline aset

```bash
npm run process-assets            # buat derivative yang belum ada
npm run process-assets -- --force # regenerasi semua
```

Sumber: `../FOTO/*.jpg` → `public/assets/images/{thumb,content,hero}/<n>.webp`,
`src/content/photos-generated.js` (fakta file saja), dan `scripts/asset-report.md`.

- Duplikat persis (SHA-256) dan near-duplicate (dHash) **dilaporkan**, tidak dihapus (PRD §15).
- Foto miring secara pixel dinormalisasi lewat `ROTATE_OVERRIDES` (22, 26, 35, 46, 47 — diverifikasi visual, PRD §16).
- Tidak ada upscale; sumber maksimal ~1280 px (PRD §19).

## Arsitektur

```
src/
├── app.js                 lifecycle: scroll → camera goal → rig → render; window load/unload
├── content/               data murni: scenes.js (kontrak), photos.js (kurasi), letter.js (copy)
├── scenes/*.js            satu file per chapter: build(), pose(q), update(), enter/leave
├── three/
│   ├── camera.js          camera rig ber-damping + pointer sway
│   ├── chapter.js         lifecycle chapter (build/load/show/enter/unload)
│   ├── photoPlane.js      primitive PhotoPlane
│   ├── materials.js       satu shader untuk semua foto (crop focal, reveal, grade, mask, fog)
│   ├── textures.js        cache tekstur ber-refcount
│   └── renderer.js / scene.js / dispose.js
├── motion/                scroll master, pointer, easing, reveal DOM (GSAP)
├── ui/                    DOM chapter, indeks progress, kontrol sound, cursor, debug
├── audio/controller.js    Web Audio gain: unlock di Enter, fade, duck saat surat, mute
└── utils/                 math, viewport, tier kualitas + fps watchdog
```

**Satu dunia, satu kamera.** Tiap chapter punya `origin` sendiri di world space
(`content/scenes.js`). Scroll hanya menentukan *tujuan* kamera; rig mengikutinya dengan
damping. Chapter aktif ±1 dimuat dan terlihat, ±2 disiapkan/disembunyikan, lebih jauh
teksturnya dilepas dari GPU.

**Transisi** hanya empat (PRD §23): camera passage (Opening → Frame Field),
mask reveal dari sambungan cermin foto 48 (Reflective), stack displacement (Couple Archive),
quiet cut (→ Letter, → Final).

**Interaksi** selektif: hover/tap menajamkan foto di Private Details; klik/tap/keyboard
pada frame di Couple Archive menerbangkan kamera ke frame itu (`Esc` / back / scroll untuk kembali).

**Mobile** direkomposisi (bukan diperkecil): layout vertikal/kolom, lebih sedikit plane,
FOV lebih lebar untuk layar portrait. **Reduced motion**: kamera diam di pose tiap chapter,
perpindahan berupa fade singkat, tanpa parallax.

**Tier kualitas** (`utils/performance.js`) dipilih dari perangkat, lalu diturunkan otomatis
bila fps < 45: DPR, anisotropy, grain, jumlah frame di akhir.

## Catatan dependency (PRD §44)

Runtime: `three`, `gsap` saja. Dev: `vite`, `sharp` (pipeline aset).
`audio/ambient.js` dari struktur PRD tidak dibuat — satu track sudah cukup (PRD §28).
Lenis tidak dipakai — scroll native + damping kamera sudah halus (PRD §31.2).
Font dimuat dari Google Fonts; untuk self-host, unduh woff2 ke `public/fonts` dan ganti `<link>` di `index.html`.

## QA checklist (PRD §42)

Sudah diverifikasi otomatis (Chromium headless, desktop 1440×900, mobile 390×844, reduced-motion):

- [x] exact duplicate hashes checked · near duplicates dilaporkan (`scripts/asset-report.md`)
- [x] sideways images normalized · focal point set · hero dikompres terpisah (q90)
- [x] tidak ada console error · tidak ada aset hilang (`npm run check`)
- [x] tekstur dilepas saat chapter ditinggalkan (≈10–20 resident)
- [x] musik hanya mulai setelah Enter · mute bekerja · tanpa file → kontrol tersembunyi
- [x] reduced motion · navigasi keyboard (Enter, indeks chapter, sound, frame archive, Esc)

Perlu keputusan/cek manual pemilik:

- [ ] review near-duplicate & daftar `excluded` di `photos.js`
- [ ] watermark foto 38 (dipakai kecil & sekunder — atau keluarkan)
- [ ] isi surat, tanda tangan, kalimat penutup, musik
- [ ] cek di HP & laptop asli (performa GPU sungguhan, loudness musik)
