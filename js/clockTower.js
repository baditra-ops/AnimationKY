/**
 * Hero Clock Tower Interactive Controller (Final Polish)
 * Proximity detection, restrained warm amber discovery bloom,
 * and ephemeral architectural discovery callout.
 */

import { CONFIG } from './config.js';
import { audio } from './audio.js';

export class ClockTowerController {
  constructor() {
    this.anchor = document.getElementById('clock-tower-anchor');
    this.layersContainer = document.getElementById('layers-container');
    this.reticlePing = document.querySelector('.tower-reticle-ping');
    this.reticleCore = document.querySelector('.tower-reticle-core');
    this.annotation = document.querySelector('.tower-annotation');
    
    this.isNear = false;
    this.isDiscovered = false;
    this.lastSoundTime = 0;

    this.init();
  }

  init() {
    if (!this.anchor || !this.layersContainer) return;

    window.addEventListener('mousemove', (e) => this.checkProximity(e), { passive: true });

    this.anchor.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover-tower');
      this.anchor.classList.add('active-focus');
      this.revealAnnotation(true);
      audio.playTowerBeacon();
    });

    this.anchor.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover-tower');
      this.anchor.classList.remove('active-focus');
      if (!this.isNear) {
        this.revealAnnotation(false);
      }
    });

    this.anchor.addEventListener('click', () => {
      this.pulseTower();
      audio.playTowerBeacon();
    });
  }

  checkProximity(e) {
    if (!this.anchor) return;
    const rect = this.anchor.getBoundingClientRect();
    const towerCenterX = rect.left + rect.width / 2;
    const towerCenterY = rect.top + rect.height * 0.3;

    const dx = e.clientX - towerCenterX;
    const dy = e.clientY - towerCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const maxRadius = CONFIG.geometry.clockTower.radiusPx * 1.7; // ~187px
    if (dist < maxRadius) {
      const proximity = 1 - (dist / maxRadius);
      this.applyProximityGlow(proximity);

      if (!this.isNear && proximity > 0.45) {
        this.isNear = true;
        this.revealAnnotation(true);
        const now = Date.now();
        if (now - this.lastSoundTime > 3000) {
          audio.playTowerBeacon();
          this.lastSoundTime = now;
        }
      }
    } else {
      if (this.isNear) {
        this.isNear = false;
        this.revealAnnotation(false);
      }
      this.resetProximity();
    }
  }

  revealAnnotation(show) {
    if (!this.annotation) return;
    if (show) {
      this.annotation.classList.add('discovered');
    } else {
      this.annotation.classList.remove('discovered');
    }
  }

  applyProximityGlow(factor) {
    if (!this.reticlePing) return;
    const opacity = 0.35 + factor * 0.55;
    const scale = 1.0 + factor * 0.16;
    this.reticlePing.style.opacity = opacity.toFixed(2);
    this.reticlePing.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(2)})`;
    this.reticlePing.style.borderColor = factor > 0.6 ? 'var(--accent-amber)' : 'var(--accent-cyan)';

    if (this.reticleCore) {
      const coreScale = 1.0 + factor * 0.28;
      this.reticleCore.style.transform = `translate(-50%, -50%) scale(${coreScale.toFixed(2)})`;
    }
  }

  resetProximity() {
    if (!this.reticlePing) return;
    this.reticlePing.style.opacity = '0.4';
    this.reticlePing.style.transform = 'translate(-50%, -50%) scale(1)';
    this.reticlePing.style.borderColor = 'var(--accent-cyan)';
    if (this.reticleCore) {
      this.reticleCore.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  }

  pulseTower() {
    if (!this.reticlePing) return;
    this.reticlePing.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
    this.reticlePing.style.transform = 'translate(-50%, -50%) scale(1.3)';
    this.reticlePing.style.boxShadow = '0 0 28px rgba(245, 158, 11, 0.7)';

    setTimeout(() => {
      this.reticlePing.style.transition = '';
      this.reticlePing.style.transform = 'translate(-50%, -50%) scale(1)';
      this.reticlePing.style.boxShadow = '';
    }, 450);
  }
}
