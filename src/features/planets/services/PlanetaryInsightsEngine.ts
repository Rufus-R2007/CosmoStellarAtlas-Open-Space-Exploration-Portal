import { Planet } from '../../../types';

export interface PlanetaryInsight {
  headline: string;
  category: 'Gravitational' | 'Dimensional' | 'Orbital' | 'Atmospheric' | 'Thermal';
  description: string;
  badge: string;
}

export class PlanetaryInsightsEngine {
  /**
   * Generates deterministic, rule-based scientific comparison insights
   * directly calculated from stored physical constants and metrics.
   */
  public static generateComparisonInsights(planetA: Planet, planetB: Planet): PlanetaryInsight[] {
    if (planetA.id === planetB.id) {
      return [
        {
          headline: 'Identical Celestial Target Selected',
          category: 'Dimensional',
          description: `You are comparing ${planetA.name} to itself. Select a contrasting planetary world to examine differential mass, gravitational acceleration, orbital radius, and atmospheric thermodynamics.`,
          badge: 'Same World',
        },
      ];
    }

    const insights: PlanetaryInsight[] = [];

    // 1. Gravity Analysis
    const gravRatio = Number((planetA.gravityEarthRel / planetB.gravityEarthRel).toFixed(2));
    if (gravRatio > 1.05) {
      const pctMore = Math.round((gravRatio - 1) * 100);
      insights.push({
        headline: `Stronger Gravitational Field on ${planetA.name}`,
        category: 'Gravitational',
        description: `Surface gravity on ${planetA.name} (${planetA.gravityMs2} m/s²) is ${gravRatio}× (${pctMore}% higher than) ${planetB.name} (${planetB.gravityMs2} m/s²). A human weighing 70 kg on Earth would weigh ${(70 * planetA.gravityEarthRel).toFixed(1)} kg on ${planetA.name} versus ${(70 * planetB.gravityEarthRel).toFixed(1)} kg on ${planetB.name}.`,
        badge: `${gravRatio}× Gravity`,
      });
    } else if (gravRatio < 0.95) {
      const pctOf = Math.round(gravRatio * 100);
      insights.push({
        headline: `Lower Gravitational Acceleration on ${planetA.name}`,
        category: 'Gravitational',
        description: `${planetA.name} possesses approximately ${pctOf}% of the surface gravity found on ${planetB.name}. Atmospheric retention and escape velocity requirements on ${planetA.name} are significantly lower as a result.`,
        badge: `${pctOf}% Gravity`,
      });
    } else {
      insights.push({
        headline: 'Comparable Surface Gravity',
        category: 'Gravitational',
        description: `${planetA.name} (${planetA.gravityEarthRel} g) and ${planetB.name} (${planetB.gravityEarthRel} g) exert near-identical gravitational forces at their mean planetary radii.`,
        badge: 'Equilibrium',
      });
    }

    // 2. Dimensional Scale Analysis
    const diaRatio = Number((planetA.diameterKm / planetB.diameterKm).toFixed(1));
    if (diaRatio >= 1.5) {
      insights.push({
        headline: `Substantial Volumetric Dominance by ${planetA.name}`,
        category: 'Dimensional',
        description: `With a diameter of ${planetA.diameterKm.toLocaleString()} km compared to ${planetB.diameterKm.toLocaleString()} km, ${planetA.name} is ${diaRatio}× wider than ${planetB.name}. By spherical volume scaling, approximately ${Math.round(Math.pow(diaRatio, 3)).toLocaleString()} bodies the size of ${planetB.name} could fit inside ${planetA.name}.`,
        badge: `${diaRatio}× Diameter`,
      });
    } else if (diaRatio <= 0.67) {
      const invRatio = Number((planetB.diameterKm / planetA.diameterKm).toFixed(1));
      insights.push({
        headline: `${planetB.name} Dwarfs ${planetA.name} in Planetary Scale`,
        category: 'Dimensional',
        description: `${planetA.name} (${planetA.diameterKm.toLocaleString()} km) is ${invRatio}× smaller in diameter than ${planetB.name} (${planetB.diameterKm.toLocaleString()} km), illustrating the dramatic boundary between inner terrestrial bodies and outer giants.`,
        badge: `1/${invRatio} Scale`,
      });
    }

    // 3. Orbital Year & Heliocentric Spacing
    const yearRatio = Number((planetA.orbitalPeriodDays / planetB.orbitalPeriodDays).toFixed(2));
    if (yearRatio > 1.2) {
      insights.push({
        headline: `Extended Heliocentric Orbital Revolution`,
        category: 'Orbital',
        description: `A single orbital year on ${planetA.name} equals ${yearRatio}× the annual period of ${planetB.name}. Governed by Kepler's Third Law (P² = a³), ${planetA.name} orbits at an average distance of ${planetA.distanceFromSunAU} AU compared to ${planetB.name}'s ${planetB.distanceFromSunAU} AU.`,
        badge: `${yearRatio}× Orbital Period`,
      });
    } else if (yearRatio < 0.8) {
      const invYear = Number((planetB.orbitalPeriodDays / planetA.orbitalPeriodDays).toFixed(2));
      insights.push({
        headline: `Rapid Inner Solar System Orbit`,
        category: 'Orbital',
        description: `${planetA.name} completes an entire revolution around the Sun in only ${(1 / invYear).toFixed(2)}× the time required by ${planetB.name}. For every single orbit of ${planetB.name}, ${planetA.name} completes approximately ${invYear} orbits.`,
        badge: `${invYear}× Faster Orbit`,
      });
    }

    // 4. Thermal Regime
    const tempDelta = Math.abs(planetA.surfaceTempMeanC - planetB.surfaceTempMeanC);
    if (tempDelta > 50) {
      const hotter = planetA.surfaceTempMeanC > planetB.surfaceTempMeanC ? planetA : planetB;
      const colder = planetA.surfaceTempMeanC > planetB.surfaceTempMeanC ? planetB : planetA;
      insights.push({
        headline: `Severe Planetary Thermal Contrast (${tempDelta}°C Delta)`,
        category: 'Thermal',
        description: `${hotter.name} maintains a mean temperature of ${hotter.surfaceTempMeanC}°C, whereas ${colder.name} sustains ${colder.surfaceTempMeanC}°C. This ${tempDelta}°C divergence stems from solar flux dissipation and ${hotter.id === 'venus' ? 'intense atmospheric greenhouse trapping' : 'distance from the Sun'}.`,
        badge: `Δ ${tempDelta}°C`,
      });
    }

    // 5. Day Length (Rotation)
    const dayA = Math.abs(planetA.rotationPeriodHours);
    const dayB = Math.abs(planetB.rotationPeriodHours);
    if (dayA > dayB * 2) {
      insights.push({
        headline: `Prolonged Diurnal Cycle on ${planetA.name}`,
        category: 'Orbital',
        description: `Rotational speed on ${planetA.name} (${dayA.toFixed(1)} hrs per day) is much slower than ${planetB.name} (${dayB.toFixed(1)} hrs). ${planetA.rotationPeriodHours < 0 ? `${planetA.name} also rotates in retrograde.` : ''}`,
        badge: `${(dayA / dayB).toFixed(1)}× Day Length`,
      });
    }

    return insights;
  }
}
