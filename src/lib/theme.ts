// Time-of-day theme rules, shared by the pre-paint script in layout.tsx and the toggle so
// they cannot drift apart. Everything uses the *viewer's* local clock (their timezone).
//
//   07:00 – 19:59  light
//   20:00 – 06:59  dark
//
// A manual toggle is respected only until the next switch time, then the page goes back to
// following the clock — otherwise one late-night flip to dark would stick through the day.

export type Theme = "light" | "dark";

export const DAY_START_HOUR = 7;
export const NIGHT_START_HOUR = 20;
export const OVERRIDE_KEY = "theme-override";

export function autoTheme(date: Date = new Date()): Theme {
  const h = date.getHours();
  return h >= DAY_START_HOUR && h < NIGHT_START_HOUR ? "light" : "dark";
}

/** Timestamp (ms) of the next 07:00 / 20:00 boundary after `date`, in local time. */
export function nextBoundary(date: Date = new Date()): number {
  for (const hour of [DAY_START_HOUR, NIGHT_START_HOUR]) {
    const t = new Date(date);
    t.setHours(hour, 0, 0, 0);
    if (t > date) return t.getTime();
  }
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(DAY_START_HOUR, 0, 0, 0);
  return tomorrow.getTime();
}

/**
 * Runs before first paint (inlined in <head>) and sets data-theme on <html>. Plain ES5 string
 * because it executes before any bundle loads. Mirrors autoTheme() + the override check.
 * Also removes the old "theme" key from the previous always-light implementation.
 */
export const themeBootstrap = `var hr=new Date().getHours(),t=hr>=${DAY_START_HOUR}&&hr<${NIGHT_START_HOUR}?"light":"dark";try{var raw=localStorage.getItem("${OVERRIDE_KEY}");if(raw){var o=JSON.parse(raw);if(o&&(o.theme==="light"||o.theme==="dark")&&Date.now()<o.until)t=o.theme;else localStorage.removeItem("${OVERRIDE_KEY}")}localStorage.removeItem("theme")}catch(e){}document.documentElement.dataset.theme=t;`;
