import React, { useEffect, useState, useCallback } from 'react';
import { spaceService } from '../../services';
import { Planet, Mission, Briefing, ObservatoryStats } from '../../types';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { FeaturedPlanetSection } from './components/FeaturedPlanetSection';
import { MissionSpotlightSection } from './components/MissionSpotlightSection';
import { TimelinePreviewSection } from './components/TimelinePreviewSection';
import { MissionActivityChartSection } from './components/MissionActivityChartSection';
import { DiscoveryModulesSection } from './components/DiscoveryModulesSection';
import { AtlasBriefingsSection } from './components/AtlasBriefingsSection';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';

export const ObservatoryPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<ObservatoryStats | null>(null);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [briefings, setBriefings] = useState<Briefing[]>([]);

  const loadObservatoryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, planetsRes, missionsRes, briefingsRes] = await Promise.all([
        spaceService.getObservatoryStats(),
        spaceService.getPlanets(),
        spaceService.getMissions(),
        spaceService.getBriefings(),
      ]);

      setStats(statsRes);
      setPlanets(planetsRes);
      setMissions(missionsRes);
      setBriefings(briefingsRes);
    } catch (err: any) {
      setError(err?.message || 'Failed to load observatory telemetry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadObservatoryData();
  }, [loadObservatoryData]);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingState message="Initialising CosmoStellarAtlas Telemetry Arrays..." />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="py-24">
        <ErrorState
          title="Observatory Telemetry Interrupted"
          message={error || 'Telemetry feed unavailable.'}
          onRetry={loadObservatoryData}
        />
      </div>
    );
  }

  // Find Apollo 11 as featured mission spotlight
  const featuredMission =
    missions.find((m) => m.id === 'apollo-11') || missions[0] || null;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Section A: Cinematic Hero */}
      <HeroSection />

      {/* Section B: Observatory Statistics */}
      <StatsSection stats={stats} />

      {/* Section C: Featured Planetary World */}
      <FeaturedPlanetSection planets={planets} />

      {/* Section D: Mission Spotlight */}
      <MissionSpotlightSection mission={featuredMission} />

      {/* Section E: Cosmic Timeline Preview */}
      <TimelinePreviewSection missions={missions} />

      {/* Section F: Mission Activity Overview */}
      <MissionActivityChartSection missions={missions} />

      {/* Section G: Discovery Navigation Array */}
      <DiscoveryModulesSection />

      {/* Section H: Atlas Briefings Feed */}
      <AtlasBriefingsSection briefings={briefings} />
    </div>
  );
};

