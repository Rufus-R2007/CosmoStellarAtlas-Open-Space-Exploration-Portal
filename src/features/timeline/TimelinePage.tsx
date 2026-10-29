import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Rocket, Globe, ArrowRight } from 'lucide-react';
import { Mission, MissionMilestone } from '../../types';
import { spaceService } from '../../services';
import { timeCapsulesData } from '../../data';
import { useAppStore } from '../../store';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { TimelineScrubber } from './components/scrubber/TimelineScrubber';
import { EpochOverviewPanel } from './components/epoch/EpochOverviewPanel';
import { TimeCapsuleCarousel } from './components/capsules/TimeCapsuleCarousel';
import { MissionReplayEngine } from '../missions/components/replay/MissionReplayEngine';

const LANDMARK_YEARS = [
  1957, 1961, 1969, 1971, 1972, 1977, 1986, 1989, 1990, 1996, 1997, 1998, 2004,
  2006, 2009, 2011, 2012, 2015, 2018, 2020, 2021, 2022, 2023,
];

export const TimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedYear, setSelectedYear } = useAppStore();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Replay modal state
  const [replayMission, setReplayMission] = useState<Mission | null>(null);
  const [replayMilestoneIndex, setReplayMilestoneIndex] = useState<number>(0);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const missionsRes = await spaceService.getMissions();
      setMissions(missionsRes);
    } catch (err: any) {
      setError(err?.message || 'Failed to synchronize with chronological mission archives.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter matching missions for active selectedYear
  const matchingMissions = useMemo(() => {
    return missions.filter(
      (m) =>
        m.launchYear === selectedYear ||
        m.milestones.some((ms) => ms.year === selectedYear)
    );
  }, [missions, selectedYear]);

  // Extract all matching milestones for active selectedYear
  const matchingMilestones = useMemo(() => {
    const list: MissionMilestone[] = [];
    missions.forEach((m) => {
      m.milestones.forEach((ms) => {
        if (ms.year === selectedYear) {
          list.push(ms);
        }
      });
    });
    return list.sort((a, b) => a.chronologicalOrder || 0 - (b.chronologicalOrder || 0));
  }, [missions, selectedYear]);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingState message="Calibrating Chronological Time Machine Matrix & Mission Logs..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24">
        <ErrorState
          title="Time Machine Matrix Offline"
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141D30] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#8565FA] mb-1">
            <Clock className="w-4 h-4" />
            <span className="font-telemetry text-xs uppercase tracking-widest font-semibold">
              Chronological Odyssey // Phase 3
            </span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#F5F7FF]">
            Cosmic Time Machine
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#98A7BF] mt-1 max-w-2xl leading-relaxed">
            Journey through the history of human space exploration from the dawn of Sputnik in 1957 through Apollo, Voyager, deep space orbiters, and modern lunar architectures.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className="font-mono text-xs text-[#8565FA] bg-[#8565FA]/10 border border-[#8565FA]/30 px-3 py-1.5 rounded-lg font-semibold uppercase">
            1957 – PRESENT EPOCH
          </span>
        </div>
      </div>

      {/* Feature 1: Interactive Timeline Scrubber */}
      <TimelineScrubber
        minYear={1957}
        maxYear={2026}
        landmarkYears={LANDMARK_YEARS}
        onYearSelect={(y) => setSelectedYear(y)}
      />

      {/* Synchronized Active Epoch Overview Panel */}
      <EpochOverviewPanel
        selectedYear={selectedYear}
        matchingMissions={matchingMissions}
        matchingMilestones={matchingMilestones}
        onLaunchReplay={(mission, milestoneIndex = 0) => {
          setReplayMission(mission);
          setReplayMilestoneIndex(milestoneIndex);
        }}
      />

      {/* Feature 2: Historical Cosmic Time Capsules Showcase */}
      <TimeCapsuleCarousel capsules={timeCapsulesData} />

      {/* Cross-Module Navigation Footer Banner */}
      <div className="bg-[#0A1021] border border-[#141D30] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <h3 className="font-headline text-xl font-bold uppercase text-[#F5F7FF]">
            Cross-Module Exploration Threads
          </h3>
          <p className="font-body text-xs sm:text-sm text-[#98A7BF] max-w-xl">
            Explore the full technical dossier archive in Mission Control, or inspect planetary destinations in the 3D Planet Explorer.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/missions')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#20D9F2] text-[#00363E] font-headline text-xs font-bold uppercase hover:bg-[#20D9F2]/90 transition-colors shadow-lg shadow-[#20D9F2]/20"
          >
            <Rocket className="w-4 h-4" />
            <span>Open Mission Control</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/planets')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10182B] hover:bg-[#141D30] border border-[#141D30] text-xs font-headline font-bold uppercase text-[#F5F7FF] transition-colors"
          >
            <Globe className="w-4 h-4 text-[#20D9F2]" />
            <span>Survey 3D Planets</span>
          </button>
        </div>
      </div>

      {/* Interactive Mission Replay Engine Modal */}
      {replayMission && (
        <MissionReplayEngine
          mission={replayMission}
          isOpen={!!replayMission}
          onClose={() => setReplayMission(null)}
          initialMilestoneIndex={replayMilestoneIndex}
        />
      )}
    </div>
  );
};
