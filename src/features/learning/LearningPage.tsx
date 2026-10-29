import React, { useState, useRef } from 'react';
import { learningTrails } from '../../data/learningTrails';
import { LearningTrail, LearningLesson } from '../../types';
import { LearningHubHero } from './components/LearningHubHero';
import { LearningTrailsSection } from './components/LearningTrailsSection';
import { InteractiveLessonModal } from './components/InteractiveLessonModal';
import { InteractiveQuizModal } from './components/InteractiveQuizModal';

export const LearningPage: React.FC = () => {
  const [activeLessonModal, setActiveLessonModal] = useState<{
    trail: LearningTrail;
    lesson: LearningLesson;
  } | null>(null);

  const [activeQuizModalTrail, setActiveQuizModalTrail] = useState<LearningTrail | null>(null);

  const trailsSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToTrails = () => {
    trailsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenLesson = (trail: LearningTrail, lesson: LearningLesson) => {
    setActiveLessonModal({ trail, lesson });
  };

  const handleOpenQuiz = (trail: LearningTrail) => {
    setActiveQuizModalTrail(trail);
  };

  const handleStartQuizFromLesson = () => {
    if (activeLessonModal) {
      const trail = activeLessonModal.trail;
      setActiveLessonModal(null);
      setActiveQuizModalTrail(trail);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Learning Hub Hero */}
      <LearningHubHero onExploreTrailsClick={handleScrollToTrails} />

      {/* Learning Trails Section */}
      <div ref={trailsSectionRef}>
        <LearningTrailsSection
          trails={learningTrails}
          onOpenLesson={handleOpenLesson}
          onOpenQuiz={handleOpenQuiz}
        />
      </div>

      {/* Lesson Reader Modal */}
      {activeLessonModal && (
        <InteractiveLessonModal
          lesson={activeLessonModal.lesson}
          trail={activeLessonModal.trail}
          onClose={() => setActiveLessonModal(null)}
          onSelectLesson={(newLesson) =>
            setActiveLessonModal({ trail: activeLessonModal.trail, lesson: newLesson })
          }
          onStartQuiz={handleStartQuizFromLesson}
        />
      )}

      {/* Quiz Modal */}
      {activeQuizModalTrail && (
        <InteractiveQuizModal
          trail={activeQuizModalTrail}
          onClose={() => setActiveQuizModalTrail(null)}
        />
      )}
    </div>
  );
};
