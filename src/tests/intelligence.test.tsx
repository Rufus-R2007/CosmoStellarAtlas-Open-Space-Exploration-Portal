import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  searchIndexService,
  queryIntentParser,
  queryExecutionService,
  briefingGeneratorService,
  discoveryGraphService,
  recommendationEngineService,
} from '../features/intelligence/services';
import { IntelligencePage } from '../features/intelligence/IntelligencePage';
import { useAppStore } from '../store/useAppStore';

describe('Phase 6 — Space Intelligence & Smart Discovery Test Suite', () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedYear: 1969,
      selectedMissionId: undefined,
      selectedRoverId: undefined,
      selectedAsteroidId: undefined,
      selectedPlanetId: undefined,
    });
  });

  // ------------------------------------------------------------------------
  // 1. Universal Search Index Tests
  // ------------------------------------------------------------------------
  it('Requirement 1: searchIndexService indexes planets, missions, rovers, asteroids, and briefings', () => {
    const catalog = searchIndexService.getFullCatalog();
    expect(catalog.length).toBeGreaterThan(30);

    const types = new Set(catalog.map((item) => item.entityType));
    expect(types.has('planet')).toBe(true);
    expect(types.has('mission')).toBe(true);
    expect(types.has('rover')).toBe(true);
    expect(types.has('asteroid')).toBe(true);
    expect(types.has('briefing')).toBe(true);
  });

  it('Requirement 2: exact title match receives highest relevance score', () => {
    const results = searchIndexService.search('Mars');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title.toLowerCase()).toBe('mars');
    expect(results[0].relevanceScore).toBeGreaterThanOrEqual(50);
    expect(results[0].matchedFields).toContain('exact_title');
  });

  it('Requirement 3: tokenized multi-word search correctly identifies relevant entities', () => {
    const results = searchIndexService.search('Apollo 11');
    expect(results.length).toBeGreaterThan(0);
    const apollo = results.find((r) => r.title.includes('Apollo 11'));
    expect(apollo).toBeDefined();
    expect(apollo?.route).toBe('/missions/apollo-11');
  });

  it('Requirement 4: entityType filter correctly restricts search results', () => {
    const planetOnly = searchIndexService.search('Jezero', { entityType: 'planet' });
    expect(planetOnly.every((r) => r.entityType === 'planet')).toBe(true);

    const roversOnly = searchIndexService.search('Perseverance', { entityType: 'rover' });
    expect(roversOnly.length).toBeGreaterThan(0);
    expect(roversOnly.every((r) => r.entityType === 'rover')).toBe(true);
  });

  it('Requirement 5: empty or whitespace search queries return empty results safely', () => {
    expect(searchIndexService.search('')).toEqual([]);
    expect(searchIndexService.search('   ')).toEqual([]);
    expect(searchIndexService.query('')).toEqual([]);
  });

  // ------------------------------------------------------------------------
  // 2. Query Intent Parser Tests
  // ------------------------------------------------------------------------
  it('Requirement 6: queryIntentParser parses planet_info for recognized planets', () => {
    const intent = queryIntentParser.parse('What is Mars?');
    expect(intent.type).toBe('planet_info');
    expect(intent.confidenceOrMatchStrength).toBeGreaterThanOrEqual(0.85);
    expect(intent.parameters?.planetId || intent.extractedEntities.planetId).toBe('mars');
  });

  it('Requirement 7: queryIntentParser parses planet_comparison for two worlds', () => {
    const intent = queryIntentParser.parse('Compare Earth and Jupiter');
    expect(intent.type).toBe('planet_comparison');
    expect(intent.confidenceOrMatchStrength).toBeGreaterThanOrEqual(0.9);
    expect(intent.extractedEntities.planetId).toBe('earth');
    expect(intent.extractedEntities.secondPlanetId).toBe('jupiter');
  });

  it('Requirement 8: queryIntentParser parses planet_extreme for superlatives', () => {
    const moonsIntent = queryIntentParser.parse('Which planet has the most moons?');
    expect(moonsIntent.type).toBe('planet_extreme');
    expect(moonsIntent.parameters?.metric).toBe('most_moons');

    const hotIntent = queryIntentParser.parse('What is the hottest planet?');
    expect(hotIntent.type).toBe('planet_extreme');
    expect(hotIntent.parameters?.metric).toBe('hottest');
  });

  it('Requirement 9: queryIntentParser parses mission_info and mission_epoch', () => {
    const missionIntent = queryIntentParser.parse('Tell me about Apollo 11');
    expect(missionIntent.type).toBe('mission_info');
    expect(missionIntent.extractedEntities.missionId).toBe('apollo-11');

    const epochIntent = queryIntentParser.parse('Missions launched in 1977');
    expect(epochIntent.type).toBe('mission_epoch');
    expect(epochIntent.parameters?.year || epochIntent.extractedEntities.year).toBe(1977);
  });

  it('Requirement 10: queryIntentParser parses rover_info and rover_list', () => {
    const listIntent = queryIntentParser.parse('What rovers are on Mars?');
    expect(listIntent.type).toBe('rover_list');

    const roverIntent = queryIntentParser.parse('Tell me about Perseverance rover');
    expect(roverIntent.type).toBe('rover_info');
    expect(roverIntent.parameters?.roverId || roverIntent.extractedEntities.roverId).toBe('perseverance');
  });

  it('Requirement 11: queryIntentParser parses asteroid_closest and explain distance', () => {
    const closestIntent = queryIntentParser.parse('Closest asteroid to Earth');
    expect(closestIntent.type).toBe('asteroid_closest');

    const distIntent = queryIntentParser.parse('What is Lunar Distance?');
    expect(distIntent.type).toBe('asteroid_explain_distance');
  });

  it('Requirement 12: queryIntentParser returns fallback unknown intent for unrecognized queries', () => {
    const unknownIntent = queryIntentParser.parse('xyz123 random text query');
    expect(unknownIntent.type).toBe('unknown');
    expect(unknownIntent.confidenceOrMatchStrength).toBeLessThan(0.5);
  });

  // ------------------------------------------------------------------------
  // 3. Query Execution Service Tests
  // ------------------------------------------------------------------------
  it('Requirement 13: queryExecutionService executes planet_info with factual content and working routes', () => {
    const response = queryExecutionService.executeQuery('What is Mars?');
    expect(response.supported).toBe(true);
    expect(response.answer).toContain('Mars');
    expect(response.answer).toContain('Equatorial Diameter');
    expect(response.sourceReferences.length).toBeGreaterThan(0);
    expect(response.sourceReferences[0].route).toBe('/planets?id=mars');
    expect(response.suggestedQuestions.length).toBeGreaterThan(0);
  });

  it('Requirement 14: queryExecutionService executes planet_comparison with markdown table and ratios', () => {
    const response = queryExecutionService.executeQuery('Compare Earth and Mars');
    expect(response.supported).toBe(true);
    expect(response.answer).toContain('| Metric | Earth | Mars |');
    expect(response.answer).toContain('Surface Gravity');
    expect(response.sourceReferences.length).toBe(2);
  });

  it('Requirement 15: queryExecutionService executes planet_extreme identifying correct record holder', () => {
    const response = queryExecutionService.executeQuery('What is the hottest planet?');
    expect(response.supported).toBe(true);
    expect(response.answer).toContain('Venus');
    expect(response.answer).toContain('464°C');
  });

  // ------------------------------------------------------------------------
  // 4. Cosmic Briefing Generator Service Tests
  // ------------------------------------------------------------------------
  it('Requirement 16: briefingGeneratorService generates all 5 categories cleanly', () => {
    const allBriefings = briefingGeneratorService.generateAllBriefings(1969);
    expect(allBriefings.length).toBe(5);

    const categories = allBriefings.map((b) => b.category);
    expect(categories).toContain('mission_highlights');
    expect(categories).toContain('planetary_discoveries');
    expect(categories).toContain('mars_exploration');
    expect(categories).toContain('asteroid_watch');
    expect(categories).toContain('historical_exploration');
  });

  it('Requirement 17: briefingGeneratorService creates year-specific dossier for landmark years', () => {
    const briefing1969 = briefingGeneratorService.generateBriefing('historical_exploration', 1969);
    expect(briefing1969.selectedYear).toBe(1969);
    expect(briefing1969.summary).toContain('Apollo 11');
    expect(briefing1969.evidenceExplanation).toContain('match_temporal_launch_year');

    const briefing1977 = briefingGeneratorService.generateBriefing('historical_exploration', 1977);
    expect(briefing1977.summary).toContain('Voyager');
  });

  it('Requirement 18: briefingGeneratorService provides era-based fallback for empty historical years', () => {
    const briefing1960 = briefingGeneratorService.generateBriefing('historical_exploration', 1960);
    expect(briefing1960.title).toContain('1960');
    expect(briefing1960.periodLabel).toContain('1960');
    expect(briefing1960.evidenceExplanation).toContain('nearest_temporal_epoch_interpolation');
  });

  // ------------------------------------------------------------------------
  // 5. Relational Discovery Graph Tests
  // ------------------------------------------------------------------------
  it('Requirement 19: discoveryGraphService generates complete graph with deterministic coordinates', () => {
    const graph = discoveryGraphService.getCompleteGraph();
    expect(graph.nodes.length).toBeGreaterThanOrEqual(15);
    expect(graph.edges.length).toBeGreaterThanOrEqual(10);

    // Verify all nodes have valid 2D coordinates
    graph.nodes.forEach((n) => {
      expect(n.x).toBeDefined();
      expect(n.y).toBeDefined();
      expect(n.connectionCount).toBeGreaterThanOrEqual(1);
    });
  });

  it('Requirement 20: discoveryGraphService filters neighborhood subgraphs by 1-hop distance', () => {
    const neighborhood = discoveryGraphService.getNeighborhoodGraph('node-planet-mars', 1);
    expect(neighborhood.nodes.length).toBeLessThan(discoveryGraphService.getCompleteGraph().nodes.length);
    expect(neighborhood.nodes.some((n) => n.id === 'node-planet-mars')).toBe(true);

    // All edges in neighborhood must connect to nodes within the subgraph
    const nodeIds = new Set(neighborhood.nodes.map((n) => n.id));
    neighborhood.edges.forEach((e) => {
      expect(nodeIds.has(e.sourceNodeId)).toBe(true);
      expect(nodeIds.has(e.targetNodeId)).toBe(true);
    });
  });

  // ------------------------------------------------------------------------
  // 6. Explainable Recommendation Engine Tests
  // ------------------------------------------------------------------------
  it('Requirement 21: recommendationEngineService derives contextual recommendations with rationales', () => {
    // When Mars/Rover context is active
    const marsRecs = recommendationEngineService.generateRecommendations({
      selectedPlanetId: 'mars',
      selectedRoverId: 'curiosity',
    });

    expect(marsRecs.length).toBeGreaterThanOrEqual(4);
    expect(marsRecs[0].explanation).toBeDefined();
    expect(marsRecs[0].relevanceScore).toBeGreaterThanOrEqual(0.7);

    // Verify at least one recommendation is Mars-related
    const hasMarsLink = marsRecs.some(
      (r) => r.entityId === 'mars' || r.entityId === 'perseverance' || r.route.includes('/rovers')
    );
    expect(hasMarsLink).toBe(true);
  });

  it('Requirement 22: recommendationEngineService deduplicates results and sorts by relevance', () => {
    const recs = recommendationEngineService.generateRecommendations({
      selectedYear: 1969,
      selectedPlanetId: 'earth',
    });

    const ids = recs.map((r) => r.entityId);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);

    for (let i = 0; i < recs.length - 1; i++) {
      expect(recs[i].relevanceScore).toBeGreaterThanOrEqual(recs[i + 1].relevanceScore);
    }
  });

  // ------------------------------------------------------------------------
  // 7. Full UI Page Integration Tests
  // ------------------------------------------------------------------------
  it('Requirement 23: IntelligencePage renders Hero, Briefings, Query Engine, Search, Graph, Recommendations, and Evidence Audit', () => {
    render(
      <MemoryRouter>
        <IntelligencePage />
      </MemoryRouter>
    );

    // Hero Header
    expect(screen.getByText(/Cosmo Intelligence & Explainable Space Discovery/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 6 Active/i)).toBeInTheDocument();

    // Cosmic Briefing Engine
    expect(screen.getByText(/Autonomous Spaceflight & Celestial Intelligence Bulletins/i)).toBeInTheDocument();

    // Ask the Atlas Query Engine
    expect(screen.getByText(/Ask the Atlas Query Engine/i)).toBeInTheDocument();

    // Universal Smart Discovery
    expect(screen.getByText(/Universal Smart Discovery/i)).toBeInTheDocument();

    // Cosmic Discovery Graph
    expect(screen.getByText(/Cosmic Discovery Graph/i)).toBeInTheDocument();

    // Explainable Recommendations
    expect(screen.getByText(/Explainable Contextual Recommendations/i)).toBeInTheDocument();

    // Evidence Audit Panel
    expect(screen.getByText(/Insight Evidence & Deterministic Verification Panel/i)).toBeInTheDocument();
  });
});
