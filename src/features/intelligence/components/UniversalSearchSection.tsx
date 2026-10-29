import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Globe,
  Rocket,
  Compass,
  CircleDot,
  FileText,
  Layers,
  ArrowRight,
  Sparkles,
  Command,
} from 'lucide-react';
import { EntityType, SearchResult } from '../../../types';
import { searchIndexService } from '../services';

export const UniversalSearchSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<EntityType | 'all'>('all');

  const filterOptions: Array<{ id: EntityType | 'all'; label: string; icon: React.FC<any> }> = [
    { id: 'all', label: 'All Catalog', icon: Layers },
    { id: 'planet', label: 'Planets', icon: Globe },
    { id: 'mission', label: 'Missions', icon: Rocket },
    { id: 'milestone', label: 'Milestones', icon: Compass },
    { id: 'rover', label: 'Mars Rovers', icon: Compass },
    { id: 'asteroid', label: 'Asteroids', icon: CircleDot },
    { id: 'briefing', label: 'Briefings', icon: FileText },
  ];

  const searchResults: SearchResult[] = useMemo(() => {
    return searchIndexService.query(searchQuery, {
      entityType: activeFilter,
      limit: 12,
    });
  }, [searchQuery, activeFilter]);

  const getEntityBadgeStyle = (type: EntityType) => {
    switch (type) {
      case 'planet':
        return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';
      case 'mission':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
      case 'rover':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
      case 'asteroid':
        return 'border-purple-500/30 bg-purple-500/10 text-purple-300';
      case 'milestone':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-300';
      case 'briefing':
        return 'border-rose-500/30 bg-rose-500/10 text-rose-300';
      default:
        return 'border-slate-700 bg-slate-800 text-slate-300';
    }
  };

  return (
    <div id="search" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Search className="h-4 w-4" />
            <span>Inverted Token Search Index</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-display">
            Universal Smart Discovery
          </h2>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-400">
          <Command className="h-3.5 w-3.5 text-cyan-400" />
          <span>Press</span>
          <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-white">Ctrl + K</kbd>
          <span>for quick palette</span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search planets, trajectories, rovers, asteroids, or missions by keyword (e.g., 'Jezero', 'Apophis', 'Titan')..."
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-6">
        {filterOptions.map((f) => {
          const Icon = f.icon;
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'border border-cyan-500 bg-cyan-500/20 text-cyan-200'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results Header / Stats */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
        <span>
          Showing <strong className="text-white">{searchResults.length}</strong> indexed items
          {searchQuery && (
            <span>
              {' '}matching "<strong className="text-cyan-400">{searchQuery}</strong>"
            </span>
          )}
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          Scoring: Weighted In-Memory Rank
        </span>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {searchResults.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.route)}
            className="group cursor-pointer rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getEntityBadgeStyle(
                    item.entityType
                  )}`}
                >
                  {item.entityType}
                </span>

                {item.relevanceScore > 0 && (
                  <span className="flex items-center gap-1 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300">
                    <Sparkles className="h-3 w-3 text-cyan-400" />
                    <span>{item.relevanceScore} pts</span>
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
                {item.title}
              </h4>
              <div className="text-xs text-slate-400 mb-2 font-mono">{item.subtitle}</div>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                {item.description}
              </p>
            </div>

            <div className="border-t border-slate-800/60 pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate max-w-[180px]">
                {item.matchedFields?.length ? `Matched in ${item.matchedFields.join(', ')}` : 'Direct Index'}
              </span>
              <span className="flex items-center gap-1 text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

