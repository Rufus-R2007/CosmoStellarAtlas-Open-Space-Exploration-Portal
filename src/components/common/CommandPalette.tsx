import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Globe, Rocket, Shield, Radio, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store';
import { spaceService, SearchResults } from '../../services';
import { Badge } from './Badge';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
      setResults(null);
    }
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await spaceService.search(searchTerm);
        setResults(res);
      } catch (err) {
        console.error('Search failure:', err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isCommandPaletteOpen) return null;

  const handleSelect = (path: string) => {
    setCommandPaletteOpen(false);
    navigate(path);
  };

  const totalResults = results
    ? results.planets.length +
      results.missions.length +
      results.rovers.length +
      results.asteroids.length
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setCommandPaletteOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl bg-[#0A1021] border border-[#25334B] rounded-2xl shadow-2xl overflow-hidden text-[#F5F7FF] flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#141D30] gap-3 bg-[#060B19]/70">
          <Search className="w-5 h-5 text-[#20D9F2] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search planets, missions, rovers, asteroids, or briefings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[#F5F7FF] placeholder-[#98A7BF] font-body text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#98A7BF] hover:text-[#F5F7FF] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center font-mono text-[10px] px-2 py-0.5 rounded bg-[#10182B] border border-[#141D30] text-[#98A7BF]">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-8 text-center text-xs font-telemetry text-[#20D9F2] uppercase tracking-wider">
              Scanning local celestial repository...
            </div>
          )}

          {!loading && !searchTerm && (
            <div className="py-8 text-center text-xs text-[#98A7BF] space-y-1">
              <p className="font-headline font-semibold text-[#F5F7FF] uppercase">
                Global Command Palette & Atlas Index
              </p>
              <p>Type keywords like "Mars", "Apollo", "Curiosity", or "Apophis" to instantly inspect records.</p>
            </div>
          )}

          {!loading && searchTerm && totalResults === 0 && (
            <div className="py-8 text-center text-xs text-[#98A7BF]">
              No celestial records found matching "{searchTerm}".
            </div>
          )}

          {!loading && results && (
            <div className="space-y-4">
              {/* Planets */}
              {results.planets.length > 0 && (
                <div>
                  <div className="text-[11px] font-telemetry uppercase tracking-wider text-[#98A7BF] mb-2 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#20D9F2]" />
                    Planets ({results.planets.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.planets.map((planet) => (
                      <div
                        key={planet.id}
                        onClick={() => handleSelect(`/planets?id=${planet.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#060B19]/60 hover:bg-[#10182B] border border-[#141D30] hover:border-[#20D9F2]/40 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: planet.colorHex }}
                          />
                          <div>
                            <span className="font-headline text-sm font-semibold uppercase group-hover:text-[#20D9F2] transition-colors">
                              {planet.name}
                            </span>
                            <span className="ml-2 font-mono text-xs text-[#98A7BF]">
                              {planet.codeName}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="cyan" size="sm">
                            {planet.type}
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-[#98A7BF] group-hover:text-[#20D9F2] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missions */}
              {results.missions.length > 0 && (
                <div>
                  <div className="text-[11px] font-telemetry uppercase tracking-wider text-[#98A7BF] mb-2 flex items-center gap-1.5">
                    <Rocket className="w-3.5 h-3.5 text-[#CBBEFF]" />
                    Historical Missions ({results.missions.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.missions.map((mission) => (
                      <div
                        key={mission.id}
                        onClick={() => handleSelect(`/missions?id=${mission.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#060B19]/60 hover:bg-[#10182B] border border-[#141D30] hover:border-[#8565FA]/40 transition-colors cursor-pointer group"
                      >
                        <div>
                          <div className="font-headline text-sm font-semibold uppercase group-hover:text-[#CBBEFF] transition-colors">
                            {mission.name}
                          </div>
                          <div className="font-mono text-xs text-[#98A7BF]">
                            {mission.agency} • Launch: {mission.launchYear} • Dest: {mission.destinationName}
                          </div>
                        </div>
                        <Badge variant="violet" size="sm">
                          {mission.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Asteroids */}
              {results.asteroids.length > 0 && (
                <div>
                  <div className="text-[11px] font-telemetry uppercase tracking-wider text-[#98A7BF] mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#FFB45B]" />
                    Asteroids & NEOs ({results.asteroids.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.asteroids.map((asteroid) => (
                      <div
                        key={asteroid.id}
                        onClick={() => handleSelect(`/asteroids?id=${asteroid.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#060B19]/60 hover:bg-[#10182B] border border-[#141D30] hover:border-[#FFB45B]/40 transition-colors cursor-pointer group"
                      >
                        <div>
                          <div className="font-headline text-sm font-semibold uppercase group-hover:text-[#FFB45B] transition-colors">
                            {asteroid.name}
                          </div>
                          <div className="font-mono text-xs text-[#98A7BF]">
                            Class: {asteroid.orbitClass} • Dia: {asteroid.estimatedDiameterMeters}m
                          </div>
                        </div>
                        <Badge variant={asteroid.isPotentiallyHazardous ? 'gold' : 'outline'} size="sm">
                          {asteroid.isPotentiallyHazardous ? 'Hazardous' : 'Nominal'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rovers */}
              {results.rovers.length > 0 && (
                <div>
                  <div className="text-[11px] font-telemetry uppercase tracking-wider text-[#98A7BF] mb-2 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#20D9F2]" />
                    Mars Rovers ({results.rovers.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.rovers.map((rover) => (
                      <div
                        key={rover.id}
                        onClick={() => handleSelect(`/rovers?id=${rover.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#060B19]/60 hover:bg-[#10182B] border border-[#141D30] hover:border-[#20D9F2]/40 transition-colors cursor-pointer group"
                      >
                        <div>
                          <div className="font-headline text-sm font-semibold uppercase group-hover:text-[#20D9F2] transition-colors">
                            {rover.name}
                          </div>
                          <div className="font-mono text-xs text-[#98A7BF]">
                            Site: {rover.landingSite} • Sols: {rover.totalSols}
                          </div>
                        </div>
                        <Badge variant="cyan" size="sm">
                          {rover.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-[#060B19] border-t border-[#141D30] flex items-center justify-between text-[11px] font-mono text-[#98A7BF]">
          <span>Navigate with mouse or keyboard</span>
          <span>CosmoStellarAtlas Local Index</span>
        </div>
      </div>
    </div>
  );
};
