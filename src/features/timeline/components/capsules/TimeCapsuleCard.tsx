import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Compass, ArrowRight, Globe, Rocket } from 'lucide-react';
import { TimeCapsule } from '../../../../types';

interface TimeCapsuleCardProps {
  capsule: TimeCapsule;
}

export const TimeCapsuleCard: React.FC<TimeCapsuleCardProps> = ({ capsule }) => {
  const navigate = useNavigate();

  const getPlanetLink = () => {
    if (capsule.relatedCelestialBodyId && capsule.relatedCelestialBodyId !== 'earth') {
      return `/planets?id=${capsule.relatedCelestialBodyId}`;
    }
    const dLower = capsule.destination.toLowerCase();
    if (dLower.includes('mars')) return '/planets?id=mars';
    if (dLower.includes('saturn')) return '/planets?id=saturn';
    if (dLower.includes('jupiter')) return '/planets?id=jupiter';
    if (dLower.includes('neptune')) return '/planets?id=neptune';
    if (dLower.includes('uranus')) return '/planets?id=uranus';
    if (dLower.includes('venus')) return '/planets?id=venus';
    if (dLower.includes('mercury')) return '/planets?id=mercury';
    return null;
  };

  const planetLink = getPlanetLink();

  return (
    <div className="bg-[#0A1021] border border-[#141D30] hover:border-[#8565FA]/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#8565FA]/10 group relative overflow-hidden">
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[#8565FA]/10 text-[#8565FA] border border-[#8565FA]/30 font-semibold uppercase">
              {capsule.category}
            </span>
            {capsule.badgeText && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FFB45B]/15 text-[#FFB45B] border border-[#FFB45B]/30 font-bold uppercase">
                {capsule.badgeText}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FFB45B]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{capsule.year}</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-headline text-lg sm:text-xl font-bold text-[#F5F7FF] group-hover:text-[#20D9F2] transition-colors leading-snug tracking-tight mb-2">
          {capsule.title}
        </h4>

        {/* Destination & Agency */}
        <div className="flex items-center gap-3 text-xs font-mono text-[#98A7BF] mb-3">
          <span className="text-[#20D9F2] font-semibold flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            {capsule.destination}
          </span>
          <span>•</span>
          <span className="text-[#98A7BF]">{capsule.agency}</span>
        </div>

        {/* Short Explanation */}
        <p className="font-body text-xs sm:text-sm text-[#F5F7FF]/90 leading-relaxed mb-3">
          {capsule.shortExplanation}
        </p>

        {/* Scientific Significance */}
        <div className="bg-[#060B19]/80 border border-[#141D30] rounded-xl p-3 mb-4 space-y-1">
          <span className="text-[10px] font-mono text-[#20D9F2] uppercase font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Scientific Significance
          </span>
          <p className="text-xs font-body text-[#98A7BF] leading-relaxed italic">
            "{capsule.scientificSignificance}"
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#141D30] mt-auto">
        <button
          onClick={() => navigate(`/missions/${capsule.associatedMissionId}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#20D9F2] text-[#00363E] text-xs font-headline font-bold uppercase hover:bg-[#20D9F2]/90 transition-colors shadow-md shadow-[#20D9F2]/20"
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>Explore Mission</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {planetLink && (
          <button
            onClick={() => navigate(planetLink)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10182B] hover:bg-[#141D30] border border-[#141D30] text-xs font-headline font-bold uppercase text-[#98A7BF] hover:text-[#20D9F2] transition-colors"
            title="View target celestial world in 3D"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Target World</span>
          </button>
        )}
      </div>
    </div>
  );
};
