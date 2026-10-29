import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { cn } from '../../../../utils/cn';

export type PlanetSortOption = 'distance' | 'diameter' | 'orbit' | 'gravity';
export type PlanetClassificationFilter = 'all' | 'Terrestrial' | 'Gas Giant' | 'Ice Giant';

interface PlanetFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedClassification: PlanetClassificationFilter;
  onClassificationChange: (cat: PlanetClassificationFilter) => void;
  sortBy: PlanetSortOption;
  onSortChange: (sort: PlanetSortOption) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalAll: number;
}

export const PlanetFilters: React.FC<PlanetFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedClassification,
  onClassificationChange,
  sortBy,
  onSortChange,
  onResetFilters,
  totalFiltered,
  totalAll,
}) => {
  const isFiltered = searchTerm.trim() !== '' || selectedClassification !== 'all' || sortBy !== 'distance';

  return (
    <div className="bg-[#0A1021]/80 border border-[#141D30] rounded-xl p-3.5 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-[#98A7BF] absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter planets by name or characteristics..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-8 py-2 bg-[#060B19] border border-[#141D30] focus:border-[#20D9F2] rounded-lg text-xs font-body text-[#F5F7FF] placeholder-[#98A7BF] outline-none"
          aria-label="Filter planets"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-2.5 text-[#98A7BF] hover:text-white"
            aria-label="Clear search text"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Classification Pills & Sorting */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Classification Buttons */}
        <div className="flex rounded-lg bg-[#060B19] border border-[#141D30] p-0.5 text-[11px] font-telemetry uppercase">
          {(['all', 'Terrestrial', 'Gas Giant', 'Ice Giant'] as PlanetClassificationFilter[]).map((cat) => (
            <button
              key={cat}
              onClick={() => onClassificationChange(cat)}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors',
                selectedClassification === cat
                  ? 'bg-[#20D9F2] text-[#00363E] font-bold'
                  : 'text-[#98A7BF] hover:text-[#F5F7FF]'
              )}
            >
              {cat === 'all' ? 'All (8)' : cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 bg-[#060B19] border border-[#141D30] px-2.5 py-1.5 rounded-lg text-xs font-mono">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#20D9F2]" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as PlanetSortOption)}
            className="bg-transparent border-none text-[#F5F7FF] outline-none cursor-pointer text-xs"
            aria-label="Sort planets"
          >
            <option value="distance" className="bg-[#0A1021]">Distance from Sun</option>
            <option value="diameter" className="bg-[#0A1021]">Diameter (Largest)</option>
            <option value="orbit" className="bg-[#0A1021]">Orbital Year (Shortest)</option>
            <option value="gravity" className="bg-[#0A1021]">Surface Gravity</option>
          </select>
        </div>

        {/* Filter Count Indicator */}
        <span className="text-[11px] font-mono text-[#98A7BF] px-1 hidden lg:inline">
          {totalFiltered} of {totalAll}
        </span>

        {/* Reset Filters */}
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="px-2.5 py-1.5 rounded-lg bg-[#10182B] text-[#98A7BF] hover:text-[#20D9F2] border border-[#141D30] text-xs font-telemetry uppercase transition-colors"
            title="Reset Search and Classification Filters"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
