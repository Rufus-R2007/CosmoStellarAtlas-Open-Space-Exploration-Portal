import React from 'react';
import { Vault } from 'lucide-react';
import { ModulePlaceholderPage } from '../../components/common/ModulePlaceholderPage';

export const VaultPage: React.FC = () => {
  return (
    <ModulePlaceholderPage
      moduleName="Personal Space Vault"
      tagline="Explorer Passport, Bookmarks & Mission Logs"
      description="The Personal Space Vault will allow explorers to bookmark favorite planets, save mission dossiers, record personal observational notes, and track learning progress using browser-local storage."
      phaseNumber={8}
      phaseTitle="Phase 8: Personal Space Vault & Offline Persistence"
      icon={<Vault className="w-8 h-8 text-[#8565FA]" />}
      plannedFeatures={[
        'Personal Explorer Passport with custom avatar and exploration rank',
        'Bookmarked celestial objects, historical missions, and raw rover images',
        'Custom research notes editor with markdown support and local persistence',
        'Offline data export and import (JSON backup of user vault)',
        'Progress tracking for curriculum modules and exploration achievements',
        'Zero cloud-account requirement: complete data sovereignty on client device',
      ]}
    />
  );
};
