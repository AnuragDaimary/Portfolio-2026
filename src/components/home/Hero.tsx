import { hero } from "@/content/home";

import styles from "./Hero.module.css";
import { TorontoTime } from "./TorontoTime";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={`eyebrow ${styles.meta}`}>
          <span>{hero.metaLeft}</span>
          <span className={styles.metaRight}>
            {hero.metaRight}
            <TorontoTime />
          </span>
        </div>

        <div className={styles.copy}>
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.line}>{hero.greeting}</span>
            {hero.tagline.map((line) => (
              <span key={line} className={styles.line}>
                {" "}
                {line}
              </span>
            ))}
          </h1>

          <p className={styles.sub}>
            {hero.subBefore}
            <a
              className={styles.employer}
              href={hero.employerHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {hero.employer}
            </a>
            {hero.subAfter}
          </p>
        </div>
      </div>
    </section>
  );
}
