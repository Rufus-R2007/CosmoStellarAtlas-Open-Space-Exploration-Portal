"""
CosmoStellarAtlas — Asteroid Simulation & Impact Physics Reference Engine
Software Engineering Micro Project | Python Analytical Utilities
Developer: Rufus Samuel R (URK25CS1090) | Institution: Karunya Institute of Technology and Sciences

This module provides a pure standard-library Python reference implementation of classical
Newtonian impact physics for Near-Earth Object (NEO) analysis.
Formulas:
  1. Impact Radius: r = d / 2  (meters)
  2. Spherical Volume: V = (4/3) * π * r³  (m³)
  3. Estimated Mass: m = ρ * V  (kg)
  4. Velocity Conversion: v_ms = v_kms * 1000  (m/s)
  5. Kinetic Energy: E_k = 0.5 * m * (v_ms)²  (Joules)
  6. TNT Conversions:
       1 Kiloton TNT = 4.184 × 10¹² Joules
       1 Megaton TNT = 4.184 × 10¹⁵ Joules
"""

import math
import argparse
import json
from typing import Dict, Any, Tuple

# Physical & Conversion Constants
JOULES_PER_KILOTON_TNT = 4.184e12
JOULES_PER_MEGATON_TNT = 4.184e15
KM_PER_LUNAR_DISTANCE = 384400.0  # Average geocentric lunar distance
DEFAULT_DENSITY_KG_M3 = 2500.0   # S-type silicate asteroid default bulk density


def calculate_impact_radius(diameter_m: float) -> float:
    """Calculates asteroid radius in meters from diameter."""
    if not isinstance(diameter_m, (int, float)) or math.isnan(diameter_m) or diameter_m <= 0:
        return 0.0
    return float(diameter_m) / 2.0


def calculate_sphere_volume(radius_m: float) -> float:
    """Calculates spherical volume in cubic meters: V = (4/3) * π * r³."""
    if not isinstance(radius_m, (int, float)) or math.isnan(radius_m) or radius_m <= 0:
        return 0.0
    return (4.0 / 3.0) * math.pi * (float(radius_m) ** 3)


def calculate_asteroid_mass(volume_m3: float, density_kg_m3: float = DEFAULT_DENSITY_KG_M3) -> float:
    """Calculates asteroid mass in kilograms: m = ρ * V."""
    if (
        not isinstance(volume_m3, (int, float))
        or not isinstance(density_kg_m3, (int, float))
        or math.isnan(volume_m3)
        or math.isnan(density_kg_m3)
        or volume_m3 <= 0
        or density_kg_m3 <= 0
    ):
        return 0.0
    return float(volume_m3) * float(density_kg_m3)


def convert_velocity_km_s_to_m_s(velocity_km_s: float) -> float:
    """Converts velocity from km/s to m/s."""
    if not isinstance(velocity_km_s, (int, float)) or math.isnan(velocity_km_s) or velocity_km_s < 0:
        return 0.0
    return float(velocity_km_s) * 1000.0


def calculate_kinetic_energy(mass_kg: float, velocity_km_s: float) -> float:
    """Calculates classical kinetic energy in Joules: E_k = 0.5 * m * v²."""
    if (
        not isinstance(mass_kg, (int, float))
        or not isinstance(velocity_km_s, (int, float))
        or math.isnan(mass_kg)
        or math.isnan(velocity_km_s)
        or mass_kg <= 0
        or velocity_km_s <= 0
    ):
        return 0.0
    v_ms = convert_velocity_km_s_to_m_s(velocity_km_s)
    return 0.5 * float(mass_kg) * (v_ms ** 2)


def convert_joules_to_kilotons_tnt(joules: float) -> float:
    """Converts Joules to Kilotons of TNT equivalent."""
    if not isinstance(joules, (int, float)) or math.isnan(joules) or joules <= 0:
        return 0.0
    return float(joules) / JOULES_PER_KILOTON_TNT


def convert_joules_to_megatons_tnt(joules: float) -> float:
    """Converts Joules to Megatons of TNT equivalent."""
    if not isinstance(joules, (int, float)) or math.isnan(joules) or joules <= 0:
        return 0.0
    return float(joules) / JOULES_PER_MEGATON_TNT


