import React from 'react';
import {
  RotateCw,
  Pause,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sliders,
  Layers,
} from 'lucide-react';
import { cn } from '../../../../utils/cn';

interface ViewerControlsProps {
  isRotating: boolean;
  onToggleRotation: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  quality: 'high' | 'low';
  onToggleQuality: () => void;
  forceFallback: boolean;
  onToggleFallback: () => void;
  className?: string;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  isRotating,
  onToggleRotation,
  onZoomIn,
  onZoomOut,
  onResetView,
  isExpanded,
  onToggleExpanded,
  quality,
  onToggleQuality,
  forceFallback,
  onToggleFallback,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#060B19]/90 border border-[#141D30] backdrop-blur-md shadow-lg text-[#98A7BF]',
        className
      )}
      role="toolbar"
      aria-label="3D Planetarium Viewer Controls"
    >
      {/* Rotation Toggle */}
      <button
        onClick={onToggleRotation}
        className={cn(
          'p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-telemetry uppercase',
          isRotating
            ? 'bg-[#20D9F2]/15 text-[#20D9F2] border border-[#20D9F2]/30'
            : 'hover:bg-[#10182B] hover:text-[#F5F7FF]'
        )}
        title={isRotating ? 'Pause Axial Rotation' : 'Resume Axial Rotation'}
        aria-label={isRotating ? 'Pause Rotation' : 'Resume Rotation'}
      >
        {isRotating ? <Pause className="w-4 h-4" /> : <RotateCw className="w-4 h-4" />}
        <span className="hidden sm:inline">{isRotating ? 'Pause' : 'Rotate'}</span>
      </button>

      <div className="w-px h-5 bg-[#141D30] mx-0.5" />

      {/* Zoom In */}
      <button
        onClick={onZoomIn}
        className="p-2 rounded-lg hover:bg-[#10182B] hover:text-[#F5F7FF] transition-colors"
        title="Zoom In Camera"
        aria-label="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* Zoom Out */}
      <button
        onClick={onZoomOut}
        className="p-2 rounded-lg hover:bg-[#10182B] hover:text-[#F5F7FF] transition-colors"
        title="Zoom Out Camera"
        aria-label="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {/* Reset Camera View */}
      <button
        onClick={onResetView}
        className="p-2 rounded-lg hover:bg-[#10182B] hover:text-[#F5F7FF] transition-colors"
        title="Reset Camera Orientation & Zoom"
        aria-label="Reset Camera"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-[#141D30] mx-0.5" />

      {/* Quality Switcher */}
      <button
        onClick={onToggleQuality}
        className="px-2 py-1.5 rounded-lg hover:bg-[#10182B] hover:text-[#F5F7FF] transition-colors text-xs font-telemetry uppercase flex items-center gap-1"
        title="Toggle Shader Geometric Quality"
        aria-label="Toggle Quality"
      >
        <Sliders className="w-3.5 h-3.5 text-[#20D9F2]" />
        <span>{quality === 'high' ? 'High Res' : 'Fast'}</span>
      </button>

      {/* Engine Fallback Toggle (3D WebGL vs 2D Canvas) */}
      <button
        onClick={onToggleFallback}
        className={cn(
          'px-2 py-1.5 rounded-lg transition-colors text-xs font-telemetry uppercase flex items-center gap-1',
          forceFallback
            ? 'bg-[#FFB45B]/15 text-[#FFB45B] border border-[#FFB45B]/30'
            : 'hover:bg-[#10182B] hover:text-[#F5F7FF]'
        )}
        title="Switch between 3D WebGL Mesh and Accessible 2D Canvas"
        aria-label="Toggle 2D/3D Engine"
      >
        <Layers className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{forceFallback ? '2D Canvas' : '3D WebGL'}</span>
      </button>

      <div className="w-px h-5 bg-[#141D30] mx-0.5" />

      {/* Fullscreen / Expand Toggle */}
      <button
        onClick={onToggleExpanded}
        className="p-2 rounded-lg hover:bg-[#10182B] hover:text-[#F5F7FF] transition-colors"
        title={isExpanded ? 'Collapse View' : 'Expand Full Viewport'}
        aria-label={isExpanded ? 'Collapse Viewport' : 'Expand Viewport'}
      >
        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  );
};
