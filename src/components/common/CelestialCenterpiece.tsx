import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store';
import { Globe, Radio } from 'lucide-react';

export const CelestialCenterpiece: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { visualEffects } = useAppStore();
  const [rotationOffset, setRotationOffset] = useState(0);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = rotationOffset;
    let beaconAngle = 0;
    const width = 420;
    const height = 420;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    const cx = width / 2;
    const cy = height / 2;
    const r = 130;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (visualEffects !== 'off' && !isDraggingRef.current) {
        angle += 0.003;
      }
      beaconAngle += 0.015;

      // 1. Outer Ethereal Ionosphere Glow
      const atmoGrad = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.25);
      atmoGrad.addColorStop(0, 'rgba(32, 217, 242, 0.4)');
      atmoGrad.addColorStop(0.5, 'rgba(133, 101, 250, 0.15)');
      atmoGrad.addColorStop(1, 'rgba(6, 11, 25, 0)');
      ctx.fillStyle = atmoGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // 2. Tilted Orbit Track Behind Planet
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.35); // axial tilt
      ctx.scale(1, 0.35); // elliptical projection
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.5, Math.PI, Math.PI * 2); // back half
      ctx.strokeStyle = 'rgba(32, 217, 242, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.restore();

      // 3. Planet Sphere Base (Deep Oceanic Gradient)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      const oceanGrad = ctx.createLinearGradient(cx - r * 0.8, cy - r * 0.8, cx + r, cy + r);
      oceanGrad.addColorStop(0, '#0c3866');
      oceanGrad.addColorStop(0.4, '#082549');
      oceanGrad.addColorStop(0.8, '#041329');
      oceanGrad.addColorStop(1, '#020713');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      // 4. Continents Simulation via Moving Spherical Waves
      ctx.fillStyle = '#1b5e43';
      for (let i = 0; i < 5; i++) {
        const offset = (angle * 0.8 + i * 1.3) % (Math.PI * 2);
        const xPos = cx + Math.sin(offset) * (r * 0.7);
        const yPos = cy + Math.cos(offset * 0.7 + i) * (r * 0.5);
        const landRadius = (r * 0.35) * (0.8 + Math.sin(i * 2) * 0.2);

        if (Math.cos(offset) > -0.3) {
          ctx.beginPath();
          ctx.ellipse(xPos, yPos, landRadius * 1.4, landRadius * 0.8, 0.2 + i * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. Highlands / Topography Accents
      ctx.fillStyle = '#2d7a58';
      for (let i = 0; i < 3; i++) {
        const offset = (angle * 0.8 + i * 1.5) % (Math.PI * 2);
        const xPos = cx + Math.sin(offset) * (r * 0.5);
        const yPos = cy + Math.cos(offset * 0.5 + i) * (r * 0.3);
        if (Math.cos(offset) > -0.2) {
          ctx.beginPath();
          ctx.arc(xPos, yPos, r * 0.18, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 6. Swirling Cloud Formations
      ctx.fillStyle = 'rgba(235, 248, 255, 0.32)';
      for (let c = 0; c < 7; c++) {
        const cloudOffset = (angle * 1.1 + c * 0.9) % (Math.PI * 2);
        const cxCloud = cx + Math.sin(cloudOffset) * (r * 0.75);
        const cyCloud = cy - r * 0.6 + c * (r * 0.2);
        if (Math.cos(cloudOffset) > -0.3) {
          ctx.beginPath();
          ctx.ellipse(cxCloud, cyCloud, r * 0.4, r * 0.08, 0.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 7. Day/Night Terminator & Solar Sunlight Shading
      const shadowGrad = ctx.createRadialGradient(
        cx - r * 0.45,
        cy - r * 0.45,
        r * 0.2,
        cx + r * 0.2,
        cy + r * 0.2,
        r * 1.15
      );
      shadowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
      shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
      shadowGrad.addColorStop(0.75, 'rgba(4, 9, 21, 0.7)');
      shadowGrad.addColorStop(1, 'rgba(2, 5, 13, 0.96)');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      // Inner Rim Glow
      const innerRim = ctx.createRadialGradient(cx, cy, r * 0.92, cx, cy, r);
      innerRim.addColorStop(0, 'rgba(32, 217, 242, 0)');
      innerRim.addColorStop(1, 'rgba(32, 217, 242, 0.6)');
      ctx.fillStyle = innerRim;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.restore(); // end clip

      // 8. Tilted Orbit Track in Front of Planet
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.35);
      ctx.scale(1, 0.35);
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.5, 0, Math.PI); // front half
      ctx.strokeStyle = 'rgba(32, 217, 242, 0.65)';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([8, 4]);
      ctx.stroke();

      // Orbiting Telemetry Beacon Satellite
      const bx = Math.cos(beaconAngle) * (r * 1.5);
      const by = Math.sin(beaconAngle) * (r * 1.5);
      ctx.restore();

      // Convert tilted beacon coords to screen coords
      const rad = -0.35;
      const rx = cx + (bx * Math.cos(rad) - (by * 0.35) * Math.sin(rad));
      const ry = cy + (bx * Math.sin(rad) + (by * 0.35) * Math.cos(rad));

      // Draw Satellite Beacon Glow
      ctx.fillStyle = '#FFB45B';
      ctx.beginPath();
      ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 180, 91, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(rx, ry, 7 + Math.sin(beaconAngle * 3) * 2, 0, Math.PI * 2);
      ctx.stroke();

      if (visualEffects === 'high') {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [visualEffects, rotationOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - lastMouseXRef.current;
    lastMouseXRef.current = e.clientX;
    setRotationOffset((prev) => prev + delta * 0.01);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square flex items-center justify-center select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background Decorative Rings */}
      <div className="absolute w-[440px] h-[440px] rounded-full border border-dashed border-[#20D9F2]/20 pointer-events-none animate-spin-slow" />
      <div className="absolute w-[360px] h-[360px] rounded-full border border-[#8565FA]/25 pointer-events-none" />

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: 420, height: 420 }}
        className="cursor-grab active:cursor-grabbing z-10"
        title="Interactive Terra Celestial Viewport - Drag to rotate"
      />

      {/* Top Left Telemetry Floater */}
      <div className="absolute top-2 left-0 bg-[#0A1021]/90 border border-[#1D2A44] backdrop-blur-md px-3.5 py-2 rounded-xl shadow-hud-panel flex items-center gap-2.5 z-20 pointer-events-none">
        <Radio className="w-4 h-4 text-[#20D9F2] animate-pulse" />
        <div className="flex flex-col">
          <span className="font-telemetry text-[11px] text-[#F5F7FF] uppercase font-bold tracking-wider">
            Earth Sensor Array
          </span>
          <span className="font-mono text-[11px] text-[#20D9F2]">ORB VEL: 29.78 km/s</span>
        </div>
      </div>

      {/* Bottom Right Telemetry Floater */}
      <div className="absolute bottom-2 right-0 bg-[#0A1021]/90 border border-[#1D2A44] backdrop-blur-md px-3.5 py-2 rounded-xl shadow-hud-panel flex items-center gap-2.5 z-20 pointer-events-none">
        <Globe className="w-4 h-4 text-[#CBBEFF]" />
        <div className="flex flex-col">
          <span className="font-telemetry text-[11px] text-[#F5F7FF] uppercase font-bold tracking-wider">
            Atmosphere Telemetry
          </span>
          <span className="font-mono text-[11px] text-[#CBBEFF]">N₂ 78.08% / O₂ 20.95%</span>
        </div>
      </div>
    </div>
  );
};

