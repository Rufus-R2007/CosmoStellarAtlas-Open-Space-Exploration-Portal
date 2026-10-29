import {
  SimulationParameters,
  SimulationResult,
  SensitivityComparison,
  ExplainableInsight,
  EducationalScenario,
} from '../../../types';

export const JOULES_PER_KILOTON_TNT = 4.184e12;
export const JOULES_PER_MEGATON_TNT = 4.184e15;
export const KM_PER_LUNAR_DISTANCE = 384400; // Average Earth-Moon distance

export const DEFAULT_SIMULATION_PARAMETERS: SimulationParameters = {
  diameterM: 100,
  velocityKmS: 20,
  densityKgM3: 2500, // Typical stony (S-type silicate) asteroid density
  illustrativeMissDistanceKm: 384400, // 1.0 Lunar Distance
};

/**
 * Step 1: Calculate asteroid radius in meters.
 * Validates against negative or non-finite inputs.
 */
export function calculateImpactRadius(diameterM: number): number {
  if (typeof diameterM !== 'number' || !isFinite(diameterM) || diameterM <= 0) {
    return 0;
  }
  return diameterM / 2;
}

/**
 * Step 2: Calculate sphere volume: V = (4/3) * π * r³ in cubic meters.
 */
export function calculateSphereVolume(radiusM: number): number {
  if (typeof radiusM !== 'number' || !isFinite(radiusM) || radiusM <= 0) {
    return 0;
  }
  return (4 / 3) * Math.PI * Math.pow(radiusM, 3);
}

/**
 * Step 3: Calculate estimated mass: m = ρ * V in kilograms.
 */
export function calculateAsteroidMass(volumeM3: number, densityKgM3: number): number {
  if (
    typeof volumeM3 !== 'number' ||
    typeof densityKgM3 !== 'number' ||
    !isFinite(volumeM3) ||
    !isFinite(densityKgM3) ||
    volumeM3 <= 0 ||
    densityKgM3 <= 0
  ) {
    return 0;
  }
  return volumeM3 * densityKgM3;
}

/**
 * Converts velocity from km/s to m/s.
 */
export function convertVelocityKmSToMs(velocityKmS: number): number {
  if (typeof velocityKmS !== 'number' || !isFinite(velocityKmS) || velocityKmS < 0) {
    return 0;
  }
  return velocityKmS * 1000;
}

/**
 * Step 4: Calculate kinetic energy: E = (1/2) * m * v² in Joules.
 * Converts velocity in km/s to m/s prior to calculation.
 */
export function calculateKineticEnergy(massKg: number, velocityKmS: number): number {
  if (
    typeof massKg !== 'number' ||
    typeof velocityKmS !== 'number' ||
    !isFinite(massKg) ||
    !isFinite(velocityKmS) ||
    massKg <= 0 ||
    velocityKmS <= 0
  ) {
    return 0;
  }
  const velocityMs = convertVelocityKmSToMs(velocityKmS);
  return 0.5 * massKg * Math.pow(velocityMs, 2);
}

/**
 * Step 5: Convert energy in Joules to Kilotons of TNT equivalent.
 * 1 Kiloton TNT = 4.184 × 10¹² Joules
 */
export function convertJoulesToKilotonsTNT(energyJ: number): number {
  if (typeof energyJ !== 'number' || !isFinite(energyJ) || energyJ <= 0) {
    return 0;
  }
  return energyJ / JOULES_PER_KILOTON_TNT;
}

/**
 * Step 5: Convert energy in Joules to Megatons of TNT equivalent.
 * 1 Megaton TNT = 4.184 × 10¹⁵ Joules
 */
export function convertJoulesToMegatonsTNT(energyJ: number): number {
  if (typeof energyJ !== 'number' || !isFinite(energyJ) || energyJ <= 0) {
    return 0;
  }
  return energyJ / JOULES_PER_MEGATON_TNT;
}

