"use client";

import { useEffect, useRef } from "react";

// Helper to draw a rounded rectangle
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function HeroCommitGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse state with smooth continuous lerping
    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      active: false,
      opacity: 0,
    };

    const cellSize = 13;
    const gap = 3.5;
    const radius = 2.5;
    const glowRadius = 175;

    function resize() {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseEnter = () => {
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    function render() {
      if (!ctx || width === 0 || height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Smooth mouse movement and fading
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.18;
        mouse.y += (mouse.targetY - mouse.y) * 0.18;
        mouse.opacity += (1 - mouse.opacity) * 0.1;
      } else {
        mouse.opacity += (0 - mouse.opacity) * 0.06;
      }

      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.documentElement.classList.contains("dark");

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const step = cellSize + gap;
      const cols = Math.ceil(width / step) + 1;
      const rows = Math.ceil(height / step) + 1;

      // Center the grid
      const offsetX = Math.floor((width % step) / 2);
      const offsetY = Math.floor((height % step) / 2);

      const baseBorderAlpha = isDark ? 0.12 : 0.16;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = offsetX + c * step;
          const y = offsetY + r * step;

          // Box center
          const centerX = x + cellSize / 2;
          const centerY = y + cellSize / 2;

          // Distance to mouse
          const dx = centerX - mouse.x;
          const dy = centerY - mouse.y;
          const dist = Math.hypot(dx, dy);

          // Smooth continuous falloff without hard circle boundary
          let smoothGlow = 0;
          if (dist < glowRadius && mouse.opacity > 0.005) {
            const normalized = dist / glowRadius;
            // Smooth cubic ease-out curve ensuring zero slope at the boundary
            const falloff = 1 - normalized;
            smoothGlow = falloff * falloff * falloff * mouse.opacity;
          }

          drawRoundedRect(ctx, x, y, cellSize, cellSize, radius);

          // 1. Proportional glowing orange fill (0 fill in default state)
          if (smoothGlow > 0.002) {
            const fillAlpha = smoothGlow * 0.48;
            ctx.fillStyle = `rgba(249, 115, 22, ${fillAlpha})`;
            ctx.fill();
          }

          // 2. Subtle orange rounded border (subtle by default, glowing on hover)
          const borderAlpha = Math.min(1, baseBorderAlpha + smoothGlow * 0.78);
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(249, 115, 22, ${borderAlpha})`;
          ctx.stroke();

          // 3. Subtle specular highlight under the exact mouse position
          if (smoothGlow > 0.45) {
            const highlightAlpha = (smoothGlow - 0.45) * 0.55;
            ctx.fillStyle = `rgba(255, 237, 213, ${highlightAlpha})`;
            ctx.fill();
          }
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
