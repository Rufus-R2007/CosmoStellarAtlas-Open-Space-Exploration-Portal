import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  X,
  Maximize2,
  Minimize2,
  Clock,
  Sparkles,
  Compass,
  Radio,
  Rocket,
  ShieldAlert,
} from 'lucide-react';
import { Mission, MissionMilestone, ReplaySceneType } from '../../../../types';
import { useAppStore } from '../../../../store';
import { useVaultStore } from '../../../../store/useVaultStore';

interface MissionReplayEngineProps {
  mission: Mission;
  isOpen: boolean;
  onClose: () => void;
  initialMilestoneIndex?: number;
}

export const MissionReplayEngine: React.FC<MissionReplayEngineProps> = ({
  mission,
  isOpen,
  onClose,
  initialMilestoneIndex = 0,
}) => {
  const { visualEffects } = useAppStore();
  const logExplorationEvent = useVaultStore((s) => s.logExplorationEvent);
  const milestones = mission.milestones || [];

  const [currentIndex, setCurrentIndex] = useState<number>(initialMilestoneIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentMilestone: MissionMilestone | undefined = milestones[currentIndex];
  const isReducedMotion = visualEffects === 'off';

  // Base milestone duration in milliseconds (at 1.0x speed)
  const baseDurationMs = 7000;
  const currentDurationMs = baseDurationMs / playbackSpeed;

  // Reset to initial milestone when opened or mission changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.min(initialMilestoneIndex, Math.max(0, milestones.length - 1)));
      setIsPlaying(true);
      setProgressPercent(0);
    }
  }, [isOpen, mission.id, initialMilestoneIndex, milestones.length]);

  // Handle advancing to next milestone
  const handleNext = useCallback(() => {
    if (currentIndex < milestones.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgressPercent(0);
    } else {
      setIsPlaying(false);
      setProgressPercent(100);
      logExplorationEvent('mission_replay_completed', mission.id, {
        missionName: mission.name,
      });
    }
  }, [currentIndex, milestones.length, logExplorationEvent, mission.id, mission.name]);

  // Handle stepping to previous milestone
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgressPercent(0);
    }
  }, [currentIndex]);

  // Restart replay
  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setProgressPercent(0);
    setIsPlaying(true);
  }, []);

  // Playback timer & progress management
  useEffect(() => {
    if (!isPlaying || !isOpen || milestones.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 50;
    const progressStep = (intervalMs / currentDurationMs) * 100;

    const timer = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + progressStep;
      });
    }, intervalMs);

    timerRef.current = timer;

    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, isOpen, currentDurationMs, handleNext, milestones.length]);

  // Canvas-based dynamic celestial visualizer for the scene
  useEffect(() => {
    if (!isOpen || isReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const sceneType: ReplaySceneType = currentMilestone?.replaySceneType || 'deep_space_cruise';

    // Particle generator state
    let angle = 0;
    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
    }));

    let frameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Space Backdrop
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#040814');
      gradient.addColorStop(1, '#081126');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Animate Stars
      ctx.fillStyle = '#FFFFFF';
      stars.forEach((star) => {
        ctx.globalAlpha = 0.3 + Math.sin(angle + star.x) * 0.2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.x -= star.speed * playbackSpeed;
        if (star.x < 0) star.x = width;
      });
      ctx.globalAlpha = 1.0;

      // 3. Render Custom Scene Graphics based on sceneType
      const centerX = width / 2;
      const centerY = height / 2;

      switch (sceneType) {
        case 'launchpad': {
          // Launchpad tower & upward ascending rocket
          ctx.strokeStyle = '#20D9F2';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX - 100, height);
          ctx.lineTo(centerX - 100, height - 120);
          ctx.stroke();

          // Rocket flame plume
          const flameH = 40 + Math.random() * 20;
          const rocketY = centerY + Math.sin(angle * 2) * 20;

          // Exhaust glow
          const plumeGrad = ctx.createRadialGradient(
            centerX,
            rocketY + 45,
            5,
            centerX,
            rocketY + 60,
            flameH
          );
          plumeGrad.addColorStop(0, '#FFB45B');
          plumeGrad.addColorStop(0.5, '#FF5533');
          plumeGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = plumeGrad;
          ctx.beginPath();
          ctx.arc(centerX, rocketY + 50, flameH, 0, Math.PI * 2);
          ctx.fill();

          // Rocket Body
          ctx.fillStyle = '#F5F7FF';
          ctx.beginPath();
          ctx.moveTo(centerX, rocketY - 40);
          ctx.lineTo(centerX + 14, rocketY + 30);
          ctx.lineTo(centerX - 14, rocketY + 30);
          ctx.closePath();
          ctx.fill();
          break;
        }

        case 'orbital_insertion': {
          // Central Planet (e.g. Earth or target)
          ctx.beginPath();
          ctx.arc(centerX - 80, centerY, 70, 0, Math.PI * 2);
          const pGrad = ctx.createRadialGradient(
            centerX - 100,
            centerY - 20,
            10,
            centerX - 80,
            centerY,
            70
          );
          pGrad.addColorStop(0, '#20D9F2');
          pGrad.addColorStop(0.7, '#0C3866');
          pGrad.addColorStop(1, '#05122B');
          ctx.fillStyle = pGrad;
          ctx.fill();

          // Elliptical Orbit Track
          ctx.strokeStyle = 'rgba(32, 217, 242, 0.35)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          if (typeof ctx.ellipse === 'function') {
            ctx.ellipse(centerX - 80, centerY, 150, 75, -0.2, 0, Math.PI * 2);
          } else {
            ctx.arc(centerX - 80, centerY, 100, 0, Math.PI * 2);
          }
          ctx.stroke();

          // Satellite in Orbit
          const orbAngle = angle * 0.8 * playbackSpeed;
          const satX = centerX - 80 + Math.cos(orbAngle) * 150;
          const satY = centerY + Math.sin(orbAngle) * 75;

          ctx.fillStyle = '#FFB45B';
          ctx.beginPath();
          ctx.arc(satX, satY, 5, 0, Math.PI * 2);
          ctx.fill();

          // Solar wings
          ctx.strokeStyle = '#20D9F2';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(satX - 12, satY);
          ctx.lineTo(satX + 12, satY);
          ctx.stroke();
          break;
        }

        case 'planetary_flyby': {
          // Large Flyby Celestial Target
          ctx.beginPath();
          ctx.arc(centerX + 120, centerY + 20, 110, 0, Math.PI * 2);
          const flyGrad = ctx.createRadialGradient(
            centerX + 90,
            centerY - 20,
            20,
            centerX + 120,
            centerY + 20,
            110
          );
          flyGrad.addColorStop(0, '#FFB45B');
          flyGrad.addColorStop(0.5, '#A45D25');
          flyGrad.addColorStop(1, '#1A0C05');
          ctx.fillStyle = flyGrad;
          ctx.fill();

          // Hyperbolic Trajectory Arc
          ctx.strokeStyle = 'rgba(133, 101, 250, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX - 240, centerY + 140);
          if (typeof ctx.quadraticCurveTo === 'function') {
            ctx.quadraticCurveTo(centerX + 40, centerY - 60, centerX + 260, centerY - 140);
          } else {
            ctx.lineTo(centerX + 260, centerY - 140);
          }
          ctx.stroke();

          // Spacecraft along arc
          const t = (Math.sin(angle * 0.6) + 1) / 2;
          const probeX = (1 - t) * (1 - t) * (centerX - 240) + 2 * (1 - t) * t * (centerX + 40) + t * t * (centerX + 260);
          const probeY = (1 - t) * (1 - t) * (centerY + 140) + 2 * (1 - t) * t * (centerY - 60) + t * t * (centerY - 140);

          ctx.fillStyle = '#20D9F2';
          ctx.beginPath();
          ctx.arc(probeX, probeY, 6, 0, Math.PI * 2);
          ctx.fill();

          // Radar pulse
          ctx.strokeStyle = 'rgba(32, 217, 242, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(probeX, probeY, 15 + (angle % 2) * 15, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        case 'surface_descent': {
          // Alien Surface Horizon at bottom
          ctx.fillStyle = '#1D120B';
          ctx.beginPath();
          ctx.moveTo(0, height - 60);
          if (typeof ctx.quadraticCurveTo === 'function') {
            ctx.quadraticCurveTo(centerX, height - 90, width, height - 60);
          } else {
            ctx.lineTo(width, height - 60);
          }
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fill();

          // Lander / Parachute Descending
          const landerY = centerY - 50 + Math.sin(angle * 0.7) * 30;

          // Parachute Canopy
          ctx.fillStyle = 'rgba(255, 180, 91, 0.85)';
          ctx.beginPath();
          ctx.arc(centerX, landerY - 40, 30, Math.PI, 0);
          ctx.closePath();
          ctx.fill();

          // Suspension cords
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(centerX - 25, landerY - 40);
          ctx.lineTo(centerX, landerY);
          ctx.moveTo(centerX + 25, landerY - 40);
          ctx.lineTo(centerX, landerY);
          ctx.stroke();

          // Lander Module
          ctx.fillStyle = '#20D9F2';
          ctx.fillRect(centerX - 10, landerY, 20, 16);
          break;
        }

        case 'impact': {
          // Asteroid Target
          ctx.fillStyle = '#555A6E';
          ctx.beginPath();
          ctx.arc(centerX + 50, centerY, 45, 0, Math.PI * 2);
          ctx.fill();

          // Impact Flash Ejecta Plume
          const pulse = (Math.sin(angle * 3) + 1) / 2;
          const flashGrad = ctx.createRadialGradient(
            centerX + 15,
            centerY - 5,
            5,
            centerX + 15,
            centerY - 5,
            30 + pulse * 40
          );
          flashGrad.addColorStop(0, '#FFFFFF');
          flashGrad.addColorStop(0.3, '#FFB45B');
          flashGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = flashGrad;
          ctx.beginPath();
          ctx.arc(centerX + 15, centerY - 5, 30 + pulse * 40, 0, Math.PI * 2);
          ctx.fill();

          // Trajectory Vector Arrow
          ctx.strokeStyle = '#20D9F2';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX - 160, centerY + 80);
          ctx.lineTo(centerX + 15, centerY - 5);
          ctx.stroke();
          break;
        }

        case 'scientific_survey':
        case 'deep_space_cruise':
        default: {
          // Central Iconic Probe with Instrument Beams
          ctx.fillStyle = '#20D9F2';
          ctx.beginPath();
          ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
          ctx.fill();

          // High-Gain Parabolic Dish
          ctx.strokeStyle = '#F5F7FF';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(centerX - 15, centerY, 22, -Math.PI / 3, Math.PI / 3);
          ctx.stroke();

          // Radio Wave Pulses towards Earth
          const pulseR = (angle * 25) % 90;
          ctx.strokeStyle = `rgba(32, 217, 242, ${1 - pulseR / 90})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(centerX - 25, centerY, pulseR, -Math.PI / 4, Math.PI / 4);
          ctx.stroke();

          // Scan Beam forward
          ctx.fillStyle = 'rgba(133, 101, 250, 0.15)';
          ctx.beginPath();
          ctx.moveTo(centerX + 12, centerY);
          ctx.lineTo(centerX + 180, centerY - 60);
          ctx.lineTo(centerX + 180, centerY + 60);
          ctx.closePath();
          ctx.fill();
          break;
        }
      }

      angle += 0.03 * playbackSpeed;
      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isOpen, currentMilestone?.replaySceneType, playbackSpeed, isReducedMotion]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Interactive Mission Replay: ${mission.name}`}
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#03060E]/90 backdrop-blur-md animate-in fade-in duration-200 ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      <div
        className={`w-full bg-[#0A1021] border border-[#141D30] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative ${
          isFullscreen ? 'h-full rounded-none' : 'max-w-5xl max-h-[92vh] h-[780px]'
        }`}
      >
        {/* Top Replay HUD Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#060B19]/90 border-b border-[#141D30] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#20D9F2]/10 border border-[#20D9F2]/30 flex items-center justify-center text-[#20D9F2]">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-sm sm:text-base text-[#F5F7FF] uppercase tracking-wide">
                  {mission.name} // Mission Replay
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#20D9F2]/15 text-[#20D9F2] font-semibold uppercase">
                  {currentMilestone?.eventType || 'STAGE ACTIVE'}
                </span>
              </div>
              <span className="text-xs font-mono text-[#98A7BF]">
                Milestone {milestones.length === 0 ? 0 : currentIndex + 1} of {milestones.length} • {mission.agency}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-[#10182B] hover:bg-[#141D30] text-[#98A7BF] hover:text-[#F5F7FF] transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#10182B] hover:bg-[#141D30] text-[#98A7BF] hover:text-[#F5F7FF] transition-colors"
              title="Close Replay"
              aria-label="Close Replay"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Visualizer Scene Viewport */}
        <div className="flex-1 relative overflow-hidden bg-[#040814] flex items-center justify-center">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Fallback Static Visual in Reduced Motion */}
          {isReducedMotion && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#081126] text-center p-6">
              <div className="max-w-md space-y-2">
                <Sparkles className="w-8 h-8 text-[#20D9F2] mx-auto animate-pulse" />
                <h3 className="font-headline text-lg font-bold text-[#F5F7FF] uppercase">
                  {currentMilestone?.title}
                </h3>
                <p className="text-xs text-[#98A7BF]">{currentMilestone?.description}</p>
                <span className="inline-block text-[10px] font-mono text-[#FFB45B] bg-[#FFB45B]/10 px-2 py-1 rounded">
                  Reduced-Motion Static Scene Active
                </span>
              </div>
            </div>
          )}

          {/* Top Scene HUD Overlay */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
            <div className="flex items-center gap-2 bg-[#060B19]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#141D30]">
              <Clock className="w-3.5 h-3.5 text-[#FFB45B]" />
              <span className="font-mono text-xs font-bold text-[#F5F7FF]">
                {currentMilestone?.date || mission.launchDate}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#060B19]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#141D30]">
              <Compass className="w-3.5 h-3.5 text-[#20D9F2]" />
              <span className="font-mono text-[11px] text-[#98A7BF]">
                Target: {mission.destinationName}
              </span>
            </div>
          </div>

          {/* Educational Disclaimer Pill */}
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <div className="flex items-center gap-1.5 bg-[#060B19]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#141D30]">
              <ShieldAlert className="w-3 h-3 text-[#FFB45B]" />
              <span className="text-[10px] font-mono text-[#98A7BF]">
                Illustrative historical replay — not real-time telemetry
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Description Dossier Card */}
        <div className="bg-[#0A1021] border-t border-[#141D30] px-5 py-3.5 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#20D9F2] animate-ping" />
                <h4 className="font-headline text-base sm:text-lg font-bold text-[#F5F7FF] tracking-tight">
                  {currentMilestone?.title || 'Mission Trajectory En Route'}
                </h4>
              </div>
              <p className="font-body text-xs sm:text-sm text-[#98A7BF] leading-relaxed">
                {currentMilestone?.description || mission.description}
              </p>
              {currentMilestone?.significance && (
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[11px] font-mono text-[#20D9F2] uppercase font-semibold">
                    Historical Impact:
                  </span>
                  <span className="text-xs text-[#F5F7FF]/90 italic">
                    {currentMilestone.significance}
                  </span>
                </div>
              )}
            </div>

            {/* Spacecraft / Instrument Telemetry Chip */}
            {mission.spacecraftDetails?.launchVehicle && (
              <div className="bg-[#10182B] border border-[#141D30] rounded-xl px-3 py-2 shrink-0 text-left sm:text-right">
                <span className="text-[10px] font-mono text-[#98A7BF] uppercase block">
                  Launch Vehicle
                </span>
                <span className="text-xs font-mono font-bold text-[#20D9F2]">
                  {mission.spacecraftDetails.launchVehicle}
                </span>
                {mission.spacecraftDetails.powerSource && (
                  <span className="text-[10px] font-mono text-[#98A7BF] block mt-0.5">
                    {mission.spacecraftDetails.powerSource.split('(')[0]}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Milestone Step Progress Bar */}
        <div className="px-5 py-2 bg-[#060B19]/60 border-t border-[#141D30] shrink-0">
          <div className="flex items-center gap-1.5">
            {milestones.map((ms, idx) => (
              <button
                key={ms.id || idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setProgressPercent(0);
                }}
                className={`flex-1 h-2 rounded-full transition-all duration-300 relative group overflow-hidden ${
                  idx === currentIndex
                    ? 'bg-[#20D9F2]'
                    : idx < currentIndex
                    ? 'bg-[#8565FA]/60'
                    : 'bg-[#141D30]'
                }`}
                title={`${ms.title} (${ms.year})`}
                aria-label={`Jump to milestone ${idx + 1}: ${ms.title}`}
              >
                {/* Active milestone smooth sub-progress */}
                {idx === currentIndex && isPlaying && (
                  <div
                    className="absolute inset-0 bg-[#F5F7FF] opacity-50"
                    style={{ width: `${progressPercent}%` }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Playback Controls HUD */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#060B19] border-t border-[#141D30] shrink-0 flex-wrap gap-2">
          {/* Left: Previous / Play / Next / Restart */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="p-2 rounded-lg bg-[#10182B] hover:bg-[#141D30] text-[#98A7BF] hover:text-[#F5F7FF] transition-colors"
              title="Restart from beginning"
              aria-label="Restart Replay"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-2 rounded-lg bg-[#10182B] text-[#98A7BF] transition-colors ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-[#141D30] hover:text-[#F5F7FF]'
              }`}
              title="Previous Milestone"
              aria-label="Previous Milestone"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#20D9F2] text-[#00363E] font-headline text-xs font-bold uppercase hover:bg-[#20D9F2]/90 transition-colors shadow-lg shadow-[#20D9F2]/20"
              title={isPlaying ? 'Pause Replay' : 'Resume Replay'}
              aria-label={isPlaying ? 'Pause Replay' : 'Resume Replay'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume</span>
                </>
              )}
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === milestones.length - 1}
              className={`p-2 rounded-lg bg-[#10182B] text-[#98A7BF] transition-colors ${
                currentIndex === milestones.length - 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-[#141D30] hover:text-[#F5F7FF]'
              }`}
              title="Next Milestone"
              aria-label="Next Milestone"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Stage Title Snippet */}
          <div className="hidden md:flex items-center gap-2 font-mono text-xs text-[#98A7BF]">
            <Radio className="w-3.5 h-3.5 text-[#20D9F2] animate-pulse" />
            <span>
              Stage: {currentMilestone?.title || 'Flight Operations'}
            </span>
          </div>

          {/* Right: Speed Control & Exit */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#98A7BF] hidden sm:inline">Speed:</span>
            <div className="flex items-center rounded-lg bg-[#10182B] border border-[#141D30] p-0.5">
              {[0.5, 1.0, 2.0].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-[#20D9F2] text-[#00363E] font-bold'
                      : 'text-[#98A7BF] hover:text-[#F5F7FF]'
                  }`}
                  aria-label={`Playback speed ${speed}x`}
                >
                  {speed}×
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#10182B] hover:bg-[#141D30] text-xs font-headline font-bold uppercase text-[#98A7BF] hover:text-[#F5F7FF] transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
