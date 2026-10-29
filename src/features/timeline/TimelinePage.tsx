import React from 'react';
import { Clock } from 'lucide-react';
import { ModulePlaceholderPage } from '../../components/common/ModulePlaceholderPage';

export const TimelinePage: React.FC = () => {
  return (
    <ModulePlaceholderPage
      moduleName="Cosmic Time Machine"
      tagline="Interactive Chronological Spaceflight Odyssey"
      description="The Cosmic Time Machine will feature a smooth, scrubbable temporal matrix spanning from the 1957 launch of Sputnik 1 through futuristic Artemis, Martian, and deep space milestones."
      phaseNumber={3}
      phaseTitle="Phase 3: Cosmic Time Machine & Temporal Scrubbing"
      icon={<Clock className="w-8 h-8 text-[#8565FA]" />}
      plannedFeatures={[
        'Full timeline scrubbing with decade jump navigation and filter presets',
        'Epoch-based historical mission milestones and declassified mission logs',
        'Agency comparison timeline (NASA, Roscosmos, ESA, ISRO, JAXA)',
        'Technological breakthrough markers from chemical rockets to ion propulsion',
        'Audio/Visual archival footage simulation cards',
        'Bidirectional state synchronization with Observatory Dashboard',
      ]}
    />
  );
};

