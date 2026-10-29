"""
CosmoStellarAtlas — Dataset Integrity & Cross-Reference Validator
Software Engineering Micro Project | Python Analytical Utilities
Developer: Rufus Samuel R (URK25CS1090) | Institution: Karunya Institute of Technology and Sciences

This utility parses and validates all CosmoStellarAtlas project datasets against
strict schema definitions, verifying data types, required fields, numerical bounds,
date formats, cross-entity relational referential integrity, and absence of duplicate IDs.
Exits with code 0 on successful validation, or code 1 if critical schema or referential errors occur.
"""

import os
import sys
import json
import re
import argparse
from datetime import datetime
from typing import List, Dict, Any, Set, Tuple

BASE_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../src/data/json"))

DATE_REGEX = re.compile(r"^\d{4}-\d{2}-\d{2}$")


class DatasetValidator:
    def __init__(self, data_dir: str = BASE_DATA_DIR):
        self.data_dir = data_dir
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.datasets: Dict[str, Any] = {}
        self.stats: Dict[str, int] = {}

    def load_dataset(self, name: str) -> List[Dict[str, Any]]:
        file_path = os.path.join(self.data_dir, f"{name}.json")
        if not os.path.exists(file_path):
            self.errors.append(f"Missing required dataset file: {file_path}")
            return []
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if not isinstance(data, list):
                    self.errors.append(f"Dataset {name} must be a JSON array, got {type(data).__name__}")
                    return []
                self.datasets[name] = data
                self.stats[name] = len(data)
                return data
        except Exception as e:
            self.errors.append(f"Failed to load JSON dataset {name}: {str(e)}")
            return []

    def check_duplicate_ids(self, dataset_name: str, records: List[Dict[str, Any]]) -> Set[str]:
        seen: Set[str] = set()
        duplicates: Set[str] = set()
        for idx, rec in enumerate(records):
            rec_id = rec.get("id")
            if not rec_id:
                self.errors.append(f"[{dataset_name}] Record at index {idx} has missing or empty 'id'")
            elif rec_id in seen:
                duplicates.add(rec_id)
            else:
                seen.add(rec_id)
        if duplicates:
            self.errors.append(f"[{dataset_name}] Found duplicate IDs: {list(duplicates)}")
        return seen

    def validate_planets(self, planets: List[Dict[str, Any]]):
        required_fields = [
            "id", "name", "orderFromSun", "type", "diameterKm",
            "distanceFromSunAU", "gravityMs2", "orbitalPeriodDays",
            "summary", "relatedMissionIds"
        ]
        valid_types = {"Terrestrial", "Gas Giant", "Ice Giant", "Dwarf"}

        if len(planets) != 8:
            self.warnings.append(f"[Planets] Expected exactly 8 major planets, found {len(planets)}")

        orders_seen = set()
        for p in planets:
            p_id = p.get("id", "UNKNOWN")
            for req in required_fields:
                if req not in p or p[req] is None:
                    self.errors.append(f"[Planets:{p_id}] Missing required field '{req}'")

            # Types and bounds
            if p.get("type") not in valid_types:
                self.errors.append(f"[Planets:{p_id}] Invalid planetary type '{p.get('type')}'")

            order = p.get("orderFromSun")
            if not isinstance(order, int) or order < 1 or order > 8:
                self.errors.append(f"[Planets:{p_id}] orderFromSun must be an integer between 1 and 8 (got {order})")
            else:
                orders_seen.add(order)

            diam = p.get("diameterKm")
            if not isinstance(diam, (int, float)) or diam <= 0:
                self.errors.append(f"[Planets:{p_id}] diameterKm must be positive number (got {diam})")

            grav = p.get("gravityMs2")
            if not isinstance(grav, (int, float)) or grav <= 0:
                self.errors.append(f"[Planets:{p_id}] gravityMs2 must be positive number (got {grav})")

            # Check atmosphere percentage sum if present
            atm = p.get("atmosphereComposition", [])
            if atm and isinstance(atm, list):
                total_pct = sum(item.get("percentage", 0) for item in atm if isinstance(item, dict))
                if total_pct > 105.0:
                    self.warnings.append(f"[Planets:{p_id}] Atmosphere percentages sum to {total_pct:.1f}% (>105%)")

    def validate_missions(self, missions: List[Dict[str, Any]]):
        required_fields = [
            "id", "name", "agency", "launchYear", "launchDate",
            "status", "destinationPlanetId", "missionType", "description"
        ]
        valid_statuses = {"Active", "Completed", "Operational", "Planned", "En Route", "Concluded"}

        for m in missions:
            m_id = m.get("id", "UNKNOWN")
            for req in required_fields:
                if req not in m or m[req] is None:
                    self.errors.append(f"[Missions:{m_id}] Missing required field '{req}'")

            # Status check
            status = m.get("status")
            if status not in valid_statuses:
                self.warnings.append(f"[Missions:{m_id}] Unconventional status '{status}'")

            # Year check
            year = m.get("launchYear")
            if not isinstance(year, int) or year < 1950 or year > 2100:
                self.errors.append(f"[Missions:{m_id}] launchYear must be an integer between 1950 and 2100 (got {year})")

            # Launch date check
            date_str = m.get("launchDate")
            if date_str and not DATE_REGEX.match(date_str):
                self.errors.append(f"[Missions:{m_id}] launchDate '{date_str}' is not in YYYY-MM-DD format")

    def validate_rovers(self, rovers: List[Dict[str, Any]]):
        required_fields = [
            "id", "name", "status", "landingDate", "landingSite",
            "totalSols", "instruments", "specifications"
        ]
        for r in rovers:
            r_id = r.get("id", "UNKNOWN")
            for req in required_fields:
                if req not in r or r[req] is None:
                    self.errors.append(f"[Rovers:{r_id}] Missing required field '{req}'")

            date_str = r.get("landingDate")
            if date_str and not DATE_REGEX.match(date_str):
                self.errors.append(f"[Rovers:{r_id}] landingDate '{date_str}' is not in YYYY-MM-DD format")

            instruments = r.get("instruments", [])
            if not isinstance(instruments, list) or len(instruments) == 0:
                self.errors.append(f"[Rovers:{r_id}] instruments list must not be empty")

    def validate_asteroids(self, asteroids: List[Dict[str, Any]]):
        required_fields = [
            "id", "name", "estimatedDiameterMeters", "isPotentiallyHazardous",
            "closeApproachDate", "missDistanceKm", "relativeVelocityKmS", "orbitClass"
        ]
        valid_orbit_classes = {"Apollo", "Aten", "Amor", "Atira", "Main Belt", "Other"}

        synthetic_count = 0
        curated_count = 0

        for a in asteroids:
            a_id = a.get("id", "UNKNOWN")
            for req in required_fields:
                if req not in a or a[req] is None:
                    self.errors.append(f"[Asteroids:{a_id}] Missing required field '{req}'")

            orbit_class = a.get("orbitClass")
            if orbit_class not in valid_orbit_classes:
                self.errors.append(f"[Asteroids:{a_id}] Invalid orbitClass '{orbit_class}'")

            diam = a.get("estimatedDiameterMeters")
            if not isinstance(diam, (int, float)) or diam <= 0:
                self.errors.append(f"[Asteroids:{a_id}] estimatedDiameterMeters must be > 0 (got {diam})")

            dist = a.get("missDistanceKm")
            if not isinstance(dist, (int, float)) or dist <= 0:
                self.errors.append(f"[Asteroids:{a_id}] missDistanceKm must be > 0 (got {dist})")

            vel = a.get("relativeVelocityKmS")
            if not isinstance(vel, (int, float)) or vel <= 0:
                self.errors.append(f"[Asteroids:{a_id}] relativeVelocityKmS must be > 0 (got {vel})")

            src = a.get("source", "")
            if src == "synthetic":
                synthetic_count += 1
            else:
                curated_count += 1

        if synthetic_count == 0:
            self.warnings.append("[Asteroids] No records labeled with source='synthetic'")
        if curated_count == 0:
            self.warnings.append("[Asteroids] No records labeled as curated reference")

    def validate_learning_trails(self, trails: List[Dict[str, Any]]):
        required_trail_fields = ["id", "title", "category", "lessons", "quiz", "passingScorePercent"]
        for t in trails:
            t_id = t.get("id", "UNKNOWN")
            for req in required_trail_fields:
                if req not in t or t[req] is None:
                    self.errors.append(f"[LearningTrails:{t_id}] Missing required field '{req}'")

            lessons = t.get("lessons", [])
            if not isinstance(lessons, list) or len(lessons) == 0:
                self.errors.append(f"[LearningTrails:{t_id}] Must contain at least one lesson")

            quiz = t.get("quiz")
            questions = quiz if isinstance(quiz, list) else (quiz.get("questions", []) if isinstance(quiz, dict) else [])
            if not isinstance(questions, list) or len(questions) < 4:
                self.errors.append(f"[LearningTrails:{t_id}] Quiz must have at least 4 questions (got {len(questions)})")
            for q in questions:
                opts = q.get("options", [])
                c_idx = q.get("correctAnswerIndex") if "correctAnswerIndex" in q else q.get("correctOptionIndex")
                if not isinstance(c_idx, int) or c_idx < 0 or c_idx >= len(opts):
                    self.errors.append(f"[LearningTrails:{t_id}:Quiz] Question {q.get('id')} has invalid correctAnswerIndex {c_idx}")

    def validate_cross_references(self):
        planets = self.datasets.get("planets", [])
        missions = self.datasets.get("missions", [])

        planet_ids = {p.get("id") for p in planets if p.get("id")}
        mission_ids = {m.get("id") for m in missions if m.get("id")}

        # Check mission destination IDs
        special_destinations = {
            "earth", "moon", "sun", "outer solar system", "outer-solar-system",
            "deep space", "deep-space", "heliosphere", "interstellar space", "interstellar-space"
        }

        for m in missions:
            dest = m.get("destinationPlanetId", "").lower()
            if dest and dest not in planet_ids and dest not in special_destinations:
                self.warnings.append(f"[Cross-Reference] Mission '{m.get('id')}' references unrecognized destinationPlanetId '{dest}'")

        # Check planet related mission IDs
        for p in planets:
            for m_ref in p.get("relatedMissionIds", []):
                if m_ref not in mission_ids:
                    self.warnings.append(f"[Cross-Reference] Planet '{p.get('id')}' references non-existent mission '{m_ref}'")

    def run_all(self) -> bool:
        print("\n=======================================================")
        print("  COSMOSTELLARATLAS // DATASET INTEGRITY VALIDATOR     ")
        print("=======================================================")
        print(f"Dataset Directory : {self.data_dir}\n")

        datasets_to_load = [
            "planets", "missions", "rovers", "roverImages",
            "roverCameras", "roverWaypoints", "asteroids",
            "launches", "learningTrails"
        ]

        for name in datasets_to_load:
            records = self.load_dataset(name)
            if records:
                self.check_duplicate_ids(name, records)
                print(f"Loaded {name:<16}: {len(records):>3} records [OK]")

        # Run domain validations
        if "planets" in self.datasets:
            self.validate_planets(self.datasets["planets"])
        if "missions" in self.datasets:
            self.validate_missions(self.datasets["missions"])
        if "rovers" in self.datasets:
            self.validate_rovers(self.datasets["rovers"])
        if "asteroids" in self.datasets:
            self.validate_asteroids(self.datasets["asteroids"])
        if "learningTrails" in self.datasets:
            self.validate_learning_trails(self.datasets["learningTrails"])

        self.validate_cross_references()

        print("\n-------------------------------------------------------")
        print(f"Validation Errors : {len(self.errors)}")
        print(f"Validation Warnings: {len(self.warnings)}")
        print("-------------------------------------------------------")

        if self.errors:
            print("\n[CRITICAL ERRORS FOUND]:")
            for err in self.errors:
                print(f"  [X] {err}")

        if self.warnings:
            print("\n[INFORMATIONAL NOTICES]:")
            for warn in self.warnings:
                print(f"  [!] {warn}")

        if not self.errors:
            print("\n[OK] ALL DATASETS PASSED SCIENTIFIC & SCHEMA INTEGRITY VALIDATION.")
            print("=======================================================\n")
            return True
        else:
            print("\n[FAIL] DATASET VALIDATION FAILED. Rectify critical errors before release.")
            print("=======================================================\n")
            return False


def main():
    parser = argparse.ArgumentParser(description="CosmoStellarAtlas Dataset Integrity Validator")
    parser.add_argument("--data-dir", type=str, default=BASE_DATA_DIR, help="Path to JSON dataset directory")
    args = parser.parse_args()

    validator = DatasetValidator(data_dir=args.data_dir)
    success = validator.run_all()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
