# PRD / SPEC — 3D Anniversary Experience

> **Project:** Personal Anniversary Website — 3 Years  
> **Anniversary date:** 27 September 2026  
> **Primary audience:** One person — the anniversary recipient  
> **Status:** Asset-aware master specification / implementation source of truth  
> **Core concept:** `BETWEEN FRAMES — Spatial Personal Archive`

---

## 0. Purpose

Website ini bukan landing page ucapan anniversary dan bukan photo gallery biasa. Produk akhirnya harus terasa seperti **artefak digital personal**: sebuah ruang visual yang dibangun khusus dari foto nyata, tulisan personal, musik, kamera 3D, spatial composition, dan interaction choreography.

Target kualitas:

- premium
- cinematic
- intimate
- romantic tetapi tidak literal
- editorial
- spatial
- tactile
- sedikit eksperimental
- tidak terlihat sebagai template
- tidak terlihat sebagai output AI/generator
- tidak bergantung pada ornamen hati, bunga, glitter, atau gradient romantis generik

Website harus membuat penerima merasa bahwa pengalaman ini **dibuat untuk dirinya**, bukan bahwa sebuah template telah diisi dengan foto.

---

# 1. Asset Intelligence — Locked Findings

Analisis ZIP yang diberikan menjadi dasar art direction. Jangan mengabaikan karakter aset ketika implementasi dimulai.

## 1.1 Collection profile

- 60 file gambar.
- Seluruh aset berupa JPEG.
- 54 portrait dan 6 landscape.
- Tidak ada square.
- Resolusi relatif kecil untuk background fullscreen desktop modern.
- Resolusi maksimum sekitar 854×1280.
- Rata-rata sekitar 0,51 MP menurut analisis aset.
- Tidak tersedia tanggal pemotretan atau GPS yang dapat diverifikasi dari metadata yang dibaca.
- Koleksi mempunyai beberapa keluarga visual: portrait/selfie, environmental portrait, couple/event, night scene, reflective/geometric environment, dan detail/object texture.

### Implication

Mayoritas foto **tidak boleh diperlakukan sebagai fullscreen background tajam pada monitor besar**. Foto harus diperlakukan sebagai material spatial:

- framed plane
- floating plane
- layered photograph
- masked image
- photo stack
- environmental panel
- projected image
- spatial wall
- 3D depth card

Keterbatasan resolusi justru dijadikan bagian dari art direction.

---

# 2. Core Creative Concept

## BETWEEN FRAMES — Spatial Personal Archive

Hubungan tidak divisualisasikan sebagai timeline tahun/lokasi, melainkan sebagai **kumpulan frame yang hidup di dalam sebuah ruang digital**.

Setiap foto adalah sebuah “frame”. Frame dapat:

- dilihat dari jauh,
- didekati,
- dilewati kamera,
- bergeser terhadap layer lain,
- muncul dari darkness,
- menghilang menjadi texture,
- menjadi pintu ke scene berikutnya.

Website tidak perlu mengklaim kronologi. Urutan ditentukan oleh:

- visual rhythm,
- contrast,
- density,
- proximity,
- color transition,
- emotional pacing.

### Core metaphor

```text
DARKNESS
   ↓
DISCOVERY
   ↓
FRAMES
   ↓
DEPTH
   ↓
CLOSENESS
   ↓
LETTER
   ↓
QUIET ENDING
```

---

# 3. Design Principles

## 3.1 Personal over decorative

Material utama adalah foto dan tulisan personal. Ornamen hanya boleh muncul jika mendukung composition.

## 3.2 Spatial over flat

3D digunakan untuk memberi sense of place dan depth, bukan sekadar memutar kartu.

## 3.3 Camera over carousel

Perpindahan antar foto sebaiknya lebih sering terasa seperti **kamera bergerak** daripada slideshow berpindah slide.

## 3.4 Curated over complete

Tidak semua foto harus dipakai. Pengurangan aset adalah bagian dari desain.

## 3.5 Imperfection with control

Foto yang memiliki grain, surface scratch, low-light, atau kualitas tidak seragam boleh dipertahankan ketika memiliki nilai visual. Jangan membersihkan semua karakter sampai terasa sintetis.

## 3.6 Romantic without cliché

Dilarang menjadikan ini visual language utama:

- floating hearts
- heart particles
- rose petals
- cupid
- pink/red gradient everywhere
- handwriting romance font
- excessive sparkle
- giant “I LOVE YOU” repeated throughout
- generic “love loading…” UI

## 3.7 One strong idea per scene

Satu scene tidak boleh sekaligus:

- zoom besar,
- rotate,
- blur,
- distortion,
- particles,
- text morph,
- cursor trail,
- camera shake.

Pilih satu dominant motion dan satu supporting motion.

---

# 4. Visual Identity

## 4.1 Palette

Baseline:

- Obsidian / charcoal background.
- Warm ivory / off-white typography.
- Accent utama yang dapat mengambil karakter blue/cyan atau amber dari foto.
- Muted red/orange hanya sebagai scene-specific accent.

Jangan menjadikan pink sebagai primary identity.

### Recommended system

```text
BACKGROUND      #0A0A0A-ish
TEXT PRIMARY    warm ivory
TEXT MUTED      desaturated gray
ACCENT COOL     cobalt / electric blue family
ACCENT WARM     restrained amber family
```

Nilai hexadecimal final dapat dituning setelah asset grading.

## 4.2 Typography

Pairing:

1. Display/editorial serif dengan karakter high-contrast untuk headline besar.
2. Modern grotesk untuk navigation, body, metadata, dan control.
3. Monospace hanya secara hemat untuk indexing seperti:

