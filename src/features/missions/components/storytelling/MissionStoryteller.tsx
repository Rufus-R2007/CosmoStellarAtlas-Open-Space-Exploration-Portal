import React, { useState } from 'react';
import { BookOpen, ChevronRight, ChevronLeft, Award, Compass, Shield, Rocket, Sparkles } from 'lucide-react';
import { Mission, MissionStoryline } from '../../../../types';

interface MissionStorytellerProps {
  mission: Mission;
}

type ChapterKey = 'theChallenge' | 'theMission' | 'theJourney' | 'theDiscovery' | 'theLegacy';

interface ChapterConfig {
  key: ChapterKey;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const chapters: ChapterConfig[] = [
  {
    key: 'theChallenge',
    title: 'The Challenge',
    subtitle: 'Astronomical & Engineering Hurdle',
    icon: <Shield className="w-4 h-4 text-[#FFB45B]" />,
  },
  {
    key: 'theMission',
    title: 'The Mission',
    subtitle: 'System Architecture & Objectives',
    icon: <Rocket className="w-4 h-4 text-[#20D9F2]" />,
  },
  {
    key: 'theJourney',
    title: 'The Journey',
    subtitle: 'Translunar & Interplanetary Transit',
    icon: <Compass className="w-4 h-4 text-[#8565FA]" />,
  },
  {
    key: 'theDiscovery',
    title: 'The Discovery',
    subtitle: 'Breakthrough Planetary Science',
    icon: <Sparkles className="w-4 h-4 text-[#20D9F2]" />,
  },
  {
    key: 'theLegacy',
    title: 'The Legacy',
    subtitle: 'Enduring Human & Scientific Impact',
    icon: <Award className="w-4 h-4 text-[#FFB45B]" />,
  },
];

export const MissionStoryteller: React.FC<MissionStorytellerProps> = ({ mission }) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const storyline: MissionStoryline | undefined = mission.storyline;

  if (!storyline) {
    return (
      <div className="bg-[#0A1021] border border-[#141D30] rounded-2xl p-6 text-center">
        <p className="text-xs font-mono text-[#98A7BF]">
          Curated historical narrative undergoing archival transcription.
        </p>
      </div>
    );
  }

  const currentChapter = chapters[activeChapterIndex];
  const chapterText = storyline[currentChapter.key];

  return (
    <div className="bg-[#0A1021] border border-[#141D30] rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141D30] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#8565FA]/15 border border-[#8565FA]/30 flex items-center justify-center text-[#8565FA]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline text-lg sm:text-xl font-bold uppercase tracking-tight text-[#F5F7FF]">
              Mission Storytelling Engine
            </h3>
            <p className="font-body text-xs text-[#98A7BF]">
              Chronological narrative chapters declassified from mission flight logs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#20D9F2] bg-[#20D9F2]/10 border border-[#20D9F2]/25 px-2.5 py-1 rounded-lg">
            Chapter {activeChapterIndex + 1} of {chapters.length}
          </span>
        </div>
      </div>

      {/* Chapter Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {chapters.map((chap, idx) => {
          const isActive = idx === activeChapterIndex;
          return (
            <button
              key={chap.key}
              onClick={() => setActiveChapterIndex(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-headline font-bold uppercase transition-all duration-200 border text-left ${
                isActive
                  ? 'bg-[#10182B] border-[#20D9F2] text-[#F5F7FF] shadow-lg shadow-[#20D9F2]/10'
                  : 'bg-[#060B19]/60 border-[#141D30] text-[#98A7BF] hover:border-[#20D9F2]/40 hover:text-[#F5F7FF]'
              }`}
            >
              <span className="shrink-0">{chap.icon}</span>
              <span className="truncate">{chap.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Chapter Narrative Content Box */}
      <div className="bg-[#060B19]/80 border border-[#141D30] rounded-xl p-6 sm:p-8 space-y-4 relative min-h-[160px] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#20D9F2] mb-1">
            <span>// CHAPTER 0{activeChapterIndex + 1}</span>
            <span>•</span>
            <span className="uppercase text-[#98A7BF]">{currentChapter.subtitle}</span>
          </div>

          <h4 className="font-headline text-xl sm:text-2xl font-bold text-[#F5F7FF] mb-3">
            {currentChapter.title}
          </h4>

          <p className="font-body text-sm sm:text-base text-[#F5F7FF]/90 leading-relaxed font-normal">
            {chapterText}
          </p>
        </div>

        {/* Chapter Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#141D30]/80 mt-4">
          <button
            onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeChapterIndex === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10182B] text-xs font-headline font-bold uppercase transition-colors ${
              activeChapterIndex === 0
                ? 'opacity-40 cursor-not-allowed text-[#98A7BF]'
                : 'hover:bg-[#141D30] text-[#F5F7FF]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Chapter
          </button>

          <button
            onClick={() => setActiveChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1))}
            disabled={activeChapterIndex === chapters.length - 1}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#20D9F2] text-[#00363E] text-xs font-headline font-bold uppercase transition-colors ${
              activeChapterIndex === chapters.length - 1
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-[#20D9F2]/90'
            }`}
          >
            Next Chapter
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
