/**
 * Magnetic Precision Architectural Caliper Cursor
 * Features gravitational magnetic attraction toward the Clock Tower
 * and interactive HUD dock buttons with elastic spring mechanics.
 */

export class CustomCursor {
  constructor() {
    this.dot = document.getElementById('custom-cursor-dot');
    this.ring = document.getElementById('custom-cursor-ring');
    this.label = document.getElementById('custom-cursor-label');
    this.towerAnchor = document.getElementById('clock-tower-anchor');
    this.dockButtons = document.querySelectorAll('.dock-btn');

    this.mouseX = -100;
    this.mouseY = -100;

    this.targetDotX = -100;
    this.targetDotY = -100;
    this.dotX = -100;
    this.dotY = -100;

    this.targetRingX = -100;
    this.targetRingY = -100;
    this.ringX = -100;
    this.ringY = -100;

    this.isMagnetized = false;
    this.magneticType = null; // 'tower' | 'button' | null
    this.activeBtn = null;

    this.animId = null;

    this.init();
  }

  init() {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    // Track raw pointer
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }, { passive: true });

    // Setup magnetic dock button handlers
    this.setupDockButtons();

    this.startLoop();
  }

  setupDockButtons() {
    this.dockButtons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        this.activeBtn = btn;
        this.magneticType = 'button';
        document.body.classList.add('cursor-magnetic-btn');
      });

      btn.addEventListener('mouseleave', () => {
        if (this.activeBtn === btn) {
          this.activeBtn = null;
          this.magneticType = null;
          document.body.classList.remove('cursor-magnetic-btn');
          btn.style.transform = '';
        }
      });

      btn.addEventListener('mousemove', (e) => {
        // Magnetic button translation (button pulls slightly towards cursor)
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = (e.clientX - centerX) * 0.28;
        const dy = (e.clientY - centerY) * 0.28;
        btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      });
    });
  }

  startLoop() {
    const loop = () => {
      this.calculateMagnetism();
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  calculateMagnetism() {
    let pullFactor = 0;
    let magnetTargetX = this.mouseX;
    let magnetTargetY = this.mouseY;
    let isLocked = false;

    // 1. Clock Tower Magnetic Attraction
    if (this.towerAnchor) {
      const rect = this.towerAnchor.getBoundingClientRect();
      const towerCenterX = rect.left + rect.width / 2;
      const towerCenterY = rect.top + rect.height * 0.3; // Clock dial height
      
      const dx = towerCenterX - this.mouseX;
      const dy = towerCenterY - this.mouseY;
      const dist = Math.hypot(dx, dy);
      const attractionRadius = 130; // 130px magnetic gravity field

      if (dist < attractionRadius) {
        // Nonlinear gravitational pull (stronger as you get closer)
        pullFactor = Math.pow(1 - dist / attractionRadius, 1.4);
        
        // Gravitate towards center
        magnetTargetX = this.mouseX + dx * pullFactor * 0.72;
        magnetTargetY = this.mouseY + dy * pullFactor * 0.72;

        if (dist < 42) {
          isLocked = true;
        }

        this.magneticType = 'tower';
      } else if (this.magneticType === 'tower') {
        this.magneticType = null;
      }
    }

    // 2. Button Magnetic Attraction
    if (this.activeBtn) {
      const rect = this.activeBtn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dx = btnCenterX - this.mouseX;
      const dy = btnCenterY - this.mouseY;
      
      pullFactor = 0.45;
      magnetTargetX = this.mouseX + dx * pullFactor;
      magnetTargetY = this.mouseY + dy * pullFactor;
      this.magneticType = 'button';
    }

    // Apply magnetic targets
    if (this.magneticType) {
      this.isMagnetized = true;
      document.body.classList.add('cursor-magnetic');
      if (isLocked) {
        document.body.classList.add('cursor-magnetic-lock');
      } else {
        document.body.classList.remove('cursor-magnetic-lock');
      }

      this.targetRingX = magnetTargetX;
      this.targetRingY = magnetTargetY;
      this.targetDotX = this.mouseX + (magnetTargetX - this.mouseX) * 0.4;
      this.targetDotY = this.mouseY + (magnetTargetY - this.mouseY) * 0.4;
    } else {
      this.isMagnetized = false;
      document.body.classList.remove('cursor-magnetic', 'cursor-magnetic-lock');
      this.targetRingX = this.mouseX;
      this.targetRingY = this.mouseY;
      this.targetDotX = this.mouseX;
      this.targetDotY = this.mouseY;
    }

    // Physics interpolation (spring inertia)
    const ringLerp = this.isMagnetized ? 0.22 : 0.16;
    const dotLerp = this.isMagnetized ? 0.35 : 0.65;

    this.ringX += (this.targetRingX - this.ringX) * ringLerp;
    this.ringY += (this.targetRingY - this.ringY) * ringLerp;

    this.dotX += (this.targetDotX - this.dotX) * dotLerp;
    this.dotY += (this.targetDotY - this.dotY) * dotLerp;
  }

  render() {
    if (this.dot) {
      this.dot.style.transform = `translate3d(${this.dotX.toFixed(1)}px, ${this.dotY.toFixed(1)}px, 0)`;
    }

    if (this.ring) {
      this.ring.style.transform = `translate3d(${this.ringX.toFixed(1)}px, ${this.ringY.toFixed(1)}px, 0)`;
    }

    if (this.label) {
      this.label.style.transform = `translate3d(${(this.ringX + 20).toFixed(1)}px, ${(this.ringY + 14).toFixed(1)}px, 0)`;
    }
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
