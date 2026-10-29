# Development Roadmap & Multi-Phase Master Plan
## CosmoStellarAtlas — Open Space Exploration Portal
**Author:** Rufus Samuel R  
**Institution:** Karunya Institute of Technology and Sciences  

---

| Phase | Module / Milestone | Primary Deliverables | Status | Target Delivery |
| :---: | :--- | :--- | :---: | :---: |
| **Phase 1** | **Foundation & Observatory Dashboard** | Core architecture shell, TypeScript interfaces, local data provider, interactive Observatory Dashboard, 9-route routing shell, visual FX controls, Command Palette, unit tests, and software engineering documentation. | **COMPLETED** | **Phase 1 Complete** |
| **Phase 2** | **Planet Explorer & 3D Planetarium** | Interactive Three.js 3D planetary mesh visualizer, procedural canvas textures for all 8 worlds, accessible 2D fallback, dual-mode solar navigator, atmospheric composition bars, relative Earth weight calculator, side-by-side comparison lab, rule-based insights engine, scale explorer, and mission flight heritage with timeline epoch synchronization. | **COMPLETED** | **Phase 2 Complete** |
| **Phase 3** | **Cosmic Time Machine & Mission Control** | Continuous chronological timeline scrubber (1957–Present), decade jump navigation, synchronized epoch telemetry, curated time capsules carousel, 20-mission Mission Control archive with multi-filters and sorting, Recharts historical analytics, deterministic HistoricalInsightsEngine, mission detail dossiers with spacecraft engineering specs, 5-chapter Mission Storytelling Engine, and interactive HTML5 Canvas Mission Replay Engine with tactical scene shaders and variable speed playback. | **COMPLETED** | **Phase 3 Complete** |
| **Phase 4** | **Mars Rover Explorer & Photo Discovery Lab** | Mars Operations Dashboard Hero with atmospheric dust canvas physics, interactive rover selector across 5 explorers (Perseverance, Curiosity, Opportunity, Spirit, Sojourner), hardware specs & science instrument accordion, Martian sol timeline scrubber, multi-facet camera gallery, interactive Image Inspection Lab modal with zoom/pan and CSS image adjustments (brightness, contrast, saturation), normalized educational surface annotations, Mars surface journey topographic traverse canvas, and rover comparison lab with personal field discovery notes persisted to localStorage. | **COMPLETED** | **Phase 4 Complete** |
| **Phase 5** | **Asteroid Watch & Planetary Defense Lab** | 50 Near-Earth Object database (8 curated benchmarks + 42 synthetic encounters), 2D Keplerian orbital encounter canvas with perigee vectors and distance HUD, chronological close-approach scrubber (2026–2035), multi-facet search/filter catalog matrix, asteroid inspection dossier modal, flagship Planetary Defense What-If Lab with deterministic physics engine ($r, V, m, v, E_k$, TNT kt/Mt), interactive Recharts curves ($E \propto d^3$, $E \propto v^2$), parameter sensitivity matrix (8x, 4x, 2x), 4 educational scenario presets, explainable physics insights, and academic planetary defense foundations. | **COMPLETED** | **Phase 5 Complete** |
| **Phase 6** | **Space Intelligence & Smart Discovery** | Autonomous cosmic briefing engine with temporal epoch sync, Ask the Atlas natural language query assistant with 14 discrete scientific intents, inverted search index with weighted token scoring, interactive 2D relational knowledge graph with 1-hop focus, explainable recommendation matrix, and transparent algorithmic evidence panel. | **COMPLETED** | **Phase 6 Complete** |
| **Phase 7** | **Personal Space Vault & Learning Hub** | Offline explorer profile HUD, universal bookmarks with category filters, custom personal research collections, exploration journal logbook, 4 structured curriculum trails (12 lessons, 24 quiz questions), 70% passing certification gate, 12-star interactive SVG constellation map, dynamic clearance ranks (Levels 1–5), verifiable telemetry tracking, personal analytics (Recharts), and versioned JSON backup/recovery with local data sovereignty. | **COMPLETED** | **Phase 7 Complete** |
| **Phase 8** | **Trajectory & Orbital Mechanics Lab** | Dedicated gravity-assist vector calculator, Hohmann transfer orbit simulator, stage separation sequence animations, and interplanetary trajectory modeling. | *Planned* | Phase 8 |