```text
FRAME 01
ARCHIVE / 07
SCENE 03
```

Hindari script font sebagai font utama.

## 4.3 Texture

Gunakan:

- subtle grain
- film-like noise
- very restrained vignette
- soft shadow
- slight paper/surface variation bila dibutuhkan

Noise harus berupa atmosfer, bukan filter berat.

---

# 5. Signature Visual System

## 5.1 Framing within framing

Ini adalah signature yang paling kuat dari koleksi aset.

Gunakan secara berulang, tetapi dengan variasi:

- mirror
- cage/wire
- shelves
- corridor
- doorway
- arch
- architectural beams
- arcade structures
- large environmental fields

Subject sering sudah berada dalam frame alami. Website harus **mengangkat framing tersebut**, bukan menutupinya dengan dekorasi.

## 5.2 Vertical portrait geometry

Karena mayoritas aset portrait, sistem layout harus menganggap portrait ratio sebagai first-class citizen.

Foto tidak harus dipaksa menjadi 16:9.

Gunakan:

- tall planes
- narrow frames
- asymmetric stacks
- overlapping portrait cards
- vertical gallery walls

---

# 6. Information Architecture / Experience Flow

Tidak ada requirement untuk membuat menu website konvensional. Navigasi dapat bersifat spatial.

```text
ENTRY
  ↓
OPENING FRAME
  ↓
FRAME FIELD
  ↓
ENVIRONMENTAL DEPTH
  ↓
REFLECTIVE / MASKED PASSAGE
  ↓
PRIVATE DETAILS
  ↓
NIGHT / EVENT SPACE
  ↓
COUPLE ARCHIVE
  ↓
QUIET COUNTERPOINT
  ↓
LETTER
  ↓
FINAL FRAME
```

Urutan ini adalah **visual/emotional sequence**, bukan kronologi hubungan.

---

# 7. Scene Specification

## SCENE 00 — ENTRY / UNLOCK

### Objective
Membuat pengguna merasa masuk ke sebuah artefak pribadi.

### Visual
Layar hampir hitam. Hanya typography kecil dan satu visual hint.

Contoh pattern:

```text
FOR YOU

27.09.26

[ ENTER ]
```

Tanggal, copy, dan wording final harus berasal dari pemilik. Jangan menambahkan cerita yang tidak diberikan.

### Motion
- fade from black
- subtle grain
- cursor response
- button magnetic ringan

### 3D
Tidak perlu 3D kompleks. Gunakan depth sangat tipis agar opening tetap tenang.

### Audio
Musik boleh mulai setelah explicit user interaction.

---

## SCENE 01 — OPENING FRAME

### Asset family
Prioritaskan couple/night/environmental hero dari koleksi:

- `Desain tanpa judul (42).jpg`
- `Desain tanpa judul (43).jpg`
- `Desain tanpa judul (44).jpg`
- `Desain tanpa judul (45).jpg`
- `Desain tanpa judul (48).jpg`
- `Desain tanpa judul (49).jpg`

Gunakan satu hero utama, bukan slideshow cepat.

### Strategy
Foto ditempatkan pada plane dengan sedikit depth. Kamera melakukan slow push-in.

### Motion
- camera push
- shallow parallax
- very subtle scale
- typography reveal

### Avoid
- full-screen upscale agresif
- lens flare
- fake cinematic bars
- heavy bloom

---

## SCENE 02 — FRAME FIELD

### Objective
Memperkenalkan bahwa foto-foto adalah objek spatial.

### Assets
Gunakan selected portraits, bukan seluruh set.

Calon:

- `Desain tanpa judul.jpg`
- `Desain tanpa judul (1).jpg`
- `Desain tanpa judul (4).jpg`
- `Desain tanpa judul (5).jpg`
- `Desain tanpa judul (7).jpg`
- `Desain tanpa judul (17).jpg`
- `Desain tanpa judul (27).jpg`
- `Desain tanpa judul (32).jpg`
- `Desain tanpa judul (33).jpg`
- `Desain tanpa judul (34).jpg`
- `Desain tanpa judul (41).jpg`
- `Desain tanpa judul (50).jpg`
- `Desain tanpa judul (52).jpg`

### 3D composition
Foto muncul sebagai bidang dengan:

- depth offset
- slight rotation
- variable scale
- overlapping edges
- camera-relative movement

### Critical rule
Jangan membuat “3D cards everywhere”. Hanya gunakan 5–9 visible frames dalam satu camera composition.

---

## SCENE 03 — ENVIRONMENTAL DEPTH

### Objective
Memberi perubahan tempo dari portrait menjadi environmental space.

### Primary assets
- `Desain tanpa judul (6).jpg`
- `Desain tanpa judul (12).jpg`
- `Desain tanpa judul (30).jpg`
- `Desain tanpa judul (51).jpg`
- `Desain tanpa judul (52).jpg`
- `Desain tanpa judul (53).jpg`

### Motion
Kamera bergerak lateral atau diagonal. Foto menjadi depth planes.

### Interaction
Pointer dapat mengubah perspective sedikit.

### Rule
Jangan mendorong displacement shader pada wajah.

---

## SCENE 04 — REFLECTIVE / MASKED PASSAGE

### Objective
Memakai geometri alami dari foto sebagai transisi.

### Assets
Calon:

- `Desain tanpa judul (12).jpg`
- `Desain tanpa judul (14).jpg`
- `Desain tanpa judul (15).jpg`
- `Desain tanpa judul (16).jpg`
- `Desain tanpa judul (38).jpg`
- `Desain tanpa judul (48).jpg`

### Spatial treatment
- image clipping
- mask based on geometry
- vertical planes
- camera passage
- soft reflection

