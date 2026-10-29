import { create } from 'zustand';
import {
  UserProfile,
  FavoriteItem,
  CollectionItem,
  JournalNote,
  QuizAttempt,
  ExplorationEvent,
  Achievement,
  VaultEntityType,
  ExplorationEventType,
} from '../types';
import {
  VaultStorageService,
  VaultStorageState,
  createInitialVaultState,
} from '../services/vaultStorageService';
import {
  computeAchievements,
  computeExplorerRank,
} from '../services/achievementDefinitions';

export interface VaultState {
  profile: UserProfile;
  favorites: FavoriteItem[];
  collections: CollectionItem[];
  journalNotes: JournalNote[];
  completedLessonIds: string[];
  quizAttempts: QuizAttempt[];
  explorationEvents: ExplorationEvent[];
  achievements: Achievement[];

  // Profile actions
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Favorites actions
  addFavorite: (
    item: Omit<FavoriteItem, 'id' | 'addedAt' | 'collectionIds'>,
    collectionIds?: string[]
  ) => void;
  removeFavorite: (idOrType: string, entityId?: string) => void;
  toggleFavorite: (
    item: Omit<FavoriteItem, 'id' | 'addedAt' | 'collectionIds'>
  ) => boolean;
  isFavorite: (entityType: VaultEntityType, entityId: string) => boolean;

  // Collections actions
  createCollection: (
    name: string,
    description: string,
    colorHex?: string,
    iconName?: string
  ) => string;
  updateCollection: (
    id: string,
    name: string,
    description: string,
    colorHex?: string
  ) => void;
  deleteCollection: (id: string) => void;
  addFavoriteToCollection: (favoriteId: string, collectionId: string) => void;
  removeFavoriteFromCollection: (favoriteId: string, collectionId: string) => void;

  // Journal notes actions
  createJournalNote: (note: {
    title: string;
    content: string;
    entityType?: VaultEntityType | 'general';
    entityId?: string;
    entityTitle?: string;
    tags?: string[];
  }) => string;
  updateJournalNote: (id: string, updates: Partial<JournalNote>) => void;
  deleteJournalNote: (id: string) => void;

  // Curriculum & Learning actions
  completeLesson: (lessonId: string) => void;
  recordQuizAttempt: (
    attempt: Omit<QuizAttempt, 'id' | 'timestamp'>
  ) => QuizAttempt;

  // Exploration Event Logging
  logExplorationEvent: (
    eventType: ExplorationEventType,
    entityId?: string,
    metadata?: Record<string, string | number | boolean>
  ) => void;

  // Backup, Recovery & Maintenance
  exportBackup: () => void;
  importBackup: (
    jsonString: string,
    mode: 'merge' | 'replace'
  ) => { success: boolean; message: string };
  resetVault: () => void;
}

function recomputeAndPersist(
  currentState: VaultStorageState,
  prevAchievements?: Achievement[]
): {
  state: VaultStorageState;
  achievements: Achievement[];
} {
  const achievements = computeAchievements(
    {
      events: currentState.explorationEvents,
      favorites: currentState.favorites,
      journalNotes: currentState.journalNotes,
      completedLessonIds: currentState.completedLessonIds,
      quizAttempts: currentState.quizAttempts,
    },
    prevAchievements
  );

  const { rank, level } = computeExplorerRank(achievements);
  const updatedProfile: UserProfile = {
    ...currentState.profile,
    rank,
    level,
    lastActiveAt: new Date().toISOString(),
  };

  const nextState: VaultStorageState = {
    ...currentState,
    profile: updatedProfile,
  };

  VaultStorageService.saveState(nextState);

  return { state: nextState, achievements };
}

