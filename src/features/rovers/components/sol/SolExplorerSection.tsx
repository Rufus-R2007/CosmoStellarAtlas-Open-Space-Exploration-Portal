import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Sun, Info } from 'lucide-react';
import { Rover, RoverImage } from '../../../../types';

interface SolExplorerSectionProps {
  rover: Rover;
  availableSols: number[];
  selectedSol: number | null;
  onSelectSol: (sol: number | null) => void;
  roverImages: RoverImage[];
}

export const SolExplorerSection: React.FC<SolExplorerSectionProps> = ({
  rover,
  availableSols,
  selectedSol,
  onSelectSol,
  roverImages,
}) => {
  // Sort sols ascending
  const sortedSols = [...availableSols].sort((a, b) => a - b);
  const currentSolIndex = selectedSol !== null ? sortedSols.indexOf(selectedSol) : -1;

  const handlePrevSol = () => {
    if (sortedSols.length === 0) return;
    if (selectedSol === null) {
      onSelectSol(sortedSols[0]);
    } else if (currentSolIndex > 0) {
      onSelectSol(sortedSols[currentSolIndex - 1]);
    }
  };

  const handleNextSol = () => {
    if (sortedSols.length === 0) return;
    if (selectedSol === null) {
      onSelectSol(sortedSols[0]);
    } else if (currentSolIndex < sortedSols.length - 1) {
      onSelectSol(sortedSols[currentSolIndex + 1]);
    }
  };

  // Find images matching active sol
  const activeSolImages =
    selectedSol !== null
      ? roverImages.filter((img) => img.sol === selectedSol)
      : roverImages;

  return (
    <section className="space-y-4 rounded-xl border border-white/10 bg-[#0A1021]/80 p-5 backdrop-blur-sm sm:p-6">
      {/* Header & Controls Row */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-[#FFB45B]" />
            <h3 className="font-heading text-lg font-bold text-white sm:text-xl">
              Sol Explorer (Martian Solar Days)
            </h3>
          </div>
          <p className="mt-1 font-sans text-xs text-[#98A7BF]">
            A Martian Sol is 24 hours, 39 minutes, and 35.244 seconds. Browse indexed mission days
            to inspect surface operations and camera telemetry.
          </p>
        </div>

        {/* Stepper Buttons & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevSol}
            disabled={currentSolIndex <= 0}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5"
            title="Previous Available Sol"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={handleNextSol}
            disabled={currentSolIndex >= sortedSols.length - 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5"
            title="Next Available Sol"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {selectedSol !== null && (
            <button
              onClick={() => onSelectSol(null)}
              className="flex items-center gap-1.5 rounded-lg border border-[#D76B35]/40 bg-[#D76B35]/15 px-3 py-2 font-mono text-xs text-[#FFB45B] transition-colors hover:bg-[#D76B35]/25"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Sol Filter
            </button>
          )}
        </div>
      </div>

      {/* Available Sols Timeline Scrubber */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#98A7BF]">
          <span>Landmark Mission Sols for {rover.name}:</span>
          <span className="text-[#FFB45B]">
            {selectedSol !== null ? `SOL ${selectedSol} ACTIVE` : 'ALL SOLS DISPLAYED'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectSol(null)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              selectedSol === null
                ? 'border border-[#20D9F2] bg-[#20D9F2]/20 text-[#20D9F2]'
                : 'border border-white/10 bg-[#060B19]/60 text-[#98A7BF] hover:border-white/30 hover:text-white'
            }`}
          >
            All Sols ({roverImages.length})
          </button>

          {sortedSols.map((sol) => {
            const isSelected = selectedSol === sol;
            const solImgCount = roverImages.filter((img) => img.sol === sol).length;

            return (
              <button
                key={sol}
                onClick={() => onSelectSol(sol)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
                  isSelected
                    ? 'border border-[#D76B35] bg-[#D76B35] text-white shadow-md shadow-[#D76B35]/30'
                    : 'border border-white/10 bg-[#060B19]/60 text-[#98A7BF] hover:border-[#D76B35]/50 hover:text-white'
                }`}
              >
                <span>Sol {sol}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-[#98A7BF]'
                  }`}
                >
                  {solImgCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Sol Telemetry Briefing Panel */}
      {selectedSol !== null && activeSolImages.length > 0 && (
        <div className="rounded-lg border border-[#D76B35]/30 bg-[#1E0D08]/50 p-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white text-sm">
                SOL {selectedSol} MISSION ARCHIVE
              </span>
              <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-[#20D9F2]">
                {activeSolImages[0].earthDate} UTC
              </span>
            </div>
            <div className="font-mono text-[#FFB45B]">
              {activeSolImages.length} Image Record{activeSolImages.length > 1 ? 's' : ''} Documented
            </div>
          </div>
          <div className="mt-2 text-[#98A7BF] leading-relaxed">
            <span className="text-white font-medium">Activity Summary: </span>
            {activeSolImages[0].educationalNotes || activeSolImages[0].description}
          </div>
        </div>
      )}

      {/* Empty State when no photos exist for an arbitrary sol */}
      {selectedSol !== null && activeSolImages.length === 0 && (
        <div className="rounded-lg border border-dashed border-white/10 bg-[#060B19]/50 p-6 text-center text-xs text-[#98A7BF]">
          <Info className="mx-auto h-6 w-6 text-[#FFB45B] mb-2" />
          <p className="font-medium text-white">No Verified Imagery Indexed for Sol {selectedSol}</p>
          <p className="mt-1">
            This Sol corresponds to a routine drive or non-imaging instrument cycle. Click "Reset Sol
            Filter" or select another Sol above.
          </p>
        </div>
      )}
    </section>
  );
};
