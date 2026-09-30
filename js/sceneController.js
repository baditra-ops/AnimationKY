/**
 * Unified Scene Controller & Virtual Camera
 * Coordinates virtual camera flight, scroll-driven scrutiny,
 * and state-machine transitions (INTRO -> REVEAL -> WOW_MOMENT -> INTERACTIVE).
 */

import { CONFIG } from './config.js';

export class SceneController {
  constructor() {
    this.promptEl = document.getElementById('explore-prompt');
    this.hudStatus = document.getElementById('hud-status-label');
    
    // State machine: 'INTRO' | 'REVEAL' | 'WOW_MOMENT' | 'INTERACTIVE'
    this.state = 'INTRO';

    // Normalized scene progress (0.0 = wide panorama, 1.0 = close scrutiny)
    this.targetProgress = 0.15;
    this.currentProgress = 0.15;
    
    // Virtual camera zoom (0.94x to 1.22x)
    this.minZoom = CONFIG.camera.minZoom;
    this.maxZoom = CONFIG.camera.maxZoom;
    this.targetZoom = 1.0;
    this.currentZoom = 1.0;
    
    // Scripted camera positions during reveal
    this.revealScale = 0.84;
    this.revealTranslateY = 22;
    this.revealTranslateX = 0;

    // Organic breathing oscillation
    this.isBreathing = false;
    this.breathTime = 0;
    this.isUserInteracted = false;
    this.animId = null;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.bindEvents();
    this.startLoop();
  }

  bindEvents() {
    // Wheel scroll controls virtual camera inspection depth
    window.addEventListener('wheel', (e) => {
      this.dismissPrompt();
      if (this.state !== 'INTERACTIVE') return;

      const delta = e.deltaY * 0.0006;
      this.targetProgress = Math.max(0.0, Math.min(1.0, this.targetProgress + delta));
      this.targetZoom = this.minZoom + this.targetProgress * (this.maxZoom - this.minZoom);

      if (this.hudStatus && Math.abs(delta) > 0.01) {
        const zoomPercent = Math.round(this.targetZoom * 100);
        this.hudStatus.textContent = `CAMERA ZOOM: ${zoomPercent}% // ARCHITECTURAL DEPTH`;
      }
    }, { passive: true });

    // Touch swipe support for mobile
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      this.dismissPrompt();
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.state !== 'INTERACTIVE') return;
      const touchY = e.touches[0].clientY;
      const deltaY = (touchStartY - touchY) * 0.002;
      touchStartY = touchY;
      this.targetProgress = Math.max(0.0, Math.min(1.0, this.targetProgress + deltaY));
      this.targetZoom = this.minZoom + this.targetProgress * (this.maxZoom - this.minZoom);
    }, { passive: true });

    window.addEventListener('pointermove', () => {
      this.dismissPrompt();
    }, { passive: true });
  }

  dismissPrompt() {
    if (!this.isUserInteracted && this.promptEl) {
      this.isUserInteracted = true;
      this.promptEl.classList.add('dismissed');
    }
  }

  setState(newState) {
    this.state = newState;
  }

  getState() {
    return this.state;
  }

  setRevealCamera(scale, translateY, translateX = 0) {
    this.revealScale = scale;
    this.revealTranslateY = translateY;
    this.revealTranslateX = translateX;
  }

  enableBreathing() {
    this.isBreathing = true;
  }

  disableBreathing() {
    this.isBreathing = false;
  }

  startLoop() {
    const loop = () => {
      this.updatePhysics();
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  updatePhysics() {
    const lerp = CONFIG.camera.zoomLerpFactor;
    this.currentProgress += (this.targetProgress - this.currentProgress) * lerp;
    this.currentZoom += (this.targetZoom - this.currentZoom) * lerp;

    if (this.isBreathing && !this.reducedMotion && this.state === 'INTERACTIVE') {
      this.breathTime += 1;
    }
  }

  getCurrentZoom() {
    if (this.state !== 'INTERACTIVE') {
      return this.revealScale;
    }
    return this.currentZoom;
  }

  getCameraY() {
    if (this.state !== 'INTERACTIVE') {
      return this.revealTranslateY;
    }
    return (1 - this.currentProgress) * 4;
  }

  getCameraX() {
    if (this.state !== 'INTERACTIVE') {
      return this.revealTranslateX;
    }
    return this.currentProgress * -10;
  }

  getBreathingOffset() {
    if (this.isBreathing && !this.reducedMotion && this.state === 'INTERACTIVE') {
      return Math.sin(this.breathTime * CONFIG.camera.breathingSpeed) * CONFIG.camera.breathingScaleAmp;
    }
    return 0;
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
