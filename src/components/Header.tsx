"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import { site } from "@/content/site";

import styles from "./Header.module.css";
import { ThemeToggle } from "./ThemeToggle";

/** Position in the entrance stagger (left to right); read as --i in the CSS. */
const order = (i: number) => ({ "--i": i }) as CSSProperties;

function Wordmark({ index }: { index: number }) {
  return (
    <Link
      href="/"
      className={`${styles.wordmark} ${styles.drop}`}
      style={order(index)}
      aria-label={`${site.name} — home`}
    >
      <span className={styles.dot} aria-hidden="true" />
      {site.name}
    </Link>
  );
}

function Actions({ start, children }: { start: number; children?: ReactNode }) {
  return (
    <div className={styles.actions}>
      {/* Wrapped so the entrance transform doesn't fight the button's own transitions. */}
      <span className={`${styles.resumeSlot} ${styles.drop}`} style={order(start)}>
        <a className={`btn btnSmall ${styles.resume}`} href={site.resumeHref} download>
          Résumé <span aria-hidden="true">↓</span>
        </a>
      </span>
      {children}
      <span className={`${styles.toggleSlot} ${styles.drop}`} style={order(start + 1)}>
        <ThemeToggle />
      </span>
    </div>
  );
}

/** Fixed site header. Case-study routes swap the nav for a back link, per the Figma frame. */
export function Header() {
  const [open, setOpen] = useState(false);
  const variant = usePathname().startsWith("/work/") ? "case" : "home";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (variant === "case") {
    return (
      <header className={styles.header} data-rule="bottom load">
        <div className={`container ${styles.bar} ${styles.caseBar}`}>
          <Link href="/#work" className={`${styles.back} ${styles.drop}`} style={order(0)}>
            <span aria-hidden="true">←</span> All work
          </Link>
          <Wordmark index={1} />
          <Actions start={2} />
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header} data-rule="bottom load">
      <div className={`container ${styles.bar}`}>
        <Wordmark index={0} />
        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.links}>
            {site.nav.map((item, i) => (
              <li key={item.href} className={styles.drop} style={order(i + 1)}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Actions start={site.nav.length + 1}>
            <button
              type="button"
              className={`${styles.menuButton} ${styles.drop}`}
              style={order(site.nav.length + 2)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </Actions>
        </nav>
      </div>

      {open && (
        <div id="mobile-menu" className={styles.sheet}>
          <ul className="container">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            {/* The header bar drops its Résumé button on very narrow phones. */}
            <li className={styles.sheetResume}>
              <a href={site.resumeHref} download onClick={() => setOpen(false)}>
                Résumé <span aria-hidden="true">↓</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
