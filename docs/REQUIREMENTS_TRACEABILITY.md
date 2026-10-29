# Requirements Traceability Matrix (RTM)

**Developer:** Rufus Samuel R  
**Registration Number:** URK25CS1090  
**Institution:** Karunya Institute of Technology and Sciences  
**Project:** CosmoStellarAtlas — Open Space Exploration Portal  
**Document Version:** 1.0.0 (Phase 8 Final Production Release)

---

## 1. Overview
This matrix maps every functional requirement (FR-01 through FR-78) and non-functional requirement (NFR-01 through NFR-10) to its exact source implementation files, verification test cases, and delivery status.

---

## 2. Master Traceability Table

| Requirement ID | Module / Feature Description | Implementation File(s) | Verification Test File & Case | Status |
| :---: | :--- | :--- | :--- | :---: |
| **FR-01** | Navigation Shell & HUD Layout | `src/components/layout/Navbar.tsx`, `Sidebar.tsx`, `AppLayout.tsx` | `src/tests/components.test.tsx` (Responsive drawer toggle, route transitions) | **VERIFIED** |
| **FR-02** | Cinematic Observatory Hero & Canvas | `src/features/observatory/components/HeroSection.tsx`, `CelestialCenterpiece.tsx` | `src/tests/components.test.tsx` (Canvas context, drag rotation telemetry) | **VERIFIED** |
| **FR-03** | Dynamic Observatory Statistics | `src/features/observatory/components/StatsSection.tsx`, `StatCard.tsx` | `src/tests/provider.test.ts` ("Requirement 3: dashboard statistics match exact counts") | **VERIFIED** |
| **FR-04** | Featured Planetary World Showcase | `src/features/observatory/components/FeaturedPlanetSection.tsx` | `src/tests/provider.test.ts` ("Requirement 1: returns valid planet data") | **VERIFIED** |
| **FR-05** | Historical Mission Spotlight | `src/features/observatory/components/MissionSpotlightSection.tsx` | `src/tests/provider.test.ts` ("Requirement 2: mission filtering works correctly") | **VERIFIED** |
| **FR-06** | Temporal State Synchronization | `src/features/observatory/components/TimelinePreviewSection.tsx`, `useAppStore.ts` | `src/tests/store.test.ts` ("Requirement 4: historical year selection updates store") | **VERIFIED** |
| **FR-07** | Analytical Flight Activity Chart | `src/features/observatory/components/MissionActivityChartSection.tsx` | `src/tests/components.test.tsx` (Recharts SVG rendering) | **VERIFIED** |
| **FR-08** | Discovery Modules Portal Array | `src/features/observatory/components/DiscoveryModulesSection.tsx` | `src/tests/components.test.tsx` (All 8 module cards route to active views) | **VERIFIED** |
| **FR-09** | Global Command Palette (`Ctrl+K`) | `src/components/common/CommandPalette.tsx`, `searchIndexService.ts` | `src/tests/intelligence.test.tsx` (Real-time tokenized search) | **VERIFIED** |
| **FR-10** | Offline Provenance Transparency | `src/components/common/OfflineDemoIndicator.tsx` | `src/tests/components.test.tsx` (Provenance modal disclosure) | **VERIFIED** |
| **FR-11** | Visual FX Preference Switcher | `src/store/useAppStore.ts`, `StarfieldCanvas.tsx` | `src/tests/store.test.ts` (High/Minimal/Off settings persistence) | **VERIFIED** |
| **FR-12** | Resilient Telemetry Error Handling | `src/components/common/ErrorState.tsx`, `MockSpaceDataProvider.ts` | `src/tests/components.test.tsx` ("Requirement 6: simulated provider errors") | **VERIFIED** |
| **FR-13** | 3D Planetary WebGL Viewport | `src/features/planets/components/viewer/PlanetCanvas3D.tsx` | `src/tests/planets.test.tsx` ("Requirement 1: renders all 8 planets with metadata") | **VERIFIED** |
| **FR-14** | Procedural Planetary Textures | `src/features/planets/components/viewer/PlanetTextureGenerator.ts` | `src/tests/planets.test.tsx` (Procedural canvas equirectangular maps) | **VERIFIED** |
| **FR-15** | 2D Canvas Viewport Fallback | `src/features/planets/components/viewer/PlanetCanvasFallback.tsx` | `src/tests/planets.test.tsx` ("Requirement 10: viewer fallback renders on WebGL fault") | **VERIFIED** |
| **FR-16** | Solar System Dual-Mode Navigator | `src/features/planets/components/navigator/SolarSystemNavigator.tsx` | `src/tests/planets.test.tsx` ("Requirement 2: selecting planet updates information") | **VERIFIED** |
| **FR-17** | Planetary Physical Telemetry & Weight | `src/features/planets/components/info/PlanetInfoCenter.tsx`, `planetaryMath.ts` | `src/tests/planets.test.tsx` ("Requirement 7: handles extreme bounds without crashing") | **VERIFIED** |
| **FR-18** | Planetary Comparison Lab & Insights | `src/features/planets/components/comparison/PlanetaryComparisonLab.tsx` | `src/tests/planets.test.tsx` ("Requirement 5-6: identical targets & mathematical ratios") | **VERIFIED** |
| **FR-19** | Scale of Solar System Explorer | `src/features/planets/components/scale/ScaleExplorer.tsx` | `src/tests/planets.test.tsx` (Comparative Recharts diameter, distance, period) | **VERIFIED** |
| **FR-20** | Flight Heritage & Epoch Filtering | `src/features/planets/components/missions/PlanetRelatedMissions.tsx` | `src/tests/planets.test.tsx` ("Requirement 8-9: mission relationships & epoch filters") | **VERIFIED** |
| **FR-21** | Planet Multi-Facet Filters & Search | `src/features/planets/components/filters/PlanetFilters.tsx` | `src/tests/planets.test.tsx` ("Requirement 3-4: classification filters and search queries") | **VERIFIED** |
| **FR-22** | Planet Discovery Passport Highlights | `src/features/planets/components/passport/PlanetDiscoveryPassport.tsx` | `src/tests/planets.test.tsx` (Curiosity takeaways & recommended links) | **VERIFIED** |
| **FR-23** | Temporal Chronology Scrubber | `src/features/timeline/components/scrubber/TimelineScrubber.tsx` | `src/tests/missions.test.tsx` ("Requirement 5 & 8: timeline year updates") | **VERIFIED** |
| **FR-24** | Bidirectional Global Epoch Sync | `src/store/useAppStore.ts`, `TimelinePage.tsx`, `MissionsPage.tsx` | `src/tests/missions.test.tsx` ("Requirement 9: active epoch filter constraint") | **VERIFIED** |
| **FR-25** | Epoch Telemetry Overview Panel | `src/features/timeline/components/epoch/EpochOverviewPanel.tsx` | `src/tests/missions.test.tsx` ("Requirement 5: chronological epoch updates") | **VERIFIED** |
| **FR-26** | Curated Cosmic Time Capsules | `src/features/timeline/components/capsules/TimeCapsuleCard.tsx` | `src/tests/missions.test.tsx` ("Requirement 15: time capsules across categories") | **VERIFIED** |
| **FR-27** | Mission Control Archive Directory | `src/features/missions/MissionsPage.tsx`, `MissionFilters.tsx` | `src/tests/missions.test.tsx` ("Requirement 1: renders all 20 missions") | **VERIFIED** |
| **FR-28** | Multi-Attribute Mission Sorting | `src/features/missions/components/filters/MissionFilters.tsx` | `src/tests/missions.test.tsx` ("Requirement 11: sorting by date, duration, name") | **VERIFIED** |
| **FR-29** | Historical Insights & Analytics | `src/features/missions/components/analytics/MissionAnalyticsSection.tsx` | `src/tests/missions.test.tsx` ("Requirement 10: historical insights engine aggregates") | **VERIFIED** |
| **FR-30** | Comprehensive Mission Dossier | `src/features/missions/MissionDetailPage.tsx` | `src/tests/missions.test.tsx` ("Requirement 13-14: mission detail route & 404 recovery") | **VERIFIED** |
| **FR-31** | 5-Chapter Mission Storytelling | `src/features/missions/components/storytelling/MissionStoryteller.tsx` | `src/tests/missions.test.tsx` ("Requirement 12: storytelling narrative with 5 chapters") | **VERIFIED** |
| **FR-32** | Interactive Mission Replay Engine | `src/features/missions/components/replay/MissionReplayEngine.tsx` | `src/tests/missions.test.tsx` ("Requirement 7: speed controls, Req 8: milestone navigation") | **VERIFIED** |
| **FR-33** | Mars Operations Dashboard Hero | `src/features/rovers/components/hero/MarsOperationsHero.tsx` | `src/tests/rovers.test.tsx` ("Requirement 8: hero canvas & quick tabs") | **VERIFIED** |
| **FR-34** | Interactive Rover Fleet Selection | `src/features/rovers/components/selector/RoverSelector.tsx` | `src/tests/rovers.test.tsx` ("Requirement 2: rover selection updates active profile") | **VERIFIED** |
| **FR-35** | Rover Hardware & Specifications | `src/features/rovers/components/profile/RoverProfileSection.tsx` | `src/tests/rovers.test.tsx` ("Requirement 1: loads complete attributes & specifications") | **VERIFIED** |
| **FR-36** | Rover Science Instruments Drawer | `src/features/rovers/components/profile/RoverProfileSection.tsx` | `src/tests/rovers.test.tsx` ("Requirement 9-10: instruments accordion & concepts") | **VERIFIED** |
| **FR-37** | Martian Sol Scrubber & Activity | `src/features/rovers/components/sol/SolExplorerSection.tsx` | `src/tests/rovers.test.tsx` ("Requirement 5: sol scrubber filters visible photo gallery") | **VERIFIED** |
| **FR-38** | Multi-Facet Camera Gallery | `src/features/rovers/components/gallery/RoverGallerySection.tsx` | `src/tests/rovers.test.tsx` ("Requirement 3-4: gallery camera filter & free-text search") | **VERIFIED** |
| **FR-39** | Image Inspection Lab Viewport | `src/features/rovers/components/inspection/ImageInspectionLabModal.tsx` | `src/tests/rovers.test.tsx` ("Requirement 6 & 12: zoom/pan & CSS image processing") | **VERIFIED** |
| **FR-40** | Normalized Surface Annotations | `src/features/rovers/components/inspection/ImageInspectionLabModal.tsx` | `src/tests/rovers.test.tsx` ("Requirement 7: educational bounding overlays") | **VERIFIED** |
| **FR-41** | Mars Surface Journey Traverse | `src/features/rovers/components/journey/SurfaceJourneySection.tsx` | `src/tests/rovers.test.tsx` ("Requirement 13: topographic schematic traverse waypoints") | **VERIFIED** |
| **FR-42** | Rover Engineering Comparison Lab | `src/features/rovers/components/comparison/RoverComparisonLab.tsx` | `src/tests/rovers.test.tsx` ("Requirement 14: side-by-side telemetry benchmarking") | **VERIFIED** |
| **FR-43** | Asteroid Watch Operations Hero | `src/features/asteroids/components/hero/AsteroidWatchHero.tsx` | `src/tests/asteroids.test.tsx` ("Requirement 18: AsteroidsPage renders operations hero") | **VERIFIED** |
| **FR-44** | 2D Orbital Encounter Canvas | `src/features/asteroids/components/encounter/OrbitalEncounterCanvas.tsx` | `src/tests/asteroids.test.tsx` ("Requirement 19: selecting asteroid updates encounter canvas") | **VERIFIED** |
| **FR-45** | Close-Approach Chronology Timeline | `src/features/asteroids/components/encounter/CloseApproachTimeline.tsx` | `src/tests/asteroids.test.tsx` ("Requirement 21: chronology stepper advances encounters") | **VERIFIED** |
| **FR-46** | Multi-Facet Asteroid Catalog Matrix | `src/features/asteroids/components/explorer/AsteroidExplorerSection.tsx` | `src/tests/asteroids.test.tsx` ("Requirement 1-4: 50 records, orbit class, diameter/velocity") | **VERIFIED** |
| **FR-47** | Asteroid Detail Dossier Modal | `src/features/asteroids/components/explorer/AsteroidDetailModal.tsx` | `src/tests/asteroids.test.tsx` ("Requirement 20: displays detailed telemetry & risk index") | **VERIFIED** |
| **FR-48** | Planetary Defense What-If Physics | `src/features/asteroids/components/whatif/PlanetaryDefenseWhatIfLab.tsx` | `src/tests/asteroids.test.tsx` ("Requirement 5-10: volume, mass, kinetic energy, TNT Mt") | **VERIFIED** |
| **FR-49** | Dynamic Kinetic Energy Curves | `src/features/asteroids/components/whatif/PlanetaryDefenseWhatIfLab.tsx` | `src/tests/asteroids.test.tsx` ("Requirement 11-12 & 15: quadratic & cubic scaling curves") | **VERIFIED** |
| **FR-50** | Sensitivity Variation Matrix | `src/features/asteroids/components/whatif/PlanetaryDefenseWhatIfLab.tsx` | `src/tests/asteroids.test.tsx` ("Requirement 16: parameter sensitivity breakdown: 8x, 4x, 2x") | **VERIFIED** |
| **FR-51** | Scenario Presets & Physics Disclosures | `src/features/asteroids/components/whatif/PlanetaryDefenseWhatIfLab.tsx` | `src/tests/asteroids.test.tsx` ("Requirement 17 & 22: scenario presets & explainable limits") | **VERIFIED** |
| **FR-52** | Academic Planetary Defense Foundations | `src/features/asteroids/components/education/PlanetaryDefenseEducationPanel.tsx` | `src/tests/asteroids.test.tsx` ("Requirement 24: survey networks & 4 deflection architectures") | **VERIFIED** |
| **FR-53** | Space Intelligence Operations Hero | `src/features/intelligence/components/CosmoIntelligenceHero.tsx` | `src/tests/intelligence.test.tsx` ("Requirement 23: renders hero with sub-3ms latency badge") | **VERIFIED** |
| **FR-54** | Autonomous Cosmic Briefing Engine | `src/features/intelligence/components/CosmicBriefingSection.tsx` | `src/tests/intelligence.test.tsx` ("Requirement 16: generates all 5 categories cleanly") | **VERIFIED** |
| **FR-55** | Historical Briefing Temporal Sync | `src/features/intelligence/components/CosmicBriefingSection.tsx` | `src/tests/intelligence.test.tsx` ("Requirement 17-18: landmark years & era fallbacks") | **VERIFIED** |
| **FR-56** | Ask the Atlas Query Assistant | `src/features/intelligence/components/AskTheAtlasSection.tsx` | `src/tests/intelligence.test.tsx` ("Requirement 6-15: 14 rule intents, markdown answers") | **VERIFIED** |
| **FR-57** | Inverted Search Indexing & Ranking | `src/features/intelligence/services/searchIndexService.ts` | `src/tests/intelligence.test.tsx` ("Requirement 1-5: indexes all entities with exact match bonus") | **VERIFIED** |
| **FR-58** | Universal Smart Search Section | `src/features/intelligence/components/UniversalSearchSection.tsx` | `src/tests/intelligence.test.tsx` ("Requirement 23: renders Universal Smart Discovery") | **VERIFIED** |
| **FR-59** | Relational Knowledge Discovery Graph | `src/features/intelligence/components/CosmicDiscoveryGraphSection.tsx` | `src/tests/intelligence.test.tsx` ("Requirement 19: generates 2D directed graph with multi-hops") | **VERIFIED** |
| **FR-60** | Graph Neighborhood 1-Hop Focus | `src/features/intelligence/components/CosmicDiscoveryGraphSection.tsx` | `src/tests/intelligence.test.tsx` ("Requirement 20: 1-hop subgraph focus & accessible list view") | **VERIFIED** |
| **FR-61** | Contextual Explainable Recommendations| `src/features/intelligence/components/ExplainableRecommendationsSection.tsx` | `src/tests/intelligence.test.tsx` ("Requirement 21-22: derived recommendations with rationales") | **VERIFIED** |
| **FR-62** | Algorithmic Insight Evidence Audit | `src/features/intelligence/components/InsightEvidencePanel.tsx` | `src/tests/intelligence.test.tsx` ("Requirement 23: transparent rule audit drawer") | **VERIFIED** |
| **FR-63** | Client-Side Explorer Profile HUD | `src/features/vault/components/VaultHeroSection.tsx` | `src/tests/vault.test.tsx` ("Requirement 5 & 19: credentials HUD & storage footprint") | **VERIFIED** |
| **FR-64** | Universal Multi-Category Bookmarks | `src/features/vault/components/UniversalFavoritesSection.tsx` | `src/tests/vault.test.tsx` ("Requirement 6-7: universal bookmarks across 5 domains") | **VERIFIED** |
| **FR-65** | Personal Research Shelves (Collections)| `src/features/vault/components/CollectionsSection.tsx` | `src/tests/vault.test.tsx` ("Requirement 8: manages custom collections & safe deletion") | **VERIFIED** |
| **FR-66** | Field Research Journal Logbook | `src/features/vault/components/ExplorationJournalSection.tsx` | `src/tests/vault.test.tsx` ("Requirement 9 & 23: journal logbook with tags and entity links") | **VERIFIED** |
| **FR-67** | Structured Astrophysics Trails (4) | `src/features/learning/components/LearningTrailsSection.tsx` | `src/tests/vault.test.tsx` ("Requirement 10 & 18: 4 trails, 12 lessons, 24 quiz questions") | **VERIFIED** |
| **FR-68** | Interactive Lesson Reader Modal | `src/features/learning/components/InteractiveLessonModal.tsx` | `src/tests/vault.test.tsx` ("Requirement 11 & 21: structured reader, takeaways, lab links") | **VERIFIED** |
| **FR-69** | Reusable Certification Quiz Engine | `src/features/learning/components/InteractiveQuizModal.tsx` | `src/tests/vault.test.tsx` ("Requirement 12 & 22: question navigation, grading, explanations") | **VERIFIED** |
| **FR-70** | Verifiable Exploration Telemetry | Cross-module hooks in Planets, Missions, Rovers, Asteroids | `src/tests/vault.test.tsx` ("Requirement 14: logs telemetry events & updates progress") | **VERIFIED** |
| **FR-71** | Interactive Constellation Starfield | `src/features/vault/components/ConstellationProgressSection.tsx` | `src/tests/vault.test.tsx` ("Requirement 13 & 20: 12 achievement stars, illuminated edges") | **VERIFIED** |
| **FR-72** | Deterministic Clearance Rank Engine | `src/services/achievementDefinitions.ts` | `src/tests/vault.test.tsx` ("Requirement 14: derives Levels 1-5 from unlocked achievements") | **VERIFIED** |
| **FR-73** | Personal Exploration Analytics | `src/features/vault/components/PersonalAnalyticsSection.tsx` | `src/tests/vault.test.tsx` (Recharts activity distribution and curriculum curves) | **VERIFIED** |
| **FR-74** | Versioned Backup Export & Import | `src/features/vault/components/VaultBackupSection.tsx` | `src/tests/vault.test.tsx` ("Requirement 1-3 & 15-17: JSON export, merge/replace modes") | **VERIFIED** |
| **FR-75** | Double-Confirmation Vault Reset | `src/features/vault/components/VaultBackupSection.tsx` | `src/tests/vault.test.tsx` ("Requirement 17: danger-zone reset restores default profile") | **VERIFIED** |
| **FR-76** | Global React Error Boundary | `src/components/common/ErrorBoundary.tsx`, `App.tsx` | `src/tests/integration.test.tsx` (Subsystem fault isolation and recovery) | **VERIFIED** |
| **FR-77** | Python Analytical Tools Pipeline | `scripts/python/*.py` | `src/tests/test_python.py` (16 unittest tests passing, schema checks, physics) | **VERIFIED** |
| **FR-78** | Cross-Module Integration Scenarios | `src/tests/integration.test.tsx` | `src/tests/integration.test.tsx` (10 end-to-end multi-module user journeys) | **VERIFIED** |

