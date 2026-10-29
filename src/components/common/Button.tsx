import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  disabled,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-headline font-semibold uppercase tracking-wider rounded transition-all focus:outline-none focus:ring-2 focus:ring-[#20D9F2]/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-bold',
  };

  const variantClasses = {
    primary:
      'bg-[#20D9F2] text-[#00363E] shadow-[0_0_20px_rgba(32,217,242,0.35)] hover:bg-[#9BEFFF] hover:shadow-[0_0_28px_rgba(32,217,242,0.6)] border border-transparent',
    secondary:
      'bg-[#10182B] text-[#F5F7FF] hover:bg-[#151F35] border border-[#1D2A44] hover:border-[#20D9F2]/50 shadow-sm',
    outline:
      'bg-transparent text-[#F5F7FF] border border-[#20D9F2]/40 hover:bg-[#10182B] hover:border-[#20D9F2] hover:text-[#20D9F2]',
    ghost:
      'bg-transparent text-[#98A7BF] hover:text-[#F5F7FF] hover:bg-[#10182B]/60 border border-transparent',
  };

  return (
    <button
      className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

