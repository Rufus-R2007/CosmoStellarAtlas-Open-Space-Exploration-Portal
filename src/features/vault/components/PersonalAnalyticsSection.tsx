import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Activity, BarChart3, PieChart as PieIcon } from 'lucide-react';
import { useVaultStore } from '../../../store/useVaultStore';
import { learningTrails } from '../../../data/learningTrails';

export const PersonalAnalyticsSection: React.FC = () => {
  const explorationEvents = useVaultStore((s) => s.explorationEvents);
  const completedLessonIds = useVaultStore((s) => s.completedLessonIds);
  const quizAttempts = useVaultStore((s) => s.quizAttempts);
  const achievements = useVaultStore((s) => s.achievements);

  // 1. Activity Breakdown Data
  const activityCounts: Record<string, number> = {
    'Planetary Science': 0,
    'Missions & History': 0,
    'Mars Telemetry': 0,
    'Asteroid Defense': 0,
    'Space Intelligence': 0,
    'Curriculum': 0,
    'Vault & Journal': 0,
  };

  explorationEvents.forEach((e) => {
    switch (e.eventType) {
      case 'planet_viewed':
      case 'planet_comparison_completed':
        activityCounts['Planetary Science']++;
        break;
      case 'mission_viewed':
      case 'mission_replay_completed':
        activityCounts['Missions & History']++;
        break;
      case 'rover_image_inspected':
        activityCounts['Mars Telemetry']++;
        break;
      case 'asteroid_simulation_completed':
        activityCounts['Asteroid Defense']++;
        break;
      case 'briefing_generated':
        activityCounts['Space Intelligence']++;
        break;
      case 'lesson_completed':
      case 'quiz_passed':
        activityCounts['Curriculum']++;
        break;
      case 'favorite_added':
      case 'note_created':
        activityCounts['Vault & Journal']++;
        break;
    }
  });

  const ACTIVITY_COLORS = [
    '#20D9F2',
    '#8565FA',
    '#FFB45B',
    '#FF5B5B',
    '#38BDF8',
    '#4EFA9D',
    '#FA6CE8',
  ];

  const activityChartData = Object.entries(activityCounts).map(([name, count], idx) => ({
    name,
    count,
    color: ACTIVITY_COLORS[idx % ACTIVITY_COLORS.length],
  }));

  // 2. Curriculum Trails Progress Data
  const trailProgressData = learningTrails.map((trail) => {
    const completedCount = trail.lessons.filter((l) =>
      completedLessonIds.includes(l.id)
    ).length;
    const trailAttempts = quizAttempts.filter((q) => q.trailId === trail.id);
    const bestScore = trailAttempts.length > 0
      ? Math.max(...trailAttempts.map((q) => q.scorePercent))
      : 0;

    return {
      name: trail.category,
      completedLessons: completedCount,
      totalLessons: trail.lessons.length,
      bestScore,
    };
  });

  // 3. Achievement Breakdown by Category
  const categories = ['exploration', 'analysis', 'curriculum', 'vault'] as const;
  const achievementCategoryData = categories.map((cat) => {
    const inCat = achievements.filter((a) => a.category === cat);
    const unlocked = inCat.filter((a) => !!a.unlockedAt).length;
    return {
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      unlocked,
      total: inCat.length,
      percentage: inCat.length > 0 ? Math.round((unlocked / inCat.length) * 100) : 0,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2.5 rounded-lg bg-[#0B1528] border border-white/20 text-xs shadow-xl font-mono">
          <p className="text-white font-bold">{label || payload[0]?.name}</p>
          <p className="text-[#20D9F2]">
            {payload[0]?.value} {payload[0]?.name === 'bestScore' ? '%' : 'actions'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#20D9F2]" />
          <span>Personal Exploration Analytics</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Quantified behavioral metrics tracking module utilization, curriculum progress, and milestone achievement velocity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Distribution Chart */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1528]/80 backdrop-blur-md p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#20D9F2]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Exploration Activity Distribution
              </h3>
            </div>
            <span className="text-xs font-mono text-gray-400">
              {explorationEvents.length} Total Events
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" stroke="#6B7280" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#6B7280"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  width={110}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {activityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] font-mono text-gray-500 pt-3 border-t border-white/5 text-center">
            Derived deterministically from local exploration events
          </div>
        </div>

        {/* Curriculum Mastery Bar Chart */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1528]/80 backdrop-blur-md p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#8565FA]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Curriculum Trail Performance
              </h3>
            </div>
            <span className="text-xs font-mono text-gray-400">
              Completed Lessons vs Quiz Score
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trailProgressData}
                margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#6B7280"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                />
                <YAxis stroke="#6B7280" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-lg bg-[#0B1528] border border-white/20 text-xs shadow-xl font-mono">
                          <p className="text-white font-bold mb-1">{label}</p>
                          <p className="text-[#20D9F2]">
                            Lessons: {data.completedLessons} / {data.totalLessons}
                          </p>
                          <p className="text-[#FFB45B]">
                            Best Quiz Score: {data.bestScore}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="completedLessons"
                  name="Lessons Completed"
                  fill="#20D9F2"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="bestScore"
                  name="Best Quiz Score %"
                  fill="#8565FA"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-white/5 text-[11px] font-mono text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#20D9F2]" />
              Lessons Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8565FA]" />
              Best Quiz Score (%)
            </span>
          </div>
        </div>
      </div>

      {/* Category Progress Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievementCategoryData.map((cat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-300 font-semibold">{cat.category}</span>
              <span className="text-[#20D9F2]">{cat.unlocked}/{cat.total}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#8565FA] to-[#20D9F2] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${cat.percentage}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-gray-500 block">
              {cat.percentage}% Unlocked
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
