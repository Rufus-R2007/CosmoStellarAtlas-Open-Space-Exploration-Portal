import React from 'react';
import { Compass, Eye, Sun } from 'lucide-react';
import { Planet } from '../../../../types';
import { cn } from '../../../../utils/cn';

interface SolarSystemNavigatorProps {
  planets: Planet[];
  selectedPlanetId: string;
  onSelectPlanet: (id: string) => void;
  viewMode: 'explore' | 'solarsystem';
  onChangeViewMode: (mode: 'explore' | 'solarsystem') => void;
}

export const SolarSystemNavigator: React.FC<SolarSystemNavigatorProps> = ({
  planets,
  selectedPlanetId,
  onSelectPlanet,
  viewMode,
  onChangeViewMode,
}) => {
  return (
    <div className="bg-[#0A1021]/80 border border-[#141D30] backdrop-blur-xl rounded-xl p-4 shadow-xl flex flex-col justify-between">
      {/* Navigator Header & Mode Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-[#141D30]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#20D9F2]" />
          <span className="font-telemetry text-xs uppercase tracking-wider text-[#F5F7FF] font-semibold">
            Orbital Astrogation Array
          </span>
        </div>

        <div className="flex rounded-lg bg-[#060B19] border border-[#141D30] p-0.5 text-[11px] font-telemetry uppercase">
          <button
            onClick={() => onChangeViewMode('explore')}
            className={cn(
              'px-2.5 py-1 rounded-md transition-colors flex items-center gap-1',
              viewMode === 'explore'
                ? 'bg-[#20D9F2] text-[#00363E] font-bold'
                : 'text-[#98A7BF] hover:text-[#F5F7FF]'
            )}
            title="Focus 3D View on Selected World"
          >
            <Eye className="w-3 h-3" />
            <span>Explore</span>
          </button>
          <button
            onClick={() => onChangeViewMode('solarsystem')}
            className={cn(
              'px-2.5 py-1 rounded-md transition-colors flex items-center gap-1',
              viewMode === 'solarsystem'
                ? 'bg-[#20D9F2] text-[#00363E] font-bold'
                : 'text-[#98A7BF] hover:text-[#F5F7FF]'
            )}
            title="Schematic Overview of the 8 Concentric Orbits"
          >
            <Sun className="w-3 h-3 text-[#FFB45B]" />
            <span>Solar Map</span>
          </button>
        </div>
      </div>

      {/* View Mode 1: Explore Planet List / Selector */}
      {viewMode === 'explore' && (
        <div className="py-3 space-y-1.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {planets.map((p) => {
              const isSelected = p.id === selectedPlanetId;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPlanet(p.id)}
                  className={cn(
                    'flex flex-col items-center p-2 rounded-lg border text-center transition-all cursor-pointer group',
                    isSelected
                      ? 'bg-[#10182B] border-[#20D9F2] shadow-[0_0_14px_rgba(32,217,242,0.25)]'
                      : 'bg-[#060B19]/60 border-[#141D30] hover:border-[#20D9F2]/40 hover:bg-[#10182B]'
                  )}
                  aria-pressed={isSelected}
                >
                  <span
                    className={cn(
                      'w-4 h-4 rounded-full mb-1 transition-transform group-hover:scale-110',
                      isSelected ? 'ring-2 ring-[#20D9F2]' : ''
                    )}
                    style={{ backgroundColor: p.colorHex }}
                  />
                  <span
                    className={cn(
                      'font-headline text-xs font-semibold uppercase block truncate w-full',
                      isSelected ? 'text-[#20D9F2]' : 'text-[#F5F7FF]'
                    )}
                  >
                    {p.name}
                  </span>
                  <span className="font-mono text-[9px] text-[#98A7BF] block">
                    {p.distanceFromSunAU} AU
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* View Mode 2: Solar System Schematic Orbit Map */}
      {viewMode === 'solarsystem' && (
        <div className="py-4 flex flex-col items-center">
          <div className="relative w-full max-w-2xl aspect-[2/1] sm:aspect-[2.5/1] flex items-center justify-center bg-[#060B19]/90 border border-[#141D30] rounded-xl overflow-hidden p-2">
            {/* The Sun in Center */}
            <div className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-[#FFB45B] to-[#FFDCBA] shadow-[0_0_24px_#FFB45B] flex items-center justify-center z-10">
              <span className="text-[8px] font-headline font-bold text-[#482900]">SUN</span>
            </div>

            {/* 8 Elliptical Orbit Rings */}
            {planets.map((p, idx) => {
              const isSelected = p.id === selectedPlanetId;
              const radiusPercent = 18 + idx * 10; // scaled illustrative radii
              return (
                <div
                  key={p.id}
                  style={{
                    width: `${radiusPercent * 2}%`,
                    height: `${radiusPercent * 1.1}%`,
                  }}
                  className={cn(
                    'absolute rounded-full border pointer-events-none transition-colors',
                    isSelected
                      ? 'border-[#20D9F2] shadow-[0_0_12px_rgba(32,217,242,0.4)]'
                      : 'border-[#141D30]/80'
                  )}
                >
                  {/* Planet Node positioned on its orbit */}
                  <button
                    onClick={() => onSelectPlanet(p.id)}
                    style={{
                      left: '85%',
                      top: '15%',
                    }}
                    className={cn(
                      'absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-auto p-1 cursor-pointer transition-transform group',
                      isSelected ? 'scale-125' : 'hover:scale-110'
                    )}
                    title={`${p.name} (${p.distanceFromSunAU} AU)`}
                  >
                    <span
                      className="block w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: p.colorHex }}
                    />
                    <span
                      className={cn(
                        'absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase whitespace-nowrap px-1 rounded bg-[#0A1021] border border-[#141D30]',
                        isSelected ? 'text-[#20D9F2] border-[#20D9F2]/40 font-bold' : 'text-[#98A7BF]'
                      )}
                    >
                      {p.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          <span className="mt-2 text-[10px] font-mono text-[#98A7BF]/80 italic">
            Illustrative visualization — not to scale.
          </span>
        </div>
      )}
    </div>
  );
};

