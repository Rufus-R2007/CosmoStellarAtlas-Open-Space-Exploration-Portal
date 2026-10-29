import {
  DiscoveryNode,
  DiscoveryEdge,
  DiscoveryGraphData,
} from '../../../types';
import {
  planetsData,
  missionsData,
  roversData,
  asteroidsData,
} from '../../../data';

/**
 * Service that constructs and queries the relational knowledge graph across
 * Planets, Missions, Rovers, Asteroids, and Milestones.
 * Provides deterministic 2D coordinates for SVG rendering and sub-graph neighborhood filtering.
 */
export class DiscoveryGraphService {
  private cachedGraph: DiscoveryGraphData | null = null;

  /**
   * Generates or retrieves the complete relational discovery graph.
   */
  public getCompleteGraph(): DiscoveryGraphData {
    if (this.cachedGraph) {
      return this.cachedGraph;
    }

    const nodes: DiscoveryNode[] = [];
    const edges: DiscoveryEdge[] = [];
    const addedNodeIds = new Set<string>();

    // 1. Add Major Planets (Central celestial hubs)
    const targetPlanetIds = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    const planetCoordinates: Record<string, { x: number; y: number }> = {
      mercury: { x: 220, y: 160 },
      venus: { x: 340, y: 190 },
      earth: { x: 480, y: 230 },
      mars: { x: 640, y: 200 },
      jupiter: { x: 780, y: 320 },
      saturn: { x: 740, y: 500 },
      uranus: { x: 580, y: 580 },
      neptune: { x: 380, y: 580 },
    };

    targetPlanetIds.forEach((pId) => {
      const planet = planetsData.find((p) => p.id === pId);
      if (planet) {
        const nodeId = `node-planet-${planet.id}`;
        addedNodeIds.add(nodeId);
        nodes.push({
          id: nodeId,
          entityId: planet.id,
          entityType: 'planet',
          label: planet.name,
          subtitle: `${planet.type} Planet`,
          route: `/planets?id=${planet.id}`,
          group: 'celestial_body',
          badge: `${planet.moonsCount} Moons`,
          x: planetCoordinates[pId]?.x || 400,
          y: planetCoordinates[pId]?.y || 300,
        });
      }
    });

    // Add Moon as a special celestial body node
    const moonNodeId = 'node-planet-moon';
    addedNodeIds.add(moonNodeId);
    nodes.push({
      id: moonNodeId,
      entityId: 'moon',
      entityType: 'planet',
      label: 'Moon (Luna)',
      subtitle: 'Earth Satellite',
      route: '/planets?id=earth',
      group: 'celestial_body',
      badge: 'Natural Satellite',
      x: 430,
      y: 150,
    });

    // Add edge between Earth and Moon
    edges.push({
      id: 'edge-earth-moon',
      sourceNodeId: 'node-planet-earth',
      targetNodeId: moonNodeId,
      relationshipType: 'same_destination',
      label: 'Gravitational Orbit',
      description: 'The Moon orbits Earth at an average distance of 384,400 km (1 LD).',
    });

    // Add edges for inner terrestrial planets (Earth-Venus and Venus-Mercury)
    edges.push({
      id: 'edge-earth-venus',
      sourceNodeId: 'node-planet-earth',
      targetNodeId: 'node-planet-venus',
      relationshipType: 'same_destination',
      label: 'Sister World',
      description: 'Venus is Earth’s closest planetary neighbor with comparable diameter.',
    });
    edges.push({
      id: 'edge-venus-mercury',
      sourceNodeId: 'node-planet-venus',
      targetNodeId: 'node-planet-mercury',
      relationshipType: 'same_destination',
      label: 'Inner Orbit Corridor',
      description: 'Gravitational corridor between Venus and innermost Mercury.',
    });

    // 2. Add Signature Missions
    const signatureMissions = [
      { id: 'apollo-11', x: 360, y: 90 },
      { id: 'voyager-1', x: 880, y: 410 },
      { id: 'voyager-2', x: 480, y: 550 },
      { id: 'cassini', x: 850, y: 560 },
      { id: 'perseverance', x: 570, y: 100 },
      { id: 'sputnik-1', x: 480, y: 350 },
      { id: 'artemis-1', x: 310, y: 90 },
      { id: 'curiosity', x: 720, y: 120 },
    ];

    signatureMissions.forEach((sm) => {
      const mission = missionsData.find((m) => m.id === sm.id);
      if (mission) {
        const nodeId = `node-mission-${mission.id}`;
        addedNodeIds.add(nodeId);
        nodes.push({
          id: nodeId,
          entityId: mission.id,
          entityType: 'mission',
          label: mission.name,
          subtitle: `${mission.agency} (${mission.launchYear})`,
          route: `/missions/${mission.id}`,
          group: 'space_mission',
          badge: mission.status,
          x: sm.x,
          y: sm.y,
        });

        // Link mission to destination planet
        const destPlanet = mission.destinationPlanetId?.toLowerCase();
        let targetNodeId = `node-planet-${destPlanet}`;
        if (destPlanet === 'moon' || mission.destinationName.toLowerCase().includes('moon')) {
          targetNodeId = moonNodeId;
        }

        if (addedNodeIds.has(targetNodeId)) {
          edges.push({
            id: `edge-${mission.id}-to-dest`,
            sourceNodeId: nodeId,
            targetNodeId,
            relationshipType: 'targets_destination',
            label: 'Explored Target',
            description: `${mission.name} targeted ${mission.destinationName} for scientific exploration.`,
          });
        }

        // Additional multi-destination links
        if (mission.id === 'voyager-1') {
          edges.push({
            id: 'edge-voyager1-saturn',
            sourceNodeId: nodeId,
            targetNodeId: 'node-planet-saturn',
            relationshipType: 'orbital_flyby',
            label: 'Saturn Flyby',
            description: 'Voyager 1 conducted a close flyby of Saturn and Titan in 1980.',
          });
          edges.push({
            id: 'edge-voyager1-jupiter',
            sourceNodeId: nodeId,
            targetNodeId: 'node-planet-jupiter',
            relationshipType: 'orbital_flyby',
            label: 'Jupiter Flyby',
            description: 'Voyager 1 completed a landmark flyby of Jupiter in 1979.',
          });
        }

        if (mission.id === 'cassini') {
          edges.push({
            id: 'edge-cassini-saturn',
            sourceNodeId: nodeId,
            targetNodeId: 'node-planet-saturn',
            relationshipType: 'orbital_flyby',
            label: 'Saturn Orbiter',
            description: 'Cassini spent 13 years in orbit around Saturn mapping rings and moons.',
          });
        }

        if (mission.id === 'voyager-2') {
          edges.push({
            id: 'edge-voyager2-uranus',
            sourceNodeId: nodeId,
            targetNodeId: 'node-planet-uranus',
            relationshipType: 'orbital_flyby',
            label: 'Uranus Flyby',
            description: 'Voyager 2 completed the historic first reconnaissance of Uranus in 1986.',
          });
          edges.push({
            id: 'edge-voyager2-neptune',
            sourceNodeId: nodeId,
            targetNodeId: 'node-planet-neptune',
            relationshipType: 'orbital_flyby',
            label: 'Neptune Flyby',
            description: 'Voyager 2 explored Neptune and its moon Triton in August 1989.',
          });
        }
      }
    });

    // 3. Add Mars Rovers
    const roverCoords: Record<string, { x: number; y: number }> = {
      perseverance: { x: 670, y: 70 },
      curiosity: { x: 760, y: 90 },
      opportunity: { x: 720, y: 240 },
    };

    ['perseverance', 'curiosity', 'opportunity'].forEach((rId) => {
      const rover = roversData.find((r) => r.id === rId);
      if (rover) {
        const nodeId = `node-rover-${rover.id}`;
        addedNodeIds.add(nodeId);
        nodes.push({
          id: nodeId,
          entityId: rover.id,
          entityType: 'rover',
          label: rover.name,
          subtitle: `${rover.status} Rover (${rover.distanceTraveledKm} km)`,
          route: `/rovers?id=${rover.id}`,
          group: 'surface_rover',
          badge: `${rover.totalSols} Sols`,
          x: roverCoords[rId]?.x || 650,
          y: roverCoords[rId]?.y || 100,
        });

        // Link rover to Mars
        edges.push({
          id: `edge-${rover.id}-to-mars`,
          sourceNodeId: nodeId,
          targetNodeId: 'node-planet-mars',
          relationshipType: 'explored_surface_of',
          label: 'Surface Operations',
          description: `${rover.name} operates on the surface of Mars at ${rover.landingSite.split('(')[0].trim()}.`,
        });

        // Link rover to corresponding mission if node exists
        const missionNodeId = `node-mission-${rover.id}`;
        if (addedNodeIds.has(missionNodeId)) {
          edges.push({
            id: `edge-${rover.id}-to-mission`,
            sourceNodeId: nodeId,
            targetNodeId: missionNodeId,
            relationshipType: 'associated_rover',
            label: 'Flight Project Asset',
            description: `${rover.name} was deployed as the surface payload of the ${rover.name} mission.`,
          });
        }
      }
    });

    // 4. Add Notable Asteroids
    const asteroidCoords: Record<string, { x: number; y: number }> = {
      '99942-apophis': { x: 260, y: 350 },
      '101955-bennu': { x: 200, y: 460 },
      '65803-didymos': { x: 340, y: 440 },
    };

    ['99942-apophis', '101955-bennu', '65803-didymos'].forEach((aId) => {
      const asteroid = asteroidsData.find((a) => a.id === aId);
      if (asteroid) {
        const nodeId = `node-asteroid-${asteroid.id}`;
        addedNodeIds.add(nodeId);
        nodes.push({
          id: nodeId,
          entityId: asteroid.id,
          entityType: 'asteroid',
          label: asteroid.name,
          subtitle: `${asteroid.orbitClass} NEO (${asteroid.estimatedDiameterMeters}m)`,
          route: `/asteroids?id=${asteroid.id}`,
          group: 'near_earth_object',
          badge: `${asteroid.missDistanceLunar.toFixed(2)} LD`,
          x: asteroidCoords[aId]?.x || 250,
          y: asteroidCoords[aId]?.y || 400,
        });

        // Link asteroid to Earth close approach
        edges.push({
          id: `edge-${asteroid.id}-to-earth`,
          sourceNodeId: nodeId,
          targetNodeId: 'node-planet-earth',
          relationshipType: 'orbital_flyby',
          label: 'Close Earth Flyby',
          description: `${asteroid.name} passes Earth with a miss distance of ${asteroid.missDistanceLunar.toFixed(2)} LD (${asteroid.missDistanceKm.toLocaleString()} km).`,
        });
      }
    });

    // Compute connection counts for every node
    nodes.forEach((node) => {
      const count = edges.filter(
        (e) => e.sourceNodeId === node.id || e.targetNodeId === node.id
      ).length;
      node.connectionCount = count;
    });

    this.cachedGraph = { nodes, edges };
    return this.cachedGraph;
  }

