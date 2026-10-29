/**
 * CosmoStellarAtlas — Dataset JSON Exporter
 * Bridges TypeScript data definitions to canonical JSON files
 * for Python analytical utilities, data validation, and statistics scripts.
 */

import fs from 'fs';
import path from 'path';
import { planetsData } from '../src/data/planets';
import { missionsData } from '../src/data/missions';
import { roversData } from '../src/data/rovers';
import { roverImagesData } from '../src/data/roverImages';
import { roverCamerasData } from '../src/data/roverCameras';
import { roverWaypointsData } from '../src/data/roverWaypoints';
import { asteroidsData } from '../src/data/asteroids';
import { launchesData } from '../src/data/launches';
import { learningTrails } from '../src/data/learningTrails';

const TARGET_DIR = path.resolve(__dirname, '../src/data/json');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const datasets: Record<string, unknown> = {
  planets: planetsData,
  missions: missionsData,
  rovers: roversData,
  roverImages: roverImagesData,
  roverCameras: roverCamerasData,
  roverWaypoints: roverWaypointsData,
  asteroids: asteroidsData,
  launches: launchesData,
  learningTrails: learningTrails,
};

console.log('Exporting datasets to JSON...');
for (const [name, data] of Object.entries(datasets)) {
  const filePath = path.join(TARGET_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✓ ${name}.json -> ${(data as unknown[]).length ?? Object.keys(data as object).length} items`);
}
console.log('Export complete.');

