/**
 * Architectural Laser & Light Wash Scanner (Final Polish)
 * Sweeps a restrained optical analysis wash across the facade,
 * highlighting survey CAD nodes and gently pulsing the clock tower.
 */

import { CONFIG } from './config.js';
import { audio } from './audio.js';

export class ArchitecturalScanner {
  constructor(options = {}) {
    this.scanLayer = document.getElementById('layer-scan');
    this.beamLine = document.querySelector('.scan-beam-line');
    this.beamGlow = document.querySelector('.scan-beam-glow');
    this.cadNodes = document.querySelectorAll('.cad-node');
    this.clockTower = options.clockTower || null;

    this.isScanning = false;
    this.animId = null;
    this.autoScanTimer = null;

    this.init();
  }

  init() {
    // Controlled occasional auto scan every 36 seconds
    this.autoScanTimer = setInterval(() => {
      if (!this.isScanning) {
        this.triggerScan();
      }
    }, 36000);
  }

  triggerScan() {
    if (this.isScanning || !this.scanLayer) return;
    this.isScanning = true;

    this.scanLayer.classList.add('scanning');
    audio.playScanPing(1.1);

    const startTime = performance.now();
    const duration = 2500; // 2.5s graceful sweep

    let towerTriggered = false;

    const sweep = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      // Smooth cubic easing
      const eased = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const percent = eased * 105;

      if (this.beamLine) {
        this.beamLine.style.transform = `translateX(${percent}%)`;
        this.beamLine.style.left = '0%';
      }
      if (this.beamGlow) {
        this.beamGlow.style.transform = `translateX(calc(${percent}% - 120px))`;
        this.beamGlow.style.left = '0%';
      }

      // Check proximity to CAD nodes
      const beamFraction = percent / 100;
      this.cadNodes.forEach((node) => {
        const cx = parseFloat(node.getAttribute('cx')) / CONFIG.geometry.width;
        if (Math.abs(cx - beamFraction) < 0.04) {
          node.setAttribute('fill', '#ffffff');
          node.setAttribute('r', '2.5');
        } else {
          node.setAttribute('fill', '#38bdf8');
          node.setAttribute('r', '1.8');
        }
      });

      // Sympathetic pulse on clock tower as beam sweeps across it
      if (!towerTriggered && beamFraction >= 0.59 && beamFraction <= 0.67) {
        towerTriggered = true;
        if (this.clockTower) {
          this.clockTower.pulseTower();
        }
      }

      if (progress < 1) {
        this.animId = requestAnimationFrame(sweep);
      } else {
        this.finishScan();
      }
    };

    this.animId = requestAnimationFrame(sweep);
  }

  finishScan() {
    this.isScanning = false;
    if (this.scanLayer) {
      this.scanLayer.classList.remove('scanning');
    }
    this.cadNodes.forEach((node) => {
      node.setAttribute('fill', '#38bdf8');
      node.setAttribute('r', '1.8');
    });
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.autoScanTimer) clearInterval(this.autoScanTimer);
  }
}
