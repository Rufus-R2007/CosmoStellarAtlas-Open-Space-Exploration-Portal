import React, { useState, useMemo } from 'react';
import {
  Search,
  Camera,
  Maximize2,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { Rover, RoverImage, RoverCamera } from '../../../../types';

interface RoverGallerySectionProps {
  rover: Rover;
  images: RoverImage[];
  cameras: RoverCamera[];
  selectedSol: number | null;
  onOpenInspectionLab: (imageId: string) => void;
  onSelectSol: (sol: number | null) => void;
}

export const RoverGallerySection: React.FC<RoverGallerySectionProps> = ({
  rover,
  images,
  cameras,
  selectedSol,
  onOpenInspectionLab,
  onSelectSol,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'sol-desc' | 'sol-asc' | 'title-asc'>('sol-desc');

  // Collect distinct tags across these images
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    images.forEach((img) => img.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [images]);

  // Filter and sort images
  const filteredImages = useMemo(() => {
    let result = [...images];

    // Sol constraint
    if (selectedSol !== null) {
      result = result.filter((img) => img.sol === selectedSol);
    }

    // Camera constraint
    if (selectedCameraId) {
      result = result.filter(
        (img) =>
          img.cameraId?.toLowerCase() === selectedCameraId.toLowerCase() ||
          img.cameraAbbreviation?.toLowerCase() === selectedCameraId.toLowerCase()
      );
    }

    // Tag constraint
    if (selectedTag) {
      result = result.filter((img) =>
        img.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Free text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (img) =>
          img.title?.toLowerCase().includes(q) ||
          img.caption.toLowerCase().includes(q) ||
          img.cameraName.toLowerCase().includes(q) ||
          img.cameraAbbreviation?.toLowerCase().includes(q) ||
          img.description?.toLowerCase().includes(q) ||
          img.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'sol-desc') return b.sol - a.sol;
      if (sortBy === 'sol-asc') return a.sol - b.sol;
      if (sortBy === 'title-asc') return (a.title || a.caption).localeCompare(b.title || b.caption);
      return 0;
    });

    return result;
  }, [images, selectedSol, selectedCameraId, selectedTag, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCameraId(null);
    setSelectedTag(null);
    onSelectSol(null);
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCameraId !== null ||
    selectedTag !== null ||
    selectedSol !== null;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-[#20D9F2]" />
            <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Rover Optical Camera Gallery
            </h2>
          </div>
          <p className="mt-1 font-sans text-xs text-[#98A7BF] sm:text-sm">
            High-contrast visual gallery for {rover.name}. Click any capture to launch the
            Interactive Image Inspection Lab with zoom, pan, and educational annotations.
          </p>
        </div>
        <div className="font-mono text-xs text-[#20D9F2]">
          {filteredImages.length} OF {images.length} RECORDS DISPLAYED
        </div>
      </div>

      {/* Filter Matrix Card */}
      <div className="rounded-xl border border-white/10 bg-[#0A1021]/80 p-4 backdrop-blur-sm sm:p-5 space-y-4">
        {/* Row 1: Search bar and Sort selector */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A7BF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images by target, rock formation, camera, or keyword..."
              className="w-full rounded-lg border border-white/10 bg-[#060B19]/80 py-2 pl-9 pr-4 text-xs text-white placeholder-[#98A7BF]/60 transition-colors focus:border-[#20D9F2] focus:outline-none focus:ring-1 focus:ring-[#20D9F2]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#98A7BF] hover:text-white"
              >
                CLEAR
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-xs text-[#98A7BF]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-white/10 bg-[#060B19] px-3 py-2 font-mono text-xs text-white focus:border-[#20D9F2] focus:outline-none"
            >
              <option value="sol-desc">Sol (Newest First)</option>
              <option value="sol-asc">Sol (Oldest First)</option>
              <option value="title-asc">Title (A to Z)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 rounded-lg border border-[#D76B35]/40 bg-[#D76B35]/10 px-3 py-2 font-mono text-xs text-[#FFB45B] transition-colors hover:bg-[#D76B35]/20"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Camera Filters */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#98A7BF] mr-1">
            Camera:
          </span>
          <button
            onClick={() => setSelectedCameraId(null)}
            className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
              selectedCameraId === null
                ? 'bg-[#20D9F2] text-[#060B19] font-bold'
                : 'bg-white/5 text-[#98A7BF] hover:bg-white/10 hover:text-white'
            }`}
          >
            All Cameras
          </button>
          {cameras.map((cam) => {
            const isSelected = selectedCameraId === cam.id;
            return (
              <button
                key={cam.id}
                onClick={() => setSelectedCameraId(isSelected ? null : cam.id)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                  isSelected
                    ? 'bg-[#20D9F2] text-[#060B19] font-bold'
                    : 'bg-white/5 text-[#98A7BF] hover:bg-white/10 hover:text-white'
                }`}
                title={cam.name}
              >
                {cam.abbreviation}
              </button>
            );
          })}
        </div>

        {/* Row 3: Educational Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[#98A7BF] mr-1">
              Geological Tag:
            </span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`rounded-md px-2 py-0.5 font-mono text-[11px] transition-colors ${
                selectedTag === null
                  ? 'bg-[#FFB45B] text-[#060B19] font-bold'
                  : 'bg-white/5 text-[#98A7BF] hover:bg-white/10 hover:text-white'
              }`}
            >
              All Topics
            </button>
            {allTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? null : tag)}
                  className={`rounded-md px-2 py-0.5 font-mono text-[11px] transition-colors ${
                    isSelected
                      ? 'bg-[#FFB45B] text-[#060B19] font-bold'
                      : 'bg-white/5 text-[#98A7BF] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Gallery Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0A1021]/80 transition-all duration-300 hover:border-[#D76B35]/50 hover:shadow-xl hover:shadow-[#D76B35]/10"
            >
              {/* Image Preview Container */}
              <div
                className="relative aspect-video w-full overflow-hidden bg-black/60 cursor-pointer"
                onClick={() => onOpenInspectionLab(img.id)}
              >
                <img
                  src={img.assetPath}
                  alt={img.title || img.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1021] via-transparent to-transparent opacity-80" />

                {/* Camera & Sol Overlay Badges */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5">
                  <span className="rounded bg-black/70 px-2 py-0.5 font-mono text-[11px] font-bold text-[#20D9F2] backdrop-blur-sm">
                    {img.cameraAbbreviation || img.cameraName}
                  </span>
                  <span className="rounded bg-[#D76B35]/80 px-2 py-0.5 font-mono text-[11px] font-bold text-white backdrop-blur-sm">
                    SOL {img.sol}
                  </span>
                </div>

                {/* Inspect Button Prompt on Hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-[2px]">
                  <span className="flex items-center gap-2 rounded-lg bg-[#D76B35] px-4 py-2 font-mono text-xs font-bold text-white shadow-lg shadow-black/50">
                    <Maximize2 className="h-4 w-4" />
                    Launch Inspection Lab
                  </span>
                </div>

                {/* Annotations Available Pill */}
                {img.annotations && img.annotations.length > 0 && (
                  <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-[#FFB45B] backdrop-blur-sm">
                    <Sparkles className="h-3 w-3" />
                    {img.annotations.length} Annotations
                  </div>
                )}
              </div>

              {/* Image Card Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#98A7BF]">
                    <span>{img.earthDate} UTC</span>
                    <Badge variant={img.assetKind === 'historical_photo' ? 'curated' : 'synthetic'}>
                      {img.assetKind === 'historical_photo' ? 'Historical Photo' : 'Illustrative Render'}
                    </Badge>
                  </div>

                  <h3 className="mt-1 font-heading text-base font-bold text-white group-hover:text-[#FFB45B] transition-colors line-clamp-1">
                    {img.title || img.caption}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#98A7BF]">
                    {img.description || img.caption}
                  </p>
                </div>

                {/* Tags and Open Action */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {img.tags?.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-[#98A7BF]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenInspectionLab(img.id)}
                    className="flex items-center gap-1 font-mono text-xs font-medium text-[#20D9F2] hover:underline"
                  >
                    Inspect <Maximize2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-xl border border-dashed border-white/10 bg-[#0A1021]/60 p-12 text-center space-y-3">
          <Info className="mx-auto h-8 w-8 text-[#FFB45B]" />
          <h3 className="font-heading text-lg font-bold text-white">No Matching Imagery Found</h3>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-[#98A7BF]">
            No camera records match your current filter parameters. Try clearing the search query or
            resetting the active camera and Sol filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D76B35] bg-[#D76B35] px-4 py-2 font-mono text-xs font-bold text-white shadow-lg shadow-[#D76B35]/20 hover:bg-[#D76B35]/90"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
