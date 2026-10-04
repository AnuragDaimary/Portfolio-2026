import { about } from "@/content/home";

import styles from "./About.module.css";

export function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-label">
      <div className={`container ${styles.inner}`}>
        <div className={`grid4 ${styles.head}`}>
          <h2 id="about-label" className={`eyebrow ${styles.label}`}>
            {about.label}
          </h2>
          <p className={styles.statement}>
            <span className={styles.full}>{about.statement}</span>
            <span className={styles.short}>{about.statementShort}</span>
          </p>
        </div>

        <ol className={styles.principles}>
          {about.principles.map((p, i) => (
            <li key={p.title} className={styles.principle}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <div className={styles.copy}>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.body}>{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
