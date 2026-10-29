# Software Architecture Documentation
## CosmoStellarAtlas — Open Space Exploration Portal
**Architecture Style:** Modular Component-Driven Client-Side Architecture  
**Author:** Rufus Samuel R  
**Institution:** Karunya Institute of Technology and Sciences  
**Version:** 1.3.0 (Phase 4 Mars Rover Explorer & Photo Discovery Lab)  

---

## 1. System Architecture Overview
CosmoStellarAtlas is designed as a modular, client-side Single Page Application (SPA) adhering to clean software engineering principles. It features a strict separation of concerns across presentation, state management, service abstractions, and local data persistence.

```
+-------------------------------------------------------------------------+
|                              User Interface                             |
|  [Navbar HUD]  [Sidebar Array]  [Observatory Views]  [Command Palette]  |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                        Application State (Zustand)                      |
|   - selectedYear: number             - visualEffects: 'high'|'min'|'off'|
|   - demoMode: boolean                - simulateError: boolean           |
|   - LocalStorage Sync Middleware                                        |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                      Service Layer (Abstraction)                        |
|  <<interface>> SpaceDataProvider                                        |
|  + getPlanets(): Promise<Planet[]>                                      |
|  + getMissions(filter): Promise<Mission[]>                              |
|  + getRovers(): Promise<Rover[]>                                        |
|  + getAsteroids(filter): Promise<Asteroid[]>                            |
|  + search(query): Promise<SearchResults>                                |
|  + getObservatoryStats(): Promise<ObservatoryStats>                     |
+-------------------------------------------------------------------------+
               |                                           |
               v (Current: Phase 1-7)                      v (Future Extension)
+-------------------------------+             +---------------------------+
|    MockSpaceDataProvider      |             |    RemoteApiSpaceProvider |
|  - Deterministic In-Memory    |             |  - REST / GraphQL Adapters|
|  - Latency Simulation         |             |  - NASA Open APIs         |
|  - Error Injection for QA     |             |  - Real-time Ephemeris    |
+-------------------------------+             +---------------------------+
               |
               v
+-------------------------------------------------------------------------+
|                         Local Seeded Datasets                           |
|  [planets.ts]  [missions.ts]  [rovers.ts]  [asteroids.ts]  [launches.ts]|
+-------------------------------------------------------------------------+
```

## 2. Component Architecture
The user interface follows a feature-based decomposition:
- **`src/app/`**: Application bootstrap, global route configuration (`HashRouter`), and top-level boundaries.
- **`src/components/common/`**: Reusable design system primitives (`Badge`, `Button`, `Card`, `StatCard`, `SectionHeader`, `OfflineDemoIndicator`, `StarfieldCanvas`, `CelestialCenterpiece`, `LoadingState`, `ErrorState`, `EmptyState`, `CommandPalette`).
- **`src/components/layout/`**: Application shell components (`Navbar`, `Sidebar`, `Footer`, `AppLayout`).
- **`src/features/observatory/`**: Observatory dashboard components (`HeroSection`, `StatsSection`, `FeaturedPlanetSection`, `MissionSpotlightSection`, `TimelinePreviewSection`, `MissionActivityChartSection`, `DiscoveryModulesSection`, `AtlasBriefingsSection`).
- **`src/features/[module]/`**: Dedicated feature pages (`planets`, `missions`, `timeline`, `rovers`, `asteroids`, `intelligence`, `learning`, `vault`).

## 3. Data-Provider Abstraction
To guarantee that the application can transition from local seeded demonstration data to remote API endpoints without rewriting UI components, all data operations are strictly encapsulated behind the `SpaceDataProvider` interface.

```typescript
export interface SpaceDataProvider {
  getPlanets(): Promise<Planet[]>;
  getPlanetById(id: string): Promise<Planet | null>;
  getMissions(filter?: MissionFilterOptions): Promise<Mission[]>;
  getMissionById(id: string): Promise<Mission | null>;
  getRovers(): Promise<Rover[]>;
  getRoverById(id: string): Promise<Rover | null>;
  getAsteroids(filter?: AsteroidFilterOptions): Promise<Asteroid[]>;
  getAsteroidById(id: string): Promise<Asteroid | null>;
  getLaunches(filter?: { status?: string }): Promise<LaunchEvent[]>;
  getBriefings(): Promise<Briefing[]>;
  search(query: string): Promise<SearchResults>;
  getObservatoryStats(): Promise<ObservatoryStats>;
  setSimulatedDelay(ms: number): void;
  setSimulatedError(enabled: boolean): void;
}
```

