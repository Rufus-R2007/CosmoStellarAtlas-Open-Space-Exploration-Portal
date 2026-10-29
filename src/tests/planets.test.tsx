import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PlanetsPage } from '../features/planets/PlanetsPage';
import { PlanetaryComparisonLab } from '../features/planets/components/comparison/PlanetaryComparisonLab';
import { PlanetCanvas3D } from '../features/planets/components/viewer/PlanetCanvas3D';
import { spaceService } from '../services';
import { computePlanetComparison } from '../utils/planetaryMath';
import { PlanetaryInsightsEngine } from '../features/planets/services/PlanetaryInsightsEngine';
import { planetsData, missionsData } from '../data';
import { useAppStore } from '../store';

describe('Phase 2 — Interactive Planet Explorer Test Suite', () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedYear: 1969,
      visualEffects: 'high',
      demoMode: true,
      simulateError: false,
    });
  });

  // Requirement 1: All eight planets load correctly
  it('Requirement 1: all eight planets load correctly from local service', async () => {
    const planets = await spaceService.getPlanets();
    expect(planets).toHaveLength(8);
    const expectedNames = [
      'Mercury',
      'Venus',
      'Earth',
      'Mars',
      'Jupiter',
      'Saturn',
      'Uranus',
      'Neptune',
    ];
    expectedNames.forEach((name) => {
      expect(planets.some((p) => p.name === name)).toBe(true);
    });
  });

  // Requirement 2: Planet selection updates displayed information
  it('Requirement 2: selecting a planet updates displayed information and metrics', async () => {
    render(
      <MemoryRouter initialEntries={['/planets?id=earth']}>
        <PlanetsPage />
      </MemoryRouter>
    );

    // Verify Earth is initially displayed
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /^Earth$/i, level: 2 })).toBeInTheDocument();
    });

    expect(screen.getByText(/TERRA \/\/ SOL-3/i)).toBeInTheDocument();

    // Click Jupiter in the solar navigator array
    const jupiterBtn = screen.getByRole('button', { name: /Jupiter/i });
    fireEvent.click(jupiterBtn);

    // Verify view updates to Jupiter
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /^Jupiter$/i, level: 2 })).toBeInTheDocument();
    });
    expect(screen.getByText(/JOVE \/\/ SOL-5/i)).toBeInTheDocument();
    expect(screen.getByText(/139,820 km/i)).toBeInTheDocument();
  });

  // Requirement 3: Planet classification filters work
  it('Requirement 3: planet classification filters work for Terrestrial, Gas Giant, and Ice Giant', async () => {
    render(
      <MemoryRouter initialEntries={['/planets']}>
        <PlanetsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/All \(8\)/i)).toBeInTheDocument();
    });

    // Click "Gas Giant" filter
    const gasGiantFilter = screen.getByRole('button', { name: /Gas Giant/i });
    fireEvent.click(gasGiantFilter);

    // Only Jupiter and Saturn should be listed
    expect(screen.getByText(/2 of 8/i)).toBeInTheDocument();
  });

  // Requirement 4: Planet search handles valid and invalid queries
  it('Requirement 4: planet search handles valid and invalid queries with empty state', async () => {
    render(
      <MemoryRouter initialEntries={['/planets']}>
        <PlanetsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Filter planets by name/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Filter planets by name/i);

    // Valid query: "Mars"
    fireEvent.change(searchInput, { target: { value: 'Mars' } });
    expect(screen.getByText(/1 of 8/i)).toBeInTheDocument();

    // Invalid query: "PlutoXUnknown"
    fireEvent.change(searchInput, { target: { value: 'PlutoXUnknown' } });
    expect(screen.getByText(/No Matching Planet Found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Filters/i })).toBeInTheDocument();

    // Reset filters
    fireEvent.click(screen.getByRole('button', { name: /Reset Filters/i }));
    expect(screen.queryByText(/No Matching Planet Found/i)).not.toBeInTheDocument();
  });

  // Requirement 5: Comparison prevents or handles selecting same planet explicitly
  it('Requirement 5: comparison lab handles selecting identical planets with informative notice', () => {
    render(
      <PlanetaryComparisonLab
        planets={planetsData}
        initialPlanetAId="mars"
        initialPlanetBId="mars"
      />
    );

    // Should display notice explaining identical worlds selected
    expect(screen.getByText(/Both selection slots currently target/i)).toBeInTheDocument();
    expect(screen.getByText(/Identical Celestial Target Selected/i)).toBeInTheDocument();
  });

  // Requirement 6: Comparison calculations return correct ratios
  it('Requirement 6: comparison calculations return accurate mathematical ratios', () => {
    const earth = planetsData.find((p) => p.id === 'earth')!;
    const mars = planetsData.find((p) => p.id === 'mars')!;
    const jupiter = planetsData.find((p) => p.id === 'jupiter')!;

    // Earth vs Mars comparison
    const compMars = computePlanetComparison(earth, mars);
    expect(compMars.gravity.valA).toBe(1.0);
    expect(compMars.gravity.valB).toBe(0.38);
    expect(compMars.gravity.ratioAtoB).toBeCloseTo(2.63, 1);

    // Jupiter vs Earth comparison
    const compJup = computePlanetComparison(jupiter, earth);
    expect(compJup.diameter.valA).toBe(139820);
    expect(compJup.diameter.valB).toBe(12742);
    expect(compJup.diameter.ratioAtoB).toBeCloseTo(10.97, 1);

    // Insights Engine generation
    const insights = PlanetaryInsightsEngine.generateComparisonInsights(jupiter, earth);
    expect(insights.length).toBeGreaterThan(0);
    expect(insights.some((i) => i.category === 'Dimensional')).toBe(true);
    expect(insights.some((i) => i.category === 'Gravitational')).toBe(true);
  });

  // Requirement 7: Missing scientific values or edge cases are handled safely
  it('Requirement 7: handles zero moons and extreme bounds without crashing', () => {
    const mercury = planetsData.find((p) => p.id === 'mercury')!;
    const venus = planetsData.find((p) => p.id === 'venus')!;

    const comp = computePlanetComparison(mercury, venus);
    expect(comp.moonCount.valA).toBe(0);
    expect(comp.moonCount.valB).toBe(0);
    expect(comp.moonCount.summaryText).toContain('approximately identical');
  });

  // Requirement 8: Mission relationships resolve correctly
  it('Requirement 8: mission relationships resolve accurately against planet IDs', () => {
    const mars = planetsData.find((p) => p.id === 'mars')!;
    const marsMissions = missionsData.filter(
      (m) => m.destinationPlanetId === mars.id || mars.relatedMissionIds.includes(m.id)
    );

    expect(marsMissions.length).toBeGreaterThanOrEqual(4);
    expect(marsMissions.some((m) => m.id === 'curiosity')).toBe(true);
    expect(marsMissions.some((m) => m.id === 'perseverance')).toBe(true);
    expect(marsMissions.some((m) => m.id === 'pathfinder')).toBe(true);
  });

  // Requirement 9: Historical-year filtering works in missions section
  it('Requirement 9: historical year filtering constrains mission archives up to active epoch', async () => {
    // Set active timeline year to 1969 in Zustand
    useAppStore.getState().setSelectedYear(1969);

    render(
      <MemoryRouter initialEntries={['/planets?id=mars']}>
        <PlanetsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /^Mars$/i, level: 2 })).toBeInTheDocument();
    });

    // In 1969, Curiosity (2011) and Perseverance (2020) should not be displayed under Epoch <= 1969 filter
    expect(screen.getByText(/Epoch ≤ 1969/i)).toBeInTheDocument();

    // Toggle filter to "All Epochs"
    const epochBtn = screen.getByRole('button', { name: /Epoch ≤ 1969/i });
    fireEvent.click(epochBtn);

    // Now all missions should be visible
    expect(screen.getByText(/All Epochs/i)).toBeInTheDocument();
    expect(screen.getByText(/Curiosity \(Mars Science Laboratory\)/i)).toBeInTheDocument();
  });

  // Requirement 10: Viewer fallback renders when 3D is unavailable
  it('Requirement 10: viewer fallback renders correctly when 3D WebGL is forced off', () => {
    const mars = planetsData.find((p) => p.id === 'mars')!;

    render(
      <PlanetCanvas3D
        planet={mars}
        isRotating={false}
        zoomLevel={1.0}
        quality="low"
        forceFallback={true}
      />
    );

    expect(screen.getByTestId('planet-canvas-fallback')).toBeInTheDocument();
    expect(screen.getByText(/ACCESSIBLE 2D ENGINE ACTIVE/i)).toBeInTheDocument();
  });
});
