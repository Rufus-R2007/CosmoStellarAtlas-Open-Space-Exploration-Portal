import React from 'react';
import {
  Brain,
  Search,
  FileText,
  Network,
  Sparkles,
  ShieldCheck,
  Zap,
  Database,
  Layers,
} from 'lucide-react';
import { planetsData, missionsData, roversData, asteroidsData } from '../../../data';

interface Props {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
}

export const CosmoIntelligenceHero: React.FC<Props> = ({
  activeSection,
  onSelectSection,
}) => {
  const totalEntities =
    planetsData.length + missionsData.length + roversData.length + asteroidsData.length;

  const quickNav = [
    { id: 'briefings', label: 'Cosmic Briefings', icon: FileText, count: '5 Feeds' },
    { id: 'ask-atlas', label: 'Ask the Atlas', icon: Brain, count: '14 Intents' },
    { id: 'search', label: 'Smart Search', icon: Search, count: 'Universal' },
    { id: 'graph', label: 'Discovery Graph', icon: Network, count: 'Relational' },
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles, count: 'Contextual' },
    { id: 'evidence', label: 'Evidence Audit', icon: ShieldCheck, count: 'Explainable' },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-cyan-950/20">
      {/* Decorative Background Orbs */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            Phase 6 Active • Space Intelligence & Smart Discovery
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            100% Offline • Zero External APIs • Explainable AI
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
            <Database className="h-3.5 w-3.5 text-purple-400" />
            Curated Scientific Ephemeris Corpus
          </span>
        </div>

        {/* Title and Vision */}
        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3 font-display">
            Cosmo Intelligence & Explainable Space Discovery
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-6">
            Connecting Planets, Missions, Rovers, and Asteroids through deterministic reasoning,
            cross-module knowledge indexing, and structured scientific briefing synthesis.
            Transparent, zero-hallucination intelligence designed for rigorous space science exploration.
          </p>
        </div>

        {/* Real-time Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Indexed Entities</span>
              <Database className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-tight">{totalEntities} Records</div>
            <div className="text-[11px] text-cyan-400/80 mt-0.5">Planets, Missions, Rovers, Asteroids</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Query Engine</span>
              <Brain className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-tight">14 Rule Intents</div>
            <div className="text-[11px] text-purple-400/80 mt-0.5">Aho-Corasick & Deterministic Regex</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Inference Latency</span>
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-tight">&lt; 3 ms</div>
            <div className="text-[11px] text-amber-400/80 mt-0.5">Instantaneous In-Memory Execution</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Relational Graph</span>
              <Layers className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-tight">Multi-Hop</div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5">Mission, Planet & Rover Topology</div>
          </div>
        </div>

        {/* Anchor Navigation Bar */}
        <div className="border-t border-slate-800/80 pt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <span>Explore Subsystems</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'border border-cyan-500 bg-cyan-500/20 text-cyan-200 shadow-md shadow-cyan-500/20'
                      : 'border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  <span
                    className={`ml-1 rounded px-1.5 py-0.5 text-[10px] font-mono ${
                      isActive
                        ? 'bg-cyan-500/30 text-cyan-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

