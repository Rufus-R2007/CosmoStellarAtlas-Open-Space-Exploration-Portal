# Software Requirements Specification (SRS)
## CosmoStellarAtlas — Open Space Exploration Portal
**Project Type:** Software Engineering Micro Project  
**Author:** Rufus Samuel R  
**Institution:** Karunya Institute of Technology and Sciences  
**Version:** 1.0.0 (Phase 1 Foundation)  
**Date:** October 2026  

---

## 1. Project Overview
CosmoStellarAtlas is an interactive, cinematic, and educational space exploration platform modeled after a futuristic mission-control digital observatory. The portal provides astrophysicists, educators, students, and spaceflight enthusiasts with an intuitive interface for surveying planetary ephemerides, historical space missions, surface rover telemetry, and planetary defense observations.

## 2. Problem Statement
Public interfaces for astronomical data and mission archives are often fragmented across disparate legacy government databases, difficult to navigate, and laden with complex query syntaxes. Furthermore, many web-based educational astronomy tools either require live backend dependencies and paid external API keys or suffer from brittle offline failures during classroom demonstrations and evaluations. There is an acute need for a self-contained, deterministic, high-fidelity platform that operates without external network latency or API quotas while maintaining a modern, aerospace-grade visual identity.

## 3. Objectives
- **Zero External Dependency:** Operate completely offline without live backend servers, third-party authentication, or paid API keys.
- **Cinematic & Professional UI/UX:** Deliver an aerospace-grade heads-up display (HUD) with dark mission-control aesthetics, custom color tokens, smooth animations, and high legibility.
- **Data Integrity & Transparency:** Clearly delineate curated scientific facts (e.g., planetary diameters, historical Apollo/Voyager milestones) from synthetic demonstration data (e.g., simulated Near-Earth Object approach vectors).
- **Extensible Architecture:** Establish a decoupled `SpaceDataProvider` abstraction that currently reads local deterministic datasets but can be swapped for live REST/GraphQL APIs in future phases.
- **Academic Rigor:** Satisfy formal Software Engineering Micro Project requirements, including comprehensive SRS, UML diagrams, traceability matrices, and automated unit testing.

## 4. Scope
### In Scope for Phase 1:
- Core application foundation with React 18, TypeScript, Tailwind CSS, Zustand, and Vite.
- Responsive mission-control navigation shell supporting 9 dedicated exploration modules.
- Fully implemented **Observatory Dashboard** featuring:
  - Section A: Cinematic Hero with custom HTML5 Canvas celestial centerpiece and orbital rings.
  - Section B: Dynamic Observatory Statistics calculated from actual datasets.
  - Section C: Featured Planetary World showcase with orbital telemetry and metrics.
  - Section D: Historical Mission Spotlight (Apollo 11) with flight heritage achievements.
  - Section E: Compact Cosmic Timeline preview synchronized with shared Zustand state.
  - Section F: Mission Activity overview chart powered by Recharts.
  - Section G: Discovery Navigation array linking all 8 exploration modules.
  - Section H: Atlas Briefings feed highlighting astronomical research dispatches.
- Global Command Palette (`Ctrl + K`) for instant cross-module search.
- Visual Effects toggling (High, Minimal, Off) respecting reduced motion preferences.
- Offline demonstration transparency modal.
- Fully typed local datasets (8 planets, 18 missions, 4 rovers, 32 asteroids, 16 launches, 5 briefings).
- Unit and component test suites in Vitest.
- Static hosting compatibility for GitHub Pages deployment.

### Out of Scope for Phase 1 (Scheduled for Phases 2–8):
- 3D WebGL planet terrain explorer (Phase 2).
- Full interactive temporal scrubber and audio archives (Phase 3).
- Dedicated mission trajectory analyzer (Phase 4).
- Sol-by-sol Martian camera viewer (Phase 5).
- Kinetic impactor planetary defense simulation sandbox (Phase 6).
- Force-directed knowledge graph and curriculum quizzes (Phase 7).
- Persistent personal notes vault and exportable passport (Phase 8).

