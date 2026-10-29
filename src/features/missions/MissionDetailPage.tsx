import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Compass,
  Play,
  ArrowLeft,
  Globe,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  Sparkles,
  Star,
} from 'lucide-react';
import { Mission } from '../../types';
import { spaceService } from '../../services';
import { useVaultStore } from '../../store/useVaultStore';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { MissionStoryteller } from './components/storytelling/MissionStoryteller';
import { MissionReplayEngine } from './components/replay/MissionReplayEngine';

export const MissionDetailPage: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isReplayOpen, setIsReplayOpen] = useState<boolean>(false);
  const [selectedMilestoneReplayIndex, setSelectedMilestoneReplayIndex] = useState<number>(0);

  const isFav = useVaultStore((s) => mission ? s.isFavorite('mission', mission.id) : false);
  const toggleFavorite = useVaultStore((s) => s.toggleFavorite);
  const logExplorationEvent = useVaultStore((s) => s.logExplorationEvent);

  useEffect(() => {
    const fetchMission = async () => {
      if (!missionId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await spaceService.getMissionById(missionId);
        if (data) {
          setMission(data);
          logExplorationEvent('mission_viewed', data.id, { name: data.name });
        } else {
          setError(`Mission record '${missionId}' not found in the curated archive.`);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to retrieve mission dossier telemetry.');
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [missionId, logExplorationEvent]);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingState message="Decrypting Mission Flight Archive & Telemetry Dossier..." />
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="py-24">
        <ErrorState
          title="Mission Record Unavailable"
          message={error || `The mission ID '${missionId}' could not be resolved.`}
          onRetry={() => navigate('/missions')}
        />
      </div>
    );
  }

  const getPlanetLink = () => {
    if (mission.destinationPlanetId && mission.destinationPlanetId !== 'earth') {
      return `/planets?id=${mission.destinationPlanetId}`;
    }
    const dLower = mission.destinationName.toLowerCase();
    if (dLower.includes('mars')) return '/planets?id=mars';
    if (dLower.includes('saturn')) return '/planets?id=saturn';
    if (dLower.includes('jupiter')) return '/planets?id=jupiter';
    if (dLower.includes('neptune')) return '/planets?id=neptune';
    if (dLower.includes('uranus')) return '/planets?id=uranus';
    if (dLower.includes('venus')) return '/planets?id=venus';
    if (dLower.includes('mercury')) return '/planets?id=mercury';
    return null;
  };

  const planetLink = getPlanetLink();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Return Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#141D30] pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#98A7BF]">
          <Link to="/missions" className="hover:text-[#20D9F2] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Mission Control Archive
          </Link>
          <span>/</span>
          <span className="text-[#20D9F2] uppercase font-bold">{mission.name}</span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#20D9F2]/10 border border-[#20D9F2]/30 text-[#20D9F2] font-semibold uppercase">
            Curated Flight Dossier
          </span>
        </div>
      </div>

      {/* Main Dossier Hero Banner */}
      <div className="bg-[#0A1021] border border-[#141D30] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#10182B] text-[#8565FA] border border-[#8565FA]/30 font-semibold uppercase">
                {mission.agency}
              </span>
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#10182B] text-[#98A7BF] border border-[#141D30]">
                {mission.missionType}
              </span>
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {mission.status}
              </span>
            </div>

            <h1 className="font-headline text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#F5F7FF]">
              {mission.name}
            </h1>

            <div className="flex items-center gap-5 text-xs sm:text-sm font-mono text-[#98A7BF] flex-wrap">
              <div className="flex items-center gap-1.5 text-[#20D9F2]">
                <Compass className="w-4 h-4" />
                <span>Target: <strong>{mission.destinationName}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-[#FFB45B]">
                <Calendar className="w-4 h-4" />
                <span>Launch Date: <strong>{mission.launchDate}</strong></span>
              </div>
            </div>

            <p className="font-body text-sm sm:text-base text-[#98A7BF] leading-relaxed pt-1">
              {mission.description}
            </p>
          </div>

          {/* Quick Launch Mission Replay Hero Action */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 shrink-0">
            <button
              onClick={() => {
                toggleFavorite({
                  entityType: 'mission',
                  entityId: mission.id,
                  title: mission.name,
                  subtitle: `${mission.agency} • ${mission.destinationName} (${mission.launchYear})`,
                  route: `/missions/${mission.id}`,
                  categoryBadge: 'Mission',
                });
              }}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-xs font-headline font-bold uppercase transition-all cursor-pointer ${
                isFav
                  ? 'bg-[#FFB45B]/20 border-[#FFB45B] text-[#FFB45B]'
                  : 'bg-[#10182B] hover:bg-[#141D30] border-[#141D30] hover:border-white/20 text-[#F5F7FF]'
              }`}
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-[#FFB45B]' : ''}`} />
              <span>{isFav ? 'Bookmarked in Vault' : 'Bookmark Mission'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedMilestoneReplayIndex(0);
                setIsReplayOpen(true);
              }}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#20D9F2] text-[#00363E] font-headline text-sm font-bold uppercase hover:bg-[#20D9F2]/90 transition-all shadow-xl shadow-[#20D9F2]/20 hover:scale-[1.02]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Launch Mission Replay</span>
            </button>

            {planetLink && (
              <button
                onClick={() => navigate(planetLink)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#10182B] hover:bg-[#141D30] border border-[#141D30] hover:border-[#20D9F2]/50 text-xs font-headline font-bold uppercase text-[#F5F7FF] transition-colors"
              >
                <Globe className="w-4 h-4 text-[#20D9F2]" />
                <span>Inspect Planetary Target</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Objectives & Spacecraft Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Objectives (7 cols) */}
        <div className="lg:col-span-7 bg-[#0A1021] border border-[#141D30] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#20D9F2] uppercase font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Primary Flight Objectives</span>
          </div>

          <div className="space-y-3">
            {mission.objectives.map((obj, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-[#060B19]/70 border border-[#141D30] rounded-xl p-3.5"
              >
                <span className="w-5 h-5 rounded-md bg-[#20D9F2]/10 text-[#20D9F2] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="font-body text-xs sm:text-sm text-[#F5F7FF] leading-relaxed">
                  {obj}
                </p>
              </div>
            ))}
          </div>

          {/* Key Achievements */}
          {mission.achievements && mission.achievements.length > 0 && (
            <div className="pt-4 border-t border-[#141D30]/80 space-y-2.5">
              <span className="text-xs font-mono text-[#FFB45B] uppercase font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Historic Achievements & Breakthroughs
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-[#98A7BF]">
                {mission.achievements.map((ach, j) => (
                  <li key={j} className="leading-relaxed">
                    <span className="text-[#F5F7FF]">{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Spacecraft Information (5 cols) */}
        <div className="lg:col-span-5 bg-[#0A1021] border border-[#141D30] rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8565FA] uppercase font-bold mb-4">
              <Layers className="w-4 h-4" />
              <span>Spacecraft Hardware Specifications</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-[#060B19] border border-[#141D30] rounded-xl p-3">
                <span className="text-[#98A7BF] text-[10px] uppercase block">Spacecraft Designation</span>
                <span className="text-sm font-bold text-[#F5F7FF]">
                  {mission.spacecraftDetails?.name || mission.name}
                </span>
              </div>

              {mission.spacecraftDetails?.launchVehicle && (
                <div className="bg-[#060B19] border border-[#141D30] rounded-xl p-3">
                  <span className="text-[#98A7BF] text-[10px] uppercase block">Launch Vehicle</span>
                  <span className="text-sm font-bold text-[#20D9F2]">
                    {mission.spacecraftDetails.launchVehicle}
                  </span>
                </div>
              )}

              {mission.spacecraftDetails?.massKg && (
                <div className="bg-[#060B19] border border-[#141D30] rounded-xl p-3">
                  <span className="text-[#98A7BF] text-[10px] uppercase block">Total Launch Mass</span>
                  <span className="text-sm font-bold text-[#FFB45B]">
                    {mission.spacecraftDetails.massKg.toLocaleString()} kg
                  </span>
                </div>
              )}

              {mission.spacecraftDetails?.powerSource && (
                <div className="bg-[#060B19] border border-[#141D30] rounded-xl p-3">
                  <span className="text-[#98A7BF] text-[10px] uppercase block">Power Architecture</span>
                  <span className="text-xs text-[#F5F7FF]">
                    {mission.spacecraftDetails.powerSource}
                  </span>
                </div>
              )}

              {mission.spacecraftDetails?.instruments && (
                <div className="bg-[#060B19] border border-[#141D30] rounded-xl p-3">
                  <span className="text-[#98A7BF] text-[10px] uppercase block mb-1">Instrument Payload</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mission.spacecraftDetails.instruments.map((inst, k) => (
                      <span
                        key={k}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#10182B] text-[#98A7BF] border border-[#141D30]"
                      >
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Outcome Summary */}
          {mission.outcome && (
            <div className="bg-[#10182B] border border-[#141D30] rounded-xl p-3.5 mt-3">
              <span className="text-[10px] font-mono text-[#20D9F2] uppercase font-bold block mb-1">
                Mission Outcome
              </span>
              <p className="text-xs font-body text-[#98A7BF] leading-relaxed">
                {mission.outcome}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Feature 8: Mission Storytelling Engine */}
      <MissionStoryteller mission={mission} />

      {/* Chronological Mission Milestones Timeline */}
      <div className="bg-[#0A1021] border border-[#141D30] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#141D30] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FFB45B] uppercase font-bold">
              <Clock className="w-4 h-4" />
              <span>Chronological Flight Heritage</span>
            </div>
            <h3 className="font-headline text-xl font-bold uppercase tracking-tight text-[#F5F7FF] mt-1">
              Documented Mission Milestones
            </h3>
          </div>

          <span className="text-xs font-mono text-[#98A7BF]">
            {mission.milestones?.length || 0} Key Milestones Recorded
          </span>
        </div>

        {/* Milestones Flow */}
        <div className="space-y-4">
          {mission.milestones?.map((ms, index) => (
            <div
              key={ms.id || index}
              className="bg-[#060B19] border border-[#141D30] hover:border-[#20D9F2]/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#FFB45B] bg-[#FFB45B]/10 border border-[#FFB45B]/20 px-2.5 py-0.5 rounded">
                    {ms.date}
                  </span>
                  <span className="text-[10px] font-mono text-[#98A7BF] uppercase px-2 py-0.5 rounded bg-[#10182B]">
                    {ms.eventType || 'Milestone'}
                  </span>
                </div>

                <h4 className="font-headline text-base font-bold text-[#F5F7FF]">
                  {ms.title}
                </h4>

                <p className="font-body text-xs sm:text-sm text-[#98A7BF] leading-relaxed">
                  {ms.description}
                </p>

                {ms.significance && (
                  <p className="text-xs font-mono text-[#20D9F2] pt-1">
                    Significance: <span className="text-[#F5F7FF]/90 font-sans italic">{ms.significance}</span>
                  </p>
                )}
              </div>

              {/* Quick Replay From This Milestone */}
              <button
                onClick={() => {
                  setSelectedMilestoneReplayIndex(index);
                  setIsReplayOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10182B] hover:bg-[#20D9F2]/20 border border-[#141D30] hover:border-[#20D9F2]/50 text-xs font-headline font-bold uppercase text-[#20D9F2] transition-colors shrink-0 self-start"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Replay Stage</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Sources & Provenance Citation */}
      <div className="bg-[#060B19]/70 border border-[#141D30] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#98A7BF]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#20D9F2] shrink-0" />
          <span>
            Data Provenance: <strong>{mission.sourceReference || 'Declassified Official Space Agency Archives'}</strong>
          </span>
        </div>
        <span className="text-[#20D9F2] bg-[#20D9F2]/10 border border-[#20D9F2]/20 px-2 py-0.5 rounded uppercase text-[10px] font-bold">
          Curated Historical Record
        </span>
      </div>

      {/* Interactive Mission Replay Engine Modal */}
      {isReplayOpen && (
        <MissionReplayEngine
          mission={mission}
          isOpen={isReplayOpen}
          onClose={() => setIsReplayOpen(false)}
          initialMilestoneIndex={selectedMilestoneReplayIndex}
        />
      )}
    </div>
  );
};
