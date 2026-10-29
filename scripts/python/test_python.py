"""
CosmoStellarAtlas — Python Analytical Utilities Test Suite
Software Engineering Micro Project | Python Analytical Utilities
Developer: Rufus Samuel R (URK25CS1090) | Institution: Karunya Institute of Technology and Sciences

Uses Python's standard library `unittest` framework to verify:
  1. Asteroid physics calculations, unit conversions, and boundary conditions
  2. Deterministic synthetic data generator consistency and schema adherence
  3. Dataset validator duplicate detection, range checks, and referential checks
  4. Dataset statistical profiler metric calculations and completeness scoring
"""

import os
import sys
import unittest
import math
import json
import tempfile
import shutil

# Add scripts directory to path
SCRIPTS_DIR = os.path.abspath(os.path.dirname(__file__))
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

from asteroid_physics import (
    calculate_impact_radius,
    calculate_sphere_volume,
    calculate_asteroid_mass,
    calculate_kinetic_energy,
    convert_joules_to_kilotons_tnt,
    convert_joules_to_megatons_tnt,
    simulate_impact,
    compute_scaling_multipliers,
    JOULES_PER_KILOTON_TNT,
    JOULES_PER_MEGATON_TNT,
)
from generate_demo_data import (
    generate_synthetic_asteroids,
    generate_synthetic_missions,
)
from validate_datasets import (
    DatasetValidator,
)
from dataset_statistics import (
    analyze_datasets,
)


class TestAsteroidPhysics(unittest.TestCase):
    """Verifies Newtonian asteroid simulation calculations and parameter boundaries."""

    def test_radius_calculation(self):
        self.assertEqual(calculate_impact_radius(100.0), 50.0)
        self.assertEqual(calculate_impact_radius(0.0), 0.0)
        self.assertEqual(calculate_impact_radius(-50.0), 0.0)
        self.assertEqual(calculate_impact_radius(float("nan")), 0.0)

    def test_sphere_volume(self):
        radius = 10.0
        expected = (4.0 / 3.0) * math.pi * (10.0 ** 3)
        self.assertAlmostEqual(calculate_sphere_volume(radius), expected, places=5)
        self.assertEqual(calculate_sphere_volume(0.0), 0.0)
        self.assertEqual(calculate_sphere_volume(-5.0), 0.0)

    def test_asteroid_mass(self):
        volume = 1000.0
        density = 2500.0
        expected = 2500000.0
        self.assertEqual(calculate_asteroid_mass(volume, density), expected)
        self.assertEqual(calculate_asteroid_mass(0, 2500), 0.0)
        self.assertEqual(calculate_asteroid_mass(1000, -100), 0.0)

    def test_kinetic_energy(self):
        # m = 2,000,000 kg, v = 20 km/s = 20,000 m/s
        # E_k = 0.5 * 2,000,000 * (20,000)^2 = 1,000,000 * 400,000,000 = 4.0e14 Joules
        mass = 2000000.0
        vel_km_s = 20.0
        expected = 4.0e14
        self.assertAlmostEqual(calculate_kinetic_energy(mass, vel_km_s), expected, places=2)
        self.assertEqual(calculate_kinetic_energy(0, 20), 0.0)
        self.assertEqual(calculate_kinetic_energy(1000, -5), 0.0)

    def test_tnt_conversions(self):
        joules_kt = JOULES_PER_KILOTON_TNT * 5.0
        self.assertAlmostEqual(convert_joules_to_kilotons_tnt(joules_kt), 5.0, places=5)

        joules_mt = JOULES_PER_MEGATON_TNT * 12.5
        self.assertAlmostEqual(convert_joules_to_megatons_tnt(joules_mt), 12.5, places=5)

    def test_full_simulation_benchmark(self):
        # 100m diameter, 20 km/s velocity, 2500 kg/m³ density
        res = simulate_impact(100.0, 20.0, 2500.0)
        self.assertTrue(res["valid"])
        props = res["derived_physical_properties"]
        energy = res["energy_calculations"]

        self.assertEqual(props["radius_m"], 50.0)
        self.assertGreater(energy["kinetic_energy_joules"], 2.5e17)
        self.assertGreater(energy["kinetic_energy_megatons_tnt"], 60.0)
        self.assertLess(energy["kinetic_energy_megatons_tnt"], 65.0)

    def test_scaling_laws(self):
        # Doubling diameter must yield ~8x energy (cubic)
        # Doubling velocity must yield ~4x energy (quadratic)
        # Doubling density must yield ~2x energy (linear)
        multipliers = compute_scaling_multipliers(100.0, 20.0, 2500.0)
        self.assertEqual(multipliers["doubling_diameter_multiplier"], 8.0)
        self.assertEqual(multipliers["doubling_velocity_multiplier"], 4.0)
        self.assertEqual(multipliers["doubling_density_multiplier"], 2.0)

    def test_invalid_simulation_inputs(self):
        res = simulate_impact(-100.0, 20.0)
        self.assertFalse(res["valid"])
        self.assertIn("Invalid numerical parameters", res["error"])


