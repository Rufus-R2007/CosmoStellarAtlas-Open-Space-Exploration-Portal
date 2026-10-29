import { Planet } from '../types';

export interface ComparisonMetricRatio {
  label: string;
  unit: string;
  valA: number;
  valB: number;
  displayA: string;
  displayB: string;
  ratioAtoB: number; // valA / valB
  percentageDiff: number; // ((valA - valB) / valB) * 100
  dominantPlanet: 'A' | 'B' | 'Equal';
  summaryText: string;
}

export interface PlanetComparisonResults {
  planetA: Planet;
  planetB: Planet;
  diameter: ComparisonMetricRatio;
  mass: ComparisonMetricRatio;
  gravity: ComparisonMetricRatio;
  temperature: ComparisonMetricRatio;
  orbitalPeriod: ComparisonMetricRatio;
  dayLength: ComparisonMetricRatio;
  distanceFromSun: ComparisonMetricRatio;
  moonCount: ComparisonMetricRatio;
}

/**
 * Formats orbital period into human-readable years and days
 */
export function formatOrbitalPeriod(days: number): string {
  if (days < 365.25) {
    return `${days.toFixed(1)} Earth Days`;
  }
  const years = days / 365.25;
  return `${years.toFixed(2)} Earth Years (${Math.round(days).toLocaleString()} Days)`;
}

/**
 * Formats rotation period (length of day) in hours and days, handling retrograde
 */
export function formatRotationPeriod(hours: number): string {
  const isRetrograde = hours < 0;
  const absHours = Math.abs(hours);

  if (absHours < 48) {
    return `${absHours.toFixed(1)} Hours${isRetrograde ? ' (Retrograde)' : ''}`;
  }
  const days = absHours / 24;
  return `${days.toFixed(1)} Earth Days${isRetrograde ? ' (Retrograde)' : ''}`;
}

/**
 * Formats distance in km with millions/billions notation
 */
export function formatDistanceKm(km: number): string {
  if (km >= 1_000_000_000) {
    return `${(km / 1_000_000_000).toFixed(2)} Billion km`;
  }
  return `${(km / 1_000_000).toFixed(1)} Million km`;
}

/**
 * Calculates human weight on target planet given weight on Earth
 */
export function calculateWeightOnPlanet(earthWeightKg: number, gravityEarthRel: number): number {
  return Number((earthWeightKg * gravityEarthRel).toFixed(1));
}

/**
 * Computes comparative mathematical metrics between two planets
 */
export function computePlanetComparison(planetA: Planet, planetB: Planet): PlanetComparisonResults {
  const createMetric = (
    label: string,
    unit: string,
    valA: number,
    valB: number,
    displayA: string,
    displayB: string,
    invertAdvantage: boolean = false
  ): ComparisonMetricRatio => {
    const safeB = valB === 0 ? 0.0001 : valB;
    const ratioAtoB = Number((valA / safeB).toFixed(2));
    const percentageDiff = Number((((valA - valB) / Math.abs(safeB)) * 100).toFixed(1));

    let dominant: 'A' | 'B' | 'Equal' = 'Equal';
    if (valA > valB) dominant = invertAdvantage ? 'B' : 'A';
    else if (valA < valB) dominant = invertAdvantage ? 'A' : 'B';

    let summaryText = '';
    if (ratioAtoB === 1 || valA === valB) {
      summaryText = `Both worlds have approximately identical ${label.toLowerCase()}.`;
    } else if (ratioAtoB > 1) {
      summaryText = `${planetA.name} is ${ratioAtoB}× the ${label.toLowerCase()} of ${planetB.name}.`;
    } else {
      const inverseRatio = Number((valB / (valA === 0 ? 0.0001 : valA)).toFixed(2));
      summaryText = `${planetA.name} is ${ratioAtoB}× (${inverseRatio}× smaller than) ${planetB.name}.`;
    }

    return {
      label,
      unit,
      valA,
      valB,
      displayA,
      displayB,
      ratioAtoB,
      percentageDiff,
      dominantPlanet: dominant,
      summaryText,
    };
  };

  return {
    planetA,
    planetB,
    diameter: createMetric(
      'Diameter',
      'km',
      planetA.diameterKm,
      planetB.diameterKm,
      `${planetA.diameterKm.toLocaleString()} km`,
      `${planetB.diameterKm.toLocaleString()} km`
    ),
    mass: createMetric(
      'Mass',
      'Earth masses',
      planetA.massEarthRel,
      planetB.massEarthRel,
      `${planetA.massEarthRel} M⊕`,
      `${planetB.massEarthRel} M⊕`
    ),
    gravity: createMetric(
      'Surface Gravity',
      'g',
      planetA.gravityEarthRel,
      planetB.gravityEarthRel,
      `${planetA.gravityEarthRel} g (${planetA.gravityMs2} m/s²)`,
      `${planetB.gravityEarthRel} g (${planetB.gravityMs2} m/s²)`
    ),
    temperature: createMetric(
      'Mean Surface Temperature',
      '°C',
      planetA.surfaceTempMeanC,
      planetB.surfaceTempMeanC,
      `${planetA.surfaceTempMeanC}°C`,
      `${planetB.surfaceTempMeanC}°C`
    ),
    orbitalPeriod: createMetric(
      'Orbital Period (Year Length)',
      'days',
      planetA.orbitalPeriodDays,
      planetB.orbitalPeriodDays,
      formatOrbitalPeriod(planetA.orbitalPeriodDays),
      formatOrbitalPeriod(planetB.orbitalPeriodDays)
    ),
    dayLength: createMetric(
      'Day Length (Rotation Period)',
      'hours',
      Math.abs(planetA.rotationPeriodHours),
      Math.abs(planetB.rotationPeriodHours),
      formatRotationPeriod(planetA.rotationPeriodHours),
      formatRotationPeriod(planetB.rotationPeriodHours)
    ),
    distanceFromSun: createMetric(
      'Distance from Sun',
      'AU',
      planetA.distanceFromSunAU,
      planetB.distanceFromSunAU,
      `${planetA.distanceFromSunAU} AU (${formatDistanceKm(planetA.averageDistanceFromSunKm)})`,
      `${planetB.distanceFromSunAU} AU (${formatDistanceKm(planetB.averageDistanceFromSunKm)})`
    ),
    moonCount: createMetric(
      'Known Moons',
      'moons',
      planetA.moonsCount,
      planetB.moonsCount,
      `${planetA.moonsCount} Moons`,
      `${planetB.moonsCount} Moons`
    ),
  };
}

