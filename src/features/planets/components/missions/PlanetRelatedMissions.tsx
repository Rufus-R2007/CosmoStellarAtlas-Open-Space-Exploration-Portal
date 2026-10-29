import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Rocket,
  Clock,
  ArrowRight,
  CheckCircle,
  Radio,
} from 'lucide-react';
import { Planet, Mission } from '../../../../types';
import { Card } from '../../../../components/common/Card';
import { Badge } from '../../../../components/common/Badge';
import { SectionHeader } from '../../../../components/common/SectionHeader';
import { useAppStore } from '../../../../store';

interface PlanetRelatedMissionsProps {
  planet: Planet;
  allMissions: Mission[];
}

export const PlanetRelatedMissions: React.FC<PlanetRelatedMissionsProps> = ({
  planet,
  allMissions,
}) => {
  const navigate = useNavigate();
  const { selectedYear } = useAppStore();
  const [applyTemporalFilter, setApplyTemporalFilter] = useState(true);

  // Match missions targeting this planet or matching relatedMissionIds
  const relatedMissions = allMissions.filter(
    (m) =>
      m.destinationPlanetId === planet.id ||
      planet.relatedMissionIds.includes(m.id)
  );

  // Filter based on Cosmic Time Machine selectedYear if temporal filter is toggled
  const filteredMissions = relatedMissions.filter((m) => {
    if (!applyTemporalFilter) return true;
    return m.launchYear <= selectedYear;
  });

  const isTemporalRestricted =
    applyTemporalFilter && filteredMissions.length < relatedMissions.length;

  return (
    <section className="my-12">
      <SectionHeader
        icon={<Rocket className="w-5 h-5 text-[#8565FA]" />}
        eyebrow="Flight Heritage & Encounters"
        title={`Exploration Missions to ${planet.name}`}
        subtitle={`Historical and planned spaceflight encounters targeting ${planet.name} cataloged in the local mission archive.`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setApplyTemporalFilter(!applyTemporalFilter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-telemetry text-xs uppercase transition-colors ${
                applyTemporalFilter
                  ? 'bg-[#20D9F2]/10 border-[#20D9F2]/40 text-[#20D9F2]'
                  : 'bg-[#0A1021] border-[#141D30] text-[#98A7BF] hover:text-[#F5F7FF]'
              }`}
              title="Toggle timeline year constraint from Cosmic Time Machine"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                {applyTemporalFilter ? `Epoch ≤ ${selectedYear}` : 'All Epochs'}
              </span>
            </button>
          </div>
        }
      />

      {/* Discovery Threads Banner */}
      <div className="mb-4 p-3.5 rounded-xl bg-[#0A1021]/80 border border-[#141D30] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#98A7BF]">
          <span className="text-[#20D9F2] font-bold uppercase">{planet.name}</span>
          <span>→</span>
          <span className="text-[#CBBEFF]">
            {relatedMissions.length} Cataloged Mission(s)
          </span>
          {planet.id === 'mars' && (
            <>
              <span>→</span>
              <span className="text-[#FFB45B] flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" /> Surface Robotics Array
              </span>
            </>
          )}
        </div>

        {isTemporalRestricted && (
          <div className="flex items-center gap-2 text-xs text-[#20D9F2]">
            <span>Showing {filteredMissions.length} of {relatedMissions.length} missions launched by {selectedYear}</span>
            <button
              onClick={() => setApplyTemporalFilter(false)}
              className="underline text-[11px] text-[#98A7BF] hover:text-white"
            >
              Show all
            </button>
          </div>
        )}
      </div>

      {/* Missions Grid */}
      {filteredMissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMissions.map((mission) => (
            <Card
              key={mission.id}
              glow="violet"
              interactive
              onClick={() => navigate(`/missions?id=${mission.id}`)}
              className="flex flex-col justify-between p-5 border-[#1D2A44] group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-[#20D9F2] font-semibold">
                    {mission.agency}
                  </span>
                  <Badge variant="outline" size="sm">
                    {mission.status}
                  </Badge>
                </div>

                <h4 className="font-headline text-base font-bold uppercase text-[#F5F7FF] group-hover:text-[#CBBEFF] transition-colors">
                  {mission.name}
                </h4>

                <span className="font-mono text-[11px] text-[#98A7BF] block mt-0.5">
                  Launch: {mission.launchDate} • Type: {mission.missionType}
                </span>

                <p className="font-body text-xs text-[#98A7BF] mt-2.5 line-clamp-3 leading-relaxed">
                  {mission.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#141D30] flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#98A7BF] flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-[#20D9F2]" />
                  {mission.milestones.length} Milestone(s)
                </span>
                <span className="text-[#CBBEFF] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View Dossier <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-[#0A1021]/60 border border-dashed border-[#141D30] rounded-xl text-xs text-[#98A7BF] space-y-2">
          <p>
            No missions were launched to {planet.name} on or before the currently active year ({selectedYear}).
          </p>
          <button
            onClick={() => setApplyTemporalFilter(false)}
            className="px-3 py-1.5 rounded bg-[#10182B] text-[#20D9F2] border border-[#20D9F2]/30 uppercase font-telemetry"
          >
            Clear Temporal Filter (Show All {relatedMissions.length} Missions)
          </button>
        </div>
      )}
    </section>
  );
};
