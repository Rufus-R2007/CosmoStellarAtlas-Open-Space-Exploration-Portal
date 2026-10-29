import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { VaultStorageService } from '../services/vaultStorageService';
import { useVaultStore } from '../store/useVaultStore';
import { learningTrails } from '../data/learningTrails';
import { computeAchievements, computeExplorerRank } from '../services/achievementDefinitions';
import { LearningPage } from '../features/learning/LearningPage';
import { VaultPage } from '../features/vault/VaultPage';

describe('Phase 7 — Personal Space Vault, Learning Hub & Explorer Passport Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    useVaultStore.getState().resetVault();
  });

  // ==========================================
  // 1. VaultStorageService & Offline Resilience
  // ==========================================
  describe('VaultStorageService & Offline Resilience', () => {
    it('Requirement 1: loads initial default state when localStorage is empty', () => {
      const state = VaultStorageService.loadState();
      expect(state).toBeDefined();
      expect(state.profile.displayName).toBe('Cosmo Explorer');
      expect(state.profile.callsign).toBe('ATLAS-01');
      expect(state.favorites).toEqual([]);
      expect(state.collections.length).toBeGreaterThanOrEqual(2);
      expect(state.journalNotes).toEqual([]);
      expect(state.completedLessonIds).toEqual([]);
    });

    it('Requirement 2: persists and retrieves valid vault state', () => {
      const state = VaultStorageService.loadState();
      state.profile.displayName = 'Commander Shepard';
      state.profile.callsign = 'NORMANDY';
      state.favorites.push({
        id: 'fav-test-mars',
        entityType: 'planet',
        entityId: 'mars',
        title: 'Mars',
        subtitle: 'The Red Planet',
        route: '/planets?selected=mars',
        categoryBadge: 'Planet',
        addedAt: new Date().toISOString(),
        collectionIds: [],
      });

      const saved = VaultStorageService.saveState(state);
      expect(saved).toBe(true);

      const reloaded = VaultStorageService.loadState();
      expect(reloaded.profile.displayName).toBe('Commander Shepard');
      expect(reloaded.profile.callsign).toBe('NORMANDY');
      expect(reloaded.favorites.length).toBe(1);
      expect(reloaded.favorites[0].entityId).toBe('mars');
    });

    it('Requirement 3: validates schema and rejects invalid or corrupted backup JSON', () => {
      const invalidJson = '{"corrupted": true}';
      const result = VaultStorageService.parseAndValidateBackup(invalidJson);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('incompatible backup format');

      const nonJson = 'not even json';
      const nonJsonResult = VaultStorageService.parseAndValidateBackup(nonJson);
      expect(nonJsonResult.isValid).toBe(false);
      expect(nonJsonResult.error).toContain('JSON Parse error');
    });

    it('Requirement 4: calculates storage footprint in bytes and human-readable units', () => {
      const footprint = VaultStorageService.getStorageFootprint();
      expect(footprint).toBeDefined();
      expect(typeof footprint.bytes).toBe('number');
      expect(typeof footprint.formatted).toBe('string');
    });
  });

  // ==========================================
  // 2. Zustand useVaultStore State Management
  // ==========================================
  describe('Zustand useVaultStore Operations', () => {
    it('Requirement 5: updates user profile credentials', () => {
      const store = useVaultStore.getState();
      store.updateProfile({
        displayName: 'Rufus Samuel R',
        callsign: 'COSMO-01',
        bio: 'Astrophysics Student & Lead Developer',
      });

      const updated = useVaultStore.getState().profile;
      expect(updated.displayName).toBe('Rufus Samuel R');
      expect(updated.callsign).toBe('COSMO-01');
      expect(updated.bio).toBe('Astrophysics Student & Lead Developer');
    });

    it('Requirement 6: adds and removes universal bookmarks without duplicates', () => {
      const store = useVaultStore.getState();
      expect(store.isFavorite('planet', 'jupiter')).toBe(false);

      store.addFavorite({
        entityType: 'planet',
        entityId: 'jupiter',
        title: 'Jupiter',
        subtitle: 'King of Planets',
        route: '/planets?selected=jupiter',
        categoryBadge: 'Planet',
      });

      expect(useVaultStore.getState().isFavorite('planet', 'jupiter')).toBe(true);
      expect(useVaultStore.getState().favorites.length).toBe(1);

      // Attempt duplicate addition
      store.addFavorite({
        entityType: 'planet',
        entityId: 'jupiter',
        title: 'Jupiter Duplicate',
        subtitle: 'King of Planets',
        route: '/planets?selected=jupiter',
        categoryBadge: 'Planet',
      });
      expect(useVaultStore.getState().favorites.length).toBe(1);

      // Remove favorite
      store.removeFavorite('planet', 'jupiter');
      expect(useVaultStore.getState().isFavorite('planet', 'jupiter')).toBe(false);
      expect(useVaultStore.getState().favorites.length).toBe(0);
    });

    it('Requirement 7: toggles favorite status cleanly', () => {
      const store = useVaultStore.getState();
      const item = {
        entityType: 'mission' as const,
        entityId: 'apollo-11',
        title: 'Apollo 11',
        subtitle: 'First Crewed Lunar Landing',
        route: '/missions/apollo-11',
        categoryBadge: 'Mission',
      };

      const added = store.toggleFavorite(item);
      expect(added).toBe(true);
      expect(useVaultStore.getState().isFavorite('mission', 'apollo-11')).toBe(true);

      const removed = store.toggleFavorite(item);
      expect(removed).toBe(false);
      expect(useVaultStore.getState().isFavorite('mission', 'apollo-11')).toBe(false);
    });

    it('Requirement 8: manages custom collections and preserves favorites upon deletion', () => {
      const store = useVaultStore.getState();
      const colId = store.createCollection(
        'Gas Giants Survey',
        'In-depth study of Jovian worlds',
        '#20D9F2'
      );
      expect(colId).toBeDefined();

      store.addFavorite({
        entityType: 'planet',
        entityId: 'saturn',
        title: 'Saturn',
        subtitle: 'Ringed Wonder',
        route: '/planets?selected=saturn',
        categoryBadge: 'Planet',
      });

      const favId = useVaultStore.getState().favorites[0].id;
      store.addFavoriteToCollection(favId, colId);

      const favWithCol = useVaultStore.getState().favorites[0];
      expect(favWithCol.collectionIds).toContain(colId);

      // Deleting the collection removes the shelf but preserves the favorite item
      store.deleteCollection(colId);
      expect(useVaultStore.getState().collections.some((c) => c.id === colId)).toBe(false);
      expect(useVaultStore.getState().favorites.length).toBe(1);
      expect(useVaultStore.getState().favorites[0].collectionIds).not.toContain(colId);
    });

    it('Requirement 9: manages exploration journal entries with tags and metadata', () => {
      const store = useVaultStore.getState();
      const noteId = store.createJournalNote({
        title: 'Atmospheric Spectrometry of Venus',
        content: 'Sulfuric acid cloud layers observed with strong ultraviolet absorption bands.',
        entityType: 'planet',
        entityId: 'venus',
        entityTitle: 'Venus',
        tags: ['atmosphere', 'spectrometry', 'venus'],
      });

      expect(noteId).toBeDefined();
      const notes = useVaultStore.getState().journalNotes;
      expect(notes.length).toBe(1);
      expect(notes[0].title).toBe('Atmospheric Spectrometry of Venus');
      expect(notes[0].tags).toEqual(['atmosphere', 'spectrometry', 'venus']);

      // Update note
      store.updateJournalNote(noteId, {
        title: 'Atmospheric Spectrometry of Venus (Revised)',
      });
      expect(useVaultStore.getState().journalNotes[0].title).toBe(
        'Atmospheric Spectrometry of Venus (Revised)'
      );

      // Delete note
      store.deleteJournalNote(noteId);
      expect(useVaultStore.getState().journalNotes.length).toBe(0);
    });
  });

  // ==========================================
  // 3. Learning Hub Curriculum & Quiz Engine
  // ==========================================
  describe('Learning Hub Curriculum & Quiz Engine', () => {
    it('Requirement 10: provides 4 complete learning trails with 12 lessons and 24 quiz questions', () => {
      expect(learningTrails.length).toBe(4);
      const totalLessons = learningTrails.reduce((acc, t) => acc + t.lessons.length, 0);
      const totalQuestions = learningTrails.reduce((acc, t) => acc + t.quiz.length, 0);

      expect(totalLessons).toBeGreaterThanOrEqual(12);
      expect(totalQuestions).toBeGreaterThanOrEqual(24);

      learningTrails.forEach((trail) => {
        expect(trail.lessons.length).toBeGreaterThanOrEqual(3);
        expect(trail.quiz.length).toBeGreaterThanOrEqual(6);
        expect(trail.passingScorePercent).toBe(70);

        trail.lessons.forEach((lesson) => {
          expect(lesson.title).toBeDefined();
          expect(lesson.learningObjectives.length).toBeGreaterThanOrEqual(1);
          expect(lesson.contentSections.length).toBeGreaterThanOrEqual(1);
          expect(lesson.keyTakeaways.length).toBeGreaterThanOrEqual(1);
          expect(lesson.moduleRoute).toBeDefined();
        });

        trail.quiz.forEach((q) => {
          expect(q.question).toBeDefined();
          expect(q.options.length).toBeGreaterThanOrEqual(2);
          expect(q.correctAnswerIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctAnswerIndex).toBeLessThan(q.options.length);
          expect(q.explanation).toBeDefined();
        });
      });
    });

    it('Requirement 11: tracks lesson completion explicitly', () => {
      const store = useVaultStore.getState();
      expect(store.completedLessonIds.length).toBe(0);

      store.completeLesson('lesson-sol-01');
      expect(useVaultStore.getState().completedLessonIds).toContain('lesson-sol-01');

      // Duplicate completion does not duplicate ID
      store.completeLesson('lesson-sol-01');
      expect(useVaultStore.getState().completedLessonIds.length).toBe(1);
    });

    it('Requirement 12: records quiz attempts, evaluates pass/fail status, and logs quiz_passed event', () => {
      const store = useVaultStore.getState();

      const attempt = store.recordQuizAttempt({
        trailId: 'trail-solar-system',
        scorePercent: 83,
        passed: true,
        totalQuestions: 6,
        correctAnswers: 5,
        userAnswers: [
          { questionId: 'quiz-sol-01', selectedIndex: 2, isCorrect: true },
          { questionId: 'quiz-sol-02', selectedIndex: 1, isCorrect: true },
          { questionId: 'quiz-sol-03', selectedIndex: 1, isCorrect: true },
          { questionId: 'quiz-sol-04', selectedIndex: 1, isCorrect: true },
          { questionId: 'quiz-sol-05', selectedIndex: 3, isCorrect: true },
          { questionId: 'quiz-sol-06', selectedIndex: 1, isCorrect: false },
        ],
      });

      expect(attempt.passed).toBe(true);
      expect(useVaultStore.getState().quizAttempts.length).toBe(1);
      expect(
        useVaultStore
          .getState()
          .explorationEvents.some((e) => e.eventType === 'quiz_passed')
      ).toBe(true);
    });
  });

  // ==========================================
  // 4. Explorer Constellation & Achievements
  // ==========================================
  describe('Explorer Constellation & Achievements', () => {
    it('Requirement 13: computes 12 genuine achievements deterministically', () => {
      const achievements = computeAchievements({
        events: [],
        favorites: [],
        journalNotes: [],
        completedLessonIds: [],
        quizAttempts: [],
      });

      expect(achievements.length).toBe(12);
      expect(achievements.every((a) => !a.unlockedAt)).toBe(true);
      expect(achievements.every((a) => a.constellationCoord.x > 0)).toBe(true);
      expect(achievements.every((a) => a.constellationCoord.y > 0)).toBe(true);
    });

    it('Requirement 14: unlocks achievements and advances explorer rank dynamically', () => {
      const store = useVaultStore.getState();

      // Trigger 3 planet views
      store.logExplorationEvent('planet_viewed', 'mercury');
      store.logExplorationEvent('planet_viewed', 'venus');
      store.logExplorationEvent('planet_viewed', 'earth');

      const achievements = useVaultStore.getState().achievements;
      const planetAch = achievements.find((a) => a.id === 'ach-planet-pioneer');
      expect(planetAch?.unlockedAt).toBeDefined();

      // Save 3 favorites
      store.addFavorite({
        entityType: 'planet',
        entityId: 'mars',
        title: 'Mars',
        subtitle: 'Red Planet',
        route: '/planets?selected=mars',
        categoryBadge: 'Planet',
      });
      store.addFavorite({
        entityType: 'planet',
        entityId: 'jupiter',
        title: 'Jupiter',
        subtitle: 'Gas Giant',
        route: '/planets?selected=jupiter',
        categoryBadge: 'Planet',
      });
      store.addFavorite({
        entityType: 'planet',
        entityId: 'saturn',
        title: 'Saturn',
        subtitle: 'Rings',
        route: '/planets?selected=saturn',
        categoryBadge: 'Planet',
      });

      const vaultAch = useVaultStore
        .getState()
        .achievements.find((a) => a.id === 'ach-vault-archivist');
      expect(vaultAch?.unlockedAt).toBeDefined();

      // Rank should have advanced to Cadet Explorer (Level 2)
      const rankInfo = computeExplorerRank(useVaultStore.getState().achievements);
      expect(rankInfo.level).toBeGreaterThanOrEqual(2);
      expect(useVaultStore.getState().profile.level).toBeGreaterThanOrEqual(2);
    });
  });

  // ==========================================
  // 5. Versioned JSON Backup, Recovery & Reset
  // ==========================================
  describe('Versioned Backup & Recovery', () => {
    it('Requirement 15: imports backup in merge mode without duplicate favorites', () => {
      const store = useVaultStore.getState();
      store.addFavorite({
        entityType: 'planet',
        entityId: 'earth',
        title: 'Earth',
        subtitle: 'Home',
        route: '/planets?selected=earth',
        categoryBadge: 'Planet',
      });

      const backupString = JSON.stringify({
        version: 'cosmostellaratlas:user:v1',
        exportedAt: new Date().toISOString(),
        profile: {
          id: 'usr-imported',
          displayName: 'Space Traveler',
          callsign: 'VOYAGER',
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
          rank: 'Cadet Explorer',
          level: 2,
        },
        favorites: [
          {
            id: 'fav-earth',
            entityType: 'planet',
            entityId: 'earth',
            title: 'Earth',
            subtitle: 'Home',
            route: '/planets?selected=earth',
            categoryBadge: 'Planet',
            addedAt: new Date().toISOString(),
            collectionIds: [],
          },
          {
            id: 'fav-neptune',
            entityType: 'planet',
            entityId: 'neptune',
            title: 'Neptune',
            subtitle: 'Ice Giant',
            route: '/planets?selected=neptune',
            categoryBadge: 'Planet',
            addedAt: new Date().toISOString(),
            collectionIds: [],
          },
        ],
        collections: [],
        journalNotes: [],
        completedLessonIds: ['lesson-sol-01'],
        quizAttempts: [],
        explorationEvents: [],
      });

      const res = store.importBackup(backupString, 'merge');
      expect(res.success).toBe(true);

      const state = useVaultStore.getState();
      expect(state.favorites.length).toBe(2); // Earth was merged, Neptune added
      expect(state.completedLessonIds).toContain('lesson-sol-01');
    });

    it('Requirement 16: imports backup in replace mode and overwrites state', () => {
      const store = useVaultStore.getState();
      store.addFavorite({
        entityType: 'planet',
        entityId: 'earth',
        title: 'Earth',
        subtitle: 'Home',
        route: '/planets?selected=earth',
        categoryBadge: 'Planet',
      });

      const backupString = JSON.stringify({
        version: 'cosmostellaratlas:user:v1',
        exportedAt: new Date().toISOString(),
        profile: {
          id: 'usr-imported-replace',
          displayName: 'Apollo Commander',
          callsign: 'EAGLE-01',
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
          rank: 'Orbital Cartographer',
          level: 3,
        },
        favorites: [],
        collections: [],
        journalNotes: [],
        completedLessonIds: [],
        quizAttempts: [],
        explorationEvents: [],
      });

      const res = store.importBackup(backupString, 'replace');
      expect(res.success).toBe(true);

      const state = useVaultStore.getState();
      expect(state.profile.displayName).toBe('Apollo Commander');
      expect(state.favorites.length).toBe(0);
    });

    it('Requirement 17: resets vault to clean defaults', () => {
      const store = useVaultStore.getState();
      store.updateProfile({ displayName: 'To Be Erased' });
      store.addFavorite({
        entityType: 'planet',
        entityId: 'uranus',
        title: 'Uranus',
        subtitle: 'Tilted World',
        route: '/planets?selected=uranus',
        categoryBadge: 'Planet',
      });

      store.resetVault();

      const state = useVaultStore.getState();
      expect(state.profile.displayName).toBe('Cosmo Explorer');
      expect(state.favorites.length).toBe(0);
      expect(state.completedLessonIds.length).toBe(0);
    });
  });

  // ==========================================
  // 6. UI Rendering & Interactive Integration
  // ==========================================
  describe('UI Component Integration', () => {
    it('Requirement 18: LearningPage renders hero metrics, trail cards, and curriculum objectives', () => {
      render(
        <BrowserRouter>
          <LearningPage />
        </BrowserRouter>
      );

      expect(screen.getByText(/Cosmic Learning Hub/i)).toBeInTheDocument();
      expect(screen.getByText(/Structured Learning Trails/i)).toBeInTheDocument();
      expect(screen.getByText(/Journey Through the Solar System/i)).toBeInTheDocument();
      expect(screen.getByText(/Mission to Mars/i)).toBeInTheDocument();
      expect(screen.getByText(/Guardians of Earth/i)).toBeInTheDocument();
      expect(screen.getByText(/Chronicles of Space Exploration/i)).toBeInTheDocument();
    });

    it('Requirement 19: VaultPage renders explorer HUD, tabs, bookmarks, journal, and passport', () => {
      render(
        <BrowserRouter>
          <VaultPage />
        </BrowserRouter>
      );

      expect(screen.getAllByText(/Cosmo Explorer/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/ATLAS-01/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/CLIENT-SIDE DATA SOVEREIGNTY/i)).toBeInTheDocument();
      expect(screen.getByText(/Explorer Passport & Constellation/i)).toBeInTheDocument();
      expect(screen.getByText(/Universal Bookmarks/i)).toBeInTheDocument();
      expect(screen.getByText(/Research Journal/i)).toBeInTheDocument();
      expect(screen.getByText(/Backup & Recovery/i)).toBeInTheDocument();
    });

    it('Requirement 20: VaultPage switches between Constellation Starfield and Accessible List view', async () => {
      render(
        <BrowserRouter>
          <VaultPage />
        </BrowserRouter>
      );

      // Default is constellation view
      expect(screen.getByText(/Starfield Map/i)).toBeInTheDocument();
      expect(screen.getByText(/Accessible List/i)).toBeInTheDocument();

      // Click Accessible List
      fireEvent.click(screen.getByText(/Accessible List/i));
      await waitFor(() => {
        expect(screen.getByText(/Planet Pioneer/i)).toBeInTheDocument();
        expect(screen.getByText(/Cosmic Comparer/i)).toBeInTheDocument();
        expect(screen.getByText(/Mission Historian/i)).toBeInTheDocument();
      });
    });

    it('Requirement 21: LearningPage opens interactive lesson modal and marks lesson complete', async () => {
      render(
        <BrowserRouter>
          <LearningPage />
        </BrowserRouter>
      );

      // Find and click "Read Lessons"
      const readButtons = screen.getAllByText(/Read Lessons/i);
      expect(readButtons.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(readButtons[0]);

      // Lesson modal appears
      await waitFor(() => {
        expect(screen.getByText(/Lesson Overview/i)).toBeInTheDocument();
        expect(screen.getByText(/Learning Objectives/i)).toBeInTheDocument();
        expect(screen.getByText(/Mark Lesson Complete/i)).toBeInTheDocument();
      });

      // Click complete
      fireEvent.click(screen.getByText(/Mark Lesson Complete/i));

      await waitFor(() => {
        expect(useVaultStore.getState().completedLessonIds.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('Requirement 22: LearningPage opens interactive quiz modal and handles submission', async () => {
      render(
        <BrowserRouter>
          <LearningPage />
        </BrowserRouter>
      );

      // Find and click "Start Quiz"
      const startQuizButtons = screen.getAllByText(/Start Quiz/i);
      expect(startQuizButtons.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(startQuizButtons[0]);

      // Quiz modal appears
      await waitFor(() => {
        expect(screen.getByText(/Knowledge Evaluation/i)).toBeInTheDocument();
        expect(screen.getByText(/Pass Threshold: 70%/i)).toBeInTheDocument();
      });
    });

    it('Requirement 23: VaultPage allows creating new research journal note', async () => {
      render(
        <BrowserRouter>
          <VaultPage />
        </BrowserRouter>
      );

      // Switch to journal tab
      fireEvent.click(screen.getByText(/Research Journal/i));

      await waitFor(() => {
        expect(screen.getByText(/Exploration Journal/i)).toBeInTheDocument();
        expect(screen.getByText(/New Log Entry/i)).toBeInTheDocument();
      });

      // Open new log modal
      fireEvent.click(screen.getByText(/New Log Entry/i));

      await waitFor(() => {
        expect(screen.getByText(/New Exploration Journal Log/i)).toBeInTheDocument();
      });
    });

    it('Requirement 24: VaultPage displays client-side privacy notice prominently', () => {
      render(
        <BrowserRouter>
          <VaultPage />
        </BrowserRouter>
      );

      expect(
        screen.getByText(/Your Space Vault is stored locally in this browser/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/No cloud databases, external user tracking, or telemetry servers/i)
      ).toBeInTheDocument();
    });

    it('Requirement 25: VaultPage displays storage footprint and backup management options', async () => {
      render(
        <BrowserRouter>
          <VaultPage />
        </BrowserRouter>
      );

      // Switch to backup tab
      fireEvent.click(screen.getByText(/Backup & Recovery/i));

      await waitFor(() => {
        expect(screen.getByText(/Local Vault Backup & Recovery/i)).toBeInTheDocument();
        expect(screen.getByText(/Download JSON Backup/i)).toBeInTheDocument();
        expect(screen.getByText(/Select Backup JSON File/i)).toBeInTheDocument();
        expect(screen.getByText(/Danger Zone: Reset Space Vault/i)).toBeInTheDocument();
      });
    });
  });
});
