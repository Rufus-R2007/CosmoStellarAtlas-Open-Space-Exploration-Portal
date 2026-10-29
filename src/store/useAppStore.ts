import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { spaceService } from '../services';
import { SimulationParameters } from '../types';
import { DEFAULT_SIMULATION_PARAMETERS } from '../features/asteroids/utils/planetaryDefenseMath';

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

  // Mars Rover Operations State
  selectedRoverId: string;
  setSelectedRoverId: (id: string) => void;
  selectedSol: number | null;
  setSelectedSol: (sol: number | null) => void;
  selectedCameraId: string | null;
  setSelectedCameraId: (cameraId: string | null) => void;
  inspectingImageId: string | null;
  setInspectingImageId: (imageId: string | null) => void;
  userRoverNotes: Record<string, string>;
  saveUserRoverNote: (imageId: string, note: string) => void;

  // Asteroid Watch & Planetary Defense What-If State
  selectedAsteroidId: string | null;
  setSelectedAsteroidId: (id: string | null) => void;
  inspectingAsteroidId: string | null;
  setInspectingAsteroidId: (id: string | null) => void;
  whatIfParameters: SimulationParameters;
  setWhatIfParameters: (params: Partial<SimulationParameters>) => void;
  resetWhatIfParameters: () => void;

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

      // Mars Rover State Defaults
      selectedRoverId: 'perseverance',
      setSelectedRoverId: (id: string) =>
        set({ selectedRoverId: id, selectedSol: null, selectedCameraId: null }),
      selectedSol: null,
      setSelectedSol: (sol: number | null) => set({ selectedSol: sol }),
      selectedCameraId: null,
      setSelectedCameraId: (cameraId: string | null) => set({ selectedCameraId: cameraId }),
      inspectingImageId: null,
      setInspectingImageId: (imageId: string | null) => set({ inspectingImageId: imageId }),
      userRoverNotes: {},
      saveUserRoverNote: (imageId: string, note: string) =>
        set((state) => ({
          userRoverNotes: {
            ...state.userRoverNotes,
            [imageId]: note,
          },
        })),

      // Asteroid Watch State Defaults
      selectedAsteroidId: 'sim-2026-001',
      setSelectedAsteroidId: (id: string | null) => set({ selectedAsteroidId: id }),
      inspectingAsteroidId: null,
      setInspectingAsteroidId: (id: string | null) => set({ inspectingAsteroidId: id }),
      whatIfParameters: { ...DEFAULT_SIMULATION_PARAMETERS },
      setWhatIfParameters: (params: Partial<SimulationParameters>) =>
        set((state) => ({
          whatIfParameters: { ...state.whatIfParameters, ...params },
        })),
      resetWhatIfParameters: () =>
        set({ whatIfParameters: { ...DEFAULT_SIMULATION_PARAMETERS } }),

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
        selectedRoverId: state.selectedRoverId,
        userRoverNotes: state.userRoverNotes,
        selectedAsteroidId: state.selectedAsteroidId,
      }),
    }
  )
);

