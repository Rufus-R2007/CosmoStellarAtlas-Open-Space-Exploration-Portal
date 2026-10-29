import {
  QueryIntent,
  QueryResponse,
  SourceReference,
  Planet,
} from '../../../types';
import {
  planetsData,
  missionsData,
  roversData,
  roverImagesData,
  asteroidsData,
} from '../../../data';
import { queryIntentParser } from './queryIntentParser';

/**
 * Deterministic Query Execution Service.
 * Evaluates parsed intents against local curated datasets, providing factual answers,
 * full source citations, follow-up prompt suggestions, and evidence audits.
 * 100% offline, zero external LLM API calls.
 */
export class QueryExecutionService {
  /**
   * Main entry point to process a query string.
   */
  public executeQuery(rawQuery: string): QueryResponse {
    const intent = queryIntentParser.parse(rawQuery);
    const timestamp = new Date().toISOString();
    const id = `qr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    switch (intent.type) {
      case 'planet_info':
        return this.handlePlanetInfo(id, rawQuery, intent, timestamp);
      case 'planet_comparison':
        return this.handlePlanetComparison(id, rawQuery, intent, timestamp);
      case 'planet_extreme':
        return this.handlePlanetExtreme(id, rawQuery, intent, timestamp);
      case 'mission_info':
        return this.handleMissionInfo(id, rawQuery, intent, timestamp);
      case 'mission_destination':
        return this.handleMissionDestination(id, rawQuery, intent, timestamp);
      case 'mission_epoch':
        return this.handleMissionEpoch(id, rawQuery, intent, timestamp);
      case 'rover_info':
        return this.handleRoverInfo(id, rawQuery, intent, timestamp);
      case 'rover_list':
        return this.handleRoverList(id, rawQuery, intent, timestamp);
      case 'rover_images':
        return this.handleRoverImages(id, rawQuery, intent, timestamp);
      case 'asteroid_closest':
        return this.handleAsteroidClosest(id, rawQuery, intent, timestamp);
      case 'asteroid_filter':
        return this.handleAsteroidFilter(id, rawQuery, intent, timestamp);
      case 'asteroid_explain_distance':
        return this.handleAsteroidExplainDistance(id, rawQuery, intent, timestamp);
      case 'general_overview':
        return this.handleGeneralOverview(id, rawQuery, intent, timestamp);
      case 'entity_suggestion':
        return this.handleEntitySuggestion(id, rawQuery, intent, timestamp);
      case 'unknown':
      default:
        return this.handleUnknown(id, rawQuery, intent, timestamp);
    }
  }

  // ----------------------------------------------------
  // INTENT HANDLERS
  // ----------------------------------------------------

  private handlePlanetInfo(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const planetId = (intent.parameters?.planetId as string) || intent.extractedEntities.planetId || 'earth';
    const planet = planetsData.find((p) => p.id === planetId) || planetsData[2];

    const answer = `### ${planet.name} (${planet.codeName})

**Classification:** ${planet.type} Planet • **Order from Sun:** ${planet.orderFromSun}${
      planet.orderFromSun === 1 ? 'st' : planet.orderFromSun === 2 ? 'nd' : planet.orderFromSun === 3 ? 'rd' : 'th'
    } World

${planet.summary}

#### Key Physical & Orbital Metrics:
- **Equatorial Diameter:** ${planet.diameterKm.toLocaleString()} km (${(planet.diameterKm / 12742).toFixed(2)}x Earth)
- **Mean Distance from Sun:** ${planet.distanceFromSunAU} AU (${(planet.averageDistanceFromSunKm / 1e6).toFixed(1)} million km)
- **Surface Gravity:** ${planet.gravityMs2} m/s² (${planet.gravityEarthRel}g Earth-relative)
- **Mean Surface Temperature:** ${planet.surfaceTempMeanC}°C (Range: ${planet.surfaceTempRangeC.min}°C to ${planet.surfaceTempRangeC.max}°C)
- **Orbital Period (Year):** ${planet.orbitalPeriodDays} Earth days
- **Rotation Period (Day):** ${(planet.rotationPeriodHours / 24).toFixed(1)} Earth days (${planet.rotationPeriodHours} hours)
- **Known Natural Satellites:** ${planet.moonsCount} moons

#### Atmospheric Composition:
${planet.atmosphereComposition.map((g) => `- **${g.gas}:** ${g.percentage}%`).join('\n')}

#### Notable Features:
${planet.notableFeatures.map((f) => `- ${f}`).join('\n')}`;

    const sources: SourceReference[] = [
      {
        id: planet.id,
        title: `${planet.name} Scientific Factsheet`,
        entityType: 'planet',
        route: `/planets?id=${planet.id}`,
        label: 'Curated Planetary Ephemeris Record',
        provenance: 'Curated Reference Record',
      },
    ];

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: [planet.id],
      sourceReferences: sources,
      relatedEntityIds: planet.relatedMissionIds || [],
      suggestedQuestions: [
        `What missions have visited ${planet.name}?`,
        `Compare ${planet.name} with Earth`,
        `Which planet has the most moons?`,
      ],
      supported: true,
      evidenceExplanation: `Retrieved verified planetary ephemeris record for ${planet.name} [ID: ${planet.id}]. Rules applied: match_entity_exact, extract_ephemeris_attributes.`,
      timestamp,
    };
  }

  private handlePlanetComparison(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const p1Id = (intent.parameters?.planet1 as string) || intent.extractedEntities.planetId || 'earth';
    const p2Id = (intent.parameters?.planet2 as string) || intent.extractedEntities.secondPlanetId || 'mars';

    const p1 = planetsData.find((p) => p.id === p1Id) || planetsData[2]; // Earth
    const p2 = planetsData.find((p) => p.id === p2Id) || planetsData[3]; // Mars

    const diameterRatio = (p1.diameterKm / p2.diameterKm).toFixed(2);
    const gravityRatio = (p1.gravityMs2 / p2.gravityMs2).toFixed(2);
    const tempDelta = Math.abs(p1.surfaceTempMeanC - p2.surfaceTempMeanC);

    const answer = `### Comparative Analysis: ${p1.name} vs. ${p2.name}

| Metric | ${p1.name} | ${p2.name} | Comparative Ratio / Delta |
| :--- | :--- | :--- | :--- |
| **Classification** | ${p1.type} | ${p2.type} | ${p1.type === p2.type ? 'Identical Classification' : 'Distinct Planetary Classes'} |
| **Diameter** | ${p1.diameterKm.toLocaleString()} km | ${p2.diameterKm.toLocaleString()} km | ${p1.name} is ${diameterRatio}x size of ${p2.name} |
| **Distance from Sun** | ${p1.distanceFromSunAU} AU | ${p2.distanceFromSunAU} AU | Δ ${Math.abs(p1.distanceFromSunAU - p2.distanceFromSunAU).toFixed(2)} AU |
| **Surface Gravity** | ${p1.gravityMs2} m/s² | ${p2.gravityMs2} m/s² | ${p1.name} gravity is ${gravityRatio}x ${p2.name} |
| **Mean Surface Temp** | ${p1.surfaceTempMeanC}°C | ${p2.surfaceTempMeanC}°C | Δ ${tempDelta}°C difference |
| **Known Moons** | ${p1.moonsCount} | ${p2.moonsCount} | ${p1.moonsCount > p2.moonsCount ? p1.name : p2.name} has more satellites |
| **Orbital Period** | ${p1.orbitalPeriodDays} days | ${p2.orbitalPeriodDays} days | ${p2.name} year is ${(p2.orbitalPeriodDays / p1.orbitalPeriodDays).toFixed(2)}x ${p1.name} |

#### Key Insights:
- **Scale:** ${p1.diameterKm > p2.diameterKm ? p1.name : p2.name} is significantly larger by diameter and volume.
- **Surface Environment:** ${p1.name} experiences a mean temperature of ${p1.surfaceTempMeanC}°C, whereas ${p2.name} averages ${p2.surfaceTempMeanC}°C.
- **Gravity:** An explorer weighing 100 kg on Earth would weigh ${(100 * (p1.gravityMs2 / 9.807)).toFixed(0)} kg on ${p1.name} and ${(100 * (p2.gravityMs2 / 9.807)).toFixed(0)} kg on ${p2.name}.`;

    const sources: SourceReference[] = [
      {
        id: p1.id,
        title: `${p1.name} Ephemeris`,
        entityType: 'planet',
        route: `/planets?id=${p1.id}`,
        label: `${p1.name} Data Record`,
        provenance: 'Curated Reference Record',
      },
      {
        id: p2.id,
        title: `${p2.name} Ephemeris`,
        entityType: 'planet',
        route: `/planets?id=${p2.id}`,
        label: `${p2.name} Data Record`,
        provenance: 'Curated Reference Record',
      },
    ];

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: [p1.id, p2.id],
      sourceReferences: sources,
      relatedEntityIds: [p1.id, p2.id],
      suggestedQuestions: [
        `What missions went to ${p2.name}?`,
        `Tell me about ${p1.name}'s atmosphere`,
        `Which planet is the hottest in the solar system?`,
      ],
      supported: true,
      evidenceExplanation: `Evaluated comparative ephemeris attributes between ${p1.name} and ${p2.name}. Rules applied: cross_entity_tabular_comparison, metric_ratio_derivation.`,
      timestamp,
    };
  }

  private handlePlanetExtreme(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const metric = (intent.parameters?.metric as string) || 'hottest';
    let targetPlanet: Planet = planetsData[1]; // default Venus
    let explanation = '';

    switch (metric) {
      case 'hottest': {
        targetPlanet = planetsData.reduce((prev, curr) =>
          curr.surfaceTempMeanC > prev.surfaceTempMeanC ? curr : prev
        );
        explanation = `**${targetPlanet.name}** is the hottest planet with a mean surface temperature of **${targetPlanet.surfaceTempMeanC}°C** (hot enough to melt lead). Although Mercury is closer to the Sun, Venus's dense atmosphere of 96.5% carbon dioxide creates a runaway greenhouse effect that traps solar thermal radiation.`;
        break;
      }
      case 'coldest': {
        targetPlanet = planetsData.reduce((prev, curr) =>
          curr.surfaceTempMeanC < prev.surfaceTempMeanC ? curr : prev
        );
        explanation = `**${targetPlanet.name}** is the coldest planet with a mean surface temperature of **${targetPlanet.surfaceTempMeanC}°C** (dropping as low as -218°C), situated over 30 AU (4.5 billion km) from solar irradiance.`;
        break;
      }
      case 'largest': {
        targetPlanet = planetsData.reduce((prev, curr) =>
          curr.diameterKm > prev.diameterKm ? curr : prev
        );
        explanation = `**${targetPlanet.name}** is the largest planet in our solar system with an equatorial diameter of **${targetPlanet.diameterKm.toLocaleString()} km** (11 times the diameter of Earth, and over 1,300 Earths could fit inside its volume).`;
        break;
      }
      case 'smallest': {
        targetPlanet = planetsData.reduce((prev, curr) =>
          curr.diameterKm < prev.diameterKm ? curr : prev
        );
        explanation = `**${targetPlanet.name}** is the smallest planet with a diameter of only **${targetPlanet.diameterKm.toLocaleString()} km** (only slightly larger than Earth's Moon).`;
        break;
      }
      case 'most_moons': {
        targetPlanet = planetsData.reduce((prev, curr) =>
          curr.moonsCount > prev.moonsCount ? curr : prev
        );
        explanation = `**${targetPlanet.name}** holds the record with **${targetPlanet.moonsCount} confirmed natural satellites**, including the giant moon Titan, which possesses its own dense nitrogen atmosphere and liquid hydrocarbon seas.`;
        break;
      }
      case 'closest_sun': {
        targetPlanet = planetsData.reduce((prev, curr) =>
          curr.distanceFromSunAU < prev.distanceFromSunAU ? curr : prev
        );
        explanation = `**${targetPlanet.name}** is the closest planet to the Sun at an average distance of **${targetPlanet.distanceFromSunAU} AU** (57.9 million km), completing an orbit every 88 Earth days.`;
        break;
      }
      case 'farthest_sun': {
        targetPlanet = planetsData.reduce((prev, curr) =>
          curr.distanceFromSunAU > prev.distanceFromSunAU ? curr : prev
        );
        explanation = `**${targetPlanet.name}** is the most distant major planet from the Sun at **${targetPlanet.distanceFromSunAU} AU** (4.5 billion km), taking approximately 165 Earth years to complete a single orbital revolution.`;
        break;
      }
      case 'highest_gravity': {
        targetPlanet = planetsData.reduce((prev, curr) =>
          curr.gravityMs2 > prev.gravityMs2 ? curr : prev
        );
        explanation = `**${targetPlanet.name}** has the highest surface gravity in the solar system at **${targetPlanet.gravityMs2} m/s²** (2.53 times Earth's gravity).`;
        break;
      }
      case 'lowest_gravity': {
        targetPlanet = planetsData.reduce((prev, curr) =>
          curr.gravityMs2 < prev.gravityMs2 ? curr : prev
        );
        explanation = `**${targetPlanet.name}** has the lowest surface gravity among major planets at **${targetPlanet.gravityMs2} m/s²** (0.38g Earth-relative).`;
        break;
      }
    }

    const answer = `### Solar System Record: ${metric.replace('_', ' ').toUpperCase()}

${explanation}

#### Key Attributes for ${targetPlanet.name}:
- **Diameter:** ${targetPlanet.diameterKm.toLocaleString()} km
- **Distance from Sun:** ${targetPlanet.distanceFromSunAU} AU
- **Mean Temperature:** ${targetPlanet.surfaceTempMeanC}°C
- **Gravity:** ${targetPlanet.gravityMs2} m/s²
- **Moons:** ${targetPlanet.moonsCount}`;

    const sources: SourceReference[] = [
      {
        id: targetPlanet.id,
        title: `${targetPlanet.name} Record Holder`,
        entityType: 'planet',
        route: `/planets?id=${targetPlanet.id}`,
        label: `${targetPlanet.name} Factsheet`,
        provenance: 'Curated Reference Record',
      },
    ];

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: [targetPlanet.id],
      sourceReferences: sources,
      relatedEntityIds: [targetPlanet.id],
      suggestedQuestions: [
        `What is the atmosphere of ${targetPlanet.name}?`,
        `What missions have visited ${targetPlanet.name}?`,
        `Which planet has the coldest temperatures?`,
      ],
      supported: true,
      evidenceExplanation: `Scanned all ${planetsData.length} solar system planet records to determine extreme value for metric [${metric}]. Rules applied: aggregate_min_max_scan, superlative_derivation.`,
      timestamp,
    };
  }

  private handleMissionInfo(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const missionId = (intent.parameters?.missionId as string) || intent.extractedEntities.missionId || 'apollo-11';
    const mission = missionsData.find((m) => m.id === missionId) || missionsData[0];

    const milestonesText = mission.milestones && mission.milestones.length > 0
      ? `\n#### Key Mission Milestones:\n` +
        mission.milestones.map((m) => `- **${m.date} — ${m.title}:** ${m.description}`).join('\n')
      : '';

    const achievementsText = mission.achievements && mission.achievements.length > 0
      ? `\n#### Historic Achievements:\n` +
        mission.achievements.map((a) => `- ${a}`).join('\n')
      : '';

    const answer = `### Mission Dossier: ${mission.name}

**Agency:** ${mission.agency} • **Launch Date:** ${mission.launchDate} (${mission.launchYear})  
**Target Destination:** ${mission.destinationName} • **Status:** ${mission.status} • **Mission Type:** ${mission.missionType}

${mission.description}
${achievementsText}
${milestonesText}

#### Mission Outcome:
${mission.outcome || mission.storyline?.theLegacy || 'Mission objectives fulfilled according to flight plan.'}`;

    const sources: SourceReference[] = [
      {
        id: mission.id,
        title: `${mission.name} Flight Archive`,
        entityType: 'mission',
        route: `/missions/${mission.id}`,
        label: 'Historical Mission Telemetry Record',
        provenance: 'Curated Reference Record',
      },
    ];

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: [mission.id],
      sourceReferences: sources,
      relatedEntityIds: [mission.destinationPlanetId || 'earth'],
      suggestedQuestions: [
        `What other missions explored ${mission.destinationName}?`,
        `What missions launched in ${mission.launchYear}?`,
        `Show the trajectory of ${mission.name}`,
      ],
      supported: true,
      evidenceExplanation: `Retrieved historical mission flight record for ${mission.name} [ID: ${mission.id}]. Rules applied: match_mission_exact, extract_milestone_chronology.`,
      timestamp,
    };
  }

  private handleMissionDestination(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const destination = (intent.parameters?.destinationPlanetId as string) || intent.extractedEntities.destination || 'mars';
    const matchingMissions = missionsData.filter(
      (m) =>
        m.destinationPlanetId?.toLowerCase() === destination.toLowerCase() ||
        m.destinationName.toLowerCase().includes(destination.toLowerCase())
    );

    const destinationLabel = destination.charAt(0).toUpperCase() + destination.slice(1);

    let answer = `### Missions to ${destinationLabel} (${matchingMissions.length} Cataloged)`;

    if (matchingMissions.length === 0) {
      answer += `\n\nNo missions in the current local reference database target ${destinationLabel} directly. You can explore solar system exploration in the Cosmic Time Machine.`;
    } else {
      answer += `\n\n` +
        matchingMissions
          .map(
            (m) =>
              `- **${m.name} (${m.launchYear})** — *${m.agency}* [${m.status}]: ${
                m.objectives?.[0] || m.description
              }`
          )
          .join('\n\n');
    }

    const sources: SourceReference[] = matchingMissions.slice(0, 3).map((m) => ({
      id: m.id,
      title: m.name,
      entityType: 'mission',
      route: `/missions/${m.id}`,
      label: `${m.name} Mission Record`,
      provenance: 'Curated Reference Record',
    }));

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: matchingMissions.map((m) => m.id),
      sourceReferences: sources,
      relatedEntityIds: [destination],
      suggestedQuestions: [
        `Tell me about ${matchingMissions[0]?.name || 'Apollo 11'}`,
        `What rovers are on Mars?`,
        `Explore ${destinationLabel} in Planet Explorer`,
      ],
      supported: true,
      evidenceExplanation: `Filtered missions catalog by destination criteria [destination = ${destinationLabel}]. Found ${matchingMissions.length} matching flight records.`,
      timestamp,
    };
  }

  private handleMissionEpoch(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const year = (intent.parameters?.year as number) || intent.extractedEntities.year || 1969;
    const exactMatches = missionsData.filter((m) => m.launchYear === year);

    let answer = `### Space Missions of ${year}`;

    if (exactMatches.length > 0) {
      answer += `\n\nFound **${exactMatches.length} mission(s)** launched in **${year}**:\n\n` +
        exactMatches
          .map(
            (m) =>
              `#### ${m.name} (${m.agency})\n- **Destination:** ${m.destinationName}\n- **Type:** ${m.missionType} • **Status:** ${m.status}\n- **Summary:** ${m.description}`
          )
          .join('\n\n');
    } else {
      const nearby = missionsData
        .filter((m) => Math.abs(m.launchYear - year) <= 5)
        .sort((a, b) => Math.abs(a.launchYear - year) - Math.abs(b.launchYear - year))
        .slice(0, 3);

      answer += `\n\nNo signature missions in our curated catalog launched in the exact year **${year}**.\n\nHowever, active missions launched in proximate years include:\n\n` +
        nearby
          .map(
            (m) =>
              `- **${m.name} (${m.launchYear})**: ${m.agency} mission to ${m.destinationName} (${m.status}).`
          )
          .join('\n') +
        `\n\nAdjust the Cosmic Time Machine timeline slider to explore neighboring exploration epochs.`;
    }

    const sources: SourceReference[] = (exactMatches.length > 0 ? exactMatches : missionsData.slice(0, 2)).map(
      (m) => ({
        id: m.id,
        title: `${m.name} (${m.launchYear})`,
        entityType: 'mission',
        route: `/missions/${m.id}`,
        label: 'Mission Archive Record',
        provenance: 'Curated Reference Record',
      })
    );

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: exactMatches.map((m) => m.id),
      sourceReferences: sources,
      relatedEntityIds: exactMatches.map((m) => m.destinationPlanetId || 'earth'),
      suggestedQuestions: [
        `What missions launched in 1977?`,
        `What missions launched in 2020?`,
        `Tell me about Apollo 11`,
      ],
      supported: true,
      evidenceExplanation: `Queried missions catalog by temporal filter [year = ${year}]. Found ${exactMatches.length} exact matches.`,
      timestamp,
    };
  }

  private handleRoverInfo(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const roverId = (intent.parameters?.roverId as string) || intent.extractedEntities.roverId || 'perseverance';
    const rover = roversData.find((r) => r.id === roverId) || roversData[0];

    const instrumentsText = rover.instruments && rover.instruments.length > 0
      ? rover.instruments.map((i) => `- **${i.name} (${i.abbreviation}):** ${i.purpose}`).join('\n')
      : rover.keyInstruments.map((k) => `- ${k}`).join('\n');

    const answer = `### Mars Rover Operations Dossier: ${rover.name}

**Agency:** ${rover.agency} • **Status:** ${rover.status.toUpperCase()}  
**Landing Site:** ${rover.landingSite}  
**Landing Date:** ${rover.landingDate} (Launched ${rover.launchDate})

${rover.description}

#### Key Operational Telemetry:
- **Total Sols on Mars:** ${rover.totalSols} sols
- **Surface Distance Traversed:** ${rover.distanceTraveledKm} km
- **Sample Tubes Cored / Sealed:** ${rover.sampleCount}
- **Primary Mission Focus:** ${rover.primaryMission}

#### Science Payload & Key Instruments:
${instrumentsText}

#### Mission Objectives:
${rover.objectives?.map((o) => `- ${o}`).join('\n') || '- Surface exploration and planetary geology analysis'}`;

    const sources: SourceReference[] = [
      {
        id: rover.id,
        title: `${rover.name} Operations Console`,
        entityType: 'rover',
        route: `/rovers?id=${rover.id}`,
        label: 'Mars Surface Exploration Dataset',
        provenance: 'Curated Reference Record',
      },
    ];

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: [rover.id],
      sourceReferences: sources,
      relatedEntityIds: ['mars', rover.id],
      suggestedQuestions: [
        `Show photos from ${rover.name}`,
        `List all Mars rovers`,
        `What is the distance traveled by Curiosity?`,
      ],
      supported: true,
      evidenceExplanation: `Retrieved operational surface records for rover [ID: ${rover.id}]. Rules applied: match_rover_exact, extract_telemetry_metrics.`,
      timestamp,
    };
  }

  private handleRoverList(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const totalKm = roversData.reduce((sum, r) => sum + r.distanceTraveledKm, 0);
    const totalSols = roversData.reduce((sum, r) => sum + r.totalSols, 0);

    const answer = `### Mars Rover Fleet Overview (${roversData.length} Historic & Active Vehicles)

Humanity has deployed multiple robotic mobile laboratories to investigate the Martian surface. Together, this fleet has accumulated **${totalSols.toLocaleString()} sols** of surface operations and traversed over **${totalKm.toFixed(1)} km** of alien regolith.

| Rover | Status | Landing Date | Landing Site | Distance (km) | Sols |
| :--- | :--- | :--- | :--- | :--- | :--- |
${roversData
  .map(
    (r) =>
      `| **${r.name}** | ${r.status} | ${r.landingDate} | ${r.landingSite.split('(')[0].trim()} | ${r.distanceTraveledKm} km | ${r.totalSols} |`
  )
  .join('\n')}

#### Active Surface Assets:
- **Perseverance (Mars 2020):** Actively exploring Jezero Crater's paleolake delta, caching rock cores for return, and testing resource production.
- **Curiosity (Mars Science Laboratory):** Ascending Mount Sharp in Gale Crater, analyzing habitable past sedimentary clay layers.`;

    const sources: SourceReference[] = roversData.map((r) => ({
      id: r.id,
      title: `${r.name} Telemetry`,
      entityType: 'rover',
      route: `/rovers?id=${r.id}`,
      label: `${r.name} Surface Console`,
      provenance: 'Curated Reference Record',
    }));

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: roversData.map((r) => r.id),
      sourceReferences: sources,
      relatedEntityIds: ['mars'],
      suggestedQuestions: [
        `Tell me about Perseverance`,
        `Show photos from Curiosity`,
        `What rovers are currently active on Mars?`,
      ],
      supported: true,
      evidenceExplanation: `Aggregated all ${roversData.length} Mars rover telemetry records. Rules applied: fleet_aggregation, cumulative_distance_calculation.`,
      timestamp,
    };
  }

  private handleRoverImages(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const roverId = (intent.parameters?.roverId as string) || intent.extractedEntities.roverId || 'perseverance';
    const rover = roversData.find((r) => r.id === roverId) || roversData[0];
    const images = roverImagesData.filter((img) => img.roverId === rover.id);

    const answer = `### Image Discovery: ${rover.name} MastCam & NavCam Telemetry

The **${rover.name}** imaging system consists of multiple scientific and engineering optics, including high-resolution zoom cameras (Mastcam-Z), microscopic imagers, and hazard-avoidance cameras.

#### Available Surface Image Records:
- **Indexed Photos in Atlas:** ${images.length} verified sample exposures
- **Primary Camera Systems:** Mastcam-Z (Color Stereo), SuperCam RMI, Navcam (Stereo Engineering), Front Hazcam
- **Featured Exposures:**
${images.slice(0, 4).map((img) => `  - **Sol ${img.sol} (${img.cameraAbbreviation || img.cameraName}):** ${img.caption} [Exposure: ${img.earthDate}]`).join('\n')}

You can inspect full-resolution imagery, toggle camera spectral filters, and zoom into Martian rock textures in the **Mars Rover Explorer** gallery.`;

    const sources: SourceReference[] = [
      {
        id: rover.id,
        title: `${rover.name} Image Discovery Lab`,
        entityType: 'rover',
        route: `/rovers?id=${rover.id}&tab=gallery`,
        label: 'Mars Photographic Telemetry Lab',
        provenance: 'Curated Reference Record',
      },
    ];

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: images.map((i) => i.id),
      sourceReferences: sources,
      relatedEntityIds: ['mars', rover.id],
      suggestedQuestions: [
        `Tell me about Perseverance`,
        `List all Mars rovers`,
        `What are the scientific objectives of Curiosity?`,
      ],
      supported: true,
      evidenceExplanation: `Queried image catalog for rover [ID: ${rover.id}]. Found ${images.length} optical exposures.`,
      timestamp,
    };
  }

  private handleAsteroidClosest(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const sorted = [...asteroidsData].sort((a, b) => a.missDistanceLunar - b.missDistanceLunar);
    const closest = sorted[0];

    const answer = `### Closest Approaching Near-Earth Object: ${closest.name}

The asteroid in our reference tracking catalog with the closest projected Earth flyby is **${closest.name}** (Designation: ${closest.designation}).

#### Close-Approach Parameters:
- **Closest Approach Date:** ${closest.closeApproachDate}
- **Miss Distance:** **${closest.missDistanceLunar.toFixed(3)} LD** (${closest.missDistanceKm.toLocaleString()} km)
- **Estimated Diameter:** ${closest.estimatedDiameterMeters} meters
- **Relative Velocity:** ${closest.relativeVelocityKmS} km/s
- **Orbital Classification:** ${closest.orbitClass} Group
- **Hazard Classification:** ${closest.isPotentiallyHazardous ? '⚠️ Potentially Hazardous Asteroid (PHA)' : 'Non-Hazardous Near-Earth Object'}

${closest.description}

#### Scientific Significance:
At ${closest.missDistanceLunar.toFixed(3)} Lunar Distances (${closest.missDistanceKm.toLocaleString()} km), this body passes well inside the orbit of Earth's communications satellites in geostationary orbit (35,786 km), providing a historic scientific opportunity for planetary radar and radar astrometry.`;

    const sources: SourceReference[] = [
      {
        id: closest.id,
        title: `${closest.name} Orbit Profile`,
        entityType: 'asteroid',
        route: `/asteroids?id=${closest.id}`,
        label: 'Asteroid Watch Orbital Telemetry',
        provenance: 'Curated Reference Record',
      },
    ];

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: [closest.id],
      sourceReferences: sources,
      relatedEntityIds: [closest.id],
      suggestedQuestions: [
        `What is Lunar Distance?`,
        `Show potentially hazardous asteroids`,
        `Simulate asteroid impact deflection`,
      ],
      supported: true,
      evidenceExplanation: `Sorted ${asteroidsData.length} asteroid records by [missDistanceLunar ASC] to identify lowest approach distance. Rules applied: trajectory_min_scan.`,
      timestamp,
    };
  }

  private handleAsteroidFilter(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const phas = asteroidsData.filter((a) => a.isPotentiallyHazardous);

    const answer = `### Potentially Hazardous Asteroids (PHAs) — Surveillance Roster

A **Potentially Hazardous Asteroid (PHA)** is defined by two strict astronomical criteria:
1. An Earth Minimum Orbit Intersection Distance (**MOID**) of **0.05 AU** (approx. 7.48 million km / 19.5 Lunar Distances) or less.
2. An absolute magnitude of 22.0 or brighter, corresponding to an estimated diameter of **at least 140 meters**.

#### Monitored PHAs in CosmoStellarAtlas (${phas.length} Tracked):
${phas
  .map(
    (a) =>
      `- **${a.name} (${a.designation}):** Diameter ~${a.estimatedDiameterMeters}m • Miss Distance: **${a.missDistanceLunar.toFixed(2)} LD** (${a.missDistanceKm.toLocaleString()} km) on **${a.closeApproachDate}** • Velocity: ${a.relativeVelocityKmS} km/s`
  )
  .join('\n')}

#### Planetary Defense Status:
None of the cataloged PHAs pose an imminent threat of terrestrial collision within the next century. NASA's DART mission demonstrated kinetic impactor deflection capabilities against Didymos/Dimorphos in 2022. You can simulate deflection energy in the Planetary Defense What-If Lab.`;

    const sources: SourceReference[] = phas.slice(0, 3).map((a) => ({
      id: a.id,
      title: `${a.name} Tracking File`,
      entityType: 'asteroid',
      route: `/asteroids?id=${a.id}`,
      label: 'PHA Risk Assessment Dossier',
      provenance: 'Curated Reference Record',
    }));

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: phas.map((a) => a.id),
      sourceReferences: sources,
      relatedEntityIds: phas.map((a) => a.id),
      suggestedQuestions: [
        `Which asteroid comes closest to Earth?`,
        `What is Lunar Distance?`,
        `Tell me about 99942 Apophis`,
      ],
      supported: true,
      evidenceExplanation: `Filtered NEO catalog by boolean criteria [isPotentiallyHazardous === true]. Identified ${phas.length} matching bodies.`,
      timestamp,
    };
  }

  private handleAsteroidExplainDistance(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const answer = `### Astronomical Distance Units: Lunar Distance (LD) & Astronomical Unit (AU)

In planetary astronomy and planetary defense, conventional terrestrial units like kilometers are unwieldy due to the vast scales of space. Two fundamental standards are used:

#### 1. Lunar Distance (LD)
- **Definition:** The average distance between the center of Earth and the center of the Moon.
- **Exact Mean Value:** **384,400 km** (approx. 238,855 miles).
- **Application:** Used for Near-Earth Objects (NEOs) and close approaches.
- **Intuitive Rule:** 
  - Any asteroid passing at **< 1.0 LD** is closer to Earth than the Moon!
  - Geostationary communication satellites orbit at ~0.093 LD (35,786 km).

#### 2. Astronomical Unit (AU)
- **Definition:** The mean distance between the center of the Sun and the center of the Earth.
- **Exact Standard Value:** **149,597,870.7 km** (approx. 92.96 million miles).
- **Application:** Used for planetary orbits, interplanetary voyages, and asteroid orbital semi-major axes.
- **Equivalence:** 1 AU is approximately equal to 389.17 Lunar Distances.`;

    const sources: SourceReference[] = [
      {
        id: 'astronomical-units-ref',
        title: 'IAU Astronomical Units Standard',
        entityType: 'asteroid',
        route: '/asteroids',
        label: 'Astrodynamics Reference Guide',
        provenance: 'Curated Reference Record',
      },
    ];

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: ['99942-apophis', '101955-bennu'],
      sourceReferences: sources,
      relatedEntityIds: ['earth', 'moon'],
      suggestedQuestions: [
        `Which asteroid comes closest to Earth?`,
        `Show potentially hazardous asteroids`,
        `What is the diameter of Bennu?`,
      ],
      supported: true,
      evidenceExplanation: `Loaded astrodynamics constant definition module [IAU_SYSTEM_CONSTANTS]. Explaining 1 LD = 384,400 km and 1 AU = 149,597,870.7 km.`,
      timestamp,
    };
  }

  private handleGeneralOverview(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const answer = `### Welcome to CosmoStellarAtlas

**CosmoStellarAtlas** is an interactive, cinematic space exploration platform and software engineering micro-project created by **Rufus Samuel R** at **Karunya Institute of Technology and Sciences**.

The platform is designed to operate **100% offline and client-side**, featuring pure deterministic scientific simulations, structured curated datasets, and explainable intelligence without external API dependencies.

#### Exploration Modules:
1. **Observatory Dashboard (\`/\`):** Real-time solar system telemetry, daily celestial briefs, and activity streams.
2. **Planet Explorer (\`/planets\`):** 3D procedural globe renderers, physical atmospheric profiles, and dual-world comparison lab.
3. **Cosmic Time Machine (\`/timeline\`):** Interactive timeline of spaceflight from Sputnik (1957) to the Artemis era, with animated orbital replays.
4. **Mars Rover Explorer (\`/rovers\`):** Surface operations console with camera filters, sol timelines, waypoint traverse maps, and telemetry.
5. **Asteroid Watch (\`/asteroids\`):** Near-Earth object tracking, close-approach timelines, and kinetic planetary defense simulation lab.
6. **Space Intelligence (\`/intelligence\`):** Natural language Ask-the-Atlas assistant, Cosmic Briefing engine, discovery graph, and universal search.`;

    const sources: SourceReference[] = [
      {
        id: 'platform-overview',
        title: 'CosmoStellarAtlas Architecture',
        entityType: 'planet',
        route: '/',
        label: 'Platform Overview & Architecture',
        provenance: 'Curated Reference Record',
      },
    ];

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: [],
      sourceReferences: sources,
      relatedEntityIds: [],
      suggestedQuestions: [
        `What is Mars?`,
        `Show potentially hazardous asteroids`,
        `List all Mars rovers`,
        `What missions launched in 1969?`,
      ],
      supported: true,
      evidenceExplanation: `Platform overview intent matched with high confidence (0.98). Presenting architectural summary and navigation schema.`,
      timestamp,
    };
  }

  private handleEntitySuggestion(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const primaryEntity = intent.extractedEntities.matches?.[0] || {
      entityType: 'planet' as const,
      entityId: 'mars',
      matchedText: 'Mars',
    };
    let title = primaryEntity.matchedText;
    let description = 'Entity recognized in the local knowledge base.';
    let route = '/';

    if (primaryEntity.entityType === 'planet') {
      const p = planetsData.find((item) => item.id === primaryEntity.entityId);
      if (p) {
        title = p.name;
        description = `${p.type} planet with a diameter of ${p.diameterKm.toLocaleString()} km and ${p.moonsCount} moons.`;
        route = `/planets?id=${p.id}`;
      }
    } else if (primaryEntity.entityType === 'mission') {
      const m = missionsData.find((item) => item.id === primaryEntity.entityId);
      if (m) {
        title = m.name;
        description = `${m.agency} mission to ${m.destinationName} launched in ${m.launchYear} (${m.status}).`;
        route = `/missions/${m.id}`;
      }
    } else if (primaryEntity.entityType === 'rover') {
      const r = roversData.find((item) => item.id === primaryEntity.entityId);
      if (r) {
        title = r.name;
        description = `${r.status} Mars rover at ${r.landingSite}, having traversed ${r.distanceTraveledKm} km over ${r.totalSols} sols.`;
        route = `/rovers?id=${r.id}`;
      }
    } else if (primaryEntity.entityType === 'asteroid') {
      const a = asteroidsData.find((item) => item.id === primaryEntity.entityId);
      if (a) {
        title = a.name;
        description = `Near-Earth Asteroid (${a.orbitClass}) with diameter ~${a.estimatedDiameterMeters}m and miss distance ${a.missDistanceLunar.toFixed(2)} LD.`;
        route = `/asteroids?id=${a.id}`;
      }
    }

    const answer = `### Recognized Entity: ${title}

${description}

You can ask detailed questions about **${title}**, or navigate directly to its dedicated operational console.`;

    const sources: SourceReference[] = [
      {
        id: primaryEntity.entityId,
        title,
        entityType: primaryEntity.entityType,
        route,
        label: `${title} Reference Dossier`,
        provenance: 'Curated Reference Record',
      },
    ];

    const conf = intent.confidenceOrMatchStrength || intent.confidence || 0.8;

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: [primaryEntity.entityId],
      sourceReferences: sources,
      relatedEntityIds: [primaryEntity.entityId],
      suggestedQuestions: [
        `Tell me more about ${title}`,
        primaryEntity.entityType === 'planet'
          ? `Compare ${title} with Earth`
          : primaryEntity.entityType === 'rover'
          ? `Show photos from ${title}`
          : `Show flight timeline of ${title}`,
      ],
      supported: true,
      evidenceExplanation: `Entity recognized with confidence ${conf.toFixed(2)} [Entity: ${title}, Type: ${primaryEntity.entityType}].`,
      timestamp,
    };
  }

  private handleUnknown(
    id: string,
    question: string,
    intent: QueryIntent,
    timestamp: string
  ): QueryResponse {
    const answer = `### Atlas Query Assistant

I could not recognize a specific astronomical entity or supported question pattern in your query: *"**${question}**"*.

CosmoStellarAtlas operates on an **explainable deterministic query engine** that evaluates verified reference data without hallucinating or calling external cloud models.

#### Supported Topics & Questions:
- **Planetary Science:** *"What is Mars?"*, *"Atmosphere of Venus"*, *"Compare Earth and Jupiter"*, *"Which planet has the most moons?"*
- **Space Missions:** *"Tell me about Apollo 11"*, *"What missions went to Saturn?"*, *"What launched in 1977?"*
- **Mars Surface Operations:** *"What rovers are on Mars?"*, *"Tell me about Perseverance"*, *"Show rover images"*
- **Asteroid Tracking & Defense:** *"Which asteroid comes closest?"*, *"Show potentially hazardous asteroids"*, *"What is Lunar Distance?"*`;

    return {
      id,
      question,
      answer,
      intent,
      sourceRecordIds: [],
      sourceReferences: [],
      relatedEntityIds: [],
      suggestedQuestions: [
        'What is Mars?',
        'Which planet has the most moons?',
        'Tell me about Apollo 11',
        'What rovers are on Mars?',
        'Which asteroid comes closest to Earth?',
      ],
      supported: false,
      evidenceExplanation: `No matching rule or entity found in normalized query tokens. Fallback response generated with exploration suggestions.`,
      timestamp,
    };
  }
}

export const queryExecutionService = new QueryExecutionService();
