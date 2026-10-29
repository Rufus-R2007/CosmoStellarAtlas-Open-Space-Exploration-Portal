import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Send,
  RotateCcw,
} from 'lucide-react';
import { QueryResponse } from '../../../types';
import { queryExecutionService } from '../services';

interface Props {
  onInspectEvidence?: (response: QueryResponse) => void;
}

export const AskTheAtlasSection: React.FC<Props> = ({ onInspectEvidence }) => {
  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState<string>('');
  const [activeResponse, setActiveResponse] = useState<QueryResponse | null>(() =>
    queryExecutionService.executeQuery('What is Mars?')
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const samplePrompts = [
    'What is Mars?',
    'Compare Earth and Jupiter',
    'Which planet has the most moons?',
    'Tell me about Apollo 11',
    'What rovers are on Mars?',
    'Which asteroid comes closest to Earth?',
    'What is Lunar Distance?',
    'Missions launched in 1977',
  ];

  const handleExecuteQuery = (textToExecute: string) => {
    const trimmed = textToExecute.trim();
    if (!trimmed) return;

    setIsProcessing(true);
    // Instant local evaluation with subtle animation tick
    setTimeout(() => {
      const response = queryExecutionService.executeQuery(trimmed);
      setActiveResponse(response);
      setQueryInput('');
      setIsProcessing(false);
    }, 80);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteQuery(queryInput);
  };

  return (
    <div id="ask-atlas" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Brain className="h-4 w-4" />
            <span>Deterministic Natural Language Assistant</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-display">
            Ask the Atlas Query Engine
          </h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Rule-Based Verification • Zero Cloud AI APIs</span>
        </div>
      </div>

      {/* Suggestion Prompts */}
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Suggested Inquiries</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleExecuteQuery(prompt)}
              className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300 hover:border-purple-500/50 hover:bg-purple-950/20 hover:text-purple-200 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Query Input Bar */}
      <form onSubmit={handleFormSubmit} className="mb-6">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Ask about planets, missions, rovers, asteroids, or launch years (e.g. 'What is Saturn?')..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3.5 pl-11 pr-24 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {queryInput && (
              <button
                type="button"
                onClick={() => setQueryInput('')}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white"
                title="Clear input"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="submit"
              disabled={!queryInput.trim() || isProcessing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-600/20 transition-all"
            >
              <span>Query</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Active Query Response Card */}
      {activeResponse && (
        <div className="rounded-xl border border-purple-500/30 bg-slate-950/60 p-5 space-y-5">
          {/* Query Header & Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Query:</span>
              <span className="text-sm font-bold text-white">"{activeResponse.question}"</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-2.5 py-0.5 text-[10px] font-mono text-purple-200">
                Intent: {activeResponse.intent.type}
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-mono text-emerald-200">
                Confidence: {((activeResponse.intent.confidenceOrMatchStrength || 0.9) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Formatted Markdown Content */}
          <div className="prose prose-invert prose-sm max-w-none text-slate-200 space-y-3 leading-relaxed">
            {activeResponse.answer.split('\n\n').map((paragraph, pIdx) => {
              // Header 3
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={pIdx} className="text-lg font-bold text-white mt-2 mb-1">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              // Header 4
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4 key={pIdx} className="text-sm font-semibold uppercase tracking-wider text-purple-300 mt-3 mb-1">
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              // Markdown Table
              if (paragraph.includes('| :---') || (paragraph.startsWith('|') && paragraph.includes('|'))) {
                const rows = paragraph.split('\n').filter((r) => r.trim().startsWith('|'));
                if (rows.length >= 2) {
                  const headerCells = rows[0]
                    .split('|')
                    .map((c) => c.trim())
                    .filter(Boolean);
                  const dataRows = rows.slice(2);
                  return (
                    <div key={pIdx} className="overflow-x-auto my-3 rounded-lg border border-slate-800">
                      <table className="min-w-full divide-y divide-slate-800 text-xs">
                        <thead className="bg-slate-900">
                          <tr>
                            {headerCells.map((h, hIdx) => (
                              <th key={hIdx} className="px-3 py-2 text-left font-bold text-slate-300">
                                {h.replace(/\*\*/g, '')}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                          {dataRows.map((r, rIdx) => {
                            const cells = r
                              .split('|')
                              .map((c) => c.trim())
                              .filter(Boolean);
                            return (
                              <tr key={rIdx} className="hover:bg-slate-900/50">
                                {cells.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-3 py-2 text-slate-300">
                                    {cell.replace(/\*\*/g, '')}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              }
              // Bullet lists
              if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                const items = paragraph.split('\n').filter(Boolean);
                return (
                  <ul key={pIdx} className="space-y-1 my-2">
                    {items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{item.replace(/^[-*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              // Regular paragraph
              return (
                <p key={pIdx} className="text-xs md:text-sm text-slate-300">
                  {paragraph.replace(/\*\*(.*?)\*\*/g, '$1')}
                </p>
              );
            })}
          </div>

          {/* Source Citations */}
          {activeResponse.sourceReferences.length > 0 && (
            <div className="border-t border-slate-800/80 pt-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Source Ephemeris Records</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeResponse.sourceReferences.map((ref) => (
                  <button
                    key={ref.id}
                    onClick={() => navigate(ref.route)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:border-purple-500/50 hover:text-purple-200 transition-colors"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    <span className="font-medium">{ref.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({ref.provenance})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Prompts */}
          {activeResponse.suggestedQuestions.length > 0 && (
            <div className="border-t border-slate-800/80 pt-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
                <span>Explore Further</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeResponse.suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExecuteQuery(q)}
                    className="inline-flex items-center gap-1 rounded-lg border border-purple-500/20 bg-purple-950/20 px-3 py-1.5 text-xs text-purple-300 hover:border-purple-400 hover:bg-purple-900/30 transition-colors"
                  >
                    <span>{q}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Explanation Footer */}
          {activeResponse.evidenceExplanation && (
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{activeResponse.evidenceExplanation}</span>
              </div>
              {onInspectEvidence && (
                <button
                  onClick={() => onInspectEvidence(activeResponse)}
                  className="text-purple-400 hover:underline hover:text-purple-300 font-medium"
                >
                  Audit Rule Logic
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
