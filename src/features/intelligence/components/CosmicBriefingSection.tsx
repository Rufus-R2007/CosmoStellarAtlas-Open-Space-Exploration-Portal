import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { BriefingCategory, GeneratedBriefing } from '../../../types';
import { briefingGeneratorService } from '../services';
import { useAppStore } from '../../../store/useAppStore';
import { useVaultStore } from '../../../store/useVaultStore';

interface Props {
  onInspectEvidence?: (briefing: GeneratedBriefing) => void;
}

export const CosmicBriefingSection: React.FC<Props> = ({ onInspectEvidence }) => {
  const navigate = useNavigate();
  const selectedYear = useAppStore((state) => state.selectedYear) || 1969;
  const setSelectedYear = useAppStore((state) => state.setSelectedYear);

  const [activeCategory, setActiveCategory] = useState<BriefingCategory>('mission_highlights');
  const [localYear, setLocalYear] = useState<number>(selectedYear);

  // Generate active briefing dynamically
  const briefing = briefingGeneratorService.generateBriefing(activeCategory, localYear);

  const logExplorationEvent = useVaultStore((s) => s.logExplorationEvent);

  useEffect(() => {
    logExplorationEvent('briefing_generated', briefing.id, {
      category: briefing.category,
      title: briefing.title,
    });
  }, [briefing.id, logExplorationEvent, briefing.category, briefing.title]);

  const categories: Array<{ id: BriefingCategory; label: string; badge: string }> = [
    { id: 'mission_highlights', label: 'Mission Highlights', badge: 'Active Fleet' },
    { id: 'planetary_discoveries', label: 'Planetary Science', badge: 'Solar System' },
    { id: 'mars_exploration', label: 'Mars Exploration', badge: 'Surface Ops' },
    { id: 'asteroid_watch', label: 'Asteroid Watch', badge: 'Planetary Defense' },
    { id: 'historical_exploration', label: 'Historical Exploration', badge: `Year ${localYear}` },
  ];

  const landmarkYears = [1957, 1969, 1977, 1997, 2012, 2020, 2026];

  const handleYearChange = (year: number) => {
    setLocalYear(year);
    setSelectedYear(year);
  };

  return (
    <div id="briefings" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText className="h-4 w-4" />
            <span>Cosmic Briefing Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-display">
            Autonomous Spaceflight & Celestial Intelligence Bulletins
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-cyan-400" />
          <span>Dataset Reference: {briefing.referenceDate}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-6">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? 'border border-cyan-500 bg-cyan-500/20 text-cyan-200 shadow-md shadow-cyan-500/10'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] ${
                  isActive ? 'bg-cyan-500/30 text-cyan-200 font-semibold' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {cat.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Historical Exploration Year Controls (Only visible when Historical tab is active) */}
      {activeCategory === 'historical_exploration' && (
        <div className="mb-6 rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
              <Clock className="h-4 w-4 text-purple-400" />
              <span>Cosmic Time Machine Year Synchronizer</span>
            </div>
            <div className="text-xs text-purple-300/80 font-mono">
              Active Historical Epoch: <strong className="text-white text-sm">{localYear}</strong>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1957"
                max="2026"
                value={localYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <input
                type="number"
                min="1957"
                max="2026"
                value={localYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value, 10) || 1957)}
                className="w-20 rounded-lg border border-purple-500/40 bg-slate-900 px-2 py-1 text-center text-sm font-bold text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Landmark Quick Jump Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Landmark Epochs:</span>
              {landmarkYears.map((yr) => (
                <button
                  key={yr}
                  onClick={() => handleYearChange(yr)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-mono transition-colors ${
                    localYear === yr
                      ? 'border border-purple-400 bg-purple-500/30 text-white font-bold'
                      : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Briefing Content Card */}
      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-300">
              {briefing.categoryLabel}
            </span>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] text-slate-300">
              {briefing.periodLabel}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
            {briefing.title}
          </h3>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            {briefing.summary}
          </p>
        </div>

        {/* Key Takeaways */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Key Scientific & Operational Highlights</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {briefing.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3.5 hover:border-slate-700 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-slate-300 leading-normal">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Source References */}
        {briefing.sourceReferences.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Consulted Primary Datasets & Ephemeris Records
            </h4>
            <div className="flex flex-wrap gap-2">
              {briefing.sourceReferences.map((ref) => (
                <button
                  key={ref.id}
                  onClick={() => navigate(ref.route)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span className="font-medium">{ref.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({ref.provenance})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Next Suggested Action & Evidence Audit CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/20 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/20 p-2 text-cyan-400">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                {briefing.suggestedNextExploration.label}
              </div>
              <div className="text-xs text-slate-400">
                {briefing.suggestedNextExploration.description}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onInspectEvidence && (
              <button
                onClick={() => onInspectEvidence(briefing)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Audit Rules</span>
              </button>
            )}
            <button
              onClick={() => navigate(briefing.suggestedNextExploration.route)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20 transition-all"
            >
              <span>Explore Module</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

