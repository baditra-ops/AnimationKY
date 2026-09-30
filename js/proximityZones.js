/**
 * Campus Proximity Zones Manager
 * Detects pointer proximity to key architectural quadrants:
 * Clock Tower, Central Portico, West Lawn, and East Veranda.
 */

import { CONFIG } from './config.js';

export class ProximityZones {
  constructor() {
    this.layersContainer = document.getElementById('layers-container');
    this.hudStatus = document.getElementById('hud-status-label');
    this.activeZone = null;
    this.zones = CONFIG.geometry.zones;

    this.init();
  }

  init() {
    if (!this.layersContainer) return;

    window.addEventListener('mousemove', (e) => {
      this.evaluateProximity(e.clientX, e.clientY);
    }, { passive: true });
  }

  evaluateProximity(clientX, clientY) {
    if (!this.layersContainer) return;
    const rect = this.layersContainer.getBoundingClientRect();
    
    // Check if cursor is near the building container
    if (
      clientX < rect.left - 40 ||
      clientX > rect.right + 40 ||
      clientY < rect.top - 40 ||
      clientY > rect.bottom + 40
    ) {
      this.clearZone();
      return;
    }

    // Relative percentage within building
    const relX = ((clientX - rect.left) / rect.width) * 100;
    const relY = ((clientY - rect.top) / rect.height) * 100;

    let matchedZone = null;
    let minDistance = Infinity;

    // Check each zone
    for (const zone of this.zones) {
      if (
        relX >= zone.xMin && relX <= zone.xMax &&
        relY >= zone.yMin && relY <= zone.yMax
      ) {
        // Direct hit
        matchedZone = zone;
        break;
      } else {
        // Calculate center distance
        const dx = relX - zone.centerX;
        const dy = relY - zone.centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 18 && dist < minDistance) {
          minDistance = dist;
          matchedZone = zone;
        }
      }
    }

    if (matchedZone !== this.activeZone) {
      this.setActiveZone(matchedZone);
    }
  }

  setActiveZone(zone) {
    this.activeZone = zone;
    if (zone && this.hudStatus) {
      this.hudStatus.textContent = `${zone.name} // ${zone.tag}`;
      this.highlightZoneCad(zone.id);
    } else {
      this.clearZone();
    }
  }

  highlightZoneCad(zoneId) {
    const lines = document.querySelectorAll(`.cad-${zoneId}`);
    lines.forEach(line => {
      line.style.opacity = '0.95';
      line.style.stroke = 'var(--accent-amber)';
    });
  }

  clearZone() {
    if (this.activeZone) {
      const prevId = this.activeZone.id;
      const lines = document.querySelectorAll(`.cad-${prevId}`);
      lines.forEach(line => {
        line.style.opacity = '';
        line.style.stroke = '';
      });
      this.activeZone = null;
      if (this.hudStatus) {
        this.hudStatus.textContent = 'INTERACTIVE DEPTH ACTIVE';
      }
    }
  }

  getActiveZone() {
    return this.activeZone;
  }
}
