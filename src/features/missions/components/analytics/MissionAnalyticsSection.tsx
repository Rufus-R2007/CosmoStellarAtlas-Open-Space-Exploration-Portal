import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BarChart3, ChevronDown, ChevronUp, Sparkles, Compass, ShieldAlert } from 'lucide-react';
import { Mission } from '../../../../types';
import { HistoricalInsightsEngine } from '../../services/HistoricalInsightsEngine';

interface MissionAnalyticsSectionProps {
  missions: Mission[];
  selectedDecade?: string | null;
  activeTimelineYear?: number;
}

const DECADE_COLORS = ['#20D9F2', '#8565FA', '#FFB45B', '#48BB78', '#ED8936', '#9F7AEA', '#38B2AC', '#F56565'];

export const MissionAnalyticsSection: React.FC<MissionAnalyticsSectionProps> = ({
  missions,
  selectedDecade,
  activeTimelineYear,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const stats = HistoricalInsightsEngine.computeArchiveStatistics(missions);
  const insights = HistoricalInsightsEngine.generateInsights(missions, selectedDecade, activeTimelineYear);

  return (
    <div className="bg-[#0A1021] border border-[#141D30] rounded-2xl overflow-hidden shadow-xl transition-all">
      {/* Header with Collapse Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#060B19]/80 hover:bg-[#081126] transition-colors border-b border-[#141D30] text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#20D9F2]/10 border border-[#20D9F2]/30 flex items-center justify-center text-[#20D9F2]">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-headline text-base sm:text-lg font-bold uppercase tracking-tight text-[#F5F7FF]">
              Historical Insights & Archive Analytics
            </h3>
            <p className="font-body text-xs text-[#98A7BF]">
              Aggregated distribution across decades, destinations, and space agencies ({missions.length} curated missions)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#20D9F2] hidden sm:inline">
            {isExpanded ? 'Hide Analytics' : 'Show Analytics'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#98A7BF]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#98A7BF]" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6 animate-in fade-in duration-300">
          {/* Key Insight Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.slice(0, 3).map((insight) => (
              <div
                key={insight.id}
                className="bg-[#060B19] border border-[#141D30] rounded-xl p-4 space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#20D9F2] uppercase font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {insight.category}
                  </span>
                  <span className="font-mono text-[#FFB45B] font-semibold bg-[#FFB45B]/10 px-2 py-0.5 rounded">
                    {insight.highlightMetric}
                  </span>
                </div>
                <h4 className="font-headline text-sm font-bold text-[#F5F7FF] leading-snug">
                  {insight.headline}
                </h4>
                <p className="font-body text-xs text-[#98A7BF] leading-relaxed">
                  {insight.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Analytical Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Chart 1: Missions by Decade */}
            <div className="bg-[#060B19] border border-[#141D30] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-headline font-bold uppercase text-[#F5F7FF] flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#20D9F2]" />
                  Missions by Launch Decade
                </span>
                <span className="text-[10px] font-mono text-[#98A7BF]">
                  Chronological Distribution
                </span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart
                    data={stats.byDecade}
                    margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="decade"
                      stroke="#98A7BF"
                      fontSize={10}
                      tickLine={false}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis
                      stroke="#98A7BF"
                      fontSize={10}
                      allowDecimals={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#060B19] border border-[#20D9F2]/40 rounded-lg p-2.5 shadow-xl text-xs font-mono">
                              <span className="text-[#20D9F2] font-bold block">{data.decade}</span>
                              <span className="text-[#F5F7FF]">Missions Launched: {data.count}</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {stats.byDecade.map((entry, index) => (
                        <Cell
                          key={`cell-dec-${index}`}
                          fill={DECADE_COLORS[index % DECADE_COLORS.length]}
                          opacity={selectedDecade === entry.decade ? 1.0 : 0.75}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Missions by Destination */}
            <div className="bg-[#060B19] border border-[#141D30] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-headline font-bold uppercase text-[#F5F7FF] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#8565FA]" />
                  Missions by Primary Destination
                </span>
                <span className="text-[10px] font-mono text-[#98A7BF]">
                  Celestial Targets
                </span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart
                    layout="vertical"
                    data={stats.byDestination.slice(0, 5)}
                    margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                  >
                    <XAxis type="number" stroke="#98A7BF" fontSize={10} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="destination"
                      stroke="#98A7BF"
                      fontSize={10}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#060B19] border border-[#8565FA]/40 rounded-lg p-2.5 shadow-xl text-xs font-mono">
                              <span className="text-[#8565FA] font-bold block">{data.destination}</span>
                              <span className="text-[#F5F7FF]">Missions: {data.count} ({data.percentage}%)</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" fill="#8565FA" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Provenance Disclosure */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#141D30]/80 text-[11px] font-mono text-[#98A7BF]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#FFB45B] shrink-0" />
            <span>
              Calculated dynamically from the application's curated archive of 20 historical missions.
              Reflects verified cataloged milestones, not total global orbital flights.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
