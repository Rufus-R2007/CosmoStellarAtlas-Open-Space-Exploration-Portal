import React, { useEffect, useRef } from 'react';
import {
  Radio,
  Eye,
  Sliders,
  Info,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { Asteroid } from '../../../../types';
import { useAppStore } from '../../../../store/useAppStore';

interface AsteroidWatchHeroProps {
  asteroids: Asteroid[];
  onScrollToSection: (sectionId: string) => void;
}

export const AsteroidWatchHero: React.FC<AsteroidWatchHeroProps> = ({
  asteroids,
  onScrollToSection,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const visualEffects = useAppStore((state) => state.visualEffects);

  // Dynamic statistics calculated directly from the real dataset
  const syntheticAsteroids = asteroids.filter((a) => a.source === 'synthetic');
  const totalSyntheticCount = syntheticAsteroids.length;

  // Closest approach recorded in dataset
  const closestAsteroid = [...asteroids].sort(
    (a, b) => a.missDistanceKm - b.missDistanceKm
  )[0];

  // Largest asteroid in dataset (by estimated mean diameter)
  const largestAsteroid = [...asteroids].sort(
    (a, b) => (b.estimatedDiameterMeanM ?? b.estimatedDiameterMeters) - (a.estimatedDiameterMeanM ?? a.estimatedDiameterMeters)
  )[0];

  // Average estimated diameter of synthetic objects
  const averageSyntheticDiameter =
    syntheticAsteroids.length > 0
      ? Math.round(
          syntheticAsteroids.reduce(
            (acc, a) => acc + (a.estimatedDiameterMeanM ?? a.estimatedDiameterMeters),
            0
          ) / syntheticAsteroids.length
        )
      : 0;

  // Near-term encounters (2026-2027)
  const nearTermCount = asteroids.filter(
    (a) => a.closeApproachDate >= '2026-01-01' && a.closeApproachDate <= '2027-12-31'
  ).length;

  // Animated background Earth & orbital trajectories canvas
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

    if (visualEffects === 'off') {
      // Static schematic rendering for reduced motion
      ctx.fillStyle = '#060B19';
      ctx.fillRect(0, 0, width, height);
      return () => window.removeEventListener('resize', handleResize);
    }

    // Particle streaks representing synthetic asteroid encounter vectors
    const vectors = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2 - 0.6,
      vy: (Math.random() - 0.5) * 0.8 + 0.3,
      length: 20 + Math.random() * 40,
      size: 1 + Math.random() * 2,
      color: Math.random() > 0.4 ? 'rgba(32, 217, 242, ' : 'rgba(255, 180, 91, ',
      alpha: 0.1 + Math.random() * 0.4,
    }));

    let earthRotation = 0;

    const render = () => {
      ctx.fillStyle = '#060B19';
      ctx.fillRect(0, 0, width, height);

      const centerX = width * 0.72;
      const centerY = height * 0.5;

      // Draw subtle orbital coordinate grid rings
      ctx.strokeStyle = 'rgba(32, 217, 242, 0.08)';
      ctx.lineWidth = 1;
      for (let r = 80; r <= 360; r += 70) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Lunar Orbit Ring (equivalent to 1 Lunar Distance)
      ctx.strokeStyle = 'rgba(255, 180, 91, 0.18)';
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, 210, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label Lunar Orbit
      ctx.fillStyle = 'rgba(255, 180, 91, 0.4)';
      ctx.font = '10px monospace';
      ctx.fillText('LUNAR ORBIT (1.0 LD // 384,400 KM)', centerX + 215, centerY - 8);

      // Draw Earth Centerpiece
      earthRotation += 0.005;
      const earthRadius = 42;

      // Earth atmosphere glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        earthRadius * 0.9,
        centerX,
        centerY,
        earthRadius * 2.2
      );
      glowGrad.addColorStop(0, 'rgba(32, 217, 242, 0.25)');
      glowGrad.addColorStop(0.5, 'rgba(133, 101, 250, 0.12)');
      glowGrad.addColorStop(1, 'rgba(6, 11, 25, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Earth Body
      const earthGrad = ctx.createRadialGradient(
        centerX - 10,
        centerY - 10,
        5,
        centerX,
        centerY,
        earthRadius
      );
      earthGrad.addColorStop(0, '#2b6cb0');
      earthGrad.addColorStop(0.7, '#1a365d');
      earthGrad.addColorStop(1, '#0c1a2e');
      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Earth terminator & continents schematic
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = 'rgba(72, 187, 120, 0.25)';
      ctx.beginPath();
      ctx.arc(
        centerX + Math.cos(earthRotation) * 15,
        centerY - 5,
        18,
        0,
        Math.PI * 2
      );
      ctx.arc(
        centerX - Math.cos(earthRotation) * 20,
        centerY + 12,
        14,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.restore();

      // Draw illustrative asteroid vectors drifting across radar
      vectors.forEach((v) => {
        v.x += v.vx;
        v.y += v.vy;

        if (v.x < 0) v.x = width;
        if (v.x > width) v.x = 0;
        if (v.y < 0) v.y = height;
        if (v.y > height) v.y = 0;

        const tailX = v.x - v.vx * v.length;
        const tailY = v.y - v.vy * v.length;

        const lineGrad = ctx.createLinearGradient(v.x, v.y, tailX, tailY);
        lineGrad.addColorStop(0, v.color + v.alpha + ')');
        lineGrad.addColorStop(1, v.color + '0)');

        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = v.size;
        ctx.beginPath();
        ctx.moveTo(v.x, v.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.fillStyle = v.color + (v.alpha + 0.3) + ')';
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.size * 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [visualEffects]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#20D9F2]/20 bg-[#0A1021] p-6 lg:p-10 mb-8 shadow-2xl">
      {/* Background HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      />

      <div className="relative z-10 max-w-4xl">
        {/* Module Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="cyan">PLANETARY DEFENSE MONITOR</Badge>
          <Badge variant="synthetic">OFFLINE SIMULATION</Badge>
          <Badge variant="violet">DETERMINISTIC DATASET</Badge>
          <span className="text-xs font-mono text-gray-400">
            REF DATE: 2026-10-01
          </span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider text-white uppercase mb-3 drop-shadow-md">
          Asteroid Watch
        </h1>
        <p className="text-lg sm:text-xl font-medium text-[#20D9F2] mb-3">
          Explore Near-Earth Encounters & Planetary Defense
        </p>
        <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed mb-8">
          Welcome to the planetary defense operations console. Survey near-Earth object
          flyby telemetry, track sub-lunar close approaches, and experiment with
          hypothetical impact kinetic energy calculations in the interactive{' '}
          <strong className="text-white">Planetary Defense What-If Lab</strong>.
        </p>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <button
            onClick={() => onScrollToSection('asteroid-explorer')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#20D9F2] text-[#060B19] font-bold text-sm tracking-wide hover:bg-[#20D9F2]/90 hover:shadow-lg hover:shadow-[#20D9F2]/20 transition-all cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            Explore Asteroid Catalog
          </button>
          <button
            onClick={() => onScrollToSection('orbital-encounter')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#20D9F2]/40 bg-[#10182B]/80 text-white font-semibold text-sm hover:border-[#20D9F2] hover:bg-[#10182B] transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#20D9F2]" />
            Orbital Encounter Canvas
          </button>
          <button
            onClick={() => onScrollToSection('whatif-lab')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#FFB45B]/40 bg-[#FFB45B]/10 text-[#FFB45B] font-semibold text-sm hover:border-[#FFB45B] hover:bg-[#FFB45B]/20 transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            Planetary Defense What-If Lab
          </button>
        </div>

        {/* Dynamic Statistics Grid Calculated from Real Dataset */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Stat 1: Total Synthetic Objects */}
          <div className="rounded-xl border border-white/10 bg-[#060B19]/80 p-4 backdrop-blur-md">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-1">
              Synthetic Objects
            </span>
            <div className="text-2xl lg:text-3xl font-extrabold text-[#20D9F2] font-mono">
              {totalSyntheticCount}
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">
              + {asteroids.length - totalSyntheticCount} Historical Benchmarks
            </span>
          </div>

          {/* Stat 2: Encounters within selected period */}
          <div className="rounded-xl border border-white/10 bg-[#060B19]/80 p-4 backdrop-blur-md">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-1">
              Near-Term Encounters
            </span>
            <div className="text-2xl lg:text-3xl font-extrabold text-white font-mono">
              {nearTermCount}
            </div>
            <span className="text-[11px] text-[#20D9F2] mt-1 block">
              Scheduled 2026–2027
            </span>
          </div>

          {/* Stat 3: Closest recorded approach */}
          <div className="rounded-xl border border-white/10 bg-[#060B19]/80 p-4 backdrop-blur-md">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-1">
              Closest Approach
            </span>
            <div className="text-2xl lg:text-3xl font-extrabold text-[#FFB45B] font-mono">
              {closestAsteroid
                ? `${(closestAsteroid.missDistanceKm / 1000).toFixed(1)}k km`
                : '32.0k km'}
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">
              {closestAsteroid
                ? `${closestAsteroid.missDistanceLunar.toFixed(3)} Lunar Distances`
                : '0.083 LD'}
            </span>
          </div>

          {/* Stat 4: Average synthetic diameter */}
          <div className="rounded-xl border border-white/10 bg-[#060B19]/80 p-4 backdrop-blur-md">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-1">
              Avg. Synthetic Size
            </span>
            <div className="text-2xl lg:text-3xl font-extrabold text-[#8565FA] font-mono">
              {averageSyntheticDiameter} m
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">
              Largest: {largestAsteroid?.name.split(' ')[0] ?? '850m'} (
              {largestAsteroid?.estimatedDiameterMeanM ?? largestAsteroid?.estimatedDiameterMeters}m)
            </span>
          </div>
        </div>

        {/* Transparent Simulation Indicator Note */}
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-gray-400 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
          <Info className="w-4 h-4 text-[#20D9F2] shrink-0" />
          <span>
            <strong>Educational Transparency Notice:</strong> All close approaches,
            miss distances, and risk indices are deterministically generated for
            software engineering demonstration. Not an active collision forecast system.
          </span>
        </div>
      </div>
    </div>
  );
};
