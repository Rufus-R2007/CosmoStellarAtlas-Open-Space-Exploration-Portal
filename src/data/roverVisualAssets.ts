/**
 * High-Fidelity Local SVG Martian Visual Assets
 * Provides 100% offline, vector-sharp illustrative and reconstructed scientific imagery
 * for all 24 Mars Rover Explorer gallery records.
 */

interface VisualSceneConfig {
  skyGradient: [string, string];
  sunVisible?: boolean;
  sunColor?: string;
  sunRadius?: number;
  sunPos?: [number, number];
  horizonY: number;
  mountainColor: string;
  mountainColor2: string;
  groundGradient: [string, string];
  terrainStyle: 'dunes' | 'crater_rim' | 'delta_layers' | 'drill_site' | 'boulders' | 'sample_tube' | 'helicopter' | 'microscopic' | 'self_portrait' | 'solar_eclipse' | 'wheel_tread';
  focalElement?: string;
  cameraOverlay?: {
    reticle: boolean;
    scaleBar?: string;
    hudText: string;
  };
}

const scenes: Record<string, VisualSceneConfig> = {
  // Perseverance Scenes
  'per-img-1': {
    skyGradient: ['#3A1810', '#A74B2A'],
    sunVisible: true,
    sunColor: '#FFE0B2',
    sunRadius: 18,
    sunPos: [650, 120],
    horizonY: 260,
    mountainColor: '#6B2F1C',
    mountainColor2: '#8E3E26',
    groundGradient: ['#B8532F', '#571D0E'],
    terrainStyle: 'helicopter',
    focalElement: 'ingenuity',
    cameraOverlay: { reticle: true, scaleBar: '1.2 m rotor span', hudText: 'SOL 070 // MASTCAM-Z R-EYE // AZ: 214° EL: -12°' },
  },
  'per-img-2': {
    skyGradient: ['#2E150F', '#7F361E'],
    horizonY: 180,
    mountainColor: '#4E2114',
    mountainColor2: '#682C1B',
    groundGradient: ['#A04526', '#49180B'],
    terrainStyle: 'sample_tube',
    focalElement: 'titanium_tube',
    cameraOverlay: { reticle: true, scaleBar: '15 cm tube', hudText: 'SOL 654 // WATSON // THREE FORKS SAMPLE CACHE' },
  },
  'per-img-3': {
    skyGradient: ['#1C100C', '#4A1D13'],
    horizonY: 80,
    mountainColor: '#2B130D',
    mountainColor2: '#3D1B13',
    groundGradient: ['#6B2D19', '#38140B'],
    terrainStyle: 'microscopic',
    focalElement: 'pixl_abrasion',
    cameraOverlay: { reticle: true, scaleBar: '5 mm circular abrasion', hudText: 'SOL 198 // PIXL MCC // TARGET: BELLEGARDE' },
  },
  'per-img-4': {
    skyGradient: ['#38150D', '#9A4123'],
    sunVisible: true,
    sunColor: '#FFD4A3',
    sunRadius: 14,
    sunPos: [150, 90],
    horizonY: 220,
    mountainColor: '#5C2212',
    mountainColor2: '#7D331C',
    groundGradient: ['#A94726', '#521D0E'],
    terrainStyle: 'delta_layers',
    focalElement: 'kodiak_mesa',
    cameraOverlay: { reticle: true, scaleBar: '50 m scarp height', hudText: 'SOL 433 // SUPERCAM RMI // KODIAK BUTTE DELTA' },
  },
  'per-img-5': {
    skyGradient: ['#3F1B12', '#AF4D2B'],
    horizonY: 250,
    mountainColor: '#6B2B18',
    mountainColor2: '#8E3C23',
    groundGradient: ['#BA542E', '#5B1E0E'],
    terrainStyle: 'dunes',
    focalElement: 'navcam_horizon',
    cameraOverlay: { reticle: true, scaleBar: 'FOV: 96°', hudText: 'SOL 002 // NAVCAM LEFT // JEZERO TOUCHDOWN PANORAMA' },
  },
  'per-img-6': {
    skyGradient: ['#0A060A', '#2D1418'],
    sunVisible: true,
    sunColor: '#FFF3DB',
    sunRadius: 65,
    sunPos: [400, 225],
    horizonY: 450,
    mountainColor: '#17090D',
    mountainColor2: '#1F0C12',
    groundGradient: ['#2F1117', '#15060A'],
    terrainStyle: 'solar_eclipse',
    focalElement: 'phobos_silhouette',
    cameraOverlay: { reticle: true, scaleBar: 'Solar Transit 35s', hudText: 'SOL 740 // MASTCAM-Z SOLAR FILTER // PHOBOS TRANSIT' },
  },

  // Curiosity Scenes
  'cur-img-1': {
    skyGradient: ['#3A1911', '#984224'],
    horizonY: 210,
    mountainColor: '#5C2413',
    mountainColor2: '#7B331C',
    groundGradient: ['#A24424', '#511B0C'],
    terrainStyle: 'self_portrait',
    focalElement: 'curiosity_mast',
    cameraOverlay: { reticle: true, scaleBar: 'Self-Portrait Mosaic', hudText: 'SOL 1065 // MAHLI // DRILL TARGET: BUCKSKIN' },
  },
  'cur-img-2': {
    skyGradient: ['#35160E', '#8F3D21'],
    horizonY: 230,
    mountainColor: '#552011',
    mountainColor2: '#73301B',
    groundGradient: ['#9D4223', '#4B180B'],
    terrainStyle: 'delta_layers',
    focalElement: 'mount_sharp',
    cameraOverlay: { reticle: true, scaleBar: '5.5 km peak elevation', hudText: 'SOL 3260 // MASTCAM 100MM // MOUNT SHARP SULFATES' },
  },
  'cur-img-3': {
    skyGradient: ['#28120B', '#6F2C17'],
    horizonY: 150,
    mountainColor: '#43190C',
    mountainColor2: '#5F2413',
    groundGradient: ['#86361B', '#3E1308'],
    terrainStyle: 'boulders',
    focalElement: 'chemcam_rock',
    cameraOverlay: { reticle: true, scaleBar: '25 cm boulder', hudText: 'SOL 012 // CHEMCAM RMI // TARGET: CORONATION' },
  },
  'cur-img-4': {
    skyGradient: ['#3D1912', '#A24526'],
    sunVisible: true,
    sunColor: '#FFE4C4',
    sunRadius: 16,
    sunPos: [200, 100],
    horizonY: 250,
    mountainColor: '#632514',
    mountainColor2: '#85351E',
    groundGradient: ['#AC4928', '#541C0C'],
    terrainStyle: 'dunes',
    focalElement: 'dingo_gap',
    cameraOverlay: { reticle: true, scaleBar: '1 m ripple crest', hudText: 'SOL 582 // MASTCAM 34MM // DINGO GAP DUNE PASSAGE' },
  },
  'cur-img-5': {
    skyGradient: ['#12182B', '#445D7E'],
    sunVisible: true,
    sunColor: '#BEE3FF',
    sunRadius: 28,
    sunPos: [400, 240],
    horizonY: 260,
    mountainColor: '#172238',
    mountainColor2: '#233454',
    groundGradient: ['#4E3632', '#211718'],
    terrainStyle: 'crater_rim',
    focalElement: 'blue_sunset',
    cameraOverlay: { reticle: true, scaleBar: 'Rayleigh Scattering', hudText: 'SOL 956 // MASTCAM // BLUE TWILIGHT SUNSET' },
  },
  'cur-img-6': {
    skyGradient: ['#28120D', '#6E2C18'],
    horizonY: 120,
    mountainColor: '#3F170B',
    mountainColor2: '#5A2211',
    groundGradient: ['#7D341B', '#3A1308'],
    terrainStyle: 'wheel_tread',
    focalElement: 'rover_wheel',
    cameraOverlay: { reticle: true, scaleBar: '50 cm wheel diameter', hudText: 'SOL 711 // MAHLI // ALUMINUM WHEEL TREAD SURVEY' },
  },

  // Opportunity Scenes
  'opp-img-1': {
    skyGradient: ['#1D0E09', '#4E2114'],
    horizonY: 70,
    mountainColor: '#2B120B',
    mountainColor2: '#3D1910',
    groundGradient: ['#692B17', '#341208'],
    terrainStyle: 'microscopic',
    focalElement: 'blueberries',
    cameraOverlay: { reticle: true, scaleBar: '1 to 3 mm spherules', hudText: 'SOL 048 // MICROSCOPIC IMAGER // HEMATITE BLUEBERRIES' },
  },
  'opp-img-2': {
    skyGradient: ['#36160F', '#933E22'],
    sunVisible: true,
    sunColor: '#FFDDB3',
    sunRadius: 15,
    sunPos: [600, 110],
    horizonY: 240,
    mountainColor: '#592212',
    mountainColor2: '#79321D',
    groundGradient: ['#A04424', '#4E1B0D'],
    terrainStyle: 'crater_rim',
    focalElement: 'victoria_cliffs',
    cameraOverlay: { reticle: true, scaleBar: '750 m crater diameter', hudText: 'SOL 954 // PANCAM // VICTORIA CRATER DUCK BAY' },
  },
  'opp-img-3': {
    skyGradient: ['#3A1810', '#9E4426'],
    horizonY: 230,
    mountainColor: '#602514',
    mountainColor2: '#80341D',
    groundGradient: ['#A74727', '#501B0C'],
    terrainStyle: 'dunes',
    focalElement: 'endurance_dunes',
    cameraOverlay: { reticle: true, scaleBar: '130 m crater depth', hudText: 'SOL 180 // PANCAM L2-L7 // ENDURANCE CRATER INTERIOR' },
  },
  'opp-img-4': {
    skyGradient: ['#33150D', '#8C3B1F'],
    horizonY: 220,
    mountainColor: '#531E10',
    mountainColor2: '#712C18',
    groundGradient: ['#994122', '#49190B'],
    terrainStyle: 'boulders',
    focalElement: 'santa_maria_blocks',
    cameraOverlay: { reticle: true, scaleBar: '90 m crater rim', hudText: 'SOL 1167 // PANCAM // SANTA MARIA IMPACT EXPOSURE' },
  },
  'opp-img-5': {
    skyGradient: ['#31140D', '#84371D'],
    horizonY: 210,
    mountainColor: '#4E1C0E',
    mountainColor2: '#6B2716',
    groundGradient: ['#903C1F', '#45170B'],
    terrainStyle: 'delta_layers',
    focalElement: 'matijevic_strata',
    cameraOverlay: { reticle: true, scaleBar: 'Smectite clay layers', hudText: 'SOL 2888 // PANCAM // CAPE YORK MATIJEVIC BASIN' },
  },
  'opp-img-6': {
    skyGradient: ['#200D08', '#4E1D11'],
    horizonY: 240,
    mountainColor: '#301108',
    mountainColor2: '#41170C',
    groundGradient: ['#592211', '#280D06'],
    terrainStyle: 'crater_rim',
    focalElement: 'dust_storm',
    cameraOverlay: { reticle: true, scaleBar: 'Optical Depth Tau > 10.8', hudText: 'SOL 5111 // PANCAM // GLOBAL DUST STORM HORIZON' },
  },

  // Spirit Scenes
  'spi-img-1': {
    skyGradient: ['#1E0F0A', '#512215'],
    horizonY: 80,
    mountainColor: '#2D130C',
    mountainColor2: '#401A11',
    groundGradient: ['#6D2D18', '#361309'],
    terrainStyle: 'microscopic',
    focalElement: 'humphrey_rock',
    cameraOverlay: { reticle: true, scaleBar: '2 mm grinding depth', hudText: 'SOL 084 // MICROSCOPIC IMAGER // RAT TARGET: HUMPHREY' },
  },
  'spi-img-2': {
    skyGradient: ['#381710', '#994225'],
    sunVisible: true,
    sunColor: '#FFE0B8',
    sunRadius: 16,
    sunPos: [650, 100],
    horizonY: 270,
    mountainColor: '#5C2313',
    mountainColor2: '#7D321D',
    groundGradient: ['#A24525', '#4F1B0D'],
    terrainStyle: 'crater_rim',
    focalElement: 'husband_hill',
    cameraOverlay: { reticle: true, scaleBar: '107 m summit elevation', hudText: 'SOL 586 // PANCAM // HUSBAND HILL SUMMIT PANORAMA' },
  },
  'spi-img-3': {
    skyGradient: ['#35160F', '#923E22'],
    horizonY: 240,
    mountainColor: '#582112',
    mountainColor2: '#77301B',
    groundGradient: ['#9E4324', '#4C1A0C'],
    terrainStyle: 'dunes',
    focalElement: 'dust_devil',
    cameraOverlay: { reticle: true, scaleBar: 'Vortex height ~800 m', hudText: 'SOL 774 // NAVCAM // GUSEV CRATER DUST DEVILS' },
  },
  'spi-img-4': {
    skyGradient: ['#2F130C', '#7F351C'],
    horizonY: 170,
    mountainColor: '#4A1A0D',
    mountainColor2: '#672514',
    groundGradient: ['#8D3B1E', '#42160A'],
    terrainStyle: 'boulders',
    focalElement: 'home_plate_silica',
    cameraOverlay: { reticle: true, scaleBar: '91% SiO2 trench', hudText: 'SOL 1150 // PANCAM // HOME PLATE OPALINE SILICA' },
  },

  // Sojourner Scenes
  'soj-img-1': {
    skyGradient: ['#2B120B', '#76311A'],
    horizonY: 160,
    mountainColor: '#42180C',
    mountainColor2: '#5D2213',
    groundGradient: ['#82371D', '#3D1409'],
    terrainStyle: 'boulders',
    focalElement: 'yogi_rock',
    cameraOverlay: { reticle: true, scaleBar: '1.5 m boulder height', hudText: 'SOL 022 // APXS CAMERA // ARES VALLIS YOGI CONTACT' },
  },
  'soj-img-2': {
    skyGradient: ['#361710', '#954024'],
    sunVisible: true,
    sunColor: '#FFE0BE',
    sunRadius: 14,
    sunPos: [250, 110],
    horizonY: 230,
    mountainColor: '#5A2313',
    mountainColor2: '#7B321D',
    groundGradient: ['#A24526', '#4E1B0D'],
    terrainStyle: 'boulders',
    focalElement: 'carl_sagan_station',
    cameraOverlay: { reticle: true, scaleBar: 'Pathfinder Lander Base', hudText: 'SOL 030 // IMP/NAVCAM // CARL SAGAN MEMORIAL STATION' },
  },
};

