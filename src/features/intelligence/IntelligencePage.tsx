import React, { useState } from 'react';
import {
  CosmoIntelligenceHero,
  CosmicBriefingSection,
  AskTheAtlasSection,
  UniversalSearchSection,
  CosmicDiscoveryGraphSection,
  ExplainableRecommendationsSection,
  InsightEvidencePanel,
} from './components';
import { GeneratedBriefing, QueryResponse } from '../../types';

export const IntelligencePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('briefings');
  const [inspectedItem, setInspectedItem] = useState<GeneratedBriefing | QueryResponse | null>(null);

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInspectEvidence = (item: GeneratedBriefing | QueryResponse) => {
    setInspectedItem(item);
    setActiveSection('evidence');
    const evidenceElem = document.getElementById('evidence');
    if (evidenceElem) {
      evidenceElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#060B19] text-white p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero & Subsystem Anchor Navigation */}
      <CosmoIntelligenceHero
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* 1. Cosmic Briefing Engine */}
      <CosmicBriefingSection onInspectEvidence={handleInspectEvidence} />

      {/* 2. Ask the Atlas Assistant */}
      <AskTheAtlasSection onInspectEvidence={handleInspectEvidence} />

      {/* 3. Universal Smart Search */}
      <UniversalSearchSection />

      {/* 4. Cosmic Discovery Graph */}
      <CosmicDiscoveryGraphSection />

      {/* 5. Explainable Contextual Recommendations */}
      <ExplainableRecommendationsSection />

      {/* 6. Insight Evidence Audit Panel */}
      <InsightEvidencePanel
        inspectedItem={inspectedItem}
        onClearInspection={() => setInspectedItem(null)}
      />
    </div>
  );
};
