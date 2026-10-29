import React, { useEffect, useRef } from 'react';
import { Radio, Compass, Camera, Calendar, ShieldCheck } from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { Rover } from '../../../../types';

interface MarsOperationsHeroProps {
  rovers: Rover[];
  selectedRover: Rover;
  onSelectRover: (roverId: string) => void;
  totalImagesCount: number;
}

export const MarsOperationsHero: React.FC<MarsOperationsHeroProps> = ({
  rovers,
  selectedRover,
  onSelectRover,
  totalImagesCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic atmospheric dust particle simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle parameters for thin Martian atmospheric dust
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.3) * 0.4, // Slight eastward prevailing wind
      vy: Math.random() * 0.25 + 0.1,  // Gentle downward drift
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.6 ? '#E3A66B' : '#D76B35',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle ambient Martian dust gradient glow
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(58, 24, 16, 0.45)');
      grad.addColorStop(0.7, 'rgba(156, 66, 41, 0.15)');
      grad.addColorStop(1, 'rgba(6, 11, 25, 0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw dust motes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y > height) {
          p.y = 0;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const totalSolsAccumulated = rovers.reduce((acc, r) => acc + r.totalSols, 0);
  const totalKmTraveled = rovers
    .reduce((acc, r) => acc + r.distanceTraveledKm, 0)
    .toFixed(1);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#D76B35]/30 bg-gradient-to-b from-[#1E0D08]/90 via-[#10182B] to-[#0A1021] p-6 lg:p-10 shadow-2xl">
      {/* Background Animated Dust Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      />

      {/* Hero Header Content */}
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-[#D76B35]/40 bg-[#D76B35]/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#FFB45B]">
              <Radio className="h-3.5 w-3.5 animate-pulse text-[#D76B35]" />
              Mars Surface Operations Console
            </span>
            <Badge variant="curated">Verified Flight Data</Badge>
            <span className="hidden items-center gap-1 text-xs text-[#98A7BF] sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5 text-[#20D9F2]" />
              Zero-API Offline Reliability
            </span>
          </div>

          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Mars Surface Operations
          </h1>
          <p className="font-sans text-base leading-relaxed text-[#98A7BF] sm:text-lg">
            Explore the Red Planet Through Robotic Discovery. Inspect multi-mission telemetry,
            high-contrast microscopic imagery, surface traverse waypoints, and the engineering
            breakthroughs of five generations of autonomous Mars explorers.
          </p>
        </div>

        {/* Selected Rover Quick Card */}
        <div className="flex flex-col gap-2 rounded-xl border border-[#D76B35]/40 bg-[#060B19]/80 p-4 backdrop-blur-md lg:w-80">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#E3A66B]">
            Active Telemetry Feed
          </div>
          <div className="flex items-center justify-between">
            <div className="font-heading text-lg font-bold text-white">
              {selectedRover.name}
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-mono font-medium ${
                selectedRover.status === 'Active'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-[#98A7BF]/20 text-[#98A7BF] border border-[#98A7BF]/40'
              }`}
            >
              {selectedRover.status}
            </span>
          </div>
          <div className="text-xs text-[#98A7BF]">
            <span className="font-medium text-white">{selectedRover.landingSite}</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-2 font-mono text-xs">
            <div>
              <span className="text-[#98A7BF]">Sols Active: </span>
              <span className="font-bold text-[#20D9F2]">{selectedRover.totalSols.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[#98A7BF]">Distance: </span>
              <span className="font-bold text-[#FFB45B]">{selectedRover.distanceTraveledKm} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Surface Metric Statistics Bar */}
      <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 border-t border-[#D76B35]/20 pt-6 sm:grid-cols-4 sm:gap-4">
        <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#0A1021]/60 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D76B35]/20 text-[#D76B35]">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <div className="font-heading text-xl font-bold text-white">{rovers.length}</div>
            <div className="font-mono text-[11px] text-[#98A7BF]">Rovers Cataloged</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#0A1021]/60 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#20D9F2]/20 text-[#20D9F2]">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="font-heading text-xl font-bold text-white">{totalImagesCount}</div>
            <div className="font-mono text-[11px] text-[#98A7BF]">Visual Records</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#0A1021]/60 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFB45B]/20 text-[#FFB45B]">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="font-heading text-xl font-bold text-white">
              {totalSolsAccumulated.toLocaleString()}
            </div>
            <div className="font-mono text-[11px] text-[#98A7BF]">Total Surface Sols</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#0A1021]/60 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#8565FA]/20 text-[#8565FA]">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="font-heading text-xl font-bold text-white">{totalKmTraveled} km</div>
            <div className="font-mono text-[11px] text-[#98A7BF]">Cumulative Traverse</div>
          </div>
        </div>
      </div>

      {/* Fast Rover Switcher Tabs */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-wider text-[#98A7BF]">
          Select Expedition:
        </span>
        {rovers.map((rover) => {
          const isSelected = rover.id === selectedRover.id;
          return (
            <button
              key={rover.id}
              onClick={() => onSelectRover(rover.id)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-mono text-xs font-medium transition-all ${
                isSelected
                  ? 'border border-[#D76B35] bg-[#D76B35] text-white shadow-lg shadow-[#D76B35]/30'
                  : 'border border-white/10 bg-[#060B19]/70 text-[#98A7BF] hover:border-[#D76B35]/50 hover:text-white'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  rover.status === 'Active' ? 'bg-emerald-400' : 'bg-[#98A7BF]'
                }`}
              />
              {rover.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
