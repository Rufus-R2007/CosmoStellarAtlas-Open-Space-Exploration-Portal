import { Recommendation, EntityType } from '../../../types';
import {
  planetsData,
  missionsData,
  roversData,
  asteroidsData,
} from '../../../data';

export interface RecommendationContext {
  selectedPlanetId?: string | null;
  selectedMissionId?: string | null;
  selectedRoverId?: string | null;
  selectedAsteroidId?: string | null;
  selectedYear?: number | null;
}

/**
 * Deterministic Explainable Recommendation Engine.
 * Evaluates active user context across modules to generate relevant, explainable recommendations.
 * 100% offline rule-based scoring with human-readable rationales.
 */
export class RecommendationEngineService {
  /**
   * Generates prioritized list of recommendations based on current app state.
   */
  public generateRecommendations(context: RecommendationContext = {}): Recommendation[] {
    const candidates: Recommendation[] = [];
    const seenEntityIds = new Set<string>();

    const { selectedPlanetId, selectedMissionId, selectedRoverId, selectedAsteroidId, selectedYear } = context;

    // Rule 0: Active Mission Context -> Target Planet or Sister Missions
    if (selectedMissionId) {
      const activeMission = missionsData.find((m) => m.id === selectedMissionId);
      if (activeMission && activeMission.destinationPlanetId) {
        const destPlanet = planetsData.find((p) => p.id === activeMission.destinationPlanetId);
        if (destPlanet && !seenEntityIds.has(destPlanet.id)) {
          seenEntityIds.add(destPlanet.id);
          candidates.push({
            id: `rec-dest-${destPlanet.id}`,
            entityId: destPlanet.id,
            entityType: 'planet',
            title: `${destPlanet.name} Target World Dossier`,
            subtitle: `${destPlanet.type} • Target of ${activeMission.name}`,
            description: `Inspect the atmospheric and physical properties of ${destPlanet.name}, targeted by the ${activeMission.name} expedition.`,
            route: `/planets?id=${destPlanet.id}`,
            relevanceScore: 0.96,
            explanation: `Recommended because you are viewing ${activeMission.name}; ${destPlanet.name} was its primary exploration destination.`,
            sourceEntityIds: [activeMission.id, destPlanet.id],
            badgeText: 'Target World',
            category: 'direct_relation',
          });
        }
      }
    }

    // Rule 1: Mars or Rover Context -> Surface Exploration and Missions
    if (selectedPlanetId === 'mars' || selectedRoverId) {
      const targetRoverId = selectedRoverId === 'curiosity' ? 'perseverance' : 'curiosity';
      const rover = roversData.find((r) => r.id === targetRoverId) || roversData[0];
      if (!seenEntityIds.has(rover.id)) {
        seenEntityIds.add(rover.id);
        candidates.push({
          id: `rec-rover-${rover.id}`,
          entityId: rover.id,
          entityType: 'rover',
          title: `${rover.name} Surface Console`,
          subtitle: `${rover.status} • ${rover.landingSite.split('(')[0].trim()}`,
          description: `Compare operational telemetry, traversed kilometers (${rover.distanceTraveledKm} km), and imaging records with your active Mars focus.`,
          route: `/rovers?id=${rover.id}`,
          relevanceScore: 0.95,
          explanation: `Recommended because you are currently exploring Martian surface environments; ${rover.name} provides direct comparative regolith data.`,
          sourceEntityIds: ['mars', rover.id],
          badgeText: 'Active Surface Asset',
          category: 'direct_relation',
        });
      }

      // Recommend Mars Planet Page if not already there
      if (!seenEntityIds.has('mars')) {
        seenEntityIds.add('mars');
        candidates.push({
          id: 'rec-planet-mars',
          entityId: 'mars',
          entityType: 'planet',
          title: 'Mars 3D Planetarium & Atmosphere',
          subtitle: 'Terrestrial World • 4th from Sun',
          description: 'Examine procedural global terrain, thin carbon-dioxide atmospheric scale height, and extreme day/night thermal shifts.',
          route: '/planets?id=mars',
          relevanceScore: 0.92,
          explanation: 'Recommended because you are inspecting Mars rover telemetry; review the planetary scale physics in Planet Explorer.',
          sourceEntityIds: ['mars'],
          badgeText: 'Destination World',
          category: 'direct_relation',
        });
      }
    }

    // Rule 2: Outer Planets (Saturn, Jupiter, Uranus, Neptune) -> Deep Space Probes
    if (selectedPlanetId === 'saturn' || selectedPlanetId === 'jupiter') {
      const missionId = selectedPlanetId === 'saturn' ? 'cassini' : 'voyager-1';
      const mission = missionsData.find((m) => m.id === missionId) || missionsData[1];
      if (!seenEntityIds.has(mission.id)) {
        seenEntityIds.add(mission.id);
        candidates.push({
          id: `rec-mission-${mission.id}`,
          entityId: mission.id,
          entityType: 'mission',
          title: `${mission.name} Flight Dossier`,
          subtitle: `${mission.agency} • ${mission.destinationName}`,
          description: `Analyze historical telemetry and milestone flyby observations recorded during ${mission.name}'s mission to ${mission.destinationName}.`,
          route: `/missions/${mission.id}`,
          relevanceScore: 0.94,
          explanation: `Recommended because you are viewing ${selectedPlanetId.toUpperCase()}; ${mission.name} was the flagship mission that mapped this planetary system.`,
          sourceEntityIds: [selectedPlanetId, mission.id],
          badgeText: 'Historic Flyby / Orbiter',
          category: 'direct_relation',
        });
      }
    }

    // Rule 3: Asteroid Context -> Planetary Defense & NEOs
    if (selectedAsteroidId) {
      const otherAsteroid = asteroidsData.find((a) => a.id !== selectedAsteroidId && a.isPotentiallyHazardous) || asteroidsData[0];
      if (!seenEntityIds.has(otherAsteroid.id)) {
        seenEntityIds.add(otherAsteroid.id);
        candidates.push({
          id: `rec-asteroid-${otherAsteroid.id}`,
          entityId: otherAsteroid.id,
          entityType: 'asteroid',
          title: `${otherAsteroid.name} Orbit Analysis`,
          subtitle: `${otherAsteroid.orbitClass} NEO • Miss Distance ${otherAsteroid.missDistanceLunar.toFixed(2)} LD`,
          description: `Compare close-approach parameters and planetary defense risk indices with your selected asteroid.`,
          route: `/asteroids?id=${otherAsteroid.id}`,
          relevanceScore: 0.93,
          explanation: `Recommended because you are examining Near-Earth Objects; ${otherAsteroid.name} exhibits significant close-approach surveillance data.`,
          sourceEntityIds: [selectedAsteroidId, otherAsteroid.id],
          badgeText: 'Hazardous NEO',
          category: 'scientific_parallel',
        });
      }
    }

    // Rule 4: Temporal Year Context -> Contemporary Spaceflight
    if (selectedYear) {
      const yearMissions = missionsData.filter((m) => m.launchYear === selectedYear);
      if (yearMissions.length > 0 && !seenEntityIds.has(yearMissions[0].id)) {
        const m = yearMissions[0];
        seenEntityIds.add(m.id);
        candidates.push({
          id: `rec-temporal-${m.id}`,
          entityId: m.id,
          entityType: 'mission',
          title: `${m.name} (${m.launchYear})`,
          subtitle: `${m.agency} • ${m.destinationName}`,
          description: `Replay the launch trajectory and flight milestones of this signature spacecraft from the year ${selectedYear}.`,
          route: `/missions/${m.id}`,
          relevanceScore: 0.91,
          explanation: `Recommended because your active Cosmic Time Machine exploration year is set to ${selectedYear}.`,
          sourceEntityIds: [m.id],
          badgeText: `Year ${selectedYear}`,
          category: 'temporal_context',
        });
      }
    }

    // Rule 5: Curated Exploratory Recommendations (ensure a diverse 4-6 item deck)
    const defaults: Array<{
      entityId: string;
      entityType: EntityType;
      title: string;
      subtitle: string;
      description: string;
      route: string;
      relevanceScore: number;
      explanation: string;
      badgeText: string;
      category: 'direct_relation' | 'temporal_context' | 'scientific_parallel' | 'exploratory_curiosity';
    }> = [
      {
        entityId: 'voyager-1',
        entityType: 'mission',
        title: 'Voyager 1: The Interstellar Journey',
        subtitle: 'NASA / JPL • Launched 1977 • Interstellar Medium',
        description: 'Humanity\'s most distant robotic ambassador, now transmitting telemetry from over 24 billion km beyond the heliosphere.',
        route: '/missions/voyager-1',
        relevanceScore: 0.88,
        explanation: 'Curated signature mission showcasing extreme long-duration spacecraft engineering and interstellar plasma boundary data.',
        badgeText: 'Interstellar Asset',
        category: 'exploratory_curiosity',
      },
      {
        entityId: '99942-apophis',
        entityType: 'asteroid',
        title: '99942 Apophis: Sub-Geostationary Flyby',
        subtitle: 'Aten NEO • 370m Diameter • April 2029 Approach',
        description: 'Witness the trajectory of an asteroid destined to pass within 31,600 km of Earth—inside our communications satellite ring.',
        route: '/asteroids?id=99942-apophis',
        relevanceScore: 0.85,
        explanation: 'Benchmark planetary defense object demonstrating gravitational keyholes and radar orbital determination.',
        badgeText: 'Historic Flyby',
        category: 'scientific_parallel',
      },
      {
        entityId: 'perseverance',
        entityType: 'rover',
        title: 'Perseverance: Jezero Crater Paleolake Delta',
        subtitle: 'NASA / JPL • 1,300+ Sols • 26 Sample Tubes',
        description: 'Explore high-resolution Mastcam-Z stereo imagery and titanium core sample locations collected on the Martian surface.',
        route: '/rovers?id=perseverance',
        relevanceScore: 0.84,
        explanation: 'Flagship active astrobiology laboratory seeking fossil evidence of microbial life in ancient Martian river sediment.',
        badgeText: 'Active Astrobiology',
        category: 'direct_relation',
      },
      {
        entityId: 'venus',
        entityType: 'planet',
        title: 'Venus: The Runaway Greenhouse World',
        subtitle: 'Terrestrial Planet • 464°C Mean Temp • 92 Bar Pressure',
        description: 'Investigate the dramatic physical contrast between Earth and our sister world, blanketed in crushing supercritical carbon dioxide.',
        route: '/planets?id=venus',
        relevanceScore: 0.80,
        explanation: 'Essential comparative planetology case study in atmospheric evolution and runaway thermal greenhouse equilibrium.',
        badgeText: 'Extreme Climate',
        category: 'scientific_parallel',
      },
      {
        entityId: 'apollo-11',
        entityType: 'mission',
        title: 'Apollo 11: Humanity\'s First Lunar Footstep',
        subtitle: 'NASA • July 1969 • Mare Tranquillitatis',
        description: 'Experience the historic mission replay, Saturn V stage burns, and lunar descent radar telemetry from July 20, 1969.',
        route: '/missions/apollo-11',
        relevanceScore: 0.78,
        explanation: 'Foundational human exploration milestone demonstrating lunar orbit rendezvous and high-reliability life support.',
        badgeText: 'Landmark Milestone',
        category: 'temporal_context',
      },
    ];

    for (const def of defaults) {
      if (!seenEntityIds.has(def.entityId)) {
        seenEntityIds.add(def.entityId);
        candidates.push({
          id: `rec-default-${def.entityId}`,
          ...def,
          sourceEntityIds: [def.entityId],
        });
      }
    }

    // Sort by relevance score descending and return top 5
    return candidates.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 5);
  }
}

export const recommendationEngineService = new RecommendationEngineService();
