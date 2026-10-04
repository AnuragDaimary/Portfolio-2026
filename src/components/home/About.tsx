import { about } from "@/content/home";

import styles from "./About.module.css";

export function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-label">
      <div className="container">
        <div className={`grid4 ${styles.row}`}>
          <h2 id="about-label" className={`eyebrow ${styles.label}`} data-reveal>
            {about.label}
          </h2>
          <div className={styles.copy}>
            {about.paragraphs.map((text) => (
              <p key={text} className={styles.body} data-reveal>
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
