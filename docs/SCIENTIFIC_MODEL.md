# CosmoStellarAtlas — Scientific Physics & Planetary Defense Model Specification

**Author:** Rufus Samuel R  
**Institution:** Karunya Institute of Technology and Sciences  
**Academic Module:** Software Engineering Micro Project  
**Component:** Asteroid Watch & Planetary Defense Simulation Lab (`/asteroids`)  
**Status:** Validated & Implemented (Phase 5)

---

## 1. Executive Summary & Purpose

The **Asteroid Watch & Planetary Defense Simulation Engine** delivers deterministic mathematical modeling of hypothetical Near-Earth Object (NEO) hypervelocity encounters. It enables students, faculty, and space engineering researchers to investigate how physical parameters—specifically **diameter**, **encounter velocity**, and **bulk density**—govern the theoretical vacuum kinetic energy delivered during a catastrophic celestial encounter.

This specification documents all mathematical derivations, standard physical constants, computational algorithms, parameter bounds, validation rules, and educational limitations implemented in [`src/features/asteroids/utils/planetaryDefenseMath.ts`](file:///src/features/asteroids/utils/planetaryDefenseMath.ts).

---

## 2. Fundamental Physics & Governing Equations

### 2.1 Impact Radius ($r$)

Assuming spherical geometry for bulk demonstration purposes, radius is calculated directly from input diameter:

$$r = \frac{d}{2}$$

- **Input:** $d \in [10, 1000]\text{ m}$ (Asteroid Diameter in meters)
- **Output:** $r \in [5, 500]\text{ m}$ (Radius in meters)
- **Safety Validation:** If $d \le 0$ or non-finite, $r \leftarrow 0$.

### 2.2 Spherical Enclosed Volume ($V$)

The volume of an idealized spherical body is given by:

$$V = \frac{4}{3} \pi r^3 = \frac{1}{6} \pi d^3$$

- **Input:** $r$ (meters)
- **Output:** $V$ ($\text{m}^3$, cubic meters)
- **Cubic Scaling Property:** Doubling the diameter ($2d$) multiplies the enclosed volume by $2^3 = 8$.

### 2.3 Estimated Bulk Mass ($m$)

Given material bulk density $\rho$:

$$m = \rho \cdot V = \rho \cdot \left(\frac{4}{3} \pi r^3\right)$$

- **Input:** $V$ ($\text{m}^3$), $\rho \in [1000, 3500]\text{ kg/m}^3$ (Density in kilograms per cubic meter)
- **Output:** $m$ ($\text{kg}$, kilograms)
- **Representative Material Densities:**
  - **Porous Volatile Cometary Ice / Carbonaceous Chondrite:** $\sim 1000\text{--}1500\text{ kg/m}^3$
  - **Stony Silicate Chondrite (S-Type NEOs):** $\sim 2000\text{--}2800\text{ kg/m}^3$ (Default: $2500\text{ kg/m}^3$)
  - **Denser Basaltic / Monolithic Rock:** $\sim 2800\text{--}3200\text{ kg/m}^3$
  - **Metallic Nickel-Iron (M-Type NEOs):** $\sim 3500\text{ kg/m}^3+$

### 2.4 Velocity Conversion ($v$)

Planetary encounter velocities are conventionally quoted in astronomical literature in $\text{km/s}$. Calculation of mechanical energy in SI units requires conversion to meters per second ($\text{m/s}$):

$$v_{\text{m/s}} = v_{\text{km/s}} \times 1000$$

- **Input:** $v_{\text{km/s}} \in [5, 40]\text{ km/s}$
- **Output:** $v_{\text{m/s}} \in [5000, 40000]\text{ m/s}$

### 2.5 Relativistic vs. Newtonian Kinetic Energy ($E_k$)

At typical Solar System orbital velocities ($v \le 40\text{ km/s} \approx 0.000133c$), relativistic corrections ($\gamma = \frac{1}{\sqrt{1 - v^2/c^2}} \approx 1 + 8.9 \times 10^{-9}$) contribute negligible divergence ($< 0.000001\%$). Consequently, classical Newtonian mechanics provides high scientific precision:

$$E_k = \frac{1}{2} m v^2$$

- **Units:** Joules ($\text{J} = \text{kg}\cdot\text{m}^2/\text{s}^2$)
- **Quadratic Scaling Property:** Doubling the encounter velocity ($2v$) quadruples the kinetic energy ($2^2 = 4$).

### 2.6 TNT Equivalent Energy Conversions

In planetary defense literature, impact energies are standardized against standard chemical trinitrotoluene (TNT) explosive equivalents defined by the International Union of Pure and Applied Chemistry (IUPAC):

- **1 Kiloton (kt) TNT:** $4.184 \times 10^{12}\text{ Joules}$ ($4.184\text{ Terajoules}$)
- **1 Megaton (Mt) TNT:** $4.184 \times 10^{15}\text{ Joules}$ ($4.184\text{ Petajoules}$)

$$E_{\text{kt}} = \frac{E_k}{4.184 \times 10^{12}}$$

$$E_{\text{Mt}} = \frac{E_k}{4.184 \times 10^{15}} = \frac{E_{\text{kt}}}{1000}$$

### 2.7 Lunar Distance (LD) Astronomical Unit Conversion

Close-approach miss distances are converted bidirectionally using the mean semi-major axis of the Moon's geocentric orbit:

$$1\text{ LD} = 384,400\text{ km}$$

$$\text{Distance}_{\text{LD}} = \frac{\text{Distance}_{\text{km}}}{384,400}$$

$$\text{Distance}_{\text{km}} = \text{Distance}_{\text{LD}} \times 384,400$$

---

## 3. Strict Decoupling Architecture

> [!IMPORTANT]
> **No Fabricated Impact Probabilities:**  
> In celestial mechanics, miss distance is purely geometric ($r_{\text{perigee}}$) and is decoupled from hypothetical impact kinetic energy.
>
> In the CosmoStellarAtlas simulation engine:
> 1. Adjusting the **Illustrative Miss Distance** slider alters solely the visual 2D orbital encounter trajectory and distance annotations.
> 2. Miss distance **never** modulates the calculated kinetic energy or TNT equivalent.
> 3. The engine never invents fictitious collision probabilities for safe astronomical flybys.

---

## 4. Educational Scenario Presets

To facilitate student laboratory exploration, four presets derived from historical superbolides and defense benchmarks are embedded:

| Preset Name | Target Scale | Diameter ($d$) | Velocity ($v$) | Density ($\rho$) | Kinetic Energy ($E_k$) | Historical Reference |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Small Asteroid** | Airburst | $20\text{ m}$ | $19\text{ km/s}$ | $3300\text{ kg/m}^3$ | $\sim 0.5\text{ Mt}$ ($500\text{ kt}$) | Chelyabinsk meteor (2013) |
| **Medium Asteroid** | Regional Blast | $60\text{ m}$ | $15\text{ km/s}$ | $2500\text{ kg/m}^3$ | $\sim 15.2\text{ Mt}$ | Tunguska event (1908) |
| **Large Asteroid** | Cratering | $160\text{ m}$ | $24\text{ km/s}$ | $2700\text{ kg/m}^3$ | $\sim 800\text{ Mt}$ | Dimorphos / NASA DART (2022) |
| **High-Velocity Comet** | Retrograde | $250\text{ m}$ | $38\text{ km/s}$ | $1200\text{ kg/m}^3$ | $\sim 7,100\text{ Mt}$ | Long-period Oort Cloud Comet |

---

## 5. Analytical Sensitivity Breakdown

The engine dynamically compares individual parameter variations by computing the exact energy ratio when each parameter is doubled:

$$\text{Multiplier}_{\text{Diameter}} = \frac{E(2d, v, \rho)}{E(d, v, \rho)} = 2^3 = 8.0\times$$

$$\text{Multiplier}_{\text{Velocity}} = \frac{E(d, 2v, \rho)}{E(d, v, \rho)} = 2^2 = 4.0\times$$

$$\text{Multiplier}_{\text{Density}} = \frac{E(d, v, 2\rho)}{E(d, v, \rho)} = 2^1 = 2.0\times$$

This mathematical transparency demonstrates to students that **diameter has the strongest cubic scaling effect**, followed by **velocity's quadratic scaling**, with **density providing linear variance**.

---

## 6. Numerical Boundary Constraints & Clamping

| Parameter | Minimum | Maximum | Step | Default |
| :--- | :---: | :---: | :---: | :---: |
| **Diameter ($d$)** | $10\text{ m}$ | $1000\text{ m}$ | $10\text{ m}$ | $100\text{ m}$ |
| **Velocity ($v$)** | $5\text{ km/s}$ | $40\text{ km/s}$ | $1\text{ km/s}$ | $20\text{ km/s}$ |
| **Density ($\rho$)** | $1000\text{ kg/m}^3$ | $3500\text{ kg/m}^3$ | $100\text{ kg/m}^3$ | $2500\text{ kg/m}^3$ |
| **Miss Distance** | $10,000\text{ km}$ | $5,000,000\text{ km}$ | $10,000\text{ km}$ | $384,400\text{ km}$ ($1\text{ LD}$) |

### Edge Case Handlers
- If any input is non-finite ($\text{NaN}, \pm\infty$) or $\le 0$, the math engine returns safe zero outputs:
  $$\{r: 0, V: 0, m: 0, v_{\text{m/s}}: 0, E_k: 0, E_{\text{kt}}: 0, E_{\text{Mt}}: 0\}$$
- Division-by-zero protection is applied on all normalization and sensitivity multipliers.

---

## 7. Model Limitations & Educational Disclosures

> [!NOTE]
> **Academic Scope & Hydrocode Distinction:**  
> The CosmoStellarAtlas simulation engine deliberately models **vacuum kinetic energy delivery**. It explicitly does **not** simulate:
> 1. **Atmospheric Entry Hydrodynamics:** Thermal ablation, progressive pancake fragmentation, and deceleration due to aerodynamic drag.
> 2. **Airburst Altitude Determination:** Shockwave coupling requires hydrodynamic models (e.g. CTH, ALE3D, SPH).
> 3. **Impact Cratering Mechanics:** Excavation stage, transient cavity collapse, and ejecta blanket deposition.
> 4. **Complex Gravitational Perturbations:** Three-body Earth-Moon tidal gravity and Yarkovsky thermal radiation recoil.
>
> These limitations are visibly disclosed to the user in the UI via the **Explainable Physics Engine** and **Educational Reference Panel**.
