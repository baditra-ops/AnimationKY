# IIT BHU Architectural Experience 🏛️
### Submission for the IIT BHU Tech Team Web Development Challenge — Animation Challenge

A dark, cinematic, interactive architectural showcase of the iconic **Indian Institute of Technology (BHU) Varanasi** heritage building. The experience brings the architecture to life through virtual camera movement, a 5-stage progressive reveal (Stages A–E), a climactic "Wow Moment", 60 FPS multi-layer parallax depth, campus proximity zones, localized clock tower luminescence, interactive spotlighting, and an architectural LiDAR scanner.

---

## 🌟 Core Architectural Experience

### 1. Virtual Camera & Multi-Stage Reveal
- **Virtual Camera Tracking**: Starts slightly distant with subtle perspective tilt (`scale(0.92)`, `rotateX(2.5deg)`) and smoothly approaches the facade as the building resolves.
- **STAGE A — SILHOUETTE**: Faint architectural outline emerges against an obsidian ambient backdrop with subtle amber/cyan backlighting.
- **STAGE B — STRUCTURAL REVEAL**: Directional structural wipe washes across the facade from west to east, revealing foundation colonnades and arches.
- **STAGE C — DETAIL SHARPNESS**: Contours sharpen, and precision SVG CAD blueprint lines self-draw (`stroke-dashoffset` animation).
- **STAGE D — ARCHITECTURAL LIGHT SWEEP**: A soft, realistic architectural visualization light wash glides across the facade, momentarily illuminating red sandstone cornices and ochre walls.
- **STAGE E — FULL NATURAL REVEAL**: Resolves to natural heritage colors and crisp texture clarity.

### 2. The "Wow Moment" Sequence (Stage F)
Approximately 800ms after Stage E completes:
1. The scene enters a brief calm pause.
2. The **Clock Tower** blooms with a warm golden luminescence aura and radar pulse.
3. The Web Audio synthesizer resolves with a majestic pentatonic harmonic chord.
4. Delicate Rajput chhatri arches and spire plumb lines illuminate in warm amber.
5. Telemetry updates to `HERITAGE ACTIVE // SYSTEM ONLINE`.
6. The discovery cue (`"EXPLORE THE ARCHITECTURE // SCROLL OR MOVE"`) smoothly fades in.

### 3. Unified Scroll-Driven Scene Progress
- Centralized normalized progress ($0.0 \to 1.0$) driven by mouse wheel and touch gestures.
- Bidirectionally modulates virtual camera scale ($0.98\times \to 1.22\times$), perspective depth, and inspection scrutiny.
- **Organic Architectural Breathing**: Once settled in idle mode, a gentle sinusoidal oscillation (`scale: 1.000 → 1.005 → 1.000`) keeps the scene subtly alive.

### 4. Hero Clock Tower Interaction
- **Euclidean Proximity**: Detects cursor distance to the clock tower dial (`62.5% X, 30.6% Y`).
- Approaching the tower activates:
  1. Subtle warm amber glow bloom
  2. Concentric dashed radar ping expansion
  3. Ephemeral discovery card: `CLOCK TOWER // HERITAGE ROTUNDA // ELEV +34.8M`
  4. Inspection cursor caliper morph (`"INSPECT TOWER"`)
  5. Synthesized harmonic beacon sound

### 5. Campus Proximity Zones
The scene is divided into 4 architectural quadrants:
- **Clock Tower Rotunda** (`HERITAGE SPHEROID // ELEV +34.8M`)
- **Central Foyer & Portico** (`COLONNADE ENTRANCE // LEVEL 0-2`)
- **West Wing & Lawn** (`ACADEMIC QUADRANGLE // BOTANICAL`)
- **East Facade & Loggia** (`ARCHITECTURAL VERANDA // INDO-SARACENIC`)
Approaching each zone dynamically updates the top telemetry bar and illuminates corresponding CAD lines.

### 6. 60 FPS Multi-Layer Parallax & Interactive Lighting
- **5-Layer Differential Translation**:
  1. *Blueprint Grid & Horizon*: `0.012x`
  2. *Ambient Sky & Atmosphere*: `0.024x`
  3. *Building Facade*: `0.048x`
  4. *Foreground / Clock Tower*: `0.072x`
  5. *Architectural CAD Schematics*: `0.092x`
- **Dynamic Specular Spotlight**: Soft virtual light source smoothly follows pointer with spring lerp (`0.065` factor), bathing the facade in realistic illumination.

### 7. Architectural LiDAR Scanner
- Sweeps a 140px wide luminous architectural light wash across the building.
- Dynamically highlights CAD survey nodes and triggers a sympathetic pulse on the clock tower as the wave traverses it.

### 8. Architectural Control Dock & Hotkeys
- <kbd>R</kbd> — **REVEAL**: Replays the initialization, multi-stage reveal, and Wow Moment
- <kbd>S</kbd> — **SCAN**: Triggers the architectural LiDAR facade scan
- <kbd>C</kbd> — **CAD OVERLAY**: Toggles technical architectural vector lines and datum nodes
- <kbd>L</kbd> — **LIGHTING**: Toggles between Midnight Uplighting and Golden Hour Ambiance
- <kbd>M</kbd> — **AUDIO**: Toggles ambient synthesized drone and high-tech chimes

---

## 🛠️ Architecture & Modularity

- **Core**: Vanilla HTML5, CSS3, Modern ES6+ JavaScript modules.
- **Zero Heavy Dependencies**: Pure browser native APIs (no Three.js, no GSAP, no jQuery).
- **Code Organization**:
  - `js/config.js` — Centralized coordinates, zone dimensions, and animation timings
  - `js/sceneController.js` — Virtual camera, scroll progress, and organic idle breathing
  - `js/buildingReveal.js` — 5-stage progressive reveal (A–E) and the "Wow Moment"
  - `js/clockTower.js` — Hero clock tower proximity detection and discovery card
  - `js/proximityZones.js` — Campus quadrant classification and telemetry updates
  - `js/parallax.js` — 60 FPS lerped 3D parallax and virtual spotlight engine
  - `js/architecturalOverlay.js` — Self-drawing SVG vector CAD lines
  - `js/scanner.js` — Architectural LiDAR light wash scanner
  - `js/particles.js` — Restrained Canvas 2D ambient particle engine
  - `js/cursor.js` — Fluid caliper follower with hover morphing
  - `js/audio.js` — Zero-dependency Web Audio API synthesizer
  - `js/main.js` — Master coordinator and keyboard shortcut manager

---

## 🚀 Running Locally

```bash
# Run with any HTTP server (e.g. Node or Python):
python -m http.server 5173
```
Then open `http://localhost:5173/` in your browser.