import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Globe,
  Rocket,
  Clock,
  Radio,
  ShieldAlert,
  Network,
  Vault,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { SectionHeader } from '../../../components/common/SectionHeader';

interface ModuleCardInfo {
  name: string;
  path: string;
  description: string;
  icon: React.ReactNode;
  phase: string;
  status: 'active' | 'upcoming';
  accentGlow: 'cyan' | 'violet' | 'gold';
}

const modules: ModuleCardInfo[] = [
  {
    name: 'Observatory Command',
    path: '/',
    description: 'Central mission operations HUD, telemetry overviews, and live celestial orientation array.',
    icon: <Compass className="w-6 h-6 text-[#20D9F2]" />,
    phase: 'Phase 1',
    status: 'active',
    accentGlow: 'cyan',
  },
  {
    name: 'Interactive Planet Explorer',
    path: '/planets',
    description: 'High-fidelity planetary survey with multi-layered atmospheric, gravitational, and orbital ephemerides.',
    icon: <Globe className="w-6 h-6 text-[#20D9F2]" />,
    phase: 'Phase 2',
    status: 'upcoming',
    accentGlow: 'cyan',
  },
  {
    name: 'Cosmic Time Machine',
    path: '/timeline',
    description: 'Chronological timeline navigating 70+ years of historic robotic and crewed spaceflight milestones.',
    icon: <Clock className="w-6 h-6 text-[#8565FA]" />,
    phase: 'Phase 3',
    status: 'upcoming',
    accentGlow: 'violet',
  },
  {
    name: 'Mission Control Center',
    path: '/missions',
    description: 'Detailed expedition dossiers, flight trajectories, and mission archive intelligence.',
    icon: <Rocket className="w-6 h-6 text-[#8565FA]" />,
    phase: 'Phase 4',
    status: 'upcoming',
    accentGlow: 'violet',
  },
  {
    name: 'Mars Rover Explorer',
    path: '/rovers',
    description: 'Interactive surface tele-robotics console, sol archives, and camera instruments from Jezero to Gale.',
    icon: <Radio className="w-6 h-6 text-[#FFB45B]" />,
    phase: 'Phase 5',
    status: 'upcoming',
    accentGlow: 'gold',
  },
  {
    name: 'Asteroid Watch & Defense Lab',
    path: '/asteroids',
    description: 'Near-Earth Object radar database, trajectory impact risk calculations, and deflection simulation.',
    icon: <ShieldAlert className="w-6 h-6 text-[#FFB45B]" />,
    phase: 'Phase 6',
    status: 'upcoming',
    accentGlow: 'gold',
  },
  {
    name: 'Space Intelligence & Briefings',
    path: '/intelligence',
    description: 'Curated and simulated scientific dispatches, discovery graph, and deep-space knowledge index.',
    icon: <Network className="w-6 h-6 text-[#20D9F2]" />,
    phase: 'Phase 7',
    status: 'upcoming',
    accentGlow: 'cyan',
  },
  {
    name: 'Learning Hub & Vault',
    path: '/vault',
    description: 'Interactive educational space modules, celestial bookmarks, expedition notes, and explorer vault.',
    icon: <Vault className="w-6 h-6 text-[#8565FA]" />,
    phase: 'Phase 8',
    status: 'upcoming',
    accentGlow: 'violet',
  },
];

export const DiscoveryModulesSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="my-12">
      <SectionHeader
        icon={<Compass className="w-5 h-5 text-[#20D9F2]" />}
        eyebrow="Exploration Architecture"
        title="Discovery Navigation Array"
        subtitle="Access all 8 core exploration modules of the CosmoStellarAtlas platform. Active and roadmap modules are explicitly delineated."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((mod) => (
          <Card
            key={mod.name}
            glow={mod.accentGlow}
            interactive
            onClick={() => navigate(mod.path)}
            className="flex flex-col justify-between p-5 min-h-[210px] group border-[#1D2A44]"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-[#060B19] border border-[#141D30] group-hover:scale-110 transition-transform">
                  {mod.icon}
                </div>
                <Badge
                  variant={mod.status === 'active' ? 'cyan' : 'outline'}
                  size="sm"
                >
                  {mod.status === 'active' ? 'ACTIVE // P1' : mod.phase}
                </Badge>
              </div>

              <h3 className="font-headline text-base font-bold uppercase tracking-tight text-[#F5F7FF] group-hover:text-[#20D9F2] transition-colors">
                {mod.name}
              </h3>

              <p className="font-body text-xs text-[#98A7BF] mt-1.5 leading-relaxed">
                {mod.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#141D30] flex items-center justify-between font-mono text-[11px]">
              <span className="text-[#98A7BF]">
                {mod.status === 'active' ? 'Full Operational' : 'Roadmap Module'}
              </span>
              <span className="text-[#20D9F2] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
