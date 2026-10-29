# Software Requirements Specification (SRS)
## CosmoStellarAtlas — Open Space Exploration Portal
**Project Type:** Software Engineering Micro Project  
**Author:** Rufus Samuel R  
**Institution:** Karunya Institute of Technology and Sciences  
**Version:** 1.3.0 (Phase 4 Mars Rover Explorer & Photo Discovery Lab)  
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
### Implemented in Phase 1 (Core Foundation & Observatory Dashboard):
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

### Implemented in Phase 2 (Interactive Planet Explorer & Comparison Lab):
- **3D Planetary Viewer (`PlanetCanvas3D`):** Three.js WebGL spherical renderer rendering all 8 solar system worlds with procedural canvas textures, axial tilt angles, directional sun lighting, and Saturnian ring geometry.
- **Accessible 2D Fallback (`PlanetCanvasFallback`):** HTML5 Canvas 2D fallback renderer with manual toggle and automatic WebGL context error interception.
- **Viewer Telemetry Controls (`ViewerControls`):** Interactive mouse/touch drag rotation, zoom in/out, view reset, auto-rotation pause/resume, high/low texture resolution toggle, and full-viewport expansion.
- **Dual-Mode Solar System Navigator (`SolarSystemNavigator`):** Switch between "Explore Mode" (cards with classification chips and order tags) and "Solar System Schematic Mode" (true linear distance order with proportional diameter markers).
- **Comprehensive Planet Information Center (`PlanetInfoCenter`):** Physical telemetry cards, relative Earth-weight calculation simulator (`W_planet = W_earth * g_rel`), atmospheric percentage gas progress bars, and geological landmark dossier.
- **Planetary Comparison Lab (`PlanetaryComparisonLab`):** Side-by-side metric comparison bars, dynamic visual scale circles, instant target swapping, duplicate target detection notice, and rule-based `PlanetaryInsightsEngine` producing deterministic observations across dimensional, thermal, orbital, and atmospheric domains.
- **Scale of the Solar System Explorer (`ScaleExplorer`):** Comparative Recharts visualizations for Diameter (km), Orbital Distance (AU), and Orbital Period (Earth Years), with scientific scale explanations.
- **Flight Heritage Dossier (`PlanetRelatedMissions`):** Cross-module linkage displaying historical missions targeted to the selected world, integrated with the global Cosmic Time Machine timeline epoch filter.
- **Search, Filtering & Sorting (`PlanetFilters`):** Multi-attribute search input, classification pill filters (All, Terrestrial, Gas Giant, Ice Giant), sort order dropdown, and empty search recovery.
- **Planet Discovery Passport (`PlanetDiscoveryPassport`):** Scientific fact highlight with one-click navigation to suggested planetary targets.
- **Deep Linking:** URL search query parameter synchronization (`/planets?id=mars`) with bidirectional state synchronization.

### Implemented in Phase 3 (Cosmic Time Machine, Mission Control & Mission Replay):
- **Cosmic Time Machine (`/timeline`):**
  - **Temporal Chronology Scrubber (`TimelineScrubber`):** Interactive continuous timeline slider (1957–present) with landmark ticks, decade jump navigation (1950s–2020s), previous/next milestone stepping, auto-advancing play/pause playback loop, reset to current epoch, and keyboard accessibility.
  - **Epoch Overview Panel (`EpochOverviewPanel`):** Real-time situational telemetry for the active temporal epoch (`selectedYear`), displaying operational mission count, cumulative milestones, active missions in space, and contemporaneous milestone cards with deep-link navigation.
  - **Cosmic Time Capsules (`TimeCapsuleCarousel` & `TimeCapsuleCard`):** Curated showcase of 13 landmark spaceflight achievements categorized by Firsts, Deep Space, Planetary, Lunar, and Telescopes, complete with primary source references.
  - **Cross-Module Linkage:** Direct bidirectional launch buttons linking timeline years to Mission Control and Planet Explorer.
- **Mission Control Archive (`/missions`):**
  - **Archive Directory & Statistics:** Global header displaying 20 curated missions across 6 space agencies, active flight status, and destination distribution metrics.
  - **Multi-Attribute Filter Matrix (`MissionFilters`):** Free-text keyword search, quick agency filter pills (NASA, ESA, JAXA, Roscosmos, ISRO, CNSA), celestial destination dropdown, mission type dropdown, decade pills, timeline epoch synchronization toggle, and sorting options (Newest First, Oldest First, Mission Duration, Mission Name A-Z).
  - **Historical Insights & Analytics Engine (`MissionAnalyticsSection` & `HistoricalInsightsEngine`):** Recharts visualization panels for Missions by Decade and Missions by Destination, paired with automated deterministic historical observations.
  - **Responsive Mission Dossier Cards (`MissionCard`):** High-density cards featuring agency badges, destination tag, flight status indicator, launch date, key objectives, and direct actions to open the full dossier or launch the replay engine.
