# Software Architecture Documentation
## CosmoStellarAtlas — Open Space Exploration Portal
**Architecture Style:** Modular Component-Driven Client-Side Architecture  
**Author:** Rufus Samuel R  
**Institution:** Karunya Institute of Technology and Sciences  
**Version:** 1.0.0 (Phase 1)  

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
