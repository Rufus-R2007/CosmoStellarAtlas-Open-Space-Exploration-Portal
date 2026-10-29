import { Mission } from '../../../types';

export interface DecadeStats {
  decade: string;
  count: number;
  label: string;
}

export interface DestinationStats {
  destination: string;
  count: number;
  percentage: number;
}

export interface AgencyStats {
  agency: string;
  count: number;
  percentage: number;
}

export interface MissionArchiveStatistics {
  totalMissions: number;
  completedMissions: number;
  activeMissions: number;
  totalMilestones: number;
  uniqueAgenciesCount: number;
  uniqueDestinationsCount: number;
  byDecade: DecadeStats[];
  byDestination: DestinationStats[];
  byAgency: AgencyStats[];
  byType: Array<{ type: string; count: number }>;
}

export interface HistoricalInsight {
  id: string;
  category: 'Epoch Trend' | 'Destination Focus' | 'Agency Leadership' | 'Technological Breakthrough';
  headline: string;
  detail: string;
  highlightMetric: string;
}

export class HistoricalInsightsEngine {
  /**
   * Computes dynamic aggregated statistics strictly from the provided mission dataset.
   */
  public static computeArchiveStatistics(missions: Mission[]): MissionArchiveStatistics {
    const totalMissions = missions.length;
    const completedMissions = missions.filter((m) => m.status === 'Completed').length;
    const activeMissions = missions.filter((m) => m.status === 'Active').length;
    const totalMilestones = missions.reduce((acc, m) => acc + (m.milestones?.length || 0), 0);

    // Group by decade: 1950s, 1960s, 1970s, 1980s, 1990s, 2000s, 2010s, 2020s
    const decadeBuckets: Record<string, number> = {
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
      const decadeFloor = Math.floor(m.launchYear / 10) * 10;
      const key = `${decadeFloor}s`;
      if (decadeBuckets[key] !== undefined) {
        decadeBuckets[key] += 1;
      }
    });

    const byDecade: DecadeStats[] = Object.entries(decadeBuckets).map(([decade, count]) => ({
      decade,
      count,
      label: `${decade} (${count})`,
    }));

    // Group by primary destination
    const destMap = new Map<string, number>();
    missions.forEach((m) => {
      let destKey = 'Deep Space / Interstellar';
      const destLower = m.destinationName.toLowerCase();
      if (destLower.includes('moon') || destLower.includes('lunar')) {
        destKey = 'The Moon';
      } else if (destLower.includes('mars')) {
        destKey = 'Mars';
      } else if (destLower.includes('earth') || destLower.includes('leo') || destLower.includes('orbit')) {
        destKey = 'Earth / LEO';
      } else if (destLower.includes('jupiter')) {
        destKey = 'Jupiter & Outer Worlds';
      } else if (destLower.includes('saturn')) {
        destKey = 'Saturnian System';
      } else if (destLower.includes('sun') || destLower.includes('solar')) {
        destKey = 'The Sun';
      } else if (destLower.includes('asteroid') || destLower.includes('pluto')) {
        destKey = 'Asteroids & Minor Worlds';
      }
      destMap.set(destKey, (destMap.get(destKey) || 0) + 1);
    });

