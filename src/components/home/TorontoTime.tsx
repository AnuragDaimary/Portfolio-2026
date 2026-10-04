"use client";

import { useEffect, useState } from "react";

import styles from "./TorontoTime.module.css";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto", // handles EST/EDT switchovers
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

/** Same width as any real value ("05:11 PM" is always 8 chars), so nothing shifts on mount. */
const PLACEHOLDER = "00:00 AM";

/**
 * Live Toronto time for the hero's location line. Rendered on the client only (the server
 * can't know the current minute), with a same-width invisible placeholder until then.
 */
export function TorontoTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    let interval = 0;
    const update = () => setTime(formatter.format(new Date()));

    update();
    // Tick exactly on each new minute rather than drifting from page load.
    const msToNextMinute = 60_000 - (Date.now() % 60_000);
    const first = window.setTimeout(() => {
      update();
      interval = window.setInterval(update, 60_000);
    }, msToNextMinute);

    // Timers are throttled in background tabs; catch up as soon as the tab is visible again.
    const onVisible = () => document.visibilityState === "visible" && update();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <span className={styles.clock} data-ready={time ? "" : undefined}>
      {" · "}
      <time aria-label={time ? `Current time in Toronto: ${time}` : undefined}>
        {time ?? PLACEHOLDER}
      </time>
    </span>
  );
}
