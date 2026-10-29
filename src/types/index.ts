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

export type MilestoneEventType =
  | 'launch'
  | 'transit'
  | 'flyby'
  | 'orbit'
  | 'landing'
  | 'discovery'
  | 'milestone'
  | 'conclusion';

export type ReplaySceneType =
  | 'launchpad'
  | 'orbital_insertion'
  | 'deep_space_cruise'
  | 'planetary_flyby'
  | 'surface_descent'
  | 'scientific_survey'
  | 'impact';

export interface MissionMilestone {
  id: string;
  missionId: string;
  year: number;
  date: string;
  title: string;
  description: string;
  significance: string;
  eventType?: MilestoneEventType;
  chronologicalOrder?: number;
  relatedCelestialBodyId?: string;
  replaySceneType?: ReplaySceneType;
  sourceType?: DataSourceType;
  sourceReference?: string;
}

export type MissionStatus = 'Completed' | 'Active' | 'Planned' | 'En Route';
export type MissionType = 'Orbiter' | 'Lander' | 'Rover' | 'Flyby' | 'Crewed' | 'Space Observatory' | 'Impactor';

export interface SpacecraftDetails {
  name?: string;
  type?: string;
  massKg?: number;
  launchVehicle?: string;
  powerSource?: string;
  operatingEnvironment?: string;
  instruments?: string[];
}

export interface MissionStoryline {
  theChallenge: string;
  theMission: string;
  theJourney: string;
  theDiscovery: string;
  theLegacy: string;
}

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
  spacecraftDetails?: SpacecraftDetails;
  outcome?: string;
  storyline?: MissionStoryline;
  sourceReference?: string;
  source: DataSourceType;
}

export type TimeCapsuleCategory =
  | 'Artificial Satellites'
  | 'Human Spaceflight'
  | 'Lunar Exploration'
  | 'Planetary Flybys'
  | 'Space Telescopes'
  | 'Mars Exploration'
  | 'Outer Solar System'
  | 'Planetary Defense';

export interface TimeCapsule {
  id: string;
  year: number;
  date: string;
  title: string;
  associatedMissionId: string;
  agency: string;
  destination: string;
  category: TimeCapsuleCategory;
  shortExplanation: string;
  scientificSignificance: string;
  relatedCelestialBodyId: string;
  sourceReference: string;
  badgeText?: string;
}

export interface RoverSpecification {
  massKg: number;
  dimensions: string;
  powerSource: string;
  mobilitySystem: string;
  topSpeedCmPerSec: number;
  expectedLifetime: string;
  wheelCount: number;
  wheelDiameterCm: number;
}

export interface RoverInstrument {
  id: string;
  name: string;
  abbreviation: string;
  purpose: string;
  description: string;
}

export interface RoverEducationalConcept {
  id: string;
  title: string;
  category: 'mobility' | 'communications' | 'optics' | 'science' | 'geology';
  explanation: string;
}

export type AnnotationType =
  | 'rock_formation'
  | 'surface_texture'
  | 'rover_hardware'
  | 'geological_context'
  | 'terrain_feature';

export interface ImageAnnotation {
  id: string;
  imageId: string;
  label: string;
  description: string;
  normalizedX: number; // 0..100 percentage from left
  normalizedY: number; // 0..100 percentage from top
  normalizedWidth: number; // 0..100 percentage width
  normalizedHeight: number; // 0..100 percentage height
  annotationType: AnnotationType;
  provenance: 'Curated Educational Annotations' | 'Illustrative Annotations';
}

export type RoverAssetKind = 'historical_photo' | 'illustrative_render';

export interface RoverImage {
  id: string;
  roverId?: string;
  sol: number;
  cameraId?: string;
  cameraName: string;
  cameraFullName: string;
  cameraAbbreviation?: string;
  earthDate: string;
  captureDate?: string;
  title?: string;
  caption: string;
  description?: string;
  assetPath?: string;
  thumbnailPath?: string;
  tags?: string[];
  annotationIds?: string[];
  annotations?: ImageAnnotation[];
  assetKind?: RoverAssetKind;
  sourceReference?: string;
  licenseOrAttribution?: string;
  aspectRatio: string;
  educationalNotes?: string;
}