### Important
Reflection harus berasal dari visual asset yang memang sudah mempunyai reflection/mirror cue. Jangan membuat “mirror effect” generik pada semua foto.

---

## SCENE 05 — PRIVATE DETAILS

Scene ini menurunkan visual density.

### Assets
Gunakan close-ups, casual portraits, small environmental fragments, dan object/detail yang memiliki nilai visual.

### Interaction
Hover / pointer proximity hanya pada elemen tertentu.

### Motion
- blur → sharp
- opacity reveal
- tiny scale
- micro rotation

Tidak perlu camera movement besar.

---

## SCENE 06 — NIGHT / EVENT SPACE

### Assets
Prioritaskan:

- `Desain tanpa judul (42).jpg`
- `Desain tanpa judul (43).jpg`
- `Desain tanpa judul (44).jpg`
- `Desain tanpa judul (45).jpg`

Tambahkan secara selektif:

- `Desain tanpa judul (41).jpg`
- `Desain tanpa judul (46).jpg`
- `Desain tanpa judul (37).jpg`

### Visual
Dark environment dengan stage/crowd light sebagai depth cue.

### Motion
- slow horizontal drift
- bokeh/depth separation
- controlled camera proximity

### Avoid
Jangan menambahkan neon layer di atas foto hanya untuk membuatnya “cinematic”.

---

## SCENE 07 — COUPLE ARCHIVE

Ini adalah salah satu scene emosional utama.

### Core assets
- `Desain tanpa judul (38).jpg`
- `Desain tanpa judul (39).jpg`
- `Desain tanpa judul (42).jpg`
- `Desain tanpa judul (43).jpg`
- `Desain tanpa judul (44).jpg`
- `Desain tanpa judul (45).jpg`
- `Desain tanpa judul (48).jpg`
- `Desain tanpa judul (49).jpg`

### Composition
Jangan membuat grid.

Gunakan:

```text
       [ FRAME A ]

[ FRAME B ]       [ FRAME C ]

        [ FRAME D ]
```

Tetapi posisi aktual harus asimetris dan mengikuti focal point masing-masing foto.

### Interaction
- one primary photo responds to pointer
- secondary frames move slower
- depth hierarchy 3–5 layers

---

## SCENE 08 — QUIET COUNTERPOINT

Tujuannya memberi napas sebelum letter.

### Candidate
- `Desain tanpa judul (57).jpg`
- `Desain tanpa judul (52).jpg`
- `Desain tanpa judul (53).jpg`
- `Desain tanpa judul (56).jpg`

### Treatment
Lebih terang atau lebih sederhana dibanding scene sebelumnya.

Motion hampir minimal.

---

## SCENE 09 — LETTER

Ini adalah bagian yang paling human.

Visual harus turun drastis.

### Layout
Background hampir kosong.

Typography besar tetapi tidak memenuhi layar penuh.

Contoh structural pattern:

```text
FOR YOU

[personal letter]

— [name]
```

Isi letter harus berasal dari pengguna. Jangan mengarang isi surat dari sistem.

### Animation
Text reveal sederhana.

Tidak perlu 3D berat.

---

## SCENE 10 — FINAL FRAME

Final scene harus terasa tenang dan final.

### Candidate
- `Desain tanpa judul (48).jpg`
- `Desain tanpa judul (49).jpg`
- `Desain tanpa judul (42).jpg`

### Motion
Slow pull-back atau static camera.

### Ending
Setelah visual berhenti, hanya satu line final yang tersisa.

Copy final harus personal dan diberikan pemilik.

---

# 8. 3D SYSTEM

## 8.1 Technical philosophy

3D harus terasa seperti **kamera berada dalam ruang**.

Bukan seperti:

> image cards + rotateY(20deg)

melainkan:

> planes + depth + camera + masking + light hierarchy + controlled motion.

## 8.2 Spatial primitives

Gunakan hanya beberapa primitive yang konsisten:

1. `PhotoPlane`
2. `PhotoStack`
3. `FrameWall`
4. `DepthLayer`
5. `MaskedPlane`
6. `ReflectivePlane`
7. `TextPlane`
8. `AmbientParticleLayer`

## 8.3 PhotoPlane

Properties konseptual:

```text
image
position
rotation
scale
z-depth
focalPoint
parallaxStrength
hoverResponse
entranceProgress
exitProgress
```

## 8.4 PhotoStack

Stack tidak boleh terlalu seragam.

Variasi:

- slight z offset
- slight rotation
- uneven spacing
- alternating width

Tidak ada drop shadow besar ala card UI.

## 8.5 Camera

Gunakan satu camera utama per spatial chapter jika memungkinkan.

Pergerakan camera:

- push in
- pull back
- lateral drift
- diagonal movement
- passage through frames

Jangan gunakan camera shake kecuali sebagai deliberate exception.

---

# 9. Scroll System

Scroll adalah timeline kamera, bukan page height yang dipenuhi animation trigger acak.

## Principles

- smooth but responsive
- momentum natural
- no excessive snap
- no forced scroll hijacking on every section
- mobile tetap dapat digunakan secara normal

### Desktop
Scroll dapat mengontrol:

```text
scroll progress
      ↓
scene progress
      ↓
camera position
      ↓
photo transforms
      ↓
text reveal
```

### Mobile
Prioritaskan:

- native vertical scroll
- reduced 3D depth
- reduced simultaneous objects
- fewer pointer-dependent interactions

---

# 10. Mouse / Pointer Interaction

## Primary

Pointer movement menghasilkan subtle perspective response.

Range:

- ~2–6 degrees rotation maximum pada photo plane utama.
- Secondary layers lebih kecil.

