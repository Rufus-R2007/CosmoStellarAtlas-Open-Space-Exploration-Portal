# Dataset Documentation & Provenance Specification
## CosmoStellarAtlas — Open Space Exploration Portal
**Author:** Rufus Samuel R  
**Institution:** Karunya Institute of Technology and Sciences  

---

## 1. Overview of Data Architecture
CosmoStellarAtlas operates with complete local data independence to eliminate external network failures, API key requirements, and rate limit errors during evaluations and demonstrations. Data is partitioned into two clear categories:
1. **Curated Reference Data:** Rigorously verified astronomical and historical records sourced from NASA, ESA, ISRO, and published astrophysical literature.
2. **Synthetic Demonstration Data:** Deterministically modeled telemetry records created specifically to evaluate UI resilience, trajectory visualization, and algorithmic scoring without making false claims of live telemetry.

## 2. Dataset Classification & Inventory

| Dataset | Location | Record Count | Classification | Key Attributes |
| :--- | :--- | :---: | :--- | :--- |
| **Planets** | `src/data/planets.ts` | 8 | **Curated** | Diameter, mass, AU distance, mean temp, gravity relative to Earth, moons count, orbital period, atmospheric gases, axial tilt, average distance in km, notable features, procedural visual configurations (surfaceShaderStyle, craterDensity, ring dimensions, atmospheric colors), discovery passport highlights, suggested next targets, and mission cross-references. |
| **Missions** | `src/data/missions.ts` | 20 | **Curated** | Launch date, agency, status, destination body, mission type, objectives, achievements, spacecraft engineering hardware specs (dryMassKg, launchMassKg, powerSource, instrumentsList, trajectoryType), 5-chapter storyline (theChallenge, theMission, theJourney, theDiscovery, theLegacy), and over 65 chronological flight milestones equipped with replaySceneType and primary source references. |
| **Time Capsules** | `src/data/timeCapsules.ts` | 13 | **Curated** | Historical landmark capsules spanning 1957–2023 categorized by Firsts, Deep Space, Planetary, Lunar, and Telescopes, including contextual descriptions, significance summaries, related mission links, and primary source citations. |
| **Mars Rovers** | `src/data/rovers.ts` | 4 | **Curated** | Landing site, coordinates, status, total surface sols, distance traveled, sample count, and instrument arrays for Sojourner, Spirit/Opportunity, Curiosity, and Perseverance. |
| **Asteroids** | `src/data/asteroids.ts` | 32 | **Hybrid (9 Curated / 23 Synthetic)** | Real objects (Apophis, Bennu, Ryugu, Didymos, Psyche, Eros, Phaethon, Toutatis, Florence) combined with deterministically simulated NEO approaches with hazard flags, miss distances, and risk indices. |
| **Launches** | `src/data/launches.ts` | 16 | **Hybrid (8 Curated / 8 Synthetic)** | Curated planned missions (Artemis II/III, Europa Clipper, Hera, NISAR, Davinci) alongside simulated exploratory payloads. |
| **Briefings** | `src/data/briefings.ts` | 5 | **Hybrid** | Astrophysical dispatches categorized by sector codes (Lunar South Pole ice, JWST GN-z11 carbon, Apophis 2029 trajectory). |

## 3. Storage & Schema Definition
All datasets are stored as typed TypeScript modules inside `src/data/` conforming to strict interfaces in `src/types/index.ts`. Every record contains a mandatory `source` tag:
```typescript
export type DataSourceType = 'curated' | 'synthetic';
```
This guarantees that UI badges (`<Badge variant="curated">` vs `<Badge variant="synthetic">`) can programmatically inform the user of data provenance for any displayed item.

## 4. Deterministic Demonstration Behavior
Unlike mock random generators that produce shifting values between page refreshes, CosmoStellarAtlas uses deterministic seeds. This ensures:
- Dashboard statistics (8 Planets, 18 Missions, 11,000+ Sols, 32 Asteroids) remain consistent across every presentation.
- Faculty demonstrations produce identical, verifiable results every time.
- Search indexes and filter operations operate predictably.

## 5. Transitioning to Live External APIs
To replace the mock provider with live backend endpoints in future phases:
1. Implement the `SpaceDataProvider` interface in a new class (e.g., `RemoteSpaceDataProvider`).
2. Map incoming JSON payloads from services like NASA's NeoWS or JPL Horizons to the standard `Planet`, `Mission`, and `Asteroid` interfaces.
3. Update `src/services/index.ts` to export the remote service instance.
No UI component changes will be necessary because all frontend views consume data exclusively through the `SpaceDataProvider` interface.

