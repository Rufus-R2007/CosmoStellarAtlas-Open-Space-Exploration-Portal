import {
  Planet,
  Mission,
  Rover,
  Asteroid,
  LaunchEvent,
  Briefing,
  ObservatoryStats,
} from '../types';
import {
  SpaceDataProvider,
  MissionFilterOptions,
  AsteroidFilterOptions,
  SearchResults,
} from './SpaceDataProvider';
import {
  planetsData,
  missionsData,
  roversData,
  asteroidsData,
  launchesData,
  briefingsData,
} from '../data';

export class MockSpaceDataProvider implements SpaceDataProvider {
  private simulatedDelayMs: number = 0;
  private simulateError: boolean = false;

  constructor(delayMs: number = 0) {
    this.simulatedDelayMs = delayMs;
  }

  public setSimulatedDelay(ms: number): void {
    this.simulatedDelayMs = Math.max(0, ms);
  }

  public setSimulatedError(enabled: boolean): void {
    this.simulateError = enabled;
  }

  private async simulateNetwork(): Promise<void> {
    if (this.simulatedDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.simulatedDelayMs));
    }
    if (this.simulateError) {
      throw new Error('SIMULATED_PROVIDER_ERROR: Controlled telemetry uplink interruption.');
    }
  }

  public async getPlanets(): Promise<Planet[]> {
    await this.simulateNetwork();
    return [...planetsData].sort((a, b) => a.orderFromSun - b.orderFromSun);
  }

  public async getPlanetById(id: string): Promise<Planet | null> {
    await this.simulateNetwork();
    const planet = planetsData.find((p) => p.id.toLowerCase() === id.toLowerCase());
    return planet ? { ...planet } : null;
  }

  public async getMissions(filter?: MissionFilterOptions): Promise<Mission[]> {
    await this.simulateNetwork();
    let result = [...missionsData];

    if (filter) {
      if (filter.agency) {
        result = result.filter((m) =>
          m.agency.toLowerCase().includes(filter.agency!.toLowerCase())
        );
      }
      if (filter.destinationPlanetId) {
        result = result.filter(
          (m) => m.destinationPlanetId === filter.destinationPlanetId
        );
      }
      if (filter.status) {
        result = result.filter(
          (m) => m.status.toLowerCase() === filter.status!.toLowerCase()
        );
      }
      if (filter.type) {
        result = result.filter(
          (m) => m.missionType.toLowerCase() === filter.type!.toLowerCase()
        );
      }
      if (filter.year !== undefined) {
        result = result.filter(
          (m) =>
            m.launchYear === filter.year ||
            m.milestones.some((ms) => ms.year === filter.year)
        );
      }
      if (filter.minYear !== undefined) {
        result = result.filter((m) => m.launchYear >= filter.minYear!);
      }
      if (filter.maxYear !== undefined) {
        result = result.filter((m) => m.launchYear <= filter.maxYear!);
      }
    }

    return result.sort((a, b) => a.launchYear - b.launchYear);
  }

  public async getMissionById(id: string): Promise<Mission | null> {
    await this.simulateNetwork();
    const mission = missionsData.find((m) => m.id.toLowerCase() === id.toLowerCase());
    return mission ? { ...mission } : null;
  }

  public async getRovers(): Promise<Rover[]> {
    await this.simulateNetwork();
    return [...roversData];
  }

  public async getRoverById(id: string): Promise<Rover | null> {
    await this.simulateNetwork();
    const rover = roversData.find((r) => r.id.toLowerCase() === id.toLowerCase());
    return rover ? { ...rover } : null;
  }

  public async getAsteroids(filter?: AsteroidFilterOptions): Promise<Asteroid[]> {
    await this.simulateNetwork();
    let result = [...asteroidsData];

    if (filter) {
      if (filter.hazardousOnly) {
        result = result.filter((a) => a.isPotentiallyHazardous);
      }
      if (filter.orbitClass) {
        result = result.filter(
          (a) => a.orbitClass.toLowerCase() === filter.orbitClass!.toLowerCase()
        );
      }
    }

    return result.sort((a, b) => b.simulatedRiskIndex - a.simulatedRiskIndex);
  }

  public async getAsteroidById(id: string): Promise<Asteroid | null> {
    await this.simulateNetwork();
    const asteroid = asteroidsData.find((a) => a.id.toLowerCase() === id.toLowerCase());
    return asteroid ? { ...asteroid } : null;
  }

  public async getLaunches(filter?: { status?: string }): Promise<LaunchEvent[]> {
    await this.simulateNetwork();
    let result = [...launchesData];
    if (filter?.status) {
      result = result.filter((l) => l.status.toLowerCase() === filter.status!.toLowerCase());
    }
    return result;
  }

  public async getBriefings(): Promise<Briefing[]> {
    await this.simulateNetwork();
    return [...briefingsData];
  }

  public async search(query: string): Promise<SearchResults> {
    await this.simulateNetwork();
    const q = query.trim().toLowerCase();

    if (!q) {
      return {
        planets: [],
        missions: [],
        rovers: [],
        asteroids: [],
        briefings: [],
      };
    }

    return {
      planets: planetsData.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.codeName.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
      ),
      missions: missionsData.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.agency.toLowerCase().includes(q) ||
          m.destinationName.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      ),
      rovers: roversData.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.landingSite.toLowerCase().includes(q) ||
          r.primaryMission.toLowerCase().includes(q)
      ),
      asteroids: asteroidsData.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.designation.toLowerCase().includes(q) ||
          a.composition.toLowerCase().includes(q)
      ),
      briefings: briefingsData.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.summary.toLowerCase().includes(q) ||
          b.sectorCode.toLowerCase().includes(q)
      ),
    };
  }

  public async getObservatoryStats(): Promise<ObservatoryStats> {
    await this.simulateNetwork();
    return {
      totalPlanets: planetsData.length,
      totalMissions: missionsData.length,
      totalRovers: roversData.length,
      totalAsteroids: asteroidsData.length,
      activeMissions: missionsData.filter((m) => m.status === 'Active').length,
      totalSurfaceSols: roversData.reduce((acc, r) => acc + r.totalSols, 0),
      potentiallyHazardousCount: asteroidsData.filter((a) => a.isPotentiallyHazardous).length,
    };
  }
}

// Global Singleton Instance
export const spaceService = new MockSpaceDataProvider(0);
