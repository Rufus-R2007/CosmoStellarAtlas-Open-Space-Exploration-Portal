# CosmoStellarAtlas — Master Quality Assurance & Test Plan

**Developer:** Rufus Samuel R (URK25CS1090)  
**Institution:** Karunya Institute of Technology and Sciences  
**Coursework:** Software Engineering Micro Project  
**Document Version:** 1.0.0 (Phase 8 Production Release)

---

## 1. Testing Objectives
The primary objective of the CosmoStellarAtlas verification strategy is to ensure that the portal functions as an aerospace-grade, scientifically accurate, reliable, and responsive space exploration platform.
Specific objectives include:
1. **Zero Runtime Exceptions:** Eliminate blank screens, uncaught exceptions, and unhandled promise rejections.
2. **Scientific Precision:** Validate classical Newtonian kinetic energy calculations, orbital mechanics, planetary gravity scaling, and TNT conversion formulas against exact reference standards.
3. **Data Integrity & Provenance:** Verify that curated historical facts and synthetic demonstration records are strictly delineated, with zero broken cross-references or missing IDs.
4. **Offline Resilience:** Guarantee that the entire platform operates without external network connections, external AI APIs, or third-party database dependencies.
5. **Cross-Module Integration:** Verify seamless state synchronization, parameter transfers, and bookmarking across all 9 primary exploration modules.

---

## 2. Test Scope & Boundaries

### In Scope:
- **Unit Testing:** Individual mathematical functions, data providers, search indexing, intent parsing, rank computation, and physics engines.
- **Component Testing:** UI rendering, canvas lifecycles, user interaction events, modals, drawers, and form controls.
- **Integration Testing:** Cross-module workflows (Dashboard → Planet Explorer, CTM → Mission Control, Asteroids → What-If Lab, Activity → Explorer Passport).
- **Python Utilities Testing:** Data generation determinism, JSON schema validation, dataset statistics, and Python impact physics.
- **Error Handling & Resilience:** WebGL context recovery, 404 routes, localStorage fallback, and React Error Boundaries.
- **Responsive Layouts:** Desktop ($1920 \times 1080$), Laptop ($1366 \times 768$), Tablet ($768 \times 1024$), and Mobile ($390 \times 844$).

### Out of Scope:
- Live external satellite network telemetry (the portal is designed with a strict offline demonstration architecture).
- Multi-user concurrent server-side database locking (state is partitioned per client in browser `localStorage`).

---

## 3. Testing Environment & Tooling Stack

| Testing Tier | Framework / Tool | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Test Runner** | Vitest | 2.1.8 | Lightning-fast ESM test runner with native Vite integration |
| **DOM Simulation** | JSDOM | 25.0.1 | Full W3C DOM and HTML5 environment for Node |
| **Component Testing**| React Testing Library | 16.1.0 | User-centric DOM query assertions and interaction testing |
| **Python Unit Testing**| `unittest` (Standard Library)| Python 3.14 / 3.11 | Python analytical utilities, data validator, and physics tests |
| **Static Verification**| TypeScript Compiler (`tsc`) | 5.7.2 | Compile-time strict type checking (`--noEmit`) |
| **CI/CD Automation** | GitHub Actions | Ubuntu Latest | Continuous integration build, test, and static deployment |

---

## 4. Multi-Tiered Testing Strategy

### 4.1 Unit Testing (Vitest & Python unittest)
- **Mathematical Utilities:** `calculateSimulationResult`, `calculateWeightOnPlanet`, `formatOrbitalPeriod`.
- **Search & Intelligence:** `parseQueryIntent` across 14 discrete intents, `calculateSearchScore`, `generateBriefing`.
- **Persistence & Achievements:** `computeAchievements`, `computeExplorerRank`, `validateEnvelopeSchema`.
- **Python Verification:** `test_asteroid_physics`, `test_generate_demo_data`, `test_validate_datasets`, `test_dataset_statistics`.

### 4.2 Component Testing (React Testing Library)
- **Modal Lifecycle:** `AsteroidDetailModal`, `ImageInspectionLabModal`, `InteractiveLessonModal`, `InteractiveQuizModal`.
- **Canvases & Fallbacks:** `PlanetCanvas3D` WebGL fallback to `PlanetCanvasFallback`, `OrbitalEncounterCanvas`, `StarfieldCanvas`.
- **HUD Controls:** Sliders, dropdowns, decade filters, stepper buttons, and tab switchers.

### 4.3 Integration Testing
- 10 multi-module integration scenarios in `src/tests/integration.test.tsx` verifying data flow between decoupled domains.

### 4.4 Black-Box Testing
- Functional verification focusing on inputs, boundary conditions, user actions, and observable DOM outputs without examining internal code execution.
- Detailed in `docs/TEST_CASES.md`.

### 4.5 White-Box Testing
- Structural testing analyzing internal execution branches, decision paths, and condition evaluations in critical algorithmic components:
  1. Asteroid kinetic energy and unit conversion logic (`planetaryDefenseMath.ts`).
  2. Relative weight simulator gravity ratio logic (`planetaryMath.ts`).
  3. Query intent parser pattern matching regexes (`queryIntentParser.ts`).
  4. Quiz evaluation score percentage and certification logic (`InteractiveQuizModal.tsx`).
  5. Achievement unlock predicates and clearance rank derivation (`achievementDefinitions.ts`).

### 4.6 Accessibility & Reduced-Motion Testing
- Semantic HTML tags (`<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>`, `<section>`).
- ARIA live regions and attributes (`role="alert"`, `aria-live="assertive"`, `aria-label`).
- Keyboard navigation: Full tab order across sidebar, modal dialogs, and Command Palette (`Ctrl+K`).
- Reduced-motion media query respect: Hardware canvas particle loops automatically reduce framerates or switch to stable tactical schematics.

---

## 5. Acceptance Criteria & Release Gate

A release build is certified for production only when all of the following conditions are met:
1. **TypeScript Type Safety:** `npx tsc --noEmit` exits with status `0` and 0 errors.
2. **Automated Test Suite:** `npm test -- --run` executes $\ge 120$ tests with 100% pass rate.
3. **Python Suite:** `npm run test:python` executes 16 unit tests with 100% pass rate.
4. **Dataset Verification:** `npm run data:validate` reports 0 critical schema errors.
5. **Static Bundle Compilation:** `npm run build` completes successfully generating optimized assets in `dist/`.
6. **Zero External API Calls:** Application loads and operates completely offline.
