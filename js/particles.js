/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — NAOUFAL BOUKHACHA ELIDRISSI
   particles.js — Animated Canvas : Nodes + Electrical Connections
═══════════════════════════════════════════════════════════════ */

'use strict';

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  /* — Config — */
  const CONFIG = {
    nodeCount:       60,
    nodeRadius:      2,
    connectionDist:  160,
    speed:           0.35,
    accentColor:     '0, 212, 255',    /* cyan électrique */
    accentColor2:    '124, 58, 237',   /* violet */
    nodeFadeIn:      true,
  };

  let W, H, nodes = [];
  let animFrame;

  /* ─── Resize ─── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    initNodes();
  });

  /* ─── Node class ─── */
  class Node {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : (Math.random() < 0.5 ? -10 : H + 10);
      this.vx = (Math.random() - 0.5) * CONFIG.speed;
      this.vy = (Math.random() - 0.5) * CONFIG.speed;
      this.r  = Math.random() * CONFIG.nodeRadius + 0.5;
      this.opacity = initial ? Math.random() * 0.6 + 0.1 : 0;
      this.targetOpacity = Math.random() * 0.6 + 0.2;
      // Alternate between two accent colors
      this.colorIndex = Math.random() > 0.75 ? CONFIG.accentColor2 : CONFIG.accentColor;
      this.pulse = Math.random() * Math.PI * 2; // pulse phase offset
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.02;

      // Fade in
      if (this.opacity < this.targetOpacity) {
        this.opacity = Math.min(this.opacity + 0.005, this.targetOpacity);
      }

      // Bounce off walls
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;

      // Clamp
      this.x = Math.max(0, Math.min(W, this.x));
      this.y = Math.max(0, Math.min(H, this.y));
    }

    draw() {
      const pulseScale = 1 + Math.sin(this.pulse) * 0.3;
      const alpha = this.opacity;

      // Glow halo
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 5 * pulseScale);
      gradient.addColorStop(0, `rgba(${this.colorIndex}, ${alpha * 0.8})`);
      gradient.addColorStop(1, `rgba(${this.colorIndex}, 0)`);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 5 * pulseScale, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * pulseScale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.colorIndex}, ${alpha})`;
      ctx.fill();
    }
  }

  /* ─── Init nodes ─── */
  function initNodes() {
    nodes = [];
    for (let i = 0; i < CONFIG.nodeCount; i++) {
      nodes.push(new Node());
    }
  }

  /* ─── Draw connections ─── */
  function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectionDist) {
          const alpha = (1 - dist / CONFIG.connectionDist) * 0.25 * Math.min(a.opacity, b.opacity);

          // Gradient line between two nodes
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `rgba(${a.colorIndex}, ${alpha})`);
          grad.addColorStop(1, `rgba(${b.colorIndex}, ${alpha})`);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  /* ─── Draw grid (subtle) ─── */
  function drawGrid() {
    const gridSize = 80;
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.025)';
    ctx.lineWidth = 0.5;

    for (let x = 0; x < W; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    for (let y = 0; y < H; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
  }

  /* ─── Main loop ─── */
  function loop() {
    ctx.clearRect(0, 0, W, H);

    drawGrid();
    drawConnections();
    nodes.forEach(n => { n.update(); n.draw(); });

    animFrame = requestAnimationFrame(loop);
  }

  /* ─── Start ─── */
  resize();
  initNodes();
  loop();

  // Pause when tab hidden (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrame);
    } else {
      loop();
    }
  });

})();