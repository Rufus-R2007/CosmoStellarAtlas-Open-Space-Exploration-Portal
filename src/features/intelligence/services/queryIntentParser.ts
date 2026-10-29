import { EntityType, QueryIntent } from '../../../types';
import { planetsData, missionsData, roversData, asteroidsData } from '../../../data';

export interface ExtractedEntityMatch {
  entityType: EntityType;
  entityId: string;
  matchedText: string;
}

/**
 * Normalizes user queries for consistent deterministic pattern matching.
 */
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Deterministic rule-based parser that maps natural language queries to structured QueryIntents.
 * Zero LLM/API dependencies; executes in < 5ms locally.
 */
export class QueryIntentParser {
  /**
   * Scans normalized query for all known domain entities (Planets, Missions, Rovers, Asteroids).
   */
  public extractEntities(normalizedQuery: string): ExtractedEntityMatch[] {
    const matches: ExtractedEntityMatch[] = [];
    const seenIds = new Set<string>();

    // 1. Planets
    for (const planet of planetsData) {
      const name = planet.name.toLowerCase();
      const regex = new RegExp(`\\b${name}\\b`, 'i');
      if (regex.test(normalizedQuery)) {
        if (!seenIds.has(planet.id)) {
          seenIds.add(planet.id);
          matches.push({
            entityType: 'planet',
            entityId: planet.id,
            matchedText: planet.name,
          });
        }
      }
    }

    // Special check for 'moon'
    if (/\b(moon|lunar)\b/i.test(normalizedQuery) && !seenIds.has('moon')) {
      seenIds.add('moon');
      matches.push({
        entityType: 'planet',
        entityId: 'moon',
        matchedText: 'Moon',
      });
    }

    // 2. Rovers
    for (const rover of roversData) {
      const name = rover.name.toLowerCase();
      const regex = new RegExp(`\\b${name}\\b`, 'i');
      if (regex.test(normalizedQuery)) {
        if (!seenIds.has(rover.id)) {
          seenIds.add(rover.id);
          matches.push({
            entityType: 'rover',
            entityId: rover.id,
            matchedText: rover.name,
          });
        }
      }
    }

    // 3. Asteroids
    for (const asteroid of asteroidsData) {
      const name = asteroid.name.toLowerCase();
      const shortName = name.replace(/^\d+\s*/, '').toLowerCase();
      const regex = new RegExp(`\\b(${name}|${shortName}|${asteroid.designation.toLowerCase()})\\b`, 'i');
      if (regex.test(normalizedQuery)) {
        if (!seenIds.has(asteroid.id)) {
          seenIds.add(asteroid.id);
          matches.push({
            entityType: 'asteroid',
            entityId: asteroid.id,
            matchedText: asteroid.name,
          });
        }
      }
    }

    // 4. Missions
    for (const mission of missionsData) {
      const name = mission.name.toLowerCase();
      const isJWST = mission.id === 'jwst' && /\b(jwst|webb)\b/i.test(normalizedQuery);
      const regex = new RegExp(`\\b${name}\\b`, 'i');
      if (regex.test(normalizedQuery) || isJWST) {
        if (!seenIds.has(mission.id)) {
          seenIds.add(mission.id);
          matches.push({
            entityType: 'mission',
            entityId: mission.id,
            matchedText: mission.name,
          });
        }
      }
    }

    return matches;
  }