- **Mission Detail Dossier (`/missions/:missionId`):**
  - **Identity & Heritage Header:** Flight patch, official designation, launch vehicle, operational timeframe, mission type, and target celestial body.
  - **Spacecraft Hardware Specifications:** Dry mass, launch mass, primary electrical power system, science instrument payload payload array, and trajectory architecture.
  - **Chronological Milestones Log:** Milestone timeline with date, title, description, and scene classifications.
  - **Mission Storytelling Engine (`MissionStoryteller`):** Interactive narrative chapter reader dividing historical missions into The Challenge, The Mission, The Journey, The Discovery, and The Legacy.
- **Interactive Mission Replay Engine (`MissionReplayEngine`):**
  - **Deterministic Scene Visualizations:** Canvas-based tactical scene animations tailored for 7 distinct event types (`launchpad`, `orbital_insertion`, `deep_space_cruise`, `planetary_flyby`, `surface_descent`, `scientific_survey`, `impact`).
  - **Playback Controls:** Play, pause, resume, reset to milestone 0, previous/next milestone skip, and variable playback speeds (0.5×, 1×, 2×).
  - **Interactive Scrubber:** Progress bar with clickable milestone markers and active milestone indicator.
  - **Accessibility & Transparency:** Fullscreen expansion toggle, canvas fallback for reduced motion, and educational simulation disclaimers clarifying that trajectories represent illustrative visualizations rather than live telemetry.

### Implemented in Phase 4 (Mars Rover Explorer, Operations Console & Photo Discovery Lab):
- **Mars Operations Dashboard Hero (`MarsOperationsHero`):**
  - Atmospheric dust physics canvas with ambient particle drifts and wind gusts.
  - Dynamic telemetry metrics (active/total rovers, operational surface sols, cataloged cameras, curated imagery).
  - Quick-switch selector tabs allowing immediate rover context switching.
  - Distinct Mars color palette integration (`#D76B35`, `#9C4229`, `#E3A66B`).
- **Interactive Rover Fleet Selection (`RoverSelector`):**
  - Interactive selection cards for all 5 NASA Mars rovers: Perseverance, Curiosity, Opportunity, Spirit, and Sojourner.
  - Status indicators (Active vs Concluded) with mission duration and landing sites.
  - Bi-directional URL synchronization (`/rovers?rover=perseverance&sol=...&img=...`).
- **Rover Engineering Specifications & Hardware Systems (`RoverProfileSection`):**
  - Engineering telemetry cards: mass, physical dimensions, power system (MMRTG nuclear / solar), mobility system (rocker-bogie suspension), top speed, and wheel diameter.
  - Interactive science instrument accordion detailing full scientific payloads (SuperCam, Mastcam-Z, PIXL, SHERLOC, RIMFAX, MOXIE, MEDA, etc.).
  - Educational engineering concepts drawer explaining specialized wheels, communication latency, camera diversity, and rock laser spectroscopy.
- **Martian Sol Explorer & Timeline Scrubber (`SolExplorerSection`):**
  - Continuous solar day slider across available mission sols with landmark indicator ticks.
  - Step forward / step backward sol controls and instant reset filter.
  - Curated sol activity highlights and cross-filtering with the camera gallery.
- **Multi-Facet Rover Camera Gallery (`RoverGallerySection`):**
  - Multi-attribute filtering by free-text search query, camera subsystem pills, mission sol, and topic tags.
  - Sorting options (Newest Sols First, Oldest Sols First, Title A-Z).
  - Explicit data provenance badges distinguishing genuine curated historical captures from illustrative demonstration visuals.
  - Empty state with search reset action.
- **Interactive Image Inspection Lab Modal (`ImageInspectionLabModal`):**
  - High-precision pan-and-drag viewport with smooth mouse drag and normalized boundaries.
  - Interactive zoom controls (zoom in, zoom out, fit to screen, reset view) and fullscreen toggle.
  - Real-time CSS image processing sliders: Brightness (50%–150%), Contrast (50%–150%), and Saturation (0%–200%) with instant reset.
  - Adjacent photo pagination (previous / next photo buttons and keyboard navigation).
  - Metadata drawer with technical camera specifications, target rover, earth date, and source references.
- **Educational Surface Annotations & Data Provenance:**
  - Interactive normalized percentage bounding box overlays (`normalizedX`, `normalizedY`, `normalizedWidth`, `normalizedHeight`).
  - Annotation highlight cards with category tags (Rock Formation, Hardware, Texture, Geological Context).
  - Annotation visibility toggle (show / hide overlays).
  - Provenance badges clearly indicating curated historical annotations vs illustrative demonstration visuals.
