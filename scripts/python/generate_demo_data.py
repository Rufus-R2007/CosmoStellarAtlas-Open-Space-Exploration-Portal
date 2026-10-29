"""
CosmoStellarAtlas — Deterministic Synthetic Demonstration Data Generator
Software Engineering Micro Project | Python Analytical Utilities
Developer: Rufus Samuel R (URK25CS1090) | Institution: Karunya Institute of Technology and Sciences

This utility generates deterministic, scientifically bounded synthetic demonstration data
for academic and classroom demonstrations. It uses a fixed pseudo-random seed to guarantee
100% reproducible output without internet dependencies.
All generated records are explicitly tagged with `source: 'synthetic'` and clearly
distinguished from curated historical records.
"""

import os
import sys
import json
import random
import argparse
from datetime import datetime, timedelta
from typing import List, Dict, Any

# Ensure output directory exists
DEFAULT_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "generated")
os.makedirs(DEFAULT_OUTPUT_DIR, exist_ok=True)

ORBIT_CLASSES = ["Apollo", "Aten", "Amor", "Atira"]
COMPOSITIONS = [
    "Siliceous (S-type, Nickel-Iron Silicate)",
    "Carbonaceous (C-type, Clay & Organics)",
    "Metallic (M-type, Nickel-Iron)",
    "Basaltic Achondrite (V-type, Silicate Vestoid)",
    "Enstatite Chondrite (E-type, High-temperature mineral)",
]
AGENCIES = ["NASA", "ESA", "JAXA", "ISRO", "Roscosmos", "CNSA"]
MISSION_TYPES = ["Orbiter", "Lander", "Rover", "Flyby", "Sample Return", "Space Telescope"]
PLANET_TARGETS = ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "moon"]


def generate_synthetic_asteroids(count: int = 15, seed: int = 42) -> List[Dict[str, Any]]:
    """
    Generates a list of deterministic synthetic Near-Earth Objects.
    Each record contains rigorous physical, orbital, and risk fields matching the Asteroid interface.
    """
    rng = random.Random(seed)
    synthetic_records: List[Dict[str, Any]] = []
    base_date = datetime(2026, 10, 1)

    for i in range(1, count + 1):
        year_offset = rng.randint(0, 9)
        day_offset = rng.randint(1, 360)
        approach_date = (base_date + timedelta(days=year_offset * 365 + day_offset)).strftime("%Y-%m-%d")

        # Diameter in meters with log-normal tendency: 15m to 750m
        raw_diam = rng.choice([
            rng.randint(15, 60),    # Small Chelyabinsk-scale
            rng.randint(61, 140),   # Medium Tunguska-scale
            rng.randint(141, 380),  # City-killer scale
            rng.randint(381, 750),  # Regional devastation scale
        ])
        min_diam = round(raw_diam * 0.88, 1)
        max_diam = round(raw_diam * 1.15, 1)
        mean_diam = raw_diam

        # Distance in Lunar Distances: 0.15 to 14.5 LD (1 LD = 384,400 km)
        lunar_dist = round(rng.uniform(0.18, 14.2), 3)
        km_dist = round(lunar_dist * 384400.0)

        # Velocity in km/s: 6.5 to 34.0 km/s
        velocity = round(rng.uniform(7.2, 32.8), 2)
        orbit_class = rng.choice(ORBIT_CLASSES)
        is_pha = (raw_diam >= 140) and (lunar_dist <= 19.5)
        risk_idx = round(min(10.0, (raw_diam / 80.0) * (velocity / 12.0) * (1.0 / max(0.5, lunar_dist))), 1)
        comp = rng.choice(COMPOSITIONS)

        designation_num = f"{i:03d}"
        approach_year = approach_date[:4]
        synthetic_id = f"sim-{approach_year}-{designation_num}"

        record = {
            "id": synthetic_id,
            "name": f"SIM-{approach_year} #{designation_num}",
            "designation": f"SIM-{approach_year}-{designation_num}",
            "estimatedDiameterMeters": raw_diam,
            "estimatedDiameterMinM": min_diam,
            "estimatedDiameterMaxM": max_diam,
            "estimatedDiameterMeanM": mean_diam,
            "isPotentiallyHazardous": is_pha,
            "closeApproachDate": approach_date,
            "missDistanceKm": km_dist,
            "missDistanceLunar": lunar_dist,
            "relativeVelocityKmS": velocity,
            "orbitClass": orbit_class,
            "simulatedRiskIndex": risk_idx,
            "composition": comp,
            "estimatedComposition": comp,
            "syntheticCategory": "Synthetic Demonstration Encounter",
            "observationCategory": f"Near-Earth Object ({orbit_class})",
            "syntheticClassification": "Synthetic Analytical Model",
            "scenarioDescription": (
                f"Deterministically modeled {raw_diam}m {orbit_class} close-approach passing at {lunar_dist} LD "
                f"({km_dist:,.0f} km) on {approach_date}."
            ),
            "description": (
                f"Synthetic demonstration record #{designation_num} initialized for student orbital geometry "
                f"and planetary defense calculation drills."
            ),
            "educationalNotes": (
                f"Illustrates {orbit_class} orbital encounter dynamics with a calculated relative velocity "
                f"of {velocity} km/s."
            ),
            "dataStatus": "Synthetic Demonstration Record",
            "datasetReferenceDate": "2026-10-01",
            "source": "synthetic",
        }
        synthetic_records.append(record)

    return synthetic_records


