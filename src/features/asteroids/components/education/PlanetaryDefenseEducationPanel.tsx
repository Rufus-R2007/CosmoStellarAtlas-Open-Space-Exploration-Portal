import React, { useState } from 'react';
import {
  Orbit,
  Telescope,
  Crosshair,
  ShieldAlert,
  Zap,
  Flame,
  Info,
  CheckCircle2,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import { Card } from '../../../../components/common/Card';
import { Badge } from '../../../../components/common/Badge';
import { SectionHeader } from '../../../../components/common/SectionHeader';

interface DefenseTechnique {
  id: string;
  title: string;
  heritage: string;
  leadTime: string;
  readiness: string;
  icon: React.ReactNode;
  summary: string;
  mechanism: string;
  advantages: string[];
  limitations: string[];
}

const DEFENSE_TECHNIQUES: DefenseTechnique[] = [
  {
    id: 'kinetic',
    title: 'Kinetic Impactor',
    heritage: 'NASA DART (Double Asteroid Redirection Test, 2022)',
    leadTime: '5 – 10 Years Warning',
    readiness: 'Flight Validated (TRL 7-9)',
    icon: <Crosshair className="w-5 h-5 text-[#20D9F2]" />,
    summary:
      'A dedicated high-velocity spacecraft collides directly with the threatening body, imparting momentum to alter its orbital velocity by millimetres to centimetres per second.',
    mechanism:
      'Direct momentum transfer boosted by the ejecta momentum enhancement factor (beta, typically β ≈ 2.2 to 3.6). In September 2022, NASA DART altered Dimorphos’s orbital period by 32 minutes, proving planetary defense viability.',
    advantages: [
      'Experimentally demonstrated with existing propulsion and guidance hardware',
      'Simple direct architecture requiring no delicate proximity landing',
      'Scalable via multiple sequential impactor launches',
    ],
    limitations: [
      'Risk of hazardous fragment generation for rubble-pile asteroids',
      'Requires precise center-of-mass targeting on irregularly rotating bodies',
      'Diminishing effectiveness against bodies > 1 km without decades of warning',
    ],
  },
  {
    id: 'gravity',
    title: 'Gravity Tractor',
    heritage: 'Theoretical & ESA Don Quijote / NASA ARM studies',
    leadTime: '15 – 30+ Years Warning',
    readiness: 'Concept Validated (TRL 3-4)',
    icon: <Orbit className="w-5 h-5 text-[#8565FA]" />,
    summary:
      'A massive spacecraft hovers in close proximity to the asteroid without contacting it, using mutual gravitational attraction to gently tow the body into a safe trajectory over years.',
    mechanism:
      'By balancing ion thrusters canted away from the target to avoid plume impingement, the spacecraft’s mass acts as an invisible tow rope, exerting ~10⁻³ N continuous force.',
    advantages: [
      'Completely independent of asteroid surface morphology, internal composition, and spin rate',
      'Zero risk of structural fragmentation or catastrophic asteroid breakup',
      'Extremely high deflection precision allowing millimeter orbital trim',
    ],
    limitations: [
      'Requires very long operation windows (typically 15 to 30 years)',
      'Ineffective for massive asteroids (> 300 m) due to realistic spacecraft mass constraints',
      'Demands ultra-reliable deep-space propulsion lasting many years continuously',
    ],
  },
  {
    id: 'ion-shepherd',
    title: 'Ion Beam Shepherd / Directed Laser',
    heritage: 'ESA & Technical University of Madrid studies / DE-STAR',
    leadTime: '10 – 20 Years Warning',
    readiness: 'Laboratory Prototype (TRL 3)',
    icon: <Zap className="w-5 h-5 text-[#FFB45B]" />,
    summary:
      'High-velocity collimated ion thruster plasma or high-power laser arrays vaporize volatile surface rock, generating rocket-like reaction thrust without touching the surface.',
    mechanism:
      'Sublimation of water ice, silicate dust, and volatile gas creates a localized rocket plume, applying continuous newtons of thrust over hundreds of days of standoff operation.',
    advantages: [
      'Contactless deflection robust against unpredictable asteroid tumble',
      'Higher continuous thrust generation than a pure gravity tractor',
      'Can be configured for dual-purpose surface spectroscopy and composition analysis',
    ],
    limitations: [
      'Backsplash of eroded debris can coat optical arrays and solar panels',
      'Requires substantial multikilowatt nuclear or solar electrical power systems',
      'Thrust vector orientation is sensitive to rapid asteroid rotation and topography',
    ],
  },
  {
    id: 'nuclear',
    title: 'Nuclear Stand-Off Detonation',
    heritage: 'Lawrence Livermore National Laboratory & NASA planetary defense reports',
    leadTime: '1 – 5 Years (Emergency Last Resort)',
    readiness: 'High Technical Feasibility / Constrained by Treaty',
    icon: <Flame className="w-5 h-5 text-[#EF4444]" />,
    summary:
      'A nuclear explosive device is detonated at a calculated standoff distance (several hundred meters) above the sunlit hemisphere to ablate the outer rock layer.',
    mechanism:
      'Intense X-ray and neutron pulse vaporizes a thin surface shell. The rapid expansion of this gaseous shell acts like an impulsive rocket burn, imparting massive delta-v without penetrating or shattering the interior.',
    advantages: [
      'Highest energy density known to physics; effective against gigantic objects (> 1 km)',
      'Viable with short warning horizons (less than 5 years)',
      'Does not require detailed knowledge of asteroid internal structural integrity',
    ],
    limitations: [
      'Geopolitical complications under the Outer Space Treaty of 1967',
      'Launch safety risks carrying nuclear payloads through Earth atmosphere',
      'Residual risk of unconstrained fragment dispersion if standoff distance is miscalculated',
    ],
  },
];

const ORBIT_CLASSES = [
  {
    name: 'Apollo',
    count: 'Earth-Crossing (Major)',
    criterion: 'Semi-major axis a > 1.0 AU, Perihelion q < 1.017 AU',
    significance:
      'Largest population of known Near-Earth Asteroids (~55% of all NEOs). Their orbits cross Earth’s orbital path from the outside, posing the greatest close-encounter frequency.',
    color: '#EF4444',
  },
  {
    name: 'Aten',
    count: 'Earth-Crossing (Interior Major)',
    criterion: 'Semi-major axis a < 1.0 AU, Aphelion Q > 0.983 AU',
    significance:
      'Orbits spend most of their period inside Earth’s orbit but swing outward across Earth’s path at aphelion. Challenging to observe from ground telescopes due to solar glare.',
    color: '#FFB45B',
  },
  {
    name: 'Amor',
    count: 'Earth-Approaching (Exterior)',
    criterion: '1.017 AU < Perihelion q < 1.300 AU',
    significance:
      'Orbits approach Earth from the outside without currently crossing Earth’s orbit. Gravitational perturbations from Jupiter and Mars can periodically shift Amors into Apollo orbits.',
    color: '#20D9F2',
  },
  {
    name: 'Atira (IEO)',
    count: 'Interior to Earth',
    criterion: 'Aphelion Q < 0.983 AU',
    significance:
      'Orbits entirely contained within Earth’s orbit. Extremely elusive for ground-based optical surveys because they reside permanently inside the sunward daylight sky.',
    color: '#8565FA',
  },
];

export const PlanetaryDefenseEducationPanel: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<string>('kinetic');
  const activeTech = DEFENSE_TECHNIQUES.find((t) => t.id === selectedTech) || DEFENSE_TECHNIQUES[0];

  return (
    <section className="space-y-8" aria-label="Planetary Defense Scientific Education">
      <SectionHeader
        eyebrow="Academic Science & Engineering"
        title="Planetary Defense & Near-Earth Object Survey"
        subtitle="Scientific foundations of Near-Earth Object discovery, orbital classification, deflection physics, and the architectural distinction between observational tracking and deterministic modeling."
      />

      {/* Grid: Survey Infrastructure & Orbit Classification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NEO Survey Infrastructure */}
        <Card className="p-6 border-[#20D9F2]/20" glow="cyan">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#20D9F2]/10 border border-[#20D9F2]/30 flex items-center justify-center">
              <Telescope className="w-5 h-5 text-[#20D9F2]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Global NEO Survey & Detection Array</h3>
              <p className="text-xs text-[#20D9F2] font-mono">Planetary Defense Coordination Office (PDCO)</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Astronomers detect Near-Earth Asteroids by surveying the night sky with wide-field optical telescopes and
            planetary radar. Observatories capture multiple sequential exposures over hours to detect faint points of
            light moving relative to background stars.
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#060B19]/60 border border-slate-800 flex items-start gap-3">
              <Compass className="w-4 h-4 text-[#20D9F2] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold">Primary Survey Systems:</span>
                <p className="text-slate-400 mt-1">
                  Pan-STARRS (Hawaii), Catalina Sky Survey (Arizona), ATLAS (global 4-station network), and the upcoming
                  NASA NEO Surveyor infrared space telescope.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#060B19]/60 border border-slate-800 flex items-start gap-3">
              <Orbit className="w-4 h-4 text-[#8565FA] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold">Orbital Uncertainty & Error Ellipses:</span>
                <p className="text-slate-400 mt-1">
                  Initial discoveries carry high positional uncertainty (Condition Code 9). As follow-up observations
                  accumulate over weeks or months, the 3D covariance ellipsoid shrinks (Condition Code 0), ruling out
                  apparent impact trajectories.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#060B19]/60 border border-slate-800 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-[#FFB45B] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold">PHA Classification Threshold:</span>
                <p className="text-slate-400 mt-1">
                  An asteroid is categorized as a Potentially Hazardous Asteroid (PHA) if its Minimum Orbit Intersection
                  Distance (MOID) with Earth is ≤ 0.05 AU (~19.5 Lunar Distances / 7.48 million km) and its absolute
                  magnitude H ≤ 22.0 (diameter ~140 meters or larger).
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Orbit Classification Matrix */}
        <Card className="p-6 border-[#8565FA]/20" glow="violet">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#8565FA]/10 border border-[#8565FA]/30 flex items-center justify-center">
              <Orbit className="w-5 h-5 text-[#8565FA]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Dynamic Orbit Taxonomy</h3>
              <p className="text-xs text-[#8565FA] font-mono">Keplerian Classification of Near-Earth Objects</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Near-Earth Objects are partitioned into four dynamical classes based on their semi-major axis (a), perihelion
            (q), and aphelion (Q) relative to Earth’s orbit at 1.0 Astronomical Unit (AU).
          </p>

          <div className="space-y-2.5">
            {ORBIT_CLASSES.map((cls) => (
              <div
                key={cls.name}
                className="p-3 rounded-lg bg-[#060B19]/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cls.color }} />
                    <span className="text-sm font-semibold text-white">{cls.name} Class</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{cls.count}</span>
                </div>
                <div className="text-[11px] font-mono text-[#20D9F2] mb-1">{cls.criterion}</div>
                <p className="text-xs text-slate-400 leading-snug">{cls.significance}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Planetary Defense Mitigation Technologies */}
      <Card className="p-6 border-[#FFB45B]/20" glow="gold">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFB45B]/10 border border-[#FFB45B]/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-[#FFB45B]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Planetary Defense Mitigation Architecture</h3>
              <p className="text-xs text-[#FFB45B] font-mono">Engineered Deflection & In-Situ Mitigation Methods</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs self-start md:self-auto font-mono text-slate-300">
            NASA / ESA Mitigation Framework
          </Badge>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          {DEFENSE_TECHNIQUES.map((tech) => {
            const isSelected = tech.id === selectedTech;
            return (
              <button
                key={tech.id}
                onClick={() => setSelectedTech(tech.id)}
                className={`p-3 rounded-lg text-left transition-all border flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-[#0B1528] border-[#20D9F2] shadow-sm shadow-[#20D9F2]/20'
                    : 'bg-[#060B19]/50 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="shrink-0">{tech.icon}</div>
                <div className="truncate">
                  <div className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {tech.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">{tech.leadTime.split(' ')[0]} yrs</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Technique Details */}
        <div className="p-5 rounded-xl bg-[#060B19]/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                {activeTech.icon}
                {activeTech.title}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{activeTech.heritage}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan" className="text-[10px] font-mono">
                {activeTech.leadTime}
              </Badge>
              <Badge variant="violet" className="text-[10px] font-mono">
                {activeTech.readiness}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">{activeTech.summary}</p>

          <div className="p-3 rounded-lg bg-[#0B1528] border border-slate-800">
            <span className="text-xs font-mono text-[#20D9F2] uppercase font-semibold block mb-1">
              Physics & Operational Mechanism:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeTech.mechanism}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase font-semibold flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Strategic Advantages
              </span>
              <ul className="space-y-1.5">
                {activeTech.advantages.map((adv, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-mono text-[11px] mt-0.5">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs font-mono text-amber-400 uppercase font-semibold flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                Engineering Constraints & Risks
              </span>
              <ul className="space-y-1.5">
                {activeTech.limitations.map((lim, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-mono text-[11px] mt-0.5">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Observation vs Simulation Methodology Disclaimer Card */}
      <Card className="p-5 border-slate-700/60 bg-[#070D1E]/90">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-[#20D9F2]/10 border border-[#20D9F2]/30 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-5 h-5 text-[#20D9F2]" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-white">Observational Reality vs. Offline Simulation Ethics</h4>
              <Badge variant="synthetic" className="text-[10px]">
                Educational Integrity Policy
              </Badge>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              CosmoStellarAtlas operates with complete offline scientific integrity. Benchmark historical objects
              (e.g., 99942 Apophis, 101955 Bennu, 65803 Didymos) reflect authentic orbital parameters and peer-reviewed
              astrometric determinations. Demonstration encounter trajectories (prefixed with{' '}
              <span className="font-mono text-[#20D9F2]">SIM-2026-</span>) are synthetic models generated to exercise
              software state, filtering matrices, and 2D Keplerian hyperbolic visualization algorithms.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              The What-If Simulation Engine utilizes deterministic Newtonian mechanics (
              <span className="font-mono text-slate-200">E = ½mv²</span>) and standardized spherical volume models. It
              does not compute atmospheric hypervelocity entry ablation, hydrodynamic airburst altitudes, or complex
              tidal gravitational perturbation tensors, which require supercomputer-scale hydrocodes (e.g., CTH,
              ALE3D).
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
};