---

### Detailed Phase 1 Completion Summary
- **Foundation Infrastructure:** Complete with Vite 6, React 18, TypeScript 5, Tailwind CSS, Zustand 5, Lucide React, and Recharts.
- **Observatory Dashboard:** Implemented Sections A through H with calculated statistics, interactive celestial canvas centerpiece, planet showcase, mission spotlight, synchronized timeline preview, Recharts activity visualization, module matrix, and briefings feed.
- **Routing Shell:** Configured `HashRouter` supporting 9 primary routes with clean placeholder components and 404 recovery.
- **Test Automation:** 11 Vitest tests verifying provider methods, filtering, store updates, and error handling.
- **Documentation:** Full SRS, Architecture, Diagrams, Traceability, Dataset, and Roadmap documentation published in `docs/`.

### Detailed Phase 2 Completion Summary
- **3D Planetarium & Viewport:** Three.js WebGL spherical renderer rendering all 8 major worlds with procedural equirectangular surface textures, axial tilt angles, directional lighting, and Saturnian ring meshes.
- **Accessible 2D Fallback Engine:** Automatic WebGL failure interception and manual toolbar toggle rendering canvas shaders without WebGL.
- **Dual-Mode Navigator:** Card view ("Explore Mode") and true linear distance-ordered schematic view ("Solar System Schematic Mode").
- **Planet Information Center:** Physical telemetry, relative Earth weight calculator simulator, atmospheric composition percentage progress bars, and landmark dossiers.
- **Planetary Comparison Lab:** Side-by-side metric comparison bars, dynamic visual scale circles, identical world detection notices, and deterministic `PlanetaryInsightsEngine` synthesis.
- **Scale of the Solar System Explorer:** Comparative charts (Recharts) for diameter, orbital distance (AU), and orbital period (Earth years) with logarithmic scaling insights.
- **Flight Heritage Dossier:** Cross-module mission linkage with historical Cosmic Time Machine epoch synchronization (`Epoch <= YYYY`).
- **Search, Filters & Passport:** Real-time search, classification pills (Terrestrial, Gas Giant, Ice Giant), multi-property sorting, empty search recovery, and discovery passport navigation.
- **Test Automation:** 10 new Vitest tests (21 total across 4 test suites) verifying all Phase 2 requirements with 100% pass rate.

### Detailed Phase 3 Completion Summary
- **Cosmic Time Machine (`/timeline`):**
  - Continuous timeline scrubber spanning 1957 through present with landmark tick marks, decade jump buttons (1950s–2020s), milestone stepping, auto-advancing play/pause loop, and reset button.
  - `EpochOverviewPanel` providing real-time situational telemetry for the selected year with active missions, contemporaneous milestones, and deep links.
  - `TimeCapsuleCarousel` showcasing 13 landmark spaceflight achievements categorized into Firsts, Deep Space, Planetary, Lunar, and Telescopes.
- **Mission Control Archive (`/missions`):**
  - Full archive directory tracking 20 curated historical missions across 6 international space agencies (NASA, ESA, JAXA, Roscosmos, ISRO, CNSA).
  - `MissionFilters` matrix supporting free-text search, agency filter pills, destination dropdown, mission type dropdown, decade pills, timeline epoch synchronization toggle, and sorting (newest, oldest, duration, alphabetical).
  - Historical analytics dashboard with Recharts visualizations for Missions by Decade and Destination, coupled with automated deterministic insights via `HistoricalInsightsEngine`.
  - Responsive mission dossier cards with flight status badges, celestial destination tags, key objectives, and direct actions to open the dossier or launch the replay simulation.
- **Mission Detail Dossier (`/missions/:missionId`):**
  - Dedicated route displaying identity, launch vehicle, operational timeframe, flight heritage status, spacecraft engineering hardware specifications (mass, power, instruments, trajectory), and chronological milestone logs.
  - Interactive `MissionStoryteller` presenting a 5-chapter narrative structure (The Challenge, The Mission, The Journey, The Discovery, The Legacy).