  /**
   * Parses raw query string into a structured QueryIntent.
   */
  public parse(rawQuery: string): QueryIntent {
    const normalized = normalizeQuery(rawQuery);
    const entities = this.extractEntities(normalized);
    const matchedKeywords: string[] = [];
    const params: Record<string, any> = {};

    if (!normalized) {
      return {
        type: 'unknown',
        confidenceOrMatchStrength: 0,
        confidence: 0,
        rawQuery,
        extractedEntities: { matches: [] },
        extractedFilters: {},
        parameters: {},
        matchedKeywords: [],
      };
    }

    // 1. General Overview Intent
    if (
      /(what is cosmostellaratlas|what is atlas|what is this platform|how to use this|about cosmostellaratlas|overview of the platform|what does this app do|help me explore|welcome to atlas)/i.test(
        normalized
      )
    ) {
      matchedKeywords.push('general_overview');
      return {
        type: 'general_overview',
        confidenceOrMatchStrength: 0.98,
        confidence: 0.98,
        rawQuery,
        extractedEntities: { matches: entities },
        extractedFilters: {},
        parameters: {},
        matchedKeywords,
      };
    }

    // 2. Asteroid Explain Distance (Lunar Distance / AU)
    if (
      /(what is lunar distance|explain ld|how far is 1 ld|what is 1 ld|what does ld mean|what is an au|explain au|astronomical unit|explain distance)/i.test(
        normalized
      )
    ) {
      matchedKeywords.push('lunar_distance_unit');
      params.unit = normalized.includes('au') ? 'AU' : 'LD';
      return {
        type: 'asteroid_explain_distance',
        confidenceOrMatchStrength: 0.96,
        confidence: 0.96,
        rawQuery,
        extractedEntities: { matches: entities },
        extractedFilters: params,
        parameters: params,
        matchedKeywords,
      };
    }

    // 3. Asteroid Closest Approach
    if (
      /(closest asteroid|nearest asteroid|closest approach|which asteroid comes nearest|asteroid with closest approach|nearest neo)/i.test(
        normalized
      )
    ) {
      matchedKeywords.push('closest_approach');
      return {
        type: 'asteroid_closest',
        confidenceOrMatchStrength: 0.95,
        confidence: 0.95,
        rawQuery,
        extractedEntities: { matches: entities },
        extractedFilters: {},
        parameters: {},
        matchedKeywords,
      };
    }

    // 4. Asteroid Filter / Potentially Hazardous
    if (
      /(potentially hazardous|hazardous asteroid|pha list|show dangerous asteroids|dangerous asteroid|asteroid threat|impact risk|hazard assessment)/i.test(
        normalized
      )
    ) {
      matchedKeywords.push('potentially_hazardous');
      params.filter = 'pha';
      return {
        type: 'asteroid_filter',
        confidenceOrMatchStrength: 0.94,
        confidence: 0.94,
        rawQuery,
        extractedEntities: {
          filterParam: 'pha',
          matches: entities,
        },
        extractedFilters: params,
        parameters: params,
        matchedKeywords,
      };
    }

    // 5. Rover Photos / Images
    if (
      /(photo|photos|image|images|picture|pictures|camera|mastcam|navcam|hazcam|gallery)/i.test(
        normalized
      ) &&
      (entities.some((e) => e.entityType === 'rover') || /rover/i.test(normalized))
    ) {
      const roverEntity = entities.find((e) => e.entityType === 'rover');
      const roverId = roverEntity ? roverEntity.entityId : 'perseverance';
      matchedKeywords.push('rover_images');
      params.roverId = roverId;
      return {
        type: 'rover_images',
        confidenceOrMatchStrength: 0.93,
        confidence: 0.93,
        rawQuery,
        extractedEntities: {
          roverId,
          matches: entities,
        },
        extractedFilters: params,
        parameters: params,
        matchedKeywords,
      };
    }

    // 6. Rover List
    if (
      /(list all rovers|what rovers are on mars|how many rovers|all rovers|mars rovers|active rovers|rover fleet)/i.test(
        normalized
      )
    ) {
      matchedKeywords.push('rover_list');
      return {
        type: 'rover_list',
        confidenceOrMatchStrength: 0.95,
        confidence: 0.95,
        rawQuery,
        extractedEntities: { matches: entities },
        extractedFilters: {},
        parameters: {},
        matchedKeywords,
      };
    }

    // 7. Planet Comparison
    const planetEntities = entities.filter((e) => e.entityType === 'planet');
    const isComparisonQuery =
      /(compare|vs|versus|difference between|larger than|smaller than|how does .* compare)/i.test(
        normalized
      );
    if (planetEntities.length >= 2 || (planetEntities.length >= 1 && isComparisonQuery)) {
      matchedKeywords.push('planet_comparison');
      const p1 = planetEntities[0]?.entityId || 'earth';
      const p2 = planetEntities[1]?.entityId || 'mars';
      params.planet1 = p1;
      params.planet2 = p2;
      return {
        type: 'planet_comparison',
        confidenceOrMatchStrength: 0.94,
        confidence: 0.94,
        rawQuery,
        extractedEntities: {
          planetId: p1,
          secondPlanetId: p2,
          matches: planetEntities,
        },
        extractedFilters: params,
        parameters: params,
        matchedKeywords,
      };
    }

    // 8. Planet Extremes (Superlatives)
    const extremePatterns: [RegExp, 'largest' | 'smallest' | 'closest' | 'farthest' | 'hottest' | 'coldest' | 'most_moons' | 'shortest_orbit', string][] = [
      [/(hottest planet|highest temperature|most scorching)/i, 'hottest', 'hottest'],
      [/(coldest planet|lowest temperature|freezing planet)/i, 'coldest', 'coldest'],
      [/(largest planet|biggest planet|highest diameter|greatest volume)/i, 'largest', 'largest'],
      [/(smallest planet|tiniest planet|lowest diameter)/i, 'smallest', 'smallest'],
      [/(most moons|planet with most moons|greatest number of moons)/i, 'most_moons', 'most_moons'],
      [/(closest to the sun|closest planet to sun|first planet from sun)/i, 'closest', 'closest_sun'],
      [/(farthest from the sun|most distant planet|furthest planet from sun)/i, 'farthest', 'farthest_sun'],
      [/(fastest orbit|shortest orbit|shortest year)/i, 'shortest_orbit', 'shortest_orbit'],
      [/(densest planet|highest density)/i, 'largest', 'densest'],
      [/(highest gravity|strongest gravity)/i, 'largest', 'highest_gravity'],
      [/(lowest gravity|weakest gravity)/i, 'smallest', 'lowest_gravity'],
    ];

    for (const [pattern, criterion, metric] of extremePatterns) {
      if (pattern.test(normalized)) {
        matchedKeywords.push(metric);
        params.metric = metric;
        return {
          type: 'planet_extreme',
          confidenceOrMatchStrength: 0.95,
          confidence: 0.95,
          rawQuery,
          extractedEntities: {
            extremeCriterion: criterion,
            matches: entities,
          },
          extractedFilters: params,
          parameters: params,
          matchedKeywords,
        };
      }
    }

    // 9. Mission Epoch (Specific Launch Year)
    const yearMatch = normalized.match(/\b(19\d\d|20\d\d)\b/);
    if (yearMatch && /(mission|missions|launch|launched|spacecraft|satellite|probe)/i.test(normalized)) {
      const year = parseInt(yearMatch[1], 10);
      matchedKeywords.push('mission_epoch', year.toString());
      params.year = year;
      return {
        type: 'mission_epoch',
        confidenceOrMatchStrength: 0.92,
        confidence: 0.92,
        rawQuery,
        extractedEntities: {
          year,
          matches: entities,
        },
        extractedFilters: params,
        parameters: params,
        matchedKeywords,
      };
    }

    // 10. Mission Destination
    if (
      (planetEntities.length >= 1 || /\b(mars|jupiter|saturn|venus|moon|lunar|mercury)\b/i.test(normalized)) &&
      /(mission|missions|spacecraft|probes|flown to|visited|journey to|explored)/i.test(normalized) &&
      !entities.some((e) => e.entityType === 'mission')
    ) {
      const targetPlanet = planetEntities[0]?.entityId || (normalized.includes('moon') || normalized.includes('lunar') ? 'moon' : 'mars');
      matchedKeywords.push('mission_destination', targetPlanet);
      params.destinationPlanetId = targetPlanet;
      return {
        type: 'mission_destination',
        confidenceOrMatchStrength: 0.91,
        confidence: 0.91,
        rawQuery,
        extractedEntities: {
          destination: targetPlanet,
          matches: entities,
        },
        extractedFilters: params,
        parameters: params,
        matchedKeywords,
      };
    }

    // 11. Specific Rover Info
    const roverEntity = entities.find((e) => e.entityType === 'rover');
    if (roverEntity) {
      matchedKeywords.push('rover_info', roverEntity.entityId);
      params.roverId = roverEntity.entityId;
      return {
        type: 'rover_info',
        confidenceOrMatchStrength: 0.92,
        confidence: 0.92,
        rawQuery,
        extractedEntities: {
          roverId: roverEntity.entityId,
          matches: [roverEntity],
        },
        extractedFilters: params,
        parameters: params,
        matchedKeywords,
      };
    }

    // 12. Specific Mission Info
    const missionEntity = entities.find((e) => e.entityType === 'mission');
    if (missionEntity) {
      matchedKeywords.push('mission_info', missionEntity.entityId);
      params.missionId = missionEntity.entityId;
      return {
        type: 'mission_info',
        confidenceOrMatchStrength: 0.92,
        confidence: 0.92,
        rawQuery,
        extractedEntities: {
          missionId: missionEntity.entityId,
          matches: [missionEntity],
        },
        extractedFilters: params,
        parameters: params,
        matchedKeywords,
      };
    }

    // 13. Specific Planet Info
    if (planetEntities.length === 1) {
      matchedKeywords.push('planet_info', planetEntities[0].entityId);
      params.planetId = planetEntities[0].entityId;
      return {
        type: 'planet_info',
        confidenceOrMatchStrength: 0.90,
        confidence: 0.90,
        rawQuery,
        extractedEntities: {
          planetId: planetEntities[0].entityId,
          matches: planetEntities,
        },
        extractedFilters: params,
        parameters: params,
        matchedKeywords,
      };
    }

    // 14. Specific Asteroid Info
    const asteroidEntity = entities.find((e) => e.entityType === 'asteroid');
    if (asteroidEntity) {
      matchedKeywords.push('asteroid_info', asteroidEntity.entityId);
      params.asteroidId = asteroidEntity.entityId;
      return {
        type: 'asteroid_filter',
        confidenceOrMatchStrength: 0.88,
        confidence: 0.88,
        rawQuery,
        extractedEntities: {
          asteroidId: asteroidEntity.entityId,
          matches: [asteroidEntity],
        },
        extractedFilters: params,
        parameters: params,
        matchedKeywords,
      };
    }

    // 15. Entity Suggestion fallback (Entity recognized but question vague)
    if (entities.length > 0) {
      matchedKeywords.push('entity_suggestion');
      params.primaryEntityId = entities[0].entityId;
      return {
        type: 'entity_suggestion',
        confidenceOrMatchStrength: 0.75,
        confidence: 0.75,
        rawQuery,
        extractedEntities: {
          matches: entities,
          primaryEntityId: entities[0].entityId,
        },
        extractedFilters: params,
        parameters: params,
        matchedKeywords,
      };
    }

    // 16. Unknown fallback
    return {
      type: 'unknown',
      confidenceOrMatchStrength: 0.2,
      confidence: 0.2,
      rawQuery,
      extractedEntities: { matches: [] },
      extractedFilters: {},
      parameters: {},
      matchedKeywords: [],
    };
  }
}

export const queryIntentParser = new QueryIntentParser();
