import Link from "next/link";
import type { CSSProperties } from "react";

import type { Project } from "@/content/work";

import { Media } from "../Media";
import styles from "./CaseStudy.module.css";

export function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const c = project.case;

  return (
    <>
      <section className={styles.title} aria-labelledby="case-title">
        <div className={`container ${styles.titleInner}`}>
          <p className="eyebrow" data-reveal>
            {c?.eyebrow ?? "Case study — Samsung Canada"}
          </p>
          <h1 id="case-title" className={styles.h1} data-reveal>
            {project.title}
          </h1>
          <p className={styles.summary} data-reveal>{c?.summary ?? project.tagline}</p>

          {c ? (
            <dl className={styles.facts} data-rule="top" data-reveal>
              {c.facts.map((f) => (
                <div key={f.label} className={styles.fact}>
                  <dt className="eyebrow">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className={`eyebrow ${styles.soon}`} data-rule="top" data-reveal>Full case study coming soon</p>
          )}
        </div>
      </section>

      <div className="container" data-reveal>
        <Media
          caption={c?.hero.caption ?? project.card.caption}
          height={c?.hero.height ?? 720}
        />
      </div>

      {c?.sections.map((s) => (
        <section key={s.number} className={styles.block} aria-labelledby={`case-${s.number}`}>
          <div className={`container ${styles.blockInner}`}>
            <div className={`grid4 ${styles.blockHead}`} data-reveal>
              <div className={styles.labelCol}>
                <span className={styles.num}>{s.number}</span>
                <h2 id={`case-${s.number}`} className={styles.blockTitle}>
                  {s.title}
                </h2>
              </div>
              <p className={styles.body}>{s.body}</p>
            </div>
            <div
              className={styles.mediaRow}
              style={{ "--cols": s.media.length } as CSSProperties}
            >
              {s.media.map((m, i) => (
                <div key={i} data-reveal>
                  <Media caption={m.caption} height={m.height} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {c && (
        <section className={styles.outcome} aria-labelledby="case-outcome">
          <div className={`container ${styles.outcomeInner}`}>
            <h2 id="case-outcome" className="eyebrow" data-reveal>
              04 — Outcome
            </h2>
            <ul className={styles.stats}>
              {c.outcome.stats.map((s) => (
                <li key={s.label} className={styles.stat} data-rule="top" data-reveal>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </li>
              ))}
            </ul>
            {c.outcome.note && (
              <p className={styles.note} data-reveal>
                ✦ {c.outcome.note}
              </p>
            )}
          </div>
        </section>
      )}

      <Link href={`/work/${next.slug}`} className={styles.next}>
        <div className={`container ${styles.nextInner}`} data-reveal>
          <p className={`eyebrow ${styles.nextLabel}`}>Next case study</p>
          <p className={styles.nextRow}>
            <span className={styles.nextTitle}>{next.title}</span>
            <span className={styles.nextArrow} aria-hidden="true">→</span>
          </p>
        </div>
      </Link>
    </>
  );
}