The concrete `MockSpaceDataProvider` class implements this contract using local typed datasets with simulated network behavior and fault injection capabilities for rigorous QA.

## 4. State Management & Persistence
Zustand is chosen for state management due to its minimal boilerplate, zero React Context re-render cascades, and seamless middleware integration.
- **Global State Store:** `useAppStore` handles cross-cutting concerns:
  - `selectedYear`: Synchronizes temporal navigation across the dashboard and the Cosmic Time Machine.
  - `visualEffects`: Controls canvas animation loops and GPU shader workloads.
  - `demoMode`: Controls demonstration telemetry overlays.
  - `simulateError`: Enables controlled fault injection for faculty testing.
- **Persistence:** High-level user preferences (`visualEffects`, `demoMode`, `telemetryUnits`) are serialized to browser `localStorage` using Zustand's `persist` middleware.

## 5. Visual Design System
The visual architecture enforces strict compliance with the **AstroNav HUD Design Specification**:
- **Palette:**
  - Base Void: `#060B19`
  - Deep Surface: `#0A1021`
  - Panel Container: `#10182B`
  - Ion Cyan: `#20D9F2` (Primary Telemetry)
  - Nebula Violet: `#8565FA` (Deep Space Heritage)
  - Solar Gold: `#FFB45B` (Thermal & Surface Telemetry)
  - Stellar White: `#F5F7FF` (Primary Copy)
  - Atmospheric Slate: `#98A7BF` (Secondary Copy)
- **Typography:**
  - Headings & Telemetry: `Space Grotesk` (uppercase, wide tracking)
  - Body & Reading: `Inter`
  - Coordinates: Monospaced `Space Grotesk`
- **Celestial Centerpiece:** Built with pure HTML5 Canvas utilizing spherical projection mathematics, axial tilt rotation, limb darkening shading, and dynamic satellite orbit tracks, avoiding heavy external WebGL engine initialization risks.

## 6. Future API Integration Strategy
In later phases (or for production deployment with real telemetry), a `RemoteSpaceDataProvider` can be created to query:
- NASA JPL Horizons REST API (Ephemerides)
- NASA NeoWS (Near-Earth Object Web Service)
- Spaceflight News API (Live Launch Feeds)
- NASA Mars Rover Photos API

Because UI components consume data exclusively through the `SpaceDataProvider` interface, switching providers requires altering a single binding in `src/services/index.ts`.

## 7. Phase 2 3D Planetary Visualization Architecture
Phase 2 introduces a dedicated, high-performance planetary rendering pipeline designed for zero-latency, offline operation without runtime image downloads:

```
+-------------------------------------------------------------------------+
|                           PlanetsPage (HUD)                             |
|  [Search / Classification Filters]  [Dual-Mode Navigator (Schematic)]   |
+-------------------------------------------------------------------------+
           |                                             |
           v                                             v
+-------------------------------+             +---------------------------+
|      PlanetCanvas3D           |             |    PlanetInfoCenter       |
|  - Three.js WebGL Canvas      |             |  - Physical Telemetry     |
|  - Axial Tilt Transform       |             |  - Weight Calculator      |
|  - Directional Solar Light    |             |  - Atmosphere Bars        |
|  - Saturn Ring Mesh           |             |  - Landmark Dossier       |
|  - Orbit Drag / Zoom Handler  |             +---------------------------+
+-------------------------------+                            |
           |                                                 v
           +-- on WebGL Failure / Force Fallback --> +---------------------------+
           |                                         |   PlanetCanvasFallback    |
           v                                         | - Accessible 2D Canvas    |
+-------------------------------+                    | - Crater / Band Shaders   |
|   PlanetTextureGenerator      |                    | - Proportional Rings      |
|  - Procedural Canvas Textures |                    +---------------------------+
|  - Banding & Crater Synthesis |
|  - Great Red Spot & Clouds    |
+-------------------------------+
           |
           v
+-------------------------------------------------------------------------+
|                  Planetary Comparison Lab & Analysis                    |
|  [Dual Selector]  [Scale Comparison]  [PlanetaryInsightsEngine (Rules)] |
+-------------------------------------------------------------------------+
```