- **Interactive Mission Replay Engine (`MissionReplayEngine`):**
  - Reusable data-driven canvas simulation engine rendering 7 distinct tactical scene types (`launchpad`, `orbital_insertion`, `deep_space_cruise`, `planetary_flyby`, `surface_descent`, `scientific_survey`, `impact`).
  - Playback state machine with play, pause, resume, reset to milestone 0, previous/next milestone skip, and variable playback speeds (0.5×, 1×, 2×).
  - Milestone scrubber with progress bar, fullscreen toggle, reduced-motion accessibility fallback, and educational simulation disclaimers.
- **Test Automation:** 16 new automated Vitest tests (37 total across 5 test suites) verifying all Phase 3 functional and non-functional requirements with 100% pass rate.


### Detailed Phase 4 Completion Summary
- **Mars Operations Dashboard Hero (`MarsOperationsHero`):**
  - Atmospheric dust physics engine on 2D Canvas rendering ambient particle drift, sedimentation, and simulated dust devils with reduced-motion accessibility.
  - Dynamic fleet telemetry computing active vs total rovers, cumulative operational surface sols, cataloged cameras, and curated photos.
  - Quick-switch selector tabs allowing immediate rover context switching.
  - AstroNav design token integration with specialized Martian accents (`#D76B35`, `#9C4229`, `#E3A66B`).
- **Interactive Rover Fleet Selection (`RoverSelector`):**
  - Interactive cards for all 5 NASA Mars rovers: Perseverance, Curiosity, Opportunity, Spirit, and Sojourner.
  - Real-time status indicators (Active vs Concluded), landing site badges, mission duration, and URL query synchronization.
- **Rover Hardware & Systems Profile (`RoverProfileSection`):**
  - Comprehensive engineering specs: mass, physical dimensions, power sources (MMRTG nuclear / solar arrays), mobility suspension, top speed, and wheel diameter.
  - Interactive science instruments accordion covering all onboard sensor payloads.
  - Educational concepts drawer explaining specialized wheels, communication latency, camera diversity, and rock laser spectroscopy.
- **Martian Sol Explorer & Timeline Scrubber (`SolExplorerSection`):**
  - Continuous Martian solar day slider with milestone tick marks, stepper buttons, and reset filter.
  - Sol operational notes detailing historical and scientific milestones on specific sols.
- **Multi-Facet Rover Camera Gallery (`RoverGallerySection`):**
  - Multi-attribute filtering across search queries, camera subsystem pills, mission sol, and topic tags.
  - Sorting by newest sol, oldest sol, or title.
  - High-density responsive card grid with data provenance badges (Curated Historical vs Illustrative Demonstration).
- **Interactive Image Inspection Lab Modal (`ImageInspectionLabModal`):**
  - Flagship precision inspection lab with pan-and-drag viewport, zoom controls (1x–4x), fit to screen, and fullscreen expansion.
  - Hardware-accelerated CSS image processing adjustments: Brightness (50%–150%), Contrast (50%–150%), and Saturation (0%–200%) with instant reset.
  - Normalized percentage bounding box overlays (`normalizedX`, `normalizedY`, `normalizedWidth`, `normalizedHeight`) displaying educational annotations.
  - In-modal user field research note editor persisted directly to browser `localStorage`.
  - Adjacent photo pagination with keyboard arrow key shortcuts.
- **Mars Surface Journey Traverse (`SurfaceJourneySection`):**
  - Interactive 2D topographic schematic canvas plotting 23 sequential landing site traverse waypoints across Jezero Delta, Mount Sharp/Gale Crater, Meridiani Planum, and Columbia Hills.
  - Clickable waypoint pins with elevation, cumulative distance, terrain features, and key scientific milestones.
  - Direct one-click shortcuts to launch linked high-resolution rover photos into the Image Inspection Lab.
  - Illustrative schematic disclaimer.
