import { describe, it, expect, beforeEach } from 'vitest';
import { MockSpaceDataProvider } from '../services/MockSpaceDataProvider';
import { planetsData, missionsData, roversData, asteroidsData } from '../data';

describe('MockSpaceDataProvider (Requirement 1, 2, 3)', () => {
  let provider: MockSpaceDataProvider;

  beforeEach(() => {
    provider = new MockSpaceDataProvider(0);
  });

  it('Requirement 1: returns valid planet data with correct count and attributes', async () => {
    const planets = await provider.getPlanets();
    expect(planets).toHaveLength(8);
    expect(planets[0].name).toBe('Mercury');
    expect(planets[2].name).toBe('Earth');
    expect(planets[3].name).toBe('Mars');

    // Test essential schema attributes
    const earth = planets.find((p) => p.id === 'earth');
    expect(earth).toBeDefined();
    expect(earth?.diameterKm).toBe(12742);
    expect(earth?.distanceFromSunAU).toBe(1.0);
    expect(earth?.moonsCount).toBe(1);
    expect(earth?.source).toBe('curated');
  });

  it('Requirement 1 (lookup): fetches single planet by id correctly and safely returns null for unknown', async () => {
    const mars = await provider.getPlanetById('mars');
    expect(mars).not.toBeNull();
    expect(mars?.name).toBe('Mars');

    const unknown = await provider.getPlanetById('non-existent-planet');
    expect(unknown).toBeNull();
  });

  it('Requirement 2: mission filtering works correctly by agency, destination, and year', async () => {
    // Filter by agency
    const nasaMissions = await provider.getMissions({ agency: 'NASA' });
    expect(nasaMissions.length).toBeGreaterThan(0);
    nasaMissions.forEach((m) => {
      expect(m.agency).toContain('NASA');
    });

    // Filter by destination planet
    const marsMissions = await provider.getMissions({ destinationPlanetId: 'mars' });
    expect(marsMissions.length).toBeGreaterThanOrEqual(3);
    marsMissions.forEach((m) => {
      expect(m.destinationPlanetId).toBe('mars');
    });

    // Filter by year
    const missions1969 = await provider.getMissions({ year: 1969 });
    expect(missions1969.some((m) => m.id === 'apollo-11')).toBe(true);

    // Filter by year range
    const modernMissions = await provider.getMissions({ minYear: 2020 });
    expect(modernMissions.length).toBeGreaterThan(0);
    modernMissions.forEach((m) => {
      expect(m.launchYear).toBeGreaterThanOrEqual(2020);
    });
  });

  it('Requirement 3: dashboard statistics match exact dataset counts', async () => {
    const stats = await provider.getObservatoryStats();

    expect(stats.totalPlanets).toBe(planetsData.length);
    expect(stats.totalMissions).toBe(missionsData.length);
    expect(stats.totalRovers).toBe(roversData.length);
    expect(stats.totalAsteroids).toBe(asteroidsData.length);

    const expectedActive = missionsData.filter((m) => m.status === 'Active').length;
    expect(stats.activeMissions).toBe(expectedActive);

    const expectedSols = roversData.reduce((acc, r) => acc + r.totalSols, 0);
    expect(stats.totalSurfaceSols).toBe(expectedSols);
  });

  it('simulates error correctly when error simulation is enabled', async () => {
    provider.setSimulatedError(true);
    await expect(provider.getPlanets()).rejects.toThrow('SIMULATED_PROVIDER_ERROR');
    provider.setSimulatedError(false);
    const planets = await provider.getPlanets();
    expect(planets.length).toBe(8);
  });
});