### Rendering Pipeline Details:
1. **Procedural Texture Synthesis (`PlanetTextureGenerator.ts`):** 
   - Generates high-resolution (1024x512) or standard-resolution (512x256) equirectangular surface textures on an off-screen HTML5 Canvas.
   - Mercury: Basalt gray crater impact gradients and highland noise.
   - Venus: Thick sulfur-tinted cloud streaks and atmospheric obscuration.
   - Earth: Continents, ocean shelf gradients, polar ice caps, and atmospheric limb haze.
   - Mars: Iron-oxide red desert dunes, dark volcanic plateaus (Syrtis Major), and polar caps.
   - Jupiter: Belts, zones, turbulent eddy shearing, and the Great Red Spot oval.
   - Saturn: Golden-amber hydrocarbon atmospheric banding and ring texture gradients.
   - Uranus: Methane-cyan smooth gradient with polar brightening.
   - Neptune: Deep azure storm systems, dynamic dark spots, and high-altitude cirrus streaks.
2. **WebGL Mesh Assembly (`PlanetCanvas3D.tsx`):**
   - Renders a `SphereGeometry(2, 64, 64)` mapped with procedural canvas texture.
   - Applies true astronomical axial tilt via `mesh.rotation.z = THREE.MathUtils.degToRad(planet.axialTiltDegrees)`.
   - Directional lighting simulates the Sun from an offset azimuth (`position: [5, 3, 5]`), paired with ambient fill (`#152035`).
   - Saturnian rings are rendered using `RingGeometry(2.4, 4.4, 64)` with double-sided alpha-transparency texture mapping.
3. **Resilient Fallback Mode (`PlanetCanvasFallback.tsx`):**
   - Automatically catches WebGL context initialization errors or GPU capability limits.
   - Users can manually switch to the 2D engine using the HUD toolbar.
4. **Planetary Insights Engine (`PlanetaryInsightsEngine.ts`):**
   - A deterministic, rule-based expert system that compares any two planetary bodies across dimensional, gravitational, orbital, thermal, and atmospheric metrics, generating structured educational synthesis notes without non-deterministic LLM calls.

---

## 8. Phase 3 Cosmic Time Machine, Mission Control & Mission Replay Architecture

Phase 3 introduces an interconnected triad of historical space exploration experiences: the **Cosmic Time Machine**, **Mission Control Archive**, and **Interactive Mission Replay Engine**.

```
+----------------------------------------------------------------------------------------------------+
|                                    CosmoStellarAtlas Routing Shell                                 |
|               [Route: /timeline]                         [Route: /missions & /missions/:id]        |
+----------------------------------------------------------------------------------------------------+
       |                                                               |
       v                                                               v
+---------------------------------------------+       +----------------------------------------------+
|             TimelinePage (HUD)              |       |               MissionsPage (HUD)             |
| - TimelineScrubber (1957–Present continuous)|       | - MissionFilters (Multi-facet matrix)        |
| - Decade Jump & Play/Pause Advance Engine   |       | - MissionCard Array & MissionAnalyticsSection|
| - EpochOverviewPanel (Telemetry for Year)   |       | - Recharts Decade & Destination Aggregates   |
| - TimeCapsuleCarousel (Curated Highlights)  |       | - HistoricalInsightsEngine (Deterministic)   |
+---------------------------------------------+       +----------------------------------------------+
                       \                                              /
                        \                                            /
                         v                                          v
      +----------------------------------------------------------------------------------+
      |                           Global Application Store (Zustand)                     |
      |   - selectedYear: number (Bidirectional sync across Timeline, Missions, Planets) |
      |   - selectedMissionId: string | null                                             |
      |   - timelineDecadeFilter: string | null                                          |
      +----------------------------------------------------------------------------------+
                                                 |
                                                 v
                      +------------------------------------------------------+
                      |                 MissionDetailPage (HUD)              |
                      |  - Spacecraft Technical Specifications               |
                      |  - Mission Storyteller (Chapter Reader Engine)       |
                      |  - Chronological Milestones Timeline                 |
                      |  - Primary Launch Vector for MissionReplayEngine     |
                      +------------------------------------------------------+
                                                 |
                                                 v
                      +------------------------------------------------------+
                      |             MissionReplayEngine (Component)          |
                      |  - HTML5 Canvas Tactical Scene Renderer              |
                      |  - 7 Scene Shaders (Launch, Insertion, Cruise, etc.) |
                      |  - Playback State Machine (Play/Pause/Speed/Scrub)   |
                      |  - Accessible Reduced-Motion Fallback                |
                      +------------------------------------------------------+
```