- **Rover Engineering Comparison Lab (`RoverComparisonLab`):**
  - Side-by-side comparative telemetry matrix benchmarking any two rovers with metric swapping and duplicate selection protection.
  - Engineering evolution insights summarizing 24 years of technological advancements from Sojourner to Perseverance.
- **Test Automation & QA:** 17 new comprehensive Vitest unit and component tests (54 total across 6 test suites) verifying all Phase 4 features with 100% pass rate.

### Detailed Phase 5 Completion Summary
- **Asteroid Watch Operations Hero (`AsteroidWatchHero`):**
  - Atmospheric 2D Earth & particle encounter canvas.
  - Calculated statistics: 50 total records (8 curated benchmarks + 42 synthetic encounters), closest historical miss distance (Apophis 0.08 LD / 31,600 km), largest diameter (Ceres), and average synthetic diameter.
  - Transparent provenance notices: Offline Simulation, Deterministic Dataset, Reference Date (`2026-10-01`).
- **2D Orbital Encounter Explorer (`OrbitalEncounterCanvas`):**
  - Interactive schematic 2D HTML5 canvas rendering Earth, Moon (1 Lunar Distance orbit / 384,400 km), and hyperbolic asteroid encounter trajectories.
  - Directional vector arrows, closest approach perigee dotted vector, and dynamic distance telemetry HUD in both LD and kilometers.
  - Playback controls: Play/pause animation loop, animation speed toggles (0.5×, 1×, 2×), reset encounter, zoom controls (0.6× to 2.0×), and layer visibility toggles.
- **Chronological Close-Approach Scrubber (`CloseApproachTimeline`):**
  - Continuous horizontal event scrubber spanning 2026–2035 with chronological sorting.
  - Previous/Next encounter stepper controls, sub-lunar distance highlight pills, and active event telemetry card with direct link to What-If Lab.
- **Near-Earth Asteroid Catalog & Filter Matrix (`AsteroidExplorerSection`):**
  - Free-text query matching designation, common name, and composition.
  - Multi-facet filters: Orbit Class (Apollo, Aten, Amor, Atira), Category (Synthetic Encounter, Curated Benchmark), Estimated Diameter ranges (<50m, 50-140m, 140-500m, >500m), Miss Distance ranges (<1 LD, 1-5 LD, >5 LD), Velocity ranges (<15 km/s, 15-25 km/s, >25 km/s).
  - 5-way sorting: Closest Miss Distance, Largest Diameter, Highest Velocity, Earliest Date, and Latest Date.
  - Interactive card deck with telemetry metrics, badges, modal inspector, and What-If Lab trigger.
- **Asteroid Inspection Dossier Modal (`AsteroidDetailModal`):**
  - Full-screen modal with physical specs, uncertainty bounds, bulk density, simulated risk index, close approach data in kilometers and Lunar Distances, and "Test in What-If Lab" CTA.
- **Planetary Defense What-If Simulation Lab (`PlanetaryDefenseWhatIfLab`):**
  - Deterministic physics calculation engine ($r = d/2$, $V = \frac{4}{3}\pi r^3$, $m = \rho V$, $v_{\text{m/s}} = v_{\text{km/s}} \times 1000$, $E = \frac{1}{2}mv^2$, TNT conversions).
  - Real-time parameter sliders: Diameter ($10\text{--}1000\text{ m}$), Velocity ($5\text{--}40\text{ km/s}$), Density ($1000\text{--}3500\text{ kg/m}^3$), and Illustrative Miss Distance ($10,000\text{--}5,000,000\text{ km}$).
  - Live metric KPI cards: Asteroid Mass, Enclosed Volume, Velocity in m/s, Kinetic Energy in Joules, Kilotons TNT, and Megatons TNT.
  - Interactive Recharts curves: Kinetic Energy vs Diameter (cubic curve $E \propto d^3$) and Kinetic Energy vs Velocity (quadratic parabola $E \propto v^2$) with active parameter reference dots.
  - Parameter Sensitivity Matrix: Analytical table proving $8\times$ energy multiplier on doubled diameter, $4\times$ on doubled velocity, and $2\times$ on doubled density.
  - 4 Educational Scenario Presets: Chelyabinsk-Scale (~20m airburst), Tunguska-Scale (~60m regional blast), Dimorphos / DART Target (~160m cratering threat), High-Velocity Retrograde Comet (~250m @ 38 km/s).
  - Explainable Physics Engine: 5 narrative cards detailing spherical geometry, quadratic velocity delivery, material density variance, safe flyby geometry, and explicit model limitations.
