import React from 'react';
import { Radio } from 'lucide-react';
import { ModulePlaceholderPage } from '../../components/common/ModulePlaceholderPage';

export const RoversPage: React.FC = () => {
  return (
    <ModulePlaceholderPage
      moduleName="Mars Rover Explorer"
      tagline="Surface Tele-Robotics & Sol Visualizer"
      description="The Mars Rover Explorer will provide an interactive surface mission operations deck showcasing Perseverance, Curiosity, Spirit, Opportunity, and Sojourner."
      phaseNumber={5}
      phaseTitle="Phase 5: Mars Surface Tele-Robotics & Sol Archives"
      icon={<Radio className="w-8 h-8 text-[#FFB45B]" />}
      plannedFeatures={[
        'Interactive Sol explorer with camera selection (Mastcam, Navcam, Hazcam, ChemCam)',
        'Sample cache tracking for Mars Sample Return collection tubes',
        'Rover traverse route maps across Gale Crater and Jezero Delta',
        'Instrument telemetry: MOXIE oxygen generation, RIMFAX subsurface radar, weather data',
        'Ingenuity Mars Helicopter flight log and flight trajectory records',
        'High-contrast raw optics viewer with zoom and metadata inspection',
      ]}
    />
  );
};

