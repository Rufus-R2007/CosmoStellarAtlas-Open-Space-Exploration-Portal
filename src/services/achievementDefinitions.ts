import { Achievement, ExplorationEvent, FavoriteItem, JournalNote, QuizAttempt } from '../types';

export interface AchievementTemplate {
  id: string;
  title: string;
  description: string;
  badgeCode: string;
  category: 'exploration' | 'curriculum' | 'analysis' | 'vault';
  iconName: string;
  targetValue: number;
  constellationCoord: { x: number; y: number };
  evaluator: (context: AchievementEvaluationContext) => {
    currentValue: number;
    unlocked: boolean;
  };
}

export interface AchievementEvaluationContext {
  events: ExplorationEvent[];
  favorites: FavoriteItem[];
  journalNotes: JournalNote[];
  completedLessonIds: string[];
  quizAttempts: QuizAttempt[];
}

export const CONSTELLATION_EDGES: [string, string][] = [
  ['ach-planet-pioneer', 'ach-cosmic-comparer'],
  ['ach-cosmic-comparer', 'ach-mission-historian'],
  ['ach-mission-historian', 'ach-timeline-traveler'],
  ['ach-timeline-traveler', 'ach-mars-investigator'],
  ['ach-mars-investigator', 'ach-asteroid-analyst'],
  ['ach-asteroid-analyst', 'ach-curious-explorer'],
  ['ach-curious-explorer', 'ach-space-scholar'],
  ['ach-space-scholar', 'ach-planet-pioneer'],
  ['ach-space-scholar', 'ach-master-cadet'],
  ['ach-master-cadet', 'ach-vault-archivist'],
  ['ach-vault-archivist', 'ach-cosmic-chronicler'],
  ['ach-cosmic-chronicler', 'ach-master-explorer'],
  ['ach-master-explorer', 'ach-curious-explorer'],
  ['ach-mission-historian', 'ach-space-scholar'],
  ['ach-space-scholar', 'ach-master-explorer'],
];

export const ACHIEVEMENT_TEMPLATES: AchievementTemplate[] = [
  {
    id: 'ach-planet-pioneer',
    title: 'Planet Pioneer',
    description: 'Survey at least 3 distinct celestial bodies in Planet Explorer.',
    badgeCode: 'GEO-01',
    category: 'exploration',
    iconName: 'Globe',
    targetValue: 3,
    constellationCoord: { x: 140, y: 160 },
    evaluator: (ctx) => {
      const distinctPlanets = new Set(
        ctx.events.filter((e) => e.eventType === 'planet_viewed' && e.entityId).map((e) => e.entityId)
      );
      const currentValue = distinctPlanets.size;
      return { currentValue, unlocked: currentValue >= 3 };
    },
  },
  {
    id: 'ach-cosmic-comparer',
    title: 'Cosmic Comparer',
    description: 'Conduct a multi-body comparative analysis in Planetary Comparison Lab.',
    badgeCode: 'LAB-02',
    category: 'analysis',
    iconName: 'Scale',
    targetValue: 1,
    constellationCoord: { x: 260, y: 110 },
    evaluator: (ctx) => {
      const comparisons = ctx.events.filter((e) => e.eventType === 'planet_comparison_completed');
      const currentValue = comparisons.length;
      return { currentValue, unlocked: currentValue >= 1 };
    },
  },
  {
    id: 'ach-mission-historian',
    title: 'Mission Historian',
    description: 'Inspect at least 3 historical or active spaceflight dossiers in Mission Control.',
    badgeCode: 'HIS-03',
    category: 'exploration',
    iconName: 'Rocket',
    targetValue: 3,
    constellationCoord: { x: 400, y: 90 },
    evaluator: (ctx) => {
      const distinctMissions = new Set(
        ctx.events.filter((e) => e.eventType === 'mission_viewed' && e.entityId).map((e) => e.entityId)
      );
      const currentValue = distinctMissions.size;
      return { currentValue, unlocked: currentValue >= 3 };
    },
  },
  {
    id: 'ach-timeline-traveler',
    title: 'Timeline Traveler',
    description: 'Complete a full animated flight mission replay in Cosmic Time Machine.',
    badgeCode: 'TIM-04',
    category: 'exploration',
    iconName: 'Clock',
    targetValue: 1,
    constellationCoord: { x: 550, y: 120 },
    evaluator: (ctx) => {
      const replays = ctx.events.filter((e) => e.eventType === 'mission_replay_completed');
      const currentValue = replays.length;
      return { currentValue, unlocked: currentValue >= 1 };
    },
  },
  {
    id: 'ach-mars-investigator',
    title: 'Mars Investigator',
    description: 'Inspect surface telemetry and scientific photos in Mars Rover Explorer.',
    badgeCode: 'ROV-05',
    category: 'exploration',
    iconName: 'Radio',
    targetValue: 2,
    constellationCoord: { x: 670, y: 190 },
    evaluator: (ctx) => {
      const inspectedPhotos = ctx.events.filter((e) => e.eventType === 'rover_image_inspected');
      const currentValue = inspectedPhotos.length;
      return { currentValue, unlocked: currentValue >= 2 };
    },
  },
  {
    id: 'ach-asteroid-analyst',
    title: 'Asteroid Analyst',
    description: 'Execute an orbital kinetic deflection simulation in Planetary Defense Lab.',
    badgeCode: 'NEO-06',
    category: 'analysis',
    iconName: 'ShieldAlert',
    targetValue: 1,
    constellationCoord: { x: 620, y: 320 },
    evaluator: (ctx) => {
      const sims = ctx.events.filter((e) => e.eventType === 'asteroid_simulation_completed');
      const currentValue = sims.length;
      return { currentValue, unlocked: currentValue >= 1 };
    },
  },
  {
    id: 'ach-curious-explorer',
    title: 'Space Intelligence Inquirer',
    description: 'Synthesize an autonomous briefing in Cosmo Intelligence.',
    badgeCode: 'INT-07',
    category: 'analysis',
    iconName: 'Network',
    targetValue: 1,
    constellationCoord: { x: 480, y: 260 },
    evaluator: (ctx) => {
      const briefings = ctx.events.filter((e) => e.eventType === 'briefing_generated');
      const currentValue = briefings.length;
      return { currentValue, unlocked: currentValue >= 1 };
    },
  },
  {
    id: 'ach-space-scholar',
    title: 'Space Scholar',
    description: 'Complete at least 3 structured lessons in the Learning Hub.',
    badgeCode: 'CUR-08',
    category: 'curriculum',
    iconName: 'BookOpen',
    targetValue: 3,
    constellationCoord: { x: 330, y: 240 },
    evaluator: (ctx) => {
      const currentValue = ctx.completedLessonIds.length;
      return { currentValue, unlocked: currentValue >= 3 };
    },
  },
  {
    id: 'ach-master-cadet',
    title: 'Stellar Quiz Ace',
    description: 'Pass at least 2 curriculum quizzes with a score of 70% or higher.',
    badgeCode: 'QUIZ-09',
    category: 'curriculum',
    iconName: 'Award',
    targetValue: 2,
    constellationCoord: { x: 210, y: 310 },
    evaluator: (ctx) => {
      const passedTrails = new Set(
        ctx.quizAttempts.filter((q) => q.passed).map((q) => q.trailId)
      );
      const currentValue = passedTrails.size;
      return { currentValue, unlocked: currentValue >= 2 };
    },
  },
  {
    id: 'ach-vault-archivist',
    title: 'Vault Archivist',
    description: 'Save at least 3 celestial objects or missions to your Personal Space Vault.',
    badgeCode: 'VAU-10',
    category: 'vault',
    iconName: 'Vault',
    targetValue: 3,
    constellationCoord: { x: 120, y: 370 },
    evaluator: (ctx) => {
      const currentValue = ctx.favorites.length;
      return { currentValue, unlocked: currentValue >= 3 };
    },
  },
  {
    id: 'ach-cosmic-chronicler',
    title: 'Cosmic Chronicler',
    description: 'Record your first observational or research entry in the Exploration Journal.',
    badgeCode: 'LOG-11',
    category: 'vault',
    iconName: 'PenTool',
    targetValue: 1,
    constellationCoord: { x: 290, y: 410 },
    evaluator: (ctx) => {
      const currentValue = ctx.journalNotes.length;
      return { currentValue, unlocked: currentValue >= 1 };
    },
  },
  {
    id: 'ach-master-explorer',
    title: 'Master Explorer',
    description: 'Demonstrate holistic proficiency by unlocking at least 8 achievements.',
    badgeCode: 'EXP-12',
    category: 'exploration',
    iconName: 'Sparkles',
    targetValue: 8,
    constellationCoord: { x: 420, y: 390 },
    evaluator: (ctx) => {
      // Evaluate other 11 achievements
      let otherUnlocked = 0;
      for (const t of ACHIEVEMENT_TEMPLATES) {
        if (t.id === 'ach-master-explorer') continue;
        const res = t.evaluator(ctx);
        if (res.unlocked) otherUnlocked++;
      }
      return { currentValue: otherUnlocked, unlocked: otherUnlocked >= 8 };
    },
  },
];

