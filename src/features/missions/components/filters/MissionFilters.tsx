import React from 'react';
import { Search, RotateCcw, Clock, Compass, Layers, Building2, SlidersHorizontal } from 'lucide-react';

interface MissionFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedAgency: string;
  onAgencyChange: (agency: string) => void;
  selectedDestination: string;
  onDestinationChange: (dest: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedDecade: string;
  onDecadeChange: (decade: string) => void;
  syncTimelineYear: boolean;
  onToggleSyncTimelineYear: () => void;
  activeTimelineYear: number;
  sortBy: 'launch-desc' | 'launch-asc' | 'name';
  onSortChange: (sort: 'launch-desc' | 'launch-asc' | 'name') => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalAll: number;
}

const agencies = [
  { id: 'all', label: 'All Agencies' },
  { id: 'NASA', label: 'NASA' },
  { id: 'Soviet', label: 'Soviet / Roscosmos' },
  { id: 'ESA', label: 'ESA' },
  { id: 'ISRO', label: 'ISRO' },
];

const destinations = [
  { id: 'all', label: 'All Targets' },
  { id: 'moon', label: 'The Moon' },
  { id: 'mars', label: 'Mars' },
  { id: 'earth', label: 'Earth / LEO' },
  { id: 'jupiter', label: 'Jupiter' },
  { id: 'saturn', label: 'Saturn' },
  { id: 'neptune', label: 'Neptune & Uranus' },
  { id: 'sun', label: 'The Sun' },
];

const types = [
  { id: 'all', label: 'All Types' },
  { id: 'Crewed', label: 'Crewed' },
  { id: 'Orbiter', label: 'Orbiter' },
  { id: 'Rover', label: 'Rover' },
  { id: 'Flyby', label: 'Flyby' },
  { id: 'Space Observatory', label: 'Observatory' },
  { id: 'Lander', label: 'Lander' },
  { id: 'Impactor', label: 'Impactor' },
];

const decades = [
  { id: 'all', label: 'All Decades' },
  { id: '1950s', label: '1950s' },
  { id: '1960s', label: '1960s' },
  { id: '1970s', label: '1970s' },
  { id: '1990s', label: '1990s' },
  { id: '2000s', label: '2000s' },
  { id: '2010s', label: '2010s' },
  { id: '2020s', label: '2020s' },
];

export const MissionFilters: React.FC<MissionFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedAgency,
  onAgencyChange,
  selectedDestination,
  onDestinationChange,
  selectedType,
  onTypeChange,
  selectedDecade,
  onDecadeChange,
  syncTimelineYear,
  onToggleSyncTimelineYear,
  activeTimelineYear,
  sortBy,
  onSortChange,
  onResetFilters,
  totalFiltered,
  totalAll,
}) => {
  return (
    <div className="bg-[#0A1021] border border-[#141D30] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Top Search Input & Sort Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#98A7BF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search missions by name, agency, objectives, or targets..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#060B19] border border-[#141D30] rounded-xl text-xs sm:text-sm text-[#F5F7FF] placeholder-[#98A7BF]/60 focus:outline-none focus:border-[#20D9F2] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#98A7BF] hover:text-[#F5F7FF]"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Sort & Sync Year Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* Synchronized Timeline Year Toggle */}
          <button
            onClick={onToggleSyncTimelineYear}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-headline font-bold uppercase transition-all border ${
              syncTimelineYear
                ? 'bg-[#8565FA]/20 border-[#8565FA] text-[#F5F7FF] shadow-lg shadow-[#8565FA]/10'
                : 'bg-[#060B19] border-[#141D30] text-[#98A7BF] hover:border-[#8565FA]/40 hover:text-[#F5F7FF]'
            }`}
            title="Filter missions up to active Time Machine year"
          >
            <Clock className="w-3.5 h-3.5 text-[#8565FA]" />
            <span>Epoch ≤ {activeTimelineYear}</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-[#060B19] border border-[#141D30] rounded-xl px-3 py-2 text-xs font-mono text-[#98A7BF]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#20D9F2]" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-[#F5F7FF] focus:outline-none cursor-pointer"
            >
              <option value="launch-desc" className="bg-[#0A1021]">
                Launch Date (Newest)
              </option>
              <option value="launch-asc" className="bg-[#0A1021]">
                Launch Date (Oldest)
              </option>
              <option value="name" className="bg-[#0A1021]">
                Mission Name (A-Z)
              </option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#10182B] hover:bg-[#141D30] border border-[#141D30] text-xs font-headline font-bold uppercase text-[#98A7BF] hover:text-[#F5F7FF] transition-colors"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Filter Row 1: Decade & Agency Pills */}
      <div className="space-y-2.5 pt-2 border-t border-[#141D30]/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Decade Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-mono text-[#98A7BF] uppercase shrink-0 mr-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#FFB45B]" />
              Decade:
            </span>
            {decades.map((dec) => (
              <button
                key={dec.id}
                onClick={() => onDecadeChange(dec.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                  selectedDecade === dec.id
                    ? 'bg-[#FFB45B] text-[#3E2300] font-bold'
                    : 'bg-[#060B19] text-[#98A7BF] hover:text-[#F5F7FF] hover:bg-[#10182B]'
                }`}
              >
                {dec.label}
              </button>
            ))}
          </div>

          {/* Records Counter */}
          <span className="text-xs font-mono text-[#98A7BF] shrink-0 self-end sm:self-auto">
            Showing <strong className="text-[#20D9F2]">{totalFiltered}</strong> of{' '}
            <strong className="text-[#F5F7FF]">{totalAll}</strong> missions
          </span>
        </div>

        {/* Filter Row 2: Agency & Destination & Type Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Agency Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-mono text-[#98A7BF] uppercase flex items-center gap-1 mr-1">
              <Building2 className="w-3 h-3 text-[#20D9F2]" />
              Agency:
            </span>
            {agencies.map((ag) => (
              <button
                key={ag.id}
                onClick={() => onAgencyChange(ag.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                  selectedAgency === ag.id
                    ? 'bg-[#20D9F2] text-[#00363E] font-bold'
                    : 'bg-[#060B19] text-[#98A7BF] hover:text-[#F5F7FF] hover:bg-[#10182B]'
                }`}
              >
                {ag.label}
              </button>
            ))}
          </div>

          {/* Destination Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#060B19] border border-[#141D30] rounded-lg px-2.5 py-1 text-xs font-mono text-[#98A7BF]">
            <Compass className="w-3 h-3 text-[#8565FA]" />
            <select
              value={selectedDestination}
              onChange={(e) => onDestinationChange(e.target.value)}
              className="bg-transparent text-[#F5F7FF] focus:outline-none cursor-pointer"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#0A1021]">
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mission Type Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#060B19] border border-[#141D30] rounded-lg px-2.5 py-1 text-xs font-mono text-[#98A7BF]">
            <Layers className="w-3 h-3 text-[#FFB45B]" />
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="bg-transparent text-[#F5F7FF] focus:outline-none cursor-pointer"
            >
              {types.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#0A1021]">
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