  /**
   * Filters the complete graph to a neighborhood around a specific node (up to depth hops).
   */
  public getNeighborhoodGraph(targetNodeId: string, depth: number = 1): DiscoveryGraphData {
    const fullGraph = this.getCompleteGraph();
    const targetNode = fullGraph.nodes.find((n) => n.id === targetNodeId);

    if (!targetNode) {
      return fullGraph;
    }

    const includedNodeIds = new Set<string>([targetNodeId]);
    let currentHopIds = new Set<string>([targetNodeId]);

    for (let d = 0; d < depth; d++) {
      const nextHopIds = new Set<string>();
      for (const edge of fullGraph.edges) {
        if (currentHopIds.has(edge.sourceNodeId)) {
          includedNodeIds.add(edge.targetNodeId);
          nextHopIds.add(edge.targetNodeId);
        }
        if (currentHopIds.has(edge.targetNodeId)) {
          includedNodeIds.add(edge.sourceNodeId);
          nextHopIds.add(edge.sourceNodeId);
        }
      }
      currentHopIds = nextHopIds;
    }

    const filteredNodes = fullGraph.nodes.filter((n) => includedNodeIds.has(n.id));
    const filteredEdges = fullGraph.edges.filter(
      (e) => includedNodeIds.has(e.sourceNodeId) && includedNodeIds.has(e.targetNodeId)
    );

    return {
      nodes: filteredNodes,
      edges: filteredEdges,
    };
  }
}

export const discoveryGraphService = new DiscoveryGraphService();
