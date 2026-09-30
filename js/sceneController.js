/**
 * Unified Scene Controller & Virtual Camera
 * Controls virtual camera scale, camera translation, scroll-driven inspection depth,
 * and organic architectural breathing.
 */

import { CONFIG } from './config.js';

export class SceneController {
  constructor() {
    this.promptEl = document.getElementById('explore-prompt');
    this.hudStatus = document.getElementById('hud-status-label');
    
    // Normalized scene progress (0.0 = wide panorama, 1.0 = close architectural scrutiny)
    this.targetProgress = 0.12;
    this.currentProgress = 0.12;
    
    // Virtual camera zoom (0.92x to 1.28x)
    this.minZoom = 0.92;
    this.maxZoom = 1.28;
    this.targetZoom = 1.0;
    this.currentZoom = 1.0;
    
    // Camera cinematic offsets for reveal stages
    this.revealScale = 0.82;
    this.revealTranslateY = 24;
    this.revealTranslateX = 0;
    this.isRevealControlled = true;

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
      if (this.isRevealControlled) return;

      const delta = e.deltaY * 0.0007;
      this.targetProgress = Math.max(0.0, Math.min(1.0, this.targetProgress + delta));
      
      // Calculate target camera zoom
      this.targetZoom = this.minZoom + this.targetProgress * (this.maxZoom - this.minZoom);

      if (this.hudStatus && Math.abs(delta) > 0.01) {
        const zoomPercent = Math.round(this.targetZoom * 100);
        this.hudStatus.textContent = `CAMERA ZOOM: ${zoomPercent}% // DEPTH SCRUTINY`;
      }
    }, { passive: true });

    // Touch swipe support for mobile
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      this.dismissPrompt();
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isRevealControlled) return;
      const touchY = e.touches[0].clientY;
      const deltaY = (touchStartY - touchY) * 0.0022;
      touchStartY = touchY;
      this.targetProgress = Math.max(0.0, Math.min(1.0, this.targetProgress + deltaY));
      this.targetZoom = this.minZoom + this.targetProgress * (this.maxZoom - this.minZoom);
    }, { passive: true });

    // User pointer activity dismisses prompt
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

  setRevealCamera(scale, translateY, translateX = 0) {
    this.revealScale = scale;
    this.revealTranslateY = translateY;
    this.revealTranslateX = translateX;
  }

  releaseRevealControl() {
    this.isRevealControlled = false;
    this.targetZoom = 1.0;
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
    const lerp = 0.08;
    this.currentProgress += (this.targetProgress - this.currentProgress) * lerp;
    this.currentZoom += (this.targetZoom - this.currentZoom) * lerp;

    if (this.isBreathing && !this.reducedMotion) {
      this.breathTime += 1;
    }
  }

  getCurrentZoom() {
    if (this.isRevealControlled) {
      return this.revealScale;
    }
    return this.currentZoom;
  }

  getCameraY() {
    if (this.isRevealControlled) {
      return this.revealTranslateY;
    }
    // Subtle elevation lift as zoom increases
    return (1 - this.currentProgress) * 4;
  }

  getCameraX() {
    if (this.isRevealControlled) {
      return this.revealTranslateX;
    }
    // Slight shift toward clock tower as we zoom closer
    return this.currentProgress * -14;
  }

  getBreathingOffset() {
    if (this.isBreathing && !this.reducedMotion) {
      return Math.sin(this.breathTime * CONFIG.camera.breathingSpeed) * CONFIG.camera.breathingScaleAmp;
    }
    return 0;
  }

  getProgress() {
    return this.currentProgress;
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