- **Mars Surface Journey Traverse (`SurfaceJourneySection`):**
  - Interactive topographic schematic canvas depicting traverse route waypoints across landing sites (Jezero Delta, Mount Sharp, Meridiani Planum, Columbia Hills).
  - Clickable waypoint pins with elevation, cumulative distance, terrain features, and key scientific milestones.
  - Linked rover photo shortcuts opening directly in the Image Inspection Lab.
  - Clear schematic disclaimer: "Illustrative traverse schematic — not an official rover traverse map."
- **Rover Engineering Comparison Lab (`RoverComparisonLab`):**
  - Side-by-side comparative metric matrix across all 5 rovers (mass, dimensions, power, wheel diameter, top speed, instruments).
  - Instant rover swap capability and duplicate selection alert.
  - Engineering evolution insights summarizing generational technological leaps from Sojourner to Perseverance.
- **Personal Discovery Notes:**
  - In-modal user field note editor allowing users to attach observations to any inspected image.
  - Automatic persistence to browser `localStorage` under `userRoverNotes`.
- **Cross-Module Integration:**
  - Direct deep links to Mars 3D view in Planet Explorer (`/planets?id=mars`).
  - Direct links to dedicated Mission Control dossiers (`/missions/:missionId`).
  - Active module badge updated to `ACTIVE` across navigation shells and observatory dashboard.

### Out of Scope for Phases 1–4 (Scheduled for Phases 5–8):
- Kinetic impactor planetary defense simulation sandbox (Phase 5).
- Asteroid radar observation matrix and orbital rendezvous calculator (Phase 6).
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
| **FR-13** | 3D Planetary Visualization | The system shall render an interactive Three.js 3D viewport for each of the 8 major solar system worlds with mouse drag rotation, zoom, and auto-rotation toggle. | High |
| **FR-14** | Procedural Planetary Textures | The system shall generate distinct procedural surface maps and atmospheric shaders locally without relying on runtime remote image assets. | High |
| **FR-15** | 2D Canvas Fallback Mode | The system shall provide an accessible 2D HTML5 Canvas rendering fallback that activates automatically on WebGL failure or upon manual user selection. | High |
| **FR-16** | Solar System Dual-Mode Navigator | The system shall provide an interactive planetary selector supporting both standard card view and true linear distance-ordered schematic view. | High |
| **FR-17** | Planetary Physical Telemetry | The system shall display physical stats, atmospheric composition progress bars, key geological landmarks, and an interactive relative Earth-weight calculator. | High |
| **FR-18** | Planetary Comparison Lab | The system shall permit side-by-side metric comparisons between any two planets, including relative dimension circles, ratio bars, and rule-based insights. | High |
| **FR-19** | Scale of the Solar System Explorer | The system shall render comparative charts (Recharts) for diameter, distance from Sun (AU), and orbital period with logarithmic educational annotations. | Medium |
| **FR-20** | Flight Heritage & Epoch Filtering | The system shall display historical space missions associated with the target planet and filter records according to the global Cosmic Time Machine epoch. | High |
| **FR-21** | Planet Search & Multi-Filters | The system shall enable search filtering across planet name, codename, summary, and classification (Terrestrial, Gas Giant, Ice Giant) with an empty state recovery action. | High |
| **FR-22** | Planet Discovery Passport | The system shall showcase an intriguing scientific fact highlight and suggest immediate one-click navigation to adjacent planetary worlds. | Medium |
| **FR-23** | Temporal Chronology Scrubber | The system shall provide an interactive continuous timeline slider (1957–present) with landmark ticks, decade jump navigation, milestone stepping, play/pause auto-advance, and reset to current epoch. | High |
| **FR-24** | Global Temporal Synchronization | The system shall synchronize the timeline scrubber year bidirectionally with shared Zustand state (`selectedYear`) and provide an active epoch toggle to filter mission archives. | High |
| **FR-25** | Epoch Telemetry Overview | The system shall display real-time situational telemetry for the selected epoch, including operating spacecraft count, milestone count, contemporaneous achievements, and direct navigation links. | High |
| **FR-26** | Curated Cosmic Time Capsules | The system shall provide a curated showcase of landmark historical spaceflight achievements categorized by Firsts, Deep Space, Planetary, Lunar, and Telescopes with primary references. | Medium |
| **FR-27** | Mission Control Archive Directory | The system shall provide a searchable, multi-filtered mission directory supporting queries across name, agency, celestial destination, mission type, decade, and epoch synchronization. | High |
| **FR-28** | Multi-Attribute Mission Sorting & Metrics | The system shall calculate aggregate catalog metrics dynamically and permit sorting by launch date, operational duration, and mission name. | High |
| **FR-29** | Historical Insights & Analytics Engine | The system shall compute mission distributions across decades and destinations using Recharts charts and formulate deterministic historical observations via rule-based heuristics. | High |
| **FR-30** | Comprehensive Mission Detail Dossier | The system shall display a dedicated mission dossier route (`/missions/:missionId`) with objectives, agency badges, target worlds, spacecraft engineering hardware specifications, and milestone chronology. | High |
| **FR-31** | Mission Storytelling Engine | The system shall render an interactive narrative chapter reader organizing mission history into The Challenge, The Mission, The Journey, The Discovery, and The Legacy. | High |
| **FR-32** | Interactive Mission Replay Engine | The system shall provide a data-driven HTML5 Canvas replay engine featuring specialized tactical space scenes, variable speed controls (0.5×, 1×, 2×), milestone scrub bar, fullscreen mode, and simulation disclaimers. | High |
| **FR-33** | Mars Operations Dashboard Hero | The system shall render a specialized operations console hero with animated Martian atmospheric dust physics canvas, dynamic fleet metrics, and quick rover selector tabs. | High |
| **FR-34** | Interactive Rover Fleet Selection | The system shall allow users to select from all 5 NASA Mars rovers (Perseverance, Curiosity, Opportunity, Spirit, Sojourner) with active/concluded status indicators and landing telemetry. | High |
| **FR-35** | Rover Hardware & Engineering Specifications | The system shall display detailed engineering specifications including mass, physical dimensions, MMRTG/solar power, mobility rocker-bogie systems, and wheel diameters. | High |
| **FR-36** | Rover Science Instruments & Concepts | The system shall render an interactive science instrument payload accordion and educational engineering concept cards (mobility, communication latency, optics, laser rock spectroscopy). | High |
| **FR-37** | Martian Sol Explorer & Timeline Scrubber | The system shall provide an interactive continuous sol timeline slider with milestone ticks, step navigation, reset action, and curated sol activity notes. | High |
| **FR-38** | Multi-Facet Rover Camera Gallery | The system shall enable gallery filtering across free-text search queries, camera subsystem pills, mission sol, and topic tags, with sorting and empty-state recovery. | High |
| **FR-39** | Interactive Image Inspection Lab | The system shall provide a pan-and-drag viewport, zoom controls, fit-to-screen, fullscreen expansion, and CSS image processing adjustments (brightness, contrast, saturation) with instant reset. | High |
| **FR-40** | Educational Surface Annotations & Provenance | The system shall render normalized percentage bounding box overlays with category tags, and transparently distinguish curated historical captures from illustrative demonstration visuals. | High |
| **FR-41** | Mars Surface Journey Traverse | The system shall display an interactive topographic schematic canvas featuring landing site waypoints, elevation profiles, cumulative distances, and linked photo shortcuts with an illustrative disclaimer. | High |
| **FR-42** | Rover Comparison Lab & Discovery Notes | The system shall provide side-by-side engineering comparisons between any two rovers with metric swapping, engineering evolution insights, and personal discovery notes persisted to localStorage. | High |

