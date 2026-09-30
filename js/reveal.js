/**
 * Reveal Sequence Orchestrator
 * Controls the 5-stage cinematic reveal from darkness to full interactive state.
 */

import { audio } from './audio.js';

export class RevealSequence {
  constructor(options = {}) {
    this.initScreen = document.getElementById('init-screen');
    this.progressBar = document.getElementById('init-progress-fill');
    this.statusText = document.getElementById('init-status-text');
    this.percentText = document.getElementById('init-percent-text');
    this.stageContainer = document.getElementById('stage-container');
    this.lightSweep = document.getElementById('reveal-light-sweep');
    this.hudStatus = document.getElementById('hud-status-label');
    this.onComplete = options.onComplete || (() => {});
    
    this.currentStage = 0;
    this.isRevealing = false;
    this.stageTimeouts = [];
  }

  start() {
    this.isRevealing = true;
    this.currentStage = 0;
    this.clearTimeouts();

    // Stage 0: Initialization Progress
    this.runProgress(() => {
      // Progress complete, transition into building reveal
      this.initScreen.classList.add('hidden');
      audio.playBootChime();

      // Begin Stage 1: Silhouette Emergence (at 200ms)
      this.schedule(() => this.setStage(1), 200);

      // Begin Stage 2: Architectural Structure Visible (at 1200ms)
      this.schedule(() => {
        this.setStage(2);
        this.triggerLightSweep();
      }, 1200);

      // Begin Stage 3: Clock Tower Emerges (at 2400ms)
      this.schedule(() => {
        this.setStage(3);
        audio.playTowerBeacon();
      }, 2400);

      // Begin Stage 4: Full Sharp Illumination (at 3600ms)
      this.schedule(() => this.setStage(4), 3600);

      // Stage 5: Settle into Interactive State (at 4800ms)
      this.schedule(() => {
        this.setStage(5);
        this.isRevealing = false;
        if (this.hudStatus) {
          this.hudStatus.textContent = 'INTERACTIVE DEPTH ACTIVE';
        }
        this.onComplete();
      }, 4800);
    });
  }

  setStage(stageNum) {
    this.currentStage = stageNum;
    
    // Remove previous reveal classes
    this.stageContainer.classList.remove(
      'reveal-stage-1',
      'reveal-stage-2',
      'reveal-stage-3',
      'reveal-stage-4',
      'reveal-stage-5'
    );
    
    this.stageContainer.classList.add(`reveal-stage-${stageNum}`);

    if (this.hudStatus) {
      const stageLabels = {
        1: 'REVEAL: SILHOUETTE',
        2: 'REVEAL: STRUCTURE',
        3: 'REVEAL: CLOCK TOWER',
        4: 'REVEAL: FULL ILLUMINATION',
        5: 'SYSTEM READY'
      };
      this.hudStatus.textContent = stageLabels[stageNum] || 'INITIALIZING';
    }
  }

  triggerLightSweep() {
    if (!this.lightSweep) return;
    this.lightSweep.classList.remove('active');
    void this.lightSweep.offsetWidth; // Force reflow
    this.lightSweep.classList.add('active');
  }

  runProgress(callback) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (this.progressBar) this.progressBar.style.width = '100%';
        if (this.percentText) this.percentText.textContent = '100%';
        if (this.statusText) this.statusText.textContent = 'SYSTEM ONLINE';
        setTimeout(callback, 300);
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
          this.statusText.textContent = 'FINALIZING RENDERING STAGE...';
        }
      }
    }, 45);
  }

  replay() {
    this.clearTimeouts();
    this.initScreen.classList.remove('hidden');
    if (this.progressBar) this.progressBar.style.width = '0%';
    if (this.percentText) this.percentText.textContent = '0%';
    if (this.stageContainer) {
      this.stageContainer.classList.remove(
        'reveal-stage-1',
        'reveal-stage-2',
        'reveal-stage-3',
        'reveal-stage-4',
        'reveal-stage-5'
      );
    }
    this.start();
  }

  schedule(fn, delay) {
    const t = setTimeout(fn, delay);
    this.stageTimeouts.push(t);
  }

  clearTimeouts() {
    this.stageTimeouts.forEach(t => clearTimeout(t));
    this.stageTimeouts = [];
  }
}
