import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'cyan' | 'violet' | 'gold' | 'none';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glow = 'none',
  interactive = false,
  ...props
}) => {
  const glowClasses = {
    none: '',
    cyan: 'hover:border-[#20D9F2]/50 hover:shadow-[0_0_24px_rgba(32,217,242,0.15)]',
    violet: 'hover:border-[#8565FA]/50 hover:shadow-[0_0_24px_rgba(133,101,250,0.15)]',
    gold: 'hover:border-[#FFB45B]/50 hover:shadow-[0_0_24px_rgba(255,180,91,0.15)]',
  };

  return (
    <div
      className={cn(
        'relative bg-[#0A1021]/90 border border-[#141D30] backdrop-blur-xl rounded-xl p-5 transition-all duration-300',
        interactive && 'cursor-pointer hover:-translate-y-0.5',
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