### Architectural Subsystems:

#### 1. Cosmic Time Machine & Temporal Scrubber Pipeline (`TimelineScrubber.tsx`, `EpochOverviewPanel.tsx`)
- **Continuous Scrubber Mathematics:** The scrubber maps normalized range values `[1957, 2026]` to integer epochs. Landmark ticks represent pivotal events (1957 Sputnik, 1969 Apollo 11, 1977 Voyager, 1990 Hubble, 1997 Cassini, 2011 Curiosity, 2020 Perseverance, 2021 JWST, 2023 Chandrayaan-3).
- **Playback Animation Engine:** An interval-driven auto-advancement loop increments `selectedYear` at variable speed, emitting updates to the global store without race conditions.
- **Epoch Overview Telemetry:** Queries `SpaceDataProvider` synchronously to calculate operating missions, contemporaneous milestones, and cumulative spaceflight statistics for any chosen calendar year.

#### 2. Historical Insights Engine (`HistoricalInsightsEngine.ts`)
- Implements a pure deterministic analytical service that processes the mission catalogue:
  - Aggregates flight counts across 8 historical decades (1950s through 2020s).
  - Summarizes planetary destinations (Lunar, Mars, Outer Solar System, Deep Space).
  - Formulates deterministic historical observations regarding agency initiatives, technological inflection points, and exploration priorities without external AI dependencies.

#### 3. Mission Storytelling Engine (`MissionStoryteller.tsx`)
- Breaks multi-year space voyages into a 5-phase structured narrative:
  1. *The Challenge:* The scientific question or geopolitical impetus.
  2. *The Mission:* Technical objectives and architecture.
  3. *The Journey:* Trajectory, gravity assists, and transit phases.
  4. *The Discovery:* Scientific findings and breakthroughs.
  5. *The Legacy:* Lasting influence on astrophysics and human exploration.

#### 4. Mission Replay Tactical Scene Engine (`MissionReplayEngine.tsx`)
- Driven by a deterministic state machine managing `currentMilestoneIndex`, `isPlaying`, `playbackSpeed` (0.5×, 1×, 2×), and `isFullscreen`.
- **Canvas Scene Renderer (`renderTacticalScene`):** Uses procedural 2D canvas drawing to render specialized tactical telemetry views based on `replaySceneType`:
  - `launchpad`: Rising exhaust plumes, launch vehicle silhouette, dynamic particle sparks, altitude vectors.
  - `orbital_insertion`: Central gravitational body, elliptical orbital transfer trajectories, retrograde thruster pulses.
  - `deep_space_cruise`: Infinite starfield warp vectors, high-gain antenna communication pulse beams to Earth.
  - `planetary_flyby`: Hyperbolic encounter path, target planet limb shading, close-approach periapsis indicator.
  - `surface_descent`: Atmospheric entry heat trail, radar altimeter telemetry, terrain elevation grid.
  - `scientific_survey`: Scanning sensor cones, multispectral wavelength sweeping lines, instrument payload telemetry.
  - `impact`: Target body surface, kinetic approach vector, shockwave expansion rings.
- **Accessibility & Resiliency:** Incorporates user `reducedMotion` preference checks to substitute high-frequency particle animations with stable tactical schematics, and guards all canvas context methods against headless JSDOM environments.

