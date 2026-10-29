import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Sliders,
  Compass,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { Asteroid } from '../../../../types';

interface AsteroidExplorerSectionProps {
  asteroids: Asteroid[];
  selectedAsteroidId: string | null;
  onSelectAsteroid: (asteroidId: string) => void;
  onOpenDetailModal: (asteroid: Asteroid) => void;
  onLoadIntoWhatIfLab: (asteroid: Asteroid) => void;
}

type SortOption =
  | 'closest-approach'
  | 'largest-diameter'
  | 'highest-velocity'
  | 'earliest-date'
  | 'latest-date';

export const AsteroidExplorerSection: React.FC<AsteroidExplorerSectionProps> = ({
  asteroids,
  selectedAsteroidId,
  onSelectAsteroid,
  onOpenDetailModal,
  onLoadIntoWhatIfLab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrbitClass, setSelectedOrbitClass] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDiameterRange, setSelectedDiameterRange] = useState<string>('all');
  const [selectedDistanceRange, setSelectedDistanceRange] = useState<string>('all');
  const [selectedVelocityRange, setSelectedVelocityRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('closest-approach');

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedOrbitClass('all');
    setSelectedCategory('all');
    setSelectedDiameterRange('all');
    setSelectedDistanceRange('all');
    setSelectedVelocityRange('all');
    setSortBy('closest-approach');
  };

  const filteredAsteroids = useMemo(() => {
    return asteroids
      .filter((a) => {
        // Free text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = a.name.toLowerCase().includes(q);
          const matchDesignation = a.designation.toLowerCase().includes(q);
          const matchCategory =
            a.syntheticCategory?.toLowerCase().includes(q) ||
            a.observationCategory?.toLowerCase().includes(q);
          const matchComposition = a.composition.toLowerCase().includes(q);
          if (!matchName && !matchDesignation && !matchCategory && !matchComposition) {
            return false;
          }
        }

        // Orbit class filter
        if (selectedOrbitClass !== 'all') {
          if (a.orbitClass.toLowerCase() !== selectedOrbitClass.toLowerCase()) {
            return false;
          }
        }

        // Synthetic category filter
        if (selectedCategory !== 'all') {
          if (
            a.syntheticCategory?.toLowerCase() !== selectedCategory.toLowerCase() &&
            a.observationCategory?.toLowerCase() !== selectedCategory.toLowerCase()
          ) {
            return false;
          }
        }

        // Diameter range filter
        const meanD = a.estimatedDiameterMeanM ?? a.estimatedDiameterMeters;
        if (selectedDiameterRange === 'small' && meanD >= 50) return false;
        if (selectedDiameterRange === 'medium' && (meanD < 50 || meanD > 140)) return false;
        if (selectedDiameterRange === 'large' && (meanD <= 140 || meanD > 500)) return false;
        if (selectedDiameterRange === 'massive' && meanD <= 500) return false;

        // Miss distance range filter (Lunar Distances)
        if (selectedDistanceRange === 'sub-lunar' && a.missDistanceLunar >= 1.0) return false;
        if (selectedDistanceRange === 'close' && (a.missDistanceLunar < 1.0 || a.missDistanceLunar > 5.0)) return false;
        if (selectedDistanceRange === 'mid' && (a.missDistanceLunar <= 5.0 || a.missDistanceLunar > 10.0)) return false;
        if (selectedDistanceRange === 'distant' && a.missDistanceLunar <= 10.0) return false;

        // Relative velocity range filter
        if (selectedVelocityRange === 'low' && a.relativeVelocityKmS >= 15.0) return false;
        if (selectedVelocityRange === 'moderate' && (a.relativeVelocityKmS < 15.0 || a.relativeVelocityKmS > 25.0)) return false;
        if (selectedVelocityRange === 'high' && a.relativeVelocityKmS <= 25.0) return false;

        return true;
      })
      .sort((a, b) => {
        const dA = a.estimatedDiameterMeanM ?? a.estimatedDiameterMeters;
        const dB = b.estimatedDiameterMeanM ?? b.estimatedDiameterMeters;

        switch (sortBy) {
          case 'closest-approach':
            return a.missDistanceKm - b.missDistanceKm;
          case 'largest-diameter':
            return dB - dA;
          case 'highest-velocity':
            return b.relativeVelocityKmS - a.relativeVelocityKmS;
          case 'earliest-date':
            return a.closeApproachDate.localeCompare(b.closeApproachDate);
          case 'latest-date':
            return b.closeApproachDate.localeCompare(a.closeApproachDate);
          default:
            return a.missDistanceKm - b.missDistanceKm;
        }
      });
  }, [
    asteroids,
    searchQuery,
    selectedOrbitClass,
    selectedCategory,
    selectedDiameterRange,
    selectedDistanceRange,
    selectedVelocityRange,
    sortBy,
  ]);

  return (
    <section id="asteroid-explorer" className="mb-12 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan">EXPERIENCE A</Badge>
            <span className="text-xs font-mono uppercase tracking-widest text-[#20D9F2]">
              NEAR-EARTH ENCOUNTER CATALOG
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
            Interactive Asteroid Explorer
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-xl">
            Filter, search, and inspect 42 synthetic asteroid encounters and 8 curated
            historical benchmarks across orbital geometry, diameter, and velocity.
          </p>
        </div>

        {/* Total Results & Reset */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            Showing <strong className="text-[#20D9F2]">{filteredAsteroids.length}</strong> of{' '}
            {asteroids.length} Records
          </span>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-mono transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Matrix */}
      <div className="rounded-2xl border border-white/10 bg-[#0A1021] p-4 lg:p-6 mb-6 shadow-xl">
        {/* Top Search & Primary Sort Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* Free Text Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by designation (e.g. SIM-2026-001, Apophis), category, or composition..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#060B19] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#20D9F2] focus:ring-1 focus:ring-[#20D9F2] transition-colors"
            />
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-[#060B19] text-sm text-white focus:outline-none focus:border-[#20D9F2] cursor-pointer"
            >
              <option value="closest-approach">Sort by: Closest Miss Distance</option>
              <option value="largest-diameter">Sort by: Largest Diameter</option>
              <option value="highest-velocity">Sort by: Highest Velocity</option>
              <option value="earliest-date">Sort by: Earliest Encounter Date</option>
              <option value="latest-date">Sort by: Latest Encounter Date</option>
            </select>
          </div>
        </div>

        {/* Secondary Detailed Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-white/5 text-xs">
          {/* Orbit Class */}
          <div>
            <label className="block text-gray-400 font-mono mb-1">Orbit Class</label>
            <select
              value={selectedOrbitClass}
              onChange={(e) => setSelectedOrbitClass(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#060B19] text-gray-200 focus:outline-none focus:border-[#20D9F2]"
            >
              <option value="all">All Classes</option>
              <option value="apollo">Apollo (Earth-Crossing)</option>
              <option value="aten">Aten (Period &lt; 1 yr)</option>
              <option value="amor">Amor (External)</option>
              <option value="atira">Atira (Interior)</option>
            </select>
          </div>

          {/* Synthetic Category */}
          <div>
            <label className="block text-gray-400 font-mono mb-1">Encounter Type</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#060B19] text-gray-200 focus:outline-none focus:border-[#20D9F2]"
            >
              <option value="all">All Categories</option>
              <option value="sub-lunar encounter">Sub-Lunar (&lt;1 LD)</option>
              <option value="potentially hazardous scenario">Potentially Hazardous</option>
              <option value="safe distant flyby">Safe Distant Flyby</option>
              <option value="high velocity flyby">High Velocity (&gt;25 km/s)</option>
            </select>
          </div>

          {/* Diameter Range */}
          <div>
            <label className="block text-gray-400 font-mono mb-1">Estimated Size</label>
            <select
              value={selectedDiameterRange}
              onChange={(e) => setSelectedDiameterRange(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#060B19] text-gray-200 focus:outline-none focus:border-[#20D9F2]"
            >
              <option value="all">All Sizes</option>
              <option value="small">Small (&lt; 50m)</option>
              <option value="medium">Medium (50m – 140m)</option>
              <option value="large">Large (140m – 500m)</option>
              <option value="massive">Major (&gt; 500m)</option>
            </select>
          </div>

          {/* Miss Distance Range */}
          <div>
            <label className="block text-gray-400 font-mono mb-1">Miss Distance</label>
            <select
              value={selectedDistanceRange}
              onChange={(e) => setSelectedDistanceRange(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#060B19] text-gray-200 focus:outline-none focus:border-[#20D9F2]"
            >
              <option value="all">All Distances</option>
              <option value="sub-lunar">Sub-Lunar (&lt; 1.0 LD)</option>
              <option value="close">Close (1.0 – 5.0 LD)</option>
              <option value="mid">Mid-Range (5.0 – 10.0 LD)</option>
              <option value="distant">Distant (&gt; 10.0 LD)</option>
            </select>
          </div>

          {/* Relative Velocity Range */}
          <div>
            <label className="block text-gray-400 font-mono mb-1">Velocity</label>
            <select
              value={selectedVelocityRange}
              onChange={(e) => setSelectedVelocityRange(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#060B19] text-gray-200 focus:outline-none focus:border-[#20D9F2]"
            >
              <option value="all">All Velocities</option>
              <option value="low">Slow (&lt; 15 km/s)</option>
              <option value="moderate">Moderate (15 – 25 km/s)</option>
              <option value="high">Fast (&gt; 25 km/s)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asteroids Grid */}
      {filteredAsteroids.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0A1021] p-12 text-center">
          <ShieldAlert className="w-12 h-12 text-[#FFB45B] mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-2">
            No Asteroid Encounters Found
          </h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
            No synthetic encounter records matched the active filter criteria. Try
            relaxing search terms or clearing specific ranges.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg bg-[#20D9F2] text-[#060B19] font-bold text-xs uppercase tracking-wide hover:bg-[#20D9F2]/90 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAsteroids.map((asteroid) => {
            const meanDiameter =
              asteroid.estimatedDiameterMeanM ?? asteroid.estimatedDiameterMeters;
            const isSelected = selectedAsteroidId === asteroid.id;

            return (
              <div
                key={asteroid.id}
                className={`rounded-xl border transition-all p-5 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#20D9F2] bg-[#10182B] shadow-lg shadow-[#20D9F2]/10 ring-1 ring-[#20D9F2]'
                    : 'border-white/10 bg-[#0A1021] hover:border-[#20D9F2]/50 hover:bg-[#10182B]/60'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-[#20D9F2] tracking-wider">
                      {asteroid.designation}
                    </span>
                    <Badge variant={asteroid.source === 'curated' ? 'curated' : 'synthetic'}>
                      {asteroid.source === 'curated' ? 'CURATED' : 'SYNTHETIC'}
                    </Badge>
                  </div>

                  {/* Title / Name */}
                  <h3 className="text-base font-bold text-white mb-2 line-clamp-1">
                    {asteroid.name}
                  </h3>

                  {/* Classification Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                      {asteroid.orbitClass} Class
                    </span>
                    <span className="text-[11px] font-mono text-gray-400 truncate max-w-[150px]">
                      {asteroid.syntheticCategory || asteroid.observationCategory}
                    </span>
                  </div>

                  {/* Telemetry Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-3 rounded-lg bg-[#060B19]/70 border border-white/5">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">
                        Estimated Diameter
                      </span>
                      <span className="font-mono font-bold text-white">
                        {meanDiameter} m
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">
                        Approach Date
                      </span>
                      <span className="font-mono text-gray-200">
                        {asteroid.closeApproachDate}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">
                        Miss Distance
                      </span>
                      <span className="font-mono font-bold text-[#FFB45B]">
                        {asteroid.missDistanceLunar.toFixed(2)} LD
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        ({(asteroid.missDistanceKm / 1000).toFixed(0)}k km)
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">
                        Velocity
                      </span>
                      <span className="font-mono font-bold text-[#8565FA]">
                        {asteroid.relativeVelocityKmS.toFixed(1)} km/s
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => onOpenDetailModal(asteroid)}
                    className="flex-1 py-2 px-3 rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-gray-200 hover:text-white hover:bg-white/10 transition-colors text-center cursor-pointer"
                  >
                    Inspect Details
                  </button>

                  <button
                    onClick={() => {
                      onSelectAsteroid(asteroid.id);
                      onLoadIntoWhatIfLab(asteroid);
                    }}
                    title="Load into What-If Simulation Lab"
                    className="flex items-center justify-center p-2 rounded-lg border border-[#FFB45B]/40 bg-[#FFB45B]/10 text-[#FFB45B] hover:bg-[#FFB45B]/20 transition-colors cursor-pointer"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectAsteroid(asteroid.id)}
                    title="Focus in Orbital Encounter Canvas"
                    className={`flex items-center justify-center p-2 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#20D9F2] bg-[#20D9F2] text-[#060B19]'
                        : 'border-[#20D9F2]/30 bg-[#20D9F2]/10 text-[#20D9F2] hover:bg-[#20D9F2]/20'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
