"use client";

import { useEffect, useRef } from "react";

import styles from "./Hero.module.css";

const SPACING = 28;
const RADIUS = 160;

/**
 * Dot grid behind the hero headline. Dots near the pointer grow and pick up the
 * accent colour. Static (no animation loop) for touch devices and
 * prefers-reduced-motion.
 */
export function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const root = document.documentElement;
    const interactive =
      matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let base = "#d6d4cc";
    let accent = "#ff4f00";
    const pointer = { x: -9999, y: -9999, active: false };
    let frame = 0;

    function readColors() {
      const cs = getComputedStyle(root);
      base = cs.getPropertyValue("--border").trim() || base;
      accent = cs.getPropertyValue("--accent").trim() || accent;
    }

    function draw() {
      frame = 0;
      ctx!.clearRect(0, 0, width, height);
      for (let x = SPACING / 2; x < width; x += SPACING) {
        for (let y = SPACING / 2; y < height; y += SPACING) {
          const d = pointer.active ? Math.hypot(x - pointer.x, y - pointer.y) : Infinity;
          const t = d < RADIUS ? 1 - d / RADIUS : 0;
          ctx!.globalAlpha = 0.55 + t * 0.45;
          ctx!.fillStyle = t > 0.05 ? accent : base;
          ctx!.beginPath();
          ctx!.arc(x, y, 1.1 + t * 2.2, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      schedule();
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      schedule();
    };
    const onLeave = () => {
      pointer.active = false;
      schedule();
    };

    readColors();
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    // Redraw with the new palette when the theme flips.
    const themeObserver = new MutationObserver(() => {
      readColors();
      schedule();
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    if (interactive) {
      // Listen on the parent: pointer events from the headline bubble up to it.
      const host = canvas.parentElement!;
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      return () => {
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
        resizeObserver.disconnect();
        themeObserver.disconnect();
        cancelAnimationFrame(frame);
      };
    }

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.grid} aria-hidden="true" />;
}
