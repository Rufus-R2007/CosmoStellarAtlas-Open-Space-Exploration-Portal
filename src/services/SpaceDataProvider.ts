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
  syntheticCategory?: string;
  minDiameterM?: number;
  maxDiameterM?: number;
  minVelocityKmS?: number;
  maxVelocityKmS?: number;
  maxMissDistanceKm?: number;
  startDate?: string;
  endDate?: string;
  query?: string;
  source?: 'curated' | 'synthetic';
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
  getRoverImages(filter?: { roverId?: string; sol?: number; cameraId?: string; tag?: string; assetKind?: string }): Promise<import('../types').RoverImage[]>;
  getRoverImageById(id: string): Promise<import('../types').RoverImage | null>;
  getRoverWaypoints(roverId?: string): Promise<import('../types').JourneyWaypoint[]>;
  getRoverCameras(roverId?: string): Promise<import('../types').RoverCamera[]>;
  
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

