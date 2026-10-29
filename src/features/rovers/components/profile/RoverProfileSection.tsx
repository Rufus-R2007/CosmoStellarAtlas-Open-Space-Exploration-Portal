import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Zap,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Rover } from '../../../../types';

interface RoverProfileSectionProps {
  rover: Rover;
}

export const RoverProfileSection: React.FC<RoverProfileSectionProps> = ({ rover }) => {
  const [isInstrumentsExpanded, setInstrumentsExpanded] = useState(false);
  const [activeConceptId, setActiveConceptId] = useState<string | null>(
    rover.educationalConcepts && rover.educationalConcepts.length > 0
      ? rover.educationalConcepts[0].id
      : null
  );

  const specs = rover.specifications;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D76B35]">
              Expedition Dossier
            </span>
            <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-[#98A7BF]">
              ARCHIVE REF // {rover.id.toUpperCase()}
            </span>
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {rover.name} Profile & Engineering Specifications
          </h2>
        </div>

        {/* Cross-Module Navigation Action Links */}
        <div className="flex flex-wrap items-center gap-2">
          {rover.missionId && (
            <Link
              to={`/missions/${rover.missionId}`}
              className="flex items-center gap-1.5 rounded-lg border border-[#20D9F2]/30 bg-[#20D9F2]/10 px-3 py-1.5 font-mono text-xs text-[#20D9F2] transition-colors hover:bg-[#20D9F2]/20"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Mission Dossier
            </Link>
          )}
          <Link
            to="/planets?id=mars"
            className="flex items-center gap-1.5 rounded-lg border border-[#D76B35]/40 bg-[#D76B35]/15 px-3 py-1.5 font-mono text-xs text-[#FFB45B] transition-colors hover:bg-[#D76B35]/25"
          >
            Explore Mars 3D
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Mission Overview & Objectives */}
        <div className="space-y-6 lg:col-span-2">
          {/* Mission Description Card */}
          <div className="rounded-xl border border-white/10 bg-[#0A1021]/80 p-5 backdrop-blur-sm sm:p-6">
            <h3 className="font-heading text-lg font-bold text-white">Primary Mission Mandate</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#98A7BF]">
              {rover.description || rover.primaryMission}
            </p>

            {/* Key Objectives */}
            {rover.objectives && rover.objectives.length > 0 && (
              <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                <div className="font-mono text-xs uppercase tracking-wider text-[#E3A66B]">
                  Mission Scientific Objectives
                </div>
                <ul className="space-y-2 text-xs text-[#98A7BF]">
                  {rover.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D76B35]" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Major Historical Achievements */}
            {rover.achievements && rover.achievements.length > 0 && (
              <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#20D9F2]">
                  <Award className="h-3.5 w-3.5" />
                  Major Historical Breakthroughs
                </div>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs text-[#98A7BF]">
                  {rover.achievements.map((ach, i) => (
                    <li key={i} className="flex items-start gap-2 rounded-lg bg-white/5 p-2.5">
                      <span className="font-mono font-bold text-[#FFB45B]">{i + 1}.</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Scientific Instruments Section */}
          <div className="rounded-xl border border-white/10 bg-[#0A1021]/80 p-5 backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-[#20D9F2]" />
                <h3 className="font-heading text-lg font-bold text-white">
                  Scientific Instrument Suite
                </h3>
              </div>
              <button
                onClick={() => setInstrumentsExpanded(!isInstrumentsExpanded)}
                className="flex items-center gap-1 font-mono text-xs text-[#20D9F2] hover:underline"
              >
                {isInstrumentsExpanded ? (
                  <>
                    Show Less <ChevronUp className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    View All ({rover.instruments?.length || rover.keyInstruments.length}){' '}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rover.instruments && rover.instruments.length > 0
                ? (isInstrumentsExpanded
                    ? rover.instruments
                    : rover.instruments.slice(0, 4)
                  ).map((inst) => (
                    <div
                      key={inst.id}
                      className="rounded-lg border border-white/5 bg-[#060B19]/70 p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-sm font-bold text-white">
                          {inst.name}
                        </span>
                        <span className="rounded bg-[#20D9F2]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#20D9F2]">
                          {inst.abbreviation}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-[#FFB45B]">{inst.purpose}</div>
                      <p className="text-[11px] leading-relaxed text-[#98A7BF]">
                        {inst.description}
                      </p>
                    </div>
                  ))
                : rover.keyInstruments.map((inst, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-white/5 bg-[#060B19]/70 p-3 text-xs text-[#98A7BF]"
                    >
                      <span className="font-medium text-white">{inst}</span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Right Column: Engineering Specs & Educational Concepts */}
        <div className="space-y-6">
          {/* Engineering Specifications Card */}
          <div className="rounded-xl border border-white/10 bg-[#0A1021]/80 p-5 backdrop-blur-sm sm:p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Zap className="h-5 w-5 text-[#FFB45B]" />
              <h3 className="font-heading text-lg font-bold text-white">
                Engineering Hardware Specs
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[#98A7BF]">Launch Mass:</span>
                <span className="font-bold text-white">
                  {specs?.massKg ? `${specs.massKg} kg` : 'Classified'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[#98A7BF]">Chassis Dimensions:</span>
                <span className="font-bold text-white">{specs?.dimensions || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[#98A7BF]">Power Architecture:</span>
                <span className="max-w-[180px] text-right font-medium text-[#FFB45B]">
                  {specs?.powerSource ? specs.powerSource.split('(')[0] : 'Solar / Battery'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[#98A7BF]">Suspension:</span>
                <span className="font-medium text-white">Rocker-Bogie 6-Wheel</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[#98A7BF]">Wheel Diameter:</span>
                <span className="font-bold text-white">
                  {specs?.wheelDiameterCm ? `${specs.wheelDiameterCm} cm` : '25 cm'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[#98A7BF]">Max Drive Speed:</span>
                <span className="font-bold text-[#20D9F2]">
                  {specs?.topSpeedCmPerSec ? `${specs.topSpeedCmPerSec} cm/s` : '4.2 cm/s'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#98A7BF]">Design Life vs Actual:</span>
                <span className="font-bold text-emerald-400">{specs?.expectedLifetime || '1 Mars Year'}</span>
              </div>
            </div>
          </div>

          {/* Educational Explanations Accordion/Tabs */}
          {rover.educationalConcepts && rover.educationalConcepts.length > 0 && (
            <div className="rounded-xl border border-[#D76B35]/30 bg-[#1E0D08]/60 p-5 backdrop-blur-sm sm:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#D76B35]/20 pb-3">
                <BookOpen className="h-5 w-5 text-[#E3A66B]" />
                <h3 className="font-heading text-lg font-bold text-white">
                  Planetary Science Explanations
                </h3>
              </div>

              {/* Concept Selector Pills */}
              <div className="flex flex-wrap gap-1.5">
                {rover.educationalConcepts.map((concept) => (
                  <button
                    key={concept.id}
                    onClick={() => setActiveConceptId(concept.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-colors ${
                      activeConceptId === concept.id
                        ? 'bg-[#D76B35] text-white font-bold'
                        : 'bg-white/5 text-[#98A7BF] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {concept.title.split(' ')[0]} {concept.title.split(' ')[1]}
                  </button>
                ))}
              </div>

              {/* Active Concept Explanation */}
              {activeConceptId && (
                <div className="rounded-lg border border-white/10 bg-[#060B19]/80 p-4 space-y-2">
                  {(() => {
                    const concept = rover.educationalConcepts?.find(
                      (c) => c.id === activeConceptId
                    );
                    if (!concept) return null;
                    return (
                      <>
                        <div className="font-heading text-sm font-bold text-[#FFB45B]">
                          {concept.title}
                        </div>
                        <p className="text-xs leading-relaxed text-[#98A7BF]">
                          {concept.explanation}
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
