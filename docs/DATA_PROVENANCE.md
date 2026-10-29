# CosmoStellarAtlas — Data Provenance, Limitations & Academic Transparency

**Developer:** Rufus Samuel R (URK25CS1090)  
**Institution:** Karunya Institute of Technology and Sciences  
**Coursework:** Software Engineering Micro Project  
**Document Version:** 1.0.0 (Phase 8 Production Release)

---

## 1. Academic Honesty & Transparency Policy

CosmoStellarAtlas was engineered as an educational software engineering micro-project. To maintain the highest standard of academic integrity and scientific responsibility, the portal adheres to the following core tenets:

1. **No False Satellite Claims:** The platform **never** claims active real-time communication with orbiting satellites, active NASA deep-space downlinks, or live telemetry from operating spacecraft.
2. **Explicit Data Classification:** Every dataset record and visual asset is explicitly categorized as either a **Curated Historical Record** or an **Illustrative Synthetic Demonstration**.
3. **Continuous Provenance UI Disclosure:** An **Offline Demo Indicator** is permanently accessible in the application's header navbar, opening a modal detailing dataset provenance and simulation boundaries.
4. **Transparent Physical Modeling:** All simulation engines explicitly declare their mathematical simplifications, assumptions, and physical bounds.

---

## 2. Dataset Provenance Breakdown

### 2.1 Curated Reference Data (Verified Historical Facts)
- **Planetary Science Data (`src/data/planets.ts` & `src/data/json/planets.json`):**
  - Planetary equatorial diameters, orbital periods, heliocentric distances, surface temperatures, and atmospheric gas compositions are compiled from peer-reviewed NASA Planetary Fact Sheets, the Jet Propulsion Laboratory (JPL) Solar System Dynamics database, and IAU physical ephemerides.
- **Historical Flight Heritage (`src/data/missions.ts` & `src/data/json/missions.json`):**
  - Mission launch dates, sponsoring agencies, flight objectives, hardware specifications, and milestone dates are derived from declassified NASA historical archives (e.g., NASA SP-4029, Apollo 11 Mission Report SP-238), ESA Historical Heritage publications, and peer-reviewed aerospace mission logs.
- **Mars Surface Operations (`src/data/rovers.ts`, `roverCameras.ts`, `roverImages.ts`):**
  - Rover landing dates, site coordinates, total operational sols, traverse distances, and scientific instrument payload specifications are verified against official NASA Mars 2020, Mars Science Laboratory (MSL), and Mars Exploration Rover (MER) mission records.

### 2.2 Synthetic Demonstration Telemetry (Analytical Simulation Models)
- **Synthetic Near-Earth Objects (`src/data/asteroids.ts` & `src/data/json/asteroids.json`):**
  - 8 benchmark asteroids (including 99942 Apophis, 101955 Bennu, 433 Eros, 16 Psyche, and Dimorphos) represent real astronomical objects with accurate survey diameters and historical flyby distances.
  - 42 approaching encounter records (designated `SIM-YYYY-XXX`) are **synthetically modeled** for classroom simulation. Their trajectories, velocities, and perigee vectors are mathematically generated to demonstrate diverse orbital geometry without representing real-world collision hazards.
- **Illustrative Launches (`src/data/launches.ts` & `src/data/json/launches.json`):**
  - Conceptual future launch logistics and orbital trajectories are synthesized to demonstrate schedule tracking and mission timeline filtering.

---

## 3. Scientific Simulation Assumptions & Mathematical Boundaries

### 3.1 Planetary Defense What-If Lab (`planetaryDefenseMath.ts` & `asteroid_physics.py`)
The What-If Lab models kinetic impact energy using classical Newtonian mechanics:
$$r = \frac{d}{2}, \quad V = \frac{4}{3}\pi r^3, \quad m = \rho V, \quad v_{\text{m/s}} = v_{\text{km/s}} \times 1000, \quad E_k = \frac{1}{2}mv^2$$
International TNT equivalence is computed using standard physical definitions:
$$1\text{ kt TNT} = 4.184 \times 10^{12}\text{ J}, \quad 1\text{ Mt TNT} = 4.184 \times 10^{15}\text{ J}$$

#### Critical Educational Disclaimers:
1. **Decoupled Miss Distance:** The illustrative miss distance slider in the What-If Lab adjusts the visual 2D orbit schematic only. It **strictly never** alters kinetic energy or fabricates collision probabilities. Miss distance is purely geometrical and cannot be used as an empirical impact probability predictor without full Monte Carlo N-body numerical integration.
2. **Vacuum Spherical Impactor Assumption:** Calculations assume a homogeneous spherical body traveling in a vacuum. The model does not simulate atmospheric hydrodynamic entry shockwaves, aerodynamic ablation, fragmentation, atmospheric airburst altitude, or blast overpressure waves.
3. **Comparison with Hydrocodes:** Real impact hazard mitigation requires high-performance supercomputing hydrocodes (e.g. CTH, ALE3D, SOVA). The What-If Lab is strictly an educational tool demonstrating cubic diameter scaling ($8\times$) and quadratic velocity scaling ($4\times$).

---

## 4. Offline Space Intelligence & Search Boundaries

### 4.1 Absence of Cloud AI APIs
- The **Ask the Atlas Assistant** runs 100% locally in the user's browser in $<3\text{ ms}$ using a deterministic, rule-based intent parser (`queryIntentParser.ts`) across 14 discrete scientific intents.
- It **does not** execute large language model (LLM) weights (e.g. GPT-4, Gemini) and does not contact remote AI inference endpoints.
- If a query cannot be deterministically resolved from the local dataset, the assistant returns an honest astronomical clarification notice rather than hallucinating unsupported facts.

### 4.2 Inverted Search Ranking
- The Universal Search Engine indexes titles, summaries, tags, and designations locally using weighted term scoring (+50 exact, +30 prefix, +20 token). It executes purely in-memory.

---

## 5. Visual Asset Provenance

- **3D Planetary Spheres:** Generated dynamically in client-side WebGL via Three.js with procedural equirectangular shader maps synthesized in pure HTML5 Canvas (`PlanetTextureGenerator.ts`). No remote NASA photo textures are loaded at runtime.
- **2D Canvas Fallbacks:** Rendered procedurally on standard 2D HTML5 canvas contexts to guarantee device accessibility.
- **Mars Rover Photographs:** Curated public-domain NASA/JPL-Caltech image captures and vector-rendered tactical schematics for offline classroom reliability.