---

## 9. Phase 4 Mars Rover Explorer & Surface Operations Architecture

Phase 4 introduces an aerospace-grade Mars Surface Operations Console and Interactive Photo Discovery Lab operating completely offline with deterministic datasets, high-fidelity SVG graphics, and normalized coordinate annotation overlays:

```
+--------------------------------------------------------------------------------------------------+
|                                        RoversPage (HUD)                                          |
|  - URL Search Param Sync (?rover=perseverance&sol=...&img=...)                                   |
|  - Active Rover State Sync with Zustand Store                                                    |
+--------------------------------------------------------------------------------------------------+
         |
         +----------------------------------+----------------------------------+
         |                                  |                                  |
         v                                  v                                  v
+-----------------------+        +-----------------------+        +-----------------------+
|  MarsOperationsHero   |        |     RoverSelector     |        |  RoverProfileSection  |
| - Dust Canvas Physics |        | - 5 Rover Deck Cards  |        | - Hardware Telemetry  |
| - Atmospheric Gusts   |        | - Status Indicators   |        | - Instruments Drawer  |
| - Quick-Switch Tabs   |        | - Landing Site Badges |        | - Educational Concepts|
+-----------------------+        +-----------------------+        +-----------------------+
         |                                  |                                  |
         +----------------------------------+----------------------------------+
         |
         v
+--------------------------------------------------------------------------------------------------+
|                                     SolExplorerSection                                           |
|  - Continuous Martian Solar Day Scrubber (Sol Range [0 .. Max Sol])                              |
|  - Sol Step Controls (Previous / Next Sol) & Instant Reset Filter                                |
|  - Sol Activity Operational Notes & Cross-Filtering                                              |
+--------------------------------------------------------------------------------------------------+
         |
         v
+--------------------------------------------------------------------------------------------------+
|                                     RoverGallerySection                                          |
|  - Multi-Facet Matrix: Search Query, Camera Pills, Sol Filter, Topic Tags, Sorting               |
|  - High-Density Responsive Card Grid with Provenance Badges (Curated vs Illustrative)            |
|  - High-Fidelity Local SVG Martian Visual Assets Pipeline (roverVisualAssets.ts)                 |
+--------------------------------------------------------------------------------------------------+
         |
         v
+--------------------------------------------------------------------------------------------------+
|                                  ImageInspectionLabModal                                         |
|  - Precision Pan-and-Drag Coordinate Viewport (Mouse Drag & Clamped Offsets)                     |
|  - Multi-Level Zoom Engine (1x .. 4x, Fit-to-Screen, Reset View) & Fullscreen Modal Toggle        |
|  - Real-Time CSS Processing Sliders: Brightness (50-150%), Contrast (50-150%), Saturation (0-200%) |
|  - Educational Surface Annotations: Normalized % Bounding Overlays (X, Y, W, H) & Category Tags  |
|  - Interactive Field Research Notes: Persisted to Browser LocalStorage                           |
|  - Adjacent Image Navigation (Previous / Next Photo Pagination & Keyboard Arrows)                |
+--------------------------------------------------------------------------------------------------+
         |
         +----------------------------------+----------------------------------+
         |                                                                     |
         v                                                                     v
+-----------------------------------------+       +-----------------------------------------+
|          SurfaceJourneySection          |       |           RoverComparisonLab            |
| - Topographic Schematic Canvas          |       | - Side-by-Side Dual Spec Matrix         |
| - 23 Sequential Landing Site Waypoints  |       | - Instant Rover Target Swap             |
| - Elevation, Distance, Science Notes    |       | - Generational Tech Evolution Insights  |
| - Linked Inspection Lab Photo Shortcuts |       | - Duplicate Target Selection Guard      |
| - Schematic Disclaimer Attribution      |       +-----------------------------------------+
+-----------------------------------------+
```

### Architectural Subsystems & Engineering Highlights:

