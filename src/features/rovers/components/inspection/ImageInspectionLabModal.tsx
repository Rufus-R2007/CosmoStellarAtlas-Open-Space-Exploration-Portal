import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  BookOpen,
  Save,
  Check,
  Eye,
  EyeOff,
  Move,
  Star,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { RoverImage, ImageAnnotation, Rover } from '../../../../types';
import { useAppStore } from '../../../../store/useAppStore';
import { useVaultStore } from '../../../../store/useVaultStore';

interface ImageInspectionLabModalProps {
  image: RoverImage | null;
  allImages: RoverImage[];
  rover: Rover;
  isOpen: boolean;
  onClose: () => void;
  onNavigateImage: (imageId: string) => void;
}

export const ImageInspectionLabModal: React.FC<ImageInspectionLabModalProps> = ({
  image,
  allImages,
  rover,
  isOpen,
  onClose,
  onNavigateImage,
}) => {
  // Store personal notes
  const userRoverNotes = useAppStore((state) => state.userRoverNotes);
  const saveUserRoverNote = useAppStore((state) => state.saveUserRoverNote);

  // Space Vault Integration
  const isFav = useVaultStore((s) => (image ? s.isFavorite('image', image.id) : false));
  const toggleFavorite = useVaultStore((s) => s.toggleFavorite);
  const logExplorationEvent = useVaultStore((s) => s.logExplorationEvent);

  useEffect(() => {
    if (isOpen && image) {
      logExplorationEvent('rover_image_inspected', image.id, {
        roverId: rover.id,
        sol: image.sol,
        camera: image.cameraName,
      });
    }
  }, [isOpen, image, logExplorationEvent, rover.id]);

  // Viewport transform state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Image adjustments state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [isEnhanceOpen, setIsEnhanceOpen] = useState(false);

  // Annotations & drawers
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [selectedAnnotation, setSelectedAnnotation] = useState<ImageAnnotation | null>(null);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [personalNoteText, setPersonalNoteText] = useState('');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Find index in current rover image array for navigation
  const currentIndex = image ? allImages.findIndex((img) => img.id === image.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < allImages.length - 1;

  // Reset viewport whenever inspected image changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedAnnotation(null);
    if (image) {
      setPersonalNoteText(userRoverNotes[image.id] || '');
    }
  }, [image?.id, userRoverNotes]);

  // Handle keyboard shortcuts (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedAnnotation) {
          setSelectedAnnotation(null);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onNavigateImage(allImages[currentIndex - 1].id);
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNavigateImage(allImages[currentIndex + 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrev, hasNext, currentIndex, allImages, selectedAnnotation, onClose, onNavigateImage]);

  if (!isOpen || !image) return null;

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const handleFitScreen = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Reset Display adjustments
  const handleResetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  // Mouse drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Save personal note
  const handleSaveNote = () => {
    saveUserRoverNote(image.id, personalNoteText);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div
        ref={containerRef}
        className="relative flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-[#D76B35]/40 bg-[#060B19] shadow-2xl"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0A1021]/90 px-4 py-3 backdrop-blur-md">
          {/* Left: Identity and camera info */}
          <div className="flex items-center gap-3 truncate">
            <span className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#FFB45B]">
              <Sparkles className="h-3.5 w-3.5 text-[#D76B35]" />
              Inspection Lab
            </span>
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            <div className="truncate">
              <span className="font-heading text-sm font-bold text-white truncate">
                {image.title || image.caption}
              </span>
              <span className="ml-2 font-mono text-xs text-[#20D9F2]">
                [{image.cameraAbbreviation || image.cameraName} // SOL {image.sol}]
              </span>
            </div>
          </div>

          {/* Right: Quick actions and Close */}
          <div className="flex items-center gap-2">
            {/* Display Adjustments Toggle Button */}
            <button
              onClick={() => setIsEnhanceOpen(!isEnhanceOpen)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-mono text-xs transition-colors ${
                isEnhanceOpen
                  ? 'bg-[#D76B35] text-white'
                  : 'bg-white/5 text-[#98A7BF] hover:bg-white/10 hover:text-white'
              }`}
              title="Image Enhancement Adjustments"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Enhance</span>
            </button>

            {/* Toggle Annotations Visibility */}
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-mono text-xs transition-colors ${
                showAnnotations
                  ? 'bg-[#20D9F2]/20 text-[#20D9F2] border border-[#20D9F2]/40'
                  : 'bg-white/5 text-[#98A7BF] hover:bg-white/10'
              }`}
              title="Toggle Annotations Overlay"
            >
              {showAnnotations ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">Annotations</span>
            </button>

            {/* Metadata Drawer Toggle */}
            <button
              onClick={() => setIsMetadataOpen(!isMetadataOpen)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-mono text-xs transition-colors ${
                isMetadataOpen
                  ? 'bg-[#8565FA]/20 text-[#8565FA] border border-[#8565FA]/40'
                  : 'bg-white/5 text-[#98A7BF] hover:bg-white/10'
              }`}
              title="Scientific Metadata"
            >
              <Info className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Telemetry</span>
            </button>

            {/* Personal Notes Drawer Toggle */}
            <button
              onClick={() => setIsNotesOpen(!isNotesOpen)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-mono text-xs transition-colors ${
                isNotesOpen
                  ? 'bg-[#FFB45B]/20 text-[#FFB45B] border border-[#FFB45B]/40'
                  : 'bg-white/5 text-[#98A7BF] hover:bg-white/10'
              }`}
              title="Personal Discovery Notes"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Notes</span>
            </button>

            {/* Save to Personal Space Vault */}
            {image && (
              <button
                onClick={() =>
                  toggleFavorite({
                    entityType: 'image',
                    entityId: image.id,
                    title: image.title || image.caption,
                    subtitle: `${rover.name} • ${image.cameraName} (Sol ${image.sol})`,
                    route: `/rovers`,
                    categoryBadge: 'Rover Image',
                    previewImage: image.assetPath || image.thumbnailPath,
                  })
                }
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
                  isFav
                    ? 'bg-[#FFB45B]/20 text-[#FFB45B] border border-[#FFB45B]/40'
                    : 'bg-white/5 text-[#98A7BF] hover:bg-white/10 hover:text-white'
                }`}
                title={isFav ? 'Remove from Space Vault' : 'Save Image to Space Vault'}
              >
                <Star className={`h-3.5 w-3.5 ${isFav ? 'fill-[#FFB45B]' : ''}`} />
                <span className="hidden sm:inline">{isFav ? 'Saved' : 'Save'}</span>
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={handleToggleFullscreen}
              className="rounded-lg p-1.5 text-[#98A7BF] hover:bg-white/10 hover:text-white"
              title="Fullscreen Viewport"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#98A7BF] hover:bg-red-500/20 hover:text-red-400"
              title="Close (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Work Area: Interactive Canvas Viewport */}
        <div className="relative flex-1 overflow-hidden bg-black select-none">
          {/* Previous / Next Arrow Overlays */}
          {hasPrev && (
            <button
              onClick={() => onNavigateImage(allImages[currentIndex - 1].id)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white border border-white/10 backdrop-blur-sm transition-transform hover:scale-110 hover:bg-[#D76B35]"
              title="Previous Image (Left Arrow)"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {hasNext && (
            <button
              onClick={() => onNavigateImage(allImages[currentIndex + 1].id)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white border border-white/10 backdrop-blur-sm transition-transform hover:scale-110 hover:bg-[#D76B35]"
              title="Next Image (Right Arrow)"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Interactive Zoom/Pan Surface */}
          <div
            className={`h-full w-full flex items-center justify-center p-4 transition-transform duration-75 ${
              zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div
              className="relative inline-block max-h-full max-w-full"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Image Element with Filter adjustments applied */}
              <img
                src={image.assetPath}
                alt={image.title || image.caption}
                draggable={false}
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                }}
                className="max-h-[72vh] w-auto max-w-full rounded-lg shadow-2xl pointer-events-none"
              />

              {/* Educational Annotations Layer */}
              {showAnnotations && image.annotations && image.annotations.length > 0 && (
                <div className="absolute inset-0 pointer-events-auto">
                  {image.annotations.map((ann) => {
                    const isSelected = selectedAnnotation?.id === ann.id;
                    return (
                      <div
                        key={ann.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAnnotation(isSelected ? null : ann);
                        }}
                        style={{
                          left: `${ann.normalizedX}%`,
                          top: `${ann.normalizedY}%`,
                          width: `${ann.normalizedWidth}%`,
                          height: `${ann.normalizedHeight}%`,
                        }}
                        className={`absolute cursor-pointer rounded transition-all ${
                          isSelected
                            ? 'border-2 border-[#20D9F2] bg-[#20D9F2]/20 ring-4 ring-[#20D9F2]/40 shadow-lg'
                            : 'border border-dashed border-[#FFB45B] bg-[#FFB45B]/10 hover:border-[#20D9F2] hover:bg-[#20D9F2]/15'
                        }`}
                        title={ann.label}
                      >
                        {/* Pin Tag */}
                        <div
                          className={`absolute -top-3 left-1 flex items-center gap-1 rounded px-1.5 py-0.2 font-mono text-[9px] font-bold shadow ${
                            isSelected
                              ? 'bg-[#20D9F2] text-[#060B19]'
                              : 'bg-black/80 text-[#FFB45B] border border-[#FFB45B]/40'
                          }`}
                        >
                          <Sparkles className="h-2.5 w-2.5" />
                          {ann.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Active Annotation Detail Card Floating in Viewport */}
          {selectedAnnotation && (
            <div className="absolute left-6 bottom-16 z-30 max-w-sm rounded-xl border border-[#20D9F2]/60 bg-[#060B19]/90 p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#20D9F2]">
                  {selectedAnnotation.provenance}
                </span>
                <button
                  onClick={() => setSelectedAnnotation(null)}
                  className="rounded p-1 text-[#98A7BF] hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <h4 className="mt-2 font-heading text-sm font-bold text-white">
                {selectedAnnotation.label}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-[#98A7BF]">
                {selectedAnnotation.description}
              </p>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                <span className="font-mono text-[10px] text-[#FFB45B]">
                  Category: {selectedAnnotation.annotationType.replace('_', ' ')}
                </span>
                <button
                  onClick={() => setSelectedAnnotation(null)}
                  className="font-mono text-[10px] text-[#20D9F2] hover:underline"
                >
                  View Unannotated
                </button>
              </div>
            </div>
          )}

          {/* Enhancement Adjustments Popover Panel */}
          {isEnhanceOpen && (
            <div className="absolute right-6 top-6 z-30 w-72 rounded-xl border border-[#D76B35]/40 bg-[#0A1021]/95 p-4 shadow-2xl backdrop-blur-md space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-white uppercase tracking-wider">
                  Optical Enhancements
                </span>
                <button
                  onClick={handleResetAdjustments}
                  className="flex items-center gap-1 text-[10px] text-[#FFB45B] hover:underline"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              </div>

              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-[#98A7BF]">
                  <span>Brightness:</span>
                  <span className="text-white font-bold">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-[#D76B35]"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-[#98A7BF]">
                  <span>Contrast:</span>
                  <span className="text-white font-bold">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-[#20D9F2]"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex justify-between text-[#98A7BF]">
                  <span>Saturation:</span>
                  <span className="text-white font-bold">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-[#FFB45B]"
                />
              </div>

              <p className="text-[10px] leading-tight text-[#98A7BF]/70 italic pt-1">
                Display adjustments only — does not alter or generate scientific telemetry.
              </p>
            </div>
          )}

          {/* Scientific Metadata Drawer */}
          {isMetadataOpen && (
            <div className="absolute right-6 top-6 z-30 w-80 rounded-xl border border-[#8565FA]/40 bg-[#0A1021]/95 p-4 shadow-2xl backdrop-blur-md space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-white uppercase tracking-wider">
                  Telemetry Metadata
                </span>
                <button
                  onClick={() => setIsMetadataOpen(false)}
                  className="text-[#98A7BF] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-[#98A7BF]">Rover:</span>
                  <span className="font-bold text-white">{rover.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-[#98A7BF]">Camera:</span>
                  <span className="font-bold text-[#20D9F2]">{image.cameraFullName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-[#98A7BF]">Mission Sol:</span>
                  <span className="font-bold text-[#FFB45B]">Sol {image.sol}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-[#98A7BF]">Earth Date:</span>
                  <span className="text-white">{image.earthDate} UTC</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-[#98A7BF]">Source Reference:</span>
                  <span className="text-right text-[#98A7BF] max-w-[170px] truncate">{image.sourceReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#98A7BF]">Classification:</span>
                  <Badge variant={image.assetKind === 'historical_photo' ? 'curated' : 'synthetic'}>
                    {image.assetKind === 'historical_photo' ? 'Curated Photo' : 'Illustrative Render'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Personal Discovery Notes Drawer */}
          {isNotesOpen && (
            <div className="absolute right-6 top-6 z-30 w-80 rounded-xl border border-[#FFB45B]/40 bg-[#0A1021]/95 p-4 shadow-2xl backdrop-blur-md space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-[#FFB45B] uppercase tracking-wider">
                  Personal Research Notes
                </span>
                <button
                  onClick={() => setIsNotesOpen(false)}
                  className="text-[#98A7BF] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-[#98A7BF]">
                  Record your observations for this capture (saved locally in browser):
                </label>
                <textarea
                  value={personalNoteText}
                  onChange={(e) => setPersonalNoteText(e.target.value)}
                  placeholder="Record observations regarding rock layering, grain size, dust, or engineering hardware..."
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-[#060B19] p-2.5 font-sans text-xs text-white placeholder-[#98A7BF]/50 focus:border-[#FFB45B] focus:outline-none"
                />

                <button
                  onClick={handleSaveNote}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#FFB45B] py-2 font-mono text-xs font-bold text-[#060B19] transition-colors hover:bg-[#FFB45B]/90"
                >
                  {isSavedRecently ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Note Saved!
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Save to Vault
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Telemetry HUD and Zoom Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0A1021]/95 px-4 py-2.5 text-xs font-mono text-[#98A7BF]">
          {/* Zoom controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
              title="Zoom Out (-25%)"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="w-14 text-center font-bold text-white">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
              title="Zoom In (+25%)"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleResetView}
              className="ml-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-white hover:bg-white/10"
              title="Reset View"
            >
              Reset View
            </button>
            <button
              onClick={handleFitScreen}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-white hover:bg-white/10"
              title="Fit to Screen"
            >
              Fit
            </button>
          </div>

          {/* Navigation and position indicator */}
          <div className="flex items-center gap-3">
            <span>
              Image {currentIndex + 1} of {allImages.length}
            </span>
            <div className="h-3 w-px bg-white/10" />
            <span className="text-white font-medium">{image.aspectRatio} Aspect</span>
            {zoom > 1 && (
              <span className="flex items-center gap-1 text-[#20D9F2]">
                <Move className="h-3 w-3" /> Drag to Pan
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
