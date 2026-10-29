import React, { useEffect } from 'react';
import {
  X,
  Compass,
  Sliders,
  Scale,
  BookOpen,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { Asteroid } from '../../../../types';

interface AsteroidDetailModalProps {
  asteroid: Asteroid | null;
  onClose: () => void;
  onLoadIntoWhatIfLab: (asteroid: Asteroid) => void;
}

export const AsteroidDetailModal: React.FC<AsteroidDetailModalProps> = ({
  asteroid,
  onClose,
  onLoadIntoWhatIfLab,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!asteroid) return null;

  const meanDiameter =
    asteroid.estimatedDiameterMeanM ?? asteroid.estimatedDiameterMeters;
  const minDiameter = asteroid.estimatedDiameterMinM ?? Math.round(meanDiameter * 0.85);
  const maxDiameter = asteroid.estimatedDiameterMaxM ?? Math.round(meanDiameter * 1.15);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="asteroid-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-[#20D9F2]/30 bg-[#0A1021] p-6 lg:p-8 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close asteroid details"
          className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant={asteroid.source === 'curated' ? 'curated' : 'synthetic'}>
            {asteroid.source === 'curated'
              ? 'CURATED BENCHMARK'
              : 'SYNTHETIC ENCOUNTER RECORD'}
          </Badge>
          <Badge variant="cyan">{asteroid.orbitClass.toUpperCase()} CLASS</Badge>
          {asteroid.isPotentiallyHazardous && (
            <Badge variant="gold">POTENTIALLY HAZARDOUS METRIC</Badge>
          )}
        </div>

        {/* Title */}
        <h2
          id="asteroid-modal-title"
          className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white mb-2"
        >
          {asteroid.name}
        </h2>
        <div className="text-xs font-mono text-[#20D9F2] mb-4">
          DESIGNATION: {asteroid.designation} • ID: {asteroid.id}
        </div>

        {/* Scenario Description */}
        <div className="rounded-xl border border-white/10 bg-[#10182B] p-4 mb-6">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-1">
            Encounter Scenario Overview
          </span>
          <p className="text-sm text-gray-200 leading-relaxed">
            {asteroid.scenarioDescription ||
              asteroid.description ||
              'Simulated near-Earth flyby telemetry with verified deterministic parameters.'}
          </p>
        </div>

        {/* Core Physical & Encounter Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Physical Characteristics Card */}
          <div className="rounded-xl border border-white/10 bg-[#060B19]/70 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#20D9F2] flex items-center gap-2 mb-3">
              <Scale className="w-4 h-4" /> Physical Characteristics
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-400">Estimated Mean Diameter</span>
                <span className="font-mono font-bold text-white">
                  {meanDiameter.toLocaleString()} meters
                </span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-400">Diameter Uncertainty</span>
                <span className="font-mono text-gray-200">
                  {minDiameter}m – {maxDiameter}m
                </span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-400">Assumed Composition</span>
                <span className="font-mono text-gray-200 text-right max-w-[180px] truncate">
                  {asteroid.estimatedComposition || asteroid.composition}
                </span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-400">Estimated Bulk Density</span>
                <span className="font-mono text-gray-200">
                  {asteroid.composition.includes('Metallic')
                    ? '~3,500 kg/m³'
                    : asteroid.composition.includes('Carbonaceous')
                    ? '~1,500 kg/m³'
                    : '~2,500 kg/m³'}
                </span>
              </li>
              <li className="flex justify-between items-center py-1">
                <span className="text-gray-400">Simulated Risk Index</span>
                <span className="font-mono font-bold text-[#FFB45B]">
                  {asteroid.simulatedRiskIndex.toFixed(1)} / 10.0
                </span>
              </li>
            </ul>
          </div>

          {/* Close-Approach Telemetry Card */}
          <div className="rounded-xl border border-white/10 bg-[#060B19]/70 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FFB45B] flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4" /> Close-Approach Information
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-400">Approach Date</span>
                <span className="font-mono font-bold text-white">
                  {asteroid.closeApproachDate}
                </span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-400">Miss Distance (km)</span>
                <span className="font-mono text-gray-200">
                  {asteroid.missDistanceKm.toLocaleString()} km
                </span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-400">Miss Distance (Lunar)</span>
                <span className="font-mono font-bold text-[#20D9F2]">
                  {asteroid.missDistanceLunar.toFixed(3)} LD
                </span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-400">Lunar Distance Basis</span>
                <span className="font-mono text-gray-400">
                  1 LD = 384,400 km
                </span>
              </li>
              <li className="flex justify-between items-center py-1">
                <span className="text-gray-400">Relative Velocity</span>
                <span className="font-mono font-bold text-[#8565FA]">
                  {asteroid.relativeVelocityKmS.toFixed(1)} km/s ({Math.round(asteroid.relativeVelocityKmS * 3600).toLocaleString()} km/h)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Educational Explanations Section */}
        <div className="rounded-xl border border-[#20D9F2]/20 bg-[#10182B]/60 p-5 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-[#20D9F2]" />
            Educational Astrophysical Context
          </h3>
          <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
            <p>
              <strong className="text-white">What a close approach means:</strong> In
              astronomy, a "close approach" simply describes the point in an object’s
              orbit where its heliocentric trajectory brings it closest to Earth
              (periapsis). A close approach does <em>not</em> imply an imminent impact.
              Even a pass of 0.2 Lunar Distances is approximately 77,000 km away—twice
              the orbital altitude of geostationary satellites.
            </p>
            <p>
              <strong className="text-white">Why asteroid size matters:</strong> Small
              meteoroids (&lt;25m) are shielded by Earth’s thick atmosphere; they
              typically break up into glowing bolides. Asteroids ≥140m possess the
              structural mass to survive deceleration and reach ground level, which is why
              international surveys prioritize detecting them.
            </p>
            <p>
              <strong className="text-white">Why relative velocity matters:</strong> Kinetic
              energy scales quadratically with speed ($E = \frac{1}{2}mv^2$). An asteroid
              traveling at 30 km/s delivers <strong>four times</strong> the destructive
              energy of an identical mass moving at 15 km/s.
            </p>
            <p>
              <strong className="text-white">Distance vs. Collision Probability:</strong>{' '}
              A close miss distance alone does not determine collision probability.
              Collision assessment requires integrating gravitational covariance
              ellipsoids, observational arc durations, and optical astrometry over multiple
              orbital apparitions.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
          <button
            onClick={() => {
              onLoadIntoWhatIfLab(asteroid);
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FFB45B] text-[#060B19] font-bold text-sm tracking-wide hover:bg-[#FFB45B]/90 transition-all cursor-pointer shadow-lg shadow-[#FFB45B]/10"
          >
            <Sliders className="w-4 h-4" />
            Test in Planetary Defense What-If Lab
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-white/20 bg-white/5 text-gray-300 font-semibold text-sm hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
