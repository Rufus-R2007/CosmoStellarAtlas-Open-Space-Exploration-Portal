import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../../store';
import { Mission } from '../../../types';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { SectionHeader } from '../../../components/common/SectionHeader';

interface TimelinePreviewSectionProps {
  missions: Mission[];
}

interface TimelineEpoch {
  year: number;
  label: string;
  missionName: string;
  tagline: string;
  accent: 'cyan' | 'violet' | 'gold';
}

const keyEpochs: TimelineEpoch[] = [
  {
    year: 1957,
    label: '1957',
    missionName: 'Sputnik 1',
    tagline: 'Dawn of Space Age',
    accent: 'cyan',
  },
  {
    year: 1961,
    label: '1961',
    missionName: 'Vostok 1',
    tagline: 'First Human in Orbit',
    accent: 'cyan',
  },
  {
    year: 1969,
    label: '1969',
    missionName: 'Apollo 11',
    tagline: 'First Lunar Touchdown',
    accent: 'cyan',
  },
  {
    year: 1977,
    label: '1977',
    missionName: 'Voyager 1 & 2',
    tagline: 'Outer Planet Grand Tour',
    accent: 'violet',
  },
  {
    year: 1990,
    label: '1990',
    missionName: 'Hubble Telescope',
    tagline: 'Deep Space Optics',
    accent: 'violet',
  },
  {
    year: 1997,
    label: '1997',
    missionName: 'Pathfinder & Cassini',
    tagline: 'Mars Rover & Saturn System',
    accent: 'gold',
  },
  {
    year: 2012,
    label: '2012',
    missionName: 'Curiosity Rover',
    tagline: 'Gale Crater Habitability',
    accent: 'gold',
  },
  {
    year: 2021,
    label: '2021',
    missionName: 'JWST & Perseverance',
    tagline: 'Infrared & Sample Caching',
    accent: 'cyan',
  },
  {
    year: 2023,
    label: '2023',
    missionName: 'Chandrayaan-3',
    tagline: 'Lunar South Pole Landing',
    accent: 'violet',
  },
];

export const TimelinePreviewSection: React.FC<TimelinePreviewSectionProps> = ({ missions }) => {
  const navigate = useNavigate();
  const { selectedYear, setSelectedYear } = useAppStore();

  // Find missions associated with the selected year (either launchYear or any milestone year)
  const matchedMissions = missions.filter(
    (m) =>
      m.launchYear === selectedYear ||
      m.milestones.some((ms) => ms.year === selectedYear)
  );

  return (
    <section className="my-12">
      <SectionHeader
        icon={<Clock className="w-5 h-5 text-[#20D9F2]" />}
        eyebrow="Temporal Astrogation Array"
        title="Cosmic Time Machine Preview"
        subtitle="Select a landmark year on the historical timeline array to synchronize state and inspect spaceflight milestones."
        action={
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#98A7BF] hidden sm:inline">
              EPOCH RANGE: 1957 - 2025+
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/timeline')}
              icon={<ArrowRight className="w-3.5 h-3.5 text-[#20D9F2]" />}
            >
              Launch Full Chronology
            </Button>
          </div>
        }
      />

      <Card className="p-6 lg:p-8 bg-[#0A1021]/80 border-[#1D2A44] shadow-xl">
        {/* Interactive Timeline Bar */}
        <div className="relative w-full pt-4 pb-6 overflow-x-auto">
          {/* Connecting Axis Line */}
          <div className="absolute top-10 left-6 right-6 h-0.5 bg-[#141D30]" />
          <div className="absolute top-10 left-6 w-3/4 h-0.5 bg-gradient-to-r from-[#20D9F2] via-[#8565FA] to-[#FFB45B]" />

          {/* Epoch Nodes */}
          <div className="flex justify-between items-start min-w-[720px] relative z-10 px-2">
            {keyEpochs.map((epoch) => {
              const isSelected = selectedYear === epoch.year;
              return (
                <button
                  key={epoch.year}
                  onClick={() => setSelectedYear(epoch.year)}
                  className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
                  aria-label={`Select year ${epoch.year}`}
                  data-selected={isSelected}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#060B19] border-2 border-[#20D9F2] shadow-[0_0_16px_rgba(32,217,242,0.65)] scale-110'
                        : 'bg-[#060B19] border border-[#25334B] hover:border-[#20D9F2]/60 hover:scale-105'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSelected ? 'bg-[#20D9F2] animate-pulse' : 'bg-[#98A7BF]'
                      }`}
                    />
                  </div>

                  <span
                    className={`mt-2 font-mono text-xs font-bold uppercase transition-colors ${
                      isSelected ? 'text-[#20D9F2]' : 'text-[#98A7BF] group-hover:text-[#F5F7FF]'
                    }`}
                  >
                    {epoch.year}
                  </span>

                  <span className="font-headline text-xs font-semibold uppercase text-[#F5F7FF] mt-0.5 max-w-[85px] leading-tight">
                    {epoch.missionName}
                  </span>

                  <span className="font-body text-[10px] text-[#98A7BF] mt-0.5 max-w-[85px] leading-tight hidden sm:block">
                    {epoch.tagline}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Year Mission Detail Feedback Panel */}
        <div className="mt-6 pt-6 border-t border-[#141D30] bg-[#060B19]/60 rounded-xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-headline text-lg font-bold text-[#F5F7FF] uppercase">
                Active Epoch: Year {selectedYear}
              </span>
              <Badge variant="cyan" size="sm">
                Shared State Synced
              </Badge>
            </div>
            <span className="font-mono text-xs text-[#98A7BF]">
              {matchedMissions.length} Mission Record(s) Linked
            </span>
          </div>

          {matchedMissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedMissions.map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/missions?id=${m.id}`)}
                  className="p-4 rounded-xl bg-[#0A1021] border border-[#141D30] hover:border-[#20D9F2]/40 transition-colors cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs text-[#20D9F2] font-semibold">
                        {m.agency}
                      </span>
                      <Badge variant="outline" size="sm">
                        {m.missionType}
                      </Badge>
                    </div>
                    <h4 className="font-headline text-base font-bold uppercase text-[#F5F7FF] group-hover:text-[#20D9F2] transition-colors">
                      {m.name}
                    </h4>
                    <p className="font-body text-xs text-[#98A7BF] mt-1 line-clamp-2 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#141D30] flex items-center justify-between font-mono text-[11px] text-[#98A7BF]">
                    <span>Dest: {m.destinationName}</span>
                    <span className="text-[#20D9F2] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Inspect <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-[#98A7BF]">
              No direct launches cataloged for {selectedYear} in this demo slice. Select landmark nodes above to view missions.
            </div>
          )}
        </div>
      </Card>
    </section>
  );
};
