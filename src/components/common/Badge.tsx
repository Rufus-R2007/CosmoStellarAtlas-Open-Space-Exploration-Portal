import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'violet' | 'gold' | 'outline' | 'curated' | 'synthetic' | 'success' | 'alert';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'cyan',
  size = 'md',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center gap-1.5 font-headline font-semibold uppercase tracking-wider rounded border transition-colors';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-widest',
    md: 'text-xs px-2.5 py-1 tracking-wider',
  };

  const variantClasses = {
    cyan: 'bg-[#20D9F2]/10 border-[#20D9F2]/40 text-[#20D9F2] shadow-[0_0_10px_rgba(32,217,242,0.15)]',
    violet: 'bg-[#8565FA]/15 border-[#8565FA]/40 text-[#CBBEFF]',
    gold: 'bg-[#FFB45B]/15 border-[#FFB45B]/40 text-[#FFB45B]',
    outline: 'bg-transparent border-[#1D2A44] text-[#98A7BF]',
    curated: 'bg-[#20D9F2]/10 border-[#20D9F2]/40 text-[#20D9F2]',
    synthetic: 'bg-[#FFB45B]/15 border-[#FFB45B]/40 text-[#FFB45B]',
    success: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
    alert: 'bg-rose-500/15 border-rose-500/40 text-rose-400',
  };

  return (
    <span
      className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
