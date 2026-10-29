import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Calendar, Compass, Play, ArrowRight, Globe, CheckCircle2, Radio, Clock, Star } from 'lucide-react';
import { Mission } from '../../../../types';
import { useVaultStore } from '../../../../store/useVaultStore';

interface MissionCardProps {
  mission: Mission;
  onLaunchReplay: (mission: Mission) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onLaunchReplay }) => {
  const navigate = useNavigate();
  const isFav = useVaultStore((s) => s.isFavorite('mission', mission.id));
  const toggleFavorite = useVaultStore((s) => s.toggleFavorite);

  const getStatusBadge = () => {
    switch (mission.status) {
      case 'Active':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            Active
          </span>
        );
      case 'Completed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#20D9F2]/10 text-[#20D9F2] border border-[#20D9F2]/30">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Completed
          </span>
        );
      case 'Planned':
      case 'En Route':
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FFB45B]/10 text-[#FFB45B] border border-[#FFB45B]/30">
            <Clock className="w-2.5 h-2.5" />
            {mission.status}
          </span>
        );
    }
  };

  const getPlanetLink = () => {
    if (mission.destinationPlanetId && mission.destinationPlanetId !== 'earth') {
      return `/planets?id=${mission.destinationPlanetId}`;
    }
    const dLower = mission.destinationName.toLowerCase();
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
  const highlightedMilestone = mission.milestones?.[0];

  return (
    <div className="bg-[#0A1021] border border-[#141D30] hover:border-[#20D9F2]/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group hover:shadow-xl hover:shadow-[#20D9F2]/5 relative overflow-hidden">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#10182B] text-[#8565FA] border border-[#8565FA]/30 font-semibold uppercase">
              {mission.agency}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#10182B] text-[#98A7BF] border border-[#141D30]">
              {mission.missionType}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite({
                  entityType: 'mission',
                  entityId: mission.id,
                  title: mission.name,
                  subtitle: `${mission.agency} • ${mission.destinationName} (${mission.launchYear})`,
                  route: `/missions/${mission.id}`,
                  categoryBadge: 'Mission',
                });
              }}
              title={isFav ? 'Remove from Space Vault' : 'Save Mission'}
              className={`p-1 rounded-md border transition-all cursor-pointer ${
                isFav
                  ? 'bg-[#FFB45B]/20 border-[#FFB45B] text-[#FFB45B]'
                  : 'bg-[#10182B] border-[#141D30] text-[#98A7BF] hover:text-white'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-[#FFB45B]' : ''}`} />
            </button>
            {getStatusBadge()}
          </div>
        </div>

        {/* Mission Title */}
        <h3 className="font-headline text-xl font-bold text-[#F5F7FF] group-hover:text-[#20D9F2] transition-colors tracking-tight mb-1">
          {mission.name}
        </h3>

        {/* Destination & Date HUD */}
        <div className="flex items-center gap-4 text-xs font-mono text-[#98A7BF] mb-3">
          <div className="flex items-center gap-1.5 text-[#20D9F2]">
            <Compass className="w-3.5 h-3.5" />
            <span className="truncate max-w-[150px]">{mission.destinationName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#FFB45B]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{mission.launchYear}</span>
          </div>
        </div>

        {/* Summary Description */}
        <p className="font-body text-xs text-[#98A7BF] line-clamp-2 leading-relaxed mb-4">
          {mission.description}
        </p>

        {/* Key Milestone Snippet */}
        {highlightedMilestone && (
          <div className="bg-[#060B19]/80 border border-[#141D30] rounded-xl p-2.5 mb-4">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#20D9F2] uppercase font-bold mb-0.5">
              <Rocket className="w-3 h-3" />
              <span>Milestone: {highlightedMilestone.title}</span>
            </div>
            <p className="text-[11px] text-[#98A7BF] line-clamp-1 italic">
              "{highlightedMilestone.significance}"
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#141D30] mt-auto">
        <button
          onClick={() => onLaunchReplay(mission)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#20D9F2]/10 hover:bg-[#20D9F2]/20 border border-[#20D9F2]/30 text-[#20D9F2] text-xs font-headline font-bold uppercase transition-colors"
          title="Launch Mission Replay"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Replay</span>
        </button>

        <div className="flex items-center gap-2">
          {planetLink && (
            <button
              onClick={() => navigate(planetLink)}
              className="p-1.5 rounded-lg bg-[#10182B] hover:bg-[#141D30] text-[#98A7BF] hover:text-[#20D9F2] border border-[#141D30] transition-colors"
              title="View Associated Planet in 3D Explorer"
              aria-label="View Associated Planet"
            >
              <Globe className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => navigate(`/missions/${mission.id}`)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#10182B] hover:bg-[#141D30] border border-[#141D30] hover:border-[#8565FA]/50 text-xs font-headline font-bold uppercase text-[#F5F7FF] transition-colors"
          >
            <span>Dossier</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8565FA]" />
          </button>
        </div>
      </div>
    </div>
  );
};
