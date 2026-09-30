/**
 * Ambient Atmospheric Particle System (Final Polish)
 * Restrained lightweight 2D Canvas rendering of floating dust motes and micro-nodes.
 */

import { CONFIG } from './config.js';

export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = window.innerWidth < 768 
      ? CONFIG.particles.mobileCount 
      : CONFIG.particles.desktopCount;
    this.width = 0;
    this.height = 0;
    this.parallaxX = 0;
    this.parallaxY = 0;
    this.animId = null;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }

    if (!this.reducedMotion) {
      this.start();
    }
  }

  createParticle() {
    const isNode = Math.random() > 0.85;
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: isNode ? Math.random() * 1.3 + 0.9 : Math.random() * 0.9 + 0.4,
      speedX: (Math.random() - 0.5) * CONFIG.particles.maxSpeedX,
      speedY: -Math.random() * CONFIG.particles.maxSpeedY - 0.06,
      alpha: Math.random() * 0.4 + 0.12,
      maxAlpha: Math.random() * 0.4 + 0.22,
      alphaSpeed: (Math.random() * 0.006 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      depth: Math.random() * 0.6 + 0.35,
      isNode: isNode,
      color: isNode ? '56, 189, 248' : '245, 158, 11'
    };
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  setParallaxOffset(x, y) {
    this.parallaxX = x;
    this.parallaxY = y;
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.speedX;
      p.y += p.speedY;

      p.alpha += p.alphaSpeed;
      if (p.alpha > p.maxAlpha || p.alpha < 0.08) {
        p.alphaSpeed = -p.alphaSpeed;
      }

      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      const renderX = p.x + this.parallaxX * 22 * p.depth;
      const renderY = p.y + this.parallaxY * 16 * p.depth;

      this.ctx.beginPath();
      this.ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, Math.min(1, p.alpha))})`;
      this.ctx.fill();

      if (p.isNode) {
        this.ctx.beginPath();
        this.ctx.arc(renderX, renderY, p.radius * 2.0, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(${p.color}, ${p.alpha * 0.25})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
      }
    }
  }

  start() {
    const loop = () => {
      this.update();
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
