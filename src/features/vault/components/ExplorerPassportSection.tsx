import React from 'react';
import {
  Sparkles,
  Award,
  Globe,
  Rocket,
  Radio,
  ShieldAlert,
  BookOpen,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { useVaultStore } from '../../../store/useVaultStore';
import { Badge } from '../../../components/common/Badge';

export const ExplorerPassportSection: React.FC = () => {
  const profile = useVaultStore((s) => s.profile);
  const explorationEvents = useVaultStore((s) => s.explorationEvents);
  const completedLessonIds = useVaultStore((s) => s.completedLessonIds);
  const quizAttempts = useVaultStore((s) => s.quizAttempts);
  const achievements = useVaultStore((s) => s.achievements);

  // Derive genuine counts
  const distinctPlanets = new Set(
    explorationEvents.filter((e) => e.eventType === 'planet_viewed' && e.entityId).map((e) => e.entityId)
  ).size;

  const distinctMissions = new Set(
    explorationEvents.filter((e) => e.eventType === 'mission_viewed' && e.entityId).map((e) => e.entityId)
  ).size;

  const roverPhotosInspected = explorationEvents.filter(
    (e) => e.eventType === 'rover_image_inspected'
  ).length;

  const asteroidSims = explorationEvents.filter(
    (e) => e.eventType === 'asteroid_simulation_completed'
  ).length;

  const passedQuizzes = new Set(
    quizAttempts.filter((q) => q.passed).map((q) => q.trailId)
  ).size;

  const unlockedAchievementsCount = achievements.filter((a) => !!a.unlockedAt).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <Award className="w-5 h-5 text-[#20D9F2]" />
          <span>Explorer Passport</span>
          <Badge variant="cyan" className="font-mono text-xs">
            CREDENTIAL DOSSIER
          </Badge>
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Official space exploration credential tracking verified astronomical field encounters and curriculum credentials.
        </p>
      </div>

      {/* Holographic Passport Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-[#0B1528] via-[#090F1E] to-[#120B28] p-6 sm:p-8 shadow-2xl">
        {/* Subtle decorative security line watermark */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#20D9F2_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#8565FA]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#20D9F2]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#8565FA] to-[#20D9F2] text-white shadow-md">
                <Compass className="w-6 h-6 text-black" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#20D9F2] uppercase block">
                  COSMOSTELLARATLAS // EXPLORATION CREW
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wider">
                  OFFICIAL EXPLORER PASSPORT
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right font-mono">
                <span className="text-[10px] text-gray-500 uppercase block">Credential ID</span>
                <span className="text-xs font-bold text-white tracking-widest">
                  CSA-{profile.callsign}-{profile.id.slice(-6).toUpperCase()}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-[#FFB45B]">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Identity & Rank Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/40 border border-white/10 p-5 rounded-2xl font-mono">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                Explorer Name
              </span>
              <span className="text-base font-bold text-white block truncate">
                {profile.displayName}
              </span>
              <span className="text-xs text-[#20D9F2]">Callsign: {profile.callsign}</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                Astronavigation Rank
              </span>
              <span className="text-base font-bold text-[#FFB45B] block">
                {profile.rank}
              </span>
              <span className="text-xs text-gray-400">Clearance Level {profile.level}</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                Commission Date
              </span>
              <span className="text-base font-bold text-white block">
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
              <span className="text-xs text-gray-500">Autonomous Local Session</span>
            </div>
          </div>

          {/* Genuine Telemetry Grid */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-3">
              Verified Exploration Telemetry
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <Globe className="w-4 h-4 text-[#20D9F2] mx-auto mb-1.5" />
                <span className="text-lg font-bold font-mono text-white block">
                  {distinctPlanets}
                </span>
                <span className="text-[10px] font-mono text-gray-400 uppercase">
                  Planets Surveyed
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <Rocket className="w-4 h-4 text-[#8565FA] mx-auto mb-1.5" />
                <span className="text-lg font-bold font-mono text-white block">
                  {distinctMissions}
                </span>
                <span className="text-[10px] font-mono text-gray-400 uppercase">
                  Missions Logged
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <Radio className="w-4 h-4 text-[#FFB45B] mx-auto mb-1.5" />
                <span className="text-lg font-bold font-mono text-white block">
                  {roverPhotosInspected}
                </span>
                <span className="text-[10px] font-mono text-gray-400 uppercase">
                  Photos Inspected
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <ShieldAlert className="w-4 h-4 text-[#FF5B5B] mx-auto mb-1.5" />
                <span className="text-lg font-bold font-mono text-white block">
                  {asteroidSims}
                </span>
                <span className="text-[10px] font-mono text-gray-400 uppercase">
                  Impact Sims Run
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <BookOpen className="w-4 h-4 text-[#20D9F2] mx-auto mb-1.5" />
                <span className="text-lg font-bold font-mono text-white block">
                  {completedLessonIds.length}
                </span>
                <span className="text-[10px] font-mono text-gray-400 uppercase">
                  Lessons ({passedQuizzes} Quizzes)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <Award className="w-4 h-4 text-[#FFB45B] mx-auto mb-1.5" />
                <span className="text-lg font-bold font-mono text-white block">
                  {unlockedAchievementsCount}
                </span>
                <span className="text-[10px] font-mono text-gray-400 uppercase">
                  Stars Unlocked
                </span>
              </div>
            </div>
          </div>

          {/* Footer watermark & verification */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-[11px] font-mono text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#20D9F2]" />
              <span>Verified Local Storage: {explorationEvents.length} Actions Logged</span>
            </span>
            <span>Institution: Karunya Institute of Technology and Sciences</span>
          </div>
        </div>
      </div>
    </div>
  );
};
