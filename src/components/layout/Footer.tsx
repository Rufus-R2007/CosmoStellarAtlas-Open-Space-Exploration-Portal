import React from 'react';
import { Github, Compass, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#141D30] bg-[#060B19]/90 text-[#98A7BF] text-xs py-12 px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand & Mission Statement */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-2.5 text-[#F5F7FF]">
            <div className="p-1.5 rounded-lg bg-[#20D9F2]/10 border border-[#20D9F2]/30 text-[#20D9F2]">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-headline text-base font-bold uppercase tracking-wider">
              CosmoStellarAtlas
            </span>
          </div>
          <p className="font-body text-xs text-[#98A7BF] leading-relaxed max-w-md">
            Open Space Exploration Portal engineered as a Software Engineering Micro Project. Combines NASA mission-control aesthetics, planetary ephemerides, historical spaceflight chronologies, and planetary defense modeling.
          </p>
          <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-[#20D9F2]">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Remote Telemetry Dependencies // Pure Local Engine</span>
          </div>
        </div>

        {/* Academic & Author Attribution */}
        <div className="md:col-span-4 space-y-2">
          <span className="font-telemetry text-xs font-semibold uppercase tracking-wider text-[#F5F7FF]">
            Academic Attribution
          </span>
          <div className="space-y-1 font-body text-xs">
            <p>
              <strong className="text-[#F5F7FF]">Developer:</strong> Rufus Samuel R
            </p>
            <p>
              <strong className="text-[#F5F7FF]">Institution:</strong> Karunya Institute of Technology and Sciences
            </p>
            <p>
              <strong className="text-[#F5F7FF]">Coursework:</strong> Software Engineering Micro Project
            </p>
            <p>
              <strong className="text-[#F5F7FF]">Milestone:</strong> Phase 1 — Platform Foundation & Observatory
            </p>
          </div>
        </div>

        {/* Codebase & Disclosures */}
        <div className="md:col-span-3 space-y-3">
          <span className="font-telemetry text-xs font-semibold uppercase tracking-wider text-[#F5F7FF]">
            Repository & Code
          </span>
          <div>
            <a
              href="https://github.com/Rufus-R2007/CosmoStellarAtlas-Open-Space-Exploration-Portal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A1021] border border-[#141D30] hover:border-[#20D9F2]/40 text-[#F5F7FF] hover:text-[#20D9F2] transition-colors font-headline text-xs uppercase tracking-wider"
            >
              <Github className="w-4 h-4 text-[#20D9F2]" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#98A7BF]" />
            </a>
          </div>
          <p className="text-[11px] text-[#98A7BF]/80 leading-normal">
            This portal is an independent academic project for educational demonstration. It is not affiliated with or endorsed by NASA, ESA, or ISRO.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#141D30]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#98A7BF] gap-3">
        <span>© {new Date().getFullYear()} Rufus Samuel R — All Rights Reserved.</span>
        <span className="text-[#20D9F2]">COSMOSTELLARATLAS // SOL-SYS ARCHIVE // V1.0.0</span>
      </div>
    </footer>
  );
};

