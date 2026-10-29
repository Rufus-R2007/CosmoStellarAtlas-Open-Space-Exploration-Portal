import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { spaceService } from '../../services';
import { useAppStore } from '../../store/useAppStore';
import { Rover, RoverImage, RoverCamera, JourneyWaypoint } from '../../types';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';

import { MarsOperationsHero } from './components/hero/MarsOperationsHero';
import { RoverSelector } from './components/selector/RoverSelector';
import { RoverProfileSection } from './components/profile/RoverProfileSection';
import { SolExplorerSection } from './components/sol/SolExplorerSection';
import { RoverGallerySection } from './components/gallery/RoverGallerySection';
import { SurfaceJourneySection } from './components/journey/SurfaceJourneySection';
import { RoverComparisonLab } from './components/comparison/RoverComparisonLab';
import { ImageInspectionLabModal } from './components/inspection/ImageInspectionLabModal';

export const RoversPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Store state
  const selectedRoverId = useAppStore((state) => state.selectedRoverId);
  const setSelectedRoverId = useAppStore((state) => state.setSelectedRoverId);
  const selectedSol = useAppStore((state) => state.selectedSol);
  const setSelectedSol = useAppStore((state) => state.setSelectedSol);
  const inspectingImageId = useAppStore((state) => state.inspectingImageId);
  const setInspectingImageId = useAppStore((state) => state.setInspectingImageId);

  // Local data state
  const [rovers, setRovers] = useState<Rover[]>([]);
  const [allImages, setAllImages] = useState<RoverImage[]>([]);
  const [cameras, setCameras] = useState<RoverCamera[]>([]);
  const [waypoints, setWaypoints] = useState<JourneyWaypoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL query parameter sync (?rover=curiosity&sol=1065&img=cur-img-1)
  useEffect(() => {
    const roverParam = searchParams.get('rover');
    if (roverParam && roverParam !== selectedRoverId) {
      setSelectedRoverId(roverParam);
    }
    const solParam = searchParams.get('sol');
    if (solParam) {
      const parsedSol = parseInt(solParam, 10);
      if (!isNaN(parsedSol) && parsedSol !== selectedSol) {
        setSelectedSol(parsedSol);
      }
    }
    const imgParam = searchParams.get('img');
    if (imgParam && imgParam !== inspectingImageId) {
      setInspectingImageId(imgParam);
    }
  }, [searchParams]);

  // Load rovers and dependent data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [loadedRovers, loadedImages] = await Promise.all([
        spaceService.getRovers(),
        spaceService.getRoverImages(),
      ]);

      setRovers(loadedRovers);
      setAllImages(loadedImages);

      // Verify active rover
      const activeId = selectedRoverId || 'perseverance';
      const [loadedCameras, loadedWaypoints] = await Promise.all([
        spaceService.getRoverCameras(activeId),
        spaceService.getRoverWaypoints(activeId),
      ]);

      setCameras(loadedCameras);
      setWaypoints(loadedWaypoints);
    } catch (err: any) {
      setError(err?.message || 'Failed to load Mars rover operational telemetry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update cameras and waypoints whenever selectedRoverId changes
  useEffect(() => {
    if (!selectedRoverId) return;

    const updateRoverDetails = async () => {
      try {
        const [cams, wps] = await Promise.all([
          spaceService.getRoverCameras(selectedRoverId),
          spaceService.getRoverWaypoints(selectedRoverId),
        ]);
        setCameras(cams);
        setWaypoints(wps);
      } catch (err) {
        console.error('Failed to update rover details:', err);
      }
    };

    updateRoverDetails();

    // Update URL param
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('rover', selectedRoverId);
        if (selectedSol !== null) {
          next.set('sol', selectedSol.toString());
        } else {
          next.delete('sol');
        }
        return next;
      },
      { replace: true }
    );
  }, [selectedRoverId, selectedSol]);

  // Handle rover selection
  const handleSelectRover = (roverId: string) => {
    setSelectedRoverId(roverId);
    setSelectedSol(null);
  };

  // Active rover object
  const activeRover = useMemo(() => {
    return rovers.find((r) => r.id === selectedRoverId) || rovers[0] || null;
  }, [rovers, selectedRoverId]);

  // Images filtered for active rover
  const activeRoverImages = useMemo(() => {
    if (!activeRover) return [];
    return allImages.filter((img) => img.roverId === activeRover.id);
  }, [allImages, activeRover]);

  // Distinct sols available for active rover
  const availableSols = useMemo(() => {
    const sols = new Set<number>();
    activeRoverImages.forEach((img) => sols.add(img.sol));
    return Array.from(sols);
  }, [activeRoverImages]);

  // Inspected image object
  const inspectedImage = useMemo(() => {
    if (!inspectingImageId) return null;
    return allImages.find((img) => img.id === inspectingImageId) || null;
  }, [allImages, inspectingImageId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingState message="Connecting to Mars Surface Tele-Robotics Uplink..." />
      </div>
    );
  }

  if (error || !activeRover) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorState
          title="Telemetry Downlink Interrupted"
          message={error || 'Rover profile could not be resolved from local archive.'}
          onRetry={fetchData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-12 pb-16">
      {/* 1. Mars Surface Operations Hero */}
      <MarsOperationsHero
        rovers={rovers}
        selectedRover={activeRover}
        onSelectRover={handleSelectRover}
        totalImagesCount={allImages.length}
      />

      <div className="container mx-auto px-4 lg:px-8 space-y-16">
        {/* 2. Interactive Rover Selection Deck */}
        <RoverSelector
          rovers={rovers}
          selectedRoverId={activeRover.id}
          onSelectRover={handleSelectRover}
        />

        {/* 3. Selected Rover Profile & Specifications */}
        <RoverProfileSection rover={activeRover} />

        {/* 4. Sol Explorer */}
        <SolExplorerSection
          rover={activeRover}
          availableSols={availableSols}
          selectedSol={selectedSol}
          onSelectSol={setSelectedSol}
          roverImages={activeRoverImages}
        />

        {/* 5. Rover Camera Gallery */}
        <RoverGallerySection
          rover={activeRover}
          images={activeRoverImages}
          cameras={cameras}
          selectedSol={selectedSol}
          onOpenInspectionLab={(id) => setInspectingImageId(id)}
          onSelectSol={setSelectedSol}
        />

        {/* 6. Surface Journey Traverse Map */}
        <SurfaceJourneySection
          rover={activeRover}
          waypoints={waypoints}
          allImages={allImages}
          onOpenImage={(id) => setInspectingImageId(id)}
        />

        {/* 7. Rover Engineering Comparison Lab */}
        <RoverComparisonLab
          rovers={rovers}
          initialRoverAId={activeRover.id}
          initialRoverBId={
            activeRover.id === 'perseverance' ? 'curiosity' : 'perseverance'
          }
        />
      </div>

      {/* 8. Standout Feature: Interactive Image Inspection Lab Modal */}
      {inspectedImage && (
        <ImageInspectionLabModal
          image={inspectedImage}
          allImages={activeRoverImages.length > 0 ? activeRoverImages : allImages}
          rover={activeRover}
          isOpen={Boolean(inspectingImageId)}
          onClose={() => setInspectingImageId(null)}
          onNavigateImage={(id) => setInspectingImageId(id)}
        />
      )}
    </div>
  );
};
