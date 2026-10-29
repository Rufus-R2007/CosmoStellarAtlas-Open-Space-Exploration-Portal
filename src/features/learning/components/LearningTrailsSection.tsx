import React from 'react';
import {
  Globe,
  Radio,
  ShieldAlert,
  Rocket,
  Clock,
  CheckCircle2,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { LearningTrail, LearningLesson } from '../../../types';
import { useVaultStore } from '../../../store/useVaultStore';
import { Badge } from '../../../components/common/Badge';

interface LearningTrailsSectionProps {
  trails: LearningTrail[];
  onOpenLesson: (trail: LearningTrail, lesson: LearningLesson) => void;
  onOpenQuiz: (trail: LearningTrail) => void;
}

export const LearningTrailsSection: React.FC<LearningTrailsSectionProps> = ({
  trails,
  onOpenLesson,
  onOpenQuiz,
}) => {
  const completedLessonIds = useVaultStore((s) => s.completedLessonIds);
  const quizAttempts = useVaultStore((s) => s.quizAttempts);

  const getTrailIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-6 h-6 text-[#20D9F2]" />;
      case 'Radio':
        return <Radio className="w-6 h-6 text-[#FFB45B]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-[#FF5B5B]" />;
      case 'Rocket':
      default:
        return <Rocket className="w-6 h-6 text-[#8565FA]" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            Structured Learning Trails
          </h2>
          <p className="text-sm text-gray-400">
            Step through verified educational curricula with interactive simulations and certification assessments.
          </p>
        </div>
        <div className="text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg w-fit">
          Curriculums: 4 Active // 0 Prerequisite Gates
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trails.map((trail) => {
          const completedInTrail = trail.lessons.filter((l) =>
            completedLessonIds.includes(l.id)
          ).length;
          const totalInTrail = trail.lessons.length;
          const trailPercent = Math.round((completedInTrail / totalInTrail) * 100);

          // Get best quiz attempt
          const attemptsForTrail = quizAttempts.filter((q) => q.trailId === trail.id);
          const bestPassed = attemptsForTrail
            .filter((q) => q.passed)
            .sort((a, b) => b.scorePercent - a.scorePercent)[0];

          return (
            <div
              key={trail.id}
              className="relative rounded-2xl border border-white/10 bg-[#0B1528]/70 backdrop-blur-md p-6 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      {getTrailIcon(trail.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-400">{trail.codeName}</span>
                        <Badge variant="cyan" className="text-[10px] py-0 px-2">
                          {trail.category}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-wide">
                        {trail.title}
                      </h3>
                    </div>
                  </div>

                  {bestPassed && (
                    <Badge variant="gold" className="flex items-center gap-1 font-mono text-xs">
                      <Award className="w-3.5 h-3.5 text-[#FFB45B]" />
                      <span>{bestPassed.scorePercent}%</span>
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-gray-400 font-medium italic mb-3">
                  {trail.tagline}
                </p>

                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {trail.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-6">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400">
                      Lesson Progress ({completedInTrail}/{totalInTrail})
                    </span>
                    <span className="text-[#20D9F2] font-semibold">{trailPercent}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#8565FA] to-[#20D9F2] h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${trailPercent}%` }}
                    />
                  </div>
                </div>

                {/* Lessons list accordion/overview */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">
                    Curriculum Lessons ({trail.lessons.length})
                  </span>
                  {trail.lessons.map((lesson) => {
                    const isDone = completedLessonIds.includes(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onOpenLesson(trail, lesson)}
                        className="w-full text-left p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/15 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                              isDone ? 'text-[#20D9F2]' : 'text-gray-500'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                              {lesson.order}. {lesson.title}
                            </div>
                            <div className="text-[11px] text-gray-500 flex items-center gap-2">
                              <span>{lesson.estimatedMinutes} min</span>
                              <span>•</span>
                              <span>{lesson.moduleRouteLabel}</span>
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                  <Clock className="w-3.5 h-3.5 text-[#20D9F2]" />
                  <span>Est. Total: {trail.estimatedMinutes} min</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenLesson(trail, trail.lessons[0])}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/15 hover:bg-white/10 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#20D9F2]" />
                    <span>Read Lessons</span>
                  </button>

                  <button
                    onClick={() => onOpenQuiz(trail)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#8565FA] to-[#20D9F2] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm shadow-[#8565FA]/20"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{bestPassed ? 'Retake Quiz' : 'Start Quiz'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
