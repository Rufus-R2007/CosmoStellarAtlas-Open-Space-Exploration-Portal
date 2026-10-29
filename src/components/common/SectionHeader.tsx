import React from 'react';
import { cn } from '../../utils/cn';

export interface SectionHeaderProps {
  icon?: React.ReactNode;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  eyebrow,
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6', className)}>
      <div className="flex flex-col">
        {(eyebrow || icon) && (
          <div className="flex items-center gap-2 text-[#20D9F2] mb-1.5">
            {icon && <span className="inline-flex text-[#20D9F2]">{icon}</span>}
            {eyebrow && (
              <span className="font-telemetry text-xs uppercase tracking-widest font-semibold">
                {eyebrow}
              </span>
            )}
          </div>
        )}
        <h2 className="font-headline text-2xl lg:text-3xl font-bold tracking-tight text-[#F5F7FF] uppercase">
          {title}
        </h2>
        {subtitle && (
          <p className="font-body text-sm text-[#98A7BF] mt-1 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