/**
 * Converts distance in kilometers to Lunar Distances (LD).
 * 1 LD = 384,400 km
 */
export function convertKmToLunarDistances(distanceKm: number): number {
  if (typeof distanceKm !== 'number' || !isFinite(distanceKm) || distanceKm <= 0) {
    return 0;
  }
  return distanceKm / KM_PER_LUNAR_DISTANCE;
}

/**
 * Converts Lunar Distances (LD) to kilometers.
 */
export function convertLunarDistancesToKm(lunarDistances: number): number {
  if (typeof lunarDistances !== 'number' || !isFinite(lunarDistances) || lunarDistances <= 0) {
    return 0;
  }
  return lunarDistances * KM_PER_LUNAR_DISTANCE;
}

/**
 * Main pure physics calculator.
 * Strictly calculates impact kinetic energy from diameter, velocity, and density.
 * Note: illustrativeMissDistanceKm is intentionally ignored in energy calculations!
 */
export function calculateSimulationResult(params: SimulationParameters): SimulationResult {
  const safeDiameter = Math.max(0, isFinite(params.diameterM) ? params.diameterM : 0);
  const safeVelocity = Math.max(0, isFinite(params.velocityKmS) ? params.velocityKmS : 0);
  const safeDensity = Math.max(0, isFinite(params.densityKgM3) ? params.densityKgM3 : 0);

  const radiusM = calculateImpactRadius(safeDiameter);
  const volumeM3 = calculateSphereVolume(radiusM);
  const massKg = calculateAsteroidMass(volumeM3, safeDensity);
  const velocityMs = convertVelocityKmSToMs(safeVelocity);
  const kineticEnergyJ = calculateKineticEnergy(massKg, safeVelocity);
  const kineticEnergyKilotons = convertJoulesToKilotonsTNT(kineticEnergyJ);
  const kineticEnergyMegatons = convertJoulesToMegatonsTNT(kineticEnergyJ);

  return {
    radiusM,
    volumeM3,
    massKg,
    velocityMs,
    kineticEnergyJ,
    kineticEnergyKilotons,
    kineticEnergyMegatons,
  };
}

/**
 * Generates an empirical curve of Kinetic Energy vs Diameter (10m to 1,000m)
 * holding velocity and density constant.
 */
export function generateEnergyVsDiameterCurve(
  velocityKmS: number,
  densityKgM3: number,
  samples: number = 20
): Array<{ diameterM: number; energyMegatons: number }> {
  const points: Array<{ diameterM: number; energyMegatons: number }> = [];
  const minD = 10;
  const maxD = 1000;
  const step = (maxD - minD) / (samples - 1);

  for (let i = 0; i < samples; i++) {
    const d = Math.round(minD + i * step);
    const res = calculateSimulationResult({
      diameterM: d,
      velocityKmS,
      densityKgM3,
      illustrativeMissDistanceKm: 384400,
    });
    points.push({
      diameterM: d,
      energyMegatons: Number(res.kineticEnergyMegatons.toFixed(2)),
    });
  }
  return points;
}

/**
 * Generates an empirical curve of Kinetic Energy vs Velocity (5 km/s to 40 km/s)
 * holding diameter and density constant.
 * Illustrates the quadratic relationship E ∝ v².
 */
export function generateEnergyVsVelocityCurve(
  diameterM: number,
  densityKgM3: number,
  samples: number = 20
): Array<{ velocityKmS: number; energyMegatons: number }> {
  const points: Array<{ velocityKmS: number; energyMegatons: number }> = [];
  const minV = 5;
  const maxV = 40;
  const step = (maxV - minV) / (samples - 1);

  for (let i = 0; i < samples; i++) {
    const v = Number((minV + i * step).toFixed(1));
    const res = calculateSimulationResult({
      diameterM,
      velocityKmS: v,
      densityKgM3,
      illustrativeMissDistanceKm: 384400,
    });
    points.push({
      velocityKmS: v,
      energyMegatons: Number(res.kineticEnergyMegatons.toFixed(2)),
    });
  }
  return points;
}