export function computeAchievements(
  context: AchievementEvaluationContext,
  previousAchievements?: Achievement[]
): Achievement[] {
  const previousMap = new Map<string, Achievement>();
  if (previousAchievements) {
    previousAchievements.forEach((a) => previousMap.set(a.id, a));
  }

  return ACHIEVEMENT_TEMPLATES.map((tmpl) => {
    const { currentValue, unlocked } = tmpl.evaluator(context);
    const prev = previousMap.get(tmpl.id);

    let unlockedAt = prev?.unlockedAt;
    if (unlocked && !unlockedAt) {
      unlockedAt = new Date().toISOString();
    } else if (!unlocked) {
      unlockedAt = undefined;
    }

    const progress = Math.min(1, Math.max(0, currentValue / tmpl.targetValue));

    return {
      id: tmpl.id,
      title: tmpl.title,
      description: tmpl.description,
      badgeCode: tmpl.badgeCode,
      category: tmpl.category,
      iconName: tmpl.iconName,
      unlockedAt,
      progress,
      targetValue: tmpl.targetValue,
      currentValue,
      constellationCoord: tmpl.constellationCoord,
    };
  });
}

export function computeExplorerRank(achievements: Achievement[]): {
  rank: string;
  level: number;
  unlockedCount: number;
  totalCount: number;
} {
  const unlockedCount = achievements.filter((a) => !!a.unlockedAt).length;
  const totalCount = achievements.length;

  // Level 1 to 5
  let rank = 'Novice Observer';
  let level = 1;

  if (unlockedCount >= 10) {
    rank = 'Master of the Cosmos';
    level = 5;
  } else if (unlockedCount >= 7) {
    rank = 'Deep Space Voyager';
    level = 4;
  } else if (unlockedCount >= 4) {
    rank = 'Orbital Cartographer';
    level = 3;
  } else if (unlockedCount >= 2) {
    rank = 'Cadet Explorer';
    level = 2;
  }

  return { rank, level, unlockedCount, totalCount };
}
