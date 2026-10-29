import React, { useState, useMemo, useEffect } from 'react';
import {
  Scale,
  Sparkles,
  ArrowRightLeft,
  ChevronDown,
  Info,
} from 'lucide-react';
import { Planet } from '../../../../types';
import { Card } from '../../../../components/common/Card';
import { Badge } from '../../../../components/common/Badge';
import { SectionHeader } from '../../../../components/common/SectionHeader';
import { computePlanetComparison } from '../../../../utils/planetaryMath';
import { PlanetaryInsightsEngine } from '../../services/PlanetaryInsightsEngine';
import { useVaultStore } from '../../../../store/useVaultStore';

interface PlanetaryComparisonLabProps {
  planets: Planet[];
  initialPlanetAId?: string;
  initialPlanetBId?: string;
}

export const PlanetaryComparisonLab: React.FC<PlanetaryComparisonLabProps> = ({
  planets,
  initialPlanetAId = 'earth',
  initialPlanetBId = 'mars',
}) => {
  const [planetAId, setPlanetAId] = useState<string>(initialPlanetAId);
  const [planetBId, setPlanetBId] = useState<string>(
    initialPlanetBId === initialPlanetAId ? 'mars' : initialPlanetBId
  );

  const planetA = useMemo(
    () => planets.find((p) => p.id === planetAId) || planets[2],
    [planets, planetAId]
  );
  const planetB = useMemo(
    () => planets.find((p) => p.id === planetBId) || planets[3],
    [planets, planetBId]
  );

  const comparison = useMemo(
    () => computePlanetComparison(planetA, planetB),
    [planetA, planetB]
  );

  const insights = useMemo(
    () => PlanetaryInsightsEngine.generateComparisonInsights(planetA, planetB),
    [planetA, planetB]
  );

  const logExplorationEvent = useVaultStore((s) => s.logExplorationEvent);

  useEffect(() => {
    if (planetA.id !== planetB.id) {
      logExplorationEvent('planet_comparison_completed', `${planetA.id}_vs_${planetB.id}`, {
        planetA: planetA.name,
        planetB: planetB.name,
      });
    }
  }, [planetA.id, planetB.id, logExplorationEvent, planetA.name, planetB.name]);

  const handleSwap = () => {
    setPlanetAId(planetBId);
    setPlanetBId(planetAId);
  };

  const isSamePlanet = planetA.id === planetB.id;

  // Comparison metrics array for rendering
  const metricsList = [
    comparison.diameter,
    comparison.gravity,
    comparison.mass,
    comparison.distanceFromSun,
    comparison.temperature,
    comparison.orbitalPeriod,
    comparison.dayLength,
    comparison.moonCount,
  ];

  return (
    <section className="my-12" data-testid="planetary-comparison-lab">
      <SectionHeader
        icon={<Scale className="w-5 h-5 text-[#20D9F2]" />}
        eyebrow="Comparative Planetary Physics"
        title="Planetary Comparison Laboratory"
        subtitle="Perform side-by-side ratio analysis, spherical scaling visualizer, and deterministic insight generation between any two Sol worlds."
        action={
          <button
            onClick={handleSwap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1021] border border-[#141D30] hover:border-[#20D9F2]/40 text-[#98A7BF] hover:text-[#20D9F2] transition-colors font-telemetry text-xs uppercase cursor-pointer"
            title="Swap Planet Positions"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Swap Worlds</span>
          </button>
        }
      />

      {/* Planetary Selection Header Bar */}
      <Card className="p-6 bg-[#0A1021]/80 border-[#1D2A44] shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Planet A Selector */}
          <div className="md:col-span-5 p-4 rounded-xl bg-[#060B19]/80 border border-[#141D30] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="w-5 h-5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                style={{ backgroundColor: planetA.colorHex }}
              />
              <div>
                <span className="font-telemetry text-[10px] text-[#98A7BF] uppercase block">
                  Reference Target A
                </span>
                <span className="font-headline text-lg font-bold uppercase text-[#F5F7FF]">
                  {planetA.name}
                </span>
              </div>
            </div>

            <div className="relative">
              <select
                value={planetAId}
                onChange={(e) => setPlanetAId(e.target.value)}
                className="appearance-none bg-[#10182B] border border-[#141D30] text-[#20D9F2] font-telemetry text-xs uppercase px-3 py-1.5 pr-8 rounded-lg cursor-pointer focus:outline-none focus:border-[#20D9F2]"
                aria-label="Select Target Planet A"
              >
                {planets.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#0A1021] text-[#F5F7FF]">
                    {p.name} (#{p.orderFromSun})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#98A7BF] absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* VS Divider Icon */}
          <div className="md:col-span-1 flex items-center justify-center">
            <span className="w-8 h-8 rounded-full bg-[#10182B] border border-[#141D30] text-[#20D9F2] font-headline text-xs font-bold flex items-center justify-center">
              VS
            </span>
          </div>

          {/* Planet B Selector */}
          <div className="md:col-span-5 p-4 rounded-xl bg-[#060B19]/80 border border-[#141D30] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="w-5 h-5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                style={{ backgroundColor: planetB.colorHex }}
              />
              <div>
                <span className="font-telemetry text-[10px] text-[#98A7BF] uppercase block">
                  Comparison Target B
                </span>
                <span className="font-headline text-lg font-bold uppercase text-[#F5F7FF]">
                  {planetB.name}
                </span>
              </div>
            </div>

            <div className="relative">
              <select
                value={planetBId}
                onChange={(e) => setPlanetBId(e.target.value)}
                className="appearance-none bg-[#10182B] border border-[#141D30] text-[#FFB45B] font-telemetry text-xs uppercase px-3 py-1.5 pr-8 rounded-lg cursor-pointer focus:outline-none focus:border-[#FFB45B]"
                aria-label="Select Target Planet B"
              >
                {planets.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#0A1021] text-[#F5F7FF]">
                    {p.name} (#{p.orderFromSun})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#98A7BF] absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Same-planet warning banner */}
        {isSamePlanet && (
          <div className="mt-4 p-3 rounded-lg bg-[#FFB45B]/10 border border-[#FFB45B]/30 text-xs text-[#FFB45B] flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              Both selection slots currently target <strong>{planetA.name}</strong>. Choose two different worlds to calculate non-trivial differential ratios.
            </span>
          </div>
        )}

        {/* Visual Scale Proportion Indicator */}
        <div className="mt-6 pt-6 border-t border-[#141D30] flex flex-col sm:flex-row items-center justify-around gap-6 bg-[#060B19]/60 p-6 rounded-xl">
          {/* Planet A Visual */}
          <div className="flex flex-col items-center">
            <div
              className="rounded-full shadow-lg transition-all duration-500 flex items-center justify-center text-xs font-headline font-bold text-black"
              style={{
                width: `${Math.max(30, Math.min(130, (planetA.diameterKm / 139820) * 130))}px`,
                height: `${Math.max(30, Math.min(130, (planetA.diameterKm / 139820) * 130))}px`,
                backgroundColor: planetA.colorHex,
              }}
            />
            <span className="mt-2 font-headline text-xs font-semibold uppercase text-[#20D9F2]">
              {planetA.name} (1.0×)
            </span>
            <span className="font-mono text-[10px] text-[#98A7BF]">
              {planetA.diameterKm.toLocaleString()} km
            </span>
          </div>

          <div className="text-center font-mono text-xs text-[#98A7BF] space-y-1">
            <span className="text-[#20D9F2] block font-bold text-base">
              Diameter Ratio: {comparison.diameter.ratioAtoB}×
            </span>
            <span>Spherical Volume Ratio: ~{(Math.pow(planetA.diameterKm / planetB.diameterKm, 3)).toFixed(2)}×</span>
          </div>

          {/* Planet B Visual */}
          <div className="flex flex-col items-center">
            <div
              className="rounded-full shadow-lg transition-all duration-500 flex items-center justify-center text-xs font-headline font-bold text-black"
              style={{
                width: `${Math.max(30, Math.min(130, (planetB.diameterKm / 139820) * 130))}px`,
                height: `${Math.max(30, Math.min(130, (planetB.diameterKm / 139820) * 130))}px`,
                backgroundColor: planetB.colorHex,
              }}
            />
            <span className="mt-2 font-headline text-xs font-semibold uppercase text-[#FFB45B]">
              {planetB.name} ({(planetB.diameterKm / planetA.diameterKm).toFixed(2)}×)
            </span>
            <span className="font-mono text-[10px] text-[#98A7BF]">
              {planetB.diameterKm.toLocaleString()} km
            </span>
          </div>
        </div>

        {/* Detailed Metrics Comparison Table */}
        <div className="mt-6 space-y-3">
          <span className="font-telemetry text-xs uppercase tracking-wider text-[#98A7BF] font-semibold block">
            Metric Breakdown & Cross-Ratios
          </span>

          <div className="space-y-2">
            {metricsList.map((m) => (
              <div
                key={m.label}
                className="p-3 rounded-lg bg-[#060B19]/50 border border-[#141D30] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="md:w-1/4">
                  <span className="font-headline text-xs font-semibold uppercase text-[#F5F7FF] block">
                    {m.label}
                  </span>
                  <span className="text-[10px] text-[#98A7BF]">{m.summaryText}</span>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 md:w-3/4">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-[#98A7BF] block">{planetA.name}</span>
                    <span className="text-[#20D9F2] font-bold text-sm">{m.displayA}</span>
                  </div>

                  {/* Ratio bar indicator */}
                  <div className="hidden sm:flex flex-col items-center w-32">
                    <div className="w-full bg-[#10182B] h-1.5 rounded-full overflow-hidden flex">
                      <div
                        className="bg-[#20D9F2] h-full"
                        style={{
                          width: `${Math.min(100, Math.max(10, (m.valA / (m.valA + m.valB || 1)) * 100))}%`,
                        }}
                      />
                      <div
                        className="bg-[#FFB45B] h-full"
                        style={{
                          width: `${Math.min(100, Math.max(10, (m.valB / (m.valA + m.valB || 1)) * 100))}%`,
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-[#98A7BF] mt-0.5">
                      Ratio: {m.ratioAtoB}×
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#98A7BF] block">{planetB.name}</span>
                    <span className="text-[#FFB45B] font-bold text-sm">{m.displayB}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Planetary Insights Engine Output */}
        <div className="mt-8 pt-6 border-t border-[#141D30]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#20D9F2]" />
              <span className="font-headline text-sm font-bold uppercase tracking-wider text-[#F5F7FF]">
                Planetary Insights Engine
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#98A7BF]">
              Rule-Based Mathematical Synthesis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#060B19]/80 border border-[#141D30] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-headline text-xs font-bold uppercase text-[#20D9F2]">
                    {insight.headline}
                  </span>
                  <Badge variant="outline" size="sm">
                    {insight.badge}
                  </Badge>
                </div>
                <p className="font-body text-xs text-[#98A7BF] leading-relaxed">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
};