## 5. Stakeholders & User Roles
1. **Academic Evaluator / Faculty Member:** Reviews system architecture, code quality, software documentation, and live demonstration reliability.
2. **Student / Amateur Astronomer:** Explores planetary worlds, studies historical missions, and reviews astrophysical metrics.
3. **Curator / Developer:** Extends local datasets or implements future network-backed provider adapters.

## 6. Functional Requirements (FR)

| ID | Title | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-01** | Global Navigation Shell | The system shall render a persistent, responsive navigation bar and sidebar containing links to all 9 primary application routes. | High |
| **FR-02** | Cinematic Hero Viewport | The system shall render a hero section featuring a custom Canvas celestial Earth centerpiece with orbital rings and telemetry badges. | High |
| **FR-03** | Dynamic Statistics Computation | The system shall calculate all dashboard statistics (planets, missions, surface sols, asteroids) dynamically from local datasets. | High |
| **FR-04** | Featured Planet Showcase | The system shall display a planetary world with physical characteristics, orbital radius, and related mission counts. | High |
| **FR-05** | Mission Spotlight Dossier | The system shall highlight a historical spaceflight mission with launch telemetry, objectives, and milestones. | High |
| **FR-06** | Temporal State Synchronization | The system shall allow users to select landmark years on a timeline preview and synchronize that year in shared Zustand state. | High |
| **FR-07** | Analytical Activity Chart | The system shall render an interactive bar chart displaying cataloged missions grouped by decade or destination. | Medium |
| **FR-08** | Discovery Navigation Matrix | The system shall display entry cards for all 8 roadmap modules, explicitly indicating active vs roadmap status. | High |
| **FR-09** | Global Command Palette | The system shall provide keyboard-accessible global search (`Ctrl + K`) across planets, missions, rovers, and asteroids. | Medium |
| **FR-10** | Offline Data Transparency | The system shall display an unambiguous "Offline Demo / Local Engine" indicator with an explanatory provenance modal. | High |
| **FR-11** | Visual FX Preference Toggling | The system shall allow users to toggle visual effects between High, Minimal, and Off, persisted in localStorage. | Medium |
| **FR-12** | Resilient Error Handling | The system shall handle simulated data faults gracefully without application crash, presenting a retry interface. | High |

## 7. Non-Functional Requirements (NFR)

| ID | Title | Target Metric |
| :--- | :--- | :--- |
| **NFR-01** | Performance & Startup | First Contentful Paint (FCP) under 1.2s on standard broadband. Bundle size gzipped under 350 kB. |
| **NFR-02** | Zero Network Latency | Normal application operations require zero HTTP requests to external servers. |
| **NFR-03** | Portability & Deployment | Static build deployable to GitHub Pages with relative asset addressing and hash-based client routing. |
| **NFR-04** | Accessibility & Motion | Supports semantic HTML, ARIA attributes, keyboard navigation, and reduced-motion user preferences. |
| **NFR-05** | Maintainability & Types | 100% TypeScript compilation with zero type errors and strict type safety. |
| **NFR-06** | Test Coverage | Minimum automated test coverage verifying provider methods, mission filtering, store updates, and error handling. |
| **NFR-07** | Browser Compatibility | Fully operational across Chrome, Edge, Firefox, Safari, and mobile WebKit viewports. |
| **NFR-08** | Visual Cohesion | Adherence to the AstroNav design specification (Hex tokens: #060B19, #20D9F2, #8565FA, #FFB45B). |

## 8. Assumptions & Constraints
- The platform executes entirely on the client side in modern evergreen web browsers.
- No live external APIs (e.g., NASA Open APIs) are contacted during execution to ensure 100% demo uptime.
- Local browser `localStorage` is available for saving user preferences and UI states.
- Client hardware supports standard 2D HTML5 canvas acceleration.
