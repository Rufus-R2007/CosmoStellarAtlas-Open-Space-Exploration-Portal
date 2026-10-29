# CosmoStellarAtlas — Data Design Specification

**Developer:** Rufus Samuel R (URK25CS1090)  
**Institution:** Karunya Institute of Technology and Sciences  
**Coursework:** Software Engineering Micro Project  
**Document Version:** 1.0.0 (Phase 8 Production Release)

---

## 1. Executive Summary & Architecture Strategy

CosmoStellarAtlas operates with an academic **Zero External Runtime API** architecture. All celestial measurements, historical flight heritage, and orbital ephemerides are stored locally within deterministic bundled datasets. Dynamic personal information (such as bookmarks, notes, quiz scores, and achievements) is persisted strictly client-side via the browser's `localStorage` API under the single versioned envelope `cosmostellaratlas:user:v1`.

### Data Flow Pipeline
```
[Python Offline Utilities]
   ├── generate_demo_data.py   --> Generates reproducible synthetic records
   └── validate_datasets.py     --> Validates data types, bounds, and references
             │
             ▼
[Canonical JSON Datasets] (src/data/json/*.json)
             │
             ▼
[TypeScript Static Datasets] (src/data/*.ts)
             │
             ▼
[MockSpaceDataProvider (spaceService)]
             │
             ▼
[Zustand Stores] (useAppStore & useVaultStore)
             │
             ▼
[React UI Components & Visualizers]
             │
             ▼
[Browser LocalStorage] (cosmostellaratlas:user:v1)
```

---

## 2. Primary Domain Data Contracts (Reference Datasets)

### 2.1 Planet (`src/data/planets.ts` & `src/data/json/planets.json`)
Tracks the 8 major worlds in our Solar System.

| Attribute | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `id` | `string` (PK) | Canonical lowercase slug identifier | `'mars'` |
| `name` | `string` | International astronomical designation | `'Mars'` |
| `codeName` | `string` | Tactical telemetry callsign | `'ARES // SOL-4'` |
| `orderFromSun` | `number` | Heliocentric sequential order (1–8) | `4` |
| `type` | `PlanetType` | Classification (`Terrestrial`, `Gas Giant`, `Ice Giant`) | `'Terrestrial'` |
| `diameterKm` | `number` | Equatorial diameter in kilometers | `6792` |
| `massEarthRel` | `number` | Mass normalized to Earth ($M_{\text{Earth}} = 1.0$) | `0.107` |
| `distanceFromSunAU` | `number` | Mean distance from Sol in Astronomical Units | `1.52` |
| `gravityMs2` | `number` | Surface gravitational acceleration in $\text{m/s}^2$ | `3.72` |
| `orbitalPeriodDays` | `number` | Sidereal orbital period in Earth days | `686.98` |
| `atmosphereComposition` | `Array<{gas, percentage}>`| Atmospheric constituents | `[{ gas: 'CO2', percentage: 95.3 }]` |
| `relatedMissionIds` | `string[]` (FK) | Historical exploration missions to this world | `['perseverance', 'curiosity']` |

### 2.2 Mission (`src/data/missions.ts` & `src/data/json/missions.json`)
Tracks 20 landmark historical spaceflight missions spanning 1957 through present.

| Attribute | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `id` | `string` (PK) | Canonical mission identifier | `'apollo-11'` |
| `name` | `string` | Official mission name | `'Apollo 11'` |
| `agency` | `string` | Sponsoring space agency | `'NASA'` |
| `launchYear` | `number` | Gregorian launch year | `1969` |
| `launchDate` | `string` | ISO 8601 launch timestamp | `'1969-07-16'` |
| `destinationPlanetId`| `string` (FK) | Target celestial body identifier | `'earth'` (Moon vicinity) |
| `missionType` | `MissionType` | Flight architecture (`Crewed`, `Orbiter`, `Rover`) | `'Crewed'` |
| `milestones` | `MissionMilestone[]`| Chronological milestones for Replay Engine | *(Array of 5 events)* |

### 2.3 Rover (`src/data/rovers.ts` & `src/data/json/rovers.json`)
Tracks the 5 NASA Mars exploration surface vehicles.

| Attribute | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `id` | `string` (PK) | Rover identifier | `'perseverance'` |
| `name` | `string` | Display name | `'Perseverance'` |
| `landingDate` | `string` | Touchdown date | `'2021-02-18'` |
| `landingSite` | `string` | Geodetic coordinate site description | `'Jezero Crater (18.44° N, 77.45° E)'` |
| `totalSols` | `number` | Total operational Martian solar days | `1315` |
| `distanceTraveledKm`| `number` | Cumulative traverse odometry | `29.4` |
| `instruments` | `ScienceInstrument[]`| Onboard spectroscopic & optical tools | `[Mastcam-Z, SuperCam, PIXL]` |

