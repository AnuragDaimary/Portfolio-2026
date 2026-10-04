import styles from "./ArrowUpRight.module.css";

/**
 * Up-right arrow as an inline SVG, used instead of the "↗" character: that glyph is one of the
 * few arrows phones may draw as a colour emoji (iOS and some Android fonts do), so a text
 * arrow looks different on every device. This looks the same everywhere, scales with the
 * surrounding font size (1em) and takes the text colour (currentColor), so hover colours work.
 */
export function ArrowUpRight() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12 12 4" />
      <path d="M5.5 4H12v6.5" />
    </svg>
  );
}