## Secondary

- hover focus
- pointer proximity light
- magnetic CTA
- image tilt
- subtle depth shift

## Avoid

- cursor trail besar
- fluid cursor blob besar
- distortion pada wajah
- aggressive chromatic aberration
- permanent glow mengikuti mouse

Cursor effect harus terasa hampir tidak disadari.

---

# 11. Micro Interaction

Allowed:

- 1–4% image scale
- 100–300ms micro response untuk UI controls
- blur-to-sharp reveal
- opacity easing
- 1–3 degree rotation
- underline movement
- magnetic button ringan

Tidak setiap element harus interactive.

Interactivity adalah hierarchy signal.

---

# 12. Audio / Music

## Behavior

Audio tidak boleh autoplay bersuara tanpa interaction pertama.

Flow:

```text
ENTER
  ↓
user interaction
  ↓
audio context unlocked
  ↓
music fades in
```

## UI

Gunakan control minimal:

```text
sound  ─────  on/off
```

Boleh menggunakan waveform yang sangat subtle, tetapi jangan membuat music player penuh.

## Sync

Music boleh menjadi basis pacing tetapi jangan melakukan BPM-synchronized animation yang terlalu jelas. Motion tetap harus terasa organic.

---

# 13. Photo Curation Rules

## Core couple family

Prioritas tinggi:

- `Desain tanpa judul (38).jpg`
- `Desain tanpa judul (39).jpg`
- `Desain tanpa judul (42).jpg`
- `Desain tanpa judul (43).jpg`
- `Desain tanpa judul (44).jpg`
- `Desain tanpa judul (45).jpg`
- `Desain tanpa judul (48).jpg`
- `Desain tanpa judul (49).jpg`

Jangan menampilkan seluruhnya beruntun. Pecah dengan environmental scene.

## Environmental geometry family

- `Desain tanpa judul (1).jpg`
- `Desain tanpa judul (6).jpg`
- `Desain tanpa judul (12).jpg`
- `Desain tanpa judul (14).jpg`
- `Desain tanpa judul (15).jpg`
- `Desain tanpa judul (16).jpg`
- `Desain tanpa judul (27).jpg`
- `Desain tanpa judul (30).jpg`
- `Desain tanpa judul (38).jpg`
- `Desain tanpa judul (48).jpg`
- `Desain tanpa judul (52).jpg`
- `Desain tanpa judul (53).jpg`

## Portrait/support family

Selected from:

- `Desain tanpa judul.jpg`
- `Desain tanpa judul (2).jpg`
- `Desain tanpa judul (3).jpg`
- `Desain tanpa judul (4).jpg`
- `Desain tanpa judul (5).jpg`
- `Desain tanpa judul (7).jpg`
- `Desain tanpa judul (8).jpg`
- `Desain tanpa judul (17).jpg`
- `Desain tanpa judul (18).jpg`
- `Desain tanpa judul (20).jpg`
- `Desain tanpa judul (21).jpg`
- `Desain tanpa judul (24).jpg`
- `Desain tanpa judul (27).jpg`
- `Desain tanpa judul (31).jpg`
- `Desain tanpa judul (32).jpg`
- `Desain tanpa judul (33).jpg`
- `Desain tanpa judul (34).jpg`
- `Desain tanpa judul (35).jpg`
- `Desain tanpa judul (41).jpg`
- `Desain tanpa judul (50).jpg`
- `Desain tanpa judul (55).jpg`
- `Desain tanpa judul (56).jpg`
- `Desain tanpa judul (57).jpg`

Actual final selection harus dibuat setelah visual QA pada implementation.

---

# 14. Asset Quality Rules

Karena sumber mayoritas kecil, gunakan hierarchy:

### Hero assets
Hanya 3–8 foto yang boleh mendapatkan derivative terbesar.

### Secondary assets
Gunakan frame lebih kecil.

### Detail assets
Boleh tampil pada crop lebih kecil.

### Low-resolution assets
Jangan dibentangkan melebihi kemampuan visual aset.

---

# 15. Duplicate / Redundancy Gate

Laporan eksternal yang digunakan sebagai input mempunyai inkonsistensi antara nomor urut file dan suffix filename pada bagian duplicate table. Karena itu implementasi **tidak boleh menghapus file hanya berdasarkan nomor tersebut**.

Build pipeline harus melakukan:

```text
SHA-256 / image hash
        ↓
exact duplicate detection
        ↓
perceptual hash
        ↓
near-duplicate review
```

Jika dua file benar-benar identik, hanya satu yang digunakan.

Near duplicate harus dipilih berdasarkan:

- framing
- expression
- sharpness
- background
- composition

---

# 16. Photo Orientation Gate

Sebagian aset dilaporkan mempunyai sideways rotation secara pixel image.

Sebelum publish:

1. Buka file.
2. Verifikasi orientation visual.
3. Normalize pixels.
4. Export web derivative.
5. Jangan bergantung pada CSS `rotate()` sebagai permanent correction.

---

# 17. Watermark / Imperfection Policy

`Desain tanpa judul (38).jpg` dilaporkan memiliki watermark `@mixuepramuka`.

Jangan melakukan content removal otomatis tanpa keputusan pemilik.

Pilihan yang valid:

- gunakan crop yang natural apabila watermark tetap tidak merusak composition,
- tempatkan foto lebih kecil,
- jadikan secondary frame,
- atau exclude.

Jangan clone-out watermark secara otomatis dalam pipeline kecuali pemilik secara eksplisit menginginkannya.

`Desain tanpa judul (48).jpg` dilaporkan mempunyai mirror scratches/surface imperfections. Ini dapat dipertahankan karena bisa menjadi karakter dokumenter.