export interface RoverCamera {
  id: string;
  roverId: string;
  name: string;
  abbreviation: string;
  purpose: string;
  description: string;
  cameraType: 'Science' | 'Engineering' | 'Descent & Navigation' | 'Microscopic';
}

export interface JourneyWaypoint {
  id: string;
  roverId: string;
  title: string;
  description: string;
  sol: number;
  orderIndex: number;
  positionX: number; // 0..100 percentage on schematic terrain canvas
  positionY: number; // 0..100 percentage on schematic terrain canvas
  imageIds?: string[];
  missionSignificance: string;
  elevationMeters: number;
  distanceFromLandingKm: number;
  sourceType: DataSourceType;
}

export interface SolRecord {
  sol: number;
  roverId: string;
  earthDate: string;
  summary: string;
  highlights: string[];
  distanceTraveledMeters: number;
  imageCount: number;
}

export interface Rover {
  id: string;
  name: string;
  missionId?: string;
  agency: string;
  launchDate: string;
  landingDate: string;
  landingSite: string;
  landingRegion?: string;
  status: 'Active' | 'Completed' | 'Mission Concluded';
  historicalStatus?: 'Active' | 'Completed' | 'Mission Concluded';
  totalSols: number;
  distanceTraveledKm: number;
  sampleCount: number;
  primaryMission: string;
  description?: string;
  objectives?: string[];
  specifications?: RoverSpecification;
  instruments?: RoverInstrument[];
  achievements?: string[];
  educationalConcepts?: RoverEducationalConcept[];
  imageIds?: string[];
  keyInstruments: string[];
  sampleImages: RoverImage[];
  source: DataSourceType;
  sourceReferences?: string;
}

export interface Asteroid {
  id: string;
  name: string;
  designation: string;
  estimatedDiameterMeters: number;
  estimatedDiameterMinM?: number;
  estimatedDiameterMaxM?: number;
  estimatedDiameterMeanM?: number;
  isPotentiallyHazardous: boolean;
  closeApproachDate: string;
  missDistanceKm: number;
  missDistanceLunar: number;
  relativeVelocityKmS: number;
  orbitClass: 'Apollo' | 'Aten' | 'Amor' | 'Atira' | 'Main Belt';
  simulatedRiskIndex: number; // 0.0 - 10.0
  composition: string;
  estimatedComposition?: string;
  syntheticCategory?: string;
  observationCategory?: string;
  syntheticClassification?: string;
  scenarioDescription?: string;
  description?: string;
  dataStatus?: string;
  datasetReferenceDate?: string;
  educationalNotes?: string;
  source: DataSourceType;
}

export interface SimulationParameters {
  diameterM: number;
  velocityKmS: number;
  densityKgM3: number;
  illustrativeMissDistanceKm: number;
}

export interface SimulationResult {
  radiusM: number;
  volumeM3: number;
  massKg: number;
  velocityMs: number;
  kineticEnergyJ: number;
  kineticEnergyKilotons: number;
  kineticEnergyMegatons: number;
}

export interface EducationalScenario {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  historicalReference?: string;
  defaultParameters: SimulationParameters;
  assumptions: string[];
  educationalSignificance: string;
}

export interface SensitivityComparison {
  parameter: string;
  baselineValue: string;
  doubledValue: string;
  energyMultiplier: number;
  mathematicalPrinciple: string;
}

