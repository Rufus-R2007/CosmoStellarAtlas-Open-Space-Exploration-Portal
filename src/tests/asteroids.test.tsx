import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AsteroidsPage } from '../features/asteroids/AsteroidsPage';
import { AsteroidDetailModal } from '../features/asteroids/components/explorer/AsteroidDetailModal';
import { CloseApproachTimeline } from '../features/asteroids/components/encounter/CloseApproachTimeline';
import { PlanetaryDefenseWhatIfLab } from '../features/asteroids/components/whatif/PlanetaryDefenseWhatIfLab';
import { PlanetaryDefenseEducationPanel } from '../features/asteroids/components/education/PlanetaryDefenseEducationPanel';
import { spaceService } from '../services';
import { useAppStore } from '../store/useAppStore';
import { asteroidsData } from '../data';
import {
  calculateImpactRadius,
  calculateSphereVolume,
  calculateAsteroidMass,
  convertVelocityKmSToMs,
  calculateKineticEnergy,
  convertJoulesToKilotonsTNT,
  convertJoulesToMegatonsTNT,
  convertKmToLunarDistances,
  convertLunarDistancesToKm,
  calculateSimulationResult,
  generateEnergyVsDiameterCurve,
  generateEnergyVsVelocityCurve,
  generateSensitivityBreakdown,
  generateExplainableInsights,
  DEFAULT_SIMULATION_PARAMETERS,
  KM_PER_LUNAR_DISTANCE,
} from '../features/asteroids/utils/planetaryDefenseMath';

