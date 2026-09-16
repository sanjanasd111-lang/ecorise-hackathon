/**
 * EcoRise - Local Eco-Challenge
 * Ambient Floating Leaves & Celebration Confetti System
 */

// Colors tailored to eco theme: fresh greens, mint, emerald, gold, cyan
const ECO_COLORS = ['#10b981', '#22c55e', '#34d399', '#06b6d4', '#f59e0b', '#84cc16', '#a7f3d0'];

/**
 * Ambient background floating leaves
 */
export function initAmbientLeaves(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animationFrame;
  let leaves = [];
  const maxLeaves = 18;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class AmbientLeaf {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 0.4 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = (Math.random() - 0.5) * 0.02;
      this.color = ECO_COLORS[Math.floor(Math.random() * 3)];
      this.opacity = Math.random() * 0.35 + 0.15;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.angle) * 0.5 + this.speedX;
      this.angle += this.angleSpeed;

      if (this.y > canvas.height + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;

      // Draw gentle leaf curve
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(this.size * 0.7, 0, 0, this.size);
      ctx.quadraticCurveTo(-this.size * 0.7, 0, 0, -this.size);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < maxLeaves; i++) {
    leaves.push(new AmbientLeaf());
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let leaf of leaves) {
      leaf.update();
      leaf.draw();
    }
    animationFrame = requestAnimationFrame(loop);
  }

  loop();

  return () => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resize);
  };
}

/**
 * Burst celebration confetti when reaching milestones (25, 50, 75, 100 points)
 */
export function triggerCelebration(options = {}) {
  const {
    duration = 2800,
    particleCount = 65,
    originX = 0.5,
    originY = 0.4
  } = options;

  let canvas = document.getElementById('celebration-confetti-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'celebration-confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const startX = canvas.width * originX;
  const startY = canvas.height * originY;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.8;
    const velocity = Math.random() * 9 + 4;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - Math.random() * 4,
      size: Math.random() * 10 + 6,
      color: ECO_COLORS[Math.floor(Math.random() * ECO_COLORS.length)],
      alpha: 1,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.2,
      gravity: 0.18,
      isLeaf: Math.random() > 0.4
    });
  }

  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    if (elapsed > duration || particles.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.rotation += p.vRot;
      p.alpha = Math.max(0, 1 - (elapsed / duration));

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.isLeaf) {
        // Draw delicate leaf
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(p.size * 0.7, 0, 0, p.size);
        ctx.quadraticCurveTo(-p.size * 0.7, 0, 0, -p.size);
        ctx.fill();
      } else {
        // Star or ribbon rectangle
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.7);
      }

      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