/**
 * Parameter sensitivity comparison:
 * Shows the exact kinetic energy multiplier when each parameter is doubled individually.
 */
export function generateSensitivityBreakdown(
  params: SimulationParameters
): SensitivityComparison[] {
  const baseResult = calculateSimulationResult(params);

  // 1. Doubling Diameter -> Mass x 8 -> Energy x 8
  const doubledDiameterResult = calculateSimulationResult({
    ...params,
    diameterM: params.diameterM * 2,
  });
  const diameterMultiplier =
    baseResult.kineticEnergyJ > 0
      ? doubledDiameterResult.kineticEnergyJ / baseResult.kineticEnergyJ
      : 8;

  // 2. Doubling Velocity -> Energy x 4 (quadratic)
  const doubledVelocityResult = calculateSimulationResult({
    ...params,
    velocityKmS: params.velocityKmS * 2,
  });
  const velocityMultiplier =
    baseResult.kineticEnergyJ > 0
      ? doubledVelocityResult.kineticEnergyJ / baseResult.kineticEnergyJ
      : 4;

  // 3. Doubling Density -> Mass x 2 -> Energy x 2 (linear)
  const doubledDensityResult = calculateSimulationResult({
    ...params,
    densityKgM3: params.densityKgM3 * 2,
  });
  const densityMultiplier =
    baseResult.kineticEnergyJ > 0
      ? doubledDensityResult.kineticEnergyJ / baseResult.kineticEnergyJ
      : 2;

  return [
    {
      parameter: 'Asteroid Diameter (d)',
      baselineValue: `${params.diameterM} m`,
      doubledValue: `${params.diameterM * 2} m (2×)`,
      energyMultiplier: Number(diameterMultiplier.toFixed(1)),
      mathematicalPrinciple: 'Cubic scaling with radius: V ∝ r³, m ∝ V ⇒ E ∝ d³ (Doubling diameter yields an 8× energy increase)',
    },
    {
      parameter: 'Impact Velocity (v)',
      baselineValue: `${params.velocityKmS} km/s`,
      doubledValue: `${params.velocityKmS * 2} km/s (2×)`,
      energyMultiplier: Number(velocityMultiplier.toFixed(1)),
      mathematicalPrinciple: 'Quadratic scaling with velocity: E = ½ m v² ⇒ E ∝ v² (Doubling velocity yields a 4× energy increase)',
    },
    {
      parameter: 'Assumed Density (ρ)',
      baselineValue: `${params.densityKgM3} kg/m³`,
      doubledValue: `${params.densityKgM3 * 2} kg/m³ (2×)`,
      energyMultiplier: Number(densityMultiplier.toFixed(1)),
      mathematicalPrinciple: 'Linear scaling with density: m = ρ V ⇒ E ∝ ρ (Doubling density yields a 2× energy increase)',
    },
  ];
}

/**
 * Reusable Explainable Physics Engine.
 * Generates transparent, deterministic scientific insights from current parameters and calculations.
 */