### 2.4 Asteroid (`src/data/asteroids.ts` & `src/data/json/asteroids.json`)
Tracks 50 Near-Earth Objects (8 Curated Benchmarks + 42 Synthetic Demonstrations).

| Attribute | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `id` | `string` (PK) | Asteroid identifier | `'99942-apophis'` |
| `designation` | `string` | Astronomical survey designation | `'2004 MN4'` |
| `estimatedDiameterMeters` | `number` | Mean physical diameter ($d$) | `370` |
| `missDistanceKm` | `number` | Perigee close-approach distance in km | `31600` |
| `missDistanceLunar` | `number` | Close approach in Lunar Distances ($1\text{ LD} = 384,400\text{ km}$)| `0.082` |
| `relativeVelocityKmS` | `number` | Geocentric flyby velocity ($v$) in km/s | `7.43` |
| `orbitClass` | `OrbitClass` | Keplerian orbit taxonomy (`Apollo`, `Aten`, `Amor`, `Atira`) | `'Aten'` |
| `source` | `'curated' \| 'synthetic'`| Academic provenance flag | `'curated'` |

---

## 3. Persistent User State Model (`cosmostellaratlas:user:v1`)

User state is isolated into a single root key in browser `localStorage`.

```json
{
  "version": "cosmostellaratlas:user:v1",
  "exportedAt": "2026-10-30T00:00:00.000Z",
  "profile": {
    "callsign": "Cosmo Explorer",
    "avatarId": "astronaut-01",
    "clearanceId": "CSA-ATLAS-01-DEFAULT",
    "rank": "Cadet Explorer",
    "level": 2,
    "xp": 450,
    "joinedAt": "2026-10-30T00:00:00.000Z",
    "lastActiveAt": "2026-10-30T01:00:00.000Z"
  },
  "favorites": [
    {
      "id": "fav-mars-1730246400000",
      "entityType": "planet",
      "entityId": "mars",
      "title": "Mars",
      "subtitle": "Terrestrial • Order #4 from Sun",
      "route": "/planets?selected=mars",
      "categoryBadge": "Planet",
      "colorHex": "#D76B35",
      "savedAt": "2026-10-30T00:00:00.000Z"
    }
  ],
  "collections": [
    {
      "id": "col-outer-planets",
      "name": "Outer Worlds Survey",
      "description": "Research notes on Jupiter, Saturn, Uranus, and Neptune",
      "color": "#8565FA",
      "createdAt": "2026-10-30T00:00:00.000Z"
    }
  ],
  "journalNotes": [
    {
      "id": "note-1730246400000",
      "title": "Jezero Delta Carbonate Observations",
      "content": "SuperCam remote laser spectra confirmed iron-rich smectite clays in the lower fan strata.",
      "tags": ["mars", "geology", "perseverance"],
      "linkedEntityType": "rover",
      "linkedEntityId": "perseverance",
      "createdAt": "2026-10-30T00:00:00.000Z",
      "updatedAt": "2026-10-30T00:00:00.000Z"
    }
  ],
  "completedLessonIds": [
    "lesson-sol-01",
    "lesson-sol-02",
    "lesson-sol-03"
  ],
  "quizAttempts": [
    {
      "id": "attempt-1730246400000",
      "trailId": "trail-solar-system",
      "scorePercent": 100,
      "passed": true,
      "correctCount": 6,
      "totalCount": 6,
      "completedAt": "2026-10-30T00:00:00.000Z",
      "answers": [
        { "questionId": "quiz-sol-01", "selectedOptionIndex": 2, "isCorrect": true }
      ]
    }
  ],
  "explorationEvents": [
    {
      "id": "evt-1730246400000",
      "eventType": "planet_viewed",
      "entityId": "mars",
      "timestamp": "2026-10-30T00:00:00.000Z"
    }
  ]
}
```

---

## 4. Quota Management, Resilience & Error Recovery

1. **Storage Quota Footprint:** LocalStorage envelopes are verified to consume $<150\text{ KB}$ under normal heavy usage, comfortably below the conservative 5MB browser quota threshold.
2. **Graceful Memory Fallback:** If `localStorage` is disabled or blocked (e.g. strict incognito modes), `VaultStorageService` transparently falls back to an in-memory state dictionary, allowing seamless session exploration without uncaught DOM exceptions.
3. **Backup & Recovery Protocol:**
   - **JSON Export:** Download full state snapshot (`cosmostellaratlas-vault-backup-YYYY-MM-DD.json`).
   - **JSON Import:** Schema-validated import with two modes:
     - `merge`: Combines backup items with current local records (deduplicating by ID).
     - `replace`: Overwrites local store with imported snapshot.
   - **Double-Confirmation Reset:** Completely clears user data and reinstates initial factory defaults.