def generate_synthetic_missions(count: int = 5, seed: int = 42) -> List[Dict[str, Any]]:
    """
    Generates synthetic exploratory mission plans for illustrative classroom scenarios.
    """
    rng = random.Random(seed + 100)
    missions: List[Dict[str, Any]] = []

    for i in range(1, count + 1):
        year = rng.randint(2028, 2038)
        agency = rng.choice(AGENCIES)
        target = rng.choice(PLANET_TARGETS)
        m_type = rng.choice(MISSION_TYPES)
        code = f"SYNTH-EXP-{year}-{i:02d}"

        mission = {
            "id": code.lower(),
            "name": f"Project Aether {i} ({code})",
            "agency": agency,
            "launchYear": year,
            "launchDate": f"{year}-{rng.randint(1, 12):02d}-{rng.randint(1, 28):02d}",
            "status": "Planned",
            "destinationPlanetId": target,
            "destinationName": target.capitalize(),
            "missionType": m_type,
            "description": (
                f"Illustrative conceptual mission studying {target.capitalize()} via {m_type} architecture. "
                "Generated for future mission trajectory simulation."
            ),
            "objectives": [
                f"Simulate interplanetary transfer window to {target.capitalize()}",
                "Evaluate autonomous aerobraking and orbital insertion profiles",
                "Model multi-spectral surface composition mapping",
            ],
            "achievements": [
                "Preliminary concept architecture reviewed",
                "Demonstration orbital trajectory synthesized",
            ],
            "spacecraftDetails": {
                "name": f"Aether-{i} Deep Space Vehicle",
                "type": f"Advanced {m_type} Bus",
                "massKg": rng.randint(850, 4200),
                "launchVehicle": "Next-Gen Commercial Heavy Lifter",
                "powerSource": "Next-Gen Solar Concentrator Array / RTG Auxiliary",
                "operatingEnvironment": f"{target.capitalize()} Orbit / Vicinity",
                "instruments": ["Multispectral Imager", "Laser Altimeter", "Magnetometer Suite"],
            },
            "outcome": "Demonstration simulation profile ready for orbital analysis.",
            "source": "synthetic",
        }
        missions.append(mission)

    return missions


def main():
    parser = argparse.ArgumentParser(description="CosmoStellarAtlas Synthetic Demo Data Generator")
    parser.add_argument("--seed", type=int, default=42, help="Fixed pseudo-random seed for reproducibility")
    parser.add_argument("--asteroid-count", type=int, default=15, help="Number of synthetic asteroids to generate")
    parser.add_argument("--mission-count", type=int, default=5, help="Number of synthetic missions to generate")
    parser.add_argument("--output-dir", type=str, default=DEFAULT_OUTPUT_DIR, help="Target JSON directory")
    parser.add_argument("--quiet", action="store_true", help="Suppress console summary")

    args = parser.parse_args()
    os.makedirs(args.output_dir, exist_ok=True)

    asteroids = generate_synthetic_asteroids(count=args.asteroid_count, seed=args.seed)
    missions = generate_synthetic_missions(count=args.mission_count, seed=args.seed)

    ast_path = os.path.join(args.output_dir, "synthetic_asteroids.json")
    mis_path = os.path.join(args.output_dir, "synthetic_missions.json")

    with open(ast_path, "w", encoding="utf-8") as f:
        json.dump(asteroids, f, indent=2)

    with open(mis_path, "w", encoding="utf-8") as f:
        json.dump(missions, f, indent=2)

    if not args.quiet:
        print("\n=======================================================")
        print("  COSMOSTELLARATLAS // SYNTHETIC DATA GENERATOR        ")
        print("=======================================================")
        print(f"Random Seed            : {args.seed} (Deterministic)")
        print(f"Synthetic Asteroids    : {len(asteroids)} records generated -> {ast_path}")
        print(f"Synthetic Missions     : {len(missions)} records generated -> {mis_path}")
        print("Provenance Guarantee   : All records tagged with source='synthetic'")
        print("Historical Safety      : Zero curated records overwritten")
        print("=======================================================\n")


if __name__ == "__main__":
    main()

