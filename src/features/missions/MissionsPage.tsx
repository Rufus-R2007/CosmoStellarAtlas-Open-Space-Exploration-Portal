import React, { useState, useEffect, useMemo } from 'react';
import { Rocket, Radio, Award, Sparkles } from 'lucide-react';
import { Mission } from '../../types';
import { spaceService } from '../../services';
import { useAppStore } from '../../store';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { MissionCard } from './components/cards/MissionCard';
import { MissionFilters } from './components/filters/MissionFilters';
import { MissionAnalyticsSection } from './components/analytics/MissionAnalyticsSection';
import { MissionReplayEngine } from './components/replay/MissionReplayEngine';

export const MissionsPage: React.FC = () => {
  const { selectedYear } = useAppStore();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAgency, setSelectedAgency] = useState<string>('all');
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDecade, setSelectedDecade] = useState<string>('all');
  const [syncTimelineYear, setSyncTimelineYear] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'launch-desc' | 'launch-asc' | 'name'>('launch-desc');

  // Replay Modal State
  const [replayMission, setReplayMission] = useState<Mission | null>(null);

  const loadMissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await spaceService.getMissions();
      setMissions(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize Mission Control telemetry feeds.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMissions();
  }, []);

  // Filter & Sort Logic
  const filteredMissions = useMemo(() => {
    let result = [...missions];

    // Text Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.agency.toLowerCase().includes(q) ||
          m.destinationName.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.objectives.some((o) => o.toLowerCase().includes(q))
      );
    }

    // Agency Filter
    if (selectedAgency !== 'all') {
      result = result.filter((m) =>
        m.agency.toLowerCase().includes(selectedAgency.toLowerCase())
      );
    }

    // Destination Filter
    if (selectedDestination !== 'all') {
      const destQuery = selectedDestination.toLowerCase();
      result = result.filter(
        (m) =>
          (m.destinationPlanetId && m.destinationPlanetId.toLowerCase() === destQuery) ||
          m.destinationName.toLowerCase().includes(destQuery)
      );
    }

    // Mission Type Filter
    if (selectedType !== 'all') {
      result = result.filter((m) => m.missionType === selectedType);
    }

    // Decade Filter
    if (selectedDecade !== 'all') {
      const decadeStart = parseInt(selectedDecade, 10);
      result = result.filter(
        (m) => m.launchYear >= decadeStart && m.launchYear < decadeStart + 10
      );
    }

    // Synchronize with Time Machine Year (Epoch <= selectedYear)
    if (syncTimelineYear) {
      result = result.filter((m) => m.launchYear <= selectedYear);
    }

    // Sorting
    switch (sortBy) {
      case 'launch-asc':
        result.sort((a, b) => a.launchYear - b.launchYear || a.launchDate.localeCompare(b.launchDate));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'launch-desc':
      default:
        result.sort((a, b) => b.launchYear - a.launchYear || b.launchDate.localeCompare(a.launchDate));
        break;
    }

    return result;
  }, [
    missions,
    searchTerm,
    selectedAgency,
    selectedDestination,
    selectedType,
    selectedDecade,
    syncTimelineYear,
    selectedYear,
    sortBy,
  ]);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingState message="Connecting to Global Mission Operations Telemetry Feed..." />
      </div>
    );
  }

  if (error || missions.length === 0) {
    return (
      <div className="py-24">
        <ErrorState
          title="Mission Control Offline"
          message={error || 'Unable to establish link with mission archive database.'}
          onRetry={loadMissions}
        />
      </div>
    );
  }

  // Summary Telemetry Values
  const activeCount = missions.filter((m) => m.status === 'Active').length;
  const completedCount = missions.filter((m) => m.status === 'Completed').length;
  const totalMilestones = missions.reduce((acc, m) => acc + (m.milestones?.length || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141D30] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#20D9F2] mb-1">
            <Rocket className="w-4 h-4" />
            <span className="font-telemetry text-xs uppercase tracking-widest font-semibold">
              Spaceflight Operations Archive // Phase 3
            </span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#F5F7FF]">
            Mission Control Archive
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#98A7BF] mt-1 max-w-2xl leading-relaxed">
            Comprehensive declassified mission dossiers, historical flight trajectories, chronological milestone replays, and deep space telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className="font-mono text-xs text-[#20D9F2] bg-[#20D9F2]/10 border border-[#20D9F2]/30 px-3 py-1.5 rounded-lg font-semibold uppercase">
            {missions.length} DOSSIERS VERIFIED
          </span>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0A1021] border border-[#141D30] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#98A7BF] block">Cataloged Expeditions</span>
            <span className="font-headline text-2xl font-bold text-[#F5F7FF]">{missions.length}</span>
          </div>
          <Rocket className="w-6 h-6 text-[#20D9F2]/60" />
        </div>

        <div className="bg-[#0A1021] border border-[#141D30] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#98A7BF] block">Active Robotic Probes</span>
            <span className="font-headline text-2xl font-bold text-emerald-400">{activeCount}</span>
          </div>
          <Radio className="w-6 h-6 text-emerald-400/60 animate-pulse" />
        </div>

        <div className="bg-[#0A1021] border border-[#141D30] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#98A7BF] block">Completed Flights</span>
            <span className="font-headline text-2xl font-bold text-[#8565FA]">{completedCount}</span>
          </div>
          <Award className="w-6 h-6 text-[#8565FA]/60" />
        </div>

        <div className="bg-[#0A1021] border border-[#141D30] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#98A7BF] block">Flight Milestones</span>
            <span className="font-headline text-2xl font-bold text-[#FFB45B]">{totalMilestones}</span>
          </div>
          <Sparkles className="w-6 h-6 text-[#FFB45B]/60" />
        </div>
      </div>

      {/* Feature 7: Historical Insights & Analytics Dashboard */}
      <MissionAnalyticsSection
        missions={missions}
        selectedDecade={selectedDecade !== 'all' ? selectedDecade : null}
        activeTimelineYear={syncTimelineYear ? selectedYear : undefined}
      />

      {/* Search & Filters Controls */}
      <MissionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedAgency={selectedAgency}
        onAgencyChange={setSelectedAgency}
        selectedDestination={selectedDestination}
        onDestinationChange={setSelectedDestination}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedDecade={selectedDecade}
        onDecadeChange={setSelectedDecade}
        syncTimelineYear={syncTimelineYear}
        onToggleSyncTimelineYear={() => setSyncTimelineYear(!syncTimelineYear)}
        activeTimelineYear={selectedYear}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={() => {
          setSearchTerm('');
          setSelectedAgency('all');
          setSelectedDestination('all');
          setSelectedType('all');
          setSelectedDecade('all');
          setSyncTimelineYear(false);
          setSortBy('launch-desc');
        }}
        totalFiltered={filteredMissions.length}
        totalAll={missions.length}
      />

      {/* Main Mission Grid or Empty State */}
      {filteredMissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onLaunchReplay={(m) => setReplayMission(m)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Matching Missions Found"
          message="Adjust or clear your search query, agency, destination, or decade filters to explore the mission archive."
          action={
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedAgency('all');
                setSelectedDestination('all');
                setSelectedType('all');
                setSelectedDecade('all');
                setSyncTimelineYear(false);
                setSortBy('launch-desc');
              }}
              className="px-4 py-2 rounded-lg bg-[#20D9F2] text-[#00363E] font-headline text-xs font-bold uppercase hover:bg-[#20D9F2]/90 transition-colors"
            >
              Reset All Filters
            </button>
          }
        />
      )}

      {/* Interactive Mission Replay Engine Modal */}
      {replayMission && (
        <MissionReplayEngine
          mission={replayMission}
          isOpen={!!replayMission}
          onClose={() => setReplayMission(null)}
          initialMilestoneIndex={0}
        />
      )}
    </div>
  );
};
