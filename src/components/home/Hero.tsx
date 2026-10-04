import Link from "next/link";

import { hero } from "@/content/home";

import styles from "./Hero.module.css";
import { HeroGrid } from "./HeroGrid";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <HeroGrid />
      <div className={`container ${styles.inner}`}>
        <div className={`eyebrow ${styles.meta}`}>
          <span>{hero.metaLeft}</span>
          <span className={styles.metaRight}>{hero.metaRight}</span>
        </div>

        <h1 id="hero-title" className={styles.title}>
          <span className={styles.line}>
            I design the <span className={`serif ${styles.word}`}>systems</span>
          </span>{" "}
          <span className={styles.line}>behind campaigns that</span>{" "}
          <span className={styles.line}>
            ship at{" "}
            <span className={`serif ${styles.word} ${styles.accent}`}>scale</span>.
          </span>
        </h1>

        <div className={styles.bottom}>
          <p className={styles.lead}>{hero.lead}</p>
          <div className={styles.ctas}>
            <Link href="/#work" className="btn btnPrimary">
              View selected work <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/#contact" className={`btn btnSecondary ${styles.secondary}`}>
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