---

# 18. Color Grading System

Jangan apply satu LUT berat ke seluruh koleksi.

## Global grade

- slightly deeper black point
- restrained highlights
- natural skin tone
- mild grain

## Scene-level grade

Warm scene → retain amber.

Night scene → retain blue/cyan.

Outdoor scene → retain green/neutral.

Do not flatten all scenes into one teal-orange look.

---

# 19. Image Processing Pipeline

Recommended:

```text
Original JPEG
      ↓
Orientation normalization
      ↓
Crop / focal point metadata
      ↓
Color correction
      ↓
Derivative generation
      ↓
AVIF/WebP
      ↓
Blur placeholder
      ↓
Runtime lazy loading
```

Recommended derivatives:

```text
thumb      ~480px long edge
content    ~1200–1600px long edge
hero       ~1800–2400px long edge, limited count
```

Jangan upscale seluruh koleksi secara agresif.

---

# 20. Focal Point System

Setiap image harus mempunyai metadata focal point.

Example:

```ts
{
  src: '/media/frame-42.avif',
  focalPoint: { x: 0.50, y: 0.42 },
  role: 'hero',
  parallax: 0.35,
}
```

Face-centered photo tidak boleh mengalami crop yang memotong wajah/hands.

Environmental photo harus mempertahankan architectural geometry.

---

# 21. Responsive Design

## Desktop

Target pengalaman penuh:

- 3D spatial composition
- camera movement
- multi-layer depth
- pointer interaction
- wider negative space

## Tablet

- kurangi simultaneous planes
- turunkan depth
- kurangi camera travel

## Mobile

Jangan sekadar mengecilkan versi desktop.

Recompose:

- native vertical scroll
- 1 dominant image
- 1–3 supporting layers
- reduced camera movement
- no hover-only information
- touch-safe controls

Portrait assets memang cocok untuk mobile dan harus dimanfaatkan.

---

# 22. Motion Design System

## Enter

Default range:

```text
opacity 0 → 1
translate 20–80px → 0
blur 8–16px → 0
scale 0.97 → 1
```

Gunakan kombinasi terbatas.

## Exit

Tidak semua element harus animate out. Banyak scene lebih kuat ketika hanya scene berikutnya masuk.

## Easing

Gunakan:

- smooth ease-out
- custom cubic-bezier
- spring hanya untuk small UI interaction

Hindari bounce pada editorial content.

---

# 23. Transition Language

Gunakan empat jenis transition utama saja:

### A. Camera passage
Kamera melewati photo plane.

### B. Mask reveal
Frame berikutnya muncul melalui bentuk/geometry yang sudah ada pada foto.

### C. Stack displacement
Photo stack bergeser untuk reveal layer.

### D. Quiet cut
Animasi berhenti dan scene berikutnya muncul dengan simple fade.

Jangan membuat setiap transisi menjadi special effect baru.

---

# 24. Anti-AI / Anti-Template Guardrails

Website tidak boleh mempunyai pola yang membuatnya terlihat seperti hasil generator.

### Avoid

- predictable centered hero + button + cards
- equal spacing everywhere
- repeated glass cards
- generic gradient blobs
- random 3D shapes unrelated to photos
- stock-like decorative particles
- generic heart particles
- giant floating words without composition purpose
- excessive rounded corners
- excessive border glow
- excessive shadows
- too many simultaneous interactions
- “AI portfolio” visual clichés

### Prefer

- asymmetry
- controlled negative space
- photo-led composition
- deliberate silence
- imperfect alignment where intentional
- camera choreography
- scene-specific treatment
- restrained typography
- variable frame scale
- real asset texture

---

# 25. Design Rules for Text

Text tidak boleh mengambil alih foto.

Hierarchy:

```text
1. HERO STATEMENT
2. SCENE LABEL
3. PERSONAL COPY
4. MICRO METADATA
```

Micro metadata dapat terlihat seperti archival notation, tetapi jangan membuat website terasa seperti aplikasi dashboard.

---

# 26. Copy System

Copy harus:

- personal
- natural
- singkat
- tidak terdengar seperti marketing
- tidak terlalu puitis jika pengguna tidak menulis seperti itu

Jangan menghasilkan semua copy otomatis dari AI sebagai final. AI boleh membantu drafting, tetapi pemilik harus menentukan voice final.

---

# 27. Letter System

Letter adalah satu-satunya bagian yang boleh menjadi panjang.

Struktur:

```text
opening

memory / reflection

what this person means

three-year reflection

future-facing sentence

closing
```

Isi tidak boleh diinferensikan dari foto.

---

# 28. Audio Engineering

Music:

- compress appropriately
- normalize loudness
- avoid clipping
- use one primary track unless transitions require more

Recommended interaction:

```text
Tap ENTER
  ↓
AudioContext unlock
  ↓
Music fade-in 1.5–3s
```

On reduced-motion or data-saving conditions, audio should remain controllable.

---

# 29. Accessibility

Minimum:

- keyboard accessible controls
- visible focus
- accessible audio toggle
- semantic headings
- alt text for meaningful images
- decorative images marked appropriately
- readable contrast
- reduced motion mode

`prefers-reduced-motion` must disable or greatly reduce camera travel, parallax, and rotation.

---

# 30. Performance Budget

Because 3D + photo textures can become expensive, performance is a first-class constraint.

## Rules

- Only preload hero + immediate next visual.
- Lazy-load subsequent image assets.
- Dispose WebGL textures when scene no longer needs them.
- Do not keep 60 high-resolution textures resident in GPU memory.
- Limit visible spatial photos per scene.
- Reuse materials where possible.
- Do not add heavy post-processing unless measurable benefit.
- Avoid fullscreen high-cost displacement shaders.
- Keep mobile GPU workload significantly lower.

