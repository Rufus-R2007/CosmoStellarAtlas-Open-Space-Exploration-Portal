import React, { useState } from 'react';
import { Database, ShieldCheck, X, Cpu } from 'lucide-react';
import { Badge } from './Badge';

export const OfflineDemoIndicator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A1021] border border-[#FFB45B]/30 hover:border-[#FFB45B]/60 text-[#FFB45B] transition-all cursor-pointer group shadow-[0_0_12px_rgba(255,180,91,0.12)]"
        title="View Data Provenance and Offline Architecture Transparency"
        aria-label="Offline Demonstration Transparency Modal"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB45B] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFB45B]"></span>
        </span>
        <span className="font-telemetry text-[11px] font-bold uppercase tracking-wider text-[#FFB45B]">
          OFFLINE DEMO / LOCAL ENGINE
        </span>
      </button>

      {/* Transparency Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-xl bg-[#0A1021] border border-[#25334B] rounded-2xl p-6 shadow-2xl text-[#F5F7FF]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#141D30]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#FFB45B]/15 text-[#FFB45B]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold uppercase tracking-wide">
                    System Data Architecture & Provenance
                  </h3>
                  <p className="font-telemetry text-xs text-[#98A7BF] uppercase tracking-wider">
                    Full Local Execution // Zero External API Reliance
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#98A7BF] hover:text-[#F5F7FF] hover:bg-[#151F35] transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 font-body text-sm text-[#98A7BF] leading-relaxed">
              <div className="p-3.5 rounded-xl bg-[#060B19]/80 border border-[#141D30]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-headline text-xs font-semibold text-[#F5F7FF] uppercase tracking-wider">
                    1. Curated Scientific Reference Data
                  </span>
                  <Badge variant="cyan" size="sm">Curated</Badge>
                </div>
                <p className="text-xs">
                  Planetary ephemerides, historical mission archives (Apollo, Voyager, Cassini, JWST, etc.), and rover specifications are sourced from verified public astrophysical databases and stored in deterministic local TypeScript modules.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#060B19]/80 border border-[#141D30]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-headline text-xs font-semibold text-[#F5F7FF] uppercase tracking-wider">
                    2. Synthetic Demonstration Telemetry
                  </span>
                  <Badge variant="synthetic" size="sm">Synthetic</Badge>
                </div>
                <p className="text-xs">
                  Near-Earth asteroid close-approach vectors, speculative orbital defense encounters, and upcoming launch schedules are deterministically modeled locally for illustrative software demonstration.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#10182B]/60 border border-[#20D9F2]/20">
                <ShieldCheck className="w-5 h-5 text-[#20D9F2] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-headline font-semibold text-[#F5F7FF] uppercase">
                    Academic Software Engineering Standard
                  </span>
                  <p>
                    No mock APIs, remote tracking claims, or false NASA live uplinks are made. All operations run in-browser through an extensible <code className="text-[#20D9F2]">SpaceDataProvider</code> architecture designed to accept live telemetry adapters in future phases.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#141D30] flex items-center justify-between text-xs text-[#98A7BF]">
              <span className="font-mono text-[11px] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#20D9F2]" />
                MockSpaceDataProvider: Active
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#20D9F2] hover:bg-[#9BEFFF] text-[#00363E] font-headline text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

