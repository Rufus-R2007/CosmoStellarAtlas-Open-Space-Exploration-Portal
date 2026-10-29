import React, { useEffect, useRef, useState } from 'react';
import { Planet } from '../../../../types';

interface PlanetCanvasFallbackProps {
  planet: Planet;
  isRotating: boolean;
  zoomLevel: number; // 0.8 to 1.5
}

export const PlanetCanvasFallback: React.FC<PlanetCanvasFallbackProps> = ({
  planet,
  isRotating,
  zoomLevel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let localRot = rotation;
    const size = 500;
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);

    const cx = size / 2;
    const cy = size / 2;
    const baseR = 125 * zoomLevel;
    const tiltRad = (planet.axialTiltDegrees * Math.PI) / 180;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      if (isRotating && !isDraggingRef.current) {
        localRot += 0.005;
      }

      ctx.save();
      ctx.translate(cx, cy);
      // Axial tilt
      ctx.rotate(tiltRad * 0.4);

      // Back half of rings if planet has rings
      if (planet.visualConfiguration.hasRings) {
        ctx.save();
        ctx.scale(1, 0.28);
        ctx.beginPath();
        ctx.arc(0, 0, baseR * 2.1, Math.PI, Math.PI * 2);
        ctx.strokeStyle = planet.visualConfiguration.ringColor || 'rgba(203, 190, 255, 0.4)';
        ctx.lineWidth = baseR * 0.7;
        ctx.stroke();
        ctx.restore();
      }

      // Planet Sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, baseR, 0, Math.PI * 2);
      ctx.clip();

      // Base planetary gradient
      const sphereGrad = ctx.createLinearGradient(-baseR * 0.8, -baseR * 0.8, baseR, baseR);
      sphereGrad.addColorStop(0, planet.accentColor);
      sphereGrad.addColorStop(0.5, planet.colorHex);
      sphereGrad.addColorStop(1, '#050a14');
      ctx.fillStyle = sphereGrad;
      ctx.fillRect(-baseR, -baseR, baseR * 2, baseR * 2);

      // Procedural features / bands simulation
      if (planet.type === 'Gas Giant') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let b = -4; b <= 4; b++) {
          ctx.fillRect(-baseR, b * (baseR * 0.2), baseR * 2, baseR * 0.08);
        }
      } else if (planet.id === 'earth') {
        // Continents
        ctx.fillStyle = '#1e523b';
        const offset = (localRot * 0.8) % (Math.PI * 2);
        const xPos = Math.sin(offset) * (baseR * 0.6);
        ctx.beginPath();
        ctx.ellipse(xPos, -baseR * 0.1, baseR * 0.5, baseR * 0.35, 0.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (planet.id === 'mars') {
        // Polar cap
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-baseR, -baseR, baseR * 2, baseR * 0.12);
      }

      // Day / Night Shadow Shading
      const shadowGrad = ctx.createRadialGradient(
        -baseR * 0.4,
        -baseR * 0.4,
        baseR * 0.2,
        baseR * 0.2,
        baseR * 0.2,
        baseR * 1.15
      );
      shadowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
      shadowGrad.addColorStop(0.8, 'rgba(4, 9, 21, 0.75)');
      shadowGrad.addColorStop(1, 'rgba(2, 5, 13, 0.98)');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(-baseR, -baseR, baseR * 2, baseR * 2);

      // Inner Atmosphere Rim Glow
      if (planet.visualConfiguration.atmosphereColor) {
        const rim = ctx.createRadialGradient(0, 0, baseR * 0.92, 0, 0, baseR);
        rim.addColorStop(0, 'rgba(0,0,0,0)');
        rim.addColorStop(1, `${planet.accentColor}88`);
        ctx.fillStyle = rim;
        ctx.fillRect(-baseR, -baseR, baseR * 2, baseR * 2);
      }

      ctx.restore(); // end sphere clip

      // Front half of rings
      if (planet.visualConfiguration.hasRings) {
        ctx.save();
        ctx.scale(1, 0.28);
        ctx.beginPath();
        ctx.arc(0, 0, baseR * 2.1, 0, Math.PI);
        ctx.strokeStyle = planet.visualConfiguration.ringColor || 'rgba(203, 190, 255, 0.7)';
        ctx.lineWidth = baseR * 0.7;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore(); // end tilt

      if (isRotating) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [planet, isRotating, zoomLevel, rotation]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    setRotation((prev) => prev + delta * 0.01);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      data-testid="planet-canvas-fallback"
    >
      <canvas
        ref={canvasRef}
        style={{ width: 500, height: 500, maxWidth: '100%', maxHeight: '100%' }}
        title={`${planet.name} 2D Accessible Visualizer`}
      />
      <div className="absolute bottom-3 left-3 bg-[#0A1021]/80 border border-[#141D30] px-2.5 py-1 rounded text-[10px] font-mono text-[#20D9F2]">
        ACCESSIBLE 2D ENGINE ACTIVE
      </div>
    </div>
  );
};

