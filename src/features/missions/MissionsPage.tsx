import React from 'react';
import { Rocket } from 'lucide-react';
import { ModulePlaceholderPage } from '../../components/common/ModulePlaceholderPage';

export const MissionsPage: React.FC = () => {
  return (
    <ModulePlaceholderPage
      moduleName="Mission Control"
      tagline="Expedition Dossiers & Flight Trajectories"
      description="Mission Control will provide comprehensive declassified mission dossiers, telemetry breakdowns, trajectory maps, milestone logs, and spacecraft instrument specifications."
      phaseNumber={4}
      phaseTitle="Phase 4: Mission Control & Expedition Dossiers"
      icon={<Rocket className="w-8 h-8 text-[#8565FA]" />}
      plannedFeatures={[
        'Full mission archive with search, agency filtering, and status filtering',
        'Detailed technical dossiers for Apollo, Voyager, Cassini, JWST, Artemis, and more',
        'Orbital insertion diagrams and stage separation flight telemetry',
        'Payload breakdown with instrument sensor arrays and scientific outcomes',
        'Crew profiles for historical and planned crewed expeditions',
        'Bookmark and export mission dossiers directly to Personal Vault',
      ]}
    />
  );
};

