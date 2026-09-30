/**
 * Ambient Atmospheric Particle System
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

    // Generate restrained set of particles
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }

    if (!this.reducedMotion) {
      this.start();
    }
  }

  createParticle() {
    const isNode = Math.random() > 0.82;
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: isNode ? Math.random() * 1.4 + 1.1 : Math.random() * 1.1 + 0.5,
      speedX: (Math.random() - 0.5) * CONFIG.particles.maxSpeedX,
      speedY: -Math.random() * CONFIG.particles.maxSpeedY - 0.08, // Subtle upward drift
      alpha: Math.random() * 0.45 + 0.15,
      maxAlpha: Math.random() * 0.45 + 0.25,
      alphaSpeed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
      depth: Math.random() * 0.65 + 0.35,
      isNode: isNode,
      color: isNode ? '56, 189, 248' : '251, 191, 36' // Cyan node or Amber stone mote
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
      if (p.alpha > p.maxAlpha || p.alpha < 0.1) {
        p.alphaSpeed = -p.alphaSpeed;
      }

      // Seamless wrap-around
      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      // Subtle parallax response
      const renderX = p.x + this.parallaxX * 28 * p.depth;
      const renderY = p.y + this.parallaxY * 20 * p.depth;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, Math.min(1, p.alpha))})`;
      this.ctx.fill();

      // Delicate halo for architectural micro-nodes
      if (p.isNode) {
        this.ctx.beginPath();
        this.ctx.arc(renderX, renderY, p.radius * 2.2, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(${p.color}, ${p.alpha * 0.3})`;
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
