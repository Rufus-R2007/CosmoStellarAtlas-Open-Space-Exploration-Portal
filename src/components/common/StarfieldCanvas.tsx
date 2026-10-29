import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../../store';

export const StarfieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { visualEffects } = useAppStore();

  useEffect(() => {
    if (visualEffects === 'off') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const numStars = visualEffects === 'high' ? 140 : 60;
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: (Math.random() * 0.15 + 0.05) * (Math.random() > 0.5 ? 1 : -1),
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    // Draw static stars once if minimal
    if (visualEffects === 'minimal') {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(245, 247, 255, ${star.alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    // High effect: animated loop
    let tick = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 1;

      stars.forEach((star) => {
        const currentAlpha =
          star.alpha + Math.sin(tick * star.twinkleSpeed) * 0.25;
        const boundedAlpha = Math.max(0.1, Math.min(1, currentAlpha));

        ctx.fillStyle = `rgba(245, 247, 255, ${boundedAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed * 0.3;
        if (star.y > height) star.y = 0;
        if (star.y < 0) star.y = height;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [visualEffects]);

  if (visualEffects === 'off') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
      aria-hidden="true"
    />
  );
};

