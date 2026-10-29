import React from 'react';
import { Network } from 'lucide-react';
import { ModulePlaceholderPage } from '../../components/common/ModulePlaceholderPage';

export const IntelligencePage: React.FC = () => {
  return (
    <ModulePlaceholderPage
      moduleName="Space Intelligence"
      tagline="Discovery Graph & Deep Space Knowledge Network"
      description="Space Intelligence will connect celestial bodies, spaceflight missions, scientific instruments, and astronomical discoveries into an interactive discovery knowledge graph."
      phaseNumber={7}
      phaseTitle="Phase 7: Knowledge Graph & Discovery Network"
      icon={<Network className="w-8 h-8 text-[#20D9F2]" />}
      plannedFeatures={[
        'Interactive force-directed entity relationship graph connecting planets, missions, and probes',
        'Deep semantic search across all local records and technical abstracts',
        'Astrophysics research briefings with categorized sector tags',
        'Interactive timeline-to-entity cross navigation',
        'Spectral classification tool for astronomical objects',
        'Exportable knowledge clusters for educational review',
      ]}
    />
  );
};

