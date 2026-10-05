import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import styles from "./Media.module.css";

interface MediaProps {
  caption: string;
  /** Placeholder height in px (desktop). Below 700px the height scales down (see CSS). */
  height: number;
  /** Real image. When set, the frame takes the image's own proportions (nothing is cropped). */
  image?: StaticImageData;
  /** Placeholder only: width / height. Lets neighbouring cards keep one height while some of
   *  them are still grey boxes and others already hold an image. */
  aspect?: number;
  /** How wide the image is displayed at each screen width, so Next picks the right file size. */
  sizes?: string;
  className?: string;
}

/**
 * Frame for project imagery: a grey captioned placeholder until `image` is provided, then the
 * image itself (resized, compressed and lazy-loaded by next/image, with a blurred preview).
 */
export function Media({ caption, height, image, aspect, sizes = "100vw", className }: MediaProps) {
  if (image) {
    return (
      <div
        className={`${styles.photo} ${className ?? ""}`}
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
      >
        <Image
          src={image}
          alt={caption}
          fill
          sizes={sizes}
          placeholder="blur"
          className={styles.img}
        />
      </div>
    );
  }

  const style = { "--h": `${height / 16}rem`, ...(aspect ? { "--aspect": aspect } : {}) } as CSSProperties;
  return (
    <div
      className={`${styles.media} ${aspect ? styles.ratio : ""} ${className ?? ""}`}
      style={style}
      role="img"
      aria-label={caption}
    >
      <span className={styles.caption}>[ {caption} ]</span>
    </div>
  );
}