export interface ExplainableInsight {
  title: string;
  category: 'size' | 'velocity' | 'density' | 'energy' | 'limitations' | 'geometry';
  summary: string;
  mathematicalFormula?: string;
  detailedExplanation: string;
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

// ==========================================
// PHASE 6: SPACE INTELLIGENCE & SMART DISCOVERY
// ==========================================

export type EntityType =
  | 'planet'
  | 'mission'
  | 'milestone'
  | 'rover'
  | 'rover-image'
  | 'asteroid'
  | 'briefing'
  | 'timeline';

export interface SearchResult {
  id: string;
  entityId: string;
  entityType: EntityType;
  title: string;
  subtitle?: string;
  description: string;
  matchedFields: string[];
  route: string;
  relevanceScore: number;
}

export type QueryIntentType =
  | 'planet_info'
  | 'planet_comparison'
  | 'planet_extreme'
  | 'mission_info'
  | 'mission_destination'
  | 'mission_epoch'
  | 'rover_info'
  | 'rover_list'
  | 'rover_images'
  | 'asteroid_filter'
  | 'asteroid_closest'
  | 'asteroid_explain_distance'
  | 'general_overview'
  | 'entity_suggestion'
  | 'unknown';

export interface QueryIntent {
  type: QueryIntentType;
  confidenceOrMatchStrength: number; // 0..1 match strength
  confidence?: number;
  extractedEntities: {
    planetId?: string;
    secondPlanetId?: string;
    missionId?: string;
    roverId?: string;
    asteroidId?: string;
    year?: number;
    decade?: string;
    destination?: string;
    filterParam?: string;
    extremeCriterion?: 'largest' | 'smallest' | 'closest' | 'farthest' | 'hottest' | 'coldest' | 'most_moons' | 'shortest_orbit';
    matches?: Array<{
      entityType: EntityType;
      entityId: string;
      matchedText: string;
    }>;
    [key: string]: any;
  };
  extractedFilters: Record<string, any>;
  parameters?: Record<string, any>;
  matchedKeywords?: string[];
  rawQuery: string;
}

export interface SourceReference {
  id: string;
  title: string;
  entityType: EntityType;
  route: string;
  label: string;
  provenance: 'Curated Reference Record' | 'Deterministic Simulation';
}

export interface QueryResponse {
  id: string;
  question: string;
  answer: string;
  intent: QueryIntent;
  sourceRecordIds: string[];
  sourceReferences: SourceReference[];
  relatedEntityIds: string[];
  suggestedQuestions: string[];
  supported: boolean;
  evidenceExplanation?: string;
  timestamp: string;
}

export type BriefingCategory =
  | 'mission_highlights'
  | 'planetary_discoveries'
  | 'mars_exploration'
  | 'asteroid_watch'
  | 'historical_exploration';

export interface GeneratedBriefing {
  id: string;
  title: string;
  category: BriefingCategory;
  categoryLabel: string;
  referenceDate: string;
  selectedYear?: number;
  periodLabel: string;
  summary: string;
  highlights: string[];
  sourceRecordIds: string[];
  sourceReferences: SourceReference[];
  relatedEntityIds: string[];
  suggestedNextExploration: {
    label: string;
    route: string;
    description: string;
  };
  generationMethod: string;
  evidenceExplanation: string;
}

export interface DiscoveryNode {
  id: string;
  entityId: string;
  entityType: 'planet' | 'mission' | 'rover' | 'milestone' | 'asteroid';
  label: string;
  subtitle: string;
  route: string;
  group: string;
  badge: string;
  connectionCount?: number;
  // Positioning attributes for SVG rendering
  x?: number;
  y?: number;
}

export interface DiscoveryEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType:
    | 'targets_destination'
    | 'associated_rover'
    | 'historical_milestone'
    | 'explored_surface_of'
    | 'orbital_flyby'
    | 'same_destination';
  label: string;
  description: string;
}

export interface DiscoveryGraphData {
  nodes: DiscoveryNode[];
  edges: DiscoveryEdge[];
}

export interface Recommendation {
  id: string;
  entityId: string;
  entityType: EntityType;
  title: string;
  subtitle: string;
  description: string;
  route: string;
  relevanceScore: number;
  explanation: string;
  sourceEntityIds: string[];
  badgeText: string;
  category: 'direct_relation' | 'temporal_context' | 'scientific_parallel' | 'exploratory_curiosity';
}

export interface InsightEvidence {
  feature: 'briefing' | 'query' | 'recommendation';
  title: string;
  inputCriteria: string;
  rulesApplied: string[];
  recordsConsultedCount: number;
  sourceReferences: SourceReference[];
  algorithmicExplanation: string;
}
