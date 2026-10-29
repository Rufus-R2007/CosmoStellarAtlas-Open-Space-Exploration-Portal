# CosmoStellarAtlas — Open Space Exploration Portal

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r182-black.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passed%20(138%2F138)-brightgreen.svg)](https://vitest.dev/)
[![Python Tests](https://img.shields.io/badge/Python%20Tests-16%2F16%20Passed-brightgreen.svg)](scripts/python/)
[![Total Tests](https://img.shields.io/badge/Total%20Tests-154%2F154%20Passed-brightgreen.svg)](docs/TEST_RESULTS.md)
[![Release](https://img.shields.io/badge/Release-v1.0.0-blue.svg)](https://github.com/Rufus-R2007/CosmoStellarAtlas-Open-Space-Exploration-Portal/releases)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success.svg)](https://rufus-r2007.github.io/CosmoStellarAtlas-Open-Space-Exploration-Portal/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

> **Software Engineering Micro Project — Final Production Release (Phase 8)**  
> **Developer:** Rufus Samuel R  
> **Registration Number:** URK25CS1090  
> **Institution:** Karunya Institute of Technology and Sciences  
> **Live Web Application:** [https://rufus-r2007.github.io/CosmoStellarAtlas-Open-Space-Exploration-Portal/](https://rufus-r2007.github.io/CosmoStellarAtlas-Open-Space-Exploration-Portal/)  
> **GitHub Repository:** [https://github.com/Rufus-R2007/CosmoStellarAtlas-Open-Space-Exploration-Portal](https://github.com/Rufus-R2007/CosmoStellarAtlas-Open-Space-Exploration-Portal)

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
  5. Provide an offline Python analytical pipeline for dataset validation, statistical profiling, and Newtonian impact physics modeling.

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
| **Testing** | Vitest + React Testing Library | Unit, component, and integration test runner with JSDOM environment (138 tests). |
| **Routing** | React Router (HashRouter) | Client-side routing with guaranteed static compatibility on GitHub Pages. |
| **Offline Analytics**| Python 3 (Standard Library) | Dataset validation, statistics profiling, physics verification, and unit tests (16 tests). |
| **Fault Isolation** | React Error Boundary | Aerospace-grade runtime exception interception and recovery HUD. |

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

## 9. Space Intelligence & Universal Smart Discovery (Phase 6 Flagship)

Phase 6 transformed CosmoStellarAtlas into a connected, explainable exploration platform:
- **Autonomous Cosmic Briefing Engine (`CosmicBriefingSection`):** Structured dispatches across 5 domain categories with dynamic temporal synchronization to landmark epochs (1957, 1969, 1977, 2020) and era fallbacks.
- **Ask the Atlas Assistant (`AskTheAtlasSection`):** 100% offline natural language query assistant executing in $<3\text{ ms}$ across 14 discrete scientific intents with markdown factsheets, formatted tables, and ephemeris citations.
- **Universal Inverted Search Index (`UniversalSearchSection`):** High-speed catalog scoring (+50 exact, +30 prefix, +20 token, +10 subtitle) across all 6 core domains with `Ctrl+K` Command Palette integration.
- **Relational Discovery Knowledge Graph (`CosmicDiscoveryGraphSection`):** Interactive 2D directed graph with color-coded nodes, multi-hop edges, 1-hop neighborhood subgraph focus, and an accessible semantic list view alternative.
- **Explainable Contextual Recommendations (`ExplainableRecommendationsSection`):** Suggestion engine evaluating user exploration state with transparent human-readable rationales.
- **Transparent Algorithmic Evidence Panel (`InsightEvidencePanel`):** Real-time audit drawer exposing rules applied, records evaluated, and derivation proofs.

---

## 10. Personal Space Vault, Learning Hub & Explorer Passport (Phase 7 Flagship)

Phase 7 introduces a comprehensive educational and personal persistent exploration ecosystem:
- **Client-Side Personal Space Vault (`/vault`):**
  - **Explorer Profile HUD (`VaultHeroSection`):** Displays name, callsign, clearance level (1–5), rank insignia, storage footprint, and a prominent Client-Side Data Sovereignty disclosure.
  - **Universal Bookmarks (`UniversalFavoritesSection`):** Multi-category bookmarking (Planets, Missions, Rovers, Photos, Asteroids) with search, category tabs, and direct module routing.
  - **Personal Collections (`CollectionsSection`):** Custom research shelves with theme colors and safe deletion (bookmarks remain safely in vault).
  - **Exploration Journal Logbook (`ExplorationJournalSection`):** Multi-line notes editor with entity linkages, tag categorization, date sorting, and instant local editing.
  - **Explorer Passport (`ExplorerPassportSection`):** Holographic credential card displaying verified telemetry (planets surveyed, missions logged, photos inspected, impact sims run, lessons completed, quizzes certified, total actions recorded).
  - **Interactive Explorer Constellation (`ConstellationProgressSection`):** Flagship interactive SVG starfield map mapping 12 achievement stars with glowing dual-ignition vector edges, progress indicator rings, detail inspection popovers, and an accessible list alternative.
  - **Personal Exploration Analytics (`PersonalAnalyticsSection`):** Dynamic Recharts charts illustrating activity distribution across 7 domains, curriculum trail performance (completed lessons vs quiz score %), and achievement category completion breakdown.
  - **Versioned Local Backup & Recovery (`VaultBackupSection`):** JSON export (`cosmostellaratlas-vault-backup-YYYY-MM-DD.json`), schema-validated JSON import supporting 'Merge' and 'Replace' modes, storage quota calculations, and double-confirmation reset.
- **Interactive Learning Hub (`/learn`):**
  - **Learning Hub Hero (`LearningHubHero`):** High-level metrics tracking total lessons completed, quizzes certified, and badges earned.
  - **4 Structured Learning Trails (`LearningTrailsSection`):**
    - *Trail 1: Journey Through the Solar System* (`SOL-CURR-01`)
    - *Trail 2: Mission to Mars* (`MARS-CURR-02`)
    - *Trail 3: Guardians of Earth* (`NEO-CURR-03`)
    - *Trail 4: Chronicles of Space Exploration* (`HIST-CURR-04`)
  - **Interactive Lesson Reader Modal (`InteractiveLessonModal`):** 12 comprehensive lessons with learning objectives, rich content sections with styled callout boxes (scientific reality, astro-observation, explorer insights), key takeaways, and working shortcuts to connected simulation laboratories.
  - **Reusable Certification Quiz Engine (`InteractiveQuizModal`):** 24 validated questions (6 per trail) with interactive option selection, single-question stepper, 70% passing threshold, score calculation, full question-by-question review with scientific explanations, and retry mechanics.
- **Cross-Module Telemetry Integration:**
  - Integrated working star bookmark buttons and genuine exploration event logging into `PlanetInfoCenter`, `PlanetaryComparisonLab`, `MissionCard`, `MissionDetailPage`, `MissionReplayEngine`, `ImageInspectionLabModal`, `AsteroidDetailModal`, `PlanetaryDefenseWhatIfLab`, and `CosmicBriefingSection`.

---

## 11. System Architecture & Folder Structure

```
CosmoStellarAtlas-Open-Space-Exploration-Portal/
├── docs/                        # Formal Software Engineering Documentation
│   ├── SRS.md                   # Software Requirements Specification (v1.5.0)
│   ├── ARCHITECTURE.md          # System Architecture & Multi-Module Pipelines
│   ├── DIAGRAMS.md              # 44 UML, Use Case, Sequence & Activity Diagrams
│   ├── TRACEABILITY.md          # Requirements Traceability Matrix (FR-01 to FR-75)
│   ├── SCIENTIFIC_MODEL.md      # Scientific Physics & Planetary Defense Model Specification
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
│   │   ├── missions.ts          # 20 Curated Historical Missions & Milestones
│   │   ├── rovers.ts            # 5 NASA Mars Rovers
│   │   ├── roverCameras.ts      # 20 Authentic Rover Camera Subsystems
│   │   ├── roverImages.ts       # 24 Surface Captures with Normalized Annotations
│   │   ├── roverWaypoints.ts    # 23 Traverse Waypoints across Landing Sites
│   │   ├── roverVisualAssets.ts # High-Fidelity Scalable Vector Graphics Generator
│   │   ├── asteroids.ts         # 50 Curated & Synthetic Near-Earth Objects
│   │   ├── launches.ts          # 16 Illustrative Spaceflight Launches
│   │   ├── briefings.ts         # 5 Research Briefings
│   │   └── learningTrails.ts    # 4 Curriculum Trails, 12 Lessons, 24 Quiz Questions
│   ├── features/
│   │   ├── observatory/         # Full Observatory Dashboard Implementation (Phase 1)
│   │   ├── planets/             # Full Planet Explorer Implementation (Phase 2)
│   │   ├── timeline/            # Cosmic Time Machine Implementation (Phase 3)
│   │   ├── missions/            # Mission Control & Replay Implementation (Phase 3)
│   │   ├── rovers/              # Mars Rover Explorer Console Implementation (Phase 4)
│   │   ├── asteroids/           # Asteroid Watch & Planetary Defense Lab (Phase 5)
│   │   ├── intelligence/        # Space Intelligence & Discovery (Phase 6 Completed)
│   │   ├── learning/            # Interactive Learning Hub (Phase 7 Completed)
│   │   │   ├── components/      # Hero, TrailsSection, LessonModal, QuizModal
│   │   │   └── LearningPage.tsx # Learning Hub Container
│   │   ├── vault/               # Personal Space Vault (Phase 7 Completed)
│   │   │   ├── components/      # Hero, Favorites, Collections, Journal, Passport, Constellation, Analytics, Backup
│   │   │   └── VaultPage.tsx    # Space Vault Container
│   │   └── notfound/            # 404 Route Recovery View
│   ├── services/                # SpaceDataProvider, VaultStorageService, AchievementDefinitions
│   ├── store/                   # Zustand Stores (useAppStore, useVaultStore)
│   ├── styles/                  # Tailwind CSS & Global Styles
│   ├── tests/                   # Vitest Test Suite (128 tests across 9 suites)
│   ├── utils/                   # Mathematical utilities (planetaryMath.ts)
│   └── types/                   # TypeScript Data Contracts and Interfaces
├── index.html                   # HTML Entry Point
├── package.json                 # Dependency Manifest
├── tailwind.config.js           # AstroNav Custom Design Tokens
├── tsconfig.json                # TypeScript Strict Configuration
└── vite.config.ts               # Vite & Vitest Configuration
```

---

## 12. Offline Data Transparency & Provenance
CosmoStellarAtlas strictly adheres to academic honesty:
- **Curated Reference Data:** Astronomical measurements, physical constants, and historical spaceflight milestones are sourced from declassified NASA, ESA, and peer-reviewed records.
- **Synthetic Demonstration Telemetry:** Approaching asteroid vectors and future launch logistics are deterministically modeled for educational simulation.
- **No False Claims:** The portal never claims live satellite downlinks or active NASA API communication. An **Offline Demo Indicator** button is continuously visible in the header, opening a modal that details the provenance of every data point.

---

## 13. Installation, Execution & Build Instructions

### Prerequisites
- Node.js: `v18.0.0` or higher (verified on Node `v24.21.0`)
- npm: `v9.0.0` or higher (verified on npm `11.12.0`)
- Python: `3.8` or higher (verified on Python `3.12.x`, optional for offline analytical tools; uses Standard Library only)

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

### Executing the Automated Test Suites (154 Total Tests)

1. **Vitest Frontend Test Suite (138 tests across 10 test suites):**
   ```bash
   npm test -- --run
   ```
   Covers data provider methods, mission filtering, planetary 3D rendering fallbacks, temporal synchronization, mission replay speed controls, time capsules, storytelling engine, 404 routing, Mars rover surface operations, planetary defense physics calculations, universal search indexing, natural language query intent parsing, autonomous cosmic briefings, relational discovery graph, explainable recommendations, personal space vault persistence, bookmarking, collections, journal notes, learning trail curriculum, certification quiz grading, achievement unlocks, rank derivation, JSON backup validation, and end-to-end multi-module user integration journeys.

2. **Python Offline Analytical Test Suite (16 unit tests):**
   ```bash
   npm run test:python
   # or directly: python -m unittest discover -s scripts/python -p "test_*.py"
   ```
   Verifies kinetic energy formulas, cubic/quadratic scaling laws, TNT equivalents, deterministic synthetic generation seeds, and data schema validation.

### Python Analytical Pipeline & Dataset Utilities
```bash
# Export active TypeScript datasets to canonical JSON files
npm run data:export

# Validate schema integrity, required fields, and ranges across all 9 datasets
npm run data:validate

# Calculate statistical profiles and verify 100% dataset completeness score
npm run data:stats

# Generate deterministic synthetic asteroids and missions (seed=42)
npm run data:generate
```

### Type Checking & Linting
Validate strict TypeScript compilation (zero errors):
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

## 14. Python Analytical Utilities & Offline Validation Pipeline (`scripts/python/`)

To support rigorous software engineering and academic data verification without incurring runtime dependencies, CosmoStellarAtlas features a dedicated Python analytical utilities pipeline located in `scripts/python/`. Built strictly using the **Python Standard Library** (`argparse`, `json`, `math`, `unittest`, `re`), this pipeline runs on any machine without requiring `pip install`:

| Script | Purpose & Key Capabilities |
| :--- | :--- |
| `asteroid_physics.py` | Standalone CLI and analytical module computing Newtonian impact physics ($r = d/2$, $V = \frac{4}{3}\pi r^3$, $m = \rho V$, $E_k = \frac{1}{2}mv^2$, Joules to kt/Mt TNT equivalence). Verifies parameter sensitivity scaling ($8\times$ energy for doubled diameter, $4\times$ for doubled velocity, $2\times$ for doubled density). |
| `generate_demo_data.py` | Deterministic synthetic dataset generator utilizing fixed pseudo-random seeds (`seed=42`). Generates reproducible synthetic Near-Earth Asteroid encounters and deep-space missions tagged with explicit academic provenance (`source: 'synthetic'`). |
| `validate_datasets.py` | Quality assurance dataset validator inspecting schema compliance, required fields, numerical value bounds, valid ISO 8601 date formats, cross-entity relational referential integrity, and duplicate identifier detection across all 9 canonical datasets. |
| `dataset_statistics.py` | Data profiler and quality auditor generating comprehensive summary statistics, decade histograms, planetary target distributions, size categorization, and field completeness scores (**100.0% completeness score achieved**). |
| `test_python.py` | Automated unit test suite utilizing Python's built-in `unittest` runner. Features 16 automated tests verifying physics calculations, scaling laws, synthetic generation reproducibility, and schema validator logic. |

---

## 15. Software Engineering Documentation & Formal UML Models (`docs/`)

The repository contains an exhaustive academic software engineering documentation suite aligned with university project defense standards:

### Formal UML Architectural Diagrams (`docs/diagrams/`)
All diagrams are authored in formal Mermaid specification format:
1. `use_case_diagram.mmd`: Actor relationships across Student, Researcher, and Faculty with system boundaries.
2. `activity_planet_explorer.mmd`: Operational flow of planetary visualization, 2D fallback, and comparison synthesis.
3. `activity_mission_replay.mmd`: Tactical scene simulation state flow and playback speed transitions.
4. `activity_asteroid_simulation.mmd`: Kinetic energy derivation and sensitivity matrix computation pipeline.
5. `sequence_data_retrieval.mmd`: Decoupled `SpaceDataProvider` query dispatch, cache inspection, and model returns.
6. `sequence_vault_save.mmd`: Cross-module telemetry logging, bookmark envelope packaging, and `localStorage` persistence.
7. `component_diagram.mmd`: Full architectural component topology from UI Presentation down to JSON data stores.
8. `class_domain_model.mmd`: Domain model entity classes, attributes, methods, and relationships.
9. `entity_relationship_diagram.mmd`: Relational entity schema with primary/foreign keys and cardinalities.
10. `state_mission_replay.mmd`: Formal finite state machine of the canvas replay engine (`IDLE`, `PLAYING`, `PAUSED`, `SEEKING`, `COMPLETED`).

### Academic Project Reports & Specifications (`docs/`)
- **[Software Requirements Specification (SRS v1.6.0)](docs/SRS.md):** Complete functional (FR-01 to FR-78) and non-functional requirements (NFR-01 to NFR-10).
- **[System Architecture Document (v1.6.0)](docs/ARCHITECTURE.md):** Complete architectural patterns, data flow, component decomposition, and Section 13 Python offline analytical pipeline.
- **[Data Design Document](docs/DATA_DESIGN.md):** Data dictionary, schema definitions, entity mapping, and `cosmostellaratlas:user:v1` persistence envelope.
- **[Requirements Traceability Matrix (RTM)](docs/REQUIREMENTS_TRACEABILITY.md):** Bidirectional traceability matrix mapping every requirement to source code and test cases.
- **[Software Test Plan](docs/TEST_PLAN.md):** Quality assurance strategy, boundary value analysis, test levels, and acceptance release gates.
- **[Formal Test Cases (TC-001 to TC-040)](docs/TEST_CASES.md):** 40 formalized test cases covering all functional modules with verified pass results.
- **[Test Execution Report](docs/TEST_RESULTS.md):** Formal test execution report recording 154 passing tests (138 Vitest + 16 Python), zero defects, and build metrics.
- **[User Manual](docs/USER_MANUAL.md):** Complete user operations manual for faculty and students covering all 9 modules and keyboard navigation.
- **[Data Provenance & Scientific Transparency](docs/DATA_PROVENANCE.md):** Rigorous academic disclosure of curated historical datasets vs synthetic demonstration models and Newtonian assumptions.
- **[Future Scope & Societal Impact](docs/FUTURE_SCOPE_AND_IMPACT.md):** Strategic roadmap for live NASA Open APIs, orbital mechanics modeling, societal STEM impact, and digital equity.
- **[Comprehensive Project Overview](docs/PROJECT_OVERVIEW.md):** Full university micro-project submission report including abstract, problem statement, system architecture, innovation, and conclusion.
- **[Faculty Demonstration Guide](docs/DEMO_GUIDE.md):** Step-by-step viva presentation script featuring 2-minute elevator pitch, 5-minute core walkthrough, and deep-dive scenarios.
- **[Viva Voce Preparation Guide](docs/VIVA_PREPARATION.md):** Exhaustive defense guide answering 25 core faculty viva voce questions on architecture, design patterns, algorithms, and data provenance.

---

## 16. Multi-Phase Master Roadmap

| Phase | Title | Focus Area | Status |
| :---: | :--- | :--- | :---: |
| **Phase 1** | **Foundation & Observatory Dashboard** | Core architecture, local provider, Observatory dashboard, 9-module shell, tests, and documentation. | **COMPLETED** |
| **Phase 2** | **Planet Explorer & 3D Planetarium** | Interactive Three.js 3D viewport, procedural surface textures, accessible 2D fallback, dual-mode navigator, weight calculator, side-by-side comparison lab, insights engine, scale explorer, and historical epoch filtering. | **COMPLETED** |
| **Phase 3** | **Cosmic Time Machine & Mission Control** | Continuous chronological timeline scrubber (1957–Present), decade jump navigation, epoch overview panel, curated time capsules carousel, 20-mission Mission Control archive with multi-filters and sorting, Recharts historical analytics, deterministic HistoricalInsightsEngine, mission detail dossiers with spacecraft hardware specs, 5-chapter Mission Storytelling Engine, and interactive HTML5 Canvas Mission Replay Engine with tactical scene shaders and variable speed playback. | **COMPLETED** |
| **Phase 4** | **Mars Rover Explorer & Photo Discovery Lab** | Mars Operations Dashboard Hero with atmospheric dust canvas physics, interactive rover selector across 5 explorers (Perseverance, Curiosity, Opportunity, Spirit, Sojourner), hardware specs & science instrument accordion, Martian sol timeline scrubber, multi-facet camera gallery, interactive Image Inspection Lab modal with zoom/pan and CSS image adjustments (brightness, contrast, saturation), normalized educational surface annotations, Mars surface journey topographic traverse canvas, and rover comparison lab with personal field discovery notes persisted to localStorage. | **COMPLETED** |
| **Phase 5** | **Asteroid Watch & Planetary Defense Lab** | 50 Near-Earth Object database (8 curated benchmarks + 42 synthetic encounters), 2D Keplerian orbital encounter canvas with perigee vectors and distance HUD, chronological close-approach scrubber (2026–2035), multi-facet search/filter catalog matrix, asteroid inspection dossier modal, flagship Planetary Defense What-If Lab with deterministic physics engine ($r, V, m, v, E_k$, TNT kt/Mt), interactive Recharts curves ($E \propto d^3$, $E \propto v^2$), parameter sensitivity matrix (8x, 4x, 2x), 4 educational scenario presets, explainable physics insights, and academic planetary defense foundations. | **COMPLETED** |
| **Phase 6** | **Space Intelligence & Smart Discovery** | Inverted token search catalog, deterministic rule-based natural language query assistant (14 discrete intents), 5-category autonomous cosmic briefing engine with historical year synchronization, 2D interactive relational discovery knowledge graph (SVG) with 1-hop neighborhood subgraph filtering and accessible list view, explainable contextual recommendation engine with human-readable rationales, and transparent algorithmic evidence audit panel. | **COMPLETED** |
| **Phase 7** | **Personal Space Vault, Learning Hub & Explorer Passport** | Client-side user profile, universal bookmarks, custom collections, research journal, 4 learning trails, 12 interactive lessons, 24-question certification quiz engine, 12-badge achievement system, interactive SVG constellation progress map, and versioned JSON backup/recovery. | **COMPLETED** |
| **Phase 8** | **Final Production Release: System Integration, UI Polish, Testing & Deployment** | Aerospace-grade React Error Boundary fault isolation, offline Python analytical pipeline (16 tests), 10 formal UML diagrams, 13 software engineering documentation files, GitHub Actions CI/CD deployment workflow, and 154 passing automated tests. | **COMPLETED** |

---

## 17. Faculty Demonstration Runbook (Step-by-Step)

For faculty evaluation and live micro-project demonstrations:

1. **Launch the Application:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

2. **Observatory Dashboard (`/`):**
   - Review live dynamic counters (8 planets, 20 missions, 11,000+ sols, 50 asteroids).
   - Test the interactive 3D Earth canvas centerpiece with draggable orbital rotation.
   - Test the timeline preview and Recharts historical mission distribution chart.

3. **Planet Explorer & 3D Planetarium (`#/planets`):**
   - Rotate the Three.js 3D planet view for all 8 worlds; test the accessible 2D Canvas fallback toggle.
   - Use the **Relative Earth Weight Simulator** to compute weight variations across planets.
   - Launch the **Planetary Comparison Lab** to benchmark any two planets side-by-side with automatic scale visualization and deterministic insight generation.

4. **Cosmic Time Machine & Mission Control (`#/timeline` & `#/missions`):**
   - Drag the continuous timeline scrubber (1957–Present) to observe synchronized mission epoch telemetry.
   - Filter missions in Mission Control by agency, destination, and decade; sort by duration or launch date.
   - Open any mission detail dossier (e.g. Apollo 11, Voyager 1, Perseverance) to inspect spacecraft hardware specs and read the 5-chapter mission story.
   - Launch the **Interactive Mission Replay Engine** to observe tactical canvas shaders (launchpad, orbit, cruise, flyby, descent, survey) with variable speed playback (0.5×, 1×, 2×).

5. **Mars Rover Explorer & Inspection Lab (`#/rovers`):**
   - Switch between all 5 NASA rovers (Perseverance, Curiosity, Opportunity, Spirit, Sojourner).
   - Inspect science instruments, hardware specs, and Mars surface journey topographic waypoints.
   - Open any photo in the **Image Inspection Lab Modal**: pan, zoom (1×–4×), adjust CSS brightness/contrast/saturation, inspect educational surface annotations, and record personal field notes.

6. **Asteroid Watch & Planetary Defense Lab (`#/asteroids`):**
   - Explore the 2D Orbital Encounter Explorer with hyperbolic flyby trajectories and perigee distance HUD.
   - Review the chronological close-approach scrubber (2026–2035).
   - Enter the **Planetary Defense What-If Lab**: adjust diameter, velocity, and density sliders to verify cubic ($E \propto d^3$) and quadratic ($E \propto v^2$) kinetic energy scaling in real time.
   - Test the 4 educational scenario presets (Chelyabinsk, Tunguska, Dimorphos/DART, Retrograde Comet).

7. **Space Intelligence & Smart Discovery (`#/intelligence`):**
   - Test the 5-category autonomous cosmic briefing engine with historical year synchronization.
   - Ask questions in **Ask the Atlas** (e.g. *"What is Mars?"*, *"Compare Earth and Jupiter"*, *"Which planet has the most moons?"*) and observe instant local answers with source citations.
   - Explore the interactive 2D relational knowledge graph with 1-hop neighborhood focus and accessible list view.
   - Review explainable recommendations with human-readable rationales and audit the deterministic rule execution in the Insight Evidence panel.

8. **Personal Space Vault & Learning Hub (`#/vault` & `#/learn`):**
   - Complete lessons and take certification quizzes across the 4 structured curriculum trails.
   - Track verified progress in the **Explorer Passport** and watch achievement stars ignite on the interactive SVG **Explorer Constellation Map**.
   - Manage universal bookmarks, create custom research shelves, record field journal notes, and export/import versioned JSON vault backups.

9. **Global System Integration & Error Boundary Recovery:**
   - Verify seamless cross-module links (e.g., Planet -> Mission flight heritage -> Mission Replay -> Space Vault bookmarking).
   - Trigger the system preferences modal via the header to test reduced-motion modes and simulated fault recovery.

10. **Execute Python Analytical Pipeline:**
    ```bash
    npm run data:validate
    npm run data:stats
    npm run test:python
    ```
    Verify 100% dataset completeness score, valid schema integrity, and 16 passing Python unit tests.

11. **Execute Complete Automated Test Suite (154 Total Tests):**
    ```bash
    npx tsc --noEmit
    npm test -- --run
    npm run test:python
    npm run build
    ```
    Verify 0 TypeScript errors, 138 Vitest tests passing across 10 suites, 16 Python tests passing, and successful static production bundling in `dist/`.

---

## 18. GitHub Pages Deployment & CI/CD Pipeline

The application is deployed publicly to GitHub Pages via an automated GitHub Actions CI/CD workflow:

- **Live Application URL:** [https://rufus-r2007.github.io/CosmoStellarAtlas-Open-Space-Exploration-Portal/](https://rufus-r2007.github.io/CosmoStellarAtlas-Open-Space-Exploration-Portal/)
- **Workflow File:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
- **Deployment Strategy:**
  - Automated trigger on `push` to `main` branch.
  - Multi-stage CI pipeline executing TypeScript compilation (`tsc --noEmit`), Vitest automated tests (`npm test -- --run`), Python unit tests (`python -m unittest`), and dataset integrity validation (`validate_datasets.py`).
  - Production build generation via `npm run build` with `base: './'` for guaranteed relative asset resolution.
  - Client-side routing powered by `HashRouter`, eliminating 404 errors on direct navigation or page refresh under static hosting.
  - Zero server-side or third-party cloud runtime dependencies.

---

## 19. Developer & Coursework Information

- **Developer:** Rufus Samuel R
- **Registration Number:** URK25CS1090
- **Institution:** Karunya Institute of Technology and Sciences
- **Department:** Computer Science and Engineering
- **Course / Project Type:** Software Engineering Micro Project
- **Academic Year:** 2026
- **Repository:** [https://github.com/Rufus-R2007/CosmoStellarAtlas-Open-Space-Exploration-Portal](https://github.com/Rufus-R2007/CosmoStellarAtlas-Open-Space-Exploration-Portal)
- **Release Version:** `v1.0.0` (Production Release)
