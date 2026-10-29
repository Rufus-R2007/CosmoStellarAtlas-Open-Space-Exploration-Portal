import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Sliders,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { useAppStore, VisualEffectsLevel } from '../../store';
import { OfflineDemoIndicator } from '../common/OfflineDemoIndicator';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
}) => {
  const {
    setCommandPaletteOpen,
    visualEffects,
    setVisualEffects,
    simulateError,
    setSimulateError,
  } = useAppStore();
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-[#060B19]/85 backdrop-blur-xl border-b border-[#141D30] z-40 flex items-center justify-between px-4 lg:px-6 shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
      {/* Brand on Mobile + Sector Breadcrumb */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg bg-[#0A1021] border border-[#141D30] text-[#98A7BF] hover:text-[#F5F7FF] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Brand */}
        <Link to="/" className="flex items-center gap-2.5 lg:hidden">
          <div className="p-1.5 rounded-lg bg-[#20D9F2]/10 border border-[#20D9F2]/30 text-[#20D9F2]">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-headline font-bold uppercase tracking-wider text-[#F5F7FF] text-sm">
            StellarAtlas
          </span>
        </Link>

        {/* Desktop Sector Telemetry Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0A1021] border border-[#141D30]">
          <span className="w-2 h-2 rounded-full bg-[#20D9F2] animate-pulse" />
          <span className="font-mono text-xs text-[#20D9F2] uppercase tracking-wider">
            SECTOR: SOL-SYS // RECON 01
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A1021] border border-[#141D30] hover:border-[#20D9F2]/40 text-[#98A7BF] hover:text-[#F5F7FF] transition-colors cursor-pointer text-xs font-telemetry"
          aria-label="Open Command Palette"
        >
          <Search className="w-3.5 h-3.5 text-[#20D9F2]" />
          <span className="hidden sm:inline uppercase">Command Palette</span>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#10182B] text-[#F5F7FF] border border-[#1D2A44]">
            Ctrl+K
          </kbd>
        </button>

        {/* Offline Demo Indicator */}
        <div className="hidden sm:block">
          <OfflineDemoIndicator />
        </div>

        {/* Settings / FX Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowSettingsPopover(!showSettingsPopover)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0A1021] hover:bg-[#10182B] border border-[#141D30] text-[#98A7BF] hover:text-[#F5F7FF] transition-colors"
            title="System Preferences & FX"
            aria-label="System Preferences"
          >
            <Sliders className="w-4 h-4 text-[#20D9F2]" />
            <span className="hidden md:inline font-telemetry text-xs uppercase">
              FX: {visualEffects}
            </span>
          </button>

          {/* Settings Popover */}
          {showSettingsPopover && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0A1021] border border-[#25334B] rounded-xl p-4 shadow-2xl z-50 text-xs text-[#F5F7FF] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#141D30]">
                <span className="font-headline font-bold uppercase tracking-wider text-[#20D9F2] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  System Preferences
                </span>
                <button
                  onClick={() => setShowSettingsPopover(false)}
                  className="text-[#98A7BF] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Visual Effects Level */}
              <div>
                <label className="font-telemetry uppercase text-[#98A7BF] block mb-1.5">
                  Visual Effects & Shaders
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['high', 'minimal', 'off'] as VisualEffectsLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setVisualEffects(level)}
                      className={`py-1 rounded font-telemetry uppercase text-[10px] font-semibold transition-colors ${
                        visualEffects === level
                          ? 'bg-[#20D9F2] text-[#00363E]'
                          : 'bg-[#10182B] text-[#98A7BF] hover:text-[#F5F7FF]'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* QA Error Simulation */}
              <div className="pt-2 border-t border-[#141D30]">
                <div className="flex items-center justify-between">
                  <span className="font-telemetry uppercase text-[#98A7BF]">
                    Simulate Provider Error (QA)
                  </span>
                  <input
                    type="checkbox"
                    checked={simulateError}
                    onChange={(e) => setSimulateError(e.target.checked)}
                    className="accent-[#20D9F2] cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-[#98A7BF] mt-1">
                  Enables controlled fault simulation to verify safe UI error handling.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Explorer Passport Badge */}
        <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-[#141D30]">
          <div className="flex flex-col items-end">
            <span className="font-headline text-xs font-bold uppercase tracking-wider text-[#F5F7FF]">
              Cmdr. Rufus
            </span>
            <span className="font-mono text-[10px] text-[#20D9F2] uppercase tracking-widest">
              Karunya Recon
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#20D9F2] to-[#8565FA] p-0.5 shadow-[0_0_10px_rgba(32,217,242,0.3)]">
            <div className="w-full h-full bg-[#060B19] rounded-full flex items-center justify-center font-headline text-xs font-bold text-[#20D9F2]">
              R
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