#### 1. Martian Atmospheric Dust Physics Engine (`MarsOperationsHero.tsx`)
- High-performance, requestAnimationFrame-driven 2D Canvas rendering ambient dust suspension on the Martian surface.
- Particle physics simulation with horizontal wind drift vectors (`vx = 0.2 .. 0.8`), subtle gravitational sedimentation (`vy = 0.05 .. 0.3`), randomized lifespan fading, and periodic atmospheric gust pulses simulating Martian dust devils.
- Built-in reduced-motion detection (`visualEffects === 'off'` or `prefers-reduced-motion`) halts physics loops to preserve system resources and prevent accessibility violations.

#### 2. High-Precision Image Inspection Lab State Machine (`ImageInspectionLabModal.tsx`)
- Driven by a unified view transform state:
  $$\mathbf{T} = \{ \text{zoom}: [1.0, 4.0], \;\; \Delta x: [-\text{bound}, \text{bound}], \;\; \Delta y: [-\text{bound}, \text{bound}] \}$$
- **Pan & Drag Calculus:** Drag gestures track initial client coordinates `(clientX, clientY)`, dynamically updating pan offsets scaled inversely to current zoom ratio to maintain 1:1 tactile tracking under high magnification.
- **Real-Time Image Processing Pipeline:** Hardware-accelerated CSS filter chaining:
  $$\text{filter} = \text{brightness}(B) \times \text{contrast}(C) \times \text{saturate}(S)$$
  permits astrophotographers and student researchers to reveal low-contrast geological features in shaded rock overhangs or balance overexposed sand dunes.
- **Normalized Annotation Engine:** Image annotations store coordinates as normalized percentage values:
  $$\{ \bar{x}, \bar{y}, \bar{w}, \bar{h} \} \in [0, 100]\%$$
  ensuring perfect responsiveness across varying display dimensions, aspect ratios, and full-screen inspection modes without coordinate skew.
- **LocalStorage Note Synchronization:** User field notes are automatically attached to the inspected `imageId` and stored in `localStorage` under `userRoverNotes`, guaranteeing data survival across user browser reloads.

#### 3. Offline High-Fidelity Vector Visual Pipeline (`roverVisualAssets.ts`)
- Eliminates brittle external image CDNs and NASA API latency by generating 24 distinct, high-fidelity vector scenes rendered purely via scalable vector graphics (SVG data URIs).
- Procedural Martian aesthetics:
  - Multi-stop atmospheric sky gradients transitioning from deep butterscotch (`#c26d38`) to Martian rust (`#7a2814`).
  - Distant crater rims, multi-layered volcanic mesas, ripple-textured sand dunes, and stratified bedrock outcrops.
  - Authentic hardware details: Ingenuity rotor blades in flight, robotic arm coring drill heads, circular rock abrasion patches, titanium sample return tubes, and rover wheel tread impressions in regolith.
  - Tactical heads-up display overlays: Camera crosshairs, target range rings, milliradian scales, compass bearings, and optical focal markers.

#### 4. Mars Surface Journey Topographic Schematic Engine (`SurfaceJourneySection.tsx`)
- Renders an interactive 2D schematic canvas plotting 23 sequential landing site traverse waypoints across Jezero Delta, Mount Sharp/Gale Crater, Meridiani Planum, and Columbia Hills.
- Displays terrain elevation profiles, cumulative traverse odometry ($0 \rightarrow 30.5\text{ km}$), target bedrock descriptions, and scientific discoveries (e.g., clay mineral deltas, hematite blueberries, silica deposits).
- Provides instant one-click shortcuts to launch high-resolution rover photos associated with specific waypoints directly into the Inspection Lab.
- Transparently labels the visualization as an illustrative engineering schematic to prevent confusion with official NASA traverse coordinate maps.

#### 5. Rover Engineering Comparison Subsystem (`RoverComparisonLab.tsx`)
- Side-by-side engineering telemetry matrix benchmarking any two Mars rovers across mass ($11.5\text{ kg} \rightarrow 1,025\text{ kg}$), power ($100\text{ W} \text{ MMRTG}$ vs solar arrays), mobility suspension, speed ($1\text{ cm/s} \rightarrow 4.2\text{ cm/s}$), and science instrument payload counts.
- Dynamic engineering evolution synthesis highlights key historical advancements across 24 years of Mars exploration (1997 Sojourner proof-of-concept $\rightarrow$ 2004 MER twin geologists $\rightarrow$ 2012 MSL habitability laboratory $\rightarrow$ 2020 Perseverance astrobiology and sample cache station).

