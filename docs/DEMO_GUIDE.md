# CosmoStellarAtlas — Faculty Demonstration Runbook & Presentation Guide

**Developer:** Rufus Samuel R  
**Registration Number:** URK25CS1090  
**Institution:** Karunya Institute of Technology and Sciences  
**Project:** CosmoStellarAtlas — Open Space Exploration Portal  
**Document Version:** 1.0.0 (Phase 8 Production Release)

---

## 1. Overview
This guide provides precise, step-by-step presentation scripts tailored for university faculty evaluation, laboratory viva voce examinations, and live technical demonstrations. All demonstration steps use verified bundled datasets and operate 100% offline.

---

## 2. Demonstration Paths

### Part A: The Two-Minute Rapid Faculty Evaluation
*Target: Deliver maximum technical impact and visual sophistication under strict time constraints.*

1. **Launch & Landing (`0:00 - 0:30`):**
   - Start the app with `npm run dev` and navigate to `http://localhost:5173/` (`#/`).
   - Point out the **Observatory Dashboard Hero**: Drag the 3D celestial Earth centerpiece, highlighting the real-time day/night terminator and orbiting telemetry satellite.
   - Show the dynamic statistics (8 planets, 20 missions, 50 asteroids) dynamically computed from local datasets.
2. **Flagship 3D Planetary Planetarium (`0:30 - 1:00`):**
   - Click **Planet Explorer** (`#/planets`).
   - Select **Saturn**: Rotate the procedural 3D sphere with its double-sided ring system.
   - Click **Compare World**: Select **Earth** and **Jupiter**. Show the instant physical scale discs and deterministic mathematical ratios ($11\times$ diameter, $318\times$ mass).
3. **Planetary Defense What-If Lab (`1:00 - 1:30`):**
   - Click **Asteroid Watch & Lab** (`#/asteroids`) and scroll to the **What-If Lab** (`#whatif`).
   - Drag the **Diameter Slider** from $100\text{m} \rightarrow 200\text{m}$: Emphasize that kinetic energy scales cubically by exactly $8\times$ ($2^3 = 8$).
   - Drag the **Velocity Slider** from $10\text{km/s} \rightarrow 20\text{km/s}$: Emphasize quadratic scaling ($2^2 = 4$).
   - Show that the miss distance slider is decoupled and never alters kinetic energy.
4. **Local Space Intelligence & Verification (`1:30 - 2:00`):**
   - Press `Ctrl + K` to open the Command Palette, type `"Perseverance"`, and press `Enter`.
   - Jump to **Space Intelligence** (`#/intelligence`), click **Ask the Atlas**, and click the prompt suggestion: *"What is Mars?"*.
   - Point out the instant markdown factsheet generated in $<3\text{ ms}$ completely offline without external cloud AI APIs.
   - Mention the 154 passing automated tests across TypeScript and Python.

---

### Part B: The Five-Minute Complete Feature Walkthrough
*Target: A balanced walkthrough covering core exploration, historical heritage, surface operations, and persistent learning.*

1. **Observatory Dashboard (`0:00 - 1:00`):**
   - Cover Part A hero and telemetry counters.
   - Show the **Cosmic Time Machine Preview**: Drag the year slider to `1969` to showcase Apollo 11.
   - Review the Recharts **Mission Activity Overview** bar chart.
2. **Planet Explorer & Comparison Lab (`1:00 - 2:00`):**
   - Show Three.js procedural rendering and toggle **2D Canvas Fallback** to demonstrate resilience.
   - Demonstrate the **Relative Weight Simulator**: Enter $70\text{ kg}$ on Earth to show $26.4\text{ kg}$ on Mars.
   - Click the **Bookmark Star** on Mars to save it to your Personal Space Vault.
3. **Mission Control & Interactive Replay (`2:00 - 3:00`):**
   - Navigate to **Mission Control** (`#/missions`).
   - Filter by agency (e.g. `NASA`) and destination (`Mars`).
   - Open **Apollo 11** (`#/missions/apollo-11`): Read chapter 1 of the Storytelling Engine.
   - Launch **Mission Replay Engine**: Test playback speed (`2x`), milestone scrubbing, and tactical 2D canvas shaders.
4. **Mars Rover Explorer & Photo Lab (`3:00 - 4:00`):**
   - Navigate to **Mars Rover Explorer** (`#/rovers`).
   - Select **Perseverance**, scrub to **Sol 240**, and click a high-res photo to open the **Image Inspection Lab**.
   - Zoom to $2.5\times$, drag to pan, adjust the **Contrast** slider, and review educational bounding annotations.
5. **Interactive Learning Hub & Personal Space Vault (`4:00 - 5:00`):**
   - Navigate to **Learning Hub** (`#/learn`): Show the 4 curriculum trails.
   - Open **Certification Quiz** on Trail 1: Answer 2 questions, showing question reviews with scientific explanations.
   - Navigate to **Personal Vault** (`#/vault`):
     - Show your updated **Explorer Passport** and clearance rank.
     - Inspect the interactive **SVG Constellation Progress Starfield**.
     - Click **Export Vault Data (JSON)** to demonstrate client-side data sovereignty.