describe('Phase 5 — Asteroid Watch & Planetary Defense Simulation Test Suite', () => {
  beforeEach(() => {
    spaceService.setSimulatedError(false);
    useAppStore.setState({
      selectedAsteroidId: 'sim-2026-001',
      inspectingAsteroidId: null,
      whatIfParameters: { ...DEFAULT_SIMULATION_PARAMETERS },
    });
  });

  // 1. Data Provider Inventory Verification
  it('Requirement 1: asteroids dataset loads 50 records with curated benchmarks and synthetic encounters', async () => {
    const asteroids = await spaceService.getAsteroids();
    expect(asteroids.length).toBe(50);

    const curated = asteroids.filter((a) => a.source === 'curated');
    const synthetic = asteroids.filter((a) => a.source === 'synthetic');

    expect(curated.length).toBe(8);
    expect(synthetic.length).toBe(42);

    // Verify key curated benchmark objects
    const apophis = asteroids.find((a) => a.name.includes('Apophis'));
    expect(apophis).toBeDefined();
    expect(apophis?.name).toBe('99942 Apophis');
    expect(apophis?.orbitClass).toBe('Aten');

    const didymos = asteroids.find((a) => a.name.includes('Didymos'));
    expect(didymos).toBeDefined();
    expect(didymos?.orbitClass).toBe('Apollo');

    // Verify synthetic objects have proper designation formatting
    synthetic.forEach((item) => {
      expect(item.id.toLowerCase()).toMatch(/^sim-2026-\d{3}$/);
      expect(item.dataStatus).toBe('Offline Simulation');
    });
  });

  // 2. Multi-facet Search & Filter Query Logic
  it('Requirement 2: search query filters by asteroid designation and common name', async () => {
    const apophisResults = await spaceService.getAsteroids({ query: 'Apophis' });
    expect(apophisResults.length).toBe(1);
    expect(apophisResults[0].id).toBe('99942-apophis');

    const syntheticResults = await spaceService.getAsteroids({ query: 'SIM-2026-010' });
    expect(syntheticResults.length).toBe(1);
    expect(syntheticResults[0].id).toBe('sim-2026-010');
  });

  it('Requirement 3: orbit class filtering returns matching dynamical taxonomy', async () => {
    const apollos = await spaceService.getAsteroids({ orbitClass: 'Apollo' });
    expect(apollos.length).toBeGreaterThan(0);
    apollos.forEach((a) => expect(a.orbitClass.toLowerCase()).toContain('apollo'));

    const atens = await spaceService.getAsteroids({ orbitClass: 'Aten' });
    expect(atens.length).toBeGreaterThan(0);
    atens.forEach((a) => expect(a.orbitClass.toLowerCase()).toContain('aten'));

    const amors = await spaceService.getAsteroids({ orbitClass: 'Amor' });
    expect(amors.length).toBeGreaterThan(0);
    amors.forEach((a) => expect(a.orbitClass.toLowerCase()).toContain('amor'));

    const atiras = await spaceService.getAsteroids({ orbitClass: 'Atira' });
    expect(atiras.length).toBeGreaterThan(0);
    atiras.forEach((a) => expect(a.orbitClass.toLowerCase()).toContain('atira'));
  });

  it('Requirement 4: diameter and velocity range filters filter asteroid candidates accurately', async () => {
    const smallAsteroids = await spaceService.getAsteroids({ maxDiameterM: 50 });
    expect(smallAsteroids.length).toBeGreaterThan(0);
    smallAsteroids.forEach((a) => {
      const diameter = a.estimatedDiameterMeanM ?? a.estimatedDiameterMeters;
      expect(diameter).toBeLessThanOrEqual(50);
    });

    const highVelocityAsteroids = await spaceService.getAsteroids({ minVelocityKmS: 25 });
    expect(highVelocityAsteroids.length).toBeGreaterThan(0);
    highVelocityAsteroids.forEach((a) => {
      expect(a.relativeVelocityKmS).toBeGreaterThanOrEqual(25);
    });
  });

  // 5. Scientific Math Engine Unit Tests
  it('Requirement 5: calculateImpactRadius divides diameter by 2 and handles edge conditions safely', () => {
    expect(calculateImpactRadius(100)).toBe(50);
    expect(calculateImpactRadius(20)).toBe(10);
    expect(calculateImpactRadius(0)).toBe(0);
    expect(calculateImpactRadius(-50)).toBe(0);
    expect(calculateImpactRadius(NaN)).toBe(0);
    expect(calculateImpactRadius(Infinity)).toBe(0);
  });

  it('Requirement 6: calculateSphereVolume implements (4/3)*pi*r^3 with high precision', () => {
    const radius = 10;
    const expectedVolume = (4 / 3) * Math.PI * Math.pow(10, 3);
    expect(calculateSphereVolume(radius)).toBeCloseTo(expectedVolume, 4);

    expect(calculateSphereVolume(0)).toBe(0);
    expect(calculateSphereVolume(-10)).toBe(0);
    expect(calculateSphereVolume(NaN)).toBe(0);
  });

  it('Requirement 7: calculateAsteroidMass implements m = rho * V accurately', () => {
    const volume = 1000;
    const density = 2500;
    expect(calculateAsteroidMass(volume, density)).toBe(2500000);

    expect(calculateAsteroidMass(0, density)).toBe(0);
    expect(calculateAsteroidMass(volume, 0)).toBe(0);
    expect(calculateAsteroidMass(-500, density)).toBe(0);
    expect(calculateAsteroidMass(volume, -2000)).toBe(0);
  });

  it('Requirement 8: convertVelocityKmSToMs multiplies by 1000 correctly', () => {
    expect(convertVelocityKmSToMs(20)).toBe(20000);
    expect(convertVelocityKmSToMs(12.5)).toBe(12500);
    expect(convertVelocityKmSToMs(0)).toBe(0);
    expect(convertVelocityKmSToMs(-5)).toBe(0);
  });

  it('Requirement 9: calculateKineticEnergy implements (1/2)*m*v^2 in Joules', () => {
    const massKg = 2e6; // 2,000,000 kg
    const velocityKmS = 20; // 20,000 m/s
    // E = 0.5 * 2e6 * (20,000)^2 = 0.5 * 2e6 * 4e8 = 4e14 Joules
    expect(calculateKineticEnergy(massKg, velocityKmS)).toBe(4e14);

    expect(calculateKineticEnergy(0, velocityKmS)).toBe(0);
    expect(calculateKineticEnergy(massKg, 0)).toBe(0);
    expect(calculateKineticEnergy(-100, velocityKmS)).toBe(0);
  });

  it('Requirement 10: TNT energy conversion converts Joules to Kilotons and Megatons according to standard physics constants', () => {
    const oneKtJoules = 4.184e12;
    const oneMtJoules = 4.184e15;

    expect(convertJoulesToKilotonsTNT(oneKtJoules)).toBeCloseTo(1, 6);
    expect(convertJoulesToMegatonsTNT(oneMtJoules)).toBeCloseTo(1, 6);

    expect(convertJoulesToKilotonsTNT(0)).toBe(0);
    expect(convertJoulesToMegatonsTNT(0)).toBe(0);
  });

  // 11. Quadratic Scaling: Doubling Velocity Quadruples Kinetic Energy
  it('Requirement 11: doubling velocity quadruples kinetic energy (quadratic E proportional to v^2)', () => {
    const massKg = 1e6;
    const velocity1 = 10;
    const velocity2 = 20; // Doubled

    const energy1 = calculateKineticEnergy(massKg, velocity1);
    const energy2 = calculateKineticEnergy(massKg, velocity2);

    expect(energy2 / energy1).toBeCloseTo(4.0, 6);
  });

  // 12. Cubic Scaling: Doubling Diameter Multiplies Mass and Energy by 8x
  it('Requirement 12: doubling diameter multiplies volume, mass, and kinetic energy by eightfold (2^3 = 8)', () => {
    const density = 2500;
    const velocity = 20;

    const res1 = calculateSimulationResult({
      diameterM: 50,
      velocityKmS: velocity,
      densityKgM3: density,
      illustrativeMissDistanceKm: 384400,
    });

    const res2 = calculateSimulationResult({
      diameterM: 100, // Doubled
      velocityKmS: velocity,
      densityKgM3: density,
      illustrativeMissDistanceKm: 384400,
    });

    expect(res2.volumeM3 / res1.volumeM3).toBeCloseTo(8.0, 4);
    expect(res2.massKg / res1.massKg).toBeCloseTo(8.0, 4);
    expect(res2.kineticEnergyJ / res1.kineticEnergyJ).toBeCloseTo(8.0, 4);
    expect(res2.kineticEnergyMegatons / res1.kineticEnergyMegatons).toBeCloseTo(8.0, 4);
  });

  // 13. Decoupling Verification: Miss Distance Never Affects Energy
  it('Requirement 13: illustrative miss distance is strictly decoupled from kinetic energy calculations', () => {
    const resA = calculateSimulationResult({
      diameterM: 100,
      velocityKmS: 20,
      densityKgM3: 2500,
      illustrativeMissDistanceKm: 50000, // Very close
    });

    const resB = calculateSimulationResult({
      diameterM: 100,
      velocityKmS: 20,
      densityKgM3: 2500,
      illustrativeMissDistanceKm: 5000000, // Millions of km away
    });

    expect(resA.kineticEnergyJ).toBe(resB.kineticEnergyJ);
    expect(resA.kineticEnergyMegatons).toBe(resB.kineticEnergyMegatons);
    expect(resA.massKg).toBe(resB.massKg);
  });

  // 14. Lunar Distance Conversion Unit Tests
  it('Requirement 14: convertKmToLunarDistances and convertLunarDistancesToKm handle bidirectional transformations accurately', () => {
    const oneLD = KM_PER_LUNAR_DISTANCE; // 384,400 km
    expect(convertKmToLunarDistances(oneLD)).toBeCloseTo(1.0, 6);
    expect(convertKmToLunarDistances(oneLD * 2.5)).toBeCloseTo(2.5, 6);
    expect(convertLunarDistancesToKm(2.0)).toBe(oneLD * 2);

    expect(convertKmToLunarDistances(0)).toBe(0);
    expect(convertKmToLunarDistances(-100)).toBe(0);
  });

  // 15. Curve Generation & Sensitivity Tests
  it('Requirement 15: generateEnergyVsDiameterCurve and generateEnergyVsVelocityCurve produce valid monotonic datasets', () => {
    const diameterCurve = generateEnergyVsDiameterCurve(20, 2500);
    expect(diameterCurve.length).toBeGreaterThan(10);
    expect(diameterCurve[0].diameterM).toBe(10);
    // Monotonically increasing energy with diameter
    for (let i = 1; i < diameterCurve.length; i++) {
      expect(diameterCurve[i].energyMegatons).toBeGreaterThan(diameterCurve[i - 1].energyMegatons);
    }

    const velocityCurve = generateEnergyVsVelocityCurve(100, 2500);
    expect(velocityCurve.length).toBeGreaterThan(10);
    expect(velocityCurve[0].velocityKmS).toBe(5);
    // Monotonically increasing energy with velocity
    for (let i = 1; i < velocityCurve.length; i++) {
      expect(velocityCurve[i].energyMegatons).toBeGreaterThan(velocityCurve[i - 1].energyMegatons);
    }
  });

  it('Requirement 16: generateSensitivityBreakdown produces comparative variation statistics', () => {
    const sensitivity = generateSensitivityBreakdown(DEFAULT_SIMULATION_PARAMETERS);
    expect(sensitivity.length).toBe(3);

    const diameterSens = sensitivity.find((s) => s.parameter.includes('Diameter'));
    expect(diameterSens).toBeDefined();
    expect(diameterSens?.energyMultiplier).toBeCloseTo(8.0, 2);

    const velocitySens = sensitivity.find((s) => s.parameter.includes('Velocity'));
    expect(velocitySens).toBeDefined();
    expect(velocitySens?.energyMultiplier).toBeCloseTo(4.0, 2);

    const densitySens = sensitivity.find((s) => s.parameter.includes('Density'));
    expect(densitySens).toBeDefined();
    expect(densitySens?.energyMultiplier).toBeCloseTo(2.0, 2);
  });

  it('Requirement 17: generateExplainableInsights produces mathematical reasoning and educational category entries', () => {
    const insights = generateExplainableInsights(
      DEFAULT_SIMULATION_PARAMETERS,
      calculateSimulationResult(DEFAULT_SIMULATION_PARAMETERS)
    );
    expect(insights.length).toBe(5);

    const categories = insights.map((ins) => ins.category);
    expect(categories).toContain('size');
    expect(categories).toContain('velocity');
    expect(categories).toContain('density');
    expect(categories).toContain('geometry');
    expect(categories).toContain('limitations');
  });

  // 18. AsteroidsPage Component Lifecycle & Rendering
  it('Requirement 18: AsteroidsPage renders the Hero, Radar, Chronology, Catalog, What-If Lab, and Education sections', async () => {
    render(
      <MemoryRouter initialEntries={['/asteroids']}>
        <AsteroidsPage />
      </MemoryRouter>
    );

    // Initial loading should resolve
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Asteroid Watch/i })).toBeInTheDocument();
    });

    // Verify sections present
    expect(screen.getByText(/Orbital Encounter Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/Close-Approach Chronological Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive Asteroid Explorer/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Planetary Defense What-If Lab/i })).toBeInTheDocument();
    expect(screen.getByText(/Planetary Defense & Near-Earth Object Survey/i)).toBeInTheDocument();
  });

  // 19. Asteroid Selection via Active Encounter Selector Updates Store
  it('Requirement 19: selecting an asteroid updates global store state', async () => {
    render(
      <MemoryRouter initialEntries={['/asteroids']}>
        <AsteroidsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Asteroid Watch/i })).toBeInTheDocument();
    });

    // Select Apophis via active encounter dropdown
    const targetSelect = screen.getByRole('combobox', { name: /Active Encounter Target:/i });
    fireEvent.change(targetSelect, { target: { value: '99942-apophis' } });

    expect(useAppStore.getState().selectedAsteroidId).toBe('99942-apophis');
  });

  // 20. Asteroid Detail Modal Render and Dismissal
  it('Requirement 20: AsteroidDetailModal displays detailed asteroid data and dismisses on close button', () => {
    const testAsteroid = asteroidsData[0]; // Apophis
    const onClose = vi.fn();
    const onLoadIntoWhatIfLab = vi.fn();

    render(
      <AsteroidDetailModal
        asteroid={testAsteroid}
        onClose={onClose}
        onLoadIntoWhatIfLab={onLoadIntoWhatIfLab}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /99942 Apophis/i })).toBeInTheDocument();
    expect(screen.getByText(/Encounter Scenario Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Close-Approach Information/i)).toBeInTheDocument();

    // Click close button
    const closeBtn = screen.getByRole('button', { name: /Close asteroid details/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  // 21. Close Approach Timeline Navigation
  it('Requirement 21: CloseApproachTimeline renders encounters and stepper advances correctly', () => {
    const onSelectAsteroid = vi.fn();
    const onOpenDetailModal = vi.fn();
    const onLoadIntoWhatIfLab = vi.fn();

    const chronological = [...asteroidsData].sort((a, b) =>
      a.closeApproachDate.localeCompare(b.closeApproachDate)
    );

    render(
      <CloseApproachTimeline
        asteroids={asteroidsData}
        selectedAsteroidId={chronological[0].id}
        onSelectAsteroid={onSelectAsteroid}
        onOpenDetailModal={onOpenDetailModal}
        onLoadIntoWhatIfLab={onLoadIntoWhatIfLab}
      />
    );

    expect(screen.getByText(/Close-Approach Chronological Timeline/i)).toBeInTheDocument();

    // Click next button
    const nextBtn = screen.getByRole('button', { name: /Next Encounter/i });
    fireEvent.click(nextBtn);
    expect(onSelectAsteroid).toHaveBeenCalledWith(chronological[1].id);
  });

  // 22. What-If Lab Preset Selection
  it('Requirement 22: What-If Lab educational scenario presets update simulation inputs', () => {
    const onUpdateParameters = vi.fn();
    const onResetParameters = vi.fn();

    render(
      <PlanetaryDefenseWhatIfLab
        parameters={DEFAULT_SIMULATION_PARAMETERS}
        onUpdateParameters={onUpdateParameters}
        onResetParameters={onResetParameters}
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: /Planetary Defense What-If Lab/i })).toBeInTheDocument();

    // Select Chelyabinsk preset
    const chelyabinskBtn = screen.getByRole('button', {
      name: /Small Asteroid/i,
    });
    fireEvent.click(chelyabinskBtn);

    expect(onUpdateParameters).toHaveBeenCalledWith(
      expect.objectContaining({
        diameterM: 20,
        velocityKmS: 19,
        densityKgM3: 3300,
      })
    );
  });

  // 23. What-If Lab Reset Button
  it('Requirement 23: What-If Lab reset button restores default simulation parameters', () => {
    const onUpdateParameters = vi.fn();
    const onResetParameters = vi.fn();

    render(
      <PlanetaryDefenseWhatIfLab
        parameters={{
          diameterM: 450,
          velocityKmS: 32,
          densityKgM3: 3000,
          illustrativeMissDistanceKm: 100000,
        }}
        onUpdateParameters={onUpdateParameters}
        onResetParameters={onResetParameters}
      />
    );

    const resetBtn = screen.getByRole('button', { name: /Reset Simulation/i });
    fireEvent.click(resetBtn);

    expect(onResetParameters).toHaveBeenCalled();
  });

  // 24. Education Panel Content Rendering
  it('Requirement 24: PlanetaryDefenseEducationPanel renders NEO taxonomy and mitigation strategies', () => {
    render(<PlanetaryDefenseEducationPanel />);

    expect(screen.getByText(/Global NEO Survey & Detection Array/i)).toBeInTheDocument();
    expect(screen.getByText(/Dynamic Orbit Taxonomy/i)).toBeInTheDocument();
    expect(screen.getByText(/Planetary Defense Mitigation Architecture/i)).toBeInTheDocument();

    // Verify technique tabs
    expect(screen.getAllByText(/Kinetic Impactor/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Gravity Tractor/i)).toBeInTheDocument();
    expect(screen.getByText(/Nuclear Stand-Off Detonation/i)).toBeInTheDocument();
  });

  // 25. Error Handling & Retry Mechanism
  it('Requirement 25: AsteroidsPage displays graceful error message and retry button when telemetry fails', async () => {
    spaceService.setSimulatedError(true);

    render(
      <MemoryRouter initialEntries={['/asteroids']}>
        <AsteroidsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ASTEROID RADAR TELEMETRY OFFLINE/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /RETRY SENSOR TELEMETRY/i })).toBeInTheDocument();

    // Disable simulated error and click retry
    spaceService.setSimulatedError(false);
    fireEvent.click(screen.getByRole('button', { name: /RETRY SENSOR TELEMETRY/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Asteroid Watch/i })).toBeInTheDocument();
    });
  });

  // 26. Safe Clamping on Zero / Negative Parameter Inputs
  it('Requirement 26: calculateSimulationResult safely clamps zero and negative values without throwing', () => {
    const zeroResult = calculateSimulationResult({
      diameterM: 0,
      velocityKmS: 0,
      densityKgM3: 0,
      illustrativeMissDistanceKm: 0,
    });

    expect(zeroResult.radiusM).toBe(0);
    expect(zeroResult.volumeM3).toBe(0);
    expect(zeroResult.massKg).toBe(0);
    expect(zeroResult.kineticEnergyJ).toBe(0);
    expect(zeroResult.kineticEnergyMegatons).toBe(0);

    const negativeResult = calculateSimulationResult({
      diameterM: -100,
      velocityKmS: -20,
      densityKgM3: -2500,
      illustrativeMissDistanceKm: -1000,
    });

    expect(negativeResult.radiusM).toBe(0);
    expect(negativeResult.kineticEnergyJ).toBe(0);
  });
});
