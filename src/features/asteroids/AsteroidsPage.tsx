import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  Sliders,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { spaceService } from '../../services';
import { Asteroid } from '../../types';
import { AsteroidWatchHero } from './components/hero/AsteroidWatchHero';
import { OrbitalEncounterCanvas } from './components/encounter/OrbitalEncounterCanvas';
import { CloseApproachTimeline } from './components/encounter/CloseApproachTimeline';
import { AsteroidExplorerSection } from './components/explorer/AsteroidExplorerSection';
import { AsteroidDetailModal } from './components/explorer/AsteroidDetailModal';
import { PlanetaryDefenseWhatIfLab } from './components/whatif/PlanetaryDefenseWhatIfLab';
import { PlanetaryDefenseEducationPanel } from './components/education/PlanetaryDefenseEducationPanel';
import { Badge } from '../../components/common/Badge';

export const AsteroidsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const selectedAsteroidId = useAppStore((state) => state.selectedAsteroidId);
  const setSelectedAsteroidId = useAppStore((state) => state.setSelectedAsteroidId);
  const inspectingAsteroidId = useAppStore((state) => state.inspectingAsteroidId);
  const setInspectingAsteroidId = useAppStore((state) => state.setInspectingAsteroidId);

  const whatIfParameters = useAppStore((state) => state.whatIfParameters);
  const setWhatIfParameters = useAppStore((state) => state.setWhatIfParameters);
  const resetWhatIfParameters = useAppStore((state) => state.resetWhatIfParameters);

  // Load asteroids from data service
  const loadAsteroids = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await spaceService.getAsteroids();
      setAsteroids(data);

      // Verify or default selected asteroid
      const queryId = searchParams.get('id');
      if (queryId && data.some((a) => a.id.toLowerCase() === queryId.toLowerCase())) {
        setSelectedAsteroidId(queryId.toLowerCase());
      } else if (!selectedAsteroidId && data.length > 0) {
        setSelectedAsteroidId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve Near-Earth Object data records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAsteroids();
  }, []);

  // Sync URL search params when selectedAsteroidId changes
  useEffect(() => {
    if (selectedAsteroidId) {
      const currentParamId = searchParams.get('id');
      if (currentParamId !== selectedAsteroidId) {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('id', selectedAsteroidId);
        setSearchParams(nextParams, { replace: true });
      }
    }
  }, [selectedAsteroidId, searchParams, setSearchParams]);

  // Handle asteroid selection
  const handleSelectAsteroid = (id: string) => {
    setSelectedAsteroidId(id);
  };

  // Smooth scroll helper
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Convert asteroid physical characteristics to What-If simulation parameters
  const handleLoadIntoWhatIfLab = (asteroid: Asteroid) => {
    const diameter = Math.round(
      Math.max(10, Math.min(1000, asteroid.estimatedDiameterMeanM ?? asteroid.estimatedDiameterMeters))
    );
    const velocity = Number(
      Math.max(5, Math.min(40, asteroid.relativeVelocityKmS)).toFixed(1)
    );

    // Approximate density by orbit class if unknown
    let density = 2500;
    if (asteroid.orbitClass.toLowerCase().includes('aten')) density = 2600;
    else if (asteroid.orbitClass.toLowerCase().includes('amor')) density = 2200;
    else if (asteroid.orbitClass.toLowerCase().includes('atira')) density = 2800;

    const missDistance = Math.round(asteroid.missDistanceKm);

    setWhatIfParameters({
      diameterM: diameter,
      velocityKmS: velocity,
      densityKgM3: density,
      illustrativeMissDistanceKm: missDistance,
    });

    handleScrollToSection('whatif');
  };

  // Active inspected asteroid object
  const inspectingAsteroid = useMemo(() => {
    if (!inspectingAsteroidId) return null;
    return asteroids.find((a) => a.id.toLowerCase() === inspectingAsteroidId.toLowerCase()) || null;
  }, [inspectingAsteroidId, asteroids]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center p-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-[#20D9F2]/20 border-t-[#20D9F2] animate-spin" />
          <ShieldAlert className="w-6 h-6 text-[#20D9F2] absolute inset-0 m-auto" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white tracking-wide font-mono">
            INITIALIZING ASTEROID WATCH RADAR ARRAY
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Loading Near-Earth Object orbits, synthetic encounter models, and defense telemetry...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center p-6">
        <div className="w-16 h-16 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
        </div>
        <div className="max-w-md">
          <h2 className="text-lg font-semibold text-white font-mono">ASTEROID RADAR TELEMETRY OFFLINE</h2>
          <p className="text-xs text-rose-300 mt-2 font-mono">{error}</p>
        </div>
        <button
          onClick={loadAsteroids}
          className="px-4 py-2 rounded-lg bg-[#20D9F2]/20 border border-[#20D9F2]/40 text-[#20D9F2] text-xs font-mono font-semibold flex items-center gap-2 hover:bg-[#20D9F2]/30 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          RETRY SENSOR TELEMETRY
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16 animate-fade-in" aria-label="Asteroid Watch and Planetary Defense Portal">
      {/* Quick Jump Anchor Bar */}
      <nav
        aria-label="Module Quick Links"
        className="sticky top-0 z-30 -mt-4 py-2.5 px-4 bg-[#060B19]/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none"
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#20D9F2] animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
            Asteroid Watch Operations
          </span>
          <Badge variant="synthetic" className="text-[10px] hidden sm:inline-flex">
            Offline Simulation
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono">
          <button
            onClick={() => handleScrollToSection('overview')}
            className="px-2.5 py-1 rounded bg-[#0B1528] border border-slate-800 hover:border-[#20D9F2]/40 text-slate-300 hover:text-white transition-colors"
          >
            Overview
          </button>
          <button
            onClick={() => handleScrollToSection('radar')}
            className="px-2.5 py-1 rounded bg-[#0B1528] border border-slate-800 hover:border-[#20D9F2]/40 text-slate-300 hover:text-white transition-colors"
          >
            Orbital Radar
          </button>
          <button
            onClick={() => handleScrollToSection('timeline')}
            className="px-2.5 py-1 rounded bg-[#0B1528] border border-slate-800 hover:border-[#20D9F2]/40 text-slate-300 hover:text-white transition-colors"
          >
            Chronology
          </button>
          <button
            onClick={() => handleScrollToSection('catalog')}
            className="px-2.5 py-1 rounded bg-[#0B1528] border border-slate-800 hover:border-[#20D9F2]/40 text-slate-300 hover:text-white transition-colors"
          >
            Catalog
          </button>
          <button
            onClick={() => handleScrollToSection('whatif')}
            className="px-2.5 py-1 rounded bg-[#FFB45B]/10 border border-[#FFB45B]/30 hover:border-[#FFB45B]/60 text-[#FFB45B] hover:text-white transition-colors font-semibold flex items-center gap-1"
          >
            <Sliders className="w-3 h-3" />
            What-If Lab
          </button>
          <button
            onClick={() => handleScrollToSection('education')}
            className="px-2.5 py-1 rounded bg-[#0B1528] border border-slate-800 hover:border-[#8565FA]/40 text-slate-300 hover:text-white transition-colors"
          >
            Foundations
          </button>
        </div>
      </nav>

      {/* Section 1: Hero Command Overview */}
      <div id="overview">
        <AsteroidWatchHero asteroids={asteroids} onScrollToSection={handleScrollToSection} />
      </div>

      {/* Section 2: Orbital Encounter 2D Canvas */}
      <div id="radar">
        <OrbitalEncounterCanvas
          asteroids={asteroids}
          selectedAsteroidId={selectedAsteroidId}
          onSelectAsteroid={handleSelectAsteroid}
          onLoadIntoWhatIfLab={handleLoadIntoWhatIfLab}
        />
      </div>

      {/* Section 3: Chronological Close-Approach Scrubber */}
      <div id="timeline">
        <CloseApproachTimeline
          asteroids={asteroids}
          selectedAsteroidId={selectedAsteroidId}
          onSelectAsteroid={handleSelectAsteroid}
          onOpenDetailModal={(asteroid) => setInspectingAsteroidId(asteroid.id)}
          onLoadIntoWhatIfLab={handleLoadIntoWhatIfLab}
        />
      </div>

      {/* Section 4: Multi-Facet Search & Filter Catalog Explorer */}
      <div id="catalog">
        <AsteroidExplorerSection
          asteroids={asteroids}
          selectedAsteroidId={selectedAsteroidId}
          onSelectAsteroid={handleSelectAsteroid}
          onOpenDetailModal={(asteroid) => setInspectingAsteroidId(asteroid.id)}
          onLoadIntoWhatIfLab={handleLoadIntoWhatIfLab}
        />
      </div>

      {/* Section 5: Flagship Planetary Defense What-If Simulation Lab */}
      <div id="whatif">
        <PlanetaryDefenseWhatIfLab
          parameters={whatIfParameters}
          onUpdateParameters={setWhatIfParameters}
          onResetParameters={resetWhatIfParameters}
        />
      </div>

      {/* Section 6: Scientific Foundations & Educational Reference */}
      <div id="education">
        <PlanetaryDefenseEducationPanel />
      </div>

      {/* Modal: Deep Asteroid Dossier & Technical Inspection */}
      <AsteroidDetailModal
        asteroid={inspectingAsteroid}
        onClose={() => setInspectingAsteroidId(null)}
        onLoadIntoWhatIfLab={handleLoadIntoWhatIfLab}
      />
    </div>
  );
};
