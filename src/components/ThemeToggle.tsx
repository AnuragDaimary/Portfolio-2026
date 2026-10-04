"use client";

import { useSyncExternalStore } from "react";

import { OVERRIDE_KEY, autoTheme, nextBoundary, type Theme } from "@/lib/theme";

import styles from "./ThemeToggle.module.css";

// The <html data-theme> attribute is the source of truth (set pre-paint by the
// inline script in layout.tsx), so the component just observes it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";
const getServerSnapshot = (): Theme => "light";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      // Honour the choice until the next 07:00 / 20:00 switch, then follow the clock again.
      // Picking what the clock would pick anyway needs no override.
      if (next === autoTheme()) localStorage.removeItem(OVERRIDE_KEY);
      else localStorage.setItem(OVERRIDE_KEY, JSON.stringify({ theme: next, until: nextBoundary() }));
    } catch {
      /* storage unavailable (private mode) — theme still applies for this visit */
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label="Dark mode"
      className={styles.toggle}
      onClick={toggle}
    >
      <span className={styles.knob} aria-hidden="true" />
      <span className={`${styles.icon} ${styles.sun}`} aria-hidden="true">
        <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <circle cx="7" cy="7" r="2.6" />
          <path d="M7 1v1.6M7 11.4V13M1 7h1.6M11.4 7H13M2.8 2.8l1.1 1.1M10.1 10.1l1.1 1.1M2.8 11.2l1.1-1.1M10.1 3.9l1.1-1.1" />
        </svg>
      </span>
      <span className={`${styles.icon} ${styles.moon}`} aria-hidden="true">
        <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M11.8 8.4A5 5 0 0 1 5.6 2.2a5 5 0 1 0 6.2 6.2Z" />
        </svg>
      </span>
    </button>
  );
}
