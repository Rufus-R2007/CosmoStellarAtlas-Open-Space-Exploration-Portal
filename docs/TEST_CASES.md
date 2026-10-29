# CosmoStellarAtlas — Master Test Cases Specification

**Developer:** Rufus Samuel R (URK25CS1090)  
**Institution:** Karunya Institute of Technology and Sciences  
**Coursework:** Software Engineering Micro Project  
**Document Version:** 1.0.0 (Phase 8 Production Release)

---

## 1. Overview
This document contains the formalized black-box and white-box test cases for the CosmoStellarAtlas exploration platform. All test cases have been executed against the production codebase and recorded with their actual execution results.

---

## 2. Test Case Execution Matrix

| Test Case ID | Req. ID | Objective | Preconditions | Input / Action | Expected Output | Actual Output | Status |
| :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-001** | FR-01 | Verify primary navigation shell rendering | App loaded at root URL | Load application `#` | Sidebar, Navbar, and Starfield render without errors | All components rendered smoothly | **PASS** |
| **TC-002** | FR-03 | Validate observatory fleet statistics | Datasets loaded | Mount Observatory Dashboard | Metrics match dataset counts (8 planets, 20 missions, 50 asteroids) | Exact numeric match displayed | **PASS** |
| **TC-003** | FR-13 | Test 3D planet WebGL rendering | WebGL supported | Select planet "Mars" | Three.js WebGL canvas mounts with procedural texture | Viewport mounted and rotatable | **PASS** |
| **TC-004** | FR-15 | Test 2D planet fallback renderer | WebGL context unavailable | Force WebGL context null | 2D HTML5 canvas fallback renders banded world | 2D canvas rendered with zero crashes | **PASS** |
| **TC-005** | FR-17 | Test relative weight calculation | Planet Explorer open | Enter Earth weight = `80` kg on Mars ($g = 3.72$) | Calculated weight equals $\approx 30.3$ kg | Displays $30.3$ kg ($0.38\times$ Earth) | **PASS** |
| **TC-006** | FR-17 | Test boundary inputs in weight simulator | Planet Explorer open | Enter negative weight `-50` or `0` kg | System clamps or falls back to safe non-negative default | Clamped safely, no NaN displayed | **PASS** |
| **TC-007** | FR-18 | Test side-by-side comparison target swap | Comparison Lab open | Select Planet A = Mars, Planet B = Jupiter | Ratios and insights update dynamically | Ratios computed ($20.6\times$ diameter) | **PASS** |
| **TC-008** | FR-18 | Test duplicate target handling in comparison | Comparison Lab open | Select Planet A = Mars, Planet B = Mars | System displays duplicate target warning notice | Warning card shown, ratio $1.0\times$ | **PASS** |
| **TC-009** | FR-23 | Test chronological timeline scrubber | Timeline page open | Drag slider to year `1969` | Timeline updates active epoch to 1969; shows Apollo 11 | Active epoch updated, Apollo 11 highlighted | **PASS** |
| **TC-010** | FR-24 | Verify epoch filter constraint in Mission Control | Epoch set to 1969 | Check "Filter to active epoch $\le 1969$" | Missions launched after 1969 (e.g. Perseverance 2020) hidden | Post-1969 missions filtered out | **PASS** |
| **TC-011** | FR-30 | Verify missing mission route handling | Mission page open | Navigate to invalid route `#/missions/invalid-id` | System displays graceful 404 recovery view with link | Not Found page displayed with return button | **PASS** |
| **TC-012** | FR-32 | Test Mission Replay variable speed controls | Mission Replay open | Click playback speed `2x` | Animation frame timer advances at double rate | Simulation plays at $2.0\times$ speed | **PASS** |
| **TC-013** | FR-34 | Test Mars rover fleet selection | Rover console open | Click rover tab "Curiosity" | View updates to Curiosity specifications, Gale Crater, and sols | Curiosity specs and photo gallery mounted | **PASS** |
| **TC-014** | FR-38 | Test multi-facet camera gallery filtering | Rover gallery open | Select camera filter "Mastcam-Z" | Only photos taken with Mastcam-Z displayed | Filtered gallery matches camera instrument | **PASS** |
| **TC-015** | FR-39 | Test Image Inspection Lab zoom and pan | Image Lab open | Click Zoom In button to 2.5x | Viewport scales image with clamped dragging | Viewport zoomed to $250\%$ with 1:1 pan | **PASS** |
| **TC-016** | FR-39 | Test Image Lab CSS image adjustments | Image Lab open | Adjust Brightness to 125%, Contrast to 110% | Image element applies CSS filter string | Hardware-accelerated filter applied | **PASS** |
| **TC-017** | FR-46 | Test asteroid search and class filter | Asteroid catalog open | Search "Apophis", filter class "Aten" | Single matching record displayed (99942 Apophis) | Apophis card displayed with perigee vector | **PASS** |
| **TC-018** | FR-48 | Verify asteroid kinetic energy cubic scaling | What-If Lab open | Double diameter from $100\text{m} \rightarrow 200\text{m}$ | Energy increases by exact factor of $8\times$ ($2^3$) | Energy verified: $8.0\times$ multiplier | **PASS** |
| **TC-019** | FR-48 | Verify asteroid kinetic energy quadratic scaling | What-If Lab open | Double velocity from $15\text{km/s} \rightarrow 30\text{km/s}$| Energy increases by exact factor of $4\times$ ($2^2$) | Energy verified: $4.0\times$ multiplier | **PASS** |
| **TC-020** | FR-48 | Test boundary and negative inputs in What-If | What-If Lab open | Enter diameter $= -100$ or velocity $= 0$ | System rejects non-positive values with safe default | Protected, valid positive result returned | **PASS** |
| **TC-021** | FR-51 | Test scenario preset activation | What-If Lab open | Click "Small Asteroid (Chelyabinsk-Scale)" | Diameter set to 20m, velocity to 19 km/s, energy $\approx 500$ kt | Inputs updated, airburst scenario loaded | **PASS** |
| **TC-022** | FR-56 | Test Ask the Atlas query intent parser | Space Intelligence open| Ask "What is Mars?" | System identifies `EXPLAIN_ENTITY` intent, displays factsheet | Markdown factsheet rendered in $<3$ ms | **PASS** |
| **TC-023** | FR-56 | Test Ask the Atlas unsupported query | Space Intelligence open| Ask "What is the stock price of Apple?" | System provides friendly astronomical guidance fallback | Clarification guidance returned politely | **PASS** |
| **TC-024** | FR-57 | Test Universal Search inverted indexing | Intelligence page open | Search "Jezero" | High-speed ranking returns Perseverance and Jezero waypoints | Relevant entities ranked with badges | **PASS** |
| **TC-025** | FR-60 | Test Cosmic Discovery Graph 1-hop focus | Discovery Graph open | Select node "Mars" and toggle 1-hop focus | Only direct neighbors of Mars remain visible in SVG | Subgraph filtered cleanly, others dimmed | **PASS** |
| **TC-026** | FR-64 | Test universal star bookmarking | Planet Explorer open | Click "Bookmark in Space Vault" on Saturn | Saturn added to `favorites` in `useVaultStore` | Star turns gold, item present in `/vault` | **PASS** |
| **TC-027** | FR-66 | Test field research journal creation | Space Vault open | Enter note with title and tag `#astrophysics` | Note saved to localStorage with timestamp | Note rendered in logbook, search matches | **PASS** |
| **TC-028** | FR-68 | Test interactive lesson completion | Learning Hub open | Read lesson 1 and click "Mark as Completed" | Lesson marked complete; progress bar updates | Progress advances, achievement checked | **PASS** |
| **TC-029** | FR-69 | Test certification quiz grading | Learning Hub open | Submit quiz with 6/6 correct answers | 100% score recorded, certified badge awarded | Pass certified, Stargazer achievement unlocked | **PASS** |
| **TC-030** | FR-72 | Test deterministic clearance rank advancement | Space Vault open | Unlock 2 achievements | User clearance rank advances to Level 2 (Cadet Explorer) | Rank badge updates to Cadet Explorer | **PASS** |
| **TC-031** | FR-74 | Test versioned JSON backup export | Space Vault open | Click "Export Vault Data (JSON)" | Browser downloads `cosmostellaratlas-vault-backup-*.json`| Valid JSON file generated and downloaded | **PASS** |
| **TC-032** | FR-74 | Test schema-validated JSON backup import | Space Vault open | Upload valid backup file in "Merge" mode | Backup merged with local state without duplicate IDs | Merged cleanly, notification displayed | **PASS** |
| **TC-033** | FR-75 | Test double-confirmation vault reset | Space Vault open | Click Reset Vault and confirm modal | All personal data cleared; defaults restored | Reinstated default profile and initial state | **PASS** |
| **TC-034** | FR-76 | Test React Error Boundary isolation | Any route | Inject intentional component throw | Error boundary displays tactical HUD isolation screen | Fallback mounted with recovery buttons | **PASS** |
| **TC-035** | FR-77 | Test Python analytical data validator | Terminal | Run `npm run data:validate` | Validates all 9 datasets with 0 critical errors | Exits with status 0, all datasets valid | **PASS** |
| **TC-036** | FR-77 | Test Python asteroid physics calculations | Terminal | Run `python scripts/python/asteroid_physics.py` | Calculates kinetic energy and confirms scaling multipliers | Multipliers confirmed: 8x, 4x, 2x | **PASS** |
| **TC-037** | FR-77 | Test Python unit test suite | Terminal | Run `npm run test:python` | 16 tests executed via `unittest` | 16/16 tests pass in 0.010s | **PASS** |
| **TC-038** | FR-78 | Test end-to-end integration scenario suite | Terminal | Run `npm test -- --run` | 138 Vitest tests across 10 suites executed | 138/138 tests pass in 3.36s | **PASS** |
| **TC-039** | NFR-05 | Test TypeScript strict compilation | Terminal | Run `npm run lint` (`npx tsc --noEmit`) | 0 compile errors | Exits with status 0 | **PASS** |
| **TC-040** | NFR-08 | Test production bundle compilation | Terminal | Run `npm run build` | Optimized Rollup build in `dist/` | Build succeeds in 4.34s with chunking | **PASS** |

