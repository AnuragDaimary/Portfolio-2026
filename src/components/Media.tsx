import type { CSSProperties } from "react";

import styles from "./Media.module.css";

interface MediaProps {
  caption: string;
  /** Desktop height in px. Below 700px the height scales down (see CSS). */
  height: number;
  className?: string;
}

/**
 * Placeholder frame for project imagery. When real assets exist, render an
 * <Image> in here and keep the caption as alt text.
 */
export function Media({ caption, height, className }: MediaProps) {
  const style = { "--h": `${height / 16}rem` } as CSSProperties;
  return (
    <div className={`${styles.media} ${className ?? ""}`} style={style} role="img" aria-label={caption}>
      <span className={styles.caption}>[ {caption} ]</span>
    </div>
  );
}
