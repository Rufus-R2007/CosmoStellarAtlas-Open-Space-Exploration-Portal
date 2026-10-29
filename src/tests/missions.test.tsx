import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MissionsPage } from '../features/missions/MissionsPage';
import { MissionDetailPage } from '../features/missions/MissionDetailPage';
import { TimelinePage } from '../features/timeline/TimelinePage';
import { MissionReplayEngine } from '../features/missions/components/replay/MissionReplayEngine';
import { HistoricalInsightsEngine } from '../features/missions/services/HistoricalInsightsEngine';
import { spaceService } from '../services';
import { missionsData, planetsData, timeCapsulesData } from '../data';
import { useAppStore } from '../store';

describe('Phase 3 — Cosmic Time Machine & Mission Control Test Suite', () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedYear: 1969,
      visualEffects: 'high',
      demoMode: true,
      simulateError: false,
      selectedMissionId: null,
      timelineDecadeFilter: null,
    });
    spaceService.setSimulatedError(false);
    spaceService.setSimulatedDelay(0);
  });

  // Requirement 1: Missions load correctly from local provider
  it('Requirement 1: missions load correctly from local space data provider', async () => {
    const missions = await spaceService.getMissions();
    expect(missions.length).toBeGreaterThanOrEqual(18);
    expect(missions.every((m) => m.id && m.name && m.launchYear && m.destinationName)).toBe(true);
    expect(missions.some((m) => m.id === 'apollo-11')).toBe(true);
    expect(missions.some((m) => m.id === 'voyager-1')).toBe(true);
    expect(missions.some((m) => m.id === 'jwst')).toBe(true);
    expect(missions.some((m) => m.id === 'chandrayaan-3')).toBe(true);
  });

  // Requirement 2: Mission search returns correct records
  it('Requirement 2: mission search filters records across names, agencies, and descriptions', async () => {
    render(
      <MemoryRouter initialEntries={['/missions']}>
        <MissionsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search missions by name/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search missions by name/i);

    // Search "Apollo"
    fireEvent.change(searchInput, { target: { value: 'Apollo' } });
    expect(screen.getByText(/Apollo 11/i)).toBeInTheDocument();
    expect(screen.queryByText(/Curiosity \(Mars Science Laboratory\)/i)).not.toBeInTheDocument();

    // Invalid search
    fireEvent.change(searchInput, { target: { value: 'NonexistentSpaceXMission999' } });
    expect(screen.getByText(/No Matching Missions Found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset All Filters/i })).toBeInTheDocument();

    // Clear search
    fireEvent.click(screen.getByRole('button', { name: /Reset All Filters/i }));
    expect(screen.getByText(/Apollo 11/i)).toBeInTheDocument();
  });

  // Requirement 3: Combined filters behave correctly (agency + decade)
  it('Requirement 3: combined filters narrow mission results accurately', async () => {
    render(
      <MemoryRouter initialEntries={['/missions']}>
        <MissionsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Cataloged Expeditions/i)).toBeInTheDocument();
    });

    // Filter by NASA agency
    const nasaBtn = screen.getByRole('button', { name: /^NASA$/i });
    fireEvent.click(nasaBtn);

    // Filter by 1970s decade
    const decade70s = screen.getByRole('button', { name: /^1970s$/i });
    fireEvent.click(decade70s);

    // Should include Mariner 9, Pioneer 10, Voyager 1, Voyager 2
    expect(screen.getByText(/Mariner 9/i)).toBeInTheDocument();
    expect(screen.getByText(/Voyager 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sputnik 1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Apollo 11/i)).not.toBeInTheDocument();
  });

  // Requirement 4: Sorting by launch date works (ascending and descending)
  it('Requirement 4: sorting missions by launch date orders results chronologically', () => {
    const list = [...missionsData];

    // Ascending sort
    const asc = [...list].sort((a, b) => a.launchYear - b.launchYear);
    expect(asc[0].id).toBe('sputnik-1');
    expect(asc[asc.length - 1].launchYear).toBeGreaterThanOrEqual(2022);

    // Descending sort
    const desc = [...list].sort((a, b) => b.launchYear - a.launchYear);
    expect(desc[0].launchYear).toBeGreaterThanOrEqual(2023);
    expect(desc[desc.length - 1].id).toBe('sputnik-1');
  });

  // Requirement 5: Historical-year selection updates relevant records in timeline
  it('Requirement 5: selecting a historical year updates synchronized timeline state and records', async () => {
    render(
      <MemoryRouter initialEntries={['/timeline']}>
        <TimelinePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Temporal Chronology Scrubber/i)).toBeInTheDocument();
    });

    // Initial state is 1969: should display Apollo 11
    expect(screen.getByText(/Spaceflight Chronology: Year 1969/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Apollo 11/i).length).toBeGreaterThanOrEqual(1);

    // Select 1957 via state
    act(() => {
      useAppStore.getState().setSelectedYear(1957);
    });

    await waitFor(() => {
      expect(screen.getByText(/Spaceflight Chronology: Year 1957/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Sputnik 1/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  // Requirement 6: Timeline events appear in chronological order
  it('Requirement 6: mission milestones appear in chronological sequence', () => {
    const apollo = missionsData.find((m) => m.id === 'apollo-11')!;
    expect(apollo.milestones.length).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < apollo.milestones.length - 1; i++) {
      const current = new Date(apollo.milestones[i].date).getTime();
      const next = new Date(apollo.milestones[i + 1].date).getTime();
      expect(next).toBeGreaterThanOrEqual(current);
    }
  });

  // Requirement 7: Mission details resolve by stable ID
  it('Requirement 7: mission detail route resolves correctly by stable ID', async () => {
    render(
      <MemoryRouter initialEntries={['/missions/apollo-11']}>
        <Routes>
          <Route path="missions/:missionId" element={<MissionDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /^Apollo 11$/i, level: 1 })).toBeInTheDocument();
    });

    expect(screen.getByText(/Saturn V \(SA-506\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Neil Armstrong and Buzz Aldrin/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Launch Mission Replay/i })).toBeInTheDocument();
  });

  // Requirement 8: Planet-to-mission relationships work bidirectionally
  it('Requirement 8: planet-to-mission relationships resolve bidirectionally', () => {
    const mars = planetsData.find((p) => p.id === 'mars')!;
    const curiosity = missionsData.find((m) => m.id === 'curiosity')!;

    // Curiosity has destination mars
    expect(curiosity.destinationPlanetId).toBe('mars');
    // Mars relatedMissionIds references curiosity
    expect(mars.relatedMissionIds).toContain('curiosity');
  });

  // Requirement 9: Mission Replay advances between milestones
  it('Requirement 9: mission replay engine renders controls and advances milestones', () => {
    const apollo = missionsData.find((m) => m.id === 'apollo-11')!;
    const onClose = vi.fn();

    render(
      <MissionReplayEngine
        mission={apollo}
        isOpen={true}
        onClose={onClose}
        initialMilestoneIndex={0}
      />
    );

    // Initial milestone 1
    expect(screen.getByText(/Apollo 11 \/\/ Mission Replay/i)).toBeInTheDocument();
    expect(screen.getByText(/Milestone 1 of 5/i)).toBeInTheDocument();

    // Advance to Next Milestone
    const nextBtn = screen.getByRole('button', { name: /Next Milestone/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Milestone 2 of 5/i)).toBeInTheDocument();
  });

  // Requirement 10: Pause prevents unintended milestone advancement
  it('Requirement 10: pause control toggles playback state', () => {
    const apollo = missionsData.find((m) => m.id === 'apollo-11')!;
    const onClose = vi.fn();

    render(
      <MissionReplayEngine
        mission={apollo}
        isOpen={true}
        onClose={onClose}
        initialMilestoneIndex={0}
      />
    );

    // Pause replay
    const pauseBtn = screen.getByRole('button', { name: /Pause Replay/i });
    fireEvent.click(pauseBtn);

    // Should now display Resume
    expect(screen.getByRole('button', { name: /Resume Replay/i })).toBeInTheDocument();
  });

  // Requirement 11: Restart returns playback to the beginning
  it('Requirement 11: restart returns replay playback to milestone 0', () => {
    const apollo = missionsData.find((m) => m.id === 'apollo-11')!;
    const onClose = vi.fn();

    render(
      <MissionReplayEngine
        mission={apollo}
        isOpen={true}
        onClose={onClose}
        initialMilestoneIndex={2}
      />
    );

    expect(screen.getByText(/Milestone 3 of 5/i)).toBeInTheDocument();

    // Click restart
    const restartBtn = screen.getByRole('button', { name: /Restart Replay/i });
    fireEvent.click(restartBtn);

    expect(screen.getByText(/Milestone 1 of 5/i)).toBeInTheDocument();
  });

  // Requirement 12: Playback speed changes work
  it('Requirement 12: playback speed selector updates active multiplier', () => {
    const apollo = missionsData.find((m) => m.id === 'apollo-11')!;
    const onClose = vi.fn();

    render(
      <MissionReplayEngine
        mission={apollo}
        isOpen={true}
        onClose={onClose}
        initialMilestoneIndex={0}
      />
    );

    // Select 2x speed
    const speed2xBtn = screen.getByRole('button', { name: /Playback speed 2x/i });
    fireEvent.click(speed2xBtn);

    expect(speed2xBtn).toHaveClass('bg-[#20D9F2]');
  });

  // Requirement 13: Missing milestone data or empty array is handled safely
  it('Requirement 13: handles missions with empty milestones safely without crashing', () => {
    const emptyMission = {
      ...missionsData[0],
      id: 'test-empty-milestones',
      milestones: [],
    };
    const onClose = vi.fn();

    render(
      <MissionReplayEngine
        mission={emptyMission}
        isOpen={true}
        onClose={onClose}
        initialMilestoneIndex={0}
      />
    );

    expect(screen.getByText(/Milestone 0 of 0/i)).toBeInTheDocument();
  });

  // Requirement 14: Unknown mission IDs show appropriate error state with recovery
  it('Requirement 14: unknown mission ID renders error feedback with return action', async () => {
    render(
      <MemoryRouter initialEntries={['/missions/unknown-mission-999']}>
        <Routes>
          <Route path="missions/:missionId" element={<MissionDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Mission Record Unavailable/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/not found in the curated archive/i)).toBeInTheDocument();
  });

  // Requirement 15: Reduced-motion behavior remains usable
  it('Requirement 15: reduced motion preference renders accessible static scene', () => {
    useAppStore.setState({ visualEffects: 'off' });
    const apollo = missionsData.find((m) => m.id === 'apollo-11')!;
    const onClose = vi.fn();

    render(
      <MissionReplayEngine
        mission={apollo}
        isOpen={true}
        onClose={onClose}
        initialMilestoneIndex={0}
      />
    );

    expect(screen.getByText(/Reduced-Motion Static Scene Active/i)).toBeInTheDocument();
  });

  // Additional Feature Check: Historical Time Capsules and Insights Engine
  it('verifies historical time capsules data and insights engine calculations', () => {
    expect(timeCapsulesData.length).toBeGreaterThanOrEqual(12);
    expect(timeCapsulesData.some((c) => c.id === 'capsule-apollo-11')).toBe(true);

    const stats = HistoricalInsightsEngine.computeArchiveStatistics(missionsData);
    expect(stats.totalMissions).toBe(missionsData.length);
    expect(stats.byDecade.length).toBeGreaterThanOrEqual(7);
    expect(stats.byDestination.length).toBeGreaterThan(0);

    const insights = HistoricalInsightsEngine.generateInsights(missionsData, '1960s', 1969);
    expect(insights.length).toBeGreaterThanOrEqual(3);
  });
});
