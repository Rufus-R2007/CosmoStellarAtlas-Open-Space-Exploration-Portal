import {
  Planet,
  Mission,
  Rover,
  Asteroid,
  LaunchEvent,
  Briefing,
  ObservatoryStats,
} from '../types';

export interface MissionFilterOptions {
  agency?: string;
  destinationPlanetId?: string;
  status?: string;
  year?: number;
  minYear?: number;
  maxYear?: number;
  type?: string;
}

export interface AsteroidFilterOptions {
  hazardousOnly?: boolean;
  orbitClass?: string;
}

export interface SearchResults {
  planets: Planet[];
  missions: Mission[];
  rovers: Rover[];
  asteroids: Asteroid[];
  briefings: Briefing[];
}

export interface SpaceDataProvider {
  getPlanets(): Promise<Planet[]>;
  getPlanetById(id: string): Promise<Planet | null>;
  
  getMissions(filter?: MissionFilterOptions): Promise<Mission[]>;
  getMissionById(id: string): Promise<Mission | null>;
  
  getRovers(): Promise<Rover[]>;
  getRoverById(id: string): Promise<Rover | null>;
  
  getAsteroids(filter?: AsteroidFilterOptions): Promise<Asteroid[]>;
  getAsteroidById(id: string): Promise<Asteroid | null>;
  
  getLaunches(filter?: { status?: string }): Promise<LaunchEvent[]>;
  getBriefings(): Promise<Briefing[]>;
  
  search(query: string): Promise<SearchResults>;
  getObservatoryStats(): Promise<ObservatoryStats>;
  
  // Controlled simulation controls for testing and demonstration
  setSimulatedDelay(ms: number): void;
  setSimulatedError(enabled: boolean): void;
}

