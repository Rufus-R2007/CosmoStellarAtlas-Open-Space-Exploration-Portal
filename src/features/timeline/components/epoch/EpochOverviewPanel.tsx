import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Rocket, Sparkles, Play, ArrowRight } from 'lucide-react';
import { Mission, MissionMilestone } from '../../../../types';

interface EpochOverviewPanelProps {
  selectedYear: number;
  matchingMissions: Mission[];
  matchingMilestones: MissionMilestone[];
  onLaunchReplay: (mission: Mission, milestoneIndex?: number) => void;
}

export const EpochOverviewPanel: React.FC<EpochOverviewPanelProps> = ({
  selectedYear,
  matchingMissions,
  matchingMilestones,
  onLaunchReplay,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0A1021] border border-[#141D30] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Top Epoch Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141D30] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#20D9F2] mb-1">
            <Clock className="w-4 h-4" />
            <span className="font-telemetry text-xs uppercase tracking-widest font-semibold">
              Epoch Telemetry Synchronization
            </span>
          </div>
          <h2 className="font-headline text-3xl font-bold uppercase tracking-tight text-[#F5F7FF]">
            Spaceflight Chronology: Year {selectedYear}
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#98A7BF] mt-0.5">
            Historical events, active flight heritage, and planetary operations recorded in year {selectedYear}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#FFB45B] bg-[#FFB45B]/10 border border-[#FFB45B]/30 px-3 py-1.5 rounded-lg font-bold">
            {matchingMissions.length} MISSION(S) • {matchingMilestones.length} MILESTONE(S)
          </span>
        </div>
      </div>

      {/* Matching Milestones in this Year */}
      {matchingMilestones.length > 0 ? (
        <div className="space-y-3">
          <span className="text-xs font-mono text-[#20D9F2] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Milestones Documented in {selectedYear}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingMilestones.map((ms) => {
              const parentMission = matchingMissions.find((m) => m.id === ms.missionId);
              return (
                <div
                  key={ms.id}
                  className="bg-[#060B19] border border-[#141D30] hover:border-[#20D9F2]/40 rounded-xl p-4 flex flex-col justify-between transition-colors space-y-2"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-[#FFB45B]">
                        {ms.date}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10182B] text-[#98A7BF] uppercase">
                        {ms.eventType || 'Event'}
                      </span>
                    </div>

                    <h4 className="font-headline text-base font-bold text-[#F5F7FF]">
                      {ms.title}
                    </h4>

                    <p className="font-body text-xs text-[#98A7BF] leading-relaxed line-clamp-2 mt-1">
                      {ms.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#141D30] mt-2">
                    <span className="text-xs font-mono text-[#20D9F2]">
                      {parentMission ? parentMission.name : ms.missionId}
                    </span>

                    {parentMission && (
                      <button
                        onClick={() => onLaunchReplay(parentMission)}
                        className="flex items-center gap-1 text-xs font-headline font-bold uppercase text-[#20D9F2] hover:text-[#F5F7FF] transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Replay</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-[#060B19]/60 border border-[#141D30] rounded-xl p-4 text-center">
          <p className="text-xs font-mono text-[#98A7BF]">
            No direct milestone events cataloged for year {selectedYear} in this 20-mission sample.
            Interplanetary probes launched in prior years continued their long-duration transits.
          </p>
        </div>
      )}

      {/* Missions Launched in this Year */}
      {matchingMissions.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-mono text-[#8565FA] uppercase font-bold flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5" />
            Expeditions Operating in {selectedYear}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingMissions.map((m) => (
              <div
                key={m.id}
                className="bg-[#060B19] border border-[#141D30] rounded-xl p-4 flex flex-col justify-between space-y-2 hover:border-[#8565FA]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-[#8565FA] font-bold">{m.agency}</span>
                    <span className="text-[#98A7BF]">{m.launchYear}</span>
                  </div>
                  <h4 className="font-headline text-base font-bold text-[#F5F7FF]">{m.name}</h4>
                  <p className="text-xs font-mono text-[#20D9F2] truncate">{m.destinationName}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#141D30]">
                  <button
                    onClick={() => onLaunchReplay(m)}
                    className="flex items-center gap-1 text-xs font-headline font-bold uppercase text-[#20D9F2] hover:text-[#F5F7FF] transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Replay</span>
                  </button>

                  <button
                    onClick={() => navigate(`/missions/${m.id}`)}
                    className="flex items-center gap-1 text-xs font-headline font-bold uppercase text-[#98A7BF] hover:text-[#F5F7FF] transition-colors"
                  >
                    <span>Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8565FA]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
