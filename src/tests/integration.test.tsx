import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useVaultStore } from '../store/useVaultStore';
import { spaceService } from '../services/MockSpaceDataProvider';
import { calculateSimulationResult } from '../features/asteroids/utils/planetaryDefenseMath';
import { PlanetInfoCenter } from '../features/planets/components/info/PlanetInfoCenter';
import { ExplorerPassportSection } from '../features/vault/components/ExplorerPassportSection';
import { computeExplorerRank } from '../services/achievementDefinitions';

describe('Phase 8 — System Integration Scenarios Test Suite', () => {
  beforeEach(() => {
    // Reset stores and localStorage before each test
    localStorage.clear();
    useAppStore.setState({
      selectedPlanetId: 'mars',
      selectedYear: 2026,
      visualEffects: 'high',
      demoMode: false,
    });
    useVaultStore.getState().resetVault();
  });

  it('Integration Scenario 1: Dashboard -> Planet Explorer state synchronization', async () => {
    // Setting selectedPlanetId from dashboard card
    useAppStore.getState().setSelectedPlanetId('jupiter');
    expect(useAppStore.getState().selectedPlanetId).toBe('jupiter');

    const planet = await spaceService.getPlanetById('jupiter');
    expect(planet).toBeDefined();
    expect(planet?.name).toBe('Jupiter');
    expect(planet?.diameterKm).toBe(139820);
  });

  it('Integration Scenario 2: Planet Explorer -> Related Mission linkage', async () => {
    const mars = await spaceService.getPlanetById('mars');
    expect(mars).toBeDefined();
    expect(mars?.relatedMissionIds).toContain('perseverance');

    const relatedMission = await spaceService.getMissionById('perseverance');
    expect(relatedMission).toBeDefined();
    expect(relatedMission?.destinationPlanetId).toBe('mars');
    expect(relatedMission?.name).toContain('Perseverance');
  });

  it('Integration Scenario 3: Cosmic Time Machine -> Mission Control temporal filtering', async () => {
    // Filter missions up to year 1969 (Apollo era)
    useAppStore.getState().setSelectedYear(1969);
    const activeYear = useAppStore.getState().selectedYear;
    expect(activeYear).toBe(1969);

    const allMissions = await spaceService.getMissions();
    const filteredMissions = allMissions.filter((m) => m.launchYear <= activeYear);

    // In 1969 or earlier, Sputnik 1 (1957) and Apollo 11 (1969) exist, but Perseverance (2020) does not
    const ids = filteredMissions.map((m) => m.id);
    expect(ids).toContain('sputnik-1');
    expect(ids).toContain('apollo-11');
    expect(ids).not.toContain('perseverance');
    expect(ids).not.toContain('jwst');
  });

  it('Integration Scenario 4: Mission Control -> Mission Replay state transitions', async () => {
    const apollo = await spaceService.getMissionById('apollo-11');
    expect(apollo).toBeDefined();
    expect(apollo?.milestones.length).toBeGreaterThan(0);

    const firstMilestone = apollo!.milestones[0];
    expect(firstMilestone.title).toBeDefined();
    expect(firstMilestone.replaySceneType).toBe('launchpad');

    const landingMilestone = apollo!.milestones.find((m) => m.replaySceneType === 'surface_descent');
    expect(landingMilestone).toBeDefined();
  });

  it('Integration Scenario 5: Rover Explorer -> Related Mission cross-module linkage', async () => {
    const rover = await spaceService.getRoverById('perseverance');
    expect(rover).toBeDefined();
    expect(rover?.name).toBe('Perseverance');

    // Associated mission check
    const mission = await spaceService.getMissionById(rover!.missionId || 'perseverance');
    expect(mission).toBeDefined();
    expect(mission?.id).toBe('perseverance');
    expect(mission?.destinationPlanetId).toBe('mars');
  });

  it('Integration Scenario 6: Asteroid Watch -> What-If Lab parameter transfer', async () => {
    const apophis = await spaceService.getAsteroidById('99942-apophis');
    expect(apophis).toBeDefined();
    expect(apophis?.estimatedDiameterMeters).toBe(370);
    expect(apophis?.relativeVelocityKmS).toBe(7.43);

    // Transfer Apophis parameters into What-If simulation engine
    const results = calculateSimulationResult({
      diameterM: apophis!.estimatedDiameterMeters,
      velocityKmS: apophis!.relativeVelocityKmS,
      densityKgM3: 2600,
      illustrativeMissDistanceKm: apophis!.missDistanceKm,
    });

    expect(results.kineticEnergyMegatons).toBeGreaterThan(0);
    expect(results.radiusM).toBe(185);
    expect(results.massKg).toBeGreaterThan(1e10);
  });

  it('Integration Scenario 7: Global Search -> Entity Detail resolution', async () => {
    const searchResults = await spaceService.search('Perseverance');
    expect(searchResults.rovers.length).toBeGreaterThan(0);

    const match = searchResults.rovers.find((r) => r.id === 'perseverance');
    expect(match).toBeDefined();
    expect(match?.name).toBe('Perseverance');
  });

  it('Integration Scenario 8: Space Intelligence -> Related Module dispatch', async () => {
    const briefings = await spaceService.getBriefings();
    expect(briefings.length).toBeGreaterThan(0);

    const marsBriefing = briefings.find((b) => b.title.includes('Perseverance') || b.category === 'Astrobiology');
    expect(marsBriefing).toBeDefined();
    expect(marsBriefing?.category).toBe('Astrobiology');
  });

  it('Integration Scenario 9: Entity Detail -> Space Vault star bookmarking', async () => {
    const mars = await spaceService.getPlanetById('mars');
    expect(mars).toBeDefined();

    render(
      <MemoryRouter>
        <PlanetInfoCenter planet={mars!} />
      </MemoryRouter>
    );

    const bookmarkBtn = screen.getByTitle(/Bookmark in Space Vault/i);
    expect(bookmarkBtn).toBeInTheDocument();

    // Toggle bookmark on
    fireEvent.click(bookmarkBtn);

    const favorites = useVaultStore.getState().favorites;
    expect(favorites.length).toBe(1);
    expect(favorites[0].entityId).toBe('mars');
    expect(favorites[0].entityType).toBe('planet');
    expect(favorites[0].title).toBe('Mars');

    // Telemetry event logged
    const events = useVaultStore.getState().explorationEvents;
    expect(events.some((e) => e.eventType === 'planet_viewed' && e.entityId === 'mars')).toBe(true);
  });

  it('Integration Scenario 10: Learning Activity -> Explorer Passport achievement unlock & rank derivation', () => {
    const vaultStore = useVaultStore.getState();

    // Complete 3 lessons across trail
    vaultStore.completeLesson('lesson-sol-01');
    vaultStore.completeLesson('lesson-sol-02');
    vaultStore.completeLesson('lesson-sol-03');

    // Record a certified quiz attempt (100% score)
    vaultStore.recordQuizAttempt({
      trailId: 'trail-solar-system',
      scorePercent: 100,
      passed: true,
      totalQuestions: 6,
      correctAnswers: 6,
      userAnswers: [],
    });

    // Verify Space Scholar achievement (ach-space-scholar) is unlocked
    const achievements = useVaultStore.getState().achievements;
    const scholarAchievement = achievements.find((a) => a.id === 'ach-space-scholar');
    expect(Boolean(scholarAchievement?.unlockedAt)).toBe(true);
    expect(scholarAchievement?.progress).toBe(1);

    // Clearance rank derivation reflects unlocked achievements
    const rankInfo = computeExplorerRank(achievements);
    expect(rankInfo.unlockedCount).toBeGreaterThanOrEqual(1);
    expect(rankInfo.level).toBeGreaterThanOrEqual(1);

    // Render Explorer Passport and verify display
    render(
      <MemoryRouter>
        <ExplorerPassportSection />
      </MemoryRouter>
    );

    expect(screen.getByText(/OFFICIAL EXPLORER PASSPORT/i)).toBeInTheDocument();
    expect(screen.getByText(/CREDENTIAL DOSSIER/i)).toBeInTheDocument();
    expect(screen.getByText(/Novice Observer|Cadet Explorer|Orbital Cartographer/i)).toBeInTheDocument();
  });
});
