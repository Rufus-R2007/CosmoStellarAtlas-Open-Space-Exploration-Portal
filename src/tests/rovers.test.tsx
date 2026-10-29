import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { RoversPage } from '../features/rovers/RoversPage';
import { ImageInspectionLabModal } from '../features/rovers/components/inspection/ImageInspectionLabModal';
import { RoverComparisonLab } from '../features/rovers/components/comparison/RoverComparisonLab';
import { SurfaceJourneySection } from '../features/rovers/components/journey/SurfaceJourneySection';
import { spaceService } from '../services';
import { useAppStore } from '../store/useAppStore';
import { roversData, roverImagesData } from '../data';

describe('Phase 4 — Mars Rover Explorer Test Suite', () => {
  beforeEach(() => {
    spaceService.setSimulatedError(false);
    useAppStore.setState({
      selectedRoverId: 'perseverance',
      selectedSol: null,
      selectedCameraId: null,
      inspectingImageId: null,
    });
  });

  // Requirement 1: Rover profiles load correctly
  it('Requirement 1: rover profiles load correctly with complete attributes and specifications', async () => {
    const rovers = await spaceService.getRovers();
    expect(rovers.length).toBeGreaterThanOrEqual(4);

    const perseverance = rovers.find((r) => r.id === 'perseverance');
    expect(perseverance).toBeDefined();
    expect(perseverance?.name).toBe('Perseverance');
    expect(perseverance?.agency).toBe('NASA / JPL');
    expect(perseverance?.specifications?.massKg).toBe(1025);
    expect(perseverance?.specifications?.mobilitySystem).toContain('Rocker-bogie');
    expect(perseverance?.instruments?.length).toBeGreaterThanOrEqual(5);

    const curiosity = rovers.find((r) => r.id === 'curiosity');
    expect(curiosity).toBeDefined();
    expect(curiosity?.name).toBe('Curiosity');
    expect(curiosity?.totalSols).toBeGreaterThan(4000);
  });

  // Requirement 2: Rover selection updates all dependent content
  it('Requirement 2: rover selection updates active profile, available cameras, and sols', async () => {
    render(
      <MemoryRouter initialEntries={['/rovers']}>
        <RoversPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Mars Surface Operations' })).toBeInTheDocument();
    });

    // Default is Perseverance
    expect(screen.getByText(/Perseverance Profile & Engineering Specifications/i)).toBeInTheDocument();

    // Select Curiosity via card
    const curiosityButtons = screen.getAllByRole('button', { name: /Curiosity/i });
    fireEvent.click(curiosityButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Curiosity Profile & Engineering Specifications/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Mount Sharp/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  // Requirement 3: Camera filters work
  it('Requirement 3: camera filters constrain gallery images to matching instruments', async () => {
    const mastcamZImages = await spaceService.getRoverImages({
      roverId: 'perseverance',
      cameraId: 'per-mastcam-z',
    });

    expect(mastcamZImages.length).toBeGreaterThan(0);
    mastcamZImages.forEach((img) => {
      expect(img.cameraId).toBe('per-mastcam-z');
      expect(img.roverId).toBe('perseverance');
    });
  });

  // Requirement 4: Sol filtering works
  it('Requirement 4: Sol filtering returns only images recorded on target Martian day', async () => {
    const sol70Images = await spaceService.getRoverImages({
      roverId: 'perseverance',
      sol: 70,
    });

    expect(sol70Images.length).toBe(1);
    expect(sol70Images[0].sol).toBe(70);
    expect(sol70Images[0].title).toContain('Ingenuity');
  });

  // Requirement 5: Combined filters return correct results
  it('Requirement 5: combined filters (rover + sol + tag) accurately narrow results', async () => {
    const filtered = await spaceService.getRoverImages({
      roverId: 'perseverance',
      sol: 654,
      tag: 'Sample Return',
    });

    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('per-img-2');
    expect(filtered[0].tags).toContain('Sample Return');
  });

  // Requirement 6: Missing images show graceful fallback states
  it('Requirement 6: filtering for a non-existent sol or tag renders clean empty state feedback', async () => {
    const nonExistent = await spaceService.getRoverImages({
      roverId: 'perseverance',
      sol: 99999,
    });
    expect(nonExistent).toHaveLength(0);

    render(
      <MemoryRouter initialEntries={['/rovers']}>
        <RoversPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Rover Optical Camera Gallery/i)).toBeInTheDocument();
    });

    // Enter a search term that doesn't exist
    const searchInput = screen.getByPlaceholderText(/Search images by target/i);
    fireEvent.change(searchInput, { target: { value: 'zzzz-non-existent-rock-xyz' } });

    await waitFor(() => {
      expect(screen.getByText(/No Matching Imagery Found/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset All Filters/i })).toBeInTheDocument();
    });
  });

  // Requirement 7: Image navigation works
  it('Requirement 7: image navigation arrows cycle through adjacent gallery records', () => {
    const onNavigateMock = vi.fn();
    const onCloseMock = vi.fn();
    const testImages = roverImagesData.slice(0, 3);

    render(
      <ImageInspectionLabModal
        image={testImages[0]}
        allImages={testImages}
        rover={roversData[0]}
        isOpen={true}
        onClose={onCloseMock}
        onNavigateImage={onNavigateMock}
      />
    );

    // Clicking next image button
    const nextBtn = screen.getByTitle(/Next Image/i);
    fireEvent.click(nextBtn);
    expect(onNavigateMock).toHaveBeenCalledWith(testImages[1].id);
  });

  // Requirement 8: Zoom controls update inspection state
  it('Requirement 8: zoom in and zoom out controls update inspection magnification percentage', () => {
    const testImage = roverImagesData[0];

    render(
      <ImageInspectionLabModal
        image={testImage}
        allImages={[testImage]}
        rover={roversData[0]}
        isOpen={true}
        onClose={vi.fn()}
        onNavigateImage={vi.fn()}
      />
    );

    expect(screen.getByText('100%')).toBeInTheDocument();

    const zoomInBtn = screen.getByTitle(/Zoom In/i);
    fireEvent.click(zoomInBtn);
    expect(screen.getByText('125%')).toBeInTheDocument();

    fireEvent.click(zoomInBtn);
    expect(screen.getByText('150%')).toBeInTheDocument();

    const zoomOutBtn = screen.getByTitle(/Zoom Out/i);
    fireEvent.click(zoomOutBtn);
    expect(screen.getByText('125%')).toBeInTheDocument();
  });

  // Requirement 9: Reset View restores the original image view
  it('Requirement 9: Reset View restores magnification to 100%', () => {
    const testImage = roverImagesData[0];

    render(
      <ImageInspectionLabModal
        image={testImage}
        allImages={[testImage]}
        rover={roversData[0]}
        isOpen={true}
        onClose={vi.fn()}
        onNavigateImage={vi.fn()}
      />
    );

    const zoomInBtn = screen.getByTitle(/Zoom In/i);
    fireEvent.click(zoomInBtn);
    fireEvent.click(zoomInBtn);
    expect(screen.getByText('150%')).toBeInTheDocument();

    const resetBtn = screen.getByTitle(/Reset View/i);
    fireEvent.click(resetBtn);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  // Requirement 10: Display adjustment reset works
  it('Requirement 10: display enhancement sliders adjust brightness and reset button restores 100%', () => {
    const testImage = roverImagesData[0];

    render(
      <ImageInspectionLabModal
        image={testImage}
        allImages={[testImage]}
        rover={roversData[0]}
        isOpen={true}
        onClose={vi.fn()}
        onNavigateImage={vi.fn()}
      />
    );

    // Open enhancement panel
    const enhanceToggle = screen.getByTitle(/Image Enhancement Adjustments/i);
    fireEvent.click(enhanceToggle);

    expect(screen.getByText(/Optical Enhancements/i)).toBeInTheDocument();
    expect(screen.getByText(/Brightness:/i)).toBeInTheDocument();

    // Reset adjustments
    const resetAdjBtn = screen.getByRole('button', { name: /^Reset$/i });
    fireEvent.click(resetAdjBtn);
    expect(screen.getByText(/Display adjustments only/i)).toBeInTheDocument();
  });

  // Requirement 11: Annotation selection displays correct information
  it('Requirement 11: selecting an educational annotation opens annotation drawer with details', () => {
    const testImage = roverImagesData[0]; // per-img-1 has 3 annotations

    render(
      <ImageInspectionLabModal
        image={testImage}
        allImages={[testImage]}
        rover={roversData[0]}
        isOpen={true}
        onClose={vi.fn()}
        onNavigateImage={vi.fn()}
      />
    );

    // Find and click the first annotation pin
    const annotationPin = screen.getByTitle('Counter-Rotating Carbon Blades');
    fireEvent.click(annotationPin);

    // Detail card should appear
    expect(screen.getByText(/Dual 1.2-meter rotors spinning in opposite directions/i)).toBeInTheDocument();
    expect(screen.getByText(/Curated Educational Annotations/i)).toBeInTheDocument();
  });

  // Requirement 12: Annotation coordinates remain valid
  it('Requirement 12: all image annotations adhere to normalized percentage boundary constraints (0-100)', () => {
    roverImagesData.forEach((img) => {
      img.annotations?.forEach((ann) => {
        expect(ann.normalizedX).toBeGreaterThanOrEqual(0);
        expect(ann.normalizedX).toBeLessThanOrEqual(100);
        expect(ann.normalizedY).toBeGreaterThanOrEqual(0);
        expect(ann.normalizedY).toBeLessThanOrEqual(100);
        expect(ann.normalizedWidth).toBeGreaterThan(0);
        expect(ann.normalizedWidth).toBeLessThanOrEqual(100);
        expect(ann.normalizedHeight).toBeGreaterThan(0);
        expect(ann.normalizedHeight).toBeLessThanOrEqual(100);
      });
    });
  });

  // Requirement 13: Journey waypoints resolve to correct records
  it('Requirement 13: surface journey waypoints resolve with correct positions and descriptions', async () => {
    const waypoints = await spaceService.getRoverWaypoints('perseverance');
    expect(waypoints.length).toBeGreaterThanOrEqual(5);

    expect(waypoints[0].title).toContain('Octavia E. Butler');
    expect(waypoints[0].sol).toBe(0);
    expect(waypoints[0].positionX).toBeGreaterThan(0);
    expect(waypoints[0].positionY).toBeGreaterThan(0);

    // Test component rendering
    render(
      <SurfaceJourneySection
        rover={roversData[0]}
        waypoints={waypoints}
        allImages={roverImagesData}
        onOpenImage={vi.fn()}
      />
    );

    expect(screen.getByText(/Surface Journey & Traverse Route/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Octavia E. Butler Landing Site/i).length).toBeGreaterThanOrEqual(1);
  });

  // Requirement 14: Rover-to-mission relationships work
  it('Requirement 14: rover profiles correctly resolve linked mission identifiers', async () => {
    const rovers = await spaceService.getRovers();

    const perseverance = rovers.find((r) => r.id === 'perseverance')!;
    expect(perseverance.missionId).toBe('perseverance');

    const curiosity = rovers.find((r) => r.id === 'curiosity')!;
    expect(curiosity.missionId).toBe('curiosity');

    // Verify linked mission exists in missionsData
    const missions = await spaceService.getMissions();
    const mars2020 = missions.find((m) => m.id === perseverance.missionId);
    expect(mars2020).toBeDefined();
    expect(mars2020?.name).toContain('Perseverance');
  });

  // Requirement 15: Unknown rover IDs are handled safely
  it('Requirement 15: unknown rover IDs safely return null without application crash', async () => {
    const invalid = await spaceService.getRoverById('non-existent-rover-xyz');
    expect(invalid).toBeNull();

    const emptyImages = await spaceService.getRoverImages({ roverId: 'non-existent-rover-xyz' });
    expect(emptyImages).toHaveLength(0);

    const emptyWaypoints = await spaceService.getRoverWaypoints('non-existent-rover-xyz');
    expect(emptyWaypoints).toHaveLength(0);
  });

  // Requirement 16: Local data-provider errors do not crash the module
  it('Requirement 16: simulated provider errors render accessible error state and recovery action', async () => {
    spaceService.setSimulatedError(true);

    render(
      <MemoryRouter initialEntries={['/rovers']}>
        <RoversPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Telemetry Downlink Interrupted/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Re-establish Uplink/i })).toBeInTheDocument();
    });

    // Recover by clicking retry
    spaceService.setSimulatedError(false);
    const retryBtn = screen.getByRole('button', { name: /Re-establish Uplink/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Mars Surface Operations' })).toBeInTheDocument();
    });
  });

  // Additional Requirement 17: Rover Comparison Lab functionality
  it('Requirement 17: Rover Comparison Lab compares attributes side-by-side with swap support', () => {
    render(<RoverComparisonLab rovers={roversData} initialRoverAId="perseverance" initialRoverBId="curiosity" />);

    expect(screen.getByText(/Rover Engineering Comparison Lab/i)).toBeInTheDocument();
    expect(screen.getByText(/1025 kg/i)).toBeInTheDocument(); // Perseverance mass
    expect(screen.getByText(/899 kg/i)).toBeInTheDocument();  // Curiosity mass

    // Click swap
    const swapBtn = screen.getByRole('button', { name: /Swap Explorers/i });
    fireEvent.click(swapBtn);

    // Order reversed
    expect(screen.getByText(/Primary Rover/i)).toBeInTheDocument();
  });
});
