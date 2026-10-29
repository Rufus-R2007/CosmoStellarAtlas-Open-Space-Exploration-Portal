import React from 'react';
import { Globe } from 'lucide-react';
import { ModulePlaceholderPage } from '../../components/common/ModulePlaceholderPage';

export const PlanetsPage: React.FC = () => {
  return (
    <ModulePlaceholderPage
      moduleName="Planet Explorer"
      tagline="Interactive Multi-Layer Planetary Survey"
      description="The Planet Explorer will deliver high-fidelity celestial telemetry, orbital ephemerides, atmospheric gradient comparisons, surface topography layers, and planetary slice cross-sections."
      phaseNumber={2}
      phaseTitle="Phase 2: Planetary Telemetry & Interactive Ephemerides"
      icon={<Globe className="w-8 h-8 text-[#20D9F2]" />}
      plannedFeatures={[
        'Interactive 3D planetary mesh and texture rendering',
        'Atmospheric cross-section telemetry and gas composition analysis',
        'Gravitational acceleration comparison calculator',
        'Real-time orbital distance and light-time delay metrics',
        'Associated historical mission rendezvous directory',
        'Comparative planetary scale and mass visualizer',
      ]}
    />
  );
};
