/**
 * EcoRise 2.0 - Confetti & Ambient Leaves Engine
 */
import confetti from 'canvas-confetti';

const ECO_COLORS = ['#10b981', '#22c55e', '#34d399', '#06b6d4', '#f59e0b', '#84cc16', '#a7f3d0'];

export function triggerCelebration(options: { duration?: number; particleCount?: number } = {}) {
  const { duration = 3000, particleCount = 80 } = options;

  confetti({
    particleCount,
    spread: 70,
    origin: { y: 0.6 },
    colors: ECO_COLORS,
    disableForReducedMotion: true
  });

  if (particleCount > 60) {
    setTimeout(() => {
      confetti({
        particleCount: Math.floor(particleCount * 0.6),
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ECO_COLORS
      });
      confetti({
        particleCount: Math.floor(particleCount * 0.6),
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ECO_COLORS
      });
    }, 250);
  }
}

/**
 * Ambient background floating leaves on an HTML5 canvas
 */
export function initAmbientLeaves(canvas: HTMLCanvasElement) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let animationFrame: number;
  let leaves: AmbientLeaf[] = [];
  const maxLeaves = 16;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class AmbientLeaf {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
    size = Math.random() * 8 + 6;
    speedY = Math.random() * 0.35 + 0.25;
    speedX = (Math.random() - 0.5) * 0.35;
    angle = Math.random() * Math.PI * 2;
    angleSpeed = (Math.random() - 0.5) * 0.018;
    color = ECO_COLORS[Math.floor(Math.random() * 3)];
    opacity = Math.random() * 0.3 + 0.15;

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 0.35 + 0.25;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.angle = Math.random() * Math.PI * 2;
      this.color = ECO_COLORS[Math.floor(Math.random() * 3)];
      this.opacity = Math.random() * 0.3 + 0.15;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.angle) * 0.5 + this.speedX;
      this.angle += this.angleSpeed;

      if (this.y > canvas.height + 20) {
        this.reset();
      }
    }

    draw(context: CanvasRenderingContext2D) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.angle);
      context.fillStyle = this.color;
      context.globalAlpha = this.opacity;

      context.beginPath();
      context.moveTo(0, -this.size);
      context.quadraticCurveTo(this.size * 0.7, 0, 0, this.size);
      context.quadraticCurveTo(-this.size * 0.7, 0, 0, -this.size);
      context.fill();
      context.restore();
    }
  }

  for (let i = 0; i < maxLeaves; i++) {
    leaves.push(new AmbientLeaf());
  }

  function loop() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let leaf of leaves) {
      leaf.update();
      leaf.draw(ctx);
    }
    animationFrame = requestAnimationFrame(loop);
  }

  loop();

  return () => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resize);
  };
}
