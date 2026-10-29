---
name: CosmoStellar Atlas
colors:
  surface: '#0e1321'
  surface-dim: '#0e1321'
  surface-bright: '#343949'
  surface-container-lowest: '#080e1c'
  surface-container-low: '#161b2a'
  surface-container: '#1a1f2e'
  surface-container-high: '#242a39'
  surface-container-highest: '#2f3444'
  on-surface: '#dde2f6'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#dde2f6'
  inverse-on-surface: '#2b3040'
  outline: '#859396'
  outline-variant: '#3c494c'
  surface-tint: '#22daf3'
  primary: '#9befff'
  on-primary: '#00363e'
  primary-container: '#20d9f2'
  on-primary-container: '#005b66'
  inverse-primary: '#006875'
  secondary: '#cbbeff'
  on-secondary: '#340098'
  secondary-container: '#4b1fbe'
  on-secondary-container: '#baa9ff'
  tertiary: '#ffdcba'
  on-tertiary: '#482900'
  tertiary-container: '#ffb865'
  on-tertiary-container: '#774700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9defff'
  primary-fixed-dim: '#22daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004e59'
  secondary-fixed: '#e7deff'
  secondary-fixed-dim: '#cbbeff'
  on-secondary-fixed: '#1e0060'
  on-secondary-fixed-variant: '#4b1fbe'
  tertiary-fixed: '#ffddba'
  tertiary-fixed-dim: '#ffb867'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#0e1321'
  on-background: '#dde2f6'
  surface-variant: '#2f3444'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.015em
  label-telemetry-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.08em
  label-telemetry-sm:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.12em
  code-coords:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system targets astrophysicists, deep-space researchers, and aerospace cartographers navigating high-fidelity celestial telemetry and orbital models. The visual tone balances mission-critical instrument precision with the quiet grandeur of deep space exploration. 

The aesthetic is grounded in **Futuristic Mission-Control Glassmorphism and Precision Aerospace UI**:
- Surfaces emulate optical anti-glare heads-up displays (HUD) and mission consoles.
- Visual elements favor strict metric telemetry over decorative clutter.
- Accents radiate calibrated spectral glows (ion radiation, solar corona, deep nebula ionization) against an infinite cosmic void.
- Visual feedback reinforces absolute system accuracy, low cognitive fatigue during zero-light viewing, and rapid data extraction.

## Colors

The palette is engineered for high-contrast nighttime observatories and operational command environments:

- **Primary (`#20D9F2` - Ion Cyan):** Active telemetry, orbital vectors, active focal targets, scientific data visualizations, and operational status confirmations.
- **Secondary (`#8565FA` - Nebula Violet):** Deep space phenomena, AI/algorithmic trajectory projections, spatial coordinates, and synthetic aperture radar outputs.
- **Tertiary (`#FFB45B` - Solar Gold):** Stellar core highlights, thermal anomalies, warnings, critical alerts, and high-priority observational markers.
- **Canvas & Surface Architecture:**
  - Base Void: `#060B19` (Deep Space canvas)
  - Secondary Void: `#0A1021` (Midnight Navy for docked panels and toolbars)
  - Panel Base: `#10182B` (Panel Background with 70–85% alpha blending)
  - Surface Float: `#151F35` (Elevated Panel for modal telemetry and orbital inspector cards)
- **Borders & Dividers:** `#25334B` (Instrument seams and telemetry boundaries)
- **Text & Contrast System:**
  - Primary Telemetry: `#F5F7FF` (Stellar white, crisp legibility)
  - Secondary Readouts: `#98A7BF` (Atmospheric slate, metadata, and passive units)
  - Inactive/Muted: `#4F617D`

## Typography

The typographical pairing provides clear role division:
- **Space Grotesk** serves for structural titles, module headers, metric telemetry readouts, coordinates, and system status tags. Its mechanical terminals echo orbital telemetry monitors and flight computer hardware.
- **Inter** handles narrative descriptions, observational logs, research abstracts, and multi-line body copy, delivering high rendering fidelity across high-density displays.
- Telemetry labels must utilize uppercase rendering (`text-transform: uppercase`) paired with wide tracking (`letter-spacing: 0.08em` to `0.12em`) to mirror aerospace avionics consoles.

## Layout & Spacing

The observatory layout operates on an adaptable 12-column fluid grid system paired with strict modular HUD side-docks:
- **Desktop (1440px+):** Fixed mission navigation bar (64px collapsed / 240px expanded), 12-column dynamic canvas with `2rem` outer margin and `1.5rem` gutters. Analytical side drawers dock seamlessly at 380px fixed width over the celestial viewport.
- **Tablet / Workstation (768px - 1439px):** 8-column layout with `1.5rem` outer margins and `1rem` gutters. Collapsible sensor readouts slide into tabbed bottom sheets or overlay HUD drawers.
- **Mobile Handheld (<768px):** 4-column layout with `1rem` outer margin and `0.75rem` gutters. Mission controls condense into floating bottom instrument bars and swipeable telemetry summary cards.
- Layout elements follow strict 4px base mathematical increments (`0.25rem`), anchoring cards, metric clusters, and radar viewports to absolute pixel alignment.

