import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { Planet } from '../../../types';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { SectionHeader } from '../../../components/common/SectionHeader';

interface FeaturedPlanetSectionProps {
  planets: Planet[];
}

export const FeaturedPlanetSection: React.FC<FeaturedPlanetSectionProps> = ({ planets }) => {
  const navigate = useNavigate();
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState(3); // Mars by default
  const planet = planets[selectedPlanetIndex] || planets[0];

  const handlePrev = () => {
    setSelectedPlanetIndex((prev) => (prev > 0 ? prev - 1 : planets.length - 1));
  };

  const handleNext = () => {
    setSelectedPlanetIndex((prev) => (prev < planets.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="my-12">
      <SectionHeader
        icon={<Globe className="w-5 h-5 text-[#20D9F2]" />}
        eyebrow="Planetary Survey Gallery"
        title="Featured Planetary World"
        subtitle="Explore detailed astrophysical models, surface environmental telemetry, and historical mission encounters across the Sol system."
        action={
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#98A7BF]">
              INDEX: {String(selectedPlanetIndex + 1).padStart(2, '0')} / {String(planets.length).padStart(2, '0')}
            </span>
            <div className="flex gap-1 ml-2">
              <button
                onClick={handlePrev}
                aria-label="Previous Planet"
                className="w-8 h-8 rounded bg-[#0A1021] border border-[#141D30] hover:border-[#20D9F2]/50 hover:text-[#20D9F2] text-[#98A7BF] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Planet"
                className="w-8 h-8 rounded bg-[#0A1021] border border-[#141D30] hover:border-[#20D9F2]/50 hover:text-[#20D9F2] text-[#98A7BF] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      />

      {/* Featured Showcase Card */}
      {planet && (
        <Card className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8 items-center border-[#1D2A44] hover:border-[#20D9F2]/40 transition-all shadow-xl">
          {/* Planet Visual Representation */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[280px]">
            {/* Ambient Back Glow */}
            <div
              className="absolute w-56 h-56 rounded-full blur-[70px] opacity-40 pointer-events-none"
              style={{ backgroundColor: planet.colorHex }}
            />
            {/* Orbit track circle */}
            <div className="absolute w-64 h-64 rounded-full border border-dashed border-[#1D2A44] pointer-events-none animate-spin-slow" />

            {/* Stylized Planet Sphere */}
            <div
              className="relative w-44 h-44 rounded-full shadow-2xl flex items-center justify-center transition-transform duration-700 hover:scale-105"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${planet.accentColor}, ${planet.colorHex} 65%, #050a14 100%)`,
                boxShadow: `0 0 35px -5px ${planet.accentColor}55, inset -10px -10px 25px rgba(0,0,0,0.85)`,
              }}
            >
              {/* Optional rings for Saturn */}
              {planet.id === 'saturn' && (
                <div className="absolute w-72 h-16 rounded-full border-[6px] border-[#CBBEFF]/40 -rotate-[24deg] pointer-events-none shadow-[0_0_20px_rgba(203,190,255,0.2)]" />
              )}
            </div>

            <div className="mt-4 font-mono text-xs text-[#98A7BF] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: planet.colorHex }} />
              <span>{planet.codeName}</span>
            </div>
          </div>

          {/* Planet Telemetry & Details */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="cyan" size="sm">
                  {planet.type}
                </Badge>
                <Badge variant="outline" size="sm">
                  Order: #{planet.orderFromSun} From Sun
                </Badge>
                <Badge variant="gold" size="sm">
                  {planet.relatedMissionIds.length} Missions Cataloged
                </Badge>
              </div>

              <h3 className="font-headline text-3xl font-bold uppercase tracking-tight text-[#F5F7FF]">
                {planet.name}
              </h3>
              <p className="font-telemetry text-sm text-[#20D9F2] uppercase tracking-wider mt-0.5 font-semibold">
                {planet.tagline}
              </p>

              <p className="font-body text-sm text-[#98A7BF] mt-3 leading-relaxed">
                {planet.detailedDescription}
              </p>
            </div>

            {/* Metric Clusters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#060B19]/70 border border-[#141D30] rounded-xl text-xs font-mono">
              <div>
                <span className="text-[#98A7BF] text-[10px] uppercase font-telemetry block">Distance</span>
                <span className="font-bold text-[#F5F7FF] text-sm">{planet.distanceFromSunAU} AU</span>
              </div>
              <div>
                <span className="text-[#98A7BF] text-[10px] uppercase font-telemetry block">Diameter</span>
                <span className="font-bold text-[#F5F7FF] text-sm">{planet.diameterKm.toLocaleString()} km</span>
              </div>
              <div>
                <span className="text-[#98A7BF] text-[10px] uppercase font-telemetry block">Surface Temp</span>
                <span className="font-bold text-[#FFB45B] text-sm">{planet.surfaceTempMeanC}°C</span>
              </div>
              <div>
                <span className="text-[#98A7BF] text-[10px] uppercase font-telemetry block">Gravity</span>
                <span className="font-bold text-[#20D9F2] text-sm">{planet.gravityEarthRel} g</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-[#98A7BF] hidden sm:inline">
                Atmosphere: {planet.atmosphereComposition.map((g) => `${g.gas} (${g.percentage}%)`).slice(0, 2).join(', ')}
              </span>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/planets?id=${planet.id}`)}
                icon={<Compass className="w-4 h-4" />}
              >
                Inspect World
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Planetary Mini Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-4">
        {planets.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setSelectedPlanetIndex(idx)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              selectedPlanetIndex === idx
                ? 'bg-[#10182B] border-[#20D9F2] shadow-[0_0_15px_rgba(32,217,242,0.2)]'
                : 'bg-[#0A1021]/60 border-[#141D30] hover:border-[#20D9F2]/30 hover:bg-[#10182B]'
            }`}
          >
            <div
              className="w-5 h-5 rounded-full mx-auto mb-1.5 shadow-sm"
              style={{ backgroundColor: p.colorHex }}
            />
            <span className="font-headline text-xs font-bold uppercase text-[#F5F7FF] block truncate">
              {p.name}
            </span>
            <span className="font-mono text-[10px] text-[#98A7BF] block">
              {p.distanceFromSunAU} AU
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
