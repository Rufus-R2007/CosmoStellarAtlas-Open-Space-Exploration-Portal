import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Globe,
  Rocket,
  Compass,
  CircleDot,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store';
import { searchIndexService } from '../../features/intelligence/services';
import { SearchResult, EntityType } from '../../types';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const hits = searchIndexService.query(searchTerm, { limit: 12 });
    setResults(hits);
    setSelectedIndex(0);
  }, [searchTerm]);

  const handleSelect = (path: string) => {
    setCommandPaletteOpen(false);
    navigate(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex].route);
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'planet':
        return <Globe className="w-4 h-4 text-[#20D9F2]" />;
      case 'mission':
        return <Rocket className="w-4 h-4 text-[#FFB45B]" />;
      case 'rover':
        return <Compass className="w-4 h-4 text-[#10B981]" />;
      case 'asteroid':
        return <CircleDot className="w-4 h-4 text-[#8565FA]" />;
      case 'briefing':
        return <FileText className="w-4 h-4 text-[#F43F5E]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#98A7BF]" />;
    }
  };

  const getEntityBadgeStyle = (type: EntityType) => {
    switch (type) {
      case 'planet':
        return 'border-[#20D9F2]/30 bg-[#20D9F2]/10 text-[#20D9F2]';
      case 'mission':
        return 'border-[#FFB45B]/30 bg-[#FFB45B]/10 text-[#FFB45B]';
      case 'rover':
        return 'border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]';
      case 'asteroid':
        return 'border-[#8565FA]/30 bg-[#8565FA]/10 text-[#CBBEFF]';
      default:
        return 'border-slate-700 bg-slate-800 text-slate-300';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setCommandPaletteOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl bg-[#0A1021] border border-[#25334B] rounded-2xl shadow-2xl overflow-hidden text-[#F5F7FF] flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#141D30] gap-3 bg-[#060B19]/70">
          <Search className="w-5 h-5 text-[#20D9F2] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search planets, missions, rovers, asteroids, or briefings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[#F5F7FF] placeholder-[#98A7BF] font-body text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#98A7BF] hover:text-[#F5F7FF] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center font-mono text-[10px] px-2 py-0.5 rounded bg-[#10182B] border border-[#141D30] text-[#98A7BF]">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {!searchTerm && (
            <div className="py-8 text-center text-xs text-[#98A7BF] space-y-1">
              <p className="font-headline font-semibold text-[#F5F7FF] uppercase">
                Universal Smart Command Palette
              </p>
              <p>Type keywords like "Mars", "Apollo 11", "Perseverance", "Apophis", or "1969" to inspect records.</p>
            </div>
          )}

          {searchTerm && results.length === 0 && (
            <div className="py-8 text-center text-xs text-[#98A7BF]">
              No celestial records found matching "{searchTerm}".
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-1.5">
              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.route)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#20D9F2] bg-[#10182B] shadow-md shadow-[#20D9F2]/10'
                        : 'border-[#141D30] bg-[#060B19]/60 hover:bg-[#10182B]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div className="shrink-0 rounded-lg p-2 bg-[#141D30]">
                        {getEntityIcon(item.entityType)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-headline text-sm font-semibold text-white truncate">
                            {item.title}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.2 text-[9px] font-semibold uppercase tracking-wider ${getEntityBadgeStyle(
                              item.entityType
                            )}`}
                          >
                            {item.entityType}
                          </span>
                        </div>
                        <div className="font-mono text-xs text-[#98A7BF] truncate">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.relevanceScore > 0 && (
                        <span className="hidden sm:inline-block font-mono text-[10px] text-cyan-400/80">
                          {item.relevanceScore} pts
                        </span>
                      )}
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? 'text-[#20D9F2] translate-x-0.5' : 'text-[#98A7BF]'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-[#060B19] border-t border-[#141D30] flex items-center justify-between text-[11px] font-mono text-[#98A7BF]">
          <span>Use ↑ ↓ arrows to navigate • ↵ Enter to select</span>
          <span>CosmoStellarAtlas Inverted Index</span>
        </div>
      </div>
    </div>
  );
};
