import React from 'react';
import { BookOpen, Award, CheckCircle2, Trophy, Compass, ArrowRight } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';
import { useVaultStore } from '../../../store/useVaultStore';
import { learningTrails } from '../../../data/learningTrails';

interface LearningHubHeroProps {
  onExploreTrailsClick: () => void;
}

export const LearningHubHero: React.FC<LearningHubHeroProps> = ({ onExploreTrailsClick }) => {
  const completedLessonIds = useVaultStore((s) => s.completedLessonIds);
  const quizAttempts = useVaultStore((s) => s.quizAttempts);
  const achievements = useVaultStore((s) => s.achievements);

  const totalLessons = learningTrails.reduce((acc, t) => acc + t.lessons.length, 0);
  const completedCount = completedLessonIds.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const passedTrails = new Set(
    quizAttempts.filter((q) => q.passed).map((q) => q.trailId)
  );
  const passedQuizzesCount = passedTrails.size;

  const curriculumAchievements = achievements.filter(
    (a) => a.category === 'curriculum' && a.unlockedAt
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1528]/80 backdrop-blur-md p-6 sm:p-8 mb-8">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8565FA]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#20D9F2]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="violet" className="flex items-center gap-1.5 px-3 py-1 font-mono text-xs">
              <BookOpen className="w-3.5 h-3.5 text-[#8565FA]" />
              INTERACTIVE ASTROPHYSICS & SPACEFLIGHT CURRICULUM
            </Badge>
            <Badge variant="cyan" className="font-mono text-xs">
              PHASE 7 FLAGSHIP
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <Compass className="w-3.5 h-3.5 text-[#20D9F2]" />
            <span>Curriculum Standard: 4 Trails // 12 Lessons // 24 Validated Questions</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-wide mb-3">
              Cosmic Learning Hub
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              Master the physical foundations of orbital mechanics, planetary geology, kinetic defense physics,
              and historical astronautics. Each trail connects directly to live interactive simulation laboratories
              across CosmoStellarAtlas with verified progress and achievement mastery.
            </p>

            {/* Quick Action Button */}
            <button
              onClick={onExploreTrailsClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8565FA] to-[#20D9F2] text-white font-medium text-sm hover:opacity-90 transition-all shadow-lg shadow-[#8565FA]/20 cursor-pointer"
            >
              <span>Explore Curriculum Trails</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Overview Card */}
          <div className="rounded-xl border border-white/10 bg-black/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Curriculum Mastery
              </span>
              <span className="text-sm font-bold font-mono text-[#20D9F2]">
                {progressPercent}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#8565FA] to-[#20D9F2] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center justify-center text-[#20D9F2] mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold font-mono text-white">
                  {completedCount}/{totalLessons}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Lessons</div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center justify-center text-[#FFB45B] mb-1">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold font-mono text-white">
                  {passedQuizzesCount}/{learningTrails.length}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Quizzes</div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center justify-center text-[#8565FA] mb-1">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold font-mono text-white">
                  {curriculumAchievements.length}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Badges</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
