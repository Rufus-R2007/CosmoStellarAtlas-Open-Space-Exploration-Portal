import React from 'react';
import { Radio, Calendar, MapPin, Gauge } from 'lucide-react';
import { Rover } from '../../../../types';

interface RoverSelectorProps {
  rovers: Rover[];
  selectedRoverId: string;
  onSelectRover: (roverId: string) => void;
}

export const RoverSelector: React.FC<RoverSelectorProps> = ({
  rovers,
  selectedRoverId,
  onSelectRover,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-white sm:text-2xl">
            Select Exploration Rover
          </h2>
          <p className="font-sans text-xs text-[#98A7BF] sm:text-sm">
            Choose a robotic rover to inspect its engineering profile, Sol archives, camera captures, and traverse route.
          </p>
        </div>
        <div className="font-mono text-xs text-[#FFB45B]">
          {rovers.length} EXPLORERS AVAILABLE
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {rovers.map((rover) => {
          const isSelected = rover.id === selectedRoverId;
          const isActive = rover.status === 'Active';

          return (
            <button
              key={rover.id}
              onClick={() => onSelectRover(rover.id)}
              className={`group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D76B35] ${
                isSelected
                  ? 'border-[#D76B35] bg-[#1E0D08]/80 shadow-xl shadow-[#D76B35]/20 ring-1 ring-[#D76B35]'
                  : 'border-white/10 bg-[#0A1021]/80 hover:border-[#D76B35]/40 hover:bg-[#10182B]'
              }`}
            >
              {/* Card Top: Agency & Status */}
              <div>
                <div className="flex items-center justify-between gap-1 text-[11px]">
                  <span className="font-mono text-[#E3A66B]">{rover.agency}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] ${
                      isActive
                        ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : 'border border-white/10 bg-white/5 text-[#98A7BF]'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isActive ? 'bg-emerald-400 animate-pulse' : 'bg-[#98A7BF]'
                      }`}
                    />
                    {rover.status}
                  </span>
                </div>

                {/* Rover Name */}
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-[#D76B35] text-white'
                        : 'bg-white/5 text-[#98A7BF] group-hover:text-white'
                    }`}
                  >
                    <Radio className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-white group-hover:text-[#FFB45B] transition-colors">
                      {rover.name}
                    </h3>
                  </div>
                </div>

                {/* Short Description */}
                <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[#98A7BF]">
                  {rover.primaryMission}
                </p>
              </div>

              {/* Card Metrics & Landing Site */}
              <div className="mt-4 space-y-2 border-t border-white/5 pt-3 text-[11px] font-mono text-[#98A7BF]">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3 w-3 shrink-0 text-[#D76B35]" />
                  <span className="truncate text-white/90">{rover.landingRegion || rover.landingSite}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#20D9F2]" />
                    {new Date(rover.landingDate).getFullYear()} Landing
                  </span>
                  <span className="flex items-center gap-1 font-bold text-[#FFB45B]">
                    <Gauge className="h-3 w-3 text-[#FFB45B]" />
                    {rover.totalSols.toLocaleString()} Sols
                  </span>
                </div>
              </div>

              {/* Selection Accent Strip */}
              {isSelected && (
                <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-xl bg-gradient-to-r from-[#D76B35] via-[#FFB45B] to-[#D76B35]" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