## 7. Non-Functional Requirements (NFR)

| ID | Title | Target Metric |
| :--- | :--- | :--- |
| **NFR-01** | Performance & Startup | First Contentful Paint (FCP) under 1.2s on standard broadband. Bundle size gzipped under 350 kB. |
| **NFR-02** | Zero Network Latency | Normal application operations require zero HTTP requests to external servers. |
| **NFR-03** | Portability & Deployment | Static build deployable to GitHub Pages with relative asset addressing and hash-based client routing. |
| **NFR-04** | Accessibility & Motion | Supports semantic HTML, ARIA attributes, keyboard navigation, and reduced-motion user preferences. |
| **NFR-05** | Maintainability & Types | 100% TypeScript compilation with zero type errors and strict type safety. |
| **NFR-06** | Test Coverage | Automated test coverage spanning 54 unit and component test cases across 6 suites verifying all core features. |
| **NFR-07** | Browser Compatibility | Fully operational across Chrome, Edge, Firefox, Safari, and mobile WebKit viewports. |
| **NFR-08** | Visual Cohesion | Adherence to the AstroNav design specification (Hex tokens: #060B19, #20D9F2, #8565FA, #FFB45B, #D76B35, #9C4229, #E3A66B). |

## 8. Assumptions & Constraints
- The platform executes entirely on the client side in modern evergreen web browsers.
- No live external APIs (e.g., NASA Open APIs) are contacted during execution to ensure 100% demo uptime.
- Local browser `localStorage` is available for saving user preferences and UI states.
- Client hardware supports standard 2D HTML5 canvas acceleration.

