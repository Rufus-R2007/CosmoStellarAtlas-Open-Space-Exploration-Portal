import React from 'react';
import { SearchX } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Celestial Records Identified',
  message = 'No records matched your search or temporal filter criteria in the local dataset.',
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-10 text-center border border-dashed border-[#1D2A44] rounded-xl bg-[#0A1021]/50 max-w-md mx-auto gap-3 text-[#98A7BF]',
        className
      )}
    >
      <div className="p-3 rounded-full bg-[#10182B] text-[#98A7BF] border border-[#1D2A44]">
        {icon || <SearchX className="w-6 h-6 text-[#98A7BF]" />}
      </div>
      <div>
        <h4 className="font-headline text-base font-semibold uppercase text-[#F5F7FF]">
          {title}
        </h4>
        <p className="font-body text-xs text-[#98A7BF] mt-1 leading-relaxed">
          {message}
        </p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

