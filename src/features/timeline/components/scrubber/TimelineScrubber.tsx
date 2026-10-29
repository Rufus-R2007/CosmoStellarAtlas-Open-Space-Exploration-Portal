import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useAppStore } from '../../../../store';

interface TimelineScrubberProps {
  minYear?: number;
  maxYear?: number;
  landmarkYears: number[];
  onYearSelect: (year: number) => void;
}

const decadesList = [
  { label: '1950s', start: 1957 },
  { label: '1960s', start: 1961 },
  { label: '1970s', start: 1971 },
  { label: '1980s', start: 1986 },
  { label: '1990s', start: 1990 },
  { label: '2000s', start: 2004 },
  { label: '2010s', start: 2011 },
  { label: '2020s', start: 2021 },
];

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  minYear = 1957,
  maxYear = 2026,
  landmarkYears,
  onYearSelect,
}) => {
  const { selectedYear, setSelectedYear } = useAppStore();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Jump to Next Landmark Milestone Year
  const handleNextMilestone = useCallback(() => {
    const futureLandmarks = landmarkYears.filter((y) => y > selectedYear).sort((a, b) => a - b);
    if (futureLandmarks.length > 0) {
      const next = futureLandmarks[0];
      setSelectedYear(next);
      onYearSelect(next);
    } else {
      setSelectedYear(maxYear);
      onYearSelect(maxYear);
    }
  }, [landmarkYears, selectedYear, maxYear, setSelectedYear, onYearSelect]);

  // Jump to Previous Landmark Milestone Year
  const handlePrevMilestone = useCallback(() => {
    const pastLandmarks = landmarkYears.filter((y) => y < selectedYear).sort((a, b) => b - a);
    if (pastLandmarks.length > 0) {
      const prev = pastLandmarks[0];
      setSelectedYear(prev);
      onYearSelect(prev);
    } else {
      setSelectedYear(minYear);
      onYearSelect(minYear);
    }
  }, [landmarkYears, selectedYear, minYear, setSelectedYear, onYearSelect]);

  // Reset to Latest Available Year
  const handleResetLatest = () => {
    setSelectedYear(maxYear);
    onYearSelect(maxYear);
    setIsPlaying(false);
  };

  // Auto-play timeline progression
  useEffect(() => {
    if (!isPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setSelectedYear(
        selectedYear >= maxYear ? minYear : selectedYear + 1
      );
      onYearSelect(selectedYear >= maxYear ? minYear : selectedYear + 1);
    }, 1200);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, selectedYear, minYear, maxYear, setSelectedYear, onYearSelect]);

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      const next = Math.min(maxYear, selectedYear + 1);
      setSelectedYear(next);
      onYearSelect(next);
    } else if (e.key === 'ArrowLeft') {
      const prev = Math.max(minYear, selectedYear - 1);
      setSelectedYear(prev);
      onYearSelect(prev);
    } else if (e.key === 'Home') {
      setSelectedYear(minYear);
      onYearSelect(minYear);
    } else if (e.key === 'End') {
      setSelectedYear(maxYear);
      onYearSelect(maxYear);
    }
  };

  const progressPercent = ((selectedYear - minYear) / (maxYear - minYear)) * 100;
  const isLandmark = landmarkYears.includes(selectedYear);

  return (
    <div
      className="bg-[#0A1021] border border-[#141D30] rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xl relative overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Cosmic Timeline Scrubber"
    >
      {/* Top Scrubber HUD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141D30] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8565FA]/15 border border-[#8565FA]/30 flex items-center justify-center text-[#8565FA]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-lg text-[#F5F7FF] uppercase tracking-wide">
                Temporal Chronology Scrubber
              </span>
              {isLandmark && (
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFB45B]/15 text-[#FFB45B] border border-[#FFB45B]/30 font-semibold uppercase animate-pulse">
                  <Sparkles className="w-2.5 h-2.5" />
                  Landmark Epoch
                </span>
              )}
            </div>
            <p className="font-body text-xs text-[#98A7BF]">
              Scrub or step through {minYear} to {maxYear} to inspect missions, milestones, and active planetary surveys
            </p>
          </div>
        </div>

        {/* Selected Year Display HUD */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="bg-[#060B19] border border-[#20D9F2]/30 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] font-mono uppercase text-[#98A7BF] block">Active Epoch</span>
            <span className="font-headline text-2xl sm:text-3xl font-black text-[#20D9F2] tracking-wider">
              {selectedYear}
            </span>
          </div>
        </div>
      </div>

      {/* Main Range Slider with Tick Highlights */}
      <div className="space-y-3 relative pt-2">
        {/* Slider Input Track */}
        <div className="relative py-2">
          {/* Custom Track Background */}
          <div className="h-3 w-full bg-[#060B19] border border-[#141D30] rounded-full relative overflow-hidden">
            {/* Progress Fill */}
            <div
              className="h-full bg-gradient-to-r from-[#8565FA] via-[#20D9F2] to-[#FFB45B] transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Native Range Slider */}
          <input
            type="range"
            min={minYear}
            max={maxYear}
            step={1}
            value={selectedYear}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setSelectedYear(val);
              onYearSelect(val);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            aria-label="Timeline Year Range"
          />

          {/* Milestone Tick Dots on Track */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none flex justify-between px-1 z-10">
            {landmarkYears.map((year) => {
              const leftPercent = ((year - minYear) / (maxYear - minYear)) * 100;
              const isCurrent = year === selectedYear;
              return (
                <div
                  key={year}
                  className={`w-1.5 h-1.5 rounded-full transition-transform absolute -translate-x-1/2 ${
                    isCurrent
                      ? 'w-3 h-3 bg-[#FFB45B] ring-4 ring-[#FFB45B]/30'
                      : year <= selectedYear
                      ? 'bg-[#F5F7FF]'
                      : 'bg-[#141D30]'
                  }`}
                  style={{ left: `${leftPercent}%` }}
                  title={`Landmark: ${year}`}
                />
              );
            })}
          </div>
        </div>

        {/* Min / Max Labels */}
        <div className="flex justify-between text-[11px] font-mono text-[#98A7BF] px-1">
          <span>{minYear} (Sputnik 1)</span>
          <span>{Math.round((minYear + maxYear) / 2)}</span>
          <span>{maxYear} (Artemis & Deep Space)</span>
        </div>
      </div>

      {/* Decade Jump Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
        <span className="text-[11px] font-mono text-[#98A7BF] uppercase shrink-0 mr-1 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-[#FFB45B]" />
          Jump Decades:
        </span>
        {decadesList.map((dec) => {
          const isCurrentDecade =
            selectedYear >= dec.start && selectedYear < dec.start + 10;
          return (
            <button
              key={dec.label}
              onClick={() => {
                setSelectedYear(dec.start);
                onYearSelect(dec.start);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold uppercase transition-all shrink-0 border ${
                isCurrentDecade
                  ? 'bg-[#20D9F2] text-[#00363E] border-[#20D9F2] shadow-lg shadow-[#20D9F2]/20'
                  : 'bg-[#060B19] border-[#141D30] text-[#98A7BF] hover:text-[#F5F7FF] hover:border-[#20D9F2]/30'
              }`}
            >
              {dec.label}
            </button>
          );
        })}
      </div>

      {/* Bottom Playback & Milestone Stepper Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#141D30]">
        {/* Left: Previous Milestone / Play / Next Milestone */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMilestone}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10182B] hover:bg-[#141D30] border border-[#141D30] text-xs font-headline font-bold uppercase text-[#98A7BF] hover:text-[#F5F7FF] transition-colors"
            title="Step to Previous Landmark Milestone"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Milestone</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#20D9F2]/10 hover:bg-[#20D9F2]/20 border border-[#20D9F2]/30 text-xs font-headline font-bold uppercase text-[#20D9F2] transition-colors"
            title={isPlaying ? 'Pause Auto-Chronology' : 'Auto-Play Chronology'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={handleNextMilestone}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10182B] hover:bg-[#141D30] border border-[#141D30] text-xs font-headline font-bold uppercase text-[#98A7BF] hover:text-[#F5F7FF] transition-colors"
            title="Step to Next Landmark Milestone"
          >
            <span>Next Milestone</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Reset to Latest */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-[#98A7BF] hidden md:inline">
            Use Left / Right arrow keys to step years
          </span>

          <button
            onClick={handleResetLatest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10182B] hover:bg-[#141D30] border border-[#141D30] text-xs font-headline font-bold uppercase text-[#98A7BF] hover:text-[#F5F7FF] transition-colors"
            title="Reset to Present Reference Year"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Present</span>
          </button>
        </div>
      </div>
    </div>
  );
};