export function generateExplainableInsights(
  params: SimulationParameters,
  result: SimulationResult
): ExplainableInsight[] {
  const energyMegatonsFormatted = result.kineticEnergyMegatons.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  const energyKilotonsFormatted = result.kineticEnergyKilotons.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });
  const massTons = (result.massKg / 1000).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return [
    {
      title: 'Spherical Geometry & Mass Estimation',
      category: 'size',
      summary: `A ${params.diameterM}m diameter asteroid has an estimated spherical volume of ${(result.volumeM3 / 1e6).toFixed(3)} million m³ and mass of ${massTons} metric tons at ${params.densityKgM3} kg/m³.`,
      mathematicalFormula: 'V = \\frac{4}{3} \\pi \\left(\\frac{d}{2}\\right)^3, \\quad m = \\rho V',
      detailedExplanation:
        'Because volume scales with the cube of the radius, small changes in asteroid diameter cause massive changes in total mass. Doubling the diameter from ' +
        params.diameterM +
        'm to ' +
        params.diameterM * 2 +
        'm multiplies the volume and mass by eightfold (2³ = 8).',
    },
    {
      title: 'Quadratic Kinetic Energy Delivery',
      category: 'velocity',
      summary: `At an encounter velocity of ${params.velocityKmS} km/s (${result.velocityMs.toLocaleString()} m/s), the hypothetical incoming kinetic energy equals ${energyMegatonsFormatted} Megatons of TNT (${energyKilotonsFormatted} Kilotons).`,
      mathematicalFormula: 'E = \\frac{1}{2} m v^2, \\quad 1\\text{ Mt TNT} = 4.184 \\times 10^{15}\\text{ Joules}',
      detailedExplanation:
        'Velocity dominates kinetic energy because of the v² exponent. Traveling at ' +
        params.velocityKmS +
        ' km/s means each kilogram of asteroid regolith carries ' +
        ((0.5 * Math.pow(result.velocityMs, 2)) / 1e6).toFixed(1) +
        ' Megajoules of kinetic energy—orders of magnitude higher than conventional chemical high explosives.',
    },
    {
      title: 'Density & Compositional Variance',
      category: 'density',
      summary: `The assumed density of ${params.densityKgM3} kg/m³ corresponds to ${getCompositionName(params.densityKgM3)}.`,
      mathematicalFormula: 'm \\propto \\rho',
      detailedExplanation:
        'Asteroid composition dramatically alters mass. Porous cometary rubble piles (~1,000–1,500 kg/m³) deliver far less mass than dense stony silicates (~2,500 kg/m³) or solid nickel-iron metallic cores (~3,500–7,800 kg/m³) of identical diameter.',
    },
    {
      title: 'Close-Approach Geometry vs. Collision Reality',
      category: 'geometry',
      summary: `The illustrative encounter distance of ${params.illustrativeMissDistanceKm.toLocaleString()} km (${(params.illustrativeMissDistanceKm / KM_PER_LUNAR_DISTANCE).toFixed(2)} Lunar Distances) represents a safe flyby distance.`,
      detailedExplanation:
        'A close approach does NOT imply an impact. In celestial mechanics, a miss distance of even 0.5 Lunar Distances (~192,000 km) is 15 times the diameter of the Earth. Space is overwhelmingly empty, and encounter geometry is conceptually separate from hypothetical impact kinetic energy.',
    },
    {
      title: 'Crucial Educational Model Limitations',
      category: 'limitations',
      summary:
        'This calculation reflects idealized vacuum kinetic energy. It does NOT model atmospheric fragmentation, airburst altitude, cratering, casualties, or tsunamis.',
      detailedExplanation:
        'Real-world planetary encounters involve complex atmospheric entry physics. Asteroids smaller than ~25m typically disintegrate harmlessly as high-altitude fireballs (bolides). Intermediate objects (50–100m) may produce atmospheric airbursts (similar to Tunguska 1908 or Chelyabinsk 2013), while only dense or massive bodies reach the ground to form hypervelocity impact craters.',
    },
  ];
}

/**
 * Returns intuitive composition classification from density.
 */
function getCompositionName(density: number): string {
  if (density < 1600) return 'a porous cometary ice or carbonaceous volatile rubble-pile';
  if (density < 2800) return 'a typical stony silicate (S-type) chondrite structure';
  return 'a dense metallic-rich nickel-iron or monolithic basalt rock';
}

/**
 * Educational Scenario Presets.
 */
