import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { spaceService } from '../services';

export type VisualEffectsLevel = 'high' | 'minimal' | 'off';
export type TelemetryUnits = 'metric' | 'imperial';

interface AppState {
  // Flagship Temporal & Mission State
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMissionId: string | null;
  setSelectedMissionId: (id: string | null) => void;
  timelineDecadeFilter: string | null;
  setTimelineDecadeFilter: (decade: string | null) => void;

  // Visual Effects & System Accessibility
  visualEffects: VisualEffectsLevel;
  setVisualEffects: (level: VisualEffectsLevel) => void;

  // Transparency & Demonstration Status
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;

  // Preferences
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  telemetryUnits: TelemetryUnits;
  setTelemetryUnits: (units: TelemetryUnits) => void;

  // Command Palette & Search
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Error simulation for verification & QA
  simulateError: boolean;
  setSimulateError: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedYear: 1969,
      setSelectedYear: (year: number) => set({ selectedYear: year }),
      selectedMissionId: null,
      setSelectedMissionId: (id: string | null) => set({ selectedMissionId: id }),
      timelineDecadeFilter: null,
      setTimelineDecadeFilter: (decade: string | null) => set({ timelineDecadeFilter: decade }),

      visualEffects: 'high',
      setVisualEffects: (level: VisualEffectsLevel) => set({ visualEffects: level }),

      demoMode: true,
      setDemoMode: (enabled: boolean) => set({ demoMode: enabled }),

      soundEnabled: false,
      setSoundEnabled: (enabled: boolean) => set({ soundEnabled: enabled }),

      telemetryUnits: 'metric',
      setTelemetryUnits: (units: TelemetryUnits) => set({ telemetryUnits: units }),

      isCommandPaletteOpen: false,
      setCommandPaletteOpen: (open: boolean) => set({ isCommandPaletteOpen: open }),

      searchQuery: '',
      setSearchQuery: (query: string) => set({ searchQuery: query }),

      simulateError: false,
      setSimulateError: (enabled: boolean) => {
        spaceService.setSimulatedError(enabled);
        set({ simulateError: enabled });
      },
    }),
    {
      name: 'cosmostellar_atlas_preferences',
      partialize: (state) => ({
        visualEffects: state.visualEffects,
        demoMode: state.demoMode,
        soundEnabled: state.soundEnabled,
        telemetryUnits: state.telemetryUnits,
      }),
    }
  )
);