## Target behavior

Desktop should feel consistently smooth on modern mid-range hardware.

Mobile should remain usable without requiring a high-end device.

---

# 31. Technical Stack — Native Web + Focused Libraries

The implementation must use a **native web architecture** with focused specialist libraries. “Native” means the application layer is plain HTML, CSS, and Vanilla JavaScript; libraries are used only where they materially improve animation, 3D rendering, or scrolling.

## 31.1 Required stack

```text
HTML5
CSS3
Vanilla JavaScript (ES Modules)
        +
Three.js
        +
GSAP
```

## 31.2 Optional stack

```text
Lenis — only if native scroll behavior is insufficient
Howler.js — not required; prefer native <audio> / Web Audio API
```

The default implementation should prefer browser-native APIs over adding another dependency.

### Responsibility split

| Concern | Preferred technology | Rule |
|---|---|---|
| Document structure | HTML5 | Semantic HTML, minimal DOM wrappers |
| Layout | CSS | Grid/Flex/positioning before JS |
| Typography | CSS | Keep text outside WebGL |
| Responsive behavior | CSS media/container queries | JS only where behavior genuinely differs |
| 3D renderer | Three.js | Spatial photo planes, camera, depth |
| Timeline / choreography | GSAP | Scroll-linked and scene animation |
| Smooth scrolling | Native scroll first; Lenis optional | Do not add Lenis merely for aesthetics |
| Audio | HTMLAudioElement / Web Audio API | User gesture required before playback |
| Pointer | Pointer Events API | No dependency required |
| Intersection / visibility | IntersectionObserver | Use for lazy scene activation |
| Asset loading | Fetch / Image / createImageBitmap | Controlled preloading |

## 31.3 Explicit exclusions

Do **not** introduce: 

```text
React
Next.js
Vue
Angular
Svelte
@react-three/fiber
@react-three/drei
large UI component libraries
state-management libraries
CSS utility frameworks
```

The project is intentionally a single-purpose visual experience. Framework abstraction would add complexity without solving a real product requirement.

## 31.4 Dependency strategy

Use ES modules and keep dependencies small. Prefer locally bundled/minified production assets so the experience does not depend on a third-party CDN at runtime.

Recommended production dependencies:

```text
three
gsap
```

Optional:

```text
lenis
```

No dependency should be added merely because it offers an effect that can be implemented cleanly with CSS, browser APIs, or a small local utility.

## 31.5 Rendering boundary

HTML/CSS remains the primary layer for:

- headings
- paragraphs
- buttons
- audio controls
- navigation/index
- letter text
- accessibility semantics
- responsive layout

Three.js is reserved for:

- spatial photo planes
- layered depth
- camera choreography
- selective atmospheric geometry
- controlled 3D transitions

Do not recreate the entire page inside a canvas.

---

# 32. Native Project Architecture

The project must remain understandable to a developer who knows HTML/CSS/JavaScript without needing a framework mental model.

```text
anniversary/
├── index.html
├── package.json
├── README.md
│
├── public/
│   ├── assets/
│   │   ├── images/
│   │   ├── audio/
│   │   └── textures/
│   └── favicon.svg
│
├── src/
│   ├── main.js
│   ├── app.js
│   │
│   ├── scenes/
│   │   ├── entry.js
│   │   ├── opening.js
│   │   ├── frameField.js
│   │   ├── environmentalDepth.js
│   │   ├── reflectivePassage.js
│   │   ├── privateDetails.js
│   │   ├── nightSpace.js
│   │   ├── coupleArchive.js
│   │   ├── letter.js
│   │   └── finalFrame.js
│   │
│   ├── three/
│   │   ├── renderer.js
│   │   ├── camera.js
│   │   ├── scene.js
│   │   ├── materials.js
│   │   ├── photoPlane.js
│   │   └── dispose.js
│   │
│   ├── motion/
│   │   ├── timeline.js
│   │   ├── scroll.js
│   │   ├── pointer.js
│   │   └── easing.js
│   │
│   ├── audio/
│   │   ├── controller.js
│   │   └── ambient.js
│   │
│   ├── content/
│   │   ├── photos.js
│   │   ├── scenes.js
│   │   └── letter.js
│   │
│   ├── ui/
│   │   ├── cursor.js
│   │   ├── controls.js
│   │   └── progress.js
│   │
│   └── utils/
│       ├── preload.js
│       ├── viewport.js
│       ├── math.js
│       └── performance.js
│
└── styles/
    ├── reset.css
    ├── variables.css
    ├── base.css
    ├── layout.css
    ├── scenes.css
    ├── typography.css
    ├── interaction.css
    └── responsive.css
```

## 32.1 DOM / WebGL boundary

Use a small number of HTML scene containers. Each spatial scene owns one Three.js canvas or one shared renderer, depending on implementation complexity. A shared renderer is preferred when the same WebGL context can be reused safely.

Conceptually:

```text
<html>
 ├── semantic DOM
 │    ├── intro text
 │    ├── controls
 │    ├── scene markers
 │    └── letter
 │
 └── #experience
      └── shared Three.js canvas
           ├── opening planes
           ├── frame field
           ├── environmental planes
           ├── reflective planes
           └── closing scene
```

Do not mount dozens of separate canvases unless there is a measurable reason.

## 32.2 Module responsibilities

`app.js` owns lifecycle and scene orchestration.

`three/` owns renderer, camera, meshes, materials, and disposal.

`motion/` owns GSAP timelines, scroll progress mapping, and pointer interpolation.

