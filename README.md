# CosmoStellarAtlas — Open Space Exploration Portal

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passed%20(11%2F11)-brightgreen.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

> **Software Engineering Micro Project — Phase 1 Foundation**  
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

## 5. System Architecture & Folder Structure

```
CosmoStellarAtlas-Open-Space-Exploration-Portal/
├── docs/                        # Formal Software Engineering Documentation
│   ├── SRS.md                   # Software Requirements Specification
│   ├── ARCHITECTURE.md          # System Architecture & Service Abstractions
│   ├── DIAGRAMS.md              # UML & Mermaid Source Models
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
│   │   ├── planets.ts           # 8 Major Planets with scientific attributes
│   │   ├── missions.ts          # 18 Curated Historical Missions & Milestones
│   │   ├── rovers.ts            # 4 Mars Rovers (Sojourner, Opportunity, Curiosity, etc.)
│   │   ├── asteroids.ts         # 32 Curated & Synthetic Near-Earth Objects
│   │   ├── launches.ts          # 16 Illustrative Spaceflight Launches
│   │   └── briefings.ts         # 5 Research Briefings
│   ├── features/
│   │   ├── observatory/         # Full Observatory Dashboard Implementation
│   │   │   ├── components/      # Sections A through H
│   │   │   └── ObservatoryPage.tsx
│   │   ├── planets/             # Planet Explorer (Phase 2 Roadmap)
│   │   ├── timeline/            # Cosmic Time Machine (Phase 3 Roadmap)
│   │   ├── missions/            # Mission Control Center (Phase 4 Roadmap)
│   │   ├── rovers/              # Mars Rover Explorer (Phase 5 Roadmap)
│   │   ├── asteroids/           # Asteroid Watch & Defense Lab (Phase 6 Roadmap)
│   │   ├── intelligence/        # Space Intelligence (Phase 7 Roadmap)
│   │   ├── learning/            # Learning Hub (Phase 7 Roadmap)
│   │   ├── vault/               # Personal Space Vault (Phase 8 Roadmap)
│   │   └── notfound/            # 404 Route Recovery View
│   ├── services/                # SpaceDataProvider Interface & Mock Implementation
│   ├── store/                   # Zustand Global Store (useAppStore)
│   ├── styles/                  # Tailwind CSS & Global Styles
│   ├── tests/                   # Vitest Unit and Component Test Suite
│   └── types/                   # TypeScript Data Contracts and Interfaces
├── index.html                   # HTML Entry Point
├── package.json                 # Dependency Manifest
├── tailwind.config.js           # AstroNav Custom Design Tokens
├── tsconfig.json                # TypeScript Strict Configuration
└── vite.config.ts               # Vite & Vitest Configuration
```

---

## 6. Offline Data Transparency & Provenance
CosmoStellarAtlas strictly adheres to academic honesty:
- **Curated Reference Data:** Astronomical measurements, physical constants, and historical spaceflight milestones are sourced from declassified NASA, ESA, and peer-reviewed records.
- **Synthetic Demonstration Telemetry:** Approaching asteroid vectors and future launch logistics are deterministically modeled for educational simulation.
- **No False Claims:** The portal never claims live satellite downlinks or active NASA API communication. An **Offline Demo Indicator** button is continuously visible in the header, opening a modal that details the provenance of every data point.

---

## 7. Installation, Execution & Build Instructions

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
Run the Vitest test suite covering data provider methods, mission filtering, stats computation, state synchronization, 404 routing, and error boundaries:
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

## 8. Multi-Phase Master Roadmap

| Phase | Title | Focus Area | Status |
| :---: | :--- | :--- | :---: |
| **Phase 1** | **Foundation & Observatory Dashboard** | Core architecture, local provider, Observatory dashboard, 9-module shell, tests, and documentation. | **COMPLETED** |
| **Phase 2** | **Planet Explorer** | Interactive 3D planet visualizer, atmospheric cross-sections, and gravity comparisons. | *Planned* |
| **Phase 3** | **Cosmic Time Machine** | Full chronological scrubber, historical video/audio cards, and breakthrough markers. | *Planned* |
| **Phase 4** | **Mission Control Center** | Detailed technical dossiers for Apollo, Voyager, Cassini, JWST; trajectory maps. | *Planned* |
| **Phase 5** | **Mars Rover Explorer** | Tele-robotics deck, sol-by-sol raw optics viewer, sample tube cache tracker, Ingenuity logs. | *Planned* |
| **Phase 6** | **Asteroid Watch & Defense Lab** | Near-Earth Object 3D radar plot, Torino hazard calculations, and DART kinetic deflection sandbox. | *Planned* |
| **Phase 7** | **Space Intelligence & Learning Hub** | Force-directed discovery knowledge graph, astrophysics lessons, and interactive quizzes. | *Planned* |
| **Phase 8** | **Personal Vault & Deployment** | Explorer Passport, bookmarks, personal research notes markdown editor, and GitHub Pages release. | *Planned* |

---

## 9. GitHub Pages Deployment Plan
GitHub Pages deployment will be finalized in Phase 8. The application is pre-configured for static hosting:
- `base: './'` in `vite.config.ts` ensures all asset paths are relative.
- `HashRouter` in `App.tsx` guarantees that deep linking and direct page refreshes function seamlessly without server-side rewrite rules.
- Production build verified with zero external runtime dependencies.

---

## 10. Developer & Coursework Information
- **Developer:** Rufus Samuel R
- **Institution:** Karunya Institute of Technology and Sciences
- **Project Type:** Software Engineering Micro Project
- **Academic Year:** 2026