/**
 * Generates an optimized, high-fidelity standalone SVG data URI for any registered scene.
 */
export function generateRoverSvg(imageId: string): string {
  const config = scenes[imageId] || scenes['per-img-1'];
  const w = 800;
  const h = 450;

  // Build focal element SVG
  let focalSvg = '';
  switch (config.focalElement) {
    case 'ingenuity':
      focalSvg = `
        <!-- Ingenuity Helicopter -->
        <g transform="translate(360, 220)">
          <!-- Landing legs -->
          <line x1="20" y1="90" x2="-20" y2="150" stroke="#222" stroke-width="4" stroke-linecap="round"/>
          <line x1="60" y1="90" x2="100" y2="150" stroke="#222" stroke-width="4" stroke-linecap="round"/>
          <line x1="40" y1="90" x2="40" y2="152" stroke="#111" stroke-width="3"/>
          <circle cx="-20" cy="150" r="5" fill="#C49B5B"/>
          <circle cx="100" cy="150" r="5" fill="#C49B5B"/>
          <!-- Fuselage cube -->
          <rect x="20" y="70" width="40" height="35" rx="3" fill="#D4AF37" stroke="#111" stroke-width="2"/>
          <rect x="26" y="76" width="28" height="12" fill="#222"/>
          <!-- Mast and Rotor Hub -->
          <line x1="40" y1="70" x2="40" y2="20" stroke="#333" stroke-width="4"/>
          <!-- Lower rotor -->
          <ellipse cx="40" cy="45" rx="100" ry="8" fill="#1A1A1A" opacity="0.85"/>
          <line x1="-50" y1="46" x2="130" y2="44" stroke="#444" stroke-width="3"/>
          <!-- Upper rotor -->
          <ellipse cx="40" cy="25" rx="98" ry="7" fill="#1A1A1A" opacity="0.85"/>
          <line x1="-48" y1="24" x2="128" y2="26" stroke="#444" stroke-width="3"/>
          <!-- Solar panel topper -->
          <rect x="24" y="8" width="32" height="10" rx="1" fill="#1E2B45" stroke="#4A6572" stroke-width="1.5"/>
          <!-- Ground shadow -->
          <ellipse cx="40" cy="155" rx="65" ry="12" fill="#150604" opacity="0.6"/>
        </g>
      `;
      break;

    case 'titanium_tube':
      focalSvg = `
        <!-- Titanium Sample Tube on Three Forks Ground -->
        <g transform="translate(320, 260)">
          <!-- Ground shadow -->
          <ellipse cx="80" cy="55" rx="90" ry="14" fill="#1E0704" opacity="0.7"/>
          <!-- Titanium cylindrical body -->
          <rect x="10" y="32" width="140" height="26" rx="6" fill="url(#titaniumGrad)" stroke="#666" stroke-width="1.5"/>
          <!-- Serial barcode stripes -->
          <line x1="35" y1="34" x2="35" y2="56" stroke="#111" stroke-width="2"/>
          <line x1="42" y1="34" x2="42" y2="56" stroke="#111" stroke-width="3"/>
          <line x1="48" y1="34" x2="48" y2="56" stroke="#111" stroke-width="1"/>
          <line x1="55" y1="34" x2="55" y2="56" stroke="#111" stroke-width="2"/>
          <line x1="120" y1="34" x2="120" y2="56" stroke="#D32F2F" stroke-width="3"/>
          <!-- Flat end cap & grab ring -->
          <ellipse cx="10" cy="45" rx="6" ry="13" fill="#D4AF37" stroke="#333" stroke-width="1"/>
          <ellipse cx="150" cy="45" rx="6" ry="13" fill="#B0BEC5" stroke="#333" stroke-width="1.5"/>
          <circle cx="154" cy="45" r="4" fill="#37474F"/>
        </g>
      `;
      break;

    case 'pixl_abrasion':
      focalSvg = `
        <!-- Microscopic rock abrasion & laser spots -->
        <g transform="translate(250, 120)">
          <!-- Abraded rock circular patch -->
          <circle cx="150" cy="120" r="105" fill="#5A2518" stroke="#8E3C27" stroke-width="6"/>
          <circle cx="150" cy="120" r="95" fill="url(#abrasionTexture)" opacity="0.9"/>
          <!-- PIXL sub-millimeter scanned grid lines -->
          <path d="M 90,80 L 210,80 M 90,120 L 210,120 M 90,160 L 210,160" stroke="#00E5FF" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.7"/>
          <path d="M 110,60 L 110,180 M 150,60 L 150,180 M 190,60 L 190,180" stroke="#00E5FF" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.7"/>
          <!-- Mineral crystals & elemental spots -->
          <circle cx="130" cy="100" r="6" fill="#FF5252" opacity="0.8"/>
          <circle cx="165" cy="115" r="8" fill="#FFD700" opacity="0.8"/>
          <circle cx="145" cy="140" r="7" fill="#69F0AE" opacity="0.8"/>
          <circle cx="175" cy="90" r="5" fill="#448AFF" opacity="0.8"/>
        </g>
      `;
      break;

    case 'blueberries':
      focalSvg = `
        <!-- Hematite spherules (Martian Blueberries) -->
        <g transform="translate(180, 80)">
          <!-- Rock matrix backdrop -->
          <rect x="0" y="0" width="440" height="300" rx="10" fill="#632B1C"/>
          <ellipse cx="220" cy="150" rx="200" ry="130" fill="url(#rockVeinGrad)" opacity="0.7"/>
          <!-- Embedded Blueberries -->
          <circle cx="120" cy="90" r="22" fill="#29394A" stroke="#121820" stroke-width="2"/>
          <circle cx="114" cy="84" r="5" fill="#5F7D9E" opacity="0.7"/>
          
          <circle cx="210" cy="70" r="26" fill="#243343" stroke="#121820" stroke-width="2"/>
          <circle cx="202" cy="62" r="6" fill="#5F7D9E" opacity="0.7"/>

          <circle cx="310" cy="110" r="20" fill="#2B3C4E" stroke="#121820" stroke-width="2"/>
          <circle cx="304" cy="104" r="4" fill="#5F7D9E" opacity="0.7"/>

          <circle cx="160" cy="180" r="30" fill="#212F3D" stroke="#0E161C" stroke-width="3"/>
          <circle cx="150" cy="170" r="8" fill="#6C8DAE" opacity="0.8"/>

          <circle cx="280" cy="200" r="24" fill="#253545" stroke="#121820" stroke-width="2"/>
          <circle cx="272" cy="192" r="6" fill="#5F7D9E" opacity="0.7"/>

          <circle cx="220" cy="235" r="18" fill="#29394A" stroke="#121820" stroke-width="2"/>
        </g>
      `;
      break;

    case 'solar_eclipse':
      focalSvg = `
        <!-- Phobos Transit Across the Sun -->
        <g transform="translate(380, 200)">
          <!-- Irregular potato-shaped silhouette of Phobos -->
          <path d="M -15,-20 C 5,-28 28,-18 35,-5 C 42,10 32,32 15,35 C -5,38 -25,28 -30,10 C -35,-5 -25,-15 -15,-20 Z" fill="#000" stroke="#111" stroke-width="1.5"/>
        </g>
      `;
      break;

    case 'rover_wheel':
      focalSvg = `
        <!-- High-res wheel tread inspection -->
        <g transform="translate(240, 90)">
          <!-- Black wheel hub & outer cylindrical rim -->
          <circle cx="160" cy="150" r="130" fill="#111" stroke="#444" stroke-width="4"/>
          <circle cx="160" cy="150" r="105" fill="#222" stroke="#555" stroke-width="3"/>
          <circle cx="160" cy="150" r="60" fill="#1A1A1A" stroke="#C49B5B" stroke-width="4"/>
          <!-- Chevron cleats -->
          <path d="M 60,110 L 160,80 L 260,110" stroke="#888" stroke-width="6" fill="none"/>
          <path d="M 50,150 L 160,120 L 270,150" stroke="#888" stroke-width="6" fill="none"/>
          <path d="M 60,190 L 160,160 L 260,190" stroke="#888" stroke-width="6" fill="none"/>
          <!-- Punctured wear tear (famous curiosity wheel fatigue) -->
          <ellipse cx="140" cy="100" rx="14" ry="7" fill="#000" stroke="#C5A059" stroke-width="1.5"/>
        </g>
      `;
      break;

    case 'curiosity_mast':
      focalSvg = `
        <!-- Curiosity Mast & Remote Sensing Assembly -->
        <g transform="translate(330, 110)">
          <!-- Neck & Mast strut -->
          <rect x="60" y="80" width="16" height="160" fill="#2B2B2B" stroke="#111" stroke-width="2"/>
          <line x1="45" y1="130" x2="60" y2="100" stroke="#444" stroke-width="4"/>
          <line x1="90" y1="130" x2="75" y2="100" stroke="#444" stroke-width="4"/>
          <!-- Mast head enclosure -->
          <rect x="25" y="30" width="85" height="55" rx="5" fill="#E0E0E0" stroke="#333" stroke-width="2"/>
          <!-- ChemCam optical aperture (large circular window) -->
          <circle cx="50" cy="55" r="16" fill="#0D1B2A" stroke="#C49B5B" stroke-width="2.5"/>
          <circle cx="50" cy="55" r="6" fill="#1B3B6F"/>
          <!-- Mastcam Right eye (100mm telephoto) -->
          <circle cx="85" cy="45" r="11" fill="#152238" stroke="#444" stroke-width="2"/>
          <!-- Mastcam Left eye (34mm wide) -->
          <circle cx="85" cy="68" r="9" fill="#152238" stroke="#444" stroke-width="2"/>
        </g>
      `;
      break;

    case 'dust_devil':
      focalSvg = `
        <!-- Dust devil swirling vortex column -->
        <g transform="translate(420, 120)">
          <path d="M 20,160 C 15,100 60,40 50,0 C 70,30 45,90 35,160 Z" fill="#FFE0B2" opacity="0.35"/>
          <path d="M 25,160 C 22,110 52,60 45,10 C 60,40 40,100 32,160 Z" fill="#FFF3E0" opacity="0.45"/>
        </g>
      `;
      break;

    default:
      focalSvg = `
        <!-- Geologic Boulder Field -->
        <g transform="translate(280, 220)">
          <ellipse cx="60" cy="80" rx="90" ry="25" fill="#1E0704" opacity="0.6"/>
          <path d="M 0,70 Q 30,10 70,15 Q 110,20 120,60 Q 80,95 20,85 Z" fill="#8C3D26" stroke="#4F1D11" stroke-width="3"/>
          <path d="M 40,40 L 70,25 L 90,50" stroke="#C26A4A" stroke-width="2" fill="none" opacity="0.8"/>
          <!-- Small pebbles -->
          <circle cx="-30" cy="85" r="8" fill="#7A331E"/>
          <circle cx="160" cy="90" r="12" fill="#702F1B"/>
        </g>
      `;
      break;
  }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${config.skyGradient[0]}"/>
          <stop offset="100%" stop-color="${config.skyGradient[1]}"/>
        </linearGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${config.groundGradient[0]}"/>
          <stop offset="100%" stop-color="${config.groundGradient[1]}"/>
        </linearGradient>
        <linearGradient id="titaniumGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#9E9E9E"/>
          <stop offset="50%" stop-color="#FAFAFA"/>
          <stop offset="100%" stop-color="#757575"/>
        </linearGradient>
        <linearGradient id="rockVeinGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#803522"/>
          <stop offset="100%" stop-color="#4E1F14"/>
        </linearGradient>
        <pattern id="abrasionTexture" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="2" fill="#3D170F"/>
          <circle cx="15" cy="15" r="1.5" fill="#752D1C"/>
        </pattern>
      </defs>

      <!-- Sky Background -->
      <rect width="${w}" height="${config.horizonY}" fill="url(#skyGrad)"/>

      <!-- Sun (if visible) -->
      ${config.sunVisible && config.sunPos ? `
        <circle cx="${config.sunPos[0]}" cy="${config.sunPos[1]}" r="${config.sunRadius || 20}" fill="${config.sunColor || '#FFF'}"/>
        <circle cx="${config.sunPos[0]}" cy="${config.sunPos[1]}" r="${(config.sunRadius || 20) * 2.2}" fill="${config.sunColor || '#FFF'}" opacity="0.25"/>
      ` : ''}

      <!-- Distant Crater Rim / Mountain Peaks -->
      <path d="M 0,${config.horizonY} L 0,${config.horizonY - 45} Q 150,${config.horizonY - 75} 320,${config.horizonY - 35} T 600,${config.horizonY - 60} T ${w},${config.horizonY - 20} L ${w},${config.horizonY} Z" fill="${config.mountainColor}"/>
      <path d="M 0,${config.horizonY} L 0,${config.horizonY - 20} Q 200,${config.horizonY - 40} 450,${config.horizonY - 15} T ${w},${config.horizonY - 30} L ${w},${config.horizonY} Z" fill="${config.mountainColor2}" opacity="0.8"/>

      <!-- Martian Surface Ground -->
      <rect y="${config.horizonY}" width="${w}" height="${h - config.horizonY}" fill="url(#groundGrad)"/>

      <!-- Topographic Strata & Sand Ripples -->
      <path d="M 0,${config.horizonY + 30} Q 200,${config.horizonY + 15} 400,${config.horizonY + 35} T ${w},${config.horizonY + 25}" stroke="#C6623F" stroke-width="3" fill="none" opacity="0.6"/>
      <path d="M 0,${config.horizonY + 70} Q 250,${config.horizonY + 55} 500,${config.horizonY + 75} T ${w},${config.horizonY + 65}" stroke="#B85532" stroke-width="4" fill="none" opacity="0.5"/>
      <path d="M 0,${config.horizonY + 120} Q 180,${config.horizonY + 105} 450,${config.horizonY + 130} T ${w},${config.horizonY + 115}" stroke="#9C4023" stroke-width="5" fill="none" opacity="0.4"/>

      <!-- Focal Scene Artwork -->
      ${focalSvg}

      <!-- Optical Reticle / HUD Overlay -->
      ${config.cameraOverlay?.reticle ? `
        <g stroke="#20D9F2" stroke-width="1" opacity="0.4">
          <!-- Crosshairs -->
          <line x1="${w / 2 - 30}" y1="${h / 2}" x2="${w / 2 - 10}" y2="${h / 2}"/>
          <line x1="${w / 2 + 10}" y1="${h / 2}" x2="${w / 2 + 30}" y2="${h / 2}"/>
          <line x1="${w / 2}" y1="${h / 2 - 30}" x2="${w / 2}" y2="${h / 2 - 10}"/>
          <line x1="${w / 2}" y1="${h / 2 + 10}" x2="${w / 2}" y2="${h / 2 + 30}"/>
          <circle cx="${w / 2}" cy="${h / 2}" r="4" fill="none"/>
          <!-- Corner brackets -->
          <path d="M 40,55 L 40,40 L 55,40" fill="none"/>
          <path d="M ${w - 40},55 L ${w - 40},40 L ${w - 55},40" fill="none"/>
          <path d="M 40,${h - 55} L 40,${h - 40} L 55,${h - 40}" fill="none"/>
          <path d="M ${w - 40},${h - 55} L ${w - 40},${h - 40} L ${w - 55},${h - 40}" fill="none"/>
        </g>
      ` : ''}

      <!-- Telemetry Data Overlay Bar -->
      <rect x="0" y="${h - 32}" width="${w}" height="32" fill="#060B19" opacity="0.85"/>
      <text x="24" y="${h - 12}" fill="#20D9F2" font-family="monospace" font-size="11" letter-spacing="1">
        ${config.cameraOverlay?.hudText || 'MARS SURFACE TELEMETRY'}
      </text>
      ${config.cameraOverlay?.scaleBar ? `
        <text x="${w - 24}" y="${h - 12}" text-anchor="end" fill="#FFB45B" font-family="monospace" font-size="11" letter-spacing="0.5">
          SCALE: ${config.cameraOverlay.scaleBar}
        </text>
      ` : ''}
    </svg>
  `.trim();

  // Convert to clean URI
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
}
