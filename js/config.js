/**
 * Central Configuration & Architecture Constants
 * IIT BHU Architectural Experience
 */

export const CONFIG = {
  // Architectural Geometry on 750x500 image aspect
  geometry: {
    aspectRatio: 1.5, // 3:2
    width: 750,
    height: 500,
    // Clock Tower Hero Anchor
    clockTower: {
      xPercent: 62.53,
      yPercent: 30.6,
      dialYPercent: 29.6,
      spireApexYPercent: 15.0,
      radiusPx: 120, // Proximity trigger threshold
    },
    // Interactive Campus Proximity Zones (Normalized 0-100%)
    zones: [
      {
        id: 'tower',
        name: 'CLOCK TOWER ROTUNDA',
        tag: 'HERITAGE SPHEROID // ELEV +34.8M',
        xMin: 55, xMax: 70, yMin: 12, yMax: 46,
        centerX: 62.5, centerY: 29.0
      },
      {
        id: 'central',
        name: 'CENTRAL FOYER & PORTICO',
        tag: 'COLONNADE ENTRANCE // LEVEL 0-2',
        xMin: 45, xMax: 65, yMin: 46, yMax: 78,
        centerX: 55.0, centerY: 62.0
      },
      {
        id: 'left_wing',
        name: 'WEST WING & LAWN',
        tag: 'ACADEMIC QUADRANGLE // BOTANICAL',
        xMin: 8, xMax: 45, yMin: 35, yMax: 88,
        centerX: 28.0, centerY: 60.0
      },
      {
        id: 'right_wing',
        name: 'EAST FACADE & LOGGIA',
        tag: 'ARCHITECTURAL VERANDA // INDO-SARACENIC',
        xMin: 68, xMax: 96, yMin: 35, yMax: 86,
        centerX: 82.0, centerY: 58.0
      }
    ]
  },

  // Parallax Depth Factors (Multipliers for pointer offset)
  parallax: {
    blueprint: 0.012,
    atmosphere: 0.024,
    facade: 0.048,
    foreground: 0.072,
    overlay: 0.092,
    tiltMaxY: 3.6, // Degrees max rotateY
    tiltMaxX: 2.8, // Degrees max rotateX
    lerpFactor: 0.075, // Smoothness coefficient
    lightLerpFactor: 0.065
  },

  // Virtual Camera & Scroll Settings
  camera: {
    minZoom: 0.98,
    maxZoom: 1.22,
    defaultZoom: 1.0,
    zoomLerpFactor: 0.08,
    // Idle subtle breathing oscillation
    breathingScaleAmp: 0.005, // 0.5% scale breathing
    breathingSpeed: 0.0009
  },

  // Reveal Sequence Timing (in milliseconds)
  timings: {
    initProgressDuration: 1400,
    stageA_Silhouette: 200,
    stageB_StructuralWipe: 1100,
    stageC_DetailSharpen: 2200,
    stageD_LightSweep: 3200,
    stageE_FullReveal: 4300,
    wowMomentStart: 5200,
    wowMomentDuration: 2600
  },

  // Particle System Parameters
  particles: {
    desktopCount: 36,
    mobileCount: 18,
    maxSpeedX: 0.22,
    maxSpeedY: 0.32
  }
};
