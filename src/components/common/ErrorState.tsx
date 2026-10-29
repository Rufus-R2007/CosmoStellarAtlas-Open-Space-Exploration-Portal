import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Telemetry Uplink Interrupted',
  message = 'An unexpected anomaly occurred while querying the local data provider. The system captured the telemetry fault safely.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 bg-[#0A1021]/80 border border-rose-500/30 rounded-xl text-center max-w-lg mx-auto gap-4 shadow-lg',
        className
      )}
      role="alert"
    >
      <div className="p-3 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-headline text-lg font-bold uppercase tracking-wide text-[#F5F7FF]">
          {title}
        </h3>
        <p className="font-body text-xs text-[#98A7BF] mt-1.5 leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Re-establish Uplink
        </Button>
      )}
    </div>
  );
};
