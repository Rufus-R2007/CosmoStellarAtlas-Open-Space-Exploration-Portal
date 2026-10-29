import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  Globe,
  Rocket,
  Compass,
} from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { recommendationEngineService } from '../services';

export const ExplainableRecommendationsSection: React.FC = () => {
  const navigate = useNavigate();
  const selectedYear = useAppStore((state) => state.selectedYear);
  const selectedMissionId = useAppStore((state) => state.selectedMissionId);
  const selectedRoverId = useAppStore((state) => state.selectedRoverId);
  const selectedAsteroidId = useAppStore((state) => state.selectedAsteroidId);

  // Generate explainable recommendations based on active user state
  const recommendations = recommendationEngineService.generateRecommendations({
    selectedYear,
    selectedMissionId,
    selectedRoverId,
    selectedAsteroidId,
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'direct_relation':
        return { label: 'Direct Relation', style: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' };
      case 'temporal_context':
        return { label: 'Temporal Context', style: 'border-purple-500/30 bg-purple-500/10 text-purple-300' };
      case 'scientific_parallel':
        return { label: 'Scientific Parallel', style: 'border-amber-500/30 bg-amber-500/10 text-amber-300' };
      case 'exploratory_curiosity':
      default:
        return { label: 'Exploratory Curiosity', style: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' };
    }
  };

  return (
    <div id="recommendations" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Deterministic Scoring Matrix</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-display">
            Explainable Contextual Recommendations
          </h2>
        </div>

        {/* Current Active User Context Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Derived from active context:</span>
          {selectedYear && (
            <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-300 font-mono">
              <Calendar className="h-3 w-3" />
              Year {selectedYear}
            </span>
          )}
          {selectedRoverId && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-300 font-mono">
              <Compass className="h-3 w-3" />
              {selectedRoverId}
            </span>
          )}
          {selectedMissionId && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-300 font-mono">
              <Rocket className="h-3 w-3" />
              {selectedMissionId}
            </span>
          )}
          {!selectedMissionId && !selectedRoverId && (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
              <Globe className="h-3 w-3" />
              Global Solar System State
            </span>
          )}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => {
          const categoryBadge = getCategoryBadge(rec.category);
          return (
            <div
              key={rec.id}
              className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-5 flex flex-col justify-between hover:border-amber-500/40 transition-all space-y-4"
            >
              <div>
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${categoryBadge.style}`}
                  >
                    {categoryBadge.label}
                  </span>
                  <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                    {(rec.relevanceScore * 100).toFixed(0)}% Match
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{rec.title}</h3>
                <div className="text-xs text-slate-400 font-mono mb-2">{rec.subtitle}</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {rec.description}
                </p>

                {/* Explainable Rationale Callout */}
                <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-2.5 text-xs text-amber-200/90 flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 block font-semibold mb-0.5">Why recommended:</strong>
                    <span>{rec.explanation}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate(rec.route)}
                className="inline-flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-amber-400 hover:text-white transition-all w-full"
              >
                <span>Launch Exploration</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