def simulate_impact(
    diameter_m: float,
    velocity_km_s: float,
    density_kg_m3: float = DEFAULT_DENSITY_KG_M3,
    illustrative_miss_distance_km: float = KM_PER_LUNAR_DISTANCE,
) -> Dict[str, Any]:
    """
    Executes a complete, deterministic Newtonian impact simulation.
    Strictly decouples illustrative miss distance from kinetic energy calculations,
    adhering to academic integrity guidelines.
    """
    # Validation
    valid = (
        isinstance(diameter_m, (int, float))
        and isinstance(velocity_km_s, (int, float))
        and isinstance(density_kg_m3, (int, float))
        and diameter_m > 0
        and velocity_km_s > 0
        and density_kg_m3 > 0
    )

    if not valid:
        return {
            "valid": False,
            "error": "Invalid numerical parameters: diameter, velocity, and density must be positive numbers.",
            "diameter_m": diameter_m,
            "velocity_km_s": velocity_km_s,
            "density_kg_m3": density_kg_m3,
        }

    radius_m = calculate_impact_radius(diameter_m)
    volume_m3 = calculate_sphere_volume(radius_m)
    mass_kg = calculate_asteroid_mass(volume_m3, density_kg_m3)
    kinetic_energy_joules = calculate_kinetic_energy(mass_kg, velocity_km_s)
    energy_kilotons = convert_joules_to_kilotons_tnt(kinetic_energy_joules)
    energy_megatons = convert_joules_to_megatons_tnt(kinetic_energy_joules)

    # Miss distance in Lunar Distances
    miss_distance_ld = (
        illustrative_miss_distance_km / KM_PER_LUNAR_DISTANCE
        if illustrative_miss_distance_km > 0
        else 0.0
    )

    return {
        "valid": True,
        "input_parameters": {
            "diameter_m": float(diameter_m),
            "velocity_km_s": float(velocity_km_s),
            "density_kg_m3": float(density_kg_m3),
            "illustrative_miss_distance_km": float(illustrative_miss_distance_km),
            "illustrative_miss_distance_ld": round(miss_distance_ld, 3),
        },
        "derived_physical_properties": {
            "radius_m": round(radius_m, 2),
            "volume_m3": volume_m3,
            "mass_kg": mass_kg,
            "mass_metric_tons": mass_kg / 1000.0,
        },
        "energy_calculations": {
            "kinetic_energy_joules": kinetic_energy_joules,
            "kinetic_energy_kilotons_tnt": round(energy_kilotons, 2),
            "kinetic_energy_megatons_tnt": round(energy_megatons, 4),
        },
        "academic_disclosure": (
            "Illustrative educational model. Energy calculations assume a spherical, homogeneous "
            "impactor in vacuum. Miss distance is purely visual and does not represent an empirical collision probability."
        ),
    }


def compute_scaling_multipliers(base_diameter: float, base_velocity: float, base_density: float) -> Dict[str, float]:
    """
    Computes analytical kinetic energy multipliers illustrating cubic diameter scaling
    and quadratic velocity scaling.
    """
    base = simulate_impact(base_diameter, base_velocity, base_density)["energy_calculations"]["kinetic_energy_joules"]
    
    # 2x diameter -> should be 8x (2^3)
    d2 = simulate_impact(base_diameter * 2, base_velocity, base_density)["energy_calculations"]["kinetic_energy_joules"]
    # 2x velocity -> should be 4x (2^2)
    v2 = simulate_impact(base_diameter, base_velocity * 2, base_density)["energy_calculations"]["kinetic_energy_joules"]
    # 2x density -> should be 2x (2^1)
    rho2 = simulate_impact(base_diameter, base_velocity, base_density * 2)["energy_calculations"]["kinetic_energy_joules"]

    return {
        "doubling_diameter_multiplier": round(d2 / base, 2) if base > 0 else 0.0,
        "doubling_velocity_multiplier": round(v2 / base, 2) if base > 0 else 0.0,
        "doubling_density_multiplier": round(rho2 / base, 2) if base > 0 else 0.0,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CosmoStellarAtlas Asteroid Physics Calculator")
    parser.add_argument("--diameter", type=float, default=100.0, help="Asteroid diameter in meters")
    parser.add_argument("--velocity", type=float, default=20.0, help="Encounter velocity in km/s")
    parser.add_argument("--density", type=float, default=2500.0, help="Material density in kg/m³")
    parser.add_argument("--miss-distance", type=float, default=384400.0, help="Illustrative miss distance in km")
    parser.add_argument("--json", action="store_true", help="Output raw JSON results")

    args = parser.parse_args()
    results = simulate_impact(args.diameter, args.velocity, args.density, args.miss_distance)

    if args.json:
        print(json.dumps(results, indent=2))
    else:
        print("\n=======================================================")
        print("  COSMOSTELLARATLAS // ASTEROID IMPACT PHYSICS ENGINE  ")
        print("=======================================================")
        if not results["valid"]:
            print(f"[ERROR] {results['error']}")
        else:
            inputs = results["input_parameters"]
            props = results["derived_physical_properties"]
            energy = results["energy_calculations"]

            print(f"Target Diameter   : {inputs['diameter_m']} m")
            print(f"Encounter Velocity: {inputs['velocity_km_s']} km/s ({inputs['velocity_km_s'] * 1000:,.0f} m/s)")
            print(f"Material Density  : {inputs['density_kg_m3']} kg/m³")
            print(f"Estimated Radius  : {props['radius_m']} m")
            print(f"Spherical Volume  : {props['volume_m3']:,.2f} m³")
            print(f"Estimated Mass    : {props['mass_kg']:,.2e} kg ({props['mass_metric_tons']:,.0f} metric tons)")
            print("-------------------------------------------------------")
            print(f"Kinetic Energy (J): {energy['kinetic_energy_joules']:,.2e} Joules")
            print(f"Equivalent (kt)   : {energy['kinetic_energy_kilotons_tnt']:,.2f} Kilotons TNT")
            print(f"Equivalent (Mt)   : {energy['kinetic_energy_megatons_tnt']:,.4f} Megatons TNT")
            print("-------------------------------------------------------")
            multipliers = compute_scaling_multipliers(args.diameter, args.velocity, args.density)
            print(f"Scaling Verification: 2x Diameter -> {multipliers['doubling_diameter_multiplier']}x Energy (Cubic: 2³=8)")
            print(f"Scaling Verification: 2x Velocity -> {multipliers['doubling_velocity_multiplier']}x Energy (Quadratic: 2²=4)")
            print(f"Scaling Verification: 2x Density  -> {multipliers['doubling_density_multiplier']}x Energy (Linear: 2¹=2)")
            print("=======================================================\n")

