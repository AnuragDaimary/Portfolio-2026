"use client";

import { useEffect, useRef } from "react";

import styles from "./Cursor.module.css";

/** Minimum time the pressed look stays up, so very fast clicks still visibly register. */
const HOLD_MS = 120;
/** Fraction of the remaining distance covered each frame (higher = snappier, 1 = no lag). */
const FOLLOW = 0.5;

/**
 * Circle cursor. The dot is white with mix-blend-mode: difference, so it reads as black on
 * the light theme and white on the dark one (and inverts correctly over the black footer).
 * Mouse-type pointers only; touch devices keep their normal behaviour.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const root = document.documentElement;
    const instant = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let seen = false;
    let pressedAt = 0;
    let releaseTimer = 0;

    const place = () => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const tick = () => {
      raf = 0;
      const dx = tx - x;
      const dy = ty - y;
      if (instant || Math.hypot(dx, dy) < 0.1) {
        x = tx;
        y = ty;
      } else {
        x += dx * FOLLOW;
        y += dy * FOLLOW;
        raf = requestAnimationFrame(tick);
      }
      place();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        // First move: appear right under the pointer, then hide the native cursor.
        seen = true;
        x = tx;
        y = ty;
        place();
        root.classList.add("custom-cursor");
      }
      el.dataset.visible = "";
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      clearTimeout(releaseTimer);
      pressedAt = performance.now();
      el.dataset.pressed = "";
    };

    const onUp = () => {
      const wait = Math.max(0, HOLD_MS - (performance.now() - pressedAt));
      clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => delete el.dataset.pressed, wait);
    };

    const onLeave = () => {
      delete el.dataset.visible;
      delete el.dataset.pressed;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("blur", onUp);
    root.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(releaseTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
      root.removeEventListener("mouseleave", onLeave);
      root.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <div ref={ref} className={styles.cursor} aria-hidden="true">
      <span className={styles.dot} />
    </div>
  );
}
