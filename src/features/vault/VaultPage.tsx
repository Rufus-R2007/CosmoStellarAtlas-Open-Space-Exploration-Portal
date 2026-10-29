import React, { useState } from 'react';
import {
  Star,
  Folder,
  PenTool,
  Award,
  Activity,
  HardDrive,
} from 'lucide-react';
import { VaultHeroSection } from './components/VaultHeroSection';
import { UniversalFavoritesSection } from './components/UniversalFavoritesSection';
import { CollectionsSection } from './components/CollectionsSection';
import { ExplorationJournalSection } from './components/ExplorationJournalSection';
import { ExplorerPassportSection } from './components/ExplorerPassportSection';
import { ConstellationProgressSection } from './components/ConstellationProgressSection';
import { PersonalAnalyticsSection } from './components/PersonalAnalyticsSection';
import { VaultBackupSection } from './components/VaultBackupSection';
import { useVaultStore } from '../../store/useVaultStore';

type VaultTab =
  | 'passport'
  | 'bookmarks'
  | 'collections'
  | 'journal'
  | 'analytics'
  | 'backup';

export const VaultPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VaultTab>('passport');

  const favorites = useVaultStore((s) => s.favorites);
  const collections = useVaultStore((s) => s.collections);
  const journalNotes = useVaultStore((s) => s.journalNotes);
  const achievements = useVaultStore((s) => s.achievements);

  const unlockedCount = achievements.filter((a) => !!a.unlockedAt).length;

  const tabs: { id: VaultTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'passport',
      label: 'Explorer Passport & Constellation',
      icon: <Award className="w-4 h-4 text-[#20D9F2]" />,
      badge: `${unlockedCount}/${achievements.length}`,
    },
    {
      id: 'bookmarks',
      label: 'Universal Bookmarks',
      icon: <Star className="w-4 h-4 text-[#FFB45B]" />,
      badge: favorites.length,
    },
    {
      id: 'collections',
      label: 'Collections',
      icon: <Folder className="w-4 h-4 text-[#8565FA]" />,
      badge: collections.length,
    },
    {
      id: 'journal',
      label: 'Research Journal',
      icon: <PenTool className="w-4 h-4 text-[#FFB45B]" />,
      badge: journalNotes.length,
    },
    {
      id: 'analytics',
      label: 'Personal Analytics',
      icon: <Activity className="w-4 h-4 text-[#20D9F2]" />,
    },
    {
      id: 'backup',
      label: 'Backup & Recovery',
      icon: <HardDrive className="w-4 h-4 text-gray-400" />,
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Vault Hero & Profile Section */}
      <VaultHeroSection />

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-white/15 to-white/10 text-white border border-white/20 shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#20D9F2] text-black font-bold' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="space-y-8">
        {activeTab === 'passport' && (
          <div className="space-y-8">
            <ExplorerPassportSection />
            <ConstellationProgressSection />
          </div>
        )}

        {activeTab === 'bookmarks' && <UniversalFavoritesSection />}

        {activeTab === 'collections' && <CollectionsSection />}

        {activeTab === 'journal' && <ExplorationJournalSection />}

        {activeTab === 'analytics' && <PersonalAnalyticsSection />}

        {activeTab === 'backup' && <VaultBackupSection />}
      </div>
    </div>
  );
};
