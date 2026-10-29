import React from 'react';
import { Globe, Rocket, Radio, ShieldAlert } from 'lucide-react';
import { StatCard } from '../../../components/common/StatCard';
import { ObservatoryStats } from '../../../types';

interface StatsSectionProps {
  stats: ObservatoryStats;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
      {/* Stat 1: Planets */}
      <StatCard
        label="Planets Cataloged"
        value={stats.totalPlanets}
        unit="Major Worlds"
        subtext="Active Ephemerides"
        badgeText="100% ONLINE"
        glow="cyan"
        icon={<Globe className="w-5 h-5 text-[#20D9F2]" />}
      />

      {/* Stat 2: Missions */}
      <StatCard
        label="Flight Heritage"
        value={stats.totalMissions}
        unit="Missions"
        subtext="Apollo to Artemis"
        badgeText={`${stats.activeMissions} ACTIVE`}
        glow="violet"
        icon={<Rocket className="w-5 h-5 text-[#8565FA]" />}
      />

      {/* Stat 3: Surface Telemetry */}
      <StatCard
        label="Surface Telemetry"
        value={stats.totalSurfaceSols}
        unit="Surface Sols"
        subtext={`${stats.totalRovers} Planetary Rovers`}
        badgeText="RAW OPTICS"
        glow="gold"
        icon={<Radio className="w-5 h-5 text-[#FFB45B]" />}
      />

      {/* Stat 4: Orbital Defense NEOs */}
      <StatCard
        label="Orbital Defense"
        value={stats.totalAsteroids}
        unit="Cataloged NEOs"
        subtext={`${stats.potentiallyHazardousCount} Hazardous Tracked`}
        badgeText="SIM RUNNING"
        glow="cyan"
        icon={<ShieldAlert className="w-5 h-5 text-rose-400" />}
      />
    </section>
  );
};
