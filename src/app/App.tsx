import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ObservatoryPage } from '../features/observatory/ObservatoryPage';
import { PlanetsPage } from '../features/planets/PlanetsPage';
import { MissionsPage } from '../features/missions/MissionsPage';
import { MissionDetailPage } from '../features/missions/MissionDetailPage';
import { TimelinePage } from '../features/timeline/TimelinePage';
import { RoversPage } from '../features/rovers/RoversPage';
import { AsteroidsPage } from '../features/asteroids/AsteroidsPage';
import { IntelligencePage } from '../features/intelligence/IntelligencePage';
import { LearningPage } from '../features/learning/LearningPage';
import { VaultPage } from '../features/vault/VaultPage';
import { NotFoundPage } from '../features/notfound/NotFoundPage';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ErrorBoundary fallbackTitle="Portal Shell Uplink Anomaly">
      <HashRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<ObservatoryPage />} />
            <Route path="planets" element={<PlanetsPage />} />
            <Route path="missions" element={<MissionsPage />} />
            <Route path="missions/:missionId" element={<MissionDetailPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="rovers" element={<RoversPage />} />
            <Route path="asteroids" element={<AsteroidsPage />} />
            <Route path="intelligence" element={<IntelligencePage />} />
            <Route path="learn" element={<LearningPage />} />
            <Route path="vault" element={<VaultPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;

