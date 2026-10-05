import Link from "next/link";

import { work } from "@/content/home";
import { projects } from "@/content/work";

import { ArrowUpRight } from "../ArrowUpRight";
import { KeyVisualCarousel } from "../KeyVisualCarousel";
import { Media } from "../Media";
import styles from "./SelectedWork.module.css";

export function SelectedWork() {
  return (
    <section id="work" className={styles.work} data-rule="top" aria-labelledby="work-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.head} data-reveal>
          <div className={styles.titleBlock}>
            <p className="eyebrow">{work.label}</p>
            <h2 id="work-title" className={styles.title}>
              {work.title}
            </h2>
          </div>
          <p className={styles.blurb}>{work.blurb}</p>
        </div>

        <div className={styles.cards}>
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              className={`${styles.card} ${p.span === 1 ? styles.wide : ""}`}
              data-reveal
            >
              <div className={styles.frame}>
                {p.card.slides ? (
                  <KeyVisualCarousel
                    slides={p.card.slides}
                    sizes="(min-width: 1440px) 1224px, 100vw"
                    className={styles.media}
                  />
                ) : (
                  <Media
                    caption={p.card.caption}
                    height={p.card.height}
                    image={p.card.image}
                    aspect={p.span === 2 ? 16 / 9 : undefined}
                    sizes={p.span === 1 ? "(min-width: 1440px) 1224px, 100vw" : "(min-width: 700px) 50vw, 100vw"}
                    className={styles.media}
                  />
                )}
              </div>
              <div className={styles.meta}>
                <div className={styles.metaText}>
                  <h3 className={styles.cardTitle}>
                    {p.title}
                    <span className={styles.go} aria-hidden="true">
                      <ArrowUpRight />
                    </span>
                  </h3>
                  <p className={styles.tagline}>{p.tagline}</p>
                </div>
                <p className={`eyebrow ${styles.tags}`}>{p.tags}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.more} data-rule="bottom">
          <p className={`eyebrow ${styles.moreLabel}`} data-reveal>
            More work
          </p>
          <ul>
            {work.more.map((row) => (
              <li key={row.title} className={styles.row} data-rule="top" data-reveal>
                <h3 className={styles.rowTitle}>{row.title}</h3>
                <p className={styles.rowBody}>{row.body}</p>
                <span className={styles.rowCount}>{row.count}</span>
                <span className={styles.rowArrow} aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