- **Academic Planetary Defense Foundations (`PlanetaryDefenseEducationPanel`):**
  - Global survey systems review (ATLAS, Pan-STARRS, Catalina, NEO Surveyor) and orbital uncertainty error ellipses.
  - Dynamic Orbit Taxonomy: Keplerian criteria for Apollo, Aten, Amor, and Atira classes.
  - 4 Engineered Deflection Architectures: Kinetic Impactor (NASA DART heritage), Gravity Tractor, Ion Beam Shepherd / Laser Ablation, and Nuclear Standoff Detonation.
  - Educational scientific ethics notice disclosing vacuum kinetic energy model limitations (no atmospheric hydrodynamic fragmentation or tsunami modeling).
- **Test Automation & QA:** 26 new comprehensive Vitest unit and component tests (80 total across 7 test suites) verifying all Phase 5 features with 100% pass rate.

### Detailed Phase 6 Completion Summary
- **Cosmo Intelligence Operations Hero (`CosmoIntelligenceHero`):**
  - Mission overview with dynamic entity metrics (Planets, Missions, Rovers, Asteroids).
  - Explicit badges for 100% Offline execution, Zero External Cloud APIs, and Explainable AI.
  - Subsystem quick-jump anchor bar: Briefings, Ask Atlas, Smart Search, Discovery Graph, Recommendations, and Evidence Audit.
- **Autonomous Cosmic Briefing Engine (`CosmicBriefingSection`):**
  - 5 domain categories: Mission Highlights, Planetary Discoveries, Mars Exploration, Asteroid Watch, and Historical Exploration.
  - Historical Exploration integrates a continuous year slider (1957–2026) synchronized bidirectionally with global `selectedYear`.
  - Landmark year dossiers (1957, 1969, 1977, 2020) and era-contextual fallbacks for empty years.
  - Bulleted key takeaways, source ephemeris citations with internal routes, and direct module exploration CTAs.
- **Ask the Atlas Natural Language Assistant (`AskTheAtlasSection`):**
  - Deterministic natural language query assistant operating entirely in browser memory ($< 3\text{ ms}$).
  - Rule-based classifier with 14 discrete scientific intents (planet info, comparisons, superlatives, mission dossiers, destination searches, launch epochs, rovers, images, PHAs, closest asteroids, and astronomical units).
  - Formatted markdown responses, structured comparison tables, verified source reference chips, and clickable follow-up inquiry suggestions.
- **Universal Smart Search Engine (`UniversalSearchSection`):**
  - In-memory inverted search catalog indexing all entities with weighted field relevance scoring (+50 exact title, +30 title prefix, +20 title token, +10 subtitle, +5 description, +15 all-token conjunction).
  - Category filter pills: All Catalog, Planets, Missions, Milestones, Mars Rovers, Asteroids, and Briefings.
  - Global `Ctrl+K` Command Palette integration with keyboard arrow navigation and enter-to-select.
- **Cosmic Discovery Knowledge Graph (`CosmicDiscoveryGraphSection`):**
  - Interactive 2D typed relational knowledge graph (SVG) connecting celestial bodies, flight projects, rovers, and near-Earth asteroids.
  - Color-coded group nodes (Cyan for Planets, Gold for Missions, Emerald for Rovers, Purple for Asteroids) with connection count badges.
  - 1-hop neighborhood subgraph filtering around selected nodes.
  - Detailed node inspector drawer with relational edge list and module navigation CTAs.
  - Accessible Semantic List View alternative for screen-reader and keyboard accessibility.
- **Explainable Contextual Recommendations (`ExplainableRecommendationsSection`):**
  - Contextual candidate scoring derived from active user state (`selectedPlanetId`, `selectedMissionId`, `selectedRoverId`, `selectedAsteroidId`, and `selectedYear`).
  - Human-readable explainable rationale callouts answering *"Why this was recommended"* for every card.
  - Deduplicated candidate deck with relevance scores ($0.95 \dots 0.70$).