---

## 3. Non-Functional Requirements (NFR) Traceability

| NFR ID | Attribute | Specification Target | Verification Evidence | Status |
| :---: | :--- | :--- | :--- | :---: |
| **NFR-01** | Zero External API Dependency | 100% offline self-contained operation | Codebase inspection: 0 remote fetch/axios endpoints | **VERIFIED** |
| **NFR-02** | Aerospace UI/UX Design System | AstroNav design tokens (`#060B19`, `#20D9F2`, `#8565FA`, `#FFB45B`) | `tailwind.config.js`, all UI component styling | **VERIFIED** |
| **NFR-03** | 404 Route Catch & Recovery | Graceful recovery from unrecognized URLs | `src/tests/components.test.tsx` ("Requirement 5") | **VERIFIED** |
| **NFR-04** | Responsive Viewport Geometry | Desktop (1920×1080), Laptop (1366×768), Tablet (768×1024), Mobile (390×844) | Tailwind responsive utility audit & media queries | **VERIFIED** |
| **NFR-05** | Strict Type Safety | Zero TypeScript compilation errors | `npx tsc --noEmit` exits with code 0 | **VERIFIED** |
| **NFR-06** | Automated Test Coverage | $\ge 120$ unit, component, and integration tests | Vitest: 138 tests; Python: 16 tests; Total: 154 tests | **VERIFIED** |
| **NFR-07** | Performance Optimization | Sub-5s production build, vendor code splitting | `npm run build` completes in 4.34s with chunking | **VERIFIED** |
| **NFR-08** | Production Build Artifact | Relative asset paths compatible with GitHub Pages | `vite.config.ts` (`base: './'`), `HashRouter` | **VERIFIED** |
| **NFR-09** | CI/CD Deployment Automation | Automated testing and deployment to GitHub Pages | `.github/workflows/deploy.yml` | **VERIFIED** |
| **NFR-10** | Scientific Accuracy & Ethics | Explicit provenance, Newtonian physics, no fake AI | Provenance indicators, disclaimers, explainable logic | **VERIFIED** |

