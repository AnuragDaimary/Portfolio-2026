"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./Loader.module.css";

// "Four-Petal Spiral" (hypotrochoid) — parameters from the reference snippet.
const CONFIG = {
  particleCount: 84,
  trailSpan: 0.34,
  durationMs: 1500, // one full lap of the curve; the loader never leaves before this (MIN_VISIBLE_MS)
  rotationDurationMs: 28000,
  pulseDurationMs: 4200,
  strokeWidth: 3,
  R: 4,
  r: 1,
  d: 3,
  scale: 2.2,
  breath: 0.45,
};

/** How long the loader stays up, measured from the start of page load. */
const MIN_TOTAL_MS = 2000;
/** Floor after hydration: at least one full lap always plays before the fade. */
const MIN_VISIBLE_MS = CONFIG.durationMs;
const FADE_MS = 800;

const SVG_NS = "http://www.w3.org/2000/svg";

function point(progress: number, detailScale: number) {
  const { R, r, d: d0, scale, breath } = CONFIG;
  const t = progress * Math.PI * 2;
  const d = d0 + detailScale * 0.25;
  const k = (R - r) / r;
  const x = (R - r) * Math.cos(t) + d * Math.cos(k * t);
  const y = (R - r) * Math.sin(t) - d * Math.sin(k * t);
  const m = scale + detailScale * breath;
  return { x: 50 + x * m, y: 50 + y * m };
}

const wrap = (p: number) => ((p % 1) + 1) % 1;

function detailScaleAt(time: number) {
  const angle = ((time % CONFIG.pulseDurationMs) / CONFIG.pulseDurationMs) * Math.PI * 2;
  return 0.52 + ((Math.sin(angle + 0.55) + 1) / 2) * 0.48;
}

function buildPath(detailScale: number, steps = 360) {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const p = point(i / steps, detailScale);
    d += `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }
  return d;
}

export function Loader() {
  const groupRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [phase, setPhase] = useState<"loading" | "leaving" | "gone">("loading");

  // The pre-paint script in layout.tsx adds html.loading when the loader should
  // run (JS on, no reduced-motion). Otherwise the overlay is display:none.
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("loading")) {
      setPhase("gone");
      return;
    }

    const group = groupRef.current;
    const path = pathRef.current;
    if (!group || !path) return;

    const circles = Array.from({ length: CONFIG.particleCount }, () => {
      const c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("fill", "currentColor");
      group.appendChild(c);
      return c;
    });

    let raf = 0;
    const startedAt = performance.now();
    const frame = (now: number) => {
      const time = now - startedAt;
      const progress = (time % CONFIG.durationMs) / CONFIG.durationMs;
      const detail = detailScaleAt(time);
      group.setAttribute(
        "transform",
        `rotate(${-((time % CONFIG.rotationDurationMs) / CONFIG.rotationDurationMs) * 360} 50 50)`,
      );
      path.setAttribute("d", buildPath(detail));
      circles.forEach((node, i) => {
        const tail = i / (CONFIG.particleCount - 1);
        const p = point(wrap(progress - tail * CONFIG.trailSpan), detail);
        const fade = Math.pow(1 - tail, 0.56);
        node.setAttribute("cx", p.x.toFixed(2));
        node.setAttribute("cy", p.y.toFixed(2));
        node.setAttribute("r", (0.7 + fade * 1.7).toFixed(2));
        node.setAttribute("opacity", (0.04 + fade * 0.96).toFixed(3));
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // performance.now() is time since navigation start, so this holds the loader
    // for ~2s total from page load, including hydration.
    const wait = Math.max(MIN_VISIBLE_MS, MIN_TOTAL_MS - performance.now());
    // 1. Fade the cover out; unlock scroll and let the hero headline rise as it clears.
    const leave = window.setTimeout(() => {
      setPhase("leaving");
      root.classList.remove("loading");
    }, wait);
    // 2. Only once the cover has fully faded: announce "done" so the header drop-in and
    //    hairlines (SmoothScroll) start on a clear screen, not underneath the loader.
    const done = window.setTimeout(() => {
      root.classList.remove("intro");
      window.dispatchEvent(new Event("loader:done"));
    }, wait + FADE_MS);
    const remove = window.setTimeout(() => setPhase("gone"), wait + FADE_MS + 100);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(leave);
      clearTimeout(done);
      clearTimeout(remove);
      circles.forEach((c) => c.remove());
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={styles.loader}
      data-leaving={phase === "leaving" ? "" : undefined}
      role="status"
      aria-label="Loading"
    >
      <svg className={styles.svg} viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <g ref={groupRef}>
          <path
            ref={pathRef}
            stroke="currentColor"
            strokeWidth={CONFIG.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.1"
          />
        </g>
      </svg>
    </div>
  );
}