- **Algorithmic Insight Evidence & Audit Panel (`InsightEvidencePanel`):**
  - Transparent audit drawer displaying deterministic rules applied, total records examined, execution latency, and primary ephemeris citations.
  - Detailed comparison proving advantages of local deterministic algorithms over opaque, hallucinating cloud LLMs.
- **Test Automation & QA:** 23 new comprehensive Vitest unit and component tests (103 total across 8 test suites) verifying all Phase 6 features with 100% pass rate.

### Detailed Phase 7 Completion Summary
- **Personal Space Vault (`/vault`):**
  - **Explorer Profile HUD (`VaultHeroSection`):** Local user identity (display name, callsign, clearance level, rank insignia, bio) with inline editing, storage footprint statistics, and prominent client-side data sovereignty disclosure.
  - **Universal Bookmarks System (`UniversalFavoritesSection`):** Category tabs (Planets, Missions, Rovers, Images, Asteroids), real-time search, color badges, synthetic data tags, return navigation links, and collection assignment popovers.
  - **Custom Collections Shelves (`CollectionsSection`):** Create, edit, and safely delete custom research shelves without deleting underlying bookmarked favorites.
  - **Exploration Journal Logbook (`ExplorationJournalSection`):** Personal observatory notebook with title, multiline content, entity linking, tag filtering, date sorting, and local browser persistence.
  - **Explorer Passport (`ExplorerPassportSection`):** Holographic credential card displaying verified telemetry (planets surveyed, missions logged, photos inspected, impact sims run, lessons passed, quizzes certified, total actions recorded).
  - **Interactive Explorer Constellation (`ConstellationProgressSection`):** Flagship interactive SVG celestial starfield map with 12 achievement stars, dynamic dual-ignition glowing vector edges, progress indicator rings, detail inspection popovers, and accessible semantic list view alternative.
  - **Personal Exploration Analytics (`PersonalAnalyticsSection`):** Recharts charts rendering activity distribution across 7 domains, curriculum trail performance (lessons completed vs quiz score %), and achievement category completion breakdown.
  - **Versioned Local Backup & Recovery (`VaultBackupSection`):** JSON export (`cosmostellaratlas-vault-backup-YYYY-MM-DD.json`), JSON import with schema validation supporting merge and replace modes, storage quota calculation, and double-confirmation reset.
- **Interactive Learning Hub (`/learn`):**
  - **Learning Hub Hero (`LearningHubHero`):** Curriculum overview metrics (total lessons, quizzes passed, badges earned, overall mastery %).
  - **4 Structured Learning Trails (`LearningTrailsSection`, `learningTrails.ts`):** Solar System (`SOL-CURR-01`), Mars Exploration (`MARS-CURR-02`), Planetary Defense (`NEO-CURR-03`), and Spaceflight History (`HIST-CURR-04`).
  - **Interactive Lesson Reader Modal (`InteractiveLessonModal`):** 12 comprehensive lessons with objectives, rich multi-section text, styled callout boxes (scientific reality, astro-observation, explorer insight), key takeaways, explicit completion tracking, and working shortcuts to connected simulation laboratories.
  - **Reusable Certification Quiz Engine (`InteractiveQuizModal`):** 24 validated questions (6 per trail) with interactive selection, single-question stepper, 70% passing threshold, score calculation, full question-by-question review with scientific explanations, and retry mechanics.
- **Cross-Module Telemetry Integration:**
  - Integrated working star bookmark buttons and genuine exploration event logging into `PlanetInfoCenter`, `PlanetaryComparisonLab`, `MissionCard`, `MissionDetailPage`, `MissionReplayEngine`, `ImageInspectionLabModal`, `AsteroidDetailModal`, `PlanetaryDefenseWhatIfLab`, and `CosmicBriefingSection`.
- **Test Automation & QA:** 25 new comprehensive Vitest unit and component tests (128 total across 9 test suites) verifying all Phase 7 features with 100% pass rate.