---

### Part C: Full Technical Demonstration (Module-by-Module)

| Sequence | Module | Focus Area for Faculty | Verification Points |
| :---: | :--- | :--- | :--- |
| **Step 1** | Terminal Verification | Quality Assurance & Compilation | Run `npm test`, `npm run test:python`, and `npm run data:validate` |
| **Step 2** | Dashboard (`#/`) | Architecture & Visual Tokens | Starfield canvas, Earth centerpiece, `Ctrl+K` palette |
| **Step 3** | Planets (`#/planets`) | WebGL & Physics Modeling | Procedural textures, 2D fallback, relative weight simulator, comparison lab |
| **Step 4** | Time Machine (`#/timeline`) | Temporal Synchronization | 1957–Present timeline slider, epoch overview, time capsules |
| **Step 5** | Missions (`#/missions`) | Flight Heritage & Canvas Replay | 20-mission archive, storytelling engine, 2D Canvas replay engine |
| **Step 6** | Rovers (`#/rovers`) | Robotics & Image Inspection | 5 rovers, sol scrubber, Image Lab zoom/pan/filters, topographic traverse |
| **Step 7** | Asteroids (`#/asteroids`) | Planetary Defense Physics | 50 NEOs, 2D orbit radar, What-If Lab Newtonian calculations ($E \propto d^3, v^2$) |
| **Step 8** | Intelligence (`#/intelligence`)| Explainable Local Intelligence | 14 intent rules, inverted index search, 2D SVG knowledge graph (1-hop) |
| **Step 9** | Learning Hub (`#/learn`) | Pedagogical Curriculum | 4 trails, 12 lessons, 24 quiz questions, pass certification threshold |
| **Step 10** | Space Vault (`#/vault`) | Client-Side Sovereignty | Bookmarks, collections, journal, passport, SVG constellation, backup JSON |

---

## 3. Software Engineering Concepts for Faculty Discussion

When explaining the engineering rigor behind CosmoStellarAtlas:
1. **Requirements Engineering:**
   - Formal SRS specifying 78 Functional Requirements (FR-01 to FR-78) and 10 Non-Functional Requirements (NFR-01 to NFR-10).
   - Complete bidirectional traceability in `docs/REQUIREMENTS_TRACEABILITY.md`.
2. **Architectural Style:**
   - Decoupled modular Single Page Application (SPA).
   - Service Provider Pattern (`SpaceDataProvider` interface) isolating visual components from data storage, enabling seamless migration to live REST/GraphQL APIs in future phases.
   - Dual-Store Reactive State Management: Ephemeral UI state in `useAppStore`, persistent user identity and credentials in `useVaultStore`.
3. **Data Sovereignty & LocalStorage Isolation:**
   - Single versioned root envelope (`cosmostellaratlas:user:v1`) preventing storage collision.
   - Defensive validation and in-memory fallback on incognito quota restrictions.
4. **Reliability & Resilience:**
   - Global React Error Boundary (`ErrorBoundary.tsx`) catching uncaught component exceptions and providing tactile HUD recovery options without full-page crashes.
   - Automatic WebGL context fault detection falling back to pure 2D HTML5 Canvas rendering.
5. **Python Analytical Tooling Pipeline:**
   - Python 3 standard library scripts for deterministic synthetic data generation (`generate_demo_data.py`), dataset schema validation (`validate_datasets.py`), and mathematical physics verification (`asteroid_physics.py`).

---

## 4. Expected Demonstration Inputs (Cheatsheet)

### Search Queries (`Ctrl + K` or Universal Search):
- `"Mars"` $\rightarrow$ Returns Mars planet dossier, Perseverance/Curiosity rovers, and related missions.
- `"Apophis"` $\rightarrow$ Returns 99942 Apophis asteroid record and close-approach telemetry.
- `"Jezero"` $\rightarrow$ Returns Jezero Crater delta landing site and Perseverance rover.
- `"Apollo 11"` $\rightarrow$ Returns Apollo 11 mission dossier and interactive replay.

### Ask the Atlas Natural Questions:
- *"What is Mars?"* $\rightarrow$ Renders Mars physical telemetry and geological overview.
- *"Compare Earth and Jupiter"* $\rightarrow$ Renders comparative dimensional and gravitational table.
- *"Which planet has the most moons?"* $\rightarrow$ Highlights Saturn (146 cataloged moons).
- *"Tell me about Apollo 11"* $\rightarrow$ Summarizes Apollo 11 flight heritage and moon landing.

### What-If Lab Physics Presets:
- **Small Asteroid (Chelyabinsk-Scale):** $d = 20\text{ m}, v = 19\text{ km/s} \rightarrow \approx 500\text{ kt TNT}$ (High-altitude airburst).
- **Medium Asteroid (Tunguska-Scale):** $d = 60\text{ m}, v = 20\text{ km/s} \rightarrow \approx 13.5\text{ Mt TNT}$ (Regional devastation).
- **Large Asteroid (DART / Dimorphos Scale):** $d = 160\text{ m}, v = 24\text{ km/s} \rightarrow \approx 362\text{ Mt TNT}$ (Kinetic impact benchmark).
