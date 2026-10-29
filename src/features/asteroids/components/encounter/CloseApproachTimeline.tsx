import React, { useMemo } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { Asteroid } from '../../../../types';

interface CloseApproachTimelineProps {
  asteroids: Asteroid[];
  selectedAsteroidId: string | null;
  onSelectAsteroid: (asteroidId: string) => void;
  onOpenDetailModal: (asteroid: Asteroid) => void;
  onLoadIntoWhatIfLab: (asteroid: Asteroid) => void;
}

export const CloseApproachTimeline: React.FC<CloseApproachTimelineProps> = ({
  asteroids,
  selectedAsteroidId,
  onSelectAsteroid,
  onOpenDetailModal,
  onLoadIntoWhatIfLab,
}) => {
  // Sort encounters chronologically by approach date
  const chronologicalAsteroids = useMemo(() => {
    return [...asteroids].sort((a, b) =>
      a.closeApproachDate.localeCompare(b.closeApproachDate)
    );
  }, [asteroids]);

  const currentIndex = chronologicalAsteroids.findIndex(
    (a) => a.id === selectedAsteroidId
  );
  const activeAsteroid =
    currentIndex >= 0 ? chronologicalAsteroids[currentIndex] : chronologicalAsteroids[0];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onSelectAsteroid(chronologicalAsteroids[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < chronologicalAsteroids.length - 1) {
      onSelectAsteroid(chronologicalAsteroids[currentIndex + 1].id);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A1021] p-5 lg:p-6 mb-12 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#20D9F2]" />
            Close-Approach Chronological Timeline
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Step through near-Earth encounter records in chronological sequence (2026–2035).
          </p>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex <= 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-gray-200 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Encounter
          </button>
          <span className="text-xs font-mono text-gray-400 px-2">
            {currentIndex >= 0 ? currentIndex + 1 : 1} / {chronologicalAsteroids.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex >= chronologicalAsteroids.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-gray-200 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next Encounter
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Timeline Scrubber */}
      <div className="relative mb-6 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20">
        <div className="flex items-center gap-2 min-w-max py-2 px-1">
          {chronologicalAsteroids.slice(0, 30).map((ast) => {
            const isSelected = ast.id === activeAsteroid?.id;
            const isSubLunar = ast.missDistanceLunar < 1.0;

            return (
              <button
                key={ast.id}
                onClick={() => onSelectAsteroid(ast.id)}
                className={`flex flex-col items-center p-2.5 rounded-xl border transition-all text-left cursor-pointer min-w-[125px] ${
                  isSelected
                    ? 'border-[#20D9F2] bg-[#10182B] shadow-md shadow-[#20D9F2]/20 scale-105'
                    : 'border-white/10 bg-[#060B19] hover:border-[#20D9F2]/40 hover:bg-[#10182B]/40'
                }`}
              >
                <span className="text-[10px] font-mono text-gray-400">
                  {ast.closeApproachDate}
                </span>
                <span className="text-xs font-bold font-mono text-white mt-1 truncate max-w-[110px]">
                  {ast.designation}
                </span>
                <div className="flex items-center gap-1 mt-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSubLunar ? 'bg-[#FFB45B]' : 'bg-[#20D9F2]'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-mono ${
                      isSubLunar ? 'text-[#FFB45B]' : 'text-gray-300'
                    }`}
                  >
                    {ast.missDistanceLunar.toFixed(2)} LD
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Encounter Highlight Card */}
      {activeAsteroid && (
        <div className="rounded-xl border border-[#20D9F2]/30 bg-[#10182B]/80 p-4 lg:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#20D9F2]">
                SELECTED EVENT: {activeAsteroid.closeApproachDate}
              </span>
              <Badge variant={activeAsteroid.source === 'curated' ? 'curated' : 'synthetic'}>
                {activeAsteroid.source === 'curated' ? 'CURATED' : 'SYNTHETIC'}
              </Badge>
              {activeAsteroid.missDistanceLunar < 1.0 && (
                <Badge variant="gold">SUB-LUNAR FLYBY</Badge>
              )}
            </div>

            <h4 className="text-lg font-bold text-white mb-1">
              {activeAsteroid.name}
            </h4>

            <p className="text-xs text-gray-300 max-w-2xl line-clamp-2">
              {activeAsteroid.scenarioDescription || activeAsteroid.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-mono">
              <span className="text-gray-400">
                Miss Distance:{' '}
                <strong className="text-white">
                  {activeAsteroid.missDistanceLunar.toFixed(3)} LD (
                  {activeAsteroid.missDistanceKm.toLocaleString()} km)
                </strong>
              </span>
              <span className="text-gray-400">
                Velocity:{' '}
                <strong className="text-[#8565FA]">
                  {activeAsteroid.relativeVelocityKmS.toFixed(1)} km/s
                </strong>
              </span>
              <span className="text-gray-400">
                Estimated Diameter:{' '}
                <strong className="text-[#20D9F2]">
                  {activeAsteroid.estimatedDiameterMeanM ?? activeAsteroid.estimatedDiameterMeters} m
                </strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenDetailModal(activeAsteroid)}
              className="px-3.5 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Inspect Details
            </button>
            <button
              onClick={() => onLoadIntoWhatIfLab(activeAsteroid)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FFB45B] text-[#060B19] font-bold text-xs hover:bg-[#FFB45B]/90 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              Test in What-If Lab
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
