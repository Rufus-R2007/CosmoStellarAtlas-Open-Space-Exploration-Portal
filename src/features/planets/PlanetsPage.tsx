import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { spaceService } from '../../services';
import { Planet, Mission } from '../../types';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Globe } from 'lucide-react';
import { PlanetCanvas3D } from './components/viewer/PlanetCanvas3D';
import { ViewerControls } from './components/viewer/ViewerControls';
import { SolarSystemNavigator } from './components/navigator/SolarSystemNavigator';
import { PlanetInfoCenter } from './components/info/PlanetInfoCenter';
import { PlanetaryComparisonLab } from './components/comparison/PlanetaryComparisonLab';
import { ScaleExplorer } from './components/scale/ScaleExplorer';
import { PlanetRelatedMissions } from './components/missions/PlanetRelatedMissions';
import {
  PlanetFilters,
  PlanetClassificationFilter,
  PlanetSortOption,
} from './components/filters/PlanetFilters';
import { PlanetDiscoveryPassport } from './components/passport/PlanetDiscoveryPassport';

export const PlanetsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPlanetId = searchParams.get('id');

  const [planets, setPlanets] = useState<Planet[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active Selected Planet
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>(urlPlanetId || 'earth');

  // 3D Viewer State
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [quality, setQuality] = useState<'high' | 'low'>('high');
  const [forceFallback, setForceFallback] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Navigator View Mode
  const [navigatorMode, setNavigatorMode] = useState<'explore' | 'solarsystem'>('explore');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClassification, setSelectedClassification] =
    useState<PlanetClassificationFilter>('all');
  const [sortBy, setSortBy] = useState<PlanetSortOption>('distance');

  // Load Planet and Mission Datasets
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [planetsRes, missionsRes] = await Promise.all([
        spaceService.getPlanets(),
        spaceService.getMissions(),
      ]);
      setPlanets(planetsRes);
      setMissions(missionsRes);

      if (urlPlanetId && planetsRes.some((p) => p.id === urlPlanetId)) {
        setSelectedPlanetId(urlPlanetId);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load planetary survey records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync state if URL query param changes
  useEffect(() => {
    if (urlPlanetId && planets.some((p) => p.id === urlPlanetId)) {
      setSelectedPlanetId(urlPlanetId);
    }
  }, [urlPlanetId, planets]);

  const handleSelectPlanet = (id: string) => {
    setSelectedPlanetId(id);
    setSearchParams({ id });
  };

  // Filter and sort planets
  const filteredPlanets = useMemo(() => {
    let result = [...planets];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.codeName.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      );
    }

    if (selectedClassification !== 'all') {
      result = result.filter((p) => p.type === selectedClassification);
    }

    switch (sortBy) {
      case 'diameter':
        result.sort((a, b) => b.diameterKm - a.diameterKm);
        break;
      case 'orbit':
        result.sort((a, b) => a.orbitalPeriodDays - b.orbitalPeriodDays);
        break;
      case 'gravity':
        result.sort((a, b) => b.gravityEarthRel - a.gravityEarthRel);
        break;
      case 'distance':
      default:
        result.sort((a, b) => a.orderFromSun - b.orderFromSun);
        break;
    }

    return result;
  }, [planets, searchTerm, selectedClassification, sortBy]);

  const selectedPlanet = useMemo(() => {
    if (filteredPlanets.length === 0) return null;
    return filteredPlanets.find((p) => p.id === selectedPlanetId) || filteredPlanets[0];
  }, [filteredPlanets, selectedPlanetId]);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingState message="Calibrating 3D Planetarium & Spectrometry Shaders..." />
      </div>
    );
  }

  if (error || planets.length === 0) {
    return (
      <div className="py-24">
        <ErrorState
          title="Planetary Ephemeris Array Offline"
          message={error || 'Unable to retrieve solar system planetary dataset.'}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141D30] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#20D9F2] mb-1">
            <Globe className="w-4 h-4" />
            <span className="font-telemetry text-xs uppercase tracking-widest font-semibold">
              Deep Space Planetarium Array // Phase 2
            </span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#F5F7FF]">
            Interactive Planet Explorer
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#98A7BF] mt-1 max-w-2xl leading-relaxed">
            Survey all eight major worlds with procedural planetary rendering, atmospheric cross-sections, side-by-side comparison lab, and archival flight heritage.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className="font-mono text-xs text-[#20D9F2] bg-[#20D9F2]/10 border border-[#20D9F2]/30 px-3 py-1.5 rounded-lg font-semibold uppercase">
            8 WORLDS ACTIVE
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <PlanetFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedClassification={selectedClassification}
        onClassificationChange={setSelectedClassification}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={() => {
          setSearchTerm('');
          setSelectedClassification('all');
          setSortBy('distance');
        }}
        totalFiltered={filteredPlanets.length}
        totalAll={planets.length}
      />

      {/* Solar System Navigator Bar */}
      <SolarSystemNavigator
        planets={filteredPlanets.length > 0 ? filteredPlanets : planets}
        selectedPlanetId={selectedPlanetId}
        onSelectPlanet={handleSelectPlanet}
        viewMode={navigatorMode}
        onChangeViewMode={setNavigatorMode}
      />

      {/* Main Exploration Console Grid */}
      {selectedPlanet ? (
        <div className="space-y-6">
          {/* Main 3D Viewer & Information Center Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Center 3D Planetarium Viewer (7 Columns on Desktop, Full on Expanded) */}
            <div
              className={`flex flex-col justify-between bg-[#0A1021]/80 border border-[#141D30] rounded-2xl p-4 shadow-2xl relative overflow-hidden transition-all duration-300 ${
                isExpanded ? 'lg:col-span-12 min-h-[600px]' : 'lg:col-span-7 min-h-[480px]'
              }`}
            >
              {/* Top Viewer HUD Eyebrow */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: selectedPlanet.colorHex }}
                  />
                  <span className="font-mono text-xs uppercase text-[#F5F7FF] font-bold tracking-wider">
                    {selectedPlanet.name} // 3D VIEWPORT
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#98A7BF]">
                    Tilt: {selectedPlanet.axialTiltDegrees}°
                  </span>
                </div>
              </div>

              {/* 3D Planet Canvas */}
              <div className="flex-1 w-full flex items-center justify-center my-2 relative">
                <PlanetCanvas3D
                  planet={selectedPlanet}
                  isRotating={isRotating}
                  zoomLevel={zoomLevel}
                  quality={quality}
                  forceFallback={forceFallback}
                />
              </div>

              {/* Bottom Viewer Controls Toolbar */}
              <div className="flex items-center justify-between z-10 pt-2 border-t border-[#141D30]">
                <span className="text-[10px] font-mono text-[#98A7BF] hidden sm:inline">
                  Drag to rotate • Wheel to zoom
                </span>

                <ViewerControls
                  isRotating={isRotating}
                  onToggleRotation={() => setIsRotating(!isRotating)}
                  onZoomIn={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
                  onZoomOut={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                  onResetView={() => {
                    setZoomLevel(1.0);
                    setIsRotating(true);
                  }}
                  isExpanded={isExpanded}
                  onToggleExpanded={() => setIsExpanded(!isExpanded)}
                  quality={quality}
                  onToggleQuality={() =>
                    setQuality(quality === 'high' ? 'low' : 'high')
                  }
                  forceFallback={forceFallback}
                  onToggleFallback={() => setForceFallback(!forceFallback)}
                />
              </div>
            </div>

            {/* Right Information Center (5 Columns on Desktop) */}
            {!isExpanded && (
              <div className="lg:col-span-5 flex flex-col justify-between">
                <PlanetInfoCenter planet={selectedPlanet} />
              </div>
            )}
          </div>

          {/* Discovery Passport Card */}
          <PlanetDiscoveryPassport
            planet={selectedPlanet}
            allPlanets={planets}
            onSelectNextPlanet={handleSelectPlanet}
          />

          {/* Related Missions Section (with Cosmic Time Machine Integration) */}
          <PlanetRelatedMissions
            planet={selectedPlanet}
            allMissions={missions}
          />

          {/* Planetary Comparison Lab */}
          <PlanetaryComparisonLab
            planets={planets}
            initialPlanetAId={selectedPlanet.id}
            initialPlanetBId={selectedPlanet.suggestedNextPlanetId || 'mars'}
          />

          {/* Scale of the Solar System Explorer */}
          <ScaleExplorer planets={planets} />
        </div>
      ) : (
        <EmptyState
          title="No Matching Planet Found"
          message="Adjust or clear your search and classification filters to discover planetary worlds."
          action={
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedClassification('all');
                setSortBy('distance');
              }}
              className="px-4 py-2 rounded-lg bg-[#20D9F2] text-[#00363E] font-headline text-xs font-bold uppercase"
            >
              Reset Filters
            </button>
          }
        />
      )}
    </div>
  );
};