    const byDestination: DestinationStats[] = Array.from(destMap.entries())
      .map(([destination, count]) => ({
        destination,
        count,
        percentage: totalMissions > 0 ? Math.round((count / totalMissions) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Group by agency
    const agencyMap = new Map<string, number>();
    missions.forEach((m) => {
      let agKey = m.agency;
      if (agKey.includes('NASA')) agKey = 'NASA (US)';
      else if (agKey.includes('Soviet') || agKey.includes('Roscosmos')) agKey = 'Soviet / Roscosmos';
      else if (agKey.includes('ISRO')) agKey = 'ISRO (India)';
      else if (agKey.includes('ESA')) agKey = 'ESA (Europe)';
      else if (agKey.includes('International')) agKey = 'International Coalition';
      agencyMap.set(agKey, (agencyMap.get(agKey) || 0) + 1);
    });

    const byAgency: AgencyStats[] = Array.from(agencyMap.entries())
      .map(([agency, count]) => ({
        agency,
        count,
        percentage: totalMissions > 0 ? Math.round((count / totalMissions) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Group by mission type
    const typeMap = new Map<string, number>();
    missions.forEach((m) => {
      typeMap.set(m.missionType, (typeMap.get(m.missionType) || 0) + 1);
    });

    const byType = Array.from(typeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalMissions,
      completedMissions,
      activeMissions,
      totalMilestones,
      uniqueAgenciesCount: agencyMap.size,
      uniqueDestinationsCount: destMap.size,
      byDecade,
      byDestination,
      byAgency,
      byType,
    };
  }

  /**
   * Generates deterministic, calculated analytical observations.
   */
  public static generateInsights(
    missions: Mission[],
    activeDecade?: string | null,
    activeYear?: number
  ): HistoricalInsight[] {
    const stats = this.computeArchiveStatistics(missions);
    const insights: HistoricalInsight[] = [];

    // Insight 1: Dominant Destination
    if (stats.byDestination.length > 0) {
      const topDest = stats.byDestination[0];
      insights.push({
        id: 'insight-dest-focus',
        category: 'Destination Focus',
        headline: `${topDest.destination} Leads Curated Flight Heritage`,
        detail: `Accounting for ${topDest.count} of ${stats.totalMissions} missions (${topDest.percentage}%), targeted robotic and crewed voyages to ${topDest.destination} represent the densest concentration of exploration milestones.`,
        highlightMetric: `${topDest.percentage}% of Archive`,
      });
    }

    // Insight 2: Agency Leadership
    if (stats.byAgency.length > 0) {
      const topAgency = stats.byAgency[0];
      insights.push({
        id: 'insight-agency-dist',
        category: 'Agency Leadership',
        headline: `${topAgency.agency} Pioneers Deep Space Archival Records`,
        detail: `With ${topAgency.count} cataloged missions spanning interplanetary flybys, orbiters, and surface rovers, ${topAgency.agency} represents ${topAgency.percentage}% of the expeditions currently surveyed in this platform.`,
        highlightMetric: `${topAgency.count} Expeditions`,
      });
    }

    // Insight 3: Decade / Temporal Trend
    if (activeDecade && activeDecade !== 'all') {
      const match = stats.byDecade.find((d) => d.decade === activeDecade);
      const count = match ? match.count : 0;
      insights.push({
        id: 'insight-decade-trend',
        category: 'Epoch Trend',
        headline: `${activeDecade} Era Exploration Density`,
        detail: `The ${activeDecade} holds ${count} recorded historical missions in this curated repository. Milestones in this epoch include significant transitions in propulsion, robotic sensors, and celestial destination reach.`,
        highlightMetric: `${count} Missions in ${activeDecade}`,
      });
    } else {
      const peakDecade = [...stats.byDecade].sort((a, b) => b.count - a.count)[0];
      insights.push({
        id: 'insight-peak-decade',
        category: 'Epoch Trend',
        headline: `Peak Exploration Epoch: ${peakDecade.decade}`,
        detail: `The ${peakDecade.decade} recorded the highest frequency of landmark planetary and deep-space missions (${peakDecade.count} expeditions), reflecting rapid expansion in solar system reconnaissance.`,
        highlightMetric: `${peakDecade.count} Expeditions`,
      });
    }

    // Insight 4: Active Synchronized Year (Time Machine Context)
    if (activeYear) {
      const yearMissions = missions.filter(
        (m) => m.launchYear === activeYear || m.milestones.some((ms) => ms.year === activeYear)
      );
      insights.push({
        id: 'insight-year-sync',
        category: 'Technological Breakthrough',
        headline: `Temporal Context for Year ${activeYear}`,
        detail:
          yearMissions.length > 0
            ? `The selected year ${activeYear} contains ${yearMissions.length} active or launched mission(s): ${yearMissions.map((m) => m.name).join(', ')}.`
            : `No initial launch occurred in ${activeYear} within this curated 20-mission sample, though earlier spacecraft continued long-duration interplanetary cruise phases.`,
        highlightMetric: `${yearMissions.length} Target(s) in ${activeYear}`,
      });
    }

    return insights;
  }
}
