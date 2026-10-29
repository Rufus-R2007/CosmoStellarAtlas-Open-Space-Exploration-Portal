import React, { useState } from 'react';
import {
  Compass,
  Maximize2,
  Info,
  Mountain,
} from 'lucide-react';
import { Rover, JourneyWaypoint, RoverImage } from '../../../../types';

interface SurfaceJourneySectionProps {
  rover: Rover;
  waypoints: JourneyWaypoint[];
  allImages: RoverImage[];
  onOpenImage: (imageId: string) => void;
}

export const SurfaceJourneySection: React.FC<SurfaceJourneySectionProps> = ({
  rover,
  waypoints,
  allImages,
  onOpenImage,
}) => {
  const [selectedWaypointId, setSelectedWaypointId] = useState<string | null>(
    waypoints.length > 0 ? waypoints[0].id : null
  );

  const selectedWaypoint =
    waypoints.find((wp) => wp.id === selectedWaypointId) || (waypoints.length > 0 ? waypoints[0] : null);

  // Associated images for selected waypoint
  const waypointImages = selectedWaypoint?.imageIds
    ? allImages.filter((img) => selectedWaypoint.imageIds?.includes(img.id))
    : [];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-[#D76B35]" />
            <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Surface Journey & Traverse Route
            </h2>
          </div>
          <p className="mt-1 font-sans text-xs text-[#98A7BF] sm:text-sm">
            Schematic exploration traverse for {rover.name}. Select waypoints along the route to inspect
            elevation profiles, geologic context, and surface discoveries.
          </p>
        </div>

        {/* Scientific Limitation Disclaimer */}
        <div className="flex items-center gap-2 rounded-lg border border-[#FFB45B]/30 bg-[#FFB45B]/10 px-3 py-1.5 font-mono text-[11px] text-[#FFB45B]">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>Illustrative route — not an actual GPS/inertial traverse map.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Interactive Schematic Topographic Map Canvas (2 cols) */}
        <div className="rounded-xl border border-white/10 bg-[#060B19]/90 p-4 lg:col-span-2 backdrop-blur-md">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-[#1E0D08] via-[#10182B] to-[#0A1021]">
            {/* Topographic Contour Lines (SVG Background) */}
            <svg
              className="absolute inset-0 h-full w-full opacity-40 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridPattern)" />

              {/* Stylized Elevation Contour Rings */}
              <ellipse cx="65%" cy="35%" rx="180" ry="90" fill="none" stroke="#D76B35" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
              <ellipse cx="65%" cy="35%" rx="120" ry="60" fill="none" stroke="#D76B35" strokeWidth="1" opacity="0.4" />
              <ellipse cx="65%" cy="35%" rx="60" ry="30" fill="none" stroke="#FFB45B" strokeWidth="1.5" opacity="0.5" />
            </svg>

            {/* Connecting Traverse Route Polyline */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none">
              {waypoints.length > 1 && (
                <polyline
                  points={waypoints.map((wp) => `${wp.positionX}%,${wp.positionY}%`).join(' ')}
                  fill="none"
                  stroke="#D76B35"
                  strokeWidth="3"
                  strokeDasharray="6,4"
                  className="animate-pulse"
                />
              )}
            </svg>

            {/* Interactive Waypoint Nodes */}
            {waypoints.map((wp, i) => {
              const isSelected = selectedWaypoint?.id === wp.id;
              return (
                <button
                  key={wp.id}
                  onClick={() => setSelectedWaypointId(wp.id)}
                  style={{
                    left: `${wp.positionX}%`,
                    top: `${wp.positionY}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`group absolute z-20 flex flex-col items-center focus:outline-none`}
                >
                  {/* Waypoint Pin */}
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold transition-transform duration-200 ${
                      isSelected
                        ? 'scale-125 bg-[#20D9F2] text-[#060B19] shadow-lg shadow-[#20D9F2]/50 ring-4 ring-[#20D9F2]/30'
                        : 'bg-[#D76B35] text-white hover:scale-110 shadow-md shadow-black'
                    }`}
                  >
                    {i + 1}
                  </div>

                  {/* Hover Tag Label */}
                  <div
                    className={`mt-1 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[9px] font-medium transition-opacity ${
                      isSelected
                        ? 'bg-black/90 text-[#20D9F2] border border-[#20D9F2]/40 opacity-100'
                        : 'bg-black/70 text-white/80 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {wp.title}
                  </div>
                </button>
              );
            })}

            {/* Map HUD Legend Overlay */}
            <div className="absolute left-3 bottom-3 flex items-center gap-3 rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 font-mono text-[10px] text-[#98A7BF] backdrop-blur-md">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#20D9F2]" /> Selected Waypoint
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#D76B35]" /> Traverse Path
              </span>
            </div>
          </div>
        </div>

        {/* Right: Selected Waypoint Dossier Panel (1 col) */}
        <div className="rounded-xl border border-white/10 bg-[#0A1021]/80 p-5 backdrop-blur-sm sm:p-6 flex flex-col justify-between space-y-4">
          {selectedWaypoint ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#D76B35]">
                  <span>WAYPOINT #{selectedWaypoint.orderIndex}</span>
                  <span className="text-[#FFB45B]">SOL {selectedWaypoint.sol}</span>
                </div>
                <h3 className="mt-1 font-heading text-lg font-bold text-white">
                  {selectedWaypoint.title}
                </h3>
              </div>

              {/* Waypoint Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2 border-y border-white/10 py-3 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-[#98A7BF]">Elevation:</div>
                  <div className="flex items-center gap-1 font-bold text-white">
                    <Mountain className="h-3.5 w-3.5 text-[#20D9F2]" />
                    {selectedWaypoint.elevationMeters} m
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#98A7BF]">Distance from Landing:</div>
                  <div className="font-bold text-[#FFB45B]">
                    {selectedWaypoint.distanceFromLandingKm} km
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-[#98A7BF] leading-relaxed">
                  {selectedWaypoint.description}
                </div>
                <div className="rounded-lg bg-white/5 p-3 text-[11px] text-[#E3A66B] leading-relaxed">
                  <span className="font-bold text-white">Scientific Significance: </span>
                  {selectedWaypoint.missionSignificance}
                </div>
              </div>

              {/* Linked Photography from this Waypoint */}
              {waypointImages.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="font-mono text-xs uppercase tracking-wider text-[#20D9F2]">
                    Documented Waypoint Captures ({waypointImages.length})
                  </div>
                  <div className="space-y-2">
                    {waypointImages.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => onOpenImage(img.id)}
                        className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#060B19]/80 p-2 cursor-pointer transition-colors hover:border-[#D76B35]/40"
                      >
                        <img
                          src={img.assetPath}
                          alt={img.title || img.caption}
                          className="h-10 w-16 rounded object-cover"
                        />
                        <div className="truncate flex-1">
                          <div className="truncate font-heading text-xs font-bold text-white">
                            {img.title || img.caption}
                          </div>
                          <div className="font-mono text-[10px] text-[#98A7BF]">
                            {img.cameraAbbreviation} // Sol {img.sol}
                          </div>
                        </div>
                        <Maximize2 className="h-3.5 w-3.5 text-[#20D9F2] shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-xs text-[#98A7BF] py-12">
              Select a waypoint on the traverse map to inspect its telemetry.
            </div>
          )}

          {/* Traverse Sequence Pills */}
          <div className="border-t border-white/10 pt-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#98A7BF] mb-2">
              All Traverse Waypoints:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {waypoints.map((wp, i) => (
                <button
                  key={wp.id}
                  onClick={() => setSelectedWaypointId(wp.id)}
                  className={`rounded px-2 py-1 font-mono text-[10px] transition-colors ${
                    selectedWaypoint?.id === wp.id
                      ? 'bg-[#20D9F2] text-[#060B19] font-bold'
                      : 'bg-white/5 text-[#98A7BF] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  #{i + 1} {wp.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
