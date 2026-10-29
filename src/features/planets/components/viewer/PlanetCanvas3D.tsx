import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Planet } from '../../../../types';
import { PlanetTextureGenerator } from './PlanetTextureGenerator';
import { PlanetCanvasFallback } from './PlanetCanvasFallback';

interface PlanetCanvas3DProps {
  planet: Planet;
  isRotating: boolean;
  zoomLevel: number; // 0.8 to 1.5
  quality: 'high' | 'low';
  forceFallback?: boolean;
}

export const PlanetCanvas3D: React.FC<PlanetCanvas3DProps> = ({
  planet,
  isRotating,
  zoomLevel,
  quality,
  forceFallback = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  // References to Three.js instances for dynamic updates without recreating scene
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const planetMeshRef = useRef<THREE.Mesh | null>(null);
  const ringMeshRef = useRef<THREE.Mesh | null>(null);
  const atmoMeshRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const isDraggingRef = useRef(false);
  const previousPointerXRef = useRef(0);
  const spinVelocityRef = useRef(0);

  // Check WebGL availability
  const checkWebGL = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (forceFallback || !checkWebGL()) {
      setHasWebGLError(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3.2 / zoomLevel);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: quality === 'high',
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1));
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (err) {
      console.warn('WebGL initialization failed, switching to 2D canvas fallback:', err);
      setHasWebGLError(true);
      return;
    }

    // 3. Globe Pivot Group (Axial Tilt)
    const globeGroup = new THREE.Group();
    const tiltRad = (planet.axialTiltDegrees * Math.PI) / 180;
    globeGroup.rotation.z = -tiltRad * 0.4; // Scaled for aesthetic viewing
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 4. Lights
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.4);
    sunLight.position.set(5, 2, 4);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x101b33, 0.85);
    scene.add(ambientLight);

    const rimLight = new THREE.PointLight(new THREE.Color(planet.colorHex), 1.6, 12);
    rimLight.position.set(-4, -1, 2);
    scene.add(rimLight);

    // 5. Planet Geometry & Procedural Material
    const segments = quality === 'high' ? 64 : 32;
    const geometry = new THREE.SphereGeometry(1, segments, segments);
    const texture = PlanetTextureGenerator.createTexture(planet);

    const material = new THREE.MeshPhongMaterial({
      map: texture,
      bumpScale: planet.visualConfiguration.bumpScale || 0.05,
      specular: new THREE.Color(planet.colorHex),
      shininess: planet.type === 'Gas Giant' ? 12 : 24,
      emissive: new THREE.Color(0x020611),
    });

    const planetMesh = new THREE.Mesh(geometry, material);
    globeGroup.add(planetMesh);
    planetMeshRef.current = planetMesh;

    // 6. Atmospheric Rim Halo
    if (planet.visualConfiguration.atmosphereColor) {
      const atmoGeo = new THREE.SphereGeometry(1.03, 32, 32);
      const atmoMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(planet.visualConfiguration.atmosphereColor),
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
      globeGroup.add(atmoMesh);
      atmoMeshRef.current = atmoMesh;
    }

    // 7. Planetary Rings (Saturn / Uranus)
    if (planet.visualConfiguration.hasRings) {
      const inner = planet.visualConfiguration.ringInnerRadius || 1.3;
      const outer = planet.visualConfiguration.ringOuterRadius || 2.2;
      const ringGeo = new THREE.RingGeometry(inner, outer, 64);
      const ringTex = PlanetTextureGenerator.createRingTexture(
        planet.visualConfiguration.ringColor
      );

      const ringMat = new THREE.MeshBasicMaterial({
        map: ringTex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });

      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.3;
      globeGroup.add(ringMesh);
      ringMeshRef.current = ringMesh;
    }

    // 8. Event Handlers
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      width = container.clientWidth || 500;
      height = container.clientHeight || 500;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isRotating && !isDraggingRef.current && planetMeshRef.current) {
        planetMeshRef.current.rotation.y += 0.003 + spinVelocityRef.current;
        spinVelocityRef.current *= 0.94;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // 10. Cleanup on unmount or planet switch
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);

      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [planet, quality, forceFallback, checkWebGL]);

  // Handle Zoom change smoothly
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = 3.2 / zoomLevel;
    }
  }, [zoomLevel]);

  // Pointer drag interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousPointerXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !planetMeshRef.current) return;
    const deltaX = e.clientX - previousPointerXRef.current;
    previousPointerXRef.current = e.clientX;
    spinVelocityRef.current = deltaX * 0.004;
    planetMeshRef.current.rotation.y += spinVelocityRef.current;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  if (hasWebGLError || forceFallback) {
    return (
      <PlanetCanvasFallback
        planet={planet}
        isRotating={isRotating}
        zoomLevel={zoomLevel}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      data-testid="planet-canvas-3d"
    />
  );
};

