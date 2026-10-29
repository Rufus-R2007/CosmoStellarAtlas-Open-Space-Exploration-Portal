import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { ModulePlaceholderPage } from '../../components/common/ModulePlaceholderPage';

export const AsteroidsPage: React.FC = () => {
  return (
    <ModulePlaceholderPage
      moduleName="Asteroid Watch & Defense Lab"
      tagline="Near-Earth Object Radar & Kinetic Deflection Lab"
      description="Asteroid Watch will deliver a planetary defense operations console featuring synthetic and curated Near-Earth Object orbits, miss-distance radar plots, and interactive kinetic impact deflection simulations based on NASA DART principles."
      phaseNumber={6}
      phaseTitle="Phase 6: Asteroid Radar & Planetary Defense Lab"
      icon={<ShieldAlert className="w-8 h-8 text-[#FFB45B]" />}
      plannedFeatures={[
        'Interactive 3D radar plot of Near-Earth Objects relative to Earth and Moon',
        'Torino and Palermo scale impact hazard calculations',
        'Kinetic Impactor deflection sandbox: test delta-v adjustments on hazardous targets',
        'Filtering by orbit class (Apollo, Aten, Amor, Atira) and size distribution',
        'Historical impact database (Chelyabinsk, Tunguska, Chicxulub)',
        'Close approach timeline forecasting through the next century',
      ]}
    />
  );
};

