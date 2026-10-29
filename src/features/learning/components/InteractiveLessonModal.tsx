import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertTriangle,
  Lightbulb,
  Clock,
  Sparkles,
} from 'lucide-react';
import { LearningLesson, LearningTrail } from '../../../types';
import { useVaultStore } from '../../../store/useVaultStore';
import { Badge } from '../../../components/common/Badge';

interface InteractiveLessonModalProps {
  lesson: LearningLesson;
  trail: LearningTrail;
  onClose: () => void;
  onSelectLesson: (lesson: LearningLesson) => void;
  onStartQuiz: () => void;
}

export const InteractiveLessonModal: React.FC<InteractiveLessonModalProps> = ({
  lesson,
  trail,
  onClose,
  onSelectLesson,
  onStartQuiz,
}) => {
  const navigate = useNavigate();
  const completedLessonIds = useVaultStore((s) => s.completedLessonIds);
  const completeLesson = useVaultStore((s) => s.completeLesson);

  const isCompleted = completedLessonIds.includes(lesson.id);

  // Find previous and next lessons
  const currentIndex = trail.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? trail.lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < trail.lessons.length - 1 ? trail.lessons[currentIndex + 1] : null;

  const handleComplete = () => {
    completeLesson(lesson.id);
  };

  const handleOpenModule = () => {
    onClose();
    navigate(lesson.moduleRoute);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-white/15 bg-[#090F1E] shadow-2xl overflow-hidden my-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: trail.colorHex }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                  {trail.title} // Lesson {lesson.order} of {trail.lessons.length}
                </span>
                {isCompleted && (
                  <Badge variant="cyan" className="text-[10px] py-0 px-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#20D9F2]" />
                    Completed
                  </Badge>
                )}
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">{lesson.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close lesson modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Subtitle & Estimated Time */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
            <p className="text-gray-300 text-sm font-medium">{lesson.subtitle}</p>
            <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
              <Clock className="w-3.5 h-3.5 text-[#20D9F2]" />
              <span>{lesson.estimatedMinutes} min read</span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-xl border border-[#20D9F2]/20 bg-[#20D9F2]/5 text-sm text-gray-200 leading-relaxed">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#20D9F2] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Lesson Overview
            </div>
            {lesson.summary}
          </div>

          {/* Learning Objectives */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3">
              Learning Objectives
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {lesson.learningObjectives.map((obj, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-white/[0.03] border border-white/5 text-xs sm:text-sm text-gray-300"
                >
                  <span className="font-mono text-xs font-bold text-[#8565FA] mt-0.5">
                    0{i + 1}.
                  </span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6 pt-2">
            {lesson.contentSections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-base font-bold text-white tracking-wide border-l-2 border-[#8565FA] pl-3">
                  {sec.title}
                </h3>
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-sm text-gray-300 leading-relaxed">
                    {p}
                  </p>
                ))}

                {/* Callout box if present */}
                {sec.callout && (
                  <div
                    className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                      sec.callout.type === 'fact'
                        ? 'bg-[#20D9F2]/10 border-[#20D9F2]/30 text-cyan-200'
                        : sec.callout.type === 'warning'
                        ? 'bg-[#FF5B5B]/10 border-[#FF5B5B]/30 text-rose-200'
                        : 'bg-[#FFB45B]/10 border-[#FFB45B]/30 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                      {sec.callout.type === 'fact' && <Info className="w-4 h-4 text-[#20D9F2]" />}
                      {sec.callout.type === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-[#FF5B5B]" />
                      )}
                      {sec.callout.type === 'tip' && (
                        <Lightbulb className="w-4 h-4 text-[#FFB45B]" />
                      )}
                      <span>
                        {sec.callout.type === 'fact'
                          ? 'Scientific Reality'
                          : sec.callout.type === 'warning'
                          ? 'Astro-Observation Note'
                          : 'Explorer Insight'}
                      </span>
                    </div>
                    {sec.callout.text}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Key Takeaways */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#FFB45B] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Key Takeaways
            </h4>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-300 space-y-1.5 pl-1">
              {lesson.keyTakeaways.map((item, kIdx) => (
                <li key={kIdx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Module Shortcut CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-[#8565FA]/30 bg-gradient-to-r from-[#8565FA]/10 to-[#20D9F2]/10">
            <div>
              <div className="text-xs font-mono uppercase text-[#20D9F2] tracking-wider mb-1">
                Connected Exploration Laboratory
              </div>
              <div className="text-sm text-gray-200">
                Experience this phenomenon directly in the application's dedicated module.
              </div>
            </div>
            <button
              onClick={handleOpenModule}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-all cursor-pointer"
            >
              <span>{lesson.moduleRouteLabel}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#20D9F2]" />
            </button>
          </div>

          {/* Reference Attribution */}
          <div className="text-center text-[11px] font-mono text-gray-500 pt-2">
            Scientific Reference: {lesson.sourceReference}
          </div>
        </div>

        {/* Footer with Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <button
              disabled={!prevLesson}
              onClick={() => prevLesson && onSelectLesson(prevLesson)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              disabled={!nextLesson}
              onClick={() => nextLesson && onSelectLesson(nextLesson)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {!isCompleted ? (
              <button
                onClick={handleComplete}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#20D9F2] text-black font-semibold text-xs hover:bg-[#1bb8ce] transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Lesson Complete</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-[#20D9F2]/30 text-[#20D9F2] text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 text-[#20D9F2]" />
                <span>Lesson Completed</span>
              </div>
            )}

            {!nextLesson && (
              <button
                onClick={onStartQuiz}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8565FA] to-[#FFB45B] text-white font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-[#8565FA]/20"
              >
                <BookOpen className="w-4 h-4" />
                <span>Take Trail Quiz</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