`content/` owns asset metadata and copy.

`ui/` owns HTML interactions and accessibility controls.

`audio/` owns playback state, mute, volume, and user-gesture gating.

---

# 33. Content Data Model

Photos should not be hard-coded inside scene functions. Use plain JavaScript data objects so curation can change without rewriting scene logic.

Example:

```js
export const photos = [
  {
    id: 'img-42',
    filename: 'Desain tanpa judul (42).jpg',
    src: '/assets/images/Desain tanpa judul (42).webp',
    width: 623,
    height: 831,
    role: 'hero',
    scene: 'opening',
    focalPoint: { x: 0.50, y: 0.42 },
    parallaxStrength: 0.18,
    priority: 'critical'
  }
];
```

Keep metadata plain and framework-independent.

---

# 34. Scene Contract

Each scene must define at minimum:

```text
scene id
visual objective
assets
camera start
camera end
primary motion
secondary motion
text
audio state
mobile fallback
reduced-motion fallback
performance notes
cleanup / disposal rule
```

Example:

```js
export const nightSpaceScene = {
  id: 'night-space',
  primaryMotion: 'camera-drift',
  secondaryMotion: 'depth-parallax',
  assets: ['img-42', 'img-43', 'img-44'],
  mobileMode: 'single-plane-stack'
};
```

Scene modules receive plain data and return handles for activation/deactivation. They must not depend on a UI framework lifecycle.

---

# 33. Content Data Model

Photos sebaiknya tidak hard-coded di component.

Example:

```ts
export type PhotoRole =
  | 'hero'
  | 'environment'
  | 'detail'
  | 'couple'
  | 'support'
  | 'closing';

export interface PhotoAsset {
  id: string;
  filename: string;
  src: string;
  width: number;
  height: number;
  role: PhotoRole;
  focalPoint: {
    x: number;
    y: number;
  };
  parallaxStrength: number;
  scene: string;
}
```

Ini memungkinkan asset curation tanpa mengubah component logic.

---

# 34. Scene Contract

Setiap scene minimal mempunyai:

```text
scene id
visual objective
assets
camera start
camera end
primary motion
secondary motion
text
audio state
mobile fallback
reduced-motion fallback
performance notes
```

Contoh:

```ts
{
  id: 'night-space',
  primaryMotion: 'camera-drift',
  secondaryMotion: 'depth-parallax',
  assets: ['42', '43', '44'],
  mobileMode: 'single-plane-stack',
}
```

---

# 35. Mobile Fallback Philosophy

Jangan mencoba mempertahankan semua efek desktop pada mobile.

Desktop:

```text
3D camera + 5 layers + cursor
```

Mobile:

```text
native scroll + 1 hero + 1–2 depth layers
```

The mobile path is still implemented in the same Vanilla JavaScript scene system; it is a deliberate recomposition, not a separate application.

Perbedaan pengalaman diperbolehkan selama art direction tetap konsisten.

---

# 36. Final Asset Curation Tiers

## TIER A — Core

Harus mendapat treatment terbaik:

- couple/night images
- strongest environmental geometry
- strongest mirror composition

## TIER B — Support

Membangun rhythm dan memperpanjang experience.

## TIER C — Texture / Insert

Dipakai singkat.

## TIER D — Exclude

Duplicate, overly redundant, very low quality, atau composition yang tidak mendukung scene.

---

# 37. Recommended Initial Asset Set

Agar website tidak berubah menjadi slideshow 60 foto, target awal:

```text
Core hero/couple          6–8
Environmental             5–7
Portrait support          10–15
Detail / texture          5–8
Closing candidates        2–3
```

Total initial visible/content set sekitar **28–40 unik**, dengan 20–30 lainnya tetap tersedia sebagai optional archive material.

Tidak ada keharusan menghabiskan semua 60 aset.

---

# 38. Asset-to-Scene Shortlist

| Scene | Primary assets | Intended treatment |
|---|---|---|
| Opening | `(42),(43),(48),(49)` | hero plane + camera push |
| Frame Field | `(4),(5),(7),(17),(32),(41),(52)` | layered portrait wall |
| Environmental | `(6),(12),(30),(51),(53)` | depth planes + lateral camera |
| Reflective | `(14),(16),(38),(48)` | masking + camera passage |
| Private Details | `(2),(3),(8),(20),(24),(26),(31),(34),(55),(56)` | small inserts |
| Night Space | `(42),(43),(44),(45)` | dark spatial composition |
| Couple Archive | `(38),(39),(42),(43),(44),(48),(49)` | asymmetric deep archive |
| Quiet Counterpoint | `(52),(53),(57)` | low-motion scene |
| Final | `(48),(49),(42)` | slow pull-back / hold |

Suffix notation `(N)` refers to the corresponding filename `Desain tanpa judul (N).jpg`; the unsuffixed file is `Desain tanpa judul.jpg`.

---

# 39. What Not To Build

Do not build:

```text
Hero
  ↓
3 cards
  ↓
Photo gallery grid
  ↓
Timeline 2023/2024/2025/2026
  ↓
Reasons I love you
  ↓
Heart animation
  ↓
Letter
  ↓
Footer
```

This would immediately feel like a generic anniversary template.

Do not build a generic 3D portfolio either:

```text
random floating cubes
+ random particles
+ random camera orbit
+ photos attached to cubes
```

3D must originate from the photographic material.

---

# 40. Quality Bar

The website passes creative review only when:

### Visual

- The photos are immediately recognizable as the dominant source material.
- 3D feels spatial rather than decorative.
- No obvious template section pattern exists.
- Typography is restrained.
- Color treatment preserves photographic individuality.

