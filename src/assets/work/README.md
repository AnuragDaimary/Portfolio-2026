# Project images

Put the **resized** images for the site here, then reference them from `src/content/work.ts`:

```ts
import hero from "@/assets/work/samsung-flagship-hub-card.jpg";
// ...
card: { caption: "Hero KV — S26 / Z Fold8 composite", height: 520, image: hero },
```

Export at roughly **2x the size it's shown at** (retina), not the full-size original:

| Slot | Shown at (max) | Export width |
| --- | --- | --- |
| Full-width card / case-study hero | ~1224 px | **2880 px** |
| Half-width card | ~600 px | 1600 px |

Keep each file under ~1 MB if you can (JPEG quality ~80, sRGB). The site makes the smaller
per-device versions itself; do NOT commit the multi-megapixel originals (keep those elsewhere).

Resize on a Mac with the built-in `sips` (keeps proportions, converts to sRGB):

```bash
sips -s format jpeg -s formatOptions 82 -m "/System/Library/ColorSync/Profiles/sRGB Profile.icc" \
  --resampleWidth 2880 "/path/to/original.jpg" --out "src/assets/work/NAME.jpg"
```

The frame's shape is taken from the image itself (a 2:1 image gets a 2:1 frame), so export each
image at the proportions you want to show; nothing is cropped.

## Rotating key visuals (Flagship card)

The first home-page card cycles through the images in `flagship-kv/` (listed as `slides` in
`src/content/work.ts`). To add, remove or reorder visuals, edit that list. Rules:

- **All slides must be the same shape** (these are 2:1, 2880 x 1440), because they share one frame.
  If a source is a different shape (a ~1.4:1 poster, say), crop it to 2:1 when you export. The
  dev console warns if a slide's shape differs.
- Each stays up for 5 s (`DEFAULT_INTERVAL_MS` in `src/components/KeyVisualCarousel.tsx`). The
  timer pauses while the pointer is over the card or the card is off screen, and does not run at
  all for visitors who prefer reduced motion.
