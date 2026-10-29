import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  Globe,
  Rocket,
  Clock,
  Radio,
  ShieldAlert,
  Network,
  BookOpen,
  Vault,
  Wifi,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  isPhase1Active?: boolean;
}

const navItems: NavItem[] = [
  {
    name: 'Observatory',
    path: '/',
    icon: <Compass className="w-4 h-4" />,
    badge: 'ACTIVE',
    isPhase1Active: true,
  },
  {
    name: 'Planet Explorer',
    path: '/planets',
    icon: <Globe className="w-4 h-4" />,
    badge: 'PHASE 2',
  },
  {
    name: 'Cosmic Time Machine',
    path: '/timeline',
    icon: <Clock className="w-4 h-4" />,
    badge: 'PHASE 3',
  },
  {
    name: 'Mission Control',
    path: '/missions',
    icon: <Rocket className="w-4 h-4" />,
    badge: 'PHASE 4',
  },
  {
    name: 'Mars Rover Explorer',
    path: '/rovers',
    icon: <Radio className="w-4 h-4" />,
    badge: 'PHASE 5',
  },
  {
    name: 'Asteroid Watch & Lab',
    path: '/asteroids',
    icon: <ShieldAlert className="w-4 h-4" />,
    badge: 'PHASE 6',
  },
  {
    name: 'Space Intelligence',
    path: '/intelligence',
    icon: <Network className="w-4 h-4" />,
    badge: 'PHASE 7',
  },
  {
    name: 'Learning Hub',
    path: '/learn',
    icon: <BookOpen className="w-4 h-4" />,
    badge: 'PHASE 7',
  },
  {
    name: 'Personal Vault',
    path: '/vault',
    icon: <Vault className="w-4 h-4" />,
    badge: 'PHASE 8',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-[#060B19]/95 lg:bg-[#060B19]/85 backdrop-blur-2xl z-50 flex flex-col justify-between border-r border-[#141D30] shadow-[0_0_24px_-4px_rgba(32,217,242,0.06)] transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-5 flex items-center gap-3 border-b border-[#141D30]">
            <div className="w-8 h-8 rounded-lg bg-[#20D9F2]/10 border border-[#20D9F2]/30 flex items-center justify-center text-[#20D9F2] shadow-[0_0_12px_rgba(32,217,242,0.2)]">
              <Compass className="w-5 h-5 animate-pulse-subtle" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-base font-bold uppercase tracking-wider text-[#F5F7FF]">
                StellarAtlas
              </span>
              <span className="font-telemetry text-[10px] text-[#20D9F2] uppercase tracking-widest">
                Astronav HUD // v1.0
              </span>
            </div>
          </div>

          {/* Nav Section Label */}
          <div className="px-5 pt-5 pb-2">
            <span className="font-telemetry text-[10px] uppercase text-[#98A7BF] tracking-widest font-semibold">
              Exploration Array
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg font-telemetry text-xs uppercase tracking-wider transition-all duration-200 group',
                    isActive
                      ? 'bg-[#20D9F2] text-[#00363E] font-bold shadow-[0_0_16px_rgba(32,217,242,0.3)]'
                      : 'text-[#98A7BF] hover:bg-[#10182B] hover:text-[#F5F7FF]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#00363E]' : 'text-[#98A7BF] group-hover:text-[#20D9F2]'}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight',
                          isActive
                            ? 'bg-[#00363E] text-[#20D9F2]'
                            : item.isPhase1Active
                            ? 'bg-[#20D9F2]/10 text-[#20D9F2] border border-[#20D9F2]/30'
                            : 'bg-[#10182B] text-[#98A7BF] border border-[#141D30]'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Telemetry Gauge & Coordinates Footer */}
        <div className="p-4 border-t border-[#141D30] space-y-3">
          <div className="bg-[#0A1021]/80 border border-[#141D30] p-3 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-telemetry text-[10px] uppercase text-[#98A7BF] flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-[#20D9F2]" />
                Spectra Uplink
              </span>
              <span className="font-mono text-[11px] text-[#20D9F2] font-bold">
                99.4%
              </span>
            </div>
            <div className="w-full bg-[#10182B] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#20D9F2] h-full w-[99.4%] shadow-[0_0_8px_#20D9F2]" />
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-[#98A7BF] pt-1 border-t border-[#141D30]/60">
              <span>LAT 28.5721° N</span>
              <span>LON 80.6480° W</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