// Initial hydration from local storage
const initialStoredState = VaultStorageService.loadState();
const initialAchievements = computeAchievements({
  events: initialStoredState.explorationEvents,
  favorites: initialStoredState.favorites,
  journalNotes: initialStoredState.journalNotes,
  completedLessonIds: initialStoredState.completedLessonIds,
  quizAttempts: initialStoredState.quizAttempts,
});
const initialRankInfo = computeExplorerRank(initialAchievements);
initialStoredState.profile.rank = initialRankInfo.rank;
initialStoredState.profile.level = initialRankInfo.level;

export const useVaultStore = create<VaultState>((set, get) => ({
  profile: initialStoredState.profile,
  favorites: initialStoredState.favorites,
  collections: initialStoredState.collections,
  journalNotes: initialStoredState.journalNotes,
  completedLessonIds: initialStoredState.completedLessonIds,
  quizAttempts: initialStoredState.quizAttempts,
  explorationEvents: initialStoredState.explorationEvents,
  achievements: initialAchievements,

  // Profile actions
  updateProfile: (updates) => {
    const s = get();
    const updatedProfile: UserProfile = {
      ...s.profile,
      ...updates,
      lastActiveAt: new Date().toISOString(),
    };
    const newState: VaultStorageState = {
      profile: updatedProfile,
      favorites: s.favorites,
      collections: s.collections,
      journalNotes: s.journalNotes,
      completedLessonIds: s.completedLessonIds,
      quizAttempts: s.quizAttempts,
      explorationEvents: s.explorationEvents,
    };
    VaultStorageService.saveState(newState);
    set({ profile: updatedProfile });
  },

  // Favorites actions
  addFavorite: (item, collectionIds = []) => {
    const s = get();
    // Prevent duplicate favorites of the same entity
    const existing = s.favorites.find(
      (f) => f.entityType === item.entityType && f.entityId === item.entityId
    );
    if (existing) {
      if (collectionIds.length > 0) {
        // Merge collections
        const mergedCollections = Array.from(
          new Set([...existing.collectionIds, ...collectionIds])
        );
        const updatedFavorites = s.favorites.map((f) =>
          f.id === existing.id ? { ...f, collectionIds: mergedCollections } : f
        );
        const { state, achievements } = recomputeAndPersist(
          {
            profile: s.profile,
            favorites: updatedFavorites,
            collections: s.collections,
            journalNotes: s.journalNotes,
            completedLessonIds: s.completedLessonIds,
            quizAttempts: s.quizAttempts,
            explorationEvents: s.explorationEvents,
          },
          s.achievements
        );
        set({ ...state, achievements });
      }
      return;
    }

    const newFav: FavoriteItem = {
      ...item,
      id: `fav-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      addedAt: new Date().toISOString(),
      collectionIds,
    };

    const newEvent: ExplorationEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventType: 'favorite_added',
      timestamp: new Date().toISOString(),
      entityId: item.entityId,
      metadata: { entityType: item.entityType, title: item.title },
    };

    const nextFavorites = [newFav, ...s.favorites];
    const nextEvents = [newEvent, ...s.explorationEvents];

    const { state, achievements } = recomputeAndPersist(
      {
        profile: s.profile,
        favorites: nextFavorites,
        collections: s.collections,
        journalNotes: s.journalNotes,
        completedLessonIds: s.completedLessonIds,
        quizAttempts: s.quizAttempts,
        explorationEvents: nextEvents,
      },
      s.achievements
    );

    set({ ...state, achievements });
  },

  removeFavorite: (idOrType, entityId) => {
    const s = get();
    const nextFavorites = s.favorites.filter((f) => {
      if (entityId) {
        return !(f.entityType === idOrType && f.entityId === entityId);
      }
      return f.id !== idOrType;
    });

    const { state, achievements } = recomputeAndPersist(
      {
        profile: s.profile,
        favorites: nextFavorites,
        collections: s.collections,
        journalNotes: s.journalNotes,
        completedLessonIds: s.completedLessonIds,
        quizAttempts: s.quizAttempts,
        explorationEvents: s.explorationEvents,
      },
      s.achievements
    );

    set({ ...state, achievements });
  },

  toggleFavorite: (item) => {
    const s = get();
    const exists = s.favorites.some(
      (f) => f.entityType === item.entityType && f.entityId === item.entityId
    );
    if (exists) {
      get().removeFavorite(item.entityType, item.entityId);
      return false;
    } else {
      get().addFavorite(item);
      return true;
    }
  },

  isFavorite: (entityType, entityId) => {
    return get().favorites.some(
      (f) => f.entityType === entityType && f.entityId === entityId
    );
  },

  // Collections actions
  createCollection: (name, description, colorHex = '#20D9F2', iconName = 'Folder') => {
    const s = get();
    const newCol: CollectionItem = {
      id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      description,
      colorHex,
      iconName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const nextCollections = [...s.collections, newCol];
    const { state, achievements } = recomputeAndPersist(
      {
        profile: s.profile,
        favorites: s.favorites,
        collections: nextCollections,
        journalNotes: s.journalNotes,
        completedLessonIds: s.completedLessonIds,
        quizAttempts: s.quizAttempts,
        explorationEvents: s.explorationEvents,
      },
      s.achievements
    );
    set({ ...state, achievements });
    return newCol.id;
  },

  updateCollection: (id, name, description, colorHex) => {
    const s = get();
    const nextCollections = s.collections.map((col) =>
      col.id === id
        ? {
            ...col,
            name,
            description,
            ...(colorHex ? { colorHex } : {}),
            updatedAt: new Date().toISOString(),
          }
        : col
    );
    const { state, achievements } = recomputeAndPersist(
      {
        profile: s.profile,
        favorites: s.favorites,
        collections: nextCollections,
        journalNotes: s.journalNotes,
        completedLessonIds: s.completedLessonIds,
        quizAttempts: s.quizAttempts,
        explorationEvents: s.explorationEvents,
      },
      s.achievements
    );
    set({ ...state, achievements });
  },

  deleteCollection: (id) => {
    const s = get();
    // Remove collection and un-link it from favorites
    const nextCollections = s.collections.filter((col) => col.id !== id);
    const nextFavorites = s.favorites.map((f) => ({
      ...f,
      collectionIds: f.collectionIds.filter((cid) => cid !== id),
    }));

    const { state, achievements } = recomputeAndPersist(
      {
        profile: s.profile,
        favorites: nextFavorites,
        collections: nextCollections,
        journalNotes: s.journalNotes,
        completedLessonIds: s.completedLessonIds,
        quizAttempts: s.quizAttempts,
        explorationEvents: s.explorationEvents,
      },
      s.achievements
    );
    set({ ...state, achievements });
  },

  addFavoriteToCollection: (favoriteId, collectionId) => {
    const s = get();
    const nextFavorites = s.favorites.map((f) => {
      if (f.id === favoriteId && !f.collectionIds.includes(collectionId)) {
        return { ...f, collectionIds: [...f.collectionIds, collectionId] };
      }
      return f;
    });

    const { state, achievements } = recomputeAndPersist(
      {
        profile: s.profile,
        favorites: nextFavorites,
        collections: s.collections,
        journalNotes: s.journalNotes,
        completedLessonIds: s.completedLessonIds,
        quizAttempts: s.quizAttempts,
        explorationEvents: s.explorationEvents,
      },
      s.achievements
    );
    set({ ...state, achievements });
  },

  removeFavoriteFromCollection: (favoriteId, collectionId) => {
    const s = get();
    const nextFavorites = s.favorites.map((f) => {
      if (f.id === favoriteId) {
        return {
          ...f,
          collectionIds: f.collectionIds.filter((cid) => cid !== collectionId),
        };
      }
      return f;
    });

    const { state, achievements } = recomputeAndPersist(
      {
        profile: s.profile,
        favorites: nextFavorites,
        collections: s.collections,
        journalNotes: s.journalNotes,
        completedLessonIds: s.completedLessonIds,
        quizAttempts: s.quizAttempts,
        explorationEvents: s.explorationEvents,
      },
      s.achievements
    );
    set({ ...state, achievements });
  },

  // Journal notes actions
  createJournalNote: (note) => {
    const s = get();
    const newNote: JournalNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: note.title,
      content: note.content,
      entityType: note.entityType || 'general',
      entityId: note.entityId,
      entityTitle: note.entityTitle,
      tags: note.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newEvent: ExplorationEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventType: 'note_created',
      timestamp: new Date().toISOString(),
      entityId: newNote.id,
      metadata: { title: newNote.title },
    };

    const nextNotes = [newNote, ...s.journalNotes];
    const nextEvents = [newEvent, ...s.explorationEvents];

    const { state, achievements } = recomputeAndPersist(
      {
        profile: s.profile,
        favorites: s.favorites,
        collections: s.collections,
        journalNotes: nextNotes,
        completedLessonIds: s.completedLessonIds,
        quizAttempts: s.quizAttempts,
        explorationEvents: nextEvents,
      },
      s.achievements
    );
    set({ ...state, achievements });
    return newNote.id;
  },

  updateJournalNote: (id, updates) => {
    const s = get();
    const nextNotes = s.journalNotes.map((note) =>
      note.id === id
        ? {
            ...note,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : note
    );

    const { state, achievements } = recomputeAndPersist(
      {
        profile: s.profile,
        favorites: s.favorites,
        collections: s.collections,
        journalNotes: nextNotes,
        completedLessonIds: s.completedLessonIds,
        quizAttempts: s.quizAttempts,
        explorationEvents: s.explorationEvents,
      },
      s.achievements
    );
    set({ ...state, achievements });
  },

  deleteJournalNote: (id) => {
    const s = get();
    const nextNotes = s.journalNotes.filter((note) => note.id !== id);

    const { state, achievements } = recomputeAndPersist(
      {
        profile: s.profile,
        favorites: s.favorites,
        collections: s.collections,
        journalNotes: nextNotes,
        completedLessonIds: s.completedLessonIds,
        quizAttempts: s.quizAttempts,
        explorationEvents: s.explorationEvents,
      },
      s.achievements
    );
    set({ ...state, achievements });
  },

  // Curriculum & Learning actions
  completeLesson: (lessonId) => {
    const s = get();
    if (s.completedLessonIds.includes(lessonId)) return;

    const nextCompleted = [...s.completedLessonIds, lessonId];
    const newEvent: ExplorationEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventType: 'lesson_completed',
      timestamp: new Date().toISOString(),
      entityId: lessonId,
    };
    const nextEvents = [newEvent, ...s.explorationEvents];

    const { state, achievements } = recomputeAndPersist(
      {
        profile: s.profile,
        favorites: s.favorites,
        collections: s.collections,
        journalNotes: s.journalNotes,
        completedLessonIds: nextCompleted,
        quizAttempts: s.quizAttempts,
        explorationEvents: nextEvents,
      },
      s.achievements
    );
    set({ ...state, achievements });
  },

  recordQuizAttempt: (attemptData) => {
    const s = get();
    const attempt: QuizAttempt = {
      ...attemptData,
      id: `quiz-att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    const nextAttempts = [attempt, ...s.quizAttempts];
    const nextEvents = [...s.explorationEvents];

    if (attempt.passed) {
      nextEvents.unshift({
        id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        eventType: 'quiz_passed',
        timestamp: new Date().toISOString(),
        entityId: attempt.trailId,
        metadata: { score: attempt.scorePercent },
      });
    }

    const { state, achievements } = recomputeAndPersist(
      {
        profile: s.profile,
        favorites: s.favorites,
        collections: s.collections,
        journalNotes: s.journalNotes,
        completedLessonIds: s.completedLessonIds,
        quizAttempts: nextAttempts,
        explorationEvents: nextEvents,
      },
      s.achievements
    );
    set({ ...state, achievements });
    return attempt;
  },

  // Exploration Event Logging
  logExplorationEvent: (eventType, entityId, metadata) => {
    const s = get();
    const event: ExplorationEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventType,
      timestamp: new Date().toISOString(),
      entityId,
      metadata,
    };

    const nextEvents = [event, ...s.explorationEvents];
    const { state, achievements } = recomputeAndPersist(
      {
        profile: s.profile,
        favorites: s.favorites,
        collections: s.collections,
        journalNotes: s.journalNotes,
        completedLessonIds: s.completedLessonIds,
        quizAttempts: s.quizAttempts,
        explorationEvents: nextEvents,
      },
      s.achievements
    );
    set({ ...state, achievements });
  },

  // Backup, Recovery & Maintenance
  exportBackup: () => {
    const s = get();
    VaultStorageService.exportJSON({
      profile: s.profile,
      favorites: s.favorites,
      collections: s.collections,
      journalNotes: s.journalNotes,
      completedLessonIds: s.completedLessonIds,
      quizAttempts: s.quizAttempts,
      explorationEvents: s.explorationEvents,
    });
  },

  importBackup: (jsonString, mode) => {
    const res = VaultStorageService.parseAndValidateBackup(jsonString);
    if (!res.isValid || !res.data) {
      return { success: false, message: res.error || 'Invalid backup format.' };
    }

    const s = get();
    let targetState: VaultStorageState;

    if (mode === 'replace') {
      targetState = res.data;
    } else {
      // Merge mode
      // Merge favorites by id/entityId
      const existingFavKeys = new Set(
        s.favorites.map((f) => `${f.entityType}:${f.entityId}`)
      );
      const newFavorites = [
        ...s.favorites,
        ...res.data.favorites.filter(
          (f) => !existingFavKeys.has(`${f.entityType}:${f.entityId}`)
        ),
      ];

      // Merge collections by id
      const existingColIds = new Set(s.collections.map((c) => c.id));
      const newCollections = [
        ...s.collections,
        ...res.data.collections.filter((c) => !existingColIds.has(c.id)),
      ];

      // Merge journal notes by id
      const existingNoteIds = new Set(s.journalNotes.map((n) => n.id));
      const newNotes = [
        ...s.journalNotes,
        ...res.data.journalNotes.filter((n) => !existingNoteIds.has(n.id)),
      ];

      // Merge completed lesson ids
      const mergedLessons = Array.from(
        new Set([...s.completedLessonIds, ...res.data.completedLessonIds])
      );

      // Merge quiz attempts by id
      const existingAttemptIds = new Set(s.quizAttempts.map((q) => q.id));
      const mergedAttempts = [
        ...s.quizAttempts,
        ...res.data.quizAttempts.filter((q) => !existingAttemptIds.has(q.id)),
      ];

      // Merge events
      const existingEventIds = new Set(s.explorationEvents.map((e) => e.id));
      const mergedEvents = [
        ...s.explorationEvents,
        ...res.data.explorationEvents.filter((e) => !existingEventIds.has(e.id)),
      ];

      targetState = {
        profile: {
          ...s.profile,
          ...res.data.profile,
        },
        favorites: newFavorites,
        collections: newCollections,
        journalNotes: newNotes,
        completedLessonIds: mergedLessons,
        quizAttempts: mergedAttempts,
        explorationEvents: mergedEvents,
      };
    }

    const { state, achievements } = recomputeAndPersist(targetState);
    set({ ...state, achievements });

    return {
      success: true,
      message: `Vault backup successfully imported in ${mode} mode.`,
    };
  },

  resetVault: () => {
    VaultStorageService.resetVault();
    const resetState = createInitialVaultState();
    const achievements = computeAchievements({
      events: resetState.explorationEvents,
      favorites: resetState.favorites,
      journalNotes: resetState.journalNotes,
      completedLessonIds: resetState.completedLessonIds,
      quizAttempts: resetState.quizAttempts,
    });
    set({
      ...resetState,
      achievements,
    });
  },
}));