export const EDUCATIONAL_SCENARIOS: EducationalScenario[] = [
  {
    id: 'chelyabinsk-scale',
    name: 'Small Asteroid (Chelyabinsk-Scale)',
    subtitle: 'High-Altitude Airburst Scenario (~20m)',
    description:
      'Hypothetical 20-meter chondritic meteor entering at 19 km/s. Similar in scale to the February 2013 Chelyabinsk superbolide over the southern Ural mountains.',
    historicalReference: 'Chelyabinsk meteor (2013, ~500 kt equivalent)',
    defaultParameters: {
      diameterM: 20,
      velocityKmS: 19,
      densityKgM3: 3300,
      illustrativeMissDistanceKm: 45000,
    },
    assumptions: [
      'Stony ordinary chondrite density (~3,300 kg/m³)',
      'Steep atmospheric entry angle (~18°)',
      'Primary energy released via atmospheric fragmentation airburst',
    ],
    educationalSignificance:
      'Demonstrates that small bodies (~20m) release explosive energy at high altitude (15–25 km) rather than excavating a ground crater, producing strong shockwaves that shatter windows.',
  },
  {
    id: 'tunguska-scale',
    name: 'Medium Asteroid (Tunguska-Scale)',
    subtitle: 'Regional Aerial Blast Scenario (~60m)',
    description:
      'Hypothetical 60-meter stony asteroid encountering Earth at 15 km/s. Comparable in magnitude to the June 1908 Siberian forest flattening over the Podkamennaya Tunguska river.',
    historicalReference: 'Tunguska event (1908, ~10–15 Mt equivalent)',
    defaultParameters: {
      diameterM: 60,
      velocityKmS: 15,
      densityKgM3: 2500,
      illustrativeMissDistanceKm: 150000,
    },
    assumptions: [
      'Porous stony silicate rubble-pile (~2,500 kg/m³)',
      'Low entry velocity (~15 km/s)',
      'Catastrophic airburst at 5–10 km altitude',
    ],
    educationalSignificance:
      'Illustrates a "city-killer" scale threshold. Objects between 50m and 100m can flatten thousands of square kilometers of forest or urban infrastructure through severe thermal radiation and overpressure waves.',
  },
  {
    id: 'dimorphos-scale',
    name: 'Large Asteroid (Regional Impact Threat / DART Scale)',
    subtitle: 'Cratering Hazard & Deflection Target (~160m)',
    description:
      'Hypothetical 160-meter asteroid comparable in size to Dimorphos, the target of NASA’s DART (Double Asteroid Redirection Test) kinetic impactor mission.',
    historicalReference: 'NASA DART Target (Dimorphos / Didymos B)',
    defaultParameters: {
      diameterM: 160,
      velocityKmS: 24,
      densityKgM3: 2700,
      illustrativeMissDistanceKm: 420000,
    },
    assumptions: [
      'Silicate rubble-pile held together by microgravity (~2,700 kg/m³)',
      'Planetary encounter velocity of 24 km/s',
      'Ground-penetrating kinetic strike capability',
    ],
    educationalSignificance:
      'The 140m threshold is NASA and Congress’s mandated search benchmark. Asteroids ≥140m survive atmospheric deceleration to gouge multi-kilometer craters, making early detection and kinetic deflection vital.',
  },
  {
    id: 'high-velocity-comet',
    name: 'High-Velocity Cometary Fragment',
    subtitle: 'Extreme Velocity Retrograde Encounter (~250m @ 38 km/s)',
    description:
      'Hypothetical 250-meter volatile cometary fragment on a steep retrograde orbital inclination, encountering the inner Solar System at an extreme 38 km/s.',
    historicalReference: 'Long-period Oort cloud cometary orbit',
    defaultParameters: {
      diameterM: 250,
      velocityKmS: 38,
      densityKgM3: 1200,
      illustrativeMissDistanceKm: 890000,
    },
    assumptions: [
      'Porous icy/hydrocarbon volatile core (~1,200 kg/m³)',
      'Extreme retrograde encounter velocity (38 km/s)',
      'Short orbital warning lead time',
    ],
    educationalSignificance:
      'Demonstrates the quadratic nature of kinetic energy (E ∝ v²). Even with low cometary density, high encounter velocities cause total kinetic energy to surge by an order of magnitude.',
  },
];
