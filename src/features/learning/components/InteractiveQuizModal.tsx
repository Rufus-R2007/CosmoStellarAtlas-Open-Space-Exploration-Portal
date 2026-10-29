import React, { useState } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { LearningTrail, QuizAttemptAnswer } from '../../../types';
import { useVaultStore } from '../../../store/useVaultStore';
import { Badge } from '../../../components/common/Badge';

interface InteractiveQuizModalProps {
  trail: LearningTrail;
  onClose: () => void;
}

export const InteractiveQuizModal: React.FC<InteractiveQuizModalProps> = ({ trail, onClose }) => {
  const recordQuizAttempt = useVaultStore((s) => s.recordQuizAttempt);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedScore, setSubmittedScore] = useState<{
    percent: number;
    passed: boolean;
    correctCount: number;
  } | null>(null);

  const questions = trail.quiz;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    const userAnswers: QuizAttemptAnswer[] = questions.map((q, idx) => {
      const selected = selectedAnswers[idx] ?? -1;
      const isCorrect = selected === q.correctAnswerIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        selectedIndex: selected,
        isCorrect,
      };
    });

    const percent = Math.round((correctCount / totalQuestions) * 100);
    const passed = percent >= trail.passingScorePercent;

    recordQuizAttempt({
      trailId: trail.id,
      scorePercent: percent,
      passed,
      totalQuestions,
      correctAnswers: correctCount,
      userAnswers,
    });

    setSubmittedScore({ percent, passed, correctCount });
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setSubmittedScore(null);
    setCurrentIndex(0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const canSubmit = answeredCount === totalQuestions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-white/15 bg-[#090F1E] shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FFB45B]/10 border border-[#FFB45B]/20">
              <Award className="w-5 h-5 text-[#FFB45B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Knowledge Evaluation // {trail.codeName}
                </span>
                <span className="text-xs font-mono text-[#20D9F2]">
                  Pass Threshold: {trail.passingScorePercent}%
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">{trail.title} Quiz</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close quiz modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!isSubmitted ? (
            /* Active Quiz Flow */
            <div className="space-y-6">
              {/* Stepper Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <span>{answeredCount} of {totalQuestions} Answered</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#20D9F2] to-[#8565FA] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                <Badge variant="cyan" className="font-mono text-[10px] mb-3 uppercase">
                  {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' : 'True / False'}
                </Badge>
                <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#20D9F2] bg-[#20D9F2]/15 text-white shadow-md shadow-[#20D9F2]/10'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                            isSelected
                              ? 'bg-[#20D9F2] text-black'
                              : 'bg-white/10 text-gray-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-sm">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation within Quiz */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#20D9F2] to-[#8565FA] text-white font-semibold text-xs hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-[#20D9F2]/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Evaluation</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results & Answer Review */
            <div className="space-y-6">
              {/* Score Banner */}
              <div
                className={`p-6 rounded-2xl border text-center ${
                  submittedScore?.passed
                    ? 'border-[#20D9F2]/40 bg-[#20D9F2]/10'
                    : 'border-[#FF5B5B]/40 bg-[#FF5B5B]/10'
                }`}
              >
                <div className="inline-flex p-3 rounded-full bg-white/5 mb-3">
                  {submittedScore?.passed ? (
                    <Award className="w-8 h-8 text-[#20D9F2]" />
                  ) : (
                    <RotateCcw className="w-8 h-8 text-[#FF5B5B]" />
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">
                  {submittedScore?.passed ? 'Trail Certification Passed!' : 'Evaluation Incomplete'}
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  {submittedScore?.passed
                    ? `Outstanding work! You scored ${submittedScore.percent}%, exceeding the ${trail.passingScorePercent}% threshold.`
                    : `You scored ${submittedScore?.percent}%. The passing threshold is ${trail.passingScorePercent}%. Review the explanations below and try again.`}
                </p>

                <div className="inline-flex items-center gap-6 px-6 py-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-sm">
                  <div>
                    <span className="text-gray-400 block text-xs">Score</span>
                    <span className="text-lg font-bold text-white">
                      {submittedScore?.percent}%
                    </span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <span className="text-gray-400 block text-xs">Correct</span>
                    <span className="text-lg font-bold text-[#20D9F2]">
                      {submittedScore?.correctCount}/{totalQuestions}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <span className="text-gray-400 block text-xs">Status</span>
                    <span
                      className={`text-lg font-bold ${
                        submittedScore?.passed ? 'text-[#20D9F2]' : 'text-[#FF5B5B]'
                      }`}
                    >
                      {submittedScore?.passed ? 'PASSED' : 'RETRY'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Question Review */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#20D9F2]" />
                  <span>Comprehensive Scientific Review</span>
                </h4>

                {questions.map((q, idx) => {
                  const userSelection = selectedAnswers[idx] ?? -1;
                  const isCorrect = userSelection === q.correctAnswerIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border ${
                        isCorrect
                          ? 'border-white/10 bg-white/[0.02]'
                          : 'border-[#FF5B5B]/30 bg-[#FF5B5B]/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                          <span>Q{idx + 1}.</span>
                          <span className="text-white font-medium">{q.question}</span>
                        </div>
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[#20D9F2] font-mono shrink-0">
                            <CheckCircle2 className="w-4 h-4" /> Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-[#FF5B5B] font-mono shrink-0">
                            <XCircle className="w-4 h-4" /> Incorrect
                          </span>
                        )}
                      </div>

                      {/* Options breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 text-xs">
                        <div className="p-2 rounded bg-black/30 border border-white/5">
                          <span className="text-gray-400 block text-[10px] uppercase font-mono">
                            Your Selection:
                          </span>
                          <span
                            className={isCorrect ? 'text-[#20D9F2] font-medium' : 'text-[#FF5B5B] font-medium'}
                          >
                            {userSelection >= 0 ? q.options[userSelection] : 'No answer'}
                          </span>
                        </div>

                        {!isCorrect && (
                          <div className="p-2 rounded bg-black/30 border border-white/5">
                            <span className="text-gray-400 block text-[10px] uppercase font-mono">
                              Correct Answer:
                            </span>
                            <span className="text-[#20D9F2] font-medium">
                              {q.options[q.correctAnswerIndex]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Scientific Explanation */}
                      <div className="text-xs text-gray-300 bg-white/5 p-2.5 rounded-lg border border-white/5 leading-relaxed mt-2">
                        <span className="font-mono text-[10px] text-[#FFB45B] uppercase block mb-0.5">
                          Scientific Explanation:
                        </span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-xs text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Evaluation</span>
                </button>
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#20D9F2] text-black font-semibold text-xs hover:bg-[#1bb8ce] transition-colors cursor-pointer"
                >
                  <span>Finish & Close</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

