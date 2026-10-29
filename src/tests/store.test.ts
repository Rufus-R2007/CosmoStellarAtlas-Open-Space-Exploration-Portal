import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store';

describe('useAppStore (Requirement 4)', () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedYear: 1969,
      visualEffects: 'high',
      demoMode: true,
      simulateError: false,
    });
  });

  it('Requirement 4: historical year selection updates shared store state', () => {
    expect(useAppStore.getState().selectedYear).toBe(1969);

    useAppStore.getState().setSelectedYear(1977);
    expect(useAppStore.getState().selectedYear).toBe(1977);

    useAppStore.getState().setSelectedYear(2021);
    expect(useAppStore.getState().selectedYear).toBe(2021);
  });

  it('updates visual effects preference and demo mode correctly', () => {
    useAppStore.getState().setVisualEffects('minimal');
    expect(useAppStore.getState().visualEffects).toBe('minimal');

    useAppStore.getState().setVisualEffects('off');
    expect(useAppStore.getState().visualEffects).toBe('off');

    useAppStore.getState().setDemoMode(false);
    expect(useAppStore.getState().demoMode).toBe(false);
  });

  it('updates simulateError state correctly', () => {
    expect(useAppStore.getState().simulateError).toBe(false);
    useAppStore.getState().setSimulateError(true);
    expect(useAppStore.getState().simulateError).toBe(true);
  });
});
