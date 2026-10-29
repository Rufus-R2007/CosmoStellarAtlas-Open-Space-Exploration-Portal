import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  List,
  Eye,
  CheckCircle2,
  Lock,
  X,
  Globe,
  Scale,
  Rocket,
  Clock,
  Radio,
  ShieldAlert,
  Network,
  BookOpen,
  Vault,
  PenTool,
} from 'lucide-react';
import { Achievement } from '../../../types';
import { useVaultStore } from '../../../store/useVaultStore';
import { CONSTELLATION_EDGES } from '../../../services/achievementDefinitions';
import { Badge } from '../../../components/common/Badge';

export const ConstellationProgressSection: React.FC = () => {
  const achievements = useVaultStore((s) => s.achievements);
  const [viewMode, setViewMode] = useState<'constellation' | 'list'>('constellation');
  const [selectedAchievementId, setSelectedAchievementId] = useState<string | null>(null);

  const selectedAchievement = achievements.find((a) => a.id === selectedAchievementId);

  const unlockedCount = achievements.filter((a) => !!a.unlockedAt).length;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  // Map achievement map for fast lookup
  const achievementMap = new Map<string, Achievement>();
  achievements.forEach((a) => achievementMap.set(a.id, a));

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exploration':
        return '#20D9F2';
      case 'analysis':
        return '#FFB45B';
      case 'curriculum':
        return '#8565FA';
      case 'vault':
      default:
        return '#4EFA9D';
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-4 h-4 text-[#20D9F2]" />;
      case 'Scale':
        return <Scale className="w-4 h-4 text-[#FFB45B]" />;
      case 'Rocket':
        return <Rocket className="w-4 h-4 text-[#8565FA]" />;
      case 'Clock':
        return <Clock className="w-4 h-4 text-[#20D9F2]" />;
      case 'Radio':
        return <Radio className="w-4 h-4 text-[#FFB45B]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-[#FF5B5B]" />;
      case 'Network':
        return <Network className="w-4 h-4 text-[#20D9F2]" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-[#8565FA]" />;
      case 'Award':
        return <Award className="w-4 h-4 text-[#FFB45B]" />;
      case 'Vault':
        return <Vault className="w-4 h-4 text-[#4EFA9D]" />;
      case 'PenTool':
        return <PenTool className="w-4 h-4 text-[#8565FA]" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-4 h-4 text-[#20D9F2]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8565FA]" />
            <span>Explorer Constellation</span>
            <span className="text-xs font-mono font-normal text-[#20D9F2] bg-[#20D9F2]/10 border border-[#20D9F2]/30 px-2.5 py-0.5 rounded-full ml-1">
              {unlockedCount} of {totalCount} Stars Ignited ({progressPercent}%)
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Interactive celestial map linking exploration achievements across planetary science, mission history, and defense physics.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-black/40 border border-white/10 p-1 rounded-xl text-xs w-fit">
          <button
            onClick={() => setViewMode('constellation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'constellation'
                ? 'bg-white/15 text-white font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#20D9F2]" />
            <span>Starfield Map</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white/15 text-white font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5 text-[#8565FA]" />
            <span>Accessible List</span>
          </button>
        </div>
      </div>

      {viewMode === 'constellation' ? (
        /* Interactive SVG Constellation Canvas */
        <div className="relative rounded-2xl border border-white/15 bg-[#060B19] overflow-hidden shadow-2xl">
          {/* Subtle starfield particles */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]" />

          <svg
            viewBox="0 0 800 480"
            className="w-full h-auto max-h-[550px] select-none block"
          >
            <defs>
              {/* Radial glow for ignited stars */}
              <radialGradient id="glow-cyan" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#20D9F2" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#20D9F2" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#20D9F2" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow-violet" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8565FA" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8565FA" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8565FA" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="line-unlocked" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#20D9F2" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#8565FA" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Constellation Connection Edges */}
            {CONSTELLATION_EDGES.map(([srcId, tgtId], idx) => {
              const src = achievementMap.get(srcId);
              const tgt = achievementMap.get(tgtId);
              if (!src || !tgt) return null;

              const isBothUnlocked = !!src.unlockedAt && !!tgt.unlockedAt;

              return (
                <line
                  key={idx}
                  x1={src.constellationCoord.x}
                  y1={src.constellationCoord.y}
                  x2={tgt.constellationCoord.x}
                  y2={tgt.constellationCoord.y}
                  stroke={isBothUnlocked ? 'url(#line-unlocked)' : 'rgba(255, 255, 255, 0.12)'}
                  strokeWidth={isBothUnlocked ? 2 : 1}
                  strokeDasharray={isBothUnlocked ? undefined : '3 3'}
                  className={isBothUnlocked ? 'transition-all duration-500' : ''}
                />
              );
            })}

            {/* Constellation Star Nodes */}
            {achievements.map((ach) => {
              const isUnlocked = !!ach.unlockedAt;
              const isSelected = selectedAchievementId === ach.id;
              const color = getCategoryColor(ach.category);

              return (
                <g
                  key={ach.id}
                  transform={`translate(${ach.constellationCoord.x}, ${ach.constellationCoord.y})`}
                  onClick={() => setSelectedAchievementId(ach.id)}
                  className="cursor-pointer group"
                >
                  {/* Outer pulse aura for unlocked */}
                  {isUnlocked && (
                    <circle
                      r="22"
                      fill={ach.category === 'curriculum' ? 'url(#glow-violet)' : 'url(#glow-cyan)'}
                      className="animate-pulse"
                    />
                  )}

                  {/* Outer ring */}
                  <circle
                    r={isSelected ? 14 : 10}
                    fill="none"
                    stroke={isSelected ? '#FFFFFF' : isUnlocked ? color : 'rgba(255,255,255,0.25)'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all duration-300 group-hover:scale-125"
                  />

                  {/* Inner star core */}
                  <circle
                    r={isUnlocked ? 6 : 4}
                    fill={isUnlocked ? color : 'rgba(255,255,255,0.3)'}
                    className="transition-all duration-300"
                  />

                  {/* Star Label */}
                  <text
                    y={22}
                    textAnchor="middle"
                    fill={isUnlocked ? '#FFFFFF' : 'rgba(255,255,255,0.45)'}
                    fontSize="10"
                    fontFamily="monospace"
                    className="pointer-events-none transition-colors"
                  >
                    {ach.badgeCode}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Node Detail Popover */}
          {selectedAchievement && (
            <div className="absolute top-4 right-4 max-w-xs w-full p-4 rounded-xl border border-white/20 bg-[#0B1528]/95 backdrop-blur-md shadow-2xl z-20 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" className="font-mono text-[10px]">
                    {selectedAchievement.badgeCode}
                  </Badge>
                  <span className="text-[11px] font-mono text-gray-400 uppercase">
                    {selectedAchievement.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAchievementId(null)}
                  className="text-gray-400 hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">
                {selectedAchievement.title}
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed mb-3">
                {selectedAchievement.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>Requirement Progress</span>
                  <span className="text-white font-semibold">
                    {selectedAchievement.currentValue} / {selectedAchievement.targetValue}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round(selectedAchievement.progress * 100)}%`,
                      backgroundColor: getCategoryColor(selectedAchievement.category),
                    }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                {selectedAchievement.unlockedAt ? (
                  <span className="inline-flex items-center gap-1 text-[#20D9F2]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ignited: {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-gray-500">
                    <Lock className="w-3.5 h-3.5" />
                    Celestial Milestone Locked
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Accessible Structured List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'border-white/15 bg-[#0B1528]/80'
                    : 'border-white/5 bg-white/[0.02] opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      {getCategoryIcon(ach.iconName)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">
                        {ach.badgeCode} // {ach.category}
                      </span>
                      <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <Badge variant="cyan" className="text-[10px] flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-[#20D9F2]" />
                      Ignited
                    </Badge>
                  ) : (
                    <Badge variant="violet" className="text-[10px] flex items-center gap-1 font-mono opacity-60">
                      <Lock className="w-3 h-3" />
                      Locked
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-gray-300 leading-relaxed mb-3">{ach.description}</p>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <span>Progress</span>
                    <span>
                      {ach.currentValue} / {ach.targetValue}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round(ach.progress * 100)}%`,
                        backgroundColor: getCategoryColor(ach.category),
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