## Elevation & Depth

Depth in this design system is created through translucent spatial layering, spectral edge-lit glows, and delicate structural borders rather than heavy drop shadows:

- **Level 0 (Canvas Void):** Deep Space (`#060B19`) raw canvas. Serves as the backdrop for direct WebGL starfield projections and celestial bodies.
- **Level 1 (Docked Consoles & App Bars):** Background `#0A1021` at 85% opacity with `backdrop-filter: blur(16px)` and a subtle `1px solid #25334B` border.
- **Level 2 (Observatory Panels & Cards):** Background `#10182B` with 75% opacity, `backdrop-filter: blur(20px)`, and `1px solid #25334B`. Subtle outer atmospheric glow: `box-shadow: 0 0 24px -4px rgba(32, 217, 242, 0.06)`.
- **Level 3 (Targeted Inspections & Overlays):** Background `#151F35` with 90% opacity, `backdrop-filter: blur(28px)`, bordered with `1px solid rgba(32, 217, 242, 0.3)`. Emits an energized glow: `box-shadow: 0 0 32px 0 rgba(32, 217, 242, 0.15), 0 12px 32px -8px rgba(6, 11, 25, 0.8)`.
- **Level 4 (Critical Alerts & Stellar Events):** Bordered with `1px solid rgba(255, 180, 91, 0.5)` with an amber corona glow: `box-shadow: 0 0 40px rgba(255, 180, 91, 0.2)`.

## Shapes

The design system maintains a **Soft/Industrial Precision** geometry (`roundedness: 1`):
- Standard aerospace cards, HUD tiles, and telemetry modules utilize `0.25rem` (4px) corner radii, preserving the sharp, disciplined aesthetic of flight computers.
- Floating dialogs and expanded observatory inspection windows feature `rounded-lg` (`0.5rem` / 8px).
- Specialized sensor indicators, telemetry reticles, and circular optical radar displays maintain pure circular geometry (`rounded-full`).
- Chamfered cut corners (45-degree corner notches) can be applied to key control panels to accentuate the aerospace instrumentation style.

## Components

### Buttons & Mission Triggers
- **Primary Action (Ion Engage):** Ion Cyan (`#20D9F2`) solid fill with `#060B19` bold typography (`Space Grotesk`, uppercase). Hover triggers an expanded glow: `box-shadow: 0 0 20px rgba(32, 217, 242, 0.4)`.
- **Secondary (Spectral Analysis):** Translucent Nebula Violet (`rgba(133, 101, 250, 0.15)`) background with `#8565FA` text and a `1px solid rgba(133, 101, 250, 0.4)` border. Hover transitions to `rgba(133, 101, 250, 0.3)`.
- **Ghost/HUD Toggle:** Transparent fill, `#98A7BF` secondary text, `1px solid #25334B`. On hover: border switches to `#20D9F2` and text transitions to `#F5F7FF`.

### Telemetry Badges & Status Chips
- Compact rectangular forms with `0.25rem` border radius, uppercase typography (`label-telemetry-sm`), and a 6px pulsing spectral indicator dot.
- Color mappings:
  - Nominal Orbit: Ion Cyan (`#20D9F2` dot, `rgba(32, 217, 242, 0.1)` surface)
  - Anomaly / Alert: Solar Gold (`#FFB45B` dot, `rgba(255, 180, 91, 0.1)` surface)
  - Deep Deep Space / Unknown: Nebula Violet (`#8565FA` dot, `rgba(133, 101, 250, 0.1)` surface)

### Aerospace Cards & Sensor Panels
- Constructed from `Level 2` elevation tokens (`#10182B`, 75% opacity, `backdrop-filter: blur(20px)`).
- Top panel headers incorporate monospaced coordinate stamps (`code-coords`) and 1px horizontal division lines in `#25334B`.
- Content sections leverage numerical stat pairs: large values in `Space Grotesk` (`headline-md`) stacked over muted labels in `Inter` (`body-sm`).

### Astronomical Data Charts & Vectors
- Grid lines rendered with 1px dashed or hairline `#25334B` vectors.
- Telemetry curves and orbital paths utilize `#20D9F2` (direct path) and `#8565FA` (projected/gravitational drift) with SVG linear gradients tapering to transparent.

### Inputs & Coordinate Fields
- Dark inset backgrounds (`#0A1021`) framed with `1px solid #25334B`.
- Typed input renders in `#F5F7FF` (`Space Grotesk`).
- Active focus state: border illuminates to `#20D9F2` alongside an inner optical glow (`box-shadow: inset 0 0 8px rgba(32, 217, 242, 0.2)`).

### Checkboxes, Switches & Radio Nodes
- Toggle switches feature a rectangular housing (`0.25rem` radius) with sliding square caps emitting an Ion Cyan glow when active.
- Radio nodes appear as crosshair reticles that lock on target with a centered Cyan dot upon selection.