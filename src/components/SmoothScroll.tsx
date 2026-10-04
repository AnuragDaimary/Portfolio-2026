"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

type Smoother = import("gsap/ScrollSmoother").ScrollSmoother;

/**
 * GSAP ScrollSmoother wrapper. The wrapper/content divs render on the server
 * as plain blocks, so the page scrolls natively until (and unless) the smoother
 * starts — it is skipped entirely for prefers-reduced-motion.
 *
 * Anything `position: fixed` (the header) must live OUTSIDE this component.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const smootherRef = useRef<Smoother | null>(null);
  const refreshRef = useRef<() => void>(() => {});
  const rulesRef = useRef<() => void>(() => {});
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { ScrollSmoother }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/ScrollSmoother"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
      });
      smootherRef.current = smoother;
      document.documentElement.dataset.motion = "ready"; // cancels the failsafe in layout.tsx
      refreshRef.current = () => ScrollTrigger.refresh();

      // Hairline rules (see globals.css): draw each one in, once, when its top
      // edge reaches 80% of the viewport height. Header rules draw on load.
      const triggers: import("gsap/ScrollTrigger").ScrollTrigger[] = [];
      // Lines that start in the same moment (e.g. header + the hero/work divider on a
      // tall screen) are spaced RULE_STAGGER apart so they cascade instead of
      // drawing in lockstep. Lines triggered further apart get no delay.
      const RULE_STAGGER = 350;
      let nextRuleStart = 0;

      // Entrance timeline. T0 is the moment the loader is done; everything in view then
      // enters top to bottom on this one clock, each part starting shortly after the last
      // (they overlap rather than wait). Offsets in ms from T0:
      //   nav items 40+ (Header.module.css) -> header line 200 -> hero 350-720 (Hero.module.css)
      //   -> first section's line + content 850+ (here).
      // Content further down the page is scroll-triggered as usual.
      let T0 = 0;
      const HEADER_LINE_AT = 200;
      const BELOW_HERO_AT = 850;
      const INTRO_WINDOW = 600; // things triggering this soon after T0 belong to the entrance
      const inIntro = () => T0 > 0 && performance.now() < T0 + INTRO_WINDOW;

      const draw = (el: HTMLElement) => {
        if (el.hasAttribute("data-drawn")) return;
        const now = performance.now();
        const isHeaderLine = !!el.dataset.rule?.split(" ").includes("load");
        let start: number;
        if (isHeaderLine) {
          start = Math.max(now, T0 + HEADER_LINE_AT);
        } else if (inIntro()) {
          start = Math.max(now, T0 + BELOW_HERO_AT, nextRuleStart);
        } else {
          start = Math.max(now, nextRuleStart);
        }
        el.style.setProperty("--rule-delay", `${Math.round(start - now)}ms`);
        if (!isHeaderLine) nextRuleStart = start + RULE_STAGGER;
        el.dataset.drawn = "";
      };
      // True once a trigger's start point has been passed. The start is capped at the
      // page's maximum scroll, so content below the 80% line on a page too short to
      // scroll that far (tall monitors, short case studies) still counts as reached.
      const reached = (st: import("gsap/ScrollTrigger").ScrollTrigger) =>
        st.scroll() >= Math.min(st.start, ScrollTrigger.maxScroll(window));

      // Content reveal: [data-reveal] blocks fade up when they reach the same trigger
      // point as the hairlines (80% down the viewport). Blocks that trigger within a
      // moment of each other are staggered. Elements that also carry a rule fade only
      // (no rise), so their line doesn't drift while it draws.
      const queue: HTMLElement[] = [];
      let flushTimer = 0;
      const flushReveals = () => {
        flushTimer = 0;
        const els = queue.splice(0).sort((a, b) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
        );
        if (!els.length) return;
        const rise = 1.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
        // Part of the entrance? Then hold until just after the hero (BELOW_HERO_AT from T0).
        const delay = inIntro() ? Math.max(0, (T0 + BELOW_HERO_AT - performance.now()) / 1000) : 0;
        els.forEach((el) => (el.dataset.revealed = ""));
        gsap.fromTo(
          els,
          { opacity: 0, y: (_i, el: HTMLElement) => (el.hasAttribute("data-rule") ? 0 : rise) },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            delay,
            ease: "power4.out",
            // ~0.1s apart, but never more than 0.8s across a whole batch
            stagger: { amount: Math.min(0.1 * (els.length - 1), 0.8) },
            clearProps: "opacity,transform",
            overwrite: true,
          },
        );
      };
      const enqueueReveal = (el: HTMLElement) => {
        if (el.hasAttribute("data-revealed") || queue.includes(el)) return;
        queue.push(el);
        if (!flushTimer) flushTimer = window.setTimeout(flushReveals, 80);
      };
      const initReveals = () => {
        document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-init])").forEach((el) => {
          el.dataset.revealInit = "";
          const st = ScrollTrigger.create({
            trigger: el,
            start: "clamp(top 80%)", // same trigger point as the rules
            once: true,
            onEnter: () => enqueueReveal(el),
          });
          if (reached(st)) enqueueReveal(el); // already past (deep link / reload / short page)
          triggers.push(st);
        });
      };

      const initRules = () => {
        // Nothing enters while the loader is up. This is the single gate for every caller:
        // the route-change effect also reaches here on first mount, and on a fast (cached)
        // load it used to get here ~150ms in and draw the header under the loader.
        if (document.documentElement.classList.contains("intro")) return;
        if (!T0) T0 = performance.now();
        document.querySelectorAll<HTMLElement>("[data-rule]:not([data-rule-init])").forEach((el) => {
          el.dataset.ruleInit = "";
          if (el.dataset.rule?.split(" ").includes("load")) {
            draw(el);
            return;
          }
          const st = ScrollTrigger.create({
            trigger: el,
            // clamp(): lines near the page end still fire when scroll maxes out.
            start: "clamp(top 80%)",
            once: true,
            onEnter: () => draw(el),
          });
          // Already scrolled past (deep link / reload mid-page): don't leave it hidden.
          if (reached(st)) draw(el);
          triggers.push(st);
        });
        initReveals();
      };
      rulesRef.current = initRules;
      // Hold the entrance (header drop-in, hairlines) until the loader has left.
      // Called straight from the loader's timer, after the cover has gone and layout has
      // settled, so no animation-frame hop is needed (and none that could be skipped).
      const onLoaderDone = () => {
        initRules();
      };
      // html.intro lasts until the loader has fully faded (see Loader.tsx).
      if (document.documentElement.classList.contains("intro")) {
        window.addEventListener("loader:done", onLoaderDone, { once: true });
      } else {
        onLoaderDone();
      }

      const headerOffset = () =>
        document.querySelector("header")?.getBoundingClientRect().height ?? 0;

      function scrollToHash(hash: string, animate: boolean) {
        if (hash === "#top" || hash === "#") {
          smoother.scrollTo(0, animate);
          return true;
        }
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (!target) return false;
        smoother.scrollTo(target, animate, `top ${headerOffset()}px`);
        return true;
      }

      // Same-page hash links (nav, CTAs, back-to-top, skip link) go through the
      // smoother; native anchor jumps don't work inside a transformed container.
      const onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
        const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
        if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
        const url = new URL(a.href, location.href);
        if (!url.hash || url.origin !== location.origin || url.pathname !== location.pathname) return;
        if (scrollToHash(url.hash, true)) {
          // preventDefault is enough to stop Next's <Link> from also scrolling/navigating (it
          // bails out on defaultPrevented). Do NOT stopPropagation: the click must still reach
          // the link's own onClick, e.g. the mobile menu closing itself.
          e.preventDefault();
          history.pushState(null, "", url.hash === "#top" ? location.pathname : url.hash);
        }
      };
      document.addEventListener("click", onClick, true);

      // Keyboard focus: the browser would scroll the (overflow:hidden) wrapper
      // instead of the page, so reset it and move the smoother ourselves.
      const wrapper = document.getElementById("smooth-wrapper");
      const onFocusIn = (e: FocusEvent) => {
        const el = e.target as HTMLElement;
        if (wrapper) wrapper.scrollTop = 0;
        if (!wrapper?.contains(el)) return;
        const r = el.getBoundingClientRect();
        if (r.top < headerOffset() || r.bottom > innerHeight) {
          smoother.scrollTo(el, false, "center center");
        }
      };
      document.addEventListener("focusin", onFocusIn);

      // Content height changes (fonts, route swaps, menu) need a refresh.
      const content = document.getElementById("smooth-content");
      let raf = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      if (content) ro.observe(content);

      // Deep link, e.g. /#experience on a fresh visit; otherwise always start at the top.
      if (location.hash) {
        requestAnimationFrame(() => scrollToHash(location.hash, false));
      } else {
        smoother.scrollTop(0);
      }

      cleanup = () => {
        document.removeEventListener("click", onClick, true);
        document.removeEventListener("focusin", onFocusIn);
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("loader:done", onLoaderDone);
        clearTimeout(flushTimer);
        triggers.forEach((t) => t.kill());
        document.querySelectorAll<HTMLElement>("[data-rule-init]").forEach((el) => delete el.dataset.ruleInit);
        document.querySelectorAll<HTMLElement>("[data-reveal-init]").forEach((el) => delete el.dataset.revealInit);
        smoother.kill();
        smootherRef.current = null;
      };
    })().catch(() => {
      // Animation code failed to load: reveal everything rather than leave it hidden.
      document.documentElement.classList.remove("rules", "loading", "intro");
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  // Client-side route change: start at the top (or the hash target). Wait two
  // frames so the new page is laid out and the URL hash is updated, then refresh
  // the smoother's height before scrolling.
  useEffect(() => {
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => {
        const smoother = smootherRef.current;
        if (!smoother) return;
        refreshRef.current();
        const id = decodeURIComponent(location.hash.slice(1));
        const target = id ? document.getElementById(id) : null;
        if (target) {
          const h = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
          smoother.scrollTo(target, false, `top ${h}px`);
        } else {
          smoother.scrollTop(0);
        }
        // After the scroll reset, so lines below the fold aren't treated as already passed.
        rulesRef.current();
      });
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [pathname]);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
