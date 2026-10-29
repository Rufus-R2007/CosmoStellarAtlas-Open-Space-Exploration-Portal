import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  subtext: string;
  badgeText: string;
  icon: React.ReactNode;
  glow?: 'cyan' | 'violet' | 'gold';
  formatter?: (val: number) => string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  subtext,
  badgeText,
  icon,
  glow = 'cyan',
  formatter = (v) => v.toLocaleString(),
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800; // ms
    const steps = 30;
    const increment = value / steps;
    const stepTime = duration / steps;

    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const glowThemes = {
    cyan: {
      text: 'text-[#20D9F2]',
      badge: 'bg-[#20D9F2]/10 text-[#20D9F2] border-[#20D9F2]/30',
      iconText: 'text-[#20D9F2]',
    },
    violet: {
      text: 'text-[#CBBEFF]',
      badge: 'bg-[#8565FA]/15 text-[#CBBEFF] border-[#8565FA]/30',
      iconText: 'text-[#8565FA]',
    },
    gold: {
      text: 'text-[#FFB45B]',
      badge: 'bg-[#FFB45B]/15 text-[#FFB45B] border-[#FFB45B]/30',
      iconText: 'text-[#FFB45B]',
    },
  };

  const currentTheme = glowThemes[glow];

  return (
    <Card glow={glow} className="flex flex-col justify-between p-5 min-h-[160px]">
      <div className="flex items-center justify-between">
        <span className="font-telemetry text-xs uppercase tracking-widest text-[#98A7BF] font-medium">
          {label}
        </span>
        <span className={cn('p-1.5 rounded-lg bg-[#060B19]/80 border border-[#141D30]', currentTheme.iconText)}>
          {icon}
        </span>
      </div>

      <div className="my-3 flex items-baseline gap-2">
        <span className={cn('font-headline text-3xl sm:text-4xl font-bold tracking-tight', currentTheme.text)}>
          {formatter(displayValue)}
        </span>
        <span className="font-telemetry text-xs text-[#98A7BF] uppercase tracking-wider font-semibold">
          {unit}
        </span>
      </div>

      <div className="pt-2.5 border-t border-[#141D30] flex items-center justify-between text-xs text-[#98A7BF]">
        <span className="font-mono text-[11px] truncate max-w-[65%]">{subtext}</span>
        <span className={cn('px-2 py-0.5 rounded text-[10px] font-telemetry font-semibold uppercase tracking-wider border', currentTheme.badge)}>
          {badgeText}
        </span>
      </div>
    </Card>
  );
};