---

## 7. Asteroid Watch & Planetary Defense Simulation Architecture (Phase 5)

Phase 5 introduces a mission-control planetary defense operations center organized into three major experiences:
- **Experience A:** Asteroid Watch Overview & Near-Earth Encounter Catalog (`AsteroidWatchHero.tsx`, `AsteroidExplorerSection.tsx`, `AsteroidDetailModal.tsx`).
- **Experience B:** 2D Orbital Encounter Explorer & Chronological Scrubber (`OrbitalEncounterCanvas.tsx`, `CloseApproachTimeline.tsx`).
- **Experience C:** Flagship Planetary Defense What-If Simulation Lab & Academic Foundations (`PlanetaryDefenseWhatIfLab.tsx`, `PlanetaryDefenseEducationPanel.tsx`, `planetaryDefenseMath.ts`).

```
+--------------------------------------------------------------------------------------------------+
|                                         AsteroidsPage                                            |
|                                       (Route: /asteroids)                                        |
|  - URL Parameter Synchronization: ?id=<asteroidId>                                               |
|  - Anchor Quick-Link Sub-Navigation (#overview, #radar, #timeline, #catalog, #whatif, #education)|
|  - Centralized State Binding to useAppStore (selectedAsteroidId, whatIfParameters)              |
+--------------------------------------------------------------------------------------------------+
         |
         +----------------------------------+----------------------------------+
         |                                  |                                  |
         v                                  v                                  v
+------------------------+      +------------------------+      +----------------------------------+
|   AsteroidWatchHero    |      | OrbitalEncounterCanvas |      |      CloseApproachTimeline       |
| - Canvas Earth Orbit   |      | - 2D Keplerian Canvas  |      | - 2026–2035 Chronological Scrubber|
| - Aggregate Statistics |      | - Earth, Moon (1 LD)   |      | - Previous/Next Stepper Buttons  |
| - Total, PhA, Closest  |      | - Hyperbolic Flyby Traj|      | - Active Encounter Summary Card  |
| - Provenance Badges    |      | - Zoom, Speed, Perigee |      | - One-Click What-If Shortcut     |
+------------------------+      +------------------------+      +----------------------------------+
         |                                  |                                  |
         +----------------------------------+----------------------------------+
         |
         v
+--------------------------------------------------------------------------------------------------+
|                                     AsteroidExplorerSection                                      |
|  - Free-Text Search Engine: Designation, Name, Composition                                       |
|  - Multi-Facet Matrix: Orbit Class (Apollo, Aten, Amor, Atira), Category, Diameter, Dist, Vel   |
|  - 5-Way Sorting: Miss Distance, Diameter, Velocity, Earliest Date, Latest Date                   |
|  - Responsive Card Deck with Telemetry Badges, Perigee Markers, and Action CTAs                  |
+--------------------------------------------------------------------------------------------------+
         |
         +----------------------------------+
         |                                  |
         v                                  v
+---------------------------------+    +-----------------------------------------------------------+
|       AsteroidDetailModal       |    |                PlanetaryDefenseWhatIfLab                  |
| - Deep Physical Dossier Specs   |    | - Deterministic Kinetic Physics Engine                    |
| - Diameter Min/Max/Mean Ranges  |    | - Input Sliders: Diameter (10-1000m), Velocity (5-40 km/s)|
| - Composition & Density (kg/m³) |    |   Density (1000-3500 kg/m³), Illustrative Distance        |
| - Miss Distance (km & Lunar LD) |    | - KPI Cards: Volume, Mass, Joules, Kilotons, Megatons TNT |
| - Transfer to What-If Lab CTA   |    | - Recharts Curves: Energy vs Diameter, Energy vs Velocity |
+---------------------------------+    | - Analytical Sensitivity Table: 8x / 4x / 2x Multipliers   |
                                       | - 4 Scenario Presets (Chelyabinsk, Tunguska, DART, Comet) |
                                       | - Explainable Physics Cards & Model Limitations           |
                                       +-----------------------------------------------------------+
                                                    |
                                                    v
                                       +-----------------------------------------------------------+
                                       |              PlanetaryDefenseEducationPanel               |
                                       | - Global NEO Survey Telescopes (ATLAS, Pan-STARRS, LSST)  |
                                       | - Orbital Uncertainty & Error Ellipse Astrometry          |
                                       | - Dynamic Orbit Taxonomy (Apollo, Aten, Amor, Atira)      |
                                       | - 4 Deflection Methods: Kinetic Impactor, Gravity Tractor,|
                                       |   Ion Beam Shepherd / Laser, Nuclear Standoff Blast       |
                                       | - Educational Provenance & Vacuum Mechanics Disclaimer    |
                                       +-----------------------------------------------------------+
```

