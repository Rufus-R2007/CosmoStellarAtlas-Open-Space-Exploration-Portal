import React, { useState } from 'react';
import { ArrowLeftRight, Scale, Lightbulb } from 'lucide-react';
import { Rover } from '../../../../types';

interface RoverComparisonLabProps {
  rovers: Rover[];
  initialRoverAId?: string;
  initialRoverBId?: string;
}

export const RoverComparisonLab: React.FC<RoverComparisonLabProps> = ({
  rovers,
  initialRoverAId = 'perseverance',
  initialRoverBId = 'curiosity',
}) => {
  const [roverAId, setRoverAId] = useState(initialRoverAId);
  const [roverBId, setRoverBId] = useState(initialRoverBId);

  const roverA = rovers.find((r) => r.id === roverAId) || rovers[0];
  const roverB = rovers.find((r) => r.id === roverBId) || rovers[1] || rovers[0];

  const handleSwap = () => {
    const temp = roverAId;
    setRoverAId(roverBId);
    setRoverBId(temp);
  };

  const isIdentical = roverA.id === roverB.id;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-[#FFB45B]" />
            <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Rover Engineering Comparison Lab
            </h2>
          </div>
          <p className="mt-1 font-sans text-xs text-[#98A7BF] sm:text-sm">
            Evaluate side-by-side design evolutions, payload capacities, mobility specifications, and mission achievements across Martian rover generations.
          </p>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-[#20D9F2] transition-colors hover:bg-white/10"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Swap Explorers
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Rover A Selector */}
        <div className="rounded-xl border border-[#D76B35]/40 bg-[#1E0D08]/60 p-4 space-y-2">
          <label className="font-mono text-xs uppercase tracking-wider text-[#FFB45B]">
            Primary Rover (Alpha):
          </label>
          <select
            value={roverA.id}
            onChange={(e) => setRoverAId(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#060B19] p-2.5 font-heading text-sm font-bold text-white focus:border-[#D76B35] focus:outline-none"
          >
            {rovers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.agency})
              </option>
            ))}
          </select>
        </div>

        {/* Rover B Selector */}
        <div className="rounded-xl border border-[#20D9F2]/40 bg-[#060B19]/80 p-4 space-y-2">
          <label className="font-mono text-xs uppercase tracking-wider text-[#20D9F2]">
            Comparison Rover (Beta):
          </label>
          <select
            value={roverB.id}
            onChange={(e) => setRoverBId(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#060B19] p-2.5 font-heading text-sm font-bold text-white focus:border-[#20D9F2] focus:outline-none"
          >
            {rovers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.agency})
              </option>
            ))}
          </select>
        </div>
      </div>

      {isIdentical && (
        <div className="rounded-lg border border-[#FFB45B]/30 bg-[#FFB45B]/10 p-3 text-xs text-[#FFB45B]">
          Notice: You have selected the same rover for both sides. Choose two distinct rovers to compare engineering architectures.
        </div>
      )}

      {/* Comparison Grid Matrix */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0A1021]/80 backdrop-blur-md">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-[11px] uppercase tracking-wider text-[#98A7BF]">
              <th className="p-4 w-1/3">Engineering Attribute</th>
              <th className="p-4 w-1/3 text-[#FFB45B] font-bold">{roverA.name}</th>
              <th className="p-4 w-1/3 text-[#20D9F2] font-bold">{roverB.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {/* Mass */}
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 text-[#98A7BF] font-sans font-medium">Launch Mass</td>
              <td className="p-4 font-bold text-white">
                {roverA.specifications?.massKg ? `${roverA.specifications.massKg} kg` : 'N/A'}
              </td>
              <td className="p-4 font-bold text-white">
                {roverB.specifications?.massKg ? `${roverB.specifications.massKg} kg` : 'N/A'}
              </td>
            </tr>

            {/* Power Source */}
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 text-[#98A7BF] font-sans font-medium">Power Architecture</td>
              <td className="p-4 text-white">
                {roverA.specifications?.powerSource?.split('(')[0] || 'Solar'}
              </td>
              <td className="p-4 text-white">
                {roverB.specifications?.powerSource?.split('(')[0] || 'Solar'}
              </td>
            </tr>

            {/* Total Sols */}
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 text-[#98A7BF] font-sans font-medium">Surface Lifetime (Sols)</td>
              <td className="p-4 font-bold text-[#FFB45B]">{roverA.totalSols.toLocaleString()} sols</td>
              <td className="p-4 font-bold text-[#20D9F2]">{roverB.totalSols.toLocaleString()} sols</td>
            </tr>

            {/* Distance */}
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 text-[#98A7BF] font-sans font-medium">Total Traverse Distance</td>
              <td className="p-4 font-bold text-[#FFB45B]">{roverA.distanceTraveledKm} km</td>
              <td className="p-4 font-bold text-[#20D9F2]">{roverB.distanceTraveledKm} km</td>
            </tr>

            {/* Wheel Diameter */}
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 text-[#98A7BF] font-sans font-medium">Wheel Diameter</td>
              <td className="p-4 text-white">
                {roverA.specifications?.wheelDiameterCm ? `${roverA.specifications.wheelDiameterCm} cm` : 'N/A'}
              </td>
              <td className="p-4 text-white">
                {roverB.specifications?.wheelDiameterCm ? `${roverB.specifications.wheelDiameterCm} cm` : 'N/A'}
              </td>
            </tr>

            {/* Core Samples */}
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 text-[#98A7BF] font-sans font-medium">Samples / Drilled Targets</td>
              <td className="p-4 text-white">{roverA.sampleCount}</td>
              <td className="p-4 text-white">{roverB.sampleCount}</td>
            </tr>

            {/* Landing Site */}
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 text-[#98A7BF] font-sans font-medium">Landing Site</td>
              <td className="p-4 text-white font-sans text-xs">{roverA.landingSite}</td>
              <td className="p-4 text-white font-sans text-xs">{roverB.landingSite}</td>
            </tr>

            {/* Primary Objective */}
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 text-[#98A7BF] font-sans font-medium">Primary Science Objective</td>
              <td className="p-4 text-[#98A7BF] font-sans text-xs leading-relaxed">{roverA.primaryMission}</td>
              <td className="p-4 text-[#98A7BF] font-sans text-xs leading-relaxed">{roverB.primaryMission}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Engineering Insights Banner */}
      <div className="rounded-xl border border-[#D76B35]/30 bg-gradient-to-r from-[#1E0D08]/80 to-[#10182B] p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FFB45B] uppercase tracking-wider">
          <Lightbulb className="h-4 w-4 text-[#D76B35]" />
          Historical Engineering Synthesis
        </div>
        <p className="font-sans text-xs leading-relaxed text-[#98A7BF]">
          The technological evolution between {roverA.name} and {roverB.name} marks a fundamental milestone in space exploration:
          from lightweight microwave-sized technology demonstrators to 1-ton autonomous nuclear astrobiology stations.
          Nuclear MMRTG power systems eliminate reliance on unpredictable solar dust cleaning, while high-clearance rocker-bogie
          suspensions with curved titanium spokes maximize wheel lifetime across millions of wheel rotations.
        </p>
      </div>
    </section>
  );
};