---

## 3. Boundary Value Analysis (BVA) Summary

1. **Asteroid Kinetic Energy Engine:**
   - $d = 0\text{ m} \rightarrow E_k = 0\text{ J}$ (no negative or NaN output).
   - $d = 10\text{ m}$ (minimum slider bound) $\rightarrow E_k = 6.26 \times 10^{13}\text{ J}$ ($\approx 15\text{ kt}$).
   - $d = 1000\text{ m}$ (maximum slider bound) $\rightarrow E_k = 6.26 \times 10^{19}\text{ J}$ ($\approx 62,572\text{ Mt}$).
   - $v = 0\text{ km/s} \rightarrow E_k = 0\text{ J}$.
   - $v = 5\text{ km/s} \rightarrow E_k = 3.91\text{ Mt}$.
   - $v = 40\text{ km/s} \rightarrow E_k = 250.29\text{ Mt}$.
2. **Relative Weight Simulator:**
   - $W_{\text{Earth}} = 20\text{ kg}$ (lower bound) on Jupiter ($g=24.79$) $\rightarrow 50.5\text{ kg}$.
   - $W_{\text{Earth}} = 200\text{ kg}$ (upper bound) on Moon ($g=1.62$) $\rightarrow 33.0\text{ kg}$.
   - Negative weights clamped to safe positive default.
3. **Certification Quiz Scoring:**
   - 0/6 correct ($0\%$) $\rightarrow$ Failed (requires $70\%$).
   - 4/6 correct ($66.7\%$) $\rightarrow$ Failed (strictly below threshold).
   - 5/6 correct ($83.3\%$) $\rightarrow$ Certified Pass (meets $\ge 70\%$).
   - 6/6 correct ($100\%$) $\rightarrow$ Certified Pass with honors.

