/**
 * Precision Architectural Caliper Cursor (Final Polish)
 * Restrained hairline circular follower with smooth inertia.
 */

export class CustomCursor {
  constructor() {
    this.dot = document.getElementById('custom-cursor-dot');
    this.ring = document.getElementById('custom-cursor-ring');
    this.label = document.getElementById('custom-cursor-label');

    this.mouseX = -100;
    this.mouseY = -100;
    this.ringX = -100;
    this.ringY = -100;
    this.animId = null;

    this.init();
  }

  init() {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (this.dot) {
        this.dot.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0)`;
      }
      if (this.label) {
        this.label.style.transform = `translate3d(${this.mouseX + 16}px, ${this.mouseY + 12}px, 0)`;
      }
    }, { passive: true });

    this.startLoop();
  }

  startLoop() {
    const loop = () => {
      this.ringX += (this.mouseX - this.ringX) * 0.18;
      this.ringY += (this.mouseY - this.ringY) * 0.18;

      if (this.ring) {
        this.ring.style.transform = `translate3d(${this.ringX}px, ${this.ringY}px, 0)`;
      }

      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