### Motion

- Motion has hierarchy.
- Camera movement feels intentional.
- No scene has excessive simultaneous effects.
- Interaction is subtle and useful.

### Emotional

- Romance comes from proximity, pacing, imagery, and copy.
- It does not depend on hearts or generic romantic symbols.
- The letter is the emotional peak, not an afterthought.

### Technical

- Desktop is performant.
- Mobile remains enjoyable.
- Audio is user-controlled.
- Reduced motion is respected.
- Text remains accessible.

### Authenticity

- No invented chronology.
- No invented location.
- No invented event.
- No fabricated memories.
- No generic AI-like romantic copy as final content.

---

# 41. Acceptance Criteria

## AC-01 — Asset fidelity

All displayed photos must originate from the supplied asset collection unless explicitly replaced by the owner.

## AC-02 — No fabricated metadata

Website must not state a year, location, event, or date for a photo unless supplied by the owner.

## AC-03 — Spatial identity

At least three scenes must use true depth/camera composition rather than a flat 2D gallery.

## AC-04 — Interaction restraint

Interactive elements must be selective. The user should not feel that everything is moving.

## AC-05 — Photo-first

3D effects cannot dominate the actual photographs.

## AC-06 — Mobile viability

All essential content works without hover.

## AC-07 — Audio control

Music begins only after a user gesture and can be muted.

## AC-08 — Reduced motion

`prefers-reduced-motion` reduces or disables camera/parallax choreography.

## AC-09 — No generic anniversary UI

The final page must not visually resemble a generic wedding/anniversary template.

## AC-10 — Performance

GPU texture usage, image decoding, and animation workload are managed explicitly.

## AC-11 — Native architecture

The application layer contains no React/Next/Vue/Angular/Svelte runtime and no R3F layer. UI and scene orchestration use native HTML/CSS/Vanilla JavaScript with only the approved focused libraries.

## AC-12 — Library restraint

Three.js and GSAP are actively used for responsibilities they are suited for; no additional visual-effects dependency is introduced without a concrete requirement.


---

# 42. QA Checklist

Before final deployment:

### Assets

- [ ] exact duplicate hashes checked
- [ ] near duplicates reviewed
- [ ] sideways images normalized
- [ ] watermark candidates reviewed
- [ ] focal point set
- [ ] hero assets compressed separately

### Visual

- [ ] desktop composition checked
- [ ] tablet composition checked
- [ ] mobile composition checked
- [ ] no face clipping
- [ ] no accidental crop of hands/important objects
- [ ] black levels consistent
- [ ] no excessive glow

### Motion

- [ ] scroll feels natural
- [ ] transitions do not fight each other
- [ ] pointer response is subtle
- [ ] reduced motion mode works

### Audio

- [ ] starts only after interaction
- [ ] mute works
- [ ] volume is reasonable
- [ ] no sudden loudness jump

### Technical

- [ ] WebGL context cleanup
- [ ] image lazy loading
- [ ] mobile performance
- [ ] no console errors
- [ ] no missing assets
- [ ] no layout shift from images

---

# 43. Implementation Order

Build in this order:

```text
1. Asset normalization
2. Asset metadata / curation
3. Typography + color system
4. Entry scene
5. Opening camera scene
6. FrameField primitive
7. Environmental scene
8. Reflective scene
9. Couple archive
10. Letter
11. Audio
12. Pointer interactions
13. Mobile recomposition
14. Performance pass
15. Accessibility pass
16. Final visual polish
```

Do not start by adding particle shaders.

---

# 44. Native Architecture Guardrail

This project is intentionally **native-first**. Adding a framework because the code starts to feel repetitive is not an acceptable default response. Prefer small, explicit modules and plain objects. Refactor duplicated logic into local utilities before introducing a new dependency.

The approved baseline is:

```text
HTML + CSS + Vanilla JS
        +
Three.js + GSAP
        +
optional Lenis
```

Any dependency beyond this baseline requires a concrete technical justification recorded in the implementation notes.

---

# 44. Definition of Done

Project dianggap selesai ketika:

> Website terasa seperti **satu karya digital personal**, bukan kumpulan komponen.

Secara konkret:

```text
Real Photos
    ↓
Curated Frames
    ↓
Spatial Camera
    ↓
Human Copy
    ↓
Music
    ↓
Controlled Interaction
    ↓
Quiet Ending
```

dan bukan:

```text
Template
    ↓
Cards
    ↓
Generic 3D
    ↓
Romantic Effects
    ↓
Auto-generated Copy
```

---

# 45. Handoff Notes

Dokumen ini adalah source of truth untuk implementasi setelah asset ZIP dianalisis.

Hal yang **belum boleh diisi secara otomatis**:

- surat anniversary final
- nama panggilan
- quote personal
- tanggal selain 27 September 2026 jika belum diberikan
- fakta hubungan
- lokasi
- kronologi
- alasan di balik sebuah foto

Hal tersebut harus berasal dari pemilik.

Asset analysis sudah memberikan art direction dan shortlist, tetapi visual QA pada hasil implementasi tetap wajib dilakukan. Beberapa temuan duplicate pada laporan sumber mempunyai inkonsistensi nomor/suffix; karena itu hash verification menjadi requirement teknis sebelum final curation.

---

# 46. Creative North Star

> **Do not make a website about anniversary.**  
> **Make a small world that happens to exist because of the anniversary.**

Foto adalah memory material.  
Kamera adalah cara menjelajahinya.  
Typography adalah suara.  
Music adalah atmosphere.  
Interaction adalah cara menyentuhnya.  
Dan ruang kosong adalah bagian dari emosinya.

---
