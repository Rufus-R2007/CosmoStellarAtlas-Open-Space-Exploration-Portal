import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Eye,
  Sliders,
  Info,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { Asteroid } from '../../../../types';
import { useAppStore } from '../../../../store/useAppStore';
import { KM_PER_LUNAR_DISTANCE } from '../../utils/planetaryDefenseMath';

interface OrbitalEncounterCanvasProps {
  asteroids: Asteroid[];
  selectedAsteroidId: string | null;
  onSelectAsteroid: (asteroidId: string) => void;
  onLoadIntoWhatIfLab: (asteroid: Asteroid) => void;
}

export const OrbitalEncounterCanvas: React.FC<OrbitalEncounterCanvasProps> = ({
  asteroids,
  selectedAsteroidId,
  onSelectAsteroid,
  onLoadIntoWhatIfLab,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const visualEffects = useAppStore((state) => state.visualEffects);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showTrajectory, setShowTrajectory] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0); // 0.6 to 2.0
  const progressRef = useRef<number>(0); // 0 to 1 along encounter path

  const currentAsteroid =
    asteroids.find((a) => a.id === selectedAsteroidId) ||
    asteroids.find((a) => a.source === 'synthetic') ||
    asteroids[0];

  const handleResetAnimation = () => {
    progressRef.current = 0;
  };

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

    const render = () => {
      ctx.fillStyle = '#060B19';
      ctx.fillRect(0, 0, width, height);

      const centerX = width * 0.45;
      const centerY = height * 0.5;

      // Coordinate scaling based on Lunar Distances
      // Base: 1 LD = 90 pixels at zoom 1.0
      const pxPerLD = 90 * zoomLevel;

      // 1. Draw concentric distance reference rings (1 LD, 3 LD, 5 LD, 10 LD)
      const ringDistancesLD = [1, 2, 4, 8, 12];
      ringDistancesLD.forEach((ld) => {
        const radiusPx = ld * pxPerLD;
        ctx.strokeStyle = ld === 1 ? 'rgba(255, 180, 91, 0.25)' : 'rgba(32, 217, 242, 0.08)';
        ctx.lineWidth = ld === 1 ? 1.5 : 1;
        if (ld === 1) {
          ctx.setLineDash([4, 6]);
        } else {
          ctx.setLineDash([2, 4]);
        }
        ctx.beginPath();
        ctx.arc(centerX, centerY, radiusPx, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        if (showLabels && radiusPx < width) {
          ctx.fillStyle = ld === 1 ? 'rgba(255, 180, 91, 0.6)' : 'rgba(32, 217, 242, 0.35)';
          ctx.font = '10px monospace';
          ctx.fillText(
            `${ld} LD (${(ld * KM_PER_LUNAR_DISTANCE).toLocaleString()} km)`,
            centerX + radiusPx + 4,
            centerY - 4
          );
        }
      });

      // 2. Draw Moon on 1.0 LD orbit
      const moonAngle = Date.now() * 0.0003;
      const moonX = centerX + Math.cos(moonAngle) * (1.0 * pxPerLD);
      const moonY = centerY + Math.sin(moonAngle) * (1.0 * pxPerLD);

      ctx.fillStyle = '#A0AEC0';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 4 * Math.min(1.5, zoomLevel), 0, Math.PI * 2);
      ctx.fill();

      if (showLabels) {
        ctx.fillStyle = '#A0AEC0';
        ctx.font = '9px monospace';
        ctx.fillText('MOON (1.0 LD)', moonX + 7, moonY + 3);
      }

      // 3. Draw Earth at Center
      const earthRadius = 16 * Math.min(1.8, zoomLevel);

      // Earth atmosphere halo
      const earthHalo = ctx.createRadialGradient(
        centerX,
        centerY,
        earthRadius * 0.8,
        centerX,
        centerY,
        earthRadius * 2.5
      );
      earthHalo.addColorStop(0, 'rgba(32, 217, 242, 0.3)');
      earthHalo.addColorStop(0.6, 'rgba(133, 101, 250, 0.1)');
      earthHalo.addColorStop(1, 'rgba(6, 11, 25, 0)');
      ctx.fillStyle = earthHalo;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Earth Globe
      const earthGrad = ctx.createRadialGradient(
        centerX - 4,
        centerY - 4,
        2,
        centerX,
        centerY,
        earthRadius
      );
      earthGrad.addColorStop(0, '#3182CE');
      earthGrad.addColorStop(0.8, '#1A365D');
      earthGrad.addColorStop(1, '#0F172A');
      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      if (showLabels) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('EARTH', centerX - 18, centerY + earthRadius + 14);
      }

      // 4. Calculate Asteroid Encounter Trajectory (Hyperbolic Schematic Flyby)
      // Perigee miss distance mapped to Lunar Distances
      const missLD = currentAsteroid ? currentAsteroid.missDistanceLunar : 2.0;
      // Perigee distance in pixels
      const perigeePx = Math.max(earthRadius + 6, missLD * pxPerLD);

      // Parametric hyperbolic approach curve
      // t ranges from -2.5 to +2.5
      const getTrajectoryPoint = (t: number) => {
        // Curve asymptotes: x(t) = perigeePx * cosh(t) or parabolic approximation
        // Approach from top-right, fly by Earth at perigee, depart toward bottom-right
        const xOffset = perigeePx + Math.pow(t, 2) * 55 * zoomLevel;
        const yOffset = t * 140 * zoomLevel;
        return {
          x: centerX + xOffset,
          y: centerY + yOffset,
        };
      };

      // Draw Trajectory Path
      if (showTrajectory) {
        ctx.strokeStyle = 'rgba(255, 180, 91, 0.6)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let t = -2.5; t <= 2.5; t += 0.05) {
          const pt = getTrajectoryPoint(t);
          if (t === -2.5) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();

        // Direction of Motion Arrowhead along path
        const arrowPt1 = getTrajectoryPoint(0.5);
        const arrowPt2 = getTrajectoryPoint(0.55);
        const arrowAngle = Math.atan2(arrowPt2.y - arrowPt1.y, arrowPt2.x - arrowPt1.x);

        ctx.save();
        ctx.translate(arrowPt1.x, arrowPt1.y);
        ctx.rotate(arrowAngle);
        ctx.fillStyle = '#FFB45B';
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(-6, -4);
        ctx.lineTo(-6, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Closest Approach Perigee Line (Dotted Vector from Earth to Trajectory)
        const perigeePt = getTrajectoryPoint(0);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(perigeePt.x, perigeePt.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Perigee Indicator Pin
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(perigeePt.x, perigeePt.y, 4, 0, Math.PI * 2);
        ctx.fill();

        if (showLabels) {
          ctx.fillStyle = '#EF4444';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('CLOSEST APPROACH (PERIGEE)', perigeePt.x + 8, perigeePt.y - 6);

          ctx.fillStyle = '#FFB45B';
          ctx.font = '10px monospace';
          ctx.fillText(
            `${missLD.toFixed(3)} LD // ${currentAsteroid?.missDistanceKm.toLocaleString()} KM`,
            perigeePt.x + 8,
            perigeePt.y + 8
          );
        }
      }

      // 5. Animate Asteroid Position along Trajectory
      if (isPlaying && visualEffects !== 'off') {
        progressRef.current += 0.003 * playbackSpeed;
        if (progressRef.current > 1) {
          progressRef.current = 0; // Loop encounter
        }
      }

      // Map progress [0, 1] to parameter t [-2.5, 2.5]
      const currentT = -2.5 + progressRef.current * 5.0;
      const asteroidPos = getTrajectoryPoint(currentT);

      // Asteroid Body Drawing
      const astRadius = 5 * Math.min(1.5, zoomLevel);

      // Asteroid glow
      const astGlow = ctx.createRadialGradient(
        asteroidPos.x,
        asteroidPos.y,
        1,
        asteroidPos.x,
        asteroidPos.y,
        astRadius * 3
      );
      astGlow.addColorStop(0, 'rgba(255, 180, 91, 0.8)');
      astGlow.addColorStop(0.5, 'rgba(255, 180, 91, 0.2)');
      astGlow.addColorStop(1, 'rgba(255, 180, 91, 0)');
      ctx.fillStyle = astGlow;
      ctx.beginPath();
      ctx.arc(asteroidPos.x, asteroidPos.y, astRadius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Irregular asteroid polygon
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.arc(asteroidPos.x, asteroidPos.y, astRadius, 0, Math.PI * 2);
      ctx.fill();

      // Asteroid Label & Real-Time Distance Annotation
      if (showLabels && currentAsteroid) {
        const dx = asteroidPos.x - centerX;
        const dy = asteroidPos.y - centerY;
        const currentDistPx = Math.sqrt(dx * dx + dy * dy);
        const currentDistLD = currentDistPx / pxPerLD;
        const currentDistKm = Math.round(currentDistLD * KM_PER_LUNAR_DISTANCE);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(currentAsteroid.designation, asteroidPos.x + 12, asteroidPos.y - 8);

        ctx.fillStyle = 'rgba(32, 217, 242, 0.9)';
        ctx.font = '10px monospace';
        ctx.fillText(
          `V: ${currentAsteroid.relativeVelocityKmS.toFixed(1)} km/s • R: ${currentDistLD.toFixed(2)} LD (${(currentDistKm / 1000).toFixed(0)}k km)`,
          asteroidPos.x + 12,
          asteroidPos.y + 6
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [
    currentAsteroid,
    isPlaying,
    playbackSpeed,
    showTrajectory,
    showLabels,
    zoomLevel,
    visualEffects,
  ]);

  return (
    <section id="orbital-encounter" className="mb-12 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan">EXPERIENCE B</Badge>
            <span className="text-xs font-mono uppercase tracking-widest text-[#20D9F2]">
              CLOSE-APPROACH KINEMATICS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
            Orbital Encounter Explorer
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-xl">
            Interactive schematic visualization of Earth, Moon, and approaching near-Earth
            object trajectories with closest approach distance vectors and kinematic
            annotations.
          </p>
        </div>

        {/* Selected Asteroid Quick Selector */}
        <div className="w-full sm:w-auto">
          <label htmlFor="active-encounter-select" className="block text-xs font-mono text-gray-400 mb-1">
            Active Encounter Target:
          </label>
          <select
            id="active-encounter-select"
            value={currentAsteroid?.id || ''}
            onChange={(e) => onSelectAsteroid(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 rounded-xl border border-white/10 bg-[#0A1021] text-sm text-white focus:outline-none focus:border-[#20D9F2] cursor-pointer"
          >
            {asteroids.map((a) => (
              <option key={a.id} value={a.id}>
                {a.designation} — {a.name.split(' (')[0]} ({a.missDistanceLunar.toFixed(2)} LD)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Canvas Viewport Container */}
      <div className="relative rounded-2xl border border-[#20D9F2]/30 bg-[#060B19] overflow-hidden shadow-2xl">
        {/* Interactive HUD Toolbar Overlay */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Target Telemetry Pill */}
          <div className="flex items-center gap-2 bg-[#060B19]/90 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#FFB45B] animate-pulse" />
            <span className="font-mono text-xs font-bold text-white">
              {currentAsteroid?.designation}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              ({currentAsteroid?.missDistanceLunar.toFixed(2)} LD perigee)
            </span>
          </div>

          {/* Canvas Viewport Controls */}
          <div className="flex items-center gap-1.5 bg-[#060B19]/90 border border-white/10 p-1 rounded-lg backdrop-blur-md pointer-events-auto">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
              className="p-1.5 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Restart */}
            <button
              onClick={handleResetAnimation}
              aria-label="Restart trajectory playback"
              className="p-1.5 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed Pills */}
            <div className="flex items-center gap-0.5 border-l border-r border-white/10 px-1 mx-0.5 text-xs font-mono">
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-[#20D9F2] text-[#060B19] font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Zoom In/Out */}
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
              aria-label="Zoom in encounter canvas"
              className="p-1.5 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
              aria-label="Zoom out encounter canvas"
              className="p-1.5 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Show/Hide Toggles */}
            <button
              onClick={() => setShowTrajectory(!showTrajectory)}
              title={showTrajectory ? 'Hide Trajectory' : 'Show Trajectory'}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                showTrajectory ? 'text-[#20D9F2]' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowLabels(!showLabels)}
              title={showLabels ? 'Hide Labels' : 'Show Labels'}
              className={`px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                showLabels ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              HUD
            </button>
          </div>
        </div>

        {/* HTML5 Canvas Viewport */}
        <canvas
          ref={canvasRef}
          className="w-full h-[420px] sm:h-[480px] lg:h-[520px] block cursor-grab active:cursor-grabbing"
        />

        {/* Transparent Disclaimer Bottom Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#060B19]/90 border border-white/10 p-3 rounded-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
            <Info className="w-4 h-4 text-[#FFB45B] shrink-0" />
            <span>
              <strong>Scientific Disclaimer:</strong> Schematic encounter visualization —
              not an orbital prediction. Illustrates idealized hyperbolic flyby geometry
              relative to Earth and Lunar orbit.
            </span>
          </div>

          {currentAsteroid && (
            <button
              onClick={() => onLoadIntoWhatIfLab(currentAsteroid)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFB45B] text-[#060B19] font-bold text-xs hover:bg-[#FFB45B]/90 transition-colors cursor-pointer shrink-0"
            >
              <Sliders className="w-3.5 h-3.5" />
              Test {currentAsteroid.designation} in What-If Lab
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
