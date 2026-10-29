"""
CosmoStellarAtlas — Dataset Statistical Profiler & Metrics Engine
Software Engineering Micro Project | Python Analytical Utilities
Developer: Rufus Samuel R (URK25CS1090) | Institution: Karunya Institute of Technology and Sciences

This utility profiles and computes statistical distributions across all CosmoStellarAtlas
scientific and demonstration datasets. It outputs summary analytics in the terminal
and can export structured JSON telemetry reports for academic records.
"""

import os
import sys
import json
import argparse
from typing import Dict, Any, List
from collections import Counter

BASE_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../src/data/json"))
DEFAULT_EXPORT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "generated/dataset_statistics_report.json"))


def load_json(data_dir: str, filename: str) -> List[Dict[str, Any]]:
    path = os.path.join(data_dir, f"{filename}.json")
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        return data if isinstance(data, list) else []


def analyze_datasets(data_dir: str = BASE_DATA_DIR) -> Dict[str, Any]:
    planets = load_json(data_dir, "planets")
    missions = load_json(data_dir, "missions")
    rovers = load_json(data_dir, "rovers")
    rover_images = load_json(data_dir, "roverImages")
    rover_cameras = load_json(data_dir, "roverCameras")
    rover_waypoints = load_json(data_dir, "roverWaypoints")
    asteroids = load_json(data_dir, "asteroids")
    launches = load_json(data_dir, "launches")
    learning_trails = load_json(data_dir, "learningTrails")

    # 1. Planetary analysis
    planet_types = Counter(p.get("type", "Unknown") for p in planets)
    avg_planet_diam = (
        round(sum(p.get("diameterKm", 0) for p in planets) / len(planets), 1)
        if planets else 0
    )

    # 2. Mission analysis
    decades = Counter()
    destinations = Counter()
    agencies = Counter()
    mission_types = Counter()

    for m in missions:
        yr = m.get("launchYear", 0)
        dec = f"{(yr // 10) * 10}s"
        decades[dec] += 1
        dest = m.get("destinationName") or m.get("destinationPlanetId", "Unknown")
        destinations[dest] += 1
        agencies[m.get("agency", "Unknown")] += 1
        mission_types[m.get("missionType", "Unknown")] += 1

    # 3. Asteroid analysis
    orbit_classes = Counter()
    size_bins = {"<50m (Chelyabinsk-Scale)": 0, "50-140m (Tunguska-Scale)": 0, "140-500m (City-Killer)": 0, ">500m (Regional Impact)": 0}
    sources = Counter()
    pha_count = 0

    diameters = []
    velocities = []

    for a in asteroids:
        orbit_classes[a.get("orbitClass", "Unknown")] += 1
        sources[a.get("source", "curated")] += 1
        if a.get("isPotentiallyHazardous", False):
            pha_count += 1
        diam = a.get("estimatedDiameterMeters", 0)
        vel = a.get("relativeVelocityKmS", 0)
        diameters.append(diam)
        velocities.append(vel)

        if diam < 50:
            size_bins["<50m (Chelyabinsk-Scale)"] += 1
        elif diam < 140:
            size_bins["50-140m (Tunguska-Scale)"] += 1
        elif diam <= 500:
            size_bins["140-500m (City-Killer)"] += 1
        else:
            size_bins[">500m (Regional Impact)"] += 1

    avg_ast_diam = round(sum(diameters) / len(diameters), 1) if diameters else 0
    avg_ast_vel = round(sum(velocities) / len(velocities), 2) if velocities else 0

    # 4. Curriculum analysis
    total_lessons = sum(len(t.get("lessons", [])) for t in learning_trails)
    total_quiz_questions = sum(
        len(t.get("quiz", [])) if isinstance(t.get("quiz"), list)
        else len(t.get("quiz", {}).get("questions", []))
        for t in learning_trails
    )

    # 5. Completeness Score
    datasets_checked = [
        ("planets", len(planets) == 8),
        ("missions", len(missions) >= 20),
        ("rovers", len(rovers) == 5),
        ("roverImages", len(rover_images) >= 24),
        ("roverCameras", len(rover_cameras) >= 20),
        ("roverWaypoints", len(rover_waypoints) >= 23),
        ("asteroids", len(asteroids) >= 50),
        ("learningTrails", len(learning_trails) == 4),
    ]
    completeness_score = round((sum(1 for _, ok in datasets_checked if ok) / len(datasets_checked)) * 100, 1)

    return {
        "metadata": {
            "project": "CosmoStellarAtlas — Open Space Exploration Portal",
            "developer": "Rufus Samuel R (URK25CS1090)",
            "institution": "Karunya Institute of Technology and Sciences",
            "completenessScorePercent": completeness_score,
        },
        "planetary_statistics": {
            "totalPlanetsCataloged": len(planets),
            "typeDistribution": dict(planet_types),
            "averageDiameterKm": avg_planet_diam,
        },
        "mission_heritage_statistics": {
            "totalMissions": len(missions),
            "distributionByDecade": dict(sorted(decades.items())),
            "distributionByDestination": dict(destinations.most_common(6)),
            "distributionByAgency": dict(agencies.most_common(6)),
            "distributionByArchitecture": dict(mission_types),
        },
        "surface_exploration_statistics": {
            "totalMarsRovers": len(rovers),
            "totalRoverImages": len(rover_images),
            "totalCameraSubsystems": len(rover_cameras),
            "totalTraverseWaypoints": len(rover_waypoints),
        },
        "planetary_defense_statistics": {
            "totalNearEarthObjects": len(asteroids),
            "sourceBreakdown": dict(sources),
            "potentiallyHazardousCount": pha_count,
            "orbitClassDistribution": dict(orbit_classes),
            "diameterSizeDistribution": size_bins,
            "averageDiameterMeters": avg_ast_diam,
            "averageVelocityKmS": avg_ast_vel,
        },
        "learning_hub_statistics": {
            "totalCurriculumTrails": len(learning_trails),
            "totalModularLessons": total_lessons,
            "totalQuizCertificationQuestions": total_quiz_questions,
        },
    }


