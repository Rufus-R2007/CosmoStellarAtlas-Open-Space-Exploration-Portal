# CosmoStellarAtlas — Open Space Exploration Portal

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r182-black.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passed%20(21%2F21)-brightgreen.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

> **Software Engineering Micro Project — Phase 3 Cosmic Time Machine & Mission Control**  
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

## 7. System Architecture & Folder Structure

```
CosmoStellarAtlas-Open-Space-Exploration-Portal/
├── docs/                        # Formal Software Engineering Documentation
│   ├── SRS.md                   # Software Requirements Specification (v1.1.0)
│   ├── ARCHITECTURE.md          # System Architecture & 3D WebGL Pipeline
│   ├── DIAGRAMS.md              # UML, Use Case, Sequence & Activity Diagrams
│   ├── TRACEABILITY.md          # Requirements Traceability Matrix
│   ├── DATASETS.md              # Dataset Provenance Specification
│   └── ROADMAP.md               # 8-Phase Master Development Plan
├── src/
│   ├── app/                     # Application Shell & Routing Configuration
│   │   └── App.tsx
│   ├── components/
│   │   ├── common/              # Reusable UI Primitives (Cards, Badges, Buttons, etc.)
│   │   └── layout/              # Navbar, Sidebar, Footer, and AppLayout Shell
│   ├── data/                    # Deterministic Local Datasets
│   │   ├── planets.ts           # 8 Major Planets with scientific & visual configurations
│   │   ├── missions.ts          # 18 Curated Historical Missions & Milestones
│   │   ├── rovers.ts            # 4 Mars Rovers (Sojourner, Opportunity, Curiosity, etc.)
│   │   ├── asteroids.ts         # 32 Curated & Synthetic Near-Earth Objects
│   │   ├── launches.ts          # 16 Illustrative Spaceflight Launches
│   │   └── briefings.ts         # 5 Research Briefings
│   ├── features/
│   │   ├── observatory/         # Full Observatory Dashboard Implementation (Phase 1)
│   │   │   ├── components/      # Sections A through H
│   │   │   └── ObservatoryPage.tsx
│   │   ├── planets/             # Full Planet Explorer Implementation (Phase 2)
│   │   │   ├── components/
│   │   │   │   ├── comparison/  # Planetary Comparison Lab & visual scale
│   │   │   │   ├── filters/     # Search input, classification pills & sort
│   │   │   │   ├── info/        # Physical stats, relative weight & atmosphere
│   │   │   │   ├── missions/    # Related missions & Cosmic Time Machine filter
│   │   │   │   ├── navigator/   # Dual-mode Solar System Navigator
│   │   │   │   ├── passport/    # Planet discovery passport highlight card
│   │   │   │   ├── scale/       # Solar system scale Recharts visualizer
│   │   │   │   └── viewer/      # Three.js 3D viewport, fallback & procedural textures
│   │   │   ├── services/        # Deterministic PlanetaryInsightsEngine
│   │   │   └── PlanetsPage.tsx  # Flagship Planet Explorer container
│   │   ├── timeline/            # Cosmic Time Machine Implementation (Phase 3)
│   │   │   ├── components/
│   │   │   │   ├── capsules/    # Curated Cosmic Time Capsules carousel & cards
│   │   │   │   ├── epoch/       # Real-time Epoch Overview Telemetry Panel
│   │   │   │   └── scrubber/    # Continuous Chronological Scrubber & Playback
│   │   │   └── TimelinePage.tsx # Cosmic Time Machine hub
│   │   ├── missions/            # Mission Control & Replay Implementation (Phase 3)
│   │   │   ├── components/
│   │   │   │   ├── analytics/   # Recharts decade & destination distribution charts
│   │   │   │   ├── cards/       # Dense Mission Dossier cards & launch action
│   │   │   │   ├── filters/     # Search, agency pills, destination & sorting
│   │   │   │   ├── replay/      # Canvas-based MissionReplayEngine with 7 scenes
│   │   │   │   └── storytelling/# 5-Chapter MissionStoryteller narrative reader
│   │   │   ├── services/        # Deterministic HistoricalInsightsEngine
│   │   │   ├── MissionsPage.tsx # Mission Control directory hub
│   │   │   └── MissionDetailPage.tsx # Comprehensive Mission Dossier route
│   │   ├── rovers/              # Mars Rover Explorer (Phase 5 Roadmap)
│   │   ├── asteroids/           # Asteroid Watch & Defense Lab (Phase 6 Roadmap)
│   │   ├── intelligence/        # Space Intelligence (Phase 7 Roadmap)
│   │   ├── learning/            # Learning Hub (Phase 7 Roadmap)
│   │   ├── vault/               # Personal Space Vault (Phase 8 Roadmap)
│   │   └── notfound/            # 404 Route Recovery View
│   ├── services/                # SpaceDataProvider Interface & Mock Implementation
│   ├── store/                   # Zustand Global Store (useAppStore)
│   ├── styles/                  # Tailwind CSS & Global Styles
│   ├── tests/                   # Vitest Unit and Component Test Suite (21 tests)
│   ├── utils/                   # Mathematical utilities (planetaryMath.ts)
│   └── types/                   # TypeScript Data Contracts and Interfaces
├── index.html                   # HTML Entry Point
├── package.json                 # Dependency Manifest
├── tailwind.config.js           # AstroNav Custom Design Tokens
├── tsconfig.json                # TypeScript Strict Configuration
└── vite.config.ts               # Vite & Vitest Configuration
```

