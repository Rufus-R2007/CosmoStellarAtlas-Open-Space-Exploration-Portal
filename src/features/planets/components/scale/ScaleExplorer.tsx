import React, { useState } from 'react';
import {
  Maximize,
  Ruler,
  Orbit,
  Clock,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Planet } from '../../../../types';
import { Card } from '../../../../components/common/Card';
import { SectionHeader } from '../../../../components/common/SectionHeader';
import { formatOrbitalPeriod, formatDistanceKm } from '../../../../utils/planetaryMath';

interface ScaleExplorerProps {
  planets: Planet[];
}

export const ScaleExplorer: React.FC<ScaleExplorerProps> = ({ planets }) => {
  const [scaleCategory, setScaleCategory] = useState<'diameter' | 'distance' | 'orbit'>('diameter');

  // Sort planets by order from sun
  const sortedPlanets = [...planets].sort((a, b) => a.orderFromSun - b.orderFromSun);

  const diameterData = sortedPlanets.map((p) => ({
    name: p.name,
    diameter: p.diameterKm,
    color: p.colorHex,
    earthRatio: (p.diameterKm / 12742).toFixed(2),
  }));

  const distanceData = sortedPlanets.map((p) => ({
    name: p.name,
    distanceAU: p.distanceFromSunAU,
    distanceKm: p.averageDistanceFromSunKm,
    color: p.colorHex,
  }));

  const orbitData = sortedPlanets.map((p) => ({
    name: p.name,
    earthYears: Number((p.orbitalPeriodDays / 365.25).toFixed(2)),
    days: p.orbitalPeriodDays,
    color: p.colorHex,
  }));

  return (
    <section className="my-12">
      <SectionHeader
        icon={<Maximize className="w-5 h-5 text-[#20D9F2]" />}
        eyebrow="Astronomical Dimensions"
        title="Scale of the Solar System"
        subtitle="Explore the extreme dimensional divergences across planetary diameters, heliocentric distances, and orbital years."
        action={
          <div className="flex rounded-lg bg-[#0A1021] border border-[#141D30] p-0.5 text-xs font-telemetry uppercase">
            <button
              onClick={() => setScaleCategory('diameter')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                scaleCategory === 'diameter'
                  ? 'bg-[#20D9F2] text-[#00363E] font-bold'
                  : 'text-[#98A7BF] hover:text-[#F5F7FF]'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Diameter</span>
            </button>
            <button
              onClick={() => setScaleCategory('distance')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                scaleCategory === 'distance'
                  ? 'bg-[#20D9F2] text-[#00363E] font-bold'
                  : 'text-[#98A7BF] hover:text-[#F5F7FF]'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>Distance (AU)</span>
            </button>
            <button
              onClick={() => setScaleCategory('orbit')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                scaleCategory === 'orbit'
                  ? 'bg-[#20D9F2] text-[#00363E] font-bold'
                  : 'text-[#98A7BF] hover:text-[#F5F7FF]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Orbital Period</span>
            </button>
          </div>
        }
      />

      <Card className="p-6 bg-[#0A1021]/80 border-[#1D2A44] shadow-xl space-y-6">
        {/* Category 1: Planetary Diameter Scale Visualizer */}
        {scaleCategory === 'diameter' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-headline text-base font-bold uppercase text-[#F5F7FF]">
                  Planetary Diameter Scaling (Mercury to Jupiter)
                </h4>
                <p className="font-body text-xs text-[#98A7BF] mt-0.5">
                  Proportional representation of equatorial diameters relative to Earth (1.00×).
                </p>
              </div>
              <span className="font-mono text-xs text-[#20D9F2]">139,820 km Max Scale</span>
            </div>

            {/* Proportional Circles Display */}
            <div className="p-6 rounded-xl bg-[#060B19]/80 border border-[#141D30] flex flex-wrap items-end justify-around gap-4 min-h-[180px]">
              {sortedPlanets.map((p) => {
                const diameterPx = Math.max(16, Math.min(130, (p.diameterKm / 139820) * 130));
                return (
                  <div key={p.id} className="flex flex-col items-center group">
                    <div
                      className="rounded-full transition-transform group-hover:scale-110 shadow-lg"
                      style={{
                        width: `${diameterPx}px`,
                        height: `${diameterPx}px`,
                        backgroundColor: p.colorHex,
                      }}
                      title={`${p.name}: ${p.diameterKm.toLocaleString()} km`}
                    />
                    <span className="mt-2 font-headline text-xs font-semibold text-[#F5F7FF] uppercase">
                      {p.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#20D9F2]">
                      {(p.diameterKm / 12742).toFixed(2)}⊕
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bar Chart Representation */}
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diameterData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#141D30" vertical={false} />
                  <XAxis dataKey="name" stroke="#98A7BF" tick={{ fill: '#98A7BF', fontSize: 11 }} />
                  <YAxis stroke="#98A7BF" tick={{ fill: '#98A7BF', fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0A1021] border border-[#20D9F2]/40 p-2.5 rounded-lg shadow-xl text-xs font-mono">
                            <p className="font-headline font-bold text-[#F5F7FF] uppercase">
                              {payload[0].payload.name}
                            </p>
                            <p className="text-[#20D9F2]">
                              Diameter: {Number(payload[0].value).toLocaleString()} km
                            </p>
                            <p className="text-[#98A7BF]">
                              Ratio: {payload[0].payload.earthRatio}× Earth
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="diameter" radius={[4, 4, 0, 0]}>
                    {diameterData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Category 2: Distance from Sun Scale */}
        {scaleCategory === 'distance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-headline text-base font-bold uppercase text-[#F5F7FF]">
                  Average Heliocentric Distance in Astronomical Units (AU)
                </h4>
                <p className="font-body text-xs text-[#98A7BF] mt-0.5">
                  1 AU = 149.6 Million km (Mean Earth-Sun orbital separation).
                </p>
              </div>
              <span className="font-mono text-xs text-[#20D9F2]">Neptune: 30.07 AU</span>
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#141D30" vertical={false} />
                  <XAxis dataKey="name" stroke="#98A7BF" tick={{ fill: '#98A7BF', fontSize: 11 }} />
                  <YAxis stroke="#98A7BF" tick={{ fill: '#98A7BF', fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0A1021] border border-[#20D9F2]/40 p-2.5 rounded-lg shadow-xl text-xs font-mono">
                            <p className="font-headline font-bold text-[#F5F7FF] uppercase">
                              {payload[0].payload.name}
                            </p>
                            <p className="text-[#20D9F2]">
                              Heliocentric Distance: {payload[0].value} AU
                            </p>
                            <p className="text-[#98A7BF]">
                              Distance in km: {formatDistanceKm(payload[0].payload.distanceKm)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="distanceAU" radius={[4, 4, 0, 0]}>
                    {distanceData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Category 3: Orbital Period (Year Length) */}
        {scaleCategory === 'orbit' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-headline text-base font-bold uppercase text-[#F5F7FF]">
                  Planetary Orbital Years (Earth Year Equivalent)
                </h4>
                <p className="font-body text-xs text-[#98A7BF] mt-0.5">
                  Governed by Kepler's Third Law: The square of orbital period is proportional to the cube of semi-major axis.
                </p>
              </div>
              <span className="font-mono text-xs text-[#20D9F2]">Neptune: 164.8 Earth Years</span>
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orbitData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#141D30" vertical={false} />
                  <XAxis dataKey="name" stroke="#98A7BF" tick={{ fill: '#98A7BF', fontSize: 11 }} />
                  <YAxis stroke="#98A7BF" tick={{ fill: '#98A7BF', fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0A1021] border border-[#20D9F2]/40 p-2.5 rounded-lg shadow-xl text-xs font-mono">
                            <p className="font-headline font-bold text-[#F5F7FF] uppercase">
                              {payload[0].payload.name}
                            </p>
                            <p className="text-[#20D9F2]">
                              Revolution: {payload[0].value} Earth Years
                            </p>
                            <p className="text-[#98A7BF]">
                              Period: {formatOrbitalPeriod(payload[0].payload.days)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="earthYears" radius={[4, 4, 0, 0]}>
                    {orbitData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Educational Scale Notes Callout */}
        <div className="p-4 rounded-xl bg-[#060B19]/70 border border-[#141D30] text-xs text-[#98A7BF] space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#F5F7FF] font-headline font-semibold uppercase">
            <Info className="w-4 h-4 text-[#20D9F2]" />
            <span>Why Space Illustrations Cannot Share a Linear Scale</span>
          </div>
          <p className="leading-relaxed">
            The Solar System is overwhelmingly empty space. If Earth were scaled down to the size of a standard 1 cm marble, the Sun would measure 1.09 meters wide at a distance of 117 meters away, while Neptune would be an icy pea located 3.5 kilometers down the road. This extreme spatial disparity is why planetary diameters and interplanetary distances are illustrated separately.
          </p>
        </div>
      </Card>
    </section>
  );
};
