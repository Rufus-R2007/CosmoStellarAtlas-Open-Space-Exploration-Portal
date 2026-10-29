import {
  planetsData,
  missionsData,
  roversData,
  roverImagesData,
  asteroidsData,
  briefingsData,
} from '../../../data';
import { SearchResult, EntityType } from '../../../types';

export interface SearchFilterOption {
  entityType?: EntityType | 'all';
  limit?: number;
}

/**
 * Builds and queries an in-memory inverted search index across all local entities.
 * Supports exact matching, tokenized substring matching, field relevance weighting,
 * and working internal route generation.
 */
class SearchIndexService {
  private indexedResults: SearchResult[] | null = null;

  /**
   * Initializes or returns the cached full entity search catalog.
   */
  public getFullCatalog(): SearchResult[] {
    if (this.indexedResults) {
      return this.indexedResults;
    }

    const results: SearchResult[] = [];

    // 1. Index Planets
    planetsData.forEach((planet) => {
      results.push({
        id: `planet-${planet.id}`,
        entityId: planet.id,
        entityType: 'planet',
        title: planet.name,
        subtitle: `${planet.type} • ${planet.orderFromSun}${
          planet.orderFromSun === 1
            ? 'st'
            : planet.orderFromSun === 2
            ? 'nd'
            : planet.orderFromSun === 3
            ? 'rd'
            : 'th'
        } World from Sun`,
        description: planet.summary || planet.detailedDescription,
        matchedFields: ['name', 'type', 'summary', 'atmosphere'],
        route: `/planets?id=${planet.id}`,
        relevanceScore: 0,
      });
    });

    // 2. Index Missions
    missionsData.forEach((mission) => {
      results.push({
        id: `mission-${mission.id}`,
        entityId: mission.id,
        entityType: 'mission',
        title: mission.name,
        subtitle: `${mission.agency} • ${mission.destinationName} (${mission.launchYear})`,
        description: mission.description || mission.objectives?.[0],
        matchedFields: ['name', 'agency', 'destination', 'description'],
        route: `/missions/${mission.id}`,
        relevanceScore: 0,
      });

      // Index key mission milestones as individual searchable items
      mission.milestones?.forEach((milestone, idx) => {
        results.push({
          id: `milestone-${mission.id}-${idx}`,
          entityId: mission.id,
          entityType: 'milestone',
          title: milestone.title,
          subtitle: `${mission.name} Milestone • ${milestone.date}`,
          description: milestone.description,
          matchedFields: ['title', 'description', 'missionName'],
          route: `/missions/${mission.id}`,
          relevanceScore: 0,
        });
      });
    });

    // 3. Index Mars Rovers
    roversData.forEach((rover) => {
      results.push({
        id: `rover-${rover.id}`,
        entityId: rover.id,
        entityType: 'rover',
        title: rover.name,
        subtitle: `${rover.landingSite.split('(')[0].trim()} • ${rover.status.toUpperCase()} (${rover.totalSols} Sols)`,
        description: rover.description || rover.primaryMission,
        matchedFields: ['name', 'landingSite', 'description'],
        route: `/rovers?id=${rover.id}`,
        relevanceScore: 0,
      });
    });

    // 4. Index Curated Rover Images
    roverImagesData.slice(0, 24).forEach((img) => {
      results.push({
        id: `rover-image-${img.id}`,
        entityId: img.id,
        entityType: 'rover-image',
        title: img.title || `${img.cameraFullName} Sol ${img.sol}`,
        subtitle: `Sol ${img.sol} • ${img.cameraAbbreviation || img.cameraName} capture`,
        description: img.caption || img.description || 'Martian surface observation.',
        matchedFields: ['title', 'caption', 'cameraName', 'tags'],
        route: `/rovers?id=${img.roverId || 'perseverance'}&sol=${img.sol}&image=${img.id}`,
        relevanceScore: 0,
      });
    });

    // 5. Index Asteroids (Curated & Benchmark Encounters)
    asteroidsData.forEach((asteroid) => {
      results.push({
        id: `asteroid-${asteroid.id}`,
        entityId: asteroid.id,
        entityType: 'asteroid',
        title: asteroid.name,
        subtitle: `${asteroid.orbitClass} Class • Miss Distance: ${asteroid.missDistanceLunar.toFixed(2)} LD`,
        description:
          asteroid.scenarioDescription ||
          asteroid.description ||
          `Estimated diameter ${asteroid.estimatedDiameterMeters}m with velocity ${asteroid.relativeVelocityKmS} km/s.`,
        matchedFields: ['name', 'designation', 'orbitClass', 'composition'],
        route: `/asteroids?id=${asteroid.id}`,
        relevanceScore: 0,
      });
    });

    // 6. Index Briefings
    briefingsData.forEach((briefing) => {
      results.push({
        id: `briefing-${briefing.id}`,
        entityId: briefing.id,
        entityType: 'briefing',
        title: briefing.title,
        subtitle: `Sector ${briefing.sectorCode} • ${briefing.category}`,
        description: briefing.summary,
        matchedFields: ['title', 'summary', 'sectorCode'],
        route: `/intelligence?briefing=${briefing.id}`,
        relevanceScore: 0,
      });
    });

    this.indexedResults = results;
    return this.indexedResults;
  }

