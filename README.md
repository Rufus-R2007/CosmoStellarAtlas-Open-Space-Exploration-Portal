# CosmoStellarAtlas — Open Space Exploration Portal

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r182-black.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passed%20(80%2F80)-brightgreen.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

> **Software Engineering Micro Project — Phase 5 Asteroid Watch, Encounter Explorer & Planetary Defense Simulation Lab**  
> **Developer:** Rufus Samuel R  
> **Institution:** Karunya Institute of Technology and Sciences  
> **GitHub Repository:** [CosmoStellarAtlas-Open-Space-Exploration-Portal](https://github.com/Rufus-R2007/CosmoStellarAtlas-Open-Space-Exploration-Portal)

---

## 1. Project Overview
**CosmoStellarAtlas** is a cinematic, educational, and interactive space exploration platform engineered as a futuristic digital observatory and mission-control heads-up display (HUD). The platform provides astrophysicists, educators, students, and space enthusiasts with a cohesive interface for surveying planetary worlds, inspecting historical flight heritage, analyzing rover telemetry, and reviewing planetary defense observations.

The system is designed with a strict **Zero External API Dependency** architecture: it runs completely client-side with zero required network calls, paid subscriptions, or backend servers, making it 100% resilient for classroom, faculty, and live offline demonstrations.

---

## 2. Problem Statement & Objectives
- **Problem:** Existing public space education portals are often fragmented across legacy government sites, cluttered with complex query forms, or dependent on brittle live APIs that encounter network timeouts, CORS restrictions, and rate-limiting during live presentations.
- **Objectives:**
  1. Build a self-contained, high-performance platform capable of running 100% offline.
  2. Implement an aerospace-grade UI/UX inspired by NASA Mission Control consoles with dark spatial palettes, custom glowing telemetry badges, and interactive HTML5 Canvas orbital visualizers.
  3. Ensure absolute data provenance transparency by clearly delineating verified curated historical facts from synthetic demonstration models.
  4. Design an extensible service architecture (`SpaceDataProvider`) that can seamlessly transition from local datasets to live REST/GraphQL APIs in future iterations.

---

## 3. Technology Stack

| Domain | Technology | Justification |
| :--- | :--- | :--- |
| **Framework** | React 18 + TypeScript | Component-based architecture with compile-time type safety. |
| **Build Tool** | Vite 6 | Lightning-fast Hot Module Replacement (HMR) and optimized Rollup production bundling. |
| **Styling** | Tailwind CSS 3.4 | Atomic utility design tokens conforming to the AstroNav HUD specification. |
| **State Management**| Zustand 5 | Lightweight centralized store with localStorage persistence and zero context cascades. |
| **Icons & Visuals** | Lucide React + HTML5 Canvas | High-precision vector icons and hardware-accelerated celestial orbital rendering. |
| **Data Analytics** | Recharts 2 | SVG-based responsive mission charts with custom aerospace tooltips. |
| **Testing** | Vitest + React Testing Library | Unit and component test runner with JSDOM environment. |
| **Routing** | React Router (HashRouter) | Client-side routing with guaranteed static compatibility on GitHub Pages. |

---

## 4. Observatory Dashboard Features (Phase 1)

1. **Section A — Cinematic Hero:**
   - Large mission headline: *"Explore Beyond the Horizon."*
   - Interactive HTML5 Canvas celestial Earth centerpiece with realistic day/night terminator, atmosphere rim glow, and orbiting telemetry beacon satellite with draggable rotation.
   - Live telemetry badges (Cape Canaveral coordinates, 1,361 W/m² Solar Flux Index).
   - Instant action buttons to begin planetary or historical exploration.
2. **Section B — Observatory Statistics:**
   - 4 metric cards dynamically computed from local datasets: Planets Cataloged (8), Flight Heritage Missions (18), Surface Telemetry Sols (11,000+), and Orbital Defense NEOs (32).
   - Animated numeric counters and status badges.
3. **Section C — Featured Planetary World:**
   - Detailed showcase with planetary metrics (AU distance, diameter, mean surface temperature, and gravity).
   - Gallery selector allowing users to inspect all 8 major planets.
4. **Section D — Historical Mission Spotlight:**
   - Featured expedition dossier on **Apollo 11**, including primary scientific achievements and flight milestones.
5. **Section E — Cosmic Time Machine Preview:**
   - Interactive temporal timeline preview spanning 1957 to 2025+.
   - Synchronized bidirectional state with Zustand (`selectedYear`), displaying matching historical launches.
6. **Section F — Mission Activity Overview:**
   - Responsive Recharts bar chart showing mission distribution across decades (1950s–2020s) and destination classes.
7. **Section G — Discovery Navigation Array:**
   - Direct navigation cards for all 8 roadmap exploration modules with explicit status badges (`ACTIVE // P1` vs roadmap phases).
8. **Section H — Atlas Briefings Feed:**
   - Scientific dispatches and simulated trajectory models with reference codes and provenance tags.
9. **Global Command Palette (`Ctrl + K`):**
   - Instant search across planets, missions, rovers, and asteroids with keyboard shortcuts.
10. **System Preferences & Visual FX:**
    - Visual effects level switcher (`High`, `Minimal`, `Off`) respecting user reduced-motion preferences.
    - Controlled fault injection toggle for faculty QA verification.

---

## 5. Planet Explorer & 3D Planetarium (Phase 2 Flagship)

1. **Procedural 3D Planetary Viewport (`PlanetCanvas3D`):**
   - High-fidelity Three.js WebGL spherical renderer displaying all 8 major planets with custom procedural equirectangular surface maps, cloud and crater synthesis, accurate axial tilts, and directional solar illumination.
   - Distinct procedural shaders for every world: Mercury (basalt impact cratering), Venus (thick sulfur-shrouded cloud bands), Earth (oceans, continents, polar caps, atmospheric glow), Mars (iron-oxide deserts, Olympus Mons caldera, polar frost), Jupiter (turbulent zonal bands, Great Red Spot eddy), Saturn (hydrocarbon golden bands, double-sided ring system), Uranus (methane-cyan tilt), and Neptune (azure storms and high-altitude cirrus).
   - Interactive viewer controls: drag-to-rotate, touch interaction, scroll/button zoom, reset view, auto-rotation pause/play, high/low texture resolution toggle, and full-viewport modal expansion.
2. **Accessible 2D Fallback Engine (`PlanetCanvasFallback`):**
   - Pure HTML5 Canvas 2D fallback renderer with banded atmospheric rendering, craters, and rings, preventing blank screens on low-power devices, software-rendered browsers, or WebGL context failures.
3. **Dual-Mode Solar System Navigator (`SolarSystemNavigator`):**
   - **Explore Mode:** Interactive carousel of planetary cards with classification badges, order numbers, and physical highlights.
   - **Solar System Schematic Mode:** True linear distance-ordered schematic array with scaled planetary markers, orbital radii, and asteroid belt marker.
4. **Comprehensive Planet Information Center (`PlanetInfoCenter`):**
   - Physical telemetry HUD: diameter, mass, surface gravity, day length, orbital period, mean surface temperature, and moon count.
   - **Relative Weight Simulator:** Interactive calculator computing user weight on any target planet based on relative gravity (`W_planet = W_earth * g_rel`).
   - **Atmospheric Composition:** Percentage progress bars detailing atmospheric chemistry (e.g., N2/O2 for Earth, CO2 for Venus/Mars, H2/He for gas giants).
   - **Notable Features Dossier:** Detailed scientific summaries of major geological landmarks (e.g., Valles Marineris, Great Red Spot, Caloris Basin).
5. **Planetary Comparison Lab (`PlanetaryComparisonLab`):**
   - Side-by-side comparison of any two planets with instant swap action and duplicate target warning handling.
   - Visual scale comparison rendering proportional celestial circles side-by-side.
   - Dynamic comparison metric bars calculating mathematical ratios between Planet A and Planet B for diameter, mass, surface gravity, day duration, and heliocentric distance.
   - **Planetary Insights Engine:** Deterministic rule-based expert analysis generating structured educational insights across dimensional, gravitational, thermal, orbital, and atmospheric domains without external LLM dependencies.
6. **Scale of the Solar System Explorer (`ScaleExplorer`):**
   - Interactive Recharts bar charts comparing all 8 worlds across Diameter (km), Orbital Distance (AU), and Orbital Period (Earth Years).
   - Educational logarithmic scaling notes explaining spatial distribution challenges in astronomy.
7. **Flight Heritage & Epoch Filtering (`PlanetRelatedMissions`):**
   - Cross-module linkage displaying historical missions targeted to the selected world.
   - Bidirectionally synchronized with the global Cosmic Time Machine epoch filter (`Epoch <= YYYY`), allowing users to simulate historical exploration states (e.g., what was known about Mars in 1969 vs 2024).
8. **Smart Search & Filters (`PlanetFilters`):**
   - Real-time search across names, codenames, and summaries.
   - Classification filter pills: All Worlds, Terrestrial, Gas Giant, Ice Giant.
   - Multi-parameter sorting: Distance from Sun, Diameter, Orbital Period, Surface Gravity.
   - Safe empty state with one-click filter reset.
9. **Planet Discovery Passport (`PlanetDiscoveryPassport`):**
   - Highlights key scientific curiosities and provides immediate one-click navigation to recommended next exploration targets.
10. **Deep Linking:**
    - Full URL search query support (`#/planets?id=saturn`) enabling persistent bookmarking and direct links to any planet.


---

## 6. Cosmic Time Machine, Mission Control & Mission Replay (Phase 3 Flagship)

Phase 3 introduces an interconnected historical exploration suite uniting the **Cosmic Time Machine**, **Mission Control Archive**, and the **Interactive Mission Replay Engine**:

### 1. Cosmic Time Machine (`/timeline`)
- **Temporal Chronology Scrubber (`TimelineScrubber`):**
  - Continuous slider spanning 1957 through present with landmark tick marks (1957 Sputnik, 1969 Apollo 11, 1977 Voyager, 1990 Hubble, 1997 Cassini, 2011 Curiosity, 2020 Perseverance, 2021 JWST, 2023 Chandrayaan-3).
  - Quick decade jump navigation buttons (1950s through 2020s), previous/next milestone stepping, and reset to current epoch.
  - Auto-advancing timeline playback loop with play/pause toggle.
  - Bidirectional state synchronization with Zustand store (`selectedYear`), propagating temporal changes across the Observatory, Planet Explorer, and Mission Control.
- **Epoch Overview Panel (`EpochOverviewPanel`):**
  - Displays real-time situational telemetry for the selected epoch: active operating missions, contemporaneous milestones, and cumulative spaceflight statistics.
  - Deep-link cards enabling instant one-click navigation to full mission dossiers.
- **Curated Cosmic Time Capsules (`TimeCapsuleCarousel` & `TimeCapsuleCard`):**
  - Showcases 13 landmark spaceflight achievements categorized into Firsts, Deep Space, Planetary, Lunar, and Telescopes.
  - Category filter pills, significance summaries, and primary source citations.

### 2. Mission Control Archive (`/missions`)
- **Comprehensive Mission Directory:**
  - Tracks 20 curated historical missions spanning 6 international agencies: NASA, ESA, JAXA, Roscosmos, ISRO, and CNSA.
  - Global summary header displaying total archive records, active operational missions, and planetary destination coverage.
- **Multi-Attribute Filter Matrix (`MissionFilters`):**
  - Free-text search matching mission names, agency tags, and objective descriptions.
  - Quick agency filter pills (NASA, ESA, JAXA, Roscosmos, ISRO, CNSA).
  - Destination dropdown (Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Outer Solar System, Deep Space).
  - Mission type dropdown (Orbiter, Lander, Rover, Flyby, Space Telescope, Sample Return, Kinetic Impactor).
  - Decade pills (1950s through 2020s).
  - Synchronized temporal epoch toggle (`Filter to active epoch <= YYYY`).
  - Multi-property sorting: Launch Date (Newest / Oldest), Mission Duration, and Mission Name (A–Z).
- **Historical Insights & Analytics Engine (`MissionAnalyticsSection` & `HistoricalInsightsEngine`):**
  - Interactive Recharts bar and pie visualizations detailing mission distribution by decade and destination.
  - Automated deterministic analytical observations highlighting historical spaceflight trends without non-deterministic AI generation.
- **Mission Dossier Cards (`MissionCard`):**
  - High-density cards featuring agency badges, destination tags, launch dates, key objectives, and direct actions to open the full dossier or launch the replay simulation.

### 3. Mission Detail Dossier (`/missions/:missionId`)
- **Identity & Engineering Specifications:**
  - Full mission header with flight patch, launch vehicle, operational timeframe, status badge, and target celestial body.
  - Technical engineering hardware specifications: dry mass (kg), launch mass (kg), power source, scientific payload instruments array, and trajectory architecture.
- **Interactive Storytelling Engine (`MissionStoryteller`):**
  - Chapter-based narrative reader dividing mission history into 5 structured educational sections:
    1. *The Challenge:* The scientific question or historical impetus.
    2. *The Mission:* Technical objectives and mission architecture.
    3. *The Journey:* Trajectory, orbital transfers, and flight dynamics.
    4. *The Discovery:* Scientific findings and breakthroughs.
    5. *The Legacy:* Enduring impact on astrophysics and human exploration.
- **Chronological Milestones Timeline:**
  - Step-by-step milestone log detailing flight events, scene classifications, and primary historical references.

### 4. Interactive Mission Replay Engine (`MissionReplayEngine` — Flagship Feature)
- **Data-Driven HTML5 Canvas Simulation:**
  - Renders specialized procedural 2D canvas scenes tailored to 7 distinct milestone event types:
    - `launchpad`: Launch pad structure, ascending vehicle silhouette, particle exhaust plumes, altitude vectors.
    - `orbital_insertion`: Central gravitational body, elliptical transfer trajectories, orbital capture burns.
    - `deep_space_cruise`: Infinite starfield warp vectors, high-gain antenna communication pulses to Earth.
    - `planetary_flyby`: Hyperbolic flyby path, limb shading, close-approach periapsis telemetry.
    - `surface_descent`: Atmospheric entry heat trail, radar altimeter telemetry, terrain elevation grid.
    - `scientific_survey`: Scanning sensor cones, multispectral wavelength sweeping lines, instrument payload telemetry.
    - `impact`: Target body surface, kinetic approach vector, shockwave expansion rings.
- **Playback Controls:**
  - Play, pause, resume, reset to milestone 0, previous/next milestone skip.
  - Variable playback speed controls: `0.5×`, `1×`, and `2×`.
  - Interactive milestone scrubber with clickable milestone markers and progress bar.
- **Accessibility & Transparency:**
  - Fullscreen expansion toggle for immersive demonstration presentations.
  - Accessible reduced-motion fallback that replaces high-frequency particle animations with stable tactical schematics.
  - Educational simulation disclaimers clearly stating that animations represent illustrative visualizations rather than live real-time spacecraft telemetry.

---

## 7. Mars Rover Explorer, Surface Operations Console & Photo Discovery Lab (Phase 4 Flagship)

Phase 4 introduces an aerospace-grade Mars Surface Operations Console and high-precision Photo Discovery Lab engineered for deterministic offline analysis:

### 1. Mars Operations Dashboard Hero (`MarsOperationsHero`)
- **Atmospheric Dust Physics Engine:** Custom HTML5 Canvas rendering ambient Martian dust particle drifts, sedimentation physics, and intermittent atmospheric dust devil gusts. Automatically obeys user visual effects preferences and system reduced-motion settings.
- **Dynamic Fleet Telemetry:** Header metrics displaying active vs total rovers (2/5), cumulative operational surface sols (11,000+ sols), cataloged camera instruments (20), and curated high-resolution Martian images (24).
- **Quick-Switch Selector Tabs:** Dedicated quick-navigation tabs allowing immediate switching between Perseverance, Curiosity, Opportunity, Spirit, and Sojourner.
- **Mars Design Tokens:** Cohesive aesthetic accents using Mars Orange (`#D76B35`), Rust (`#9C4229`), and Sand Gold (`#E3A66B`).

### 2. Interactive Rover Fleet Selection (`RoverSelector`)
- High-density card deck for all 5 NASA Mars rovers with active/concluded mission status badges, landing site names, total sols explored, and cumulative traverse odometry.
- Bi-directional URL synchronization (`#/rovers?rover=perseverance&sol=...&img=...`).

### 3. Rover Engineering Specifications & Systems Profile (`RoverProfileSection`)
- **Hardware Telemetry HUD:** Mass (kg), physical dimensions, primary electrical power system (MMRTG nuclear generator / triple-junction solar panels), mobility suspension (rocker-bogie system), top surface speed, wheel count, and wheel diameter.
- **Science Instrument Payload Accordion:** Comprehensive technical breakdown of all onboard science tools (e.g., SuperCam, Mastcam-Z, PIXL, SHERLOC, RIMFAX, MOXIE, MEDA on Perseverance; ChemCam, SAM, APXS on Curiosity).
- **Educational Engineering Concepts Drawer:** Deep-dive scientific explanations of specialized wheels, interplanetary communication latency, camera diversity, and rock laser spectroscopy.

### 4. Martian Sol Explorer & Timeline Scrubber (`SolExplorerSection`)
- Interactive continuous sol slider spanning available mission sols with landmark ticks.
- Previous / next sol stepping buttons and instant reset action to return to all sols.
- Curated operational sol activity notes documenting key mission events on specific solar days.

### 5. Multi-Facet Rover Camera Gallery (`RoverGallerySection`)
- **Multi-Attribute Search & Filter Matrix:** Free-text search, camera subsystem pills (Mastcam-Z, SuperCam, Navcam, Hazcam, WATSON, ChemCam, Pancam, etc.), mission sol filter, and topic tag pills (Bedrock, Dune, Hardware, Regolith, Science).
- **Sorting Controls:** Sort by newest sol, oldest sol, or alphabetical title.
- **Data Provenance Badges:** Clear visual delineation between Curated Historical captures (`<Badge variant="curated">`) and Illustrative Demonstration visuals (`<Badge variant="synthetic">`).
- **Resilient Empty State:** Graceful fallback with a single-click reset filter action.

### 6. Interactive Image Inspection Lab Modal (`ImageInspectionLabModal` — Standout Feature)
- **High-Precision Pan & Drag Viewport:** Click-and-drag panning with clamped viewport bounds and tactile 1:1 tracking scaled to the active zoom level.
- **Multi-Level Zoom Controls:** Interactive zoom in, zoom out, fit to screen, and reset view (1.0x through 4.0x magnification), plus a fullscreen expansion toggle.
- **Real-Time Image Processing Adjustments:** Hardware-accelerated CSS filter sliders for Brightness (50%–150%), Contrast (50%–150%), and Saturation (0%–200%) with an instant reset button, allowing users to uncover shadowed rock strata or balance bright dunes.
- **Educational Surface Annotations:** Responsive normalized percentage bounding overlays (`normalizedX`, `normalizedY`, `normalizedWidth`, `normalizedHeight`) highlighting geological and hardware features with category chips and educational descriptions. Includes an overlays visibility toggle.
- **Personal Field Discovery Notes:** In-modal user field note editor allowing users to attach observations to any inspected image, automatically persisted to browser `localStorage` (`userRoverNotes`).
- **Adjacent Photo Pagination:** Previous / next image navigation buttons and keyboard arrow key shortcuts.

### 7. Mars Surface Journey Traverse (`SurfaceJourneySection`)
- Interactive 2D topographic schematic canvas depicting 23 sequential landing site traverse waypoints across Jezero Delta, Mount Sharp/Gale Crater, Meridiani Planum, and Columbia Hills.
- Clickable waypoint pins with elevation profiles, cumulative traverse odometry ($0 \rightarrow 30.5\text{ km}$), target bedrock descriptions, and scientific discoveries.
- Direct one-click shortcuts to launch high-resolution rover photos associated with specific waypoints directly into the Inspection Lab.
- Transparent schematic disclaimer: "Illustrative traverse schematic — not an official rover traverse map."

### 8. Rover Engineering Comparison Lab (`RoverComparisonLab`)
- Side-by-side engineering telemetry matrix benchmarking any two Mars rovers across mass, dimensions, power, mobility, top speed, and science payload counts.
- Instant target swap button and duplicate selection alert.
- Engineering evolution insights summarizing 24 years of technological advancements from Sojourner to Perseverance.

### 9. Cross-Module Integration
- Direct link to inspect Mars in 3D in the Planet Explorer (`#/planets?id=mars`).
- Direct links to dedicated Mission Control dossiers (`#/missions/:missionId`).
- Synchronized navigation status across the Sidebar and Observatory Dashboard.

---

## 8. Asteroid Watch & Planetary Defense Simulation Lab (Phase 5 Flagship)

Phase 5 introduces a comprehensive, aerospace-grade planetary defense operations console (`#/asteroids`) designed around three core experiences:

### Experience A — Near-Earth Encounter Catalog & Hero Overview
- **Cinematic Planetary Defense Hero (`AsteroidWatchHero`):**
  - Atmospheric 2D Earth & particle encounter canvas.
  - Dynamically calculated fleet metrics from 50 records: Total Objects (50), Synthetic Encounters (42), Closest Historic Approach (99942 Apophis at 0.08 LD / 31,600 km), Largest Diameter (Ceres / synthetic benchmarks), and Average Diameter.
  - Transparent provenance notices: Offline Simulation, Deterministic Dataset, Fixed Reference Date (`2026-10-01`).
- **Multi-Facet Catalog Explorer (`AsteroidExplorerSection`):**
  - Real-time search across designation (e.g. `Apophis`, `SIM-2026-001`), common name, and composition.
  - Filter matrix: Orbit Class (Apollo, Aten, Amor, Atira), Category (Synthetic Encounter vs Curated Benchmark), Diameter ranges (<50m, 50-140m, 140-500m, >500m), Miss Distance (<1 LD, 1-5 LD, >5 LD), and Velocity (<15 km/s, 15-25 km/s, >25 km/s).
  - 5-way sorting: Closest Miss Distance, Largest Diameter, Highest Velocity, Earliest Date, and Latest Date.
  - Responsive card deck with telemetry metrics, hazard flags, perigee vectors, modal inspector, and direct What-If Lab trigger.
- **Asteroid Inspection Dossier Modal (`AsteroidDetailModal`):**
  - Full-screen modal with physical specs, uncertainty ranges (min/mean/max diameter), bulk density, simulated risk index, encounter telemetry in km and Lunar Distances, educational notes, and "Test in What-If Lab" CTA.

### Experience B — 2D Orbital Encounter Explorer & Chronological Scrubber
- **2D Orbital Encounter Canvas (`OrbitalEncounterCanvas`):**
  - Interactive schematic 2D HTML5 canvas depicting Earth (center), Lunar geocentric orbit ($1\text{ LD} = 384,400\text{ km}$), and hyperbolic asteroid encounter trajectories.
  - Directional vector arrows, closest approach perigee dotted vector, and dynamic distance telemetry HUD in both LD and kilometers.
  - Playback controls: Play/pause animation loop, variable speed toggles (0.5×, 1×, 2×), reset encounter, interactive zoom scaling (0.6× to 2.0×), and layer visibility toggles.
- **Chronological Close-Approach Scrubber (`CloseApproachTimeline`):**
  - Continuous horizontal event scrubber spanning 2026–2035 with chronological sorting.
  - Previous/Next encounter stepper controls, sub-lunar distance highlight pills, and active event telemetry card with one-click What-If Lab transfer.

### Experience C — Planetary Defense What-If Simulation Lab & Academic Foundations
- **Deterministic Kinetic Physics Engine (`PlanetaryDefenseWhatIfLab` & `planetaryDefenseMath.ts`):**
  - Standard classical Newtonian calculations:
    $$r = \frac{d}{2}, \quad V = \frac{4}{3}\pi r^3, \quad m = \rho V, \quad v_{\text{m/s}} = v_{\text{km/s}} \times 1000, \quad E_k = \frac{1}{2}mv^2$$
  - International TNT equivalent conversions: $1\text{ kt} = 4.184 \times 10^{12}\text{ J}$, $1\text{ Mt} = 4.184 \times 10^{15}\text{ J}$.
  - Strict Decoupling Architecture: Illustrative miss distance slider adjusts visual trajectory only—never altering kinetic impact calculations or fabricating collision probabilities.
- **Interactive Recharts Kinetic Energy Curves:**
  - *Energy vs. Diameter:* Cubic curve ($E \propto d^3$) with active diameter reference dot.
  - *Energy vs. Velocity:* Quadratic parabola ($E \propto v^2$) with active velocity reference dot.
- **Analytical Parameter Sensitivity Matrix:**
  - Dynamic table proving exact kinetic energy multipliers: Doubling diameter yields $8\times$ energy ($2^3$), doubling velocity yields $4\times$ energy ($2^2$), doubling density yields $2\times$ energy ($2^1$).
- **4 Educational Scenario Presets:**
  - *Small Asteroid (Chelyabinsk-Scale, ~20m):* High-altitude airburst (~500 kt).
  - *Medium Asteroid (Tunguska-Scale, ~60m):* Regional blast hazard (~15 Mt).
  - *Large Asteroid (DART / Dimorphos Scale, ~160m):* Cratering hazard & kinetic deflection benchmark.
  - *High-Velocity Cometary Fragment (~250m @ 38 km/s):* Extreme retrograde encounter demonstrating quadratic velocity dominance.
- **Explainable Physics Engine & Disclosures:**
  - 5 structured narrative cards detailing spherical geometry, quadratic velocity delivery, material density variance, safe flyby geometry, and explicit model limitations (vacuum energy vs. supercomputer hydrocodes).
- **Academic Foundations Panel (`PlanetaryDefenseEducationPanel`):**
  - Global survey systems review (ATLAS, Pan-STARRS, Catalina, NEO Surveyor) and orbital uncertainty error ellipses.
  - Dynamic Orbit Taxonomy: Keplerian criteria for Apollo, Aten, Amor, and Atira classes.
  - 4 Engineered Deflection Architectures: Kinetic Impactor (NASA DART heritage), Gravity Tractor, Ion Beam Shepherd / Laser Ablation, and Nuclear Standoff Detonation.

---

## 9. System Architecture & Folder Structure

```
CosmoStellarAtlas-Open-Space-Exploration-Portal/
├── docs/                        # Formal Software Engineering Documentation
│   ├── SRS.md                   # Software Requirements Specification (v1.4.0)
│   ├── ARCHITECTURE.md          # System Architecture & Multi-Module Pipelines
│   ├── DIAGRAMS.md              # 25+ UML, Use Case, Sequence & Activity Diagrams
│   ├── TRACEABILITY.md          # Requirements Traceability Matrix (FR-01 to FR-52)
│   ├── SCIENTIFIC_MODEL.md      # Scientific Physics & Planetary Defense Model Specification
│   ├── DATASETS.md              # Dataset Provenance Specification (50 Asteroids)
│   └── ROADMAP.md               # 8-Phase Master Development Plan
├── src/
│   ├── app/                     # Application Shell & Routing Configuration
│   │   └── App.tsx
│   ├── components/
│   │   ├── common/              # Reusable UI Primitives (Cards, Badges, Buttons, etc.)
│   │   └── layout/              # Navbar, Sidebar, Footer, and AppLayout Shell
│   ├── data/                    # Deterministic Local Datasets
│   │   ├── planets.ts           # 8 Major Planets with scientific & visual configurations
│   │   ├── missions.ts          # 20 Curated Historical Missions & Milestones
│   │   ├── rovers.ts            # 5 NASA Mars Rovers (Perseverance, Curiosity, Opportunity, etc.)
│   │   ├── roverCameras.ts      # 20 Authentic Rover Camera Subsystems
│   │   ├── roverImages.ts       # 24 Surface Captures with Normalized Annotations
│   │   ├── roverWaypoints.ts    # 23 Traverse Waypoints across Landing Sites
│   │   ├── roverVisualAssets.ts # High-Fidelity Scalable Vector Graphics Generator
│   │   ├── asteroids.ts         # 50 Curated & Synthetic Near-Earth Objects
│   │   ├── launches.ts          # 16 Illustrative Spaceflight Launches
│   │   └── briefings.ts         # 5 Research Briefings
│   ├── features/
│   │   ├── observatory/         # Full Observatory Dashboard Implementation (Phase 1)
│   │   ├── planets/             # Full Planet Explorer Implementation (Phase 2)
│   │   ├── timeline/            # Cosmic Time Machine Implementation (Phase 3)
│   │   ├── missions/            # Mission Control & Replay Implementation (Phase 3)
│   │   ├── rovers/              # Mars Rover Explorer Console Implementation (Phase 4)
│   │   ├── asteroids/           # Asteroid Watch & Planetary Defense Lab (Phase 5)
│   │   │   ├── components/
│   │   │   │   ├── education/   # Planetary Defense Academic Reference Panel
│   │   │   │   ├── encounter/   # 2D Orbital Encounter Canvas & Close-Approach Timeline
│   │   │   │   ├── explorer/    # Searchable Catalog Matrix & Detail Dossier Modal
│   │   │   │   ├── hero/        # Planetary Defense Hero with Dynamic Statistics
│   │   │   │   └── whatif/      # Flagship Planetary Defense What-If Simulation Lab
│   │   │   ├── utils/
│   │   │   │   └── planetaryDefenseMath.ts # Pure Deterministic Scientific Physics Engine
│   │   │   └── AsteroidsPage.tsx # Planetary Defense Portal Container & URL Synchronization
│   │   ├── intelligence/        # Space Intelligence (Phase 6 Roadmap)
│   │   ├── learning/            # Learning Hub (Phase 7 Roadmap)
│   │   ├── vault/               # Personal Space Vault (Phase 8 Roadmap)
│   │   └── notfound/            # 404 Route Recovery View
│   ├── services/                # SpaceDataProvider Interface & Mock Implementation
│   ├── store/                   # Zustand Global Store (useAppStore)
│   ├── styles/                  # Tailwind CSS & Global Styles
│   ├── tests/                   # Vitest Test Suite (80 tests across 7 suites)
│   ├── utils/                   # Mathematical utilities (planetaryMath.ts)
│   └── types/                   # TypeScript Data Contracts and Interfaces
├── index.html                   # HTML Entry Point
├── package.json                 # Dependency Manifest
├── tailwind.config.js           # AstroNav Custom Design Tokens
├── tsconfig.json                # TypeScript Strict Configuration
└── vite.config.ts               # Vite & Vitest Configuration
```

---

## 9. Offline Data Transparency & Provenance
CosmoStellarAtlas strictly adheres to academic honesty:
- **Curated Reference Data:** Astronomical measurements, physical constants, and historical spaceflight milestones are sourced from declassified NASA, ESA, and peer-reviewed records.
- **Synthetic Demonstration Telemetry:** Approaching asteroid vectors and future launch logistics are deterministically modeled for educational simulation.
- **No False Claims:** The portal never claims live satellite downlinks or active NASA API communication. An **Offline Demo Indicator** button is continuously visible in the header, opening a modal that details the provenance of every data point.

---

## 10. Installation, Execution & Build Instructions

### Prerequisites
- Node.js: `v18.0.0` or higher (verified on Node `v24.21.0`)
- npm: `v9.0.0` or higher (verified on npm `11.12.0`)

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Rufus-R2007/CosmoStellarAtlas-Open-Space-Exploration-Portal.git
cd CosmoStellarAtlas-Open-Space-Exploration-Portal
npm install
```

### Running Locally in Development Mode
Start the local Vite development server:
```bash
npm run dev
```
Navigate to `http://localhost:5173/` in your browser.

### Executing the Automated Test Suite
Run the Vitest test suite covering data provider methods, mission filtering, planetary 3D rendering fallbacks, temporal synchronization, mission replay speed controls, time capsules, storytelling engine, 404 routing, Mars rover surface operations, and planetary defense physics calculations (80 tests across 7 test suites):
```bash
npm run test
```

### Type Checking & Linting
Validate strict TypeScript compilation:
```bash
npx tsc --noEmit
```

### Production Build
Generate an optimized static build for deployment:
```bash
npm run build
```
The compiled bundle will be output to the `dist/` directory, fully configured with relative asset paths ready for GitHub Pages hosting.

---

## 11. Multi-Phase Master Roadmap

| Phase | Title | Focus Area | Status |
| :---: | :--- | :--- | :---: |
| **Phase 1** | **Foundation & Observatory Dashboard** | Core architecture, local provider, Observatory dashboard, 9-module shell, tests, and documentation. | **COMPLETED** |
| **Phase 2** | **Planet Explorer & 3D Planetarium** | Interactive Three.js 3D viewport, procedural surface textures, accessible 2D fallback, dual-mode navigator, weight calculator, side-by-side comparison lab, insights engine, scale explorer, and historical epoch filtering. | **COMPLETED** |
| **Phase 3** | **Cosmic Time Machine & Mission Control** | Continuous chronological timeline scrubber (1957–Present), decade jump navigation, epoch overview panel, curated time capsules carousel, 20-mission Mission Control archive with multi-filters and sorting, Recharts historical analytics, deterministic HistoricalInsightsEngine, mission detail dossiers with spacecraft hardware specs, 5-chapter Mission Storytelling Engine, and interactive HTML5 Canvas Mission Replay Engine with tactical scene shaders and variable speed playback. | **COMPLETED** |
| **Phase 4** | **Mars Rover Explorer & Photo Discovery Lab** | Mars Operations Dashboard Hero with atmospheric dust canvas physics, interactive rover selector across 5 explorers (Perseverance, Curiosity, Opportunity, Spirit, Sojourner), hardware specs & science instrument accordion, Martian sol timeline scrubber, multi-facet camera gallery, interactive Image Inspection Lab modal with zoom/pan and CSS image adjustments (brightness, contrast, saturation), normalized educational surface annotations, Mars surface journey topographic traverse canvas, and rover comparison lab with personal field discovery notes persisted to localStorage. | **COMPLETED** |
| **Phase 5** | **Asteroid Watch & Planetary Defense Lab** | 50 Near-Earth Object database (8 curated benchmarks + 42 synthetic encounters), 2D Keplerian orbital encounter canvas with perigee vectors and distance HUD, chronological close-approach scrubber (2026–2035), multi-facet search/filter catalog matrix, asteroid inspection dossier modal, flagship Planetary Defense What-If Lab with deterministic physics engine ($r, V, m, v, E_k$, TNT kt/Mt), interactive Recharts curves ($E \propto d^3$, $E \propto v^2$), parameter sensitivity matrix (8x, 4x, 2x), 4 educational scenario presets, explainable physics insights, and academic planetary defense foundations. | **COMPLETED** |
| **Phase 6** | **Space Intelligence & Learning Hub** | Force-directed discovery knowledge graph, astrophysics lessons, and interactive quizzes. | *Planned* |
| **Phase 7** | **Trajectory & Orbital Mechanics Lab** | Dedicated gravity-assist vector calculator, Hohmann transfer orbit simulator, stage separation sequence animations, and interplanetary trajectory modeling. | *Planned* |
| **Phase 8** | **Personal Vault & Deployment** | Explorer Passport, bookmarks, personal research notes markdown editor, and GitHub Pages release. | *Planned* |

---

## 12. Faculty Demonstration Runbook (Step-by-Step)

For faculty evaluation and live micro-project demonstrations:

1. **Launch the Application:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

2. **Navigate to Asteroid Watch (`#/asteroids`):**
   - Click **Asteroid Watch & Lab** in the sidebar navigation or click the **Asteroid Watch & Defense Lab** card in the Observatory Dashboard.
   - Observe the **Asteroid Watch Operations Hero** with the animated 2D Earth canvas, dynamic counter statistics computed from the 50 records, and transparent provenance badges (`Offline Simulation`, `Deterministic Dataset`, `Ref Date: 2026-10-01`).

3. **Experience B — 2D Orbital Encounter Explorer:**
   - Use the **Active Encounter Target** dropdown to switch between targets (e.g. `2004 MN4 — 99942 Apophis`, `SIM-2026-001`, `SIM-2026-002`).
   - Watch the animated hyperbolic trajectory sweep past Earth and Moon ($1\text{ LD} = 384,400\text{ km}$).
   - Test the playback controls: **Pause**, **Resume**, **0.5× / 1× / 2× speed**, **Reset Animation**, and **Zoom In / Out**.
   - Notice the **Closest Approach Perigee Vector** with distance HUD updating continuously.

4. **Experience B — Close-Approach Chronology:**
   - Scroll to the chronological encounter scrubber (2026–2035).
   - Click the **Next Encounter** and **Previous Encounter** stepper buttons. Notice the active encounter highlight card updating synchronously.
   - Click **Test in What-If Lab** to pre-populate simulation inputs with the selected asteroid's parameters.

5. **Experience A — Asteroid Catalog & Filter Matrix:**
   - Type `"Apophis"` in the search bar. Observe instant real-time filtering to the curated Apophis record.
   - Test multi-facet filters: Filter by **Orbit Class** (`Apollo`, `Aten`, `Amor`, `Atira`), **Category**, **Diameter Range**, or **Velocity Range**.
   - Test sorting options: Sort by **Largest Diameter** or **Highest Velocity**.
   - Click **Inspect Details** on any card to mount the **AsteroidDetailModal** displaying diameter uncertainty bounds, bulk density, simulated risk index, and close-approach telemetry.

6. **Experience C — Flagship Planetary Defense What-If Lab:**
   - Scroll down to the What-If Lab (`#whatif`).
   - Adjust the **Diameter Slider** ($10\text{--}1000\text{ m}$) and watch the **Estimated Mass**, **Volume**, and **Kinetic Energy (Megatons)** update in real time.
   - Observe the **Cubic Scaling**: Notice that doubling diameter ($100\text{m} \rightarrow 200\text{m}$) multiplies energy by $8\times$.
   - Adjust the **Encounter Velocity Slider** ($5\text{--}40\text{ km/s}$) and observe the **Quadratic Scaling**: Doubling velocity ($10\text{ km/s} \rightarrow 20\text{ km/s}$) multiplies energy by $4\times$.
   - Adjust the **Illustrative Miss Distance Slider**: Notice that miss distance changes visual display only, strictly **never** altering kinetic energy or fabricating impact probabilities.
   - Test **Scenario Presets**: Click **Small Asteroid (Chelyabinsk-Scale)**, **Medium Asteroid (Tunguska-Scale)**, or **Large Asteroid (DART / Dimorphos Scale)**.
   - Review the **Recharts Kinetic Energy Curves** with active reference dots, the **Analytical Parameter Sensitivity Table**, and the **Explainable Physics Engine** cards detailing limitations.

7. **Review Academic Foundations & Disclosures:**
   - Review the **Planetary Defense Foundations** section detailing optical survey networks (ATLAS, Pan-STARRS, LSST), orbital uncertainty ellipses, Keplerian orbit taxonomy, and 4 deflection architectures (Kinetic Impactor, Gravity Tractor, Ion Beam, Nuclear Standoff).

8. **Execute Automated Quality Verification:**
   ```bash
   npx tsc --noEmit
   npm test -- --run
   npm run build
   ```
   Verify 0 TypeScript errors, 80 passing tests across 7 test suites, and clean static build in `dist/`.

---

## 12. GitHub Pages Deployment Plan
GitHub Pages deployment will be finalized in Phase 8. The application is pre-configured for static hosting:
- `base: './'` in `vite.config.ts` ensures all asset paths are relative.
- `HashRouter` in `App.tsx` guarantees that deep linking and direct page refreshes function seamlessly without server-side rewrite rules.
- Production build verified with zero external runtime dependencies.

---

## 13. Developer & Coursework Information
- **Developer:** Rufus Samuel R
- **Institution:** Karunya Institute of Technology and Sciences
- **Project Type:** Software Engineering Micro Project
- **Academic Year:** 2026
