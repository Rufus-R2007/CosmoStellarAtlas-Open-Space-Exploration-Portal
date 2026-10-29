import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  Database,
  Cpu,
  FileCode,
} from 'lucide-react';
import { GeneratedBriefing, QueryResponse } from '../../../types';

interface Props {
  inspectedItem?: GeneratedBriefing | QueryResponse | null;
  onClearInspection?: () => void;
}

export const InsightEvidencePanel: React.FC<Props> = ({
  inspectedItem,
  onClearInspection,
}) => {
  const navigate = useNavigate();

  const isBriefing = inspectedItem && 'category' in inspectedItem;

  return (
    <div id="evidence" className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Explainable AI & Algorithmic Provenance Audit</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-display">
            Insight Evidence & Deterministic Verification Panel
          </h2>
        </div>

        {inspectedItem && (
          <button
            onClick={onClearInspection}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:text-white"
          >
            Clear Active Inspection
          </button>
        )}
      </div>

      {inspectedItem ? (
        /* Specific Inspected Item Audit */
        <div className="rounded-xl border border-emerald-500/40 bg-slate-950/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-300">
                {isBriefing ? 'Briefing Synthesis Audit' : 'Query Parsing Audit'}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {isBriefing ? inspectedItem.title : `Query: "${(inspectedItem as QueryResponse).question}"`}
              </h3>
            </div>
            <div className="text-right text-xs text-slate-400 font-mono">
              Records Consulted: <strong className="text-emerald-400">{inspectedItem.sourceRecordIds.length}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Algorithmic Methodology */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                <span>Deterministic Method</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isBriefing
                  ? (inspectedItem as GeneratedBriefing).generationMethod
                  : `Intent Classifier: ${(inspectedItem as QueryResponse).intent.type} (Confidence: ${((inspectedItem as QueryResponse).intent.confidenceOrMatchStrength * 100).toFixed(0)}%)`}
              </p>
            </div>

            {/* Evidence Explanation */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>Rule Verification Proof</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {inspectedItem.evidenceExplanation}
              </p>
            </div>
          </div>

          {/* Sources Inspected */}
          {inspectedItem.sourceReferences.length > 0 && (
            <div className="border-t border-slate-800 pt-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-purple-400" />
                <span>Primary Ephemeris Records Verified</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {inspectedItem.sourceReferences.map((ref) => (
                  <button
                    key={ref.id}
                    onClick={() => navigate(ref.route)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="font-medium">{ref.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({ref.provenance})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* General Explainable AI Architecture Overview */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <FileCode className="h-4 w-4" />
              <span>1. Inverted Search Index</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In-memory inverted catalog tokenizing titles, subtitles, and descriptions with field-specific relevance weighting (+50 exact match, +20 title token, +10 subtitle). Instantaneous response with zero latency.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
              <Cpu className="h-4 w-4" />
              <span>2. Rule-Based Intent Classifier</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Aho-Corasick entity extraction and word-boundary regex mapping natural queries to 14 discrete scientific intents. 100% deterministic, reproducible, and verifiable by software tests.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>3. Zero Cloud LLM Guarantee</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              No OpenAI, Gemini, or external cloud API calls. Complete offline compliance without privacy leakage, API key configuration, or stochastic hallucination of astronomical facts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
