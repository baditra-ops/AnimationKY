/**
 * Multi-Stage Building Reveal & Wow Moment Choreographer
 * Orchestrates Stages A through E, active virtual camera flight,
 * and the climactic Wow Moment.
 */

import { CONFIG } from './config.js';
import { audio } from './audio.js';

export class BuildingReveal {
  constructor(options = {}) {
    this.initScreen = document.getElementById('init-screen');
    this.progressBar = document.getElementById('init-progress-fill');
    this.statusText = document.getElementById('init-status-text');
    this.percentText = document.getElementById('init-percent-text');
    this.stageContainer = document.getElementById('stage-container');
    this.lightSweep = document.getElementById('reveal-light-sweep');
    this.hudStatus = document.getElementById('hud-status-label');
    this.explorePrompt = document.getElementById('explore-prompt');
    this.sceneController = options.sceneController || null;
    
    this.onStageChange = options.onStageChange || (() => {});
    this.onComplete = options.onComplete || (() => {});

    this.currentStage = '0';
    this.timeouts = [];
  }

  start() {
    this.clearTimeouts();
    if (this.sceneController) {
      this.sceneController.setState('INTRO');
    }

    this.runProgress(() => {
      // Transition out of init screen
      this.initScreen.classList.add('hidden');
      audio.playBootChime();

      if (this.sceneController) {
        this.sceneController.setState('REVEAL');
      }

      // Stage A — Silhouette (Camera Distant: 0.84x)
      this.schedule(() => {
        this.setStage('a', 'STAGE A // SILHOUETTE');
        if (this.sceneController) {
          this.sceneController.setRevealCamera(0.84, 22, 0);
        }
      }, 200);

      // Stage B — Structural Reveal (Camera Approaches: 0.93x, Directional Wipe)
      this.schedule(() => {
        this.setStage('b', 'STAGE B // STRUCTURAL REVEAL');
        if (this.sceneController) {
          this.sceneController.setRevealCamera(0.93, 12, 0);
        }
      }, 1200);

      // Stage C — Detail Sharpness (Camera at 1.02x, Contours & SVG CAD self-draw)
      this.schedule(() => {
        this.setStage('c', 'STAGE C // ARCHITECTURAL CONTOURS');
        if (this.sceneController) {
          this.sceneController.setRevealCamera(1.02, 5, -6);
        }
        this.onStageChange('drawCAD');
      }, 2400);

      // Stage D — Clock Tower Hero Focus (Camera pans to Clock Tower: 1.06x)
      this.schedule(() => {
        this.setStage('d', 'STAGE D // ARCHITECTURAL LIGHT SWEEP');
        if (this.sceneController) {
          this.sceneController.setRevealCamera(1.06, 2, -14);
        }
        this.triggerLightSweep();
        audio.playTowerBeacon();
      }, 3600);

      // Stage E — Full Natural Reveal (Camera centers smoothly to 1.0x)
      this.schedule(() => {
        this.setStage('e', 'STAGE E // FULL ARCHITECTURAL REVEAL');
        if (this.sceneController) {
          this.sceneController.setRevealCamera(1.0, 0, 0);
        }
      }, 4800);

      // The "WOW MOMENT" (Stage F)
      this.schedule(() => {
        this.triggerWowMoment();
      }, 5800);
    });
  }

  setStage(stageLetter, statusLabel) {
    this.currentStage = stageLetter;
    
    this.stageContainer.classList.remove(
      'reveal-stage-a',
      'reveal-stage-b',
      'reveal-stage-c',
      'reveal-stage-d',
      'reveal-stage-e'
    );
    
    this.stageContainer.classList.add(`reveal-stage-${stageLetter}`);

    if (this.hudStatus) {
      this.hudStatus.textContent = statusLabel;
    }
  }

  triggerLightSweep() {
    if (!this.lightSweep) return;
    this.lightSweep.classList.remove('active');
    void this.lightSweep.offsetWidth;
    this.lightSweep.classList.add('active');
  }

  triggerWowMoment() {
    if (!this.stageContainer) return;
    
    if (this.sceneController) {
      this.sceneController.setState('WOW_MOMENT');
      this.sceneController.setRevealCamera(1.01, 0, 0);
    }

    this.stageContainer.classList.add('wow-moment');
    if (this.hudStatus) {
      this.hudStatus.textContent = 'HERITAGE ACTIVE // SYSTEM ONLINE';
    }

    // Play elegant harmonic audio chord
    audio.playWowChord();

    // Settle into full interactive state
    this.schedule(() => {
      this.stageContainer.classList.remove('wow-moment');
      if (this.sceneController) {
        this.sceneController.setState('INTERACTIVE');
      }
      if (this.explorePrompt) {
        this.explorePrompt.classList.add('visible');
      }
      this.onComplete();
    }, 2400);
  }

  runProgress(callback) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 9) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (this.progressBar) this.progressBar.style.width = '100%';
        if (this.percentText) this.percentText.textContent = '100%';
        if (this.statusText) this.statusText.textContent = 'SYSTEM ONLINE';
        setTimeout(callback, 220);
        return;
      }

      if (this.progressBar) this.progressBar.style.width = `${progress}%`;
      if (this.percentText) this.percentText.textContent = `${progress}%`;

      if (this.statusText) {
        if (progress < 30) {
          this.statusText.textContent = 'CALIBRATING GEODETIC DATUM...';
        } else if (progress < 60) {
          this.statusText.textContent = 'RESOLVING FACADE GEOMETRY...';
        } else if (progress < 85) {
          this.statusText.textContent = 'LOCKING CLOCK TOWER HORIZON...';
        } else {
          this.statusText.textContent = 'INITIALIZING ARCHITECTURAL SCENE...';
        }
      }
    }, 36);
  }

  replay() {
    this.clearTimeouts();
    if (this.explorePrompt) {
      this.explorePrompt.classList.remove('visible', 'dismissed');
    }
    this.initScreen.classList.remove('hidden');
    if (this.progressBar) this.progressBar.style.width = '0%';
    if (this.percentText) this.percentText.textContent = '0%';
    this.stageContainer.classList.remove(
      'reveal-stage-a',
      'reveal-stage-b',
      'reveal-stage-c',
      'reveal-stage-d',
      'reveal-stage-e',
      'wow-moment'
    );
    if (this.sceneController) {
      this.sceneController.setState('INTRO');
      this.sceneController.setRevealCamera(0.84, 22, 0);
    }
    this.start();
  }

  schedule(fn, delay) {
    const t = setTimeout(fn, delay);
    this.timeouts.push(t);
  }

  clearTimeouts() {
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
  }
}
