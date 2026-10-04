import { contact } from "@/content/home";
import { site } from "@/content/site";

import styles from "./Footer.module.css";

/** Contact + footer block (inverse surface). Shared by home and case pages. */
export function Footer() {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.contact}>
          <p className={`eyebrow ${styles.muted}`}>{contact.label}</p>
          <h2 className={styles.headline}>
            <span className={styles.line}>Let’s build the </span>
            <span className={styles.line}>
              next <span className="serif">system</span> together.
            </span>
          </h2>
          <a className={styles.email} href={`mailto:${site.email}`}>
            {site.email} <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className={styles.bar}>
          <p className={styles.muted}>
            © 2026 {site.name}
            <span className={styles.wide}> — {contact.location}</span>
          </p>
          <ul className={styles.socials}>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
            <li className={styles.wide}>
              <a href={site.resumeHref} download>
                Résumé (PDF)
              </a>
            </li>
            <li>
              <a href="#top">
                <span className={styles.wide}>Back to </span>
                <span className={styles.narrow}>Top </span>
                <span className={styles.wide}>top </span>
                ↑
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
