import {
  UserProfile,
  FavoriteItem,
  CollectionItem,
  JournalNote,
  QuizAttempt,
  ExplorationEvent,
  VaultBackupData,
} from '../types';

export const VAULT_STORAGE_KEY = 'cosmostellaratlas:user:v1';

export function createDefaultUserProfile(): UserProfile {
  return {
    id: 'usr-explorer-default',
    displayName: 'Cosmo Explorer',
    callsign: 'ATLAS-01',
    bio: 'Independent astronomical researcher and orbital explorer.',
    avatarSeed: 'orion',
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    rank: 'Novice Observer',
    level: 1,
  };
}

export interface VaultStorageState {
  profile: UserProfile;
  favorites: FavoriteItem[];
  collections: CollectionItem[];
  journalNotes: JournalNote[];
  completedLessonIds: string[];
  quizAttempts: QuizAttempt[];
  explorationEvents: ExplorationEvent[];
}

export function createInitialVaultState(): VaultStorageState {
  return {
    profile: createDefaultUserProfile(),
    favorites: [],
    collections: [
      {
        id: 'col-solar-favorites',
        name: 'Planetary Highlights',
        description: 'Remarkable planets and extreme moons surveyed across Sol.',
        colorHex: '#20D9F2',
        iconName: 'Globe',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'col-historical-flagships',
        name: 'Pioneering Expeditions',
        description: 'Landmark historical missions that redefined humanity’s cosmic horizon.',
        colorHex: '#8565FA',
        iconName: 'Rocket',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    journalNotes: [],
    completedLessonIds: [],
    quizAttempts: [],
    explorationEvents: [],
  };
}

// Memory fallback if localStorage is disabled or throws quota error
let memoryFallbackState: VaultStorageState | null = null;

export class VaultStorageService {
  /**
   * Load stored vault state or return initial state
   */
  public static loadState(): VaultStorageState {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return memoryFallbackState ? JSON.parse(JSON.stringify(memoryFallbackState)) : createInitialVaultState();
      }
      const raw = window.localStorage.getItem(VAULT_STORAGE_KEY);
      if (!raw) {
        return createInitialVaultState();
      }
      const parsed = JSON.parse(raw);
      return this.validateAndSanitize(parsed);
    } catch (err) {
      console.warn('VaultStorageService: Error loading from localStorage, using fallback', err);
      return memoryFallbackState ? JSON.parse(JSON.stringify(memoryFallbackState)) : createInitialVaultState();
    }
  }

  /**
   * Save vault state safely to localStorage
   */
  public static saveState(state: VaultStorageState): boolean {
    memoryFallbackState = JSON.parse(JSON.stringify(state));
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(state));
        return true;
      }
    } catch (err) {
      console.error('VaultStorageService: Failed to save to localStorage', err);
    }
    return false;
  }

  /**
   * Sanitize and fill defaults for any missing state fields
   */
  public static validateAndSanitize(data: any): VaultStorageState {
    if (!data || typeof data !== 'object') {
      return createInitialVaultState();
    }

    const defaultProfile = createDefaultUserProfile();
    const profile: UserProfile = {
      ...defaultProfile,
      ...(data.profile && typeof data.profile === 'object' ? data.profile : {}),
    };

    const favorites: FavoriteItem[] = Array.isArray(data.favorites)
      ? data.favorites.filter((f: any) => f && f.id && f.entityId && f.entityType)
      : [];

    const defaultInitial = createInitialVaultState();
    const collections: CollectionItem[] = Array.isArray(data.collections)
      ? data.collections.filter((c: any) => c && c.id && c.name)
      : defaultInitial.collections;

    const journalNotes: JournalNote[] = Array.isArray(data.journalNotes)
      ? data.journalNotes.filter((n: any) => n && n.id && n.title)
      : [];

    const completedLessonIds: string[] = Array.isArray(data.completedLessonIds)
      ? data.completedLessonIds.filter((id: any) => typeof id === 'string')
      : [];

    const quizAttempts: QuizAttempt[] = Array.isArray(data.quizAttempts)
      ? data.quizAttempts.filter((q: any) => q && q.id && q.trailId)
      : [];

    const explorationEvents: ExplorationEvent[] = Array.isArray(data.explorationEvents)
      ? data.explorationEvents.filter((e: any) => e && e.id && e.eventType)
      : [];

    return {
      profile,
      favorites,
      collections,
      journalNotes,
      completedLessonIds,
      quizAttempts,
      explorationEvents,
    };
  }

  /**
   * Calculate storage footprint in bytes and human-readable string
   */
  public static getStorageFootprint(): { bytes: number; formatted: string } {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(VAULT_STORAGE_KEY) || '';
        const bytes = new Blob([raw]).size;
        if (bytes < 1024) return { bytes, formatted: `${bytes} B` };
        if (bytes < 1024 * 1024) return { bytes, formatted: `${(bytes / 1024).toFixed(1)} KB` };
        return { bytes, formatted: `${(bytes / (1024 * 1024)).toFixed(2)} MB` };
      }
    } catch {
      // Fallback
    }
    return { bytes: 0, formatted: '0 KB' };
  }

  /**
   * Export vault as JSON file download
   */
  public static exportJSON(state: VaultStorageState): void {
    const backupData: VaultBackupData = {
      version: 'cosmostellaratlas:user:v1',
      exportedAt: new Date().toISOString(),
      profile: state.profile,
      favorites: state.favorites,
      collections: state.collections,
      journalNotes: state.journalNotes,
      completedLessonIds: state.completedLessonIds,
      quizAttempts: state.quizAttempts,
      explorationEvents: state.explorationEvents,
    };

    const json = JSON.stringify(backupData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `cosmostellaratlas-vault-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Validate and parse an imported JSON backup string
   */
  public static parseAndValidateBackup(jsonString: string): {
    isValid: boolean;
    data?: VaultStorageState;
    error?: string;
  } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { isValid: false, error: 'File content is not a valid JSON object.' };
      }
      if (parsed.version !== 'cosmostellaratlas:user:v1') {
        return {
          isValid: false,
          error: `Unrecognized or incompatible backup format: expected version 'cosmostellaratlas:user:v1'.`,
        };
      }

      const sanitized = this.validateAndSanitize(parsed);
      return { isValid: true, data: sanitized };
    } catch (err: any) {
      return { isValid: false, error: `JSON Parse error: ${err?.message || 'Invalid syntax'}` };
    }
  }

  /**
   * Reset local storage to clean defaults
   */
  public static resetVault(): void {
    memoryFallbackState = createInitialVaultState();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(VAULT_STORAGE_KEY);
      }
    } catch (err) {
      console.error('VaultStorageService: Failed to clear localStorage', err);
    }
  }
}
