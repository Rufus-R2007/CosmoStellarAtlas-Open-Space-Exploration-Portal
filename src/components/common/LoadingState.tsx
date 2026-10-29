import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Synchronizing Deep Space Telemetry...',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center text-[#98A7BF] gap-3',
        className
      )}
      role="status"
    >
      <Loader2 className="w-8 h-8 text-[#20D9F2] animate-spin" />
      <span className="font-telemetry text-xs uppercase tracking-widest text-[#20D9F2]">
        {message}
      </span>
    </div>
  );
};

