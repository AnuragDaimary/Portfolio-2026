import { experience } from "@/content/home";

import styles from "./Experience.module.css";

export function Experience() {
  return (
    <section id="experience" className={styles.section} aria-labelledby="exp-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.head} data-reveal>
          <p className="eyebrow">
            <span className={styles.labelFull}>{experience.label}</span>
            <span className={styles.labelShort}>{experience.labelShort}</span>
          </p>
          <h2 id="exp-title" className={styles.title}>
            {experience.title}
          </h2>
        </div>

        <div className={styles.columns}>
          <ol className={styles.roles}>
            {experience.roles.map((r) => (
              <li key={r.title} className={styles.role} data-rule="top" data-reveal>
                <p className={styles.dates}>{r.dates}</p>
                <div className={styles.roleText}>
                  <h3 className={styles.roleTitle}>{r.title}</h3>
                  <p className={styles.roleBody}>{r.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className={styles.skills} data-reveal>
            <p className={`eyebrow ${styles.skillsLabel}`}>Skills</p>
            <div className={styles.skillGroups}>
              {experience.skills.map((g) => (
                <div key={g.group} className={styles.group}>
                  <h3 className={`eyebrow ${styles.groupLabel}`}>{g.group}</h3>
                  <ul className={styles.chips}>
                    {g.items.map((item) => (
                      <li key={item} className="chip">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
