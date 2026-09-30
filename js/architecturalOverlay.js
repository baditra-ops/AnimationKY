/**
 * Architectural Overlay & Self-Drawing Vector Schematics
 * Controls SVG CAD datum lines, self-drawing paths, and dynamic node illumination.
 */

export class ArchitecturalOverlay {
  constructor() {
    this.container = document.getElementById('layer-schematic');
    this.svg = document.querySelector('.schematic-svg');
    this.heroLines = document.querySelectorAll('.cad-line-hero');
    this.cadNodes = document.querySelectorAll('.cad-node');
    this.isVisible = true;

    this.init();
  }

  init() {
    // Prepare hero lines for self-drawing
    this.prepareSelfDrawing();
  }

  prepareSelfDrawing() {
    this.heroLines.forEach(line => {
      // Set initial stroke-dashoffset to hide line
      const length = line.getTotalLength ? line.getTotalLength() : 500;
      line.style.strokeDasharray = `${length}`;
      line.style.strokeDashoffset = `${length}`;
      line.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  }

  drawLines() {
    // Trigger progressive self-drawing of architectural lines
    this.heroLines.forEach((line, index) => {
      setTimeout(() => {
        line.style.strokeDashoffset = '0';
      }, index * 140);
    });

    // Node cascade glow
    this.cadNodes.forEach((node, index) => {
      setTimeout(() => {
        node.style.opacity = '1';
        node.setAttribute('fill', '#ffffff');
        setTimeout(() => {
          node.setAttribute('fill', '#38bdf8');
        }, 400);
      }, index * 80 + 300);
    });
  }

  toggleVisibility(visible) {
    this.isVisible = visible !== undefined ? visible : !this.isVisible;
    if (this.container) {
      this.container.style.opacity = this.isVisible ? '0.48' : '0';
    }
    return this.isVisible;
  }
}
