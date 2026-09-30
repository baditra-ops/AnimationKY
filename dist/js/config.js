/**
 * Central Configuration & Architecture Constants
 * IIT BHU Architectural Experience (Final Polish)
 */

export const CONFIG = {
  // Architectural Geometry on 750x500 image aspect
  geometry: {
    aspectRatio: 1.5, // 3:2
    width: 750,
    height: 500,
    clockTower: {
      xPercent: 62.53,
      yPercent: 30.6,
      dialYPercent: 29.6,
      spireApexYPercent: 15.0,
      radiusPx: 110,
    },
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

  // Restrained Parallax Parameters (Physically grounded, zero artificial float)
  parallax: {
    blueprint: 0.008,
    atmosphere: 0.016,
    facade: 0.038,
    foreground: 0.058,
    overlay: 0.075,
    tiltMaxY: 2.8, // Degrees max rotateY
    tiltMaxX: 2.2, // Degrees max rotateX
    lerpFactor: 0.058, // Silky smooth inertia
    lightLerpFactor: 0.055
  },

  // Virtual Camera & Scroll Parameters
  camera: {
    minZoom: 0.94,
    maxZoom: 1.22,
    defaultZoom: 1.0,
    zoomLerpFactor: 0.075,
    breathingScaleAmp: 0.0035, // 0.35% imperceptible breathing
    breathingSpeed: 0.0007
  },

  // Reveal Sequence Timing (Choreographed Progression)
  timings: {
    initProgressDuration: 1300,
    stageA_Silhouette: 200,
    stageB_StructuralWipe: 1200,
    stageC_DetailSharpen: 2400,
    stageD_LightSweep: 3600,
    stageE_FullReveal: 4800,
    wowMomentStart: 5800,
    wowMomentDuration: 2400
  },

  // Particle System Parameters
  particles: {
    desktopCount: 32,
    mobileCount: 16,
    maxSpeedX: 0.18,
    maxSpeedY: 0.28
  }
};