  /**
   * Universal Search Algorithm:
   * Tokenizes search input, scores matches based on field weighting:
   * - Title exact match: +50 pts
   * - Title starts with: +30 pts
   * - Title contains word: +20 pts
   * - Subtitle contains word: +10 pts
   * - Description contains word: +5 pts
   * - Matched field contains word: +3 pts
   */
  public search(query: string, options?: SearchFilterOption): SearchResult[] {
    const rawQuery = (query || '').trim().toLowerCase();
    if (!rawQuery) {
      return [];
    }

    const catalog = this.getFullCatalog();
    const queryTokens = rawQuery.split(/\s+/).filter((t) => t.length > 0);
    const filterType = options?.entityType || 'all';
    const limit = options?.limit || 20;

    const scoredResults: SearchResult[] = [];

    for (const item of catalog) {
      // Entity type filtering
      if (filterType !== 'all' && item.entityType !== filterType) {
        continue;
      }

      let score = 0;
      const matchedFieldNames: string[] = [];

      const titleLower = item.title.toLowerCase();
      const subtitleLower = (item.subtitle || '').toLowerCase();
      const descLower = item.description.toLowerCase();

      // Exact title match
      if (titleLower === rawQuery) {
        score += 50;
        matchedFieldNames.push('exact_title');
      } else if (titleLower.startsWith(rawQuery)) {
        score += 30;
        matchedFieldNames.push('title_prefix');
      }

      // Token-level scoring
      let allTokensMatch = true;
      for (const token of queryTokens) {
        let tokenMatched = false;

        if (titleLower.includes(token)) {
          score += 20;
          tokenMatched = true;
          if (!matchedFieldNames.includes('title')) matchedFieldNames.push('title');
        }

        if (subtitleLower.includes(token)) {
          score += 10;
          tokenMatched = true;
          if (!matchedFieldNames.includes('subtitle')) matchedFieldNames.push('subtitle');
        }

        if (descLower.includes(token)) {
          score += 5;
          tokenMatched = true;
          if (!matchedFieldNames.includes('description')) matchedFieldNames.push('description');
        }

        if (!tokenMatched) {
          allTokensMatch = false;
        }
      }

      // Bonus for matching all tokens
      if (allTokensMatch && queryTokens.length > 1) {
        score += 15;
      }

      if (score > 0) {
        scoredResults.push({
          ...item,
          relevanceScore: score,
          matchedFields: matchedFieldNames,
        });
      }
    }

    // Sort by relevance score descending
    scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return scoredResults.slice(0, limit);
  }

  /**
   * Alias for search().
   */
  public query(query: string, options?: SearchFilterOption): SearchResult[] {
    return this.search(query, options);
  }
}

export const searchIndexService = new SearchIndexService();
