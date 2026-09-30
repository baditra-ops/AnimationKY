/**
 * Master Architectural Experience Coordinator
 * Connects virtual camera, progressive reveal, proximity zones,
 * parallax depth, and architectural scanner.
 */

import { ParticleSystem } from './particles.js';
import { SceneController } from './sceneController.js';
import { BuildingReveal } from './buildingReveal.js';
import { ParallaxEngine } from './parallax.js';
import { ClockTowerController } from './clockTower.js';
import { ProximityZones } from './proximityZones.js';
import { ArchitecturalOverlay } from './architecturalOverlay.js';
import { ArchitecturalScanner } from './scanner.js';
import { CustomCursor } from './cursor.js';
import { audio } from './audio.js';

class ArchitecturalExperience {
  constructor() {
    this.particles = null;
    this.sceneController = null;
    this.reveal = null;
    this.parallax = null;
    this.clockTower = null;
    this.proximityZones = null;
    this.overlay = null;
    this.scanner = null;
    this.cursor = null;

    this.lightingMode = 'night';

    this.init();
  }

  init() {
    document.body.setAttribute('data-lighting', this.lightingMode);

    // 1. Initialize Particle System & Custom Cursor
    this.particles = new ParticleSystem('particle-canvas');
    this.cursor = new CustomCursor();

    // 2. Virtual Camera & Scene Controller
    this.sceneController = new SceneController();

    // 3. Architectural Overlay (Vector schematics)
    this.overlay = new ArchitecturalOverlay();

    // 4. Hero Clock Tower Controller & Campus Proximity Zones
    this.clockTower = new ClockTowerController();
    this.proximityZones = new ProximityZones();

    // 5. Parallax Depth Engine
    this.parallax = new ParallaxEngine({
      particleSystem: this.particles,
      sceneController: this.sceneController
    });

    // 6. Architectural Scanner
    this.scanner = new ArchitecturalScanner({
      clockTower: this.clockTower
    });

    // 7. Multi-Stage Building Reveal (Stages A to E + Wow Moment)
    this.reveal = new BuildingReveal({
      sceneController: this.sceneController,
      onStageChange: (stageAction) => {
        if (stageAction === 'drawCAD' && this.overlay) {
          this.overlay.drawLines();
        }
      },
      onComplete: () => {
        // Enable interactive parallax tracking and organic idle breathing
        this.parallax.enable();
        this.sceneController.enableBreathing();
      }
    });

    // 8. Bind Control Dock and Keyboard Shortcuts
    this.setupHUDControls();
    this.setupKeyboardShortcuts();

    // 9. Begin Reveal Sequence
    this.reveal.start();
  }

  setupHUDControls() {
    // Replay Reveal Button
    const btnReplay = document.getElementById('btn-replay');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        audio.playClick();
        this.parallax.disable();
        this.sceneController.disableBreathing();
        this.reveal.replay();
      });
    }

    // Trigger Architectural Scan Button
    const btnScan = document.getElementById('btn-scan');
    if (btnScan) {
      btnScan.addEventListener('click', () => {
        audio.playClick();
        this.scanner.triggerScan();
      });
    }

    // Toggle CAD Overlay Button
    const btnCad = document.getElementById('btn-cad');
    if (btnCad) {
      btnCad.addEventListener('click', () => {
        audio.playClick();
        const isVisible = this.overlay.toggleVisibility();
        btnCad.classList.toggle('active', isVisible);
      });
    }

    // Toggle Daylight / Night Ambiance Button
    const btnLighting = document.getElementById('btn-lighting');
    if (btnLighting) {
      btnLighting.addEventListener('click', () => {
        audio.playClick();
        this.lightingMode = this.lightingMode === 'night' ? 'daylight' : 'night';
        document.body.setAttribute('data-lighting', this.lightingMode);
        
        const label = btnLighting.querySelector('span');
        if (label) {
          label.textContent = this.lightingMode === 'night' ? 'NIGHT VIEW' : 'GOLDEN HOUR';
        }
      });
    }

    // Audio Synthesizer Toggle Button
    const btnAudio = document.getElementById('btn-audio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        const isSoundOn = audio.toggleMute();
        btnAudio.classList.toggle('active', isSoundOn);
        const label = btnAudio.querySelector('span');
        if (label) {
          label.textContent = isSoundOn ? 'AUDIO: ON' : 'AUDIO: MUTED';
        }
      });
    }
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.metaKey || e.ctrlKey) return;

      switch (e.key.toLowerCase()) {
        case 's':
          this.scanner.triggerScan();
          break;
        case 'r':
          this.parallax.disable();
          this.sceneController.disableBreathing();
          this.reveal.replay();
          break;
        case 'c':
          document.getElementById('btn-cad')?.click();
          break;
        case 'l':
          document.getElementById('btn-lighting')?.click();
          break;
        case 'm':
          document.getElementById('btn-audio')?.click();
          break;
      }
    });
  }
}

// Bootstrap experience
document.addEventListener('DOMContentLoaded', () => {
  window.experience = new ArchitecturalExperience();
});
