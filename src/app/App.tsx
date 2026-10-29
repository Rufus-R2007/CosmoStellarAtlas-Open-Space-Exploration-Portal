import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ObservatoryPage } from '../features/observatory/ObservatoryPage';
import { PlanetsPage } from '../features/planets/PlanetsPage';
import { MissionsPage } from '../features/missions/MissionsPage';
import { TimelinePage } from '../features/timeline/TimelinePage';
import { RoversPage } from '../features/rovers/RoversPage';
import { AsteroidsPage } from '../features/asteroids/AsteroidsPage';
import { IntelligencePage } from '../features/intelligence/IntelligencePage';
import { LearningPage } from '../features/learning/LearningPage';
import { VaultPage } from '../features/vault/VaultPage';
import { NotFoundPage } from '../features/notfound/NotFoundPage';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<ObservatoryPage />} />
          <Route path="planets" element={<PlanetsPage />} />
          <Route path="missions" element={<MissionsPage />} />
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
  );
};

export default App;