### Architectural Subsystems & Engineering Highlights:

#### 1. Deterministic Scientific Physics Engine (`planetaryDefenseMath.ts`)
- Pure functional, immutable mathematical library executing standard classical mechanics:
  $$r = \frac{d}{2}, \quad V = \frac{4}{3}\pi r^3, \quad m = \rho V, \quad v_{\text{m/s}} = v_{\text{km/s}} \times 1000, \quad E_k = \frac{1}{2}mv^2$$
- High-precision TNT conversions based on international standards ($1\text{ kt} = 4.184\times 10^{12}\text{ J}$, $1\text{ Mt} = 4.184\times 10^{15}\text{ J}$).
- Complete edge-case safety: all inputs validate for non-finite values ($\text{NaN}, \pm\infty$) and clamp safely to zero, eliminating potential application panics or rendering glitches.
- Decoupling guarantee: miss distance is strictly isolated to visualization and is provably excluded from kinetic impact calculations.

#### 2. 2D Keplerian Hyperbolic Flyby Radar Engine (`OrbitalEncounterCanvas.tsx`)
- HTML5 Canvas schematic rendering Earth (center), Lunar geocentric orbit ($1\text{ LD} = 384,400\text{ km}$), and the incoming Near-Earth Object trajectory.
- Calculates hyperbolic encounter coordinates:
  $$x(t) = x_{\text{perigee}} + c_1 \sinh(t), \quad y(t) = y_{\text{perigee}} + c_2 \cosh(t)$$
- Dynamic distance HUD computes real-time distance from Earth in both Lunar Distances and kilometers continuously as the asteroid sweeps along its orbital arc.
- Features directional vector arrows, closest approach perigee dotted vectors, speed multipliers ($0.5\times, 1\times, 2\times$), interactive zoom scaling ($0.6\times \text{ to } 2.0\times$), and layer visibility toggles.

#### 3. Analytical Parameter Sensitivity Subsystem (`generateSensitivityBreakdown`)
- Implements comparative sensitivity analysis computing individual parameter multipliers:
  - Asteroid Diameter ($d$): Cubed scaling ($E \propto d^3 \implies 2^3 = 8\times$ energy).
  - Impact Velocity ($v$): Quadratic scaling ($E \propto v^2 \implies 2^2 = 4\times$ energy).
  - Bulk Density ($\rho$): Linear scaling ($E \propto \rho \implies 2^1 = 2\times$ energy).
- Teaches students the disproportionate danger of large asteroid diameters compared to linear density variations.

#### 4. Explainable Physics & Educational Scenario Engine (`generateExplainableInsights`)
- Dynamically generates five structured narrative dossiers explaining the physics behind current slider parameters:
  1. *Spherical Geometry & Mass Estimation:* Explains radius cubed mass scaling.
  2. *Quadratic Kinetic Energy Delivery:* Contrasts mechanical hypervelocity energy with conventional high explosives.
  3. *Density & Compositional Variance:* Compares porous cometary rubble piles to nickel-iron monoliths.
  4. *Close-Approach Geometry vs. Collision Reality:* Clarifies that close approaches rarely result in impacts.
  5. *Crucial Educational Model Limitations:* Explicitly outlines the boundaries between simplified vacuum energy models and supercomputer-scale hydrocodes.