def print_report(stats: Dict[str, Any]):
    meta = stats["metadata"]
    planets = stats["planetary_statistics"]
    missions = stats["mission_heritage_statistics"]
    surface = stats["surface_exploration_statistics"]
    neo = stats["planetary_defense_statistics"]
    edu = stats["learning_hub_statistics"]

    print("\n=======================================================")
    print("  COSMOSTELLARATLAS // DATASET STATISTICAL REPORT      ")
    print("=======================================================")
    print(f"Developer         : {meta['developer']}")
    print(f"Institution       : {meta['institution']}")
    print(f"Completeness Score: {meta['completenessScorePercent']}%")
    print("-------------------------------------------------------")
    print("1. PLANETARY SCIENCE DOMAIN:")
    print(f"   - Cataloged Worlds : {planets['totalPlanetsCataloged']} major planets")
    print(f"   - Average Diameter : {planets['averageDiameterKm']:,} km")
    print(f"   - Class Breakdown  : {planets['typeDistribution']}")

    print("\n2. HISTORICAL MISSION HERITAGE:")
    print(f"   - Total Missions   : {missions['totalMissions']}")
    print(f"   - By Decade        : {missions['distributionByDecade']}")
    print(f"   - Leading Agencies : {missions['distributionByAgency']}")

    print("\n3. SURFACE OPERATIONS (MARS ROVERS):")
    print(f"   - Explorer Rovers  : {surface['totalMarsRovers']}")
    print(f"   - High-Res Images  : {surface['totalRoverImages']}")
    print(f"   - Camera Subsystems: {surface['totalCameraSubsystems']}")
    print(f"   - Traverse Points  : {surface['totalTraverseWaypoints']}")

    print("\n4. PLANETARY DEFENSE & NEAR-EARTH OBJECTS:")
    print(f"   - Total Objects    : {neo['totalNearEarthObjects']}")
    print(f"   - Provenance Split : {neo['sourceBreakdown']}")
    print(f"   - Potentially Haz. : {neo['potentiallyHazardousCount']} objects")
    print(f"   - Size Breakdown   : {neo['diameterSizeDistribution']}")
    print(f"   - Average Velocity : {neo['averageVelocityKmS']} km/s")

    print("\n5. INTERACTIVE LEARNING HUB & CURRICULUM:")
    print(f"   - Curriculum Trails: {edu['totalCurriculumTrails']}")
    print(f"   - Modular Lessons  : {edu['totalModularLessons']}")
    print(f"   - Quiz Questions   : {edu['totalQuizCertificationQuestions']}")
    print("=======================================================\n")


def main():
    parser = argparse.ArgumentParser(description="CosmoStellarAtlas Dataset Statistical Profiler")
    parser.add_argument("--data-dir", type=str, default=BASE_DATA_DIR, help="Path to JSON dataset directory")
    parser.add_argument("--export", type=str, default=DEFAULT_EXPORT_PATH, help="Export path for JSON statistics report")
    parser.add_argument("--no-export", action="store_true", help="Do not write export file")

    args = parser.parse_args()
    stats = analyze_datasets(data_dir=args.data_dir)
    print_report(stats)

    if not args.no_export and args.export:
        os.makedirs(os.path.dirname(args.export), exist_ok=True)
        with open(args.export, "w", encoding="utf-8") as f:
            json.dump(stats, f, indent=2)
        print(f"[OK] Exported analytical telemetry report to: {args.export}\n")


if __name__ == "__main__":
    main()
