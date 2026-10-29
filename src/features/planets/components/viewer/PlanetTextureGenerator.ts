import * as THREE from 'three';
import { Planet } from '../../../../types';

/**
 * Creates high-fidelity, deterministic procedural textures on an HTML5 canvas.
 * Guaranteed 100% offline with zero remote assets.
 */
export class PlanetTextureGenerator {
  public static createTexture(planet: Planet): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return new THREE.CanvasTexture(canvas);
    }

    const w = canvas.width;
    const h = canvas.height;

    switch (planet.visualConfiguration.proceduralType) {
      case 'mercury':
        this.renderMercury(ctx, w, h);
        break;
      case 'venus':
        this.renderVenus(ctx, w, h);
        break;
      case 'earth':
        this.renderEarth(ctx, w, h);
        break;
      case 'mars':
        this.renderMars(ctx, w, h);
        break;
      case 'jupiter':
        this.renderJupiter(ctx, w, h);
        break;
      case 'saturn':
        this.renderSaturn(ctx, w, h);
        break;
      case 'uranus':
        this.renderUranus(ctx, w, h);
        break;
      case 'neptune':
        this.renderNeptune(ctx, w, h);
        break;
      default:
        ctx.fillStyle = planet.colorHex;
        ctx.fillRect(0, 0, w, h);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  public static createRingTexture(ringColor: string = '#CBBEFF'): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.1, ringColor ? `${ringColor}66` : 'rgba(203, 190, 255, 0.4)');
    grad.addColorStop(0.25, ringColor ? `${ringColor}dd` : 'rgba(203, 190, 255, 0.85)');
    grad.addColorStop(0.48, 'rgba(10, 15, 30, 0.1)'); // Cassini division
    grad.addColorStop(0.55, ringColor ? `${ringColor}ee` : 'rgba(203, 190, 255, 0.9)');
    grad.addColorStop(0.85, ringColor ? `${ringColor}99` : 'rgba(203, 190, 255, 0.6)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 64);

    return new THREE.CanvasTexture(canvas);
  }

  // --- Planet-specific procedural shaders on Canvas ---

  private static renderMercury(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = '#4a4d53';
    ctx.fillRect(0, 0, w, h);

    // Craters and regolith noise
    for (let i = 0; i < 400; i++) {
      const cx = Math.random() * w;
      const cy = Math.random() * h;
      const cr = Math.random() * 14 + 2;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.5 ? '#2f3136' : '#686b72';
      ctx.fill();

      // Crater rim highlight
      ctx.strokeStyle = '#858992';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  private static renderVenus(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Dense golden sulfur cloud gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#c79d47');
    grad.addColorStop(0.3, '#e5be68');
    grad.addColorStop(0.5, '#f4cf7e');
    grad.addColorStop(0.7, '#d6ab53');
    grad.addColorStop(1, '#b88c3a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Atmospheric swirls
    ctx.fillStyle = 'rgba(255, 235, 175, 0.2)';
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      const y = Math.random() * h;
      ctx.ellipse(Math.random() * w, y, Math.random() * 200 + 80, Math.random() * 15 + 5, 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private static renderEarth(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Deep Ocean
    const ocean = ctx.createLinearGradient(0, 0, 0, h);
    ocean.addColorStop(0, '#04122d');
    ocean.addColorStop(0.5, '#072458');
    ocean.addColorStop(1, '#020b1b');
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, w, h);

    // Continents
    ctx.fillStyle = '#1e523b';
    const drawLand = (cx: number, cy: number, rx: number, ry: number) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0.1, 0, Math.PI * 2);
      ctx.fill();
    };

    drawLand(w * 0.22, h * 0.38, 90, 70); // North America
    drawLand(w * 0.30, h * 0.68, 70, 95); // South America
    drawLand(w * 0.58, h * 0.35, 140, 90); // Eurasia
    drawLand(w * 0.55, h * 0.60, 80, 90); // Africa
    drawLand(w * 0.82, h * 0.70, 60, 45); // Australia

    // Polar ice caps
    ctx.fillStyle = '#ebf6fc';
    ctx.fillRect(0, 0, w, h * 0.08); // North pole
    ctx.fillRect(0, h * 0.92, w, h * 0.08); // Antarctica

    // Swirling white weather clouds
    ctx.fillStyle = 'rgba(240, 248, 255, 0.42)';
    for (let i = 0; i < 35; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * w, Math.random() * h, Math.random() * 120 + 40, Math.random() * 18 + 6, 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private static renderMars(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Rusty oxidized surface
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#b84323');
    grad.addColorStop(0.5, '#d65b33');
    grad.addColorStop(1, '#9e3419');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Dark volcanic basalt lowlands (Acidalia / Syrtis Major)
    ctx.fillStyle = '#541c10';
    ctx.beginPath();
    ctx.ellipse(w * 0.55, h * 0.52, 90, 60, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.28, h * 0.45, 120, 50, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Valles Marineris rift
    ctx.strokeStyle = '#381109';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * 0.58);
    ctx.bezierCurveTo(w * 0.35, h * 0.55, w * 0.45, h * 0.60, w * 0.50, h * 0.58);
    ctx.stroke();

    // Polar caps (CO2 dry ice)
    ctx.fillStyle = 'rgba(255, 250, 245, 0.9)';
    ctx.fillRect(0, 0, w, h * 0.05);
    ctx.fillRect(0, h * 0.94, w, h * 0.06);
  }

  private static renderJupiter(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Distinct atmospheric bands
    const bandColors = ['#a26c3c', '#d8a975', '#8f572a', '#e6caa6', '#7e471d', '#cb9e6c', '#b37745', '#deb586'];
    const bandHeight = h / bandColors.length;

    bandColors.forEach((color, idx) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, idx * bandHeight, w, bandHeight);
    });

    // Turbulent cloud whorls
    ctx.fillStyle = 'rgba(255, 235, 210, 0.25)';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * w, Math.random() * h, Math.random() * 160 + 60, Math.random() * 12 + 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Iconic Great Red Spot anticyclone
    ctx.fillStyle = '#b74026';
    ctx.beginPath();
    ctx.ellipse(w * 0.62, h * 0.68, 65, 38, -0.05, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#782613';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Red Spot core
    ctx.fillStyle = '#e85c3b';
    ctx.beginPath();
    ctx.ellipse(w * 0.62, h * 0.68, 35, 18, -0.05, 0, Math.PI * 2);
    ctx.fill();
  }

  private static renderSaturn(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Gentle golden butterscotch bands
    const bands = ['#c8a565', '#d9bd84', '#bfa05d', '#ecdab0', '#c29d55', '#d4b374'];
    const bHeight = h / bands.length;

    bands.forEach((color, idx) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, idx * bHeight, w, bHeight);
    });

    // Subtle atmospheric haze
    ctx.fillStyle = 'rgba(255, 245, 225, 0.15)';
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(0, Math.random() * h, w, Math.random() * 15 + 2);
    }
  }

  private static renderUranus(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Pale cyan-aquamarine gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#599ad4');
    grad.addColorStop(0.5, '#76bfd8');
    grad.addColorStop(1, '#4e8dbf');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle faint bands
    ctx.fillStyle = 'rgba(220, 245, 255, 0.12)';
    for (let i = 0; i < 12; i++) {
      ctx.fillRect(0, Math.random() * h, w, Math.random() * 20 + 5);
    }
  }

  private static renderNeptune(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Deep sapphire-azure
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1a3c7c');
    grad.addColorStop(0.5, '#2558aa');
    grad.addColorStop(1, '#152f63');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Great Dark Spot
    ctx.fillStyle = '#0c1d40';
    ctx.beginPath();
    ctx.ellipse(w * 0.38, h * 0.42, 50, 28, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Supersonic methane white cirrus clouds ("Scooter")
    ctx.fillStyle = 'rgba(230, 245, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(w * 0.42, h * 0.48, 40, 6, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.70, h * 0.65, 60, 8, -0.05, 0, Math.PI * 2);
    ctx.fill();
  }
}
