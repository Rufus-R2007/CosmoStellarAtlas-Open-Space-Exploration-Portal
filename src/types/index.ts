export type DataSourceType = 'curated' | 'synthetic';

export interface PlanetAtmosphereGas {
  gas: string;
  percentage: number;
}

export type PlanetProceduralType =
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export interface PlanetVisualConfiguration {
  surfaceColor: string;
  atmosphereColor?: string;
  hasRings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  ringColor?: string;
  hasClouds?: boolean;
  cloudSpeed?: number;
  bumpScale?: number;
  roughness?: number;
  proceduralType: PlanetProceduralType;
}

export interface Planet {
  id: string; // e.g. 'mercury', 'venus', 'earth', etc.
  name: string;
  codeName: string; // e.g. 'TERRA // SOL-3'
  orderFromSun: number;
  type: 'Terrestrial' | 'Gas Giant' | 'Ice Giant';
  tagline: string;
  diameterKm: number;
  massKg: string;
  massEarthRel: number;
  distanceFromSunAU: number;
  averageDistanceFromSunKm: number;
  surfaceTempMeanC: number;
  surfaceTempRangeC: { min: number; max: number };
  gravityMs2: number;
  gravityEarthRel: number;
  moonsCount: number;
  orbitalPeriodDays: number;
  orbitalVelocityKmS: number;
  rotationPeriodHours: number;
  axialTiltDegrees: number;
  atmosphereComposition: PlanetAtmosphereGas[];
  summary: string;
  detailedDescription: string;
  notableFeatures: string[];
  discoveryPassportHighlight: string;
  suggestedNextPlanetId: string;
  colorHex: string;
  accentColor: string;
  visualConfiguration: PlanetVisualConfiguration;
  relatedMissionIds: string[];
  sourceReference: string;
  source: DataSourceType;
}

export interface MissionMilestone {
  id: string;
  missionId: string;
  year: number;
  date: string;
  title: string;
  description: string;
  significance: string;
}

export type MissionStatus = 'Completed' | 'Active' | 'Planned' | 'En Route';
export type MissionType = 'Orbiter' | 'Lander' | 'Rover' | 'Flyby' | 'Crewed' | 'Space Observatory' | 'Impactor';

export interface Mission {
  id: string;
  name: string;
  agency: string;
  launchYear: number;
  launchDate: string;
  status: MissionStatus;
  destinationPlanetId: string | null;
  destinationName: string;
  missionType: MissionType;
  description: string;
  objectives: string[];
  achievements: string[];
  milestones: MissionMilestone[];
  source: DataSourceType;
}

export interface RoverImage {
  id: string;
  sol: number;
  cameraName: string;
  cameraFullName: string;
  earthDate: string;
  caption: string;
  aspectRatio: string;
}

export interface Rover {
  id: string;
  name: string;
  agency: string;
  launchDate: string;
  landingDate: string;
  landingSite: string;
  status: 'Active' | 'Completed' | 'Mission Concluded';
  totalSols: number;
  distanceTraveledKm: number;
  sampleCount: number;
  primaryMission: string;
  keyInstruments: string[];
  sampleImages: RoverImage[];
  source: DataSourceType;
}

export interface Asteroid {
  id: string;
  name: string;
  designation: string;
  estimatedDiameterMeters: number;
  isPotentiallyHazardous: boolean;
  closeApproachDate: string;
  missDistanceKm: number;
  missDistanceLunar: number;
  relativeVelocityKmS: number;
  orbitClass: 'Apollo' | 'Aten' | 'Amor' | 'Atira' | 'Main Belt';
  simulatedRiskIndex: number; // 0.0 - 10.0
  composition: string;
  source: DataSourceType;
}

export interface LaunchEvent {
  id: string;
  name: string;
  provider: string;
  vehicle: string;
  site: string;
  targetDestination: string;
  date: string;
  status: 'Scheduled' | 'Go for Launch' | 'Holding' | 'Completed';
  payload: string;
  orbitType: string;
  source: DataSourceType;
}

export interface Briefing {
  id: string;
  sectorCode: string;
  category: string;
  timeframe: string;
  title: string;
  summary: string;
  referenceCode: string;
  source: DataSourceType;
}

export interface UserFavorite {
  id: string;
  itemType: 'planet' | 'mission' | 'rover' | 'asteroid' | 'briefing';
  itemId: string;
  title: string;
  savedAt: string;
}

export interface UserNote {
  id: string;
  targetType: string;
  targetId: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface ObservatoryStats {
  totalPlanets: number;
  totalMissions: number;
  totalRovers: number;
  totalAsteroids: number;
  activeMissions: number;
  totalSurfaceSols: number;
  potentiallyHazardousCount: number;
}
