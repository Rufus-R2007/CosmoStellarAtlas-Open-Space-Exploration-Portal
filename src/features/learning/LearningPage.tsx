import React from 'react';
import { BookOpen } from 'lucide-react';
import { ModulePlaceholderPage } from '../../components/common/ModulePlaceholderPage';

export const LearningPage: React.FC = () => {
  return (
    <ModulePlaceholderPage
      moduleName="Learning Hub"
      tagline="Interactive Astrophysics & Spaceflight Curriculum"
      description="The Learning Hub will feature structured educational modules, interactive orbital mechanics demonstrations, space history lessons, and celestial exploration quizzes."
      phaseNumber={7}
      phaseTitle="Phase 7: Educational Storytelling & Learning Hub"
      icon={<BookOpen className="w-8 h-8 text-[#8565FA]" />}
      plannedFeatures={[
        'Interactive orbital mechanics guide: Kepler\'s laws, gravity assists, and Hohmann transfers',
        'Visual space documentary stories with rich historical narratives',
        'Astronomy quiz module with instant feedback and score tracking',
        'Astrobiology exploration module on water and habitability in the solar system',
        'Glossary of aerospace and astrophysical nomenclature',
        'Faculty and student presentation mode for interactive demonstration',
      ]}
    />
  );
};
