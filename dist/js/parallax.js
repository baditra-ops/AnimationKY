/**
 * 60fps Multi-Layer Parallax & Interactive Virtual Light Engine
 * Unifies 3D perspective tilt, virtual camera scale, and 5-layer differential depth.
 */

import { CONFIG } from './config.js';

export class ParallaxEngine {
  constructor(options = {}) {
    this.stage = document.getElementById('stage-container');
    this.tiltWrapper = document.getElementById('tilt-wrapper');
    this.layersContainer = document.getElementById('layers-container');
    this.blueprintBg = document.querySelector('.blueprint-background');
    this.particleSystem = options.particleSystem || null;
    this.sceneController = options.sceneController || null;

    // Distinct depth layer elements
    this.layerSky = document.querySelector('.layer-sky');
    this.layerFacade = document.querySelector('.layer-facade');
    this.layerTower = document.querySelector('.layer-clock-tower');
    this.layerSchematic = document.querySelector('.layer-schematic');
    this.layerLighting = document.querySelector('.layer-lighting');
    this.layerSpecular = document.querySelector('.layer-specular');

    // Normalized pointer coordinates (-1.0 to +1.0)
    this.targetX = 0;
    this.targetY = 0;
    this.currentX = 0;
    this.currentY = 0;

    // Relative light coordinates (0% to 100%)
    this.lightTargetX = CONFIG.geometry.clockTower.xPercent;
    this.lightTargetY = CONFIG.geometry.clockTower.yPercent;
    this.lightCurrentX = CONFIG.geometry.clockTower.xPercent;
    this.lightCurrentY = CONFIG.geometry.clockTower.yPercent;

    this.isHoveringStage = false;
    this.isEnabled = false;
    this.animId = null;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.bindEvents();
    this.startLoop();
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      if (!this.isEnabled || (this.sceneController && this.sceneController.getState() !== 'INTERACTIVE')) {
        return;
      }
      const winW = window.innerWidth;
      const winH = window.innerHeight;

      // Normalized coordinates (-1 to +1) from screen center
      this.targetX = (e.clientX / winW) * 2 - 1;
      this.targetY = (e.clientY / winH) * 2 - 1;

      // Virtual spotlight coordinates relative to building bounds
      if (this.layersContainer) {
        const rect = this.layersContainer.getBoundingClientRect();
        const relX = ((e.clientX - rect.left) / rect.width) * 100;
        const relY = ((e.clientY - rect.top) / rect.height) * 100;
        
        this.lightTargetX = Math.max(0, Math.min(100, relX));
        this.lightTargetY = Math.max(0, Math.min(100, relY));
      }
    }, { passive: true });

    if (this.stage) {
      this.stage.addEventListener('mouseenter', () => {
        this.isHoveringStage = true;
        document.body.classList.add('cursor-hover-building');
      });
      this.stage.addEventListener('mouseleave', () => {
        this.isHoveringStage = false;
        document.body.classList.remove('cursor-hover-building');
        this.lightTargetX = CONFIG.geometry.clockTower.xPercent;
        this.lightTargetY = CONFIG.geometry.clockTower.yPercent;
      });
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (!this.isEnabled || !e.gamma || (this.sceneController && this.sceneController.getState() !== 'INTERACTIVE')) {
          return;
        }
        this.targetX = Math.max(-1, Math.min(1, e.gamma / 22));
        this.targetY = Math.max(-1, Math.min(1, (e.beta - 42) / 22));
      }, { passive: true });
    }
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
    this.targetX = 0;
    this.targetY = 0;
  }

  startLoop() {
    const loop = () => {
      this.updatePhysics();
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  updatePhysics() {
    const isInteractive = this.sceneController && this.sceneController.getState() === 'INTERACTIVE';
    const effectiveTargetX = isInteractive ? this.targetX : 0;
    const effectiveTargetY = isInteractive ? this.targetY : 0;

    const lerp = CONFIG.parallax.lerpFactor;
    this.currentX += (effectiveTargetX - this.currentX) * lerp;
    this.currentY += (effectiveTargetY - this.currentY) * lerp;

    const lightLerp = CONFIG.parallax.lightLerpFactor;
    this.lightCurrentX += (this.lightTargetX - this.lightCurrentX) * lightLerp;
    this.lightCurrentY += (this.lightTargetY - this.lightCurrentY) * lightLerp;

    if (this.particleSystem) {
      this.particleSystem.setParallaxOffset(this.currentX, this.currentY);
    }
  }

  render() {
    if (this.reducedMotion) return;

    // Perspective 3D rotation angles
    const rotY = this.currentX * CONFIG.parallax.tiltMaxY;
    const rotX = -this.currentY * CONFIG.parallax.tiltMaxX;

    // Pull camera parameters from SceneController
    const cameraZoom = this.sceneController ? this.sceneController.getCurrentZoom() : 1.0;
    const cameraY = this.sceneController ? this.sceneController.getCameraY() : 0;
    const cameraX = this.sceneController ? this.sceneController.getCameraX() : 0;
    const breath = this.sceneController ? this.sceneController.getBreathingOffset() : 0;
    const finalScale = (cameraZoom + breath).toFixed(4);

    if (this.tiltWrapper) {
      this.tiltWrapper.style.transform = `
        scale(${finalScale})
        translate3d(${cameraX.toFixed(1)}px, ${cameraY.toFixed(1)}px, 0)
        rotateY(${rotY.toFixed(2)}deg)
        rotateX(${rotX.toFixed(2)}deg)
      `;
    }

    // 5-Layer Differential Translation
    const x = this.currentX;
    const y = this.currentY;

    if (this.blueprintBg) {
      this.blueprintBg.style.transform = `translate3d(${(x * -8).toFixed(1)}px, ${(y * -6).toFixed(1)}px, 0)`;
    }

    if (this.layerSky) {
      this.layerSky.style.transform = `translate3d(${(x * -11).toFixed(1)}px, ${(y * -8).toFixed(1)}px, 12px)`;
    }

    if (this.layerFacade) {
      this.layerFacade.style.transform = `translate3d(${(x * 9).toFixed(1)}px, ${(y * 7).toFixed(1)}px, 28px)`;
    }

    if (this.layerTower) {
      this.layerTower.style.transform = `translate3d(${(x * 14).toFixed(1)}px, ${(y * 11).toFixed(1)}px, 48px)`;
    }

    if (this.layerSchematic) {
      this.layerSchematic.style.transform = `translate3d(${(x * 17).toFixed(1)}px, ${(y * 14).toFixed(1)}px, 60px)`;
    }

    if (this.layersContainer) {
      this.layersContainer.style.setProperty('--light-x', `${this.lightCurrentX.toFixed(2)}%`);
      this.layersContainer.style.setProperty('--light-y', `${this.lightCurrentY.toFixed(2)}%`);
    }
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