class TestGenerateDemoData(unittest.TestCase):
    """Verifies deterministic synthetic data generation and reproducibility."""

    def test_deterministic_reproducibility(self):
        run1 = generate_synthetic_asteroids(count=5, seed=42)
        run2 = generate_synthetic_asteroids(count=5, seed=42)
        self.assertEqual(run1, run2)

    def test_differing_seeds_produce_different_data(self):
        run1 = generate_synthetic_asteroids(count=5, seed=42)
        run2 = generate_synthetic_asteroids(count=5, seed=999)
        self.assertNotEqual(run1[0]["id"], run2[0]["id"])

    def test_synthetic_asteroids_schema(self):
        asteroids = generate_synthetic_asteroids(count=3, seed=123)
        self.assertEqual(len(asteroids), 3)
        for a in asteroids:
            self.assertEqual(a["source"], "synthetic")
            self.assertIn("id", a)
            self.assertIn("name", a)
            self.assertIn("estimatedDiameterMeters", a)
            self.assertGreater(a["estimatedDiameterMeters"], 0)
            self.assertIn("orbitClass", a)
            self.assertIn(a["orbitClass"], ["Apollo", "Aten", "Amor", "Atira"])

    def test_synthetic_missions_schema(self):
        missions = generate_synthetic_missions(count=2, seed=42)
        self.assertEqual(len(missions), 2)
        for m in missions:
            self.assertEqual(m["source"], "synthetic")
            self.assertIn("id", m)
            self.assertIn("agency", m)
            self.assertIn("launchYear", m)
            self.assertGreaterEqual(m["launchYear"], 2028)


class TestValidateDatasets(unittest.TestCase):
    """Verifies dataset validator behavior, error traps, and duplicate checks."""

    def test_validator_against_actual_project_datasets(self):
        validator = DatasetValidator()
        passed = validator.run_all()
        self.assertTrue(passed)
        self.assertEqual(len(validator.errors), 0)

    def test_duplicate_id_detection(self):
        validator = DatasetValidator()
        sample_records = [
            {"id": "mars-01", "name": "Test 1"},
            {"id": "mars-02", "name": "Test 2"},
            {"id": "mars-01", "name": "Test 3 Duplicate"},
        ]
        validator.check_duplicate_ids("test_dataset", sample_records)
        self.assertTrue(any("duplicate IDs" in err for err in validator.errors))

    def test_invalid_range_detection(self):
        validator = DatasetValidator()
        invalid_planets = [
            {
                "id": "test-planet",
                "name": "Invalid Planet",
                "orderFromSun": 99,  # Invalid
                "type": "Terrestrial",
                "diameterKm": -500,   # Invalid
                "distanceFromSunAU": 1.0,
                "gravityMs2": 9.8,
                "orbitalPeriodDays": 365,
                "summary": "Test",
                "relatedMissionIds": [],
            }
        ]
        validator.validate_planets(invalid_planets)
        self.assertGreater(len(validator.errors), 0)


class TestDatasetStatistics(unittest.TestCase):
    """Verifies dataset statistical aggregation and completeness scoring."""

    def test_statistics_aggregation(self):
        stats = analyze_datasets()
        meta = stats["metadata"]
        planets = stats["planetary_statistics"]
        missions = stats["mission_heritage_statistics"]
        surface = stats["surface_exploration_statistics"]
        neo = stats["planetary_defense_statistics"]
        edu = stats["learning_hub_statistics"]

        self.assertEqual(meta["completenessScorePercent"], 100.0)
        self.assertEqual(planets["totalPlanetsCataloged"], 8)
        self.assertEqual(missions["totalMissions"], 20)
        self.assertEqual(surface["totalMarsRovers"], 5)
        self.assertEqual(neo["totalNearEarthObjects"], 50)
        self.assertEqual(edu["totalCurriculumTrails"], 4)
        self.assertEqual(edu["totalModularLessons"], 12)
        self.assertEqual(edu["totalQuizCertificationQuestions"], 24)


if __name__ == "__main__":
    unittest.main()
