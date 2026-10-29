# Software Architecture Documentation
## CosmoStellarAtlas — Open Space Exploration Portal
**Architecture Style:** Modular Component-Driven Client-Side Architecture  
**Author:** Rufus Samuel R  
**Institution:** Karunya Institute of Technology and Sciences  
**Version:** 1.2.0 (Phase 3 Cosmic Time Machine & Mission Control)  

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


