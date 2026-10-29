import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[CosmoStellarAtlas:ErrorBoundary] Captured unexpected component exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReturnHome = (): void => {
    this.handleReset();
    window.location.hash = '#/';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[500px] flex items-center justify-center p-6"
        >
          <div className="w-full max-w-xl p-8 rounded-2xl bg-[#0A1021]/95 border border-rose-500/40 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center">
            {/* Top Tactical Status Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

            {/* Glowing Icon */}
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
              <AlertOctagon className="w-8 h-8 animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              Runtime Isolation Protocol Active
            </div>

            <h2 className="font-headline text-2xl font-bold uppercase tracking-wider text-[#F5F7FF] mb-2">
              {this.props.fallbackTitle || 'Telemetry Subsystem Interrupted'}
            </h2>

            <p className="font-body text-sm text-[#98A7BF] mb-6 leading-relaxed max-w-md mx-auto">
              An unexpected client-side anomaly occurred within this exploration module. The core portal shell remained protected and isolated the rendering fault safely.
            </p>

            {/* Error Message Details */}
            {this.state.error && (
              <div className="p-3 mb-6 rounded-lg bg-[#060B19]/80 border border-rose-500/20 text-left font-mono text-xs text-rose-300 overflow-x-auto max-h-32">
                <span className="text-[#64748B] select-none">$ exception: </span>
                {this.state.error.message || 'Unknown runtime anomaly'}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#20D9F2] text-[#060B19] font-headline text-xs font-bold uppercase tracking-wider hover:bg-[#20D9F2]/90 transition-all shadow-[0_0_20px_rgba(32,217,242,0.3)] focus:outline-none focus:ring-2 focus:ring-[#20D9F2]"
              >
                <RotateCcw className="w-4 h-4" />
                Re-initialize Subsystem
              </button>

              <button
                type="button"
                onClick={this.handleReturnHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F172A] border border-[#20D9F2]/30 text-[#20D9F2] font-headline text-xs font-bold uppercase tracking-wider hover:bg-[#20D9F2]/10 transition-all focus:outline-none focus:ring-2 focus:ring-[#20D9F2]/50"
              >
                <Home className="w-4 h-4" />
                Return to Observatory
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
