"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { KeySlide } from "@/content/work";

import styles from "./KeyVisualCarousel.module.css";

const DEFAULT_INTERVAL_MS = 5000;

interface Props {
  slides: KeySlide[];
  /** How wide the frame is at each screen width, so Next picks the right file size. */
  sizes: string;
  /** Time each visual stays up. The active indicator's fill takes exactly this long. */
  intervalMs?: number;
  className?: string;
}

/**
 * Key-visual slideshow for a project card. Slides cross-fade; the indicator below shows one dot
 * per visual, with the current one stretched into a line that fills up to show when the next
 * visual is coming.
 *
 * The fill animation IS the timer: when it ends (onAnimationEnd) we advance, so what you see and
 * when it switches can never drift apart. It runs only while the card is mostly on screen, the
 * tab is visible and the page entrance has finished, and it pauses while the pointer is over it.
 * Visitors with reduced motion get no auto-advance (the first visual just stays).
 *
 * The indicator is decorative (aria-hidden, not clickable): this whole card is a link, and
 * buttons inside a link are invalid and would navigate.
 */
export function KeyVisualCarousel({
  slides,
  sizes,
  intervalMs = DEFAULT_INTERVAL_MS,
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  // Frame shape comes from the first visual; warn in dev if the others differ (they'd crop).
  const first = slides[0]!.image;
  if (process.env.NODE_ENV !== "production") {
    const ratio = first.width / first.height;
    slides.forEach((s, i) => {
      if (Math.abs(s.image.width / s.image.height - ratio) > 0.01) {
        console.warn(`KeyVisualCarousel: slide ${i + 1} is not the same shape as slide 1 and will be cropped.`);
      }
    });
  }

  useEffect(() => {
    setAutoplay(!matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Wait for the loader / entrance (html.intro is removed when it is done).
  useEffect(() => {
    const root = document.documentElement;
    const check = () => setIntroDone(!root.classList.contains("intro"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Only run while most of the card is on screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setTabVisible(document.visibilityState === "visible");
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  const playing = autoplay && introDone && inView && tabVisible;
  const next = () => setIndex((i) => (i + 1) % slides.length);

  const style = {
    aspectRatio: `${first.width} / ${first.height}`,
    "--interval": `${intervalMs}ms`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className ?? ""}`}
      style={style}
      data-playing={playing ? "" : undefined}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={styles.slide}
          data-active={i === index ? "" : undefined}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            sizes={sizes}
            placeholder="blur"
            className={styles.img}
          />
        </div>
      ))}

      <div className={styles.indicator} aria-hidden="true" data-static={autoplay ? undefined : ""}>
        {slides.map((_, i) => (
          <span key={i} className={styles.dot} data-active={i === index ? "" : undefined}>
            {/* key={index} restarts the fill from zero for every new slide */}
            {autoplay && i === index && (
              <span key={index} className={styles.fill} onAnimationEnd={next} />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
