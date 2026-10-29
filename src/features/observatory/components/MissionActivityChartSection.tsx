import React, { useState, useMemo } from 'react';
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
import { BarChart3 } from 'lucide-react';
import { Mission } from '../../../types';
import { Card } from '../../../components/common/Card';
import { SectionHeader } from '../../../components/common/SectionHeader';

interface MissionActivityChartSectionProps {
  missions: Mission[];
}

export const MissionActivityChartSection: React.FC<MissionActivityChartSectionProps> = ({ missions }) => {
  const [chartMode, setChartMode] = useState<'decade' | 'destination'>('decade');

  // Calculate missions grouped by decade from actual dataset
  const decadeData = useMemo(() => {
    const decadesMap: Record<string, number> = {
      '1950s': 0,
      '1960s': 0,
      '1970s': 0,
      '1980s': 0,
      '1990s': 0,
      '2000s': 0,
      '2010s': 0,
      '2020s': 0,
    };

    missions.forEach((m) => {
      const decade = Math.floor(m.launchYear / 10) * 10;
      const key = `${decade}s`;
      if (decadesMap[key] !== undefined) {
        decadesMap[key] += 1;
      }
    });

    return Object.entries(decadesMap).map(([decade, count]) => ({
      name: decade,
      missions: count,
    }));
  }, [missions]);

  // Calculate missions grouped by destination from actual dataset
  const destinationData = useMemo(() => {
    const destMap: Record<string, number> = {
      'Earth / Moon': 0,
      'Mars': 0,
      'Outer Giants': 0,
      'Deep Space': 0,
    };

    missions.forEach((m) => {
      if (m.destinationPlanetId === 'earth' || m.destinationName.toLowerCase().includes('moon')) {
        destMap['Earth / Moon'] += 1;
      } else if (m.destinationPlanetId === 'mars') {
        destMap['Mars'] += 1;
      } else if (
        m.destinationPlanetId === 'jupiter' ||
        m.destinationPlanetId === 'saturn' ||
        m.destinationPlanetId === 'neptune'
      ) {
        destMap['Outer Giants'] += 1;
      } else {
        destMap['Deep Space'] += 1;
      }
    });

    return Object.entries(destMap).map(([category, count]) => ({
      name: category,
      missions: count,
    }));
  }, [missions]);

  const activeData = chartMode === 'decade' ? decadeData : destinationData;

  const barColors = ['#20D9F2', '#8565FA', '#FFB45B', '#9BEFFF', '#CBBEFF', '#FFDCBA', '#20D9F2', '#8565FA'];

  return (
    <section className="my-12">
      <SectionHeader
        icon={<BarChart3 className="w-5 h-5 text-[#20D9F2]" />}
        eyebrow="Mission Telemetry Analytics"
        title="Mission Activity Overview"
        subtitle="Historical distribution of cataloged spaceflight expeditions dynamically computed from the local archive."
        action={
          <div className="flex rounded-lg bg-[#0A1021] border border-[#141D30] p-0.5">
            <button
              onClick={() => setChartMode('decade')}
              className={`px-3 py-1.5 rounded-md font-telemetry text-xs uppercase transition-colors ${
                chartMode === 'decade'
                  ? 'bg-[#20D9F2] text-[#00363E] font-bold'
                  : 'text-[#98A7BF] hover:text-[#F5F7FF]'
              }`}
            >
              By Decade
            </button>
            <button
              onClick={() => setChartMode('destination')}
              className={`px-3 py-1.5 rounded-md font-telemetry text-xs uppercase transition-colors ${
                chartMode === 'destination'
                  ? 'bg-[#20D9F2] text-[#00363E] font-bold'
                  : 'text-[#98A7BF] hover:text-[#F5F7FF]'
              }`}
            >
              By Destination
            </button>
          </div>
        }
      />

      <Card className="p-6 bg-[#0A1021]/80 border-[#1D2A44] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="font-telemetry text-xs uppercase tracking-wider text-[#98A7BF]">
            {chartMode === 'decade'
              ? 'Cataloged Space Missions Grouped by Decade (1950s - 2020s)'
              : 'Expeditions Grouped by Destination Class'}
          </span>
          <span className="font-mono text-xs text-[#20D9F2]">
            Total Dataset: {missions.length} Missions
          </span>
        </div>

        <div className="h-[280px] w-full" data-testid="mission-activity-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activeData}
              margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#141D30" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#98A7BF"
                tick={{ fill: '#98A7BF', fontSize: 11, fontFamily: 'Space Grotesk' }}
                axisLine={{ stroke: '#141D30' }}
              />
              <YAxis
                allowDecimals={false}
                stroke="#98A7BF"
                tick={{ fill: '#98A7BF', fontSize: 11, fontFamily: 'Space Grotesk' }}
                axisLine={{ stroke: '#141D30' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0A1021] border border-[#20D9F2]/50 p-2.5 rounded-lg shadow-xl text-xs font-mono">
                        <p className="font-headline font-bold text-[#F5F7FF] uppercase mb-1">
                          {payload[0].payload.name}
                        </p>
                        <p className="text-[#20D9F2]">
                          Cataloged: <span className="font-bold text-white">{payload[0].value}</span> missions
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="missions" radius={[4, 4, 0, 0]}>
                {activeData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={barColors[index % barColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  );
};