---

## 8. Offline Data Transparency & Provenance
CosmoStellarAtlas strictly adheres to academic honesty:
- **Curated Reference Data:** Astronomical measurements, physical constants, and historical spaceflight milestones are sourced from declassified NASA, ESA, and peer-reviewed records.
- **Synthetic Demonstration Telemetry:** Approaching asteroid vectors and future launch logistics are deterministically modeled for educational simulation.
- **No False Claims:** The portal never claims live satellite downlinks or active NASA API communication. An **Offline Demo Indicator** button is continuously visible in the header, opening a modal that details the provenance of every data point.

---

## 9. Installation, Execution & Build Instructions

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
Run the Vitest test suite covering data provider methods, mission filtering, planetary 3D rendering fallbacks, temporal synchronization, mission replay speed controls, time capsules, storytelling engine, 404 routing, and error boundaries (37 tests across 5 suites):
```bash
npm run test
```

### Type Checking & Linting
Validate strict TypeScript compilation:
```bash
npm run lint
```

### Production Build
Generate an optimized static build for deployment:
```bash
npm run build
```
The compiled bundle will be output to the `dist/` directory, fully configured with relative asset paths ready for GitHub Pages hosting.

---

## 10. Multi-Phase Master Roadmap

| Phase | Title | Focus Area | Status |
| :---: | :--- | :--- | :---: |
| **Phase 1** | **Foundation & Observatory Dashboard** | Core architecture, local provider, Observatory dashboard, 9-module shell, tests, and documentation. | **COMPLETED** |
| **Phase 2** | **Planet Explorer & 3D Planetarium** | Interactive Three.js 3D viewport, procedural surface textures, accessible 2D fallback, dual-mode navigator, weight calculator, side-by-side comparison lab, insights engine, scale explorer, and historical epoch filtering. | **COMPLETED** |
| **Phase 3** | **Cosmic Time Machine & Mission Control** | Continuous chronological timeline scrubber (1957–Present), decade jump navigation, epoch overview panel, curated time capsules carousel, 20-mission Mission Control archive with multi-filters and sorting, Recharts historical analytics, deterministic HistoricalInsightsEngine, mission detail dossiers with spacecraft hardware specs, 5-chapter Mission Storytelling Engine, and interactive HTML5 Canvas Mission Replay Engine with tactical scene shaders and variable speed playback. | **COMPLETED** |
| **Phase 4** | **Mission Control Center** | Detailed technical dossiers for Apollo, Voyager, Cassini, JWST; trajectory maps. | *Planned* |
| **Phase 5** | **Mars Rover Explorer** | Tele-robotics deck, sol-by-sol raw optics viewer, sample tube cache tracker, Ingenuity logs. | *Planned* |
| **Phase 6** | **Asteroid Watch & Defense Lab** | Near-Earth Object 3D radar plot, Torino hazard calculations, and DART kinetic deflection sandbox. | *Planned* |
| **Phase 7** | **Space Intelligence & Learning Hub** | Force-directed discovery knowledge graph, astrophysics lessons, and interactive quizzes. | *Planned* |
| **Phase 8** | **Personal Vault & Deployment** | Explorer Passport, bookmarks, personal research notes markdown editor, and GitHub Pages release. | *Planned* |

---

## 11. GitHub Pages Deployment Plan
GitHub Pages deployment will be finalized in Phase 8. The application is pre-configured for static hosting:
- `base: './'` in `vite.config.ts` ensures all asset paths are relative.
- `HashRouter` in `App.tsx` guarantees that deep linking and direct page refreshes function seamlessly without server-side rewrite rules.
- Production build verified with zero external runtime dependencies.

---

## 12. Developer & Coursework Information
- **Developer:** Rufus Samuel R
- **Institution:** Karunya Institute of Technology and Sciences
- **Project Type:** Software Engineering Micro Project
- **Academic Year:** 2026
