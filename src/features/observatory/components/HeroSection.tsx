import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Rocket } from 'lucide-react';
import { CelestialCenterpiece } from '../../../components/common/CelestialCenterpiece';
import { Button } from '../../../components/common/Button';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[520px] w-full pt-4 pb-12 flex flex-col xl:flex-row items-center justify-between gap-10 border-b border-[#141D30]">
      {/* Left Column: Command Telemetry & Primary Actions */}
      <div className="w-full xl:w-7/12 flex flex-col z-10">
        {/* Observatory Eyebrow */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1021] border border-[#20D9F2]/30 shadow-[0_0_12px_rgba(32,217,242,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20D9F2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#20D9F2]"></span>
            </span>
            <span className="font-telemetry text-xs text-[#20D9F2] uppercase tracking-widest font-semibold">
              THE DIGITAL COSMIC OBSERVATORY // SYS-OP: ION-ARRAY 04
            </span>
          </div>
        </div>

        {/* Headline with Radiant Cyan-Gradient Accents */}
        <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5F7FF] uppercase tracking-tight leading-[1.08]">
          EXPLORE BEYOND <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20D9F2] via-[#9BEFFF] to-[#CBBEFF] drop-shadow-[0_0_24px_rgba(32,217,242,0.35)]">
            THE HORIZON.
          </span>
        </h1>

        {/* Clean, easy-to-understand subtitle */}
        <p className="font-body text-base sm:text-lg text-[#98A7BF] mt-4 max-w-xl leading-relaxed">
          Discover planetary worlds, historic spaceflight milestones, and astronomical discoveries through a real-time scientific lens.
        </p>

        {/* Clean Telemetry Coordinates & Solar Flux Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 my-5 bg-[#0A1021]/80 border border-[#141D30] rounded-xl p-4 max-w-xl backdrop-blur-md shadow-sm">
          <div className="flex flex-col">
            <span className="font-telemetry text-[11px] uppercase text-[#98A7BF] font-semibold">
              GEO LATITUDE
            </span>
            <span className="font-mono text-sm font-bold text-[#F5F7FF] mt-1">
              28.5721° N
            </span>
            <span className="text-[11px] text-[#98A7BF]">Cape Canaveral RL</span>
          </div>
          <div className="flex flex-col sm:border-l sm:border-[#141D30] sm:pl-3">
            <span className="font-telemetry text-[11px] uppercase text-[#98A7BF] font-semibold">
              GEO LONGITUDE
            </span>
            <span className="font-mono text-sm font-bold text-[#F5F7FF] mt-1">
              80.6480° W
            </span>
            <span className="text-[11px] text-[#98A7BF]">Deep Orbital Link</span>
          </div>
          <div className="flex flex-col sm:border-l sm:border-[#141D30] sm:pl-3">
            <span className="font-telemetry text-[11px] uppercase text-[#98A7BF] font-semibold">
              SOLAR FLUX INDEX
            </span>
            <span className="font-mono text-sm font-bold text-[#20D9F2] mt-1">
              1,361 W/m²
            </span>
            <span className="text-[11px] text-[#FFB45B]">Nominal Heliosphere</span>
          </div>
        </div>

        {/* Two Tactile Interactive Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/planets')}
            icon={<Compass className="w-5 h-5" />}
          >
            Begin Exploration
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/timeline')}
            icon={<Rocket className="w-5 h-5 text-[#CBBEFF]" />}
          >
            Travel Through History
          </Button>
        </div>
      </div>

      {/* Right Column: Celestial Centerpiece */}
      <div className="w-full xl:w-5/12 flex items-center justify-center min-h-[420px]">
        <CelestialCenterpiece />
      </div>
    </section>
  );
};
