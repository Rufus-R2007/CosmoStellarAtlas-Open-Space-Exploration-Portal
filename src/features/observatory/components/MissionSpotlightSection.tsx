import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowRight, Calendar, MapPin, Award, CheckCircle } from 'lucide-react';
import { Mission } from '../../../types';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { SectionHeader } from '../../../components/common/SectionHeader';

interface MissionSpotlightSectionProps {
  mission: Mission | null;
}

export const MissionSpotlightSection: React.FC<MissionSpotlightSectionProps> = ({ mission }) => {
  const navigate = useNavigate();

  if (!mission) return null;

  return (
    <section className="my-12">
      <SectionHeader
        icon={<Rocket className="w-5 h-5 text-[#8565FA]" />}
        eyebrow="Mission Archives Spotlight"
        title="Featured Flight Heritage"
        subtitle="Key historical and pioneering exploration missions that expanded humanity's operational reach into the cosmos."
      />

      <Card className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 lg:p-8 border-[#1D2A44] hover:border-[#8565FA]/40 shadow-xl">
        {/* Left Column: Visual Telemetry Dossier */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#060B19]/80 border border-[#141D30] rounded-xl p-5 relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#8565FA]/15 blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="violet" size="sm">
                EXPEDITION DOSSIER // {mission.id.toUpperCase()}
              </Badge>
              <Badge variant="outline" size="sm">
                {mission.missionType}
              </Badge>
            </div>

            <div className="space-y-1 mb-4">
              <span className="font-mono text-xs text-[#FFB45B] uppercase font-semibold">
                AGENCY: {mission.agency}
              </span>
              <h3 className="font-headline text-2xl lg:text-3xl font-bold uppercase tracking-tight text-[#F5F7FF]">
                {mission.name}
              </h3>
            </div>

            <p className="font-body text-xs sm:text-sm text-[#98A7BF] leading-relaxed">
              {mission.description}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 my-4 pt-4 border-t border-[#141D30] font-mono text-xs">
            <div className="flex items-center gap-2 text-[#98A7BF]">
              <Calendar className="w-4 h-4 text-[#20D9F2]" />
              <span>Launch: {mission.launchDate}</span>
            </div>
            <div className="flex items-center gap-2 text-[#98A7BF]">
              <MapPin className="w-4 h-4 text-[#FFB45B]" />
              <span>Dest: {mission.destinationName}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="font-mono text-[11px] text-[#20D9F2] flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              STATUS: {mission.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Right Column: Achievements & Flight Timeline */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Objectives & Achievements */}
          <div className="space-y-4">
            <div>
              <span className="font-telemetry text-xs uppercase tracking-wider text-[#98A7BF] font-semibold flex items-center gap-1.5 mb-2">
                <Award className="w-4 h-4 text-[#FFB45B]" />
                Primary Scientific Achievements
              </span>
              <ul className="space-y-2">
                {mission.achievements.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-[#F5F7FF] font-body bg-[#060B19]/60 p-2.5 rounded-lg border border-[#141D30]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#20D9F2] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Historical Milestones Mini Timeline */}
            <div>
              <span className="font-telemetry text-xs uppercase tracking-wider text-[#98A7BF] font-semibold block mb-2">
                Flight Milestones
              </span>
              <div className="space-y-2">
                {mission.milestones.map((ms) => (
                  <div
                    key={ms.id}
                    className="p-3 rounded-lg bg-[#060B19]/40 border border-[#141D30] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#20D9F2]">
                          {ms.year}
                        </span>
                        <span className="font-headline text-xs font-bold uppercase text-[#F5F7FF]">
                          {ms.title}
                        </span>
                      </div>
                      <p className="font-body text-xs text-[#98A7BF] mt-0.5">
                        {ms.description}
                      </p>
                    </div>
                    <Badge variant="outline" size="sm" className="self-start sm:self-center shrink-0">
                      {ms.significance}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-[#141D30] flex items-center justify-between">
            <span className="font-mono text-xs text-[#98A7BF]">
              Repository Source: Verified Public Flight Archive
            </span>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(`/missions?id=${mission.id}`)}
              icon={<ArrowRight className="w-4 h-4 text-[#8565FA]" />}
            >
              View Full Mission Log
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
};

