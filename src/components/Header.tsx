"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { site } from "@/content/site";

import styles from "./Header.module.css";
import { ThemeToggle } from "./ThemeToggle";

function Wordmark() {
  return (
    <Link href="/" className={styles.wordmark} aria-label={`${site.name} — home`}>
      <span className={styles.dot} aria-hidden="true" />
      {site.name}
    </Link>
  );
}

function Actions({ children }: { children?: React.ReactNode }) {
  return (
    <div className={styles.actions}>
      <a className={`btn btnSmall ${styles.resume}`} href={site.resumeHref} download>
        Résumé <span aria-hidden="true">↓</span>
      </a>
      {children}
      <ThemeToggle />
    </div>
  );
}

/** Sticky site header. `case` swaps nav for a back link, per the case-study frame. */
export function Header({ variant = "home" }: { variant?: "home" | "case" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (variant === "case") {
    return (
      <header className={styles.header}>
        <div className={`container ${styles.bar} ${styles.caseBar}`}>
          <Link href="/#work" className={styles.back}>
            <span aria-hidden="true">←</span> All work
          </Link>
          <Wordmark />
          <Actions />
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Wordmark />
        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.links}>
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Actions>
            <button
              type="button"
              className={styles.menuButton}
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
          </ul>
        </div>
      )}
    </header>
  );
}
