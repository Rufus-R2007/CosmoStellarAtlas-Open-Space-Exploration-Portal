import React, { useState, useEffect } from 'react';
import {
  Globe,
  Compass,
  Thermometer,
  Weight,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Star,
} from 'lucide-react';
import { Planet } from '../../../../types';
import { Badge } from '../../../../components/common/Badge';
import { Card } from '../../../../components/common/Card';
import { useVaultStore } from '../../../../store/useVaultStore';
import {
  formatOrbitalPeriod,
  formatRotationPeriod,
  calculateWeightOnPlanet,
} from '../../../../utils/planetaryMath';

interface PlanetInfoCenterProps {
  planet: Planet;
}

export const PlanetInfoCenter: React.FC<PlanetInfoCenterProps> = ({ planet }) => {
  const [activeTab, setActiveTab] = useState<'physical' | 'atmosphere' | 'features'>('physical');
  const [sampleEarthWeight, setSampleEarthWeight] = useState<number>(70); // kg

  const isFav = useVaultStore((s) => s.isFavorite('planet', planet.id));
  const toggleFavorite = useVaultStore((s) => s.toggleFavorite);
  const logExplorationEvent = useVaultStore((s) => s.logExplorationEvent);

  useEffect(() => {
    logExplorationEvent('planet_viewed', planet.id, { name: planet.name });
  }, [planet.id, logExplorationEvent, planet.name]);

  return (
    <div className="space-y-4">
      {/* Overview & Classification Card */}
      <Card className="p-5 border-[#1D2A44] bg-[#0A1021]/80 backdrop-blur-xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: planet.colorHex }}
            />
            <span className="font-mono text-xs text-[#20D9F2] uppercase font-bold">
              {planet.codeName}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                toggleFavorite({
                  entityType: 'planet',
                  entityId: planet.id,
                  title: planet.name,
                  subtitle: `${planet.type} • Order #${planet.orderFromSun} from Sun`,
                  route: `/planets?selected=${planet.id}`,
                  categoryBadge: 'Planet',
                  colorHex: planet.colorHex,
                })
              }
              title={isFav ? 'Remove from Space Vault' : 'Bookmark in Space Vault'}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-xs font-mono ${
                isFav
                  ? 'bg-[#FFB45B]/20 border-[#FFB45B] text-[#FFB45B]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-[#FFB45B]' : ''}`} />
              <span>{isFav ? 'Saved' : 'Save'}</span>
            </button>
            <Badge variant="cyan" size="sm">
              {planet.type}
            </Badge>
            <Badge variant="outline" size="sm">
              #{planet.orderFromSun} from Sun
            </Badge>
          </div>
        </div>

        <h2 className="font-headline text-3xl font-bold uppercase tracking-tight text-[#F5F7FF]">
          {planet.name}
        </h2>
        <p className="font-telemetry text-xs uppercase tracking-wider text-[#20D9F2] font-semibold mt-0.5">
          {planet.tagline}
        </p>

        <p className="font-body text-xs sm:text-sm text-[#98A7BF] mt-3 leading-relaxed">
          {planet.detailedDescription}
        </p>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#141D30] mt-5 gap-4 text-xs font-telemetry uppercase">
          <button
            onClick={() => setActiveTab('physical')}
            className={`pb-2.5 transition-colors font-semibold flex items-center gap-1.5 border-b-2 -mb-px ${
              activeTab === 'physical'
                ? 'border-[#20D9F2] text-[#20D9F2]'
                : 'border-transparent text-[#98A7BF] hover:text-[#F5F7FF]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Physical Characteristics</span>
          </button>
          <button
            onClick={() => setActiveTab('atmosphere')}
            className={`pb-2.5 transition-colors font-semibold flex items-center gap-1.5 border-b-2 -mb-px ${
              activeTab === 'atmosphere'
                ? 'border-[#20D9F2] text-[#20D9F2]'
                : 'border-transparent text-[#98A7BF] hover:text-[#F5F7FF]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Atmosphere ({planet.atmosphereComposition.length} Gases)</span>
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-2.5 transition-colors font-semibold flex items-center gap-1.5 border-b-2 -mb-px ${
              activeTab === 'features'
                ? 'border-[#20D9F2] text-[#20D9F2]'
                : 'border-transparent text-[#98A7BF] hover:text-[#F5F7FF]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Notable Landmarks</span>
          </button>
        </div>

        {/* Tab Content: Physical Characteristics */}
        {activeTab === 'physical' && (
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* Diameter */}
              <div className="p-3 rounded-lg bg-[#060B19]/70 border border-[#141D30]">
                <span className="text-[10px] uppercase font-telemetry text-[#98A7BF] flex items-center gap-1">
                  <Globe className="w-3 h-3 text-[#20D9F2]" />
                  Diameter
                </span>
                <span className="font-headline text-base font-bold text-[#F5F7FF] mt-1 block">
                  {planet.diameterKm.toLocaleString()} km
                </span>
                <span className="text-[10px] font-mono text-[#98A7BF]">
                  {(planet.diameterKm / 12742).toFixed(2)}× Earth
                </span>
              </div>

              {/* Mass */}
              <div className="p-3 rounded-lg bg-[#060B19]/70 border border-[#141D30]">
                <span className="text-[10px] uppercase font-telemetry text-[#98A7BF] flex items-center gap-1">
                  <Weight className="w-3 h-3 text-[#CBBEFF]" />
                  Mass
                </span>
                <span className="font-headline text-base font-bold text-[#F5F7FF] mt-1 block">
                  {planet.massEarthRel} M⊕
                </span>
                <span className="text-[10px] font-mono text-[#98A7BF] truncate block">
                  {planet.massKg} kg
                </span>
              </div>

              {/* Gravity */}
              <div className="p-3 rounded-lg bg-[#060B19]/70 border border-[#141D30]">
                <span className="text-[10px] uppercase font-telemetry text-[#98A7BF] flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#20D9F2]" />
                  Gravity
                </span>
                <span className="font-headline text-base font-bold text-[#20D9F2] mt-1 block">
                  {planet.gravityEarthRel} g
                </span>
                <span className="text-[10px] font-mono text-[#98A7BF]">
                  {planet.gravityMs2} m/s²
                </span>
              </div>

              {/* Temperature */}
              <div className="p-3 rounded-lg bg-[#060B19]/70 border border-[#141D30]">
                <span className="text-[10px] uppercase font-telemetry text-[#98A7BF] flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-[#FFB45B]" />
                  Mean Surface Temp
                </span>
                <span className="font-headline text-base font-bold text-[#FFB45B] mt-1 block">
                  {planet.surfaceTempMeanC}°C
                </span>
                <span className="text-[10px] font-mono text-[#98A7BF]">
                  {planet.surfaceTempRangeC.min}°C to {planet.surfaceTempRangeC.max}°C
                </span>
              </div>

              {/* Orbital Period (Year) */}
              <div className="p-3 rounded-lg bg-[#060B19]/70 border border-[#141D30]">
                <span className="text-[10px] uppercase font-telemetry text-[#98A7BF] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#8565FA]" />
                  Orbital Period (Year)
                </span>
                <span className="font-headline text-base font-bold text-[#F5F7FF] mt-1 block">
                  {formatOrbitalPeriod(planet.orbitalPeriodDays).split(' ')[0]}{' '}
                  <span className="text-xs font-normal text-[#98A7BF]">
                    {formatOrbitalPeriod(planet.orbitalPeriodDays).split(' ')[1]}
                  </span>
                </span>
                <span className="text-[10px] font-mono text-[#98A7BF]">
                  Orbital Vel: {planet.orbitalVelocityKmS} km/s
                </span>
              </div>

              {/* Day Length */}
              <div className="p-3 rounded-lg bg-[#060B19]/70 border border-[#141D30]">
                <span className="text-[10px] uppercase font-telemetry text-[#98A7BF] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#20D9F2]" />
                  Day Length (Rotation)
                </span>
                <span className="font-headline text-base font-bold text-[#F5F7FF] mt-1 block">
                  {formatRotationPeriod(planet.rotationPeriodHours)}
                </span>
                <span className="text-[10px] font-mono text-[#98A7BF]">
                  Axial Tilt: {planet.axialTiltDegrees}°
                </span>
              </div>
            </div>

            {/* Educational Human Weight Calculator Callout */}
            <div className="p-3.5 rounded-xl bg-[#060B19]/80 border border-[#20D9F2]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-headline font-semibold text-[#F5F7FF] uppercase flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#20D9F2]" />
                  Relative Gravity Experience
                </span>
                <p className="text-[#98A7BF] text-[11px]">
                  A 70 kg explorer on Earth would weigh approximately{' '}
                  <strong className="text-[#20D9F2]">
                    {calculateWeightOnPlanet(sampleEarthWeight, planet.gravityEarthRel)} kg
                  </strong>{' '}
                  on {planet.name}.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <span className="font-mono text-[11px] text-[#98A7BF]">Earth kg:</span>
                <input
                  type="number"
                  min="20"
                  max="200"
                  value={sampleEarthWeight}
                  onChange={(e) => setSampleEarthWeight(Number(e.target.value) || 70)}
                  className="w-16 px-2 py-1 bg-[#10182B] border border-[#141D30] rounded text-center text-xs font-mono text-[#F5F7FF] focus:outline-none focus:border-[#20D9F2]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Atmospheric Composition */}
        {activeTab === 'atmosphere' && (
          <div className="pt-4 space-y-3">
            <span className="font-telemetry text-[11px] uppercase tracking-wider text-[#98A7BF] block">
              Volumetric Atmospheric Gas Concentrations
            </span>
            <div className="space-y-2.5">
              {planet.atmosphereComposition.map((gas) => (
                <div key={gas.gas} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#F5F7FF]">{gas.gas}</span>
                    <span className="text-[#20D9F2] font-bold">{gas.percentage}%</span>
                  </div>
                  <div className="w-full bg-[#060B19] h-2 rounded-full overflow-hidden border border-[#141D30]">
                    <div
                      className="bg-gradient-to-r from-[#20D9F2] to-[#8565FA] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(gas.percentage, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 rounded-lg bg-[#060B19]/60 border border-[#141D30] text-[11px] font-mono text-[#98A7BF] flex items-center justify-between">
              <span>Known Natural Moons: <strong className="text-[#F5F7FF]">{planet.moonsCount}</strong></span>
              <span>Source: {planet.sourceReference}</span>
            </div>
          </div>
        )}

        {/* Tab Content: Notable Landmarks */}
        {activeTab === 'features' && (
          <div className="pt-4 space-y-2.5">
            <span className="font-telemetry text-[11px] uppercase tracking-wider text-[#98A7BF] block">
              Defining Geological & Atmospheric Landmarks
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {planet.notableFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#060B19]/70 border border-[#141D30] text-xs text-[#F5F7FF] flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB45B] mt-1.5 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
