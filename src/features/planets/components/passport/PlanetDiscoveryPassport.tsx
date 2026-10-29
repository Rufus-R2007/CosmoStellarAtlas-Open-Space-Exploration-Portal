import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';
import { Planet } from '../../../../types';
import { Card } from '../../../../components/common/Card';
import { Badge } from '../../../../components/common/Badge';

interface PlanetDiscoveryPassportProps {
  planet: Planet;
  allPlanets: Planet[];
  onSelectNextPlanet: (id: string) => void;
}

export const PlanetDiscoveryPassport: React.FC<PlanetDiscoveryPassportProps> = ({
  planet,
  allPlanets,
  onSelectNextPlanet,
}) => {
  const nextPlanet = allPlanets.find((p) => p.id === planet.suggestedNextPlanetId) || allPlanets[0];

  return (
    <Card className="p-4 sm:p-5 bg-[#060B19]/80 border-[#1D2A44] shadow-lg relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Passport Identity & Highlight */}
        <div className="flex items-start gap-3.5 max-w-2xl">
          <div className="p-2.5 rounded-xl bg-[#20D9F2]/10 border border-[#20D9F2]/30 text-[#20D9F2] shrink-0 mt-0.5">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-telemetry text-xs font-bold uppercase tracking-wider text-[#20D9F2]">
                Planet Discovery Passport // Entry #{planet.orderFromSun}
              </span>
              <Badge variant="cyan" size="sm">
                LOGGED
              </Badge>
            </div>

            <p className="font-body text-xs text-[#F5F7FF] leading-relaxed">
              <strong className="text-[#FFB45B] font-semibold">Discovery Insight: </strong>
              {planet.discoveryPassportHighlight}
            </p>
          </div>
        </div>

        {/* Right: Suggested Next Expedition */}
        <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4 sm:border-l sm:border-[#141D30] shrink-0">
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[10px] font-mono uppercase text-[#98A7BF]">
              Suggested Next Target
            </span>
            <span className="font-headline text-xs font-bold uppercase text-[#F5F7FF]">
              {nextPlanet.name} ({nextPlanet.distanceFromSunAU} AU)
            </span>
          </div>

          <button
            onClick={() => onSelectNextPlanet(nextPlanet.id)}
            className="p-2 rounded-lg bg-[#10182B] hover:bg-[#20D9F2] text-[#20D9F2] hover:text-[#00363E] border border-[#20D9F2]/30 transition-all cursor-pointer group"
            title={`Plot course to ${nextPlanet.name}`}
            aria-label={`Next Planet: ${nextPlanet.name}`}
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </Card>
  );
};
