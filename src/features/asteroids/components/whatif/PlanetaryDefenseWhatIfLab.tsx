import React, { useMemo } from 'react';
import {
  Sliders,
  RotateCcw,
  Info,
  Activity,
  ShieldAlert,
  BookOpen,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from 'recharts';
import { Badge } from '../../../../components/common/Badge';
import {
  SimulationParameters,
  SimulationResult,
  EducationalScenario,
} from '../../../../types';
import {
  calculateSimulationResult,
  generateEnergyVsDiameterCurve,
  generateEnergyVsVelocityCurve,
  generateSensitivityBreakdown,
  generateExplainableInsights,
  EDUCATIONAL_SCENARIOS,
  KM_PER_LUNAR_DISTANCE,
} from '../../utils/planetaryDefenseMath';

interface PlanetaryDefenseWhatIfLabProps {
  parameters: SimulationParameters;
  onUpdateParameters: (params: Partial<SimulationParameters>) => void;
  onResetParameters: () => void;
}

export const PlanetaryDefenseWhatIfLab: React.FC<PlanetaryDefenseWhatIfLabProps> = ({
  parameters,
  onUpdateParameters,
  onResetParameters,
}) => {
  // Real scientific calculation execution
  const results: SimulationResult = useMemo(() => {
    return calculateSimulationResult(parameters);
  }, [parameters]);

  // Curves for dynamic Recharts visualization
  const energyVsDiameterData = useMemo(() => {
    return generateEnergyVsDiameterCurve(parameters.velocityKmS, parameters.densityKgM3);
  }, [parameters.velocityKmS, parameters.densityKgM3]);

  const energyVsVelocityData = useMemo(() => {
    return generateEnergyVsVelocityCurve(parameters.diameterM, parameters.densityKgM3);
  }, [parameters.diameterM, parameters.densityKgM3]);

  // Sensitivity comparisons
  const sensitivityBreakdown = useMemo(() => {
    return generateSensitivityBreakdown(parameters);
  }, [parameters]);

  // Explainable insights
  const explainableInsights = useMemo(() => {
    return generateExplainableInsights(parameters, results);
  }, [parameters, results]);

  const handleSelectScenario = (scenario: EducationalScenario) => {
    onUpdateParameters(scenario.defaultParameters);
  };

  return (
    <section id="whatif-lab" className="mb-12 scroll-mt-24">
      {/* Flagship Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="gold">FLAGSHIP FEATURE • EXPERIENCE C</Badge>
            <span className="text-xs font-mono uppercase tracking-widest text-[#FFB45B]">
              EDUCATIONAL PHYSICS SIMULATION
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
            Planetary Defense What-If Lab
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Experiment with hypothetical asteroid characteristics. Adjust physical diameter,
            impact velocity, and assumed density to inspect real-time mathematical calculations
            of mass, volume, and incoming kinetic energy.
          </p>
        </div>

        {/* Reset Simulation Button */}
        <button
          onClick={onResetParameters}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/5 text-xs font-mono text-gray-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-4 h-4 text-[#FFB45B]" />
          Reset Simulation
        </button>
      </div>

      {/* Educational Scenario Presets Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#0A1021] p-4 lg:p-5 mb-8 shadow-xl">
        <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-3">
          Educational Scenario Presets (Hypothetical Case Studies):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EDUCATIONAL_SCENARIOS.map((scenario) => {
            const isMatch =
              parameters.diameterM === scenario.defaultParameters.diameterM &&
              parameters.velocityKmS === scenario.defaultParameters.velocityKmS;

            return (
              <button
                key={scenario.id}
                onClick={() => handleSelectScenario(scenario)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isMatch
                    ? 'border-[#FFB45B] bg-[#FFB45B]/10 shadow-md shadow-[#FFB45B]/10'
                    : 'border-white/10 bg-[#060B19] hover:border-[#FFB45B]/40 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-white line-clamp-1">
                    {scenario.name.split(' (')[0]}
                  </span>
                  {isMatch && (
                    <span className="w-2 h-2 rounded-full bg-[#FFB45B] shrink-0" />
                  )}
                </div>
                <div className="text-[11px] font-mono text-[#20D9F2] mb-1">
                  {scenario.defaultParameters.diameterM}m @{' '}
                  {scenario.defaultParameters.velocityKmS} km/s
                </div>
                <p className="text-[10px] text-gray-400 line-clamp-2">
                  {scenario.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Control & KPI Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Column: Sliders & Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0A1021] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-6">
              <Sliders className="w-5 h-5 text-[#20D9F2]" />
              Hypothetical Simulation Parameters
            </h3>

            {/* Slider 1: Asteroid Diameter (10m to 1000m) */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">
                  Asteroid Diameter (d)
                </label>
                <span className="text-sm font-mono font-extrabold text-[#20D9F2]">
                  {parameters.diameterM} meters
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={1000}
                step={5}
                value={parameters.diameterM}
                onChange={(e) =>
                  onUpdateParameters({ diameterM: Number(e.target.value) })
                }
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#20D9F2]"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
                <span>10m (Chelyabinsk)</span>
                <span>140m (City-Killer)</span>
                <span>1,000m (Global)</span>
              </div>
            </div>

            {/* Slider 2: Impact Velocity (5 km/s to 40 km/s) */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">
                  Impact Velocity (v)
                </label>
                <span className="text-sm font-mono font-extrabold text-[#8565FA]">
                  {parameters.velocityKmS.toFixed(1)} km/s ({results.velocityMs.toLocaleString()} m/s)
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={0.5}
                value={parameters.velocityKmS}
                onChange={(e) =>
                  onUpdateParameters({ velocityKmS: Number(e.target.value) })
                }
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#8565FA]"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
                <span>5 km/s (Min Solar)</span>
                <span>20 km/s (Average NEO)</span>
                <span>40 km/s (Retrograde Comet)</span>
              </div>
            </div>

            {/* Slider 3: Assumed Density (1000 kg/m³ to 3500 kg/m³) */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">
                  Assumed Density (ρ)
                </label>
                <span className="text-sm font-mono font-extrabold text-[#FFB45B]">
                  {parameters.densityKgM3.toLocaleString()} kg/m³
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={3500}
                step={50}
                value={parameters.densityKgM3}
                onChange={(e) =>
                  onUpdateParameters({ densityKgM3: Number(e.target.value) })
                }
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FFB45B]"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
                <span>1,000 (Porous Comet)</span>
                <span>2,500 (Stony Silicate)</span>
                <span>3,500 (Dense Iron-Rock)</span>
              </div>
            </div>

            {/* Slider 4: Illustrative Miss Distance (Explicitly Decoupled) */}
            <div className="mb-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  Illustrative Flyby Distance
                  <span className="text-[10px] font-normal text-[#FFB45B]">(Flyby Only)</span>
                </label>
                <span className="text-xs font-mono text-gray-300">
                  {(parameters.illustrativeMissDistanceKm / KM_PER_LUNAR_DISTANCE).toFixed(2)} LD (
                  {Math.round(parameters.illustrativeMissDistanceKm / 1000).toLocaleString()}k km)
                </span>
              </div>
              <input
                type="range"
                min={20000}
                max={5000000}
                step={20000}
                value={parameters.illustrativeMissDistanceKm}
                onChange={(e) =>
                  onUpdateParameters({
                    illustrativeMissDistanceKm: Number(e.target.value),
                  })
                }
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gray-400"
              />
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 mt-2">
                <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>
                  <strong>Decoupling Notice:</strong> Adjusting flyby distance does{' '}
                  <em>not</em> alter impact energy calculations.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Scientific KPI Cards (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          {/* Main Primary Kinetic Energy Banner */}
          <div className="rounded-2xl border border-[#FFB45B]/40 bg-gradient-to-br from-[#10182B] via-[#0A1021] to-[#1C1308] p-6 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold tracking-widest text-[#FFB45B] uppercase">
                  CALCULATED INCOMING KINETIC ENERGY
                </span>
                <Badge variant="gold">E = ½ m v²</Badge>
              </div>

              {/* Huge KPI Energy Output */}
              <div className="flex flex-wrap items-baseline gap-3 my-3">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-white tracking-tight">
                  {results.kineticEnergyMegatons >= 1000
                    ? `${(results.kineticEnergyMegatons / 1000).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })} Gigatons`
                    : `${results.kineticEnergyMegatons.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })} Megatons`}
                </div>
                <span className="text-sm sm:text-base font-mono text-gray-400">
                  TNT Equivalent
                </span>
              </div>

              {/* Secondary Sub-Units */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">
                    Kilotons TNT Equivalent
                  </span>
                  <span className="font-bold text-[#FFB45B] text-sm">
                    {results.kineticEnergyKilotons.toLocaleString(undefined, {
                      maximumFractionDigits: 1,
                    })}{' '}
                    kt
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">
                    Raw Kinetic Energy (Joules)
                  </span>
                  <span className="font-bold text-gray-200 text-sm truncate block">
                    {results.kineticEnergyJ.toExponential(3)} J
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Intermediate Physical Quantities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Radius */}
            <div className="rounded-xl border border-white/10 bg-[#0A1021] p-4">
              <span className="text-gray-400 text-[10px] uppercase font-mono tracking-wider block mb-1">
                Asteroid Radius (r)
              </span>
              <div className="text-xl font-bold font-mono text-[#20D9F2]">
                {results.radiusM} m
              </div>
              <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                r = d / 2
              </span>
            </div>

            {/* Volume */}
            <div className="rounded-xl border border-white/10 bg-[#0A1021] p-4">
              <span className="text-gray-400 text-[10px] uppercase font-mono tracking-wider block mb-1">
                Spherical Volume (V)
              </span>
              <div className="text-xl font-bold font-mono text-white">
                {results.volumeM3 >= 1e6
                  ? `${(results.volumeM3 / 1e6).toFixed(2)}M m³`
                  : `${Math.round(results.volumeM3).toLocaleString()} m³`}
              </div>
              <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                V = (4/3) π r³
              </span>
            </div>

            {/* Estimated Mass */}
            <div className="rounded-xl border border-white/10 bg-[#0A1021] p-4">
              <span className="text-gray-400 text-[10px] uppercase font-mono tracking-wider block mb-1">
                Estimated Mass (m)
              </span>
              <div className="text-xl font-bold font-mono text-[#8565FA]">
                {results.massKg >= 1e9
                  ? `${(results.massKg / 1e9).toFixed(2)} Mt`
                  : `${Math.round(results.massKg / 1000).toLocaleString()} t`}
              </div>
              <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                m = ρ × V
              </span>
            </div>
          </div>

          {/* Model Limitations Notice Box */}
          <div className="rounded-xl border border-[#EF4444]/30 bg-[#1C0E10]/80 p-4 text-xs text-gray-300">
            <div className="flex items-center gap-2 text-[#EF4444] font-bold mb-1">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              PHYSICS SIMULATION MODEL LIMITATIONS
            </div>
            <p className="leading-relaxed text-gray-300">
              This calculation represents <strong>idealized incoming vacuum kinetic energy</strong>{' '}
              under spherical uniform-density assumptions. It does <em>not</em> predict atmospheric
              ablation, airburst altitude, ground crater excavating efficiency, casualties, or tsunamis.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Chart 1: Kinetic Energy vs Diameter (Cubic Growth E ∝ d³) */}
        <div className="rounded-2xl border border-white/10 bg-[#0A1021] p-6 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Kinetic Energy vs. Diameter Curve
            </h4>
            <Badge variant="cyan">CUBIC SCALING (E ∝ d³)</Badge>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Hypothetical kinetic energy plotted across diameters (10m–1,000m) at active velocity (
            {parameters.velocityKmS} km/s) and density ({parameters.densityKgM3} kg/m³).
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyVsDiameterData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="diameterM"
                  stroke="#718096"
                  fontSize={11}
                  tickFormatter={(val) => `${val}m`}
                />
                <YAxis
                  stroke="#718096"
                  fontSize={11}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k Mt` : `${val} Mt`)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#060B19',
                    borderColor: 'rgba(32, 217, 242, 0.4)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${Number(val).toLocaleString()} Megatons TNT`, 'Calculated Energy']}
                  labelFormatter={(lbl) => `Diameter: ${lbl} meters`}
                />
                <Line
                  type="monotone"
                  dataKey="energyMegatons"
                  stroke="#20D9F2"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <ReferenceDot
                  x={parameters.diameterM}
                  y={Number(results.kineticEnergyMegatons.toFixed(2))}
                  r={6}
                  fill="#FFB45B"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] font-mono text-center text-gray-400 mt-2">
            Yellow dot marks active simulation: <strong className="text-white">{parameters.diameterM}m</strong> →{' '}
            <strong className="text-[#FFB45B]">{results.kineticEnergyMegatons.toFixed(1)} Mt</strong>
          </div>
        </div>

        {/* Chart 2: Kinetic Energy vs Velocity (Quadratic Parabola E ∝ v²) */}
        <div className="rounded-2xl border border-white/10 bg-[#0A1021] p-6 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Kinetic Energy vs. Velocity Curve
            </h4>
            <Badge variant="violet">QUADRATIC PARABOLA (E ∝ v²)</Badge>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Hypothetical kinetic energy plotted across velocities (5–40 km/s) at active diameter (
            {parameters.diameterM}m) and density ({parameters.densityKgM3} kg/m³).
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyVsVelocityData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="velocityKmS"
                  stroke="#718096"
                  fontSize={11}
                  tickFormatter={(val) => `${val} km/s`}
                />
                <YAxis
                  stroke="#718096"
                  fontSize={11}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k Mt` : `${val} Mt`)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#060B19',
                    borderColor: 'rgba(133, 101, 250, 0.4)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${Number(val).toLocaleString()} Megatons TNT`, 'Calculated Energy']}
                  labelFormatter={(lbl) => `Velocity: ${lbl} km/s`}
                />
                <Line
                  type="monotone"
                  dataKey="energyMegatons"
                  stroke="#8565FA"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <ReferenceDot
                  x={parameters.velocityKmS}
                  y={Number(results.kineticEnergyMegatons.toFixed(2))}
                  r={6}
                  fill="#FFB45B"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] font-mono text-center text-gray-400 mt-2">
            Yellow dot marks active simulation: <strong className="text-white">{parameters.velocityKmS} km/s</strong> →{' '}
            <strong className="text-[#FFB45B]">{results.kineticEnergyMegatons.toFixed(1)} Mt</strong>
          </div>
        </div>
      </div>

      {/* Parameter Sensitivity Comparison Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0A1021] p-6 mb-8 shadow-xl">
        <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-[#20D9F2]" />
          Mathematical Parameter Sensitivity Comparison
        </h4>
        <p className="text-xs text-gray-400 mb-4">
          Demonstrates how isolated parameter variations alter total kinetic energy output:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 font-mono text-gray-400 uppercase">
                <th className="py-2.5 px-3">Parameter Doubled</th>
                <th className="py-2.5 px-3">Baseline</th>
                <th className="py-2.5 px-3">2× Variation</th>
                <th className="py-2.5 px-3">Energy Multiplier</th>
                <th className="py-2.5 px-3">Underlying Physical Law</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {sensitivityBreakdown.map((row) => (
                <tr key={row.parameter} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white">{row.parameter}</td>
                  <td className="py-2.5 px-3 text-gray-300">{row.baselineValue}</td>
                  <td className="py-2.5 px-3 text-[#20D9F2]">{row.doubledValue}</td>
                  <td className="py-2.5 px-3 font-bold text-[#FFB45B]">
                    {row.energyMultiplier}× Energy
                  </td>
                  <td className="py-2.5 px-3 text-gray-400 text-[11px] font-sans">
                    {row.mathematicalPrinciple}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explainable Physics Engine Accordion */}
      <div className="rounded-2xl border border-[#20D9F2]/20 bg-[#0A1021] p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-[#20D9F2]" />
          <h4 className="text-base font-bold uppercase tracking-wider text-white">
            Explainable Physics Engine Insights
          </h4>
        </div>
        <p className="text-xs text-gray-400 mb-6">
          Step-by-step mathematical deductions formulated deterministically from your active simulation configuration:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {explainableInsights.map((insight, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/10 bg-[#060B19]/70 p-4 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#20D9F2] block mb-1">
                  {insight.category.toUpperCase()} DEDUCTION
                </span>
                <h5 className="text-sm font-bold text-white mb-2">{insight.title}</h5>
                <p className="text-xs text-gray-300 leading-relaxed mb-3">
                  {insight.summary}
                </p>
                {insight.mathematicalFormula && (
                  <div className="p-2 rounded bg-black/40 border border-white/5 font-mono text-[11px] text-[#FFB45B] mb-2">
                    {insight.mathematicalFormula}
                  </div>
                )}
              </div>
              <p className="text-[11px] text-gray-400 italic mt-2 border-t border-white/5 pt-2">
                {insight.detailedExplanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
