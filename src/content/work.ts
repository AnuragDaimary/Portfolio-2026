import type { StaticImageData } from "next/image";

import aion2Card from "@/assets/work/aion-2-card.jpg";
import riverpagesCard from "@/assets/work/riverpages-card.jpg";
import stravaCard from "@/assets/work/samsung-x-strava-card.jpg";
import kvFold8 from "@/assets/work/flagship-kv/02-z-fold8-family.jpg";
import kvS26Ultra from "@/assets/work/flagship-kv/01-s26-ultra.jpg";
import kvBuds4Pro from "@/assets/work/flagship-kv/03-buds4-pro.jpg";
import kvWatchUltra2 from "@/assets/work/flagship-kv/04-watch-ultra-2.jpg";
import kvS26Fe from "@/assets/work/flagship-kv/05-s26-fe.jpg";
import kvBook6Ultra from "@/assets/work/flagship-kv/06-book6-ultra.jpg";

// Project data. The home page cards and /work/[slug] case studies both read from here.
// Only "samsung-flagship-hub" has a written case study in the Figma template; the
// others render a "coming soon" case page until a `case` block is added.

/** One visual in a rotating key-visual slideshow. All slides in a set must be the same shape. */
export interface KeySlide {
  image: StaticImageData;
  /** Describes the visual for screen readers. */
  alt: string;
}

export interface MediaSlot {
  /** Placeholder caption while there is no image; doubles as the image's alt text. */
  caption: string;
  /** Placeholder height in px, desktop (mobile heights are handled in CSS). Ignored once
   *  `image` is set: the frame then takes the image's own proportions. */
  height: number;
  /**
   * A real image: `import hero from "@/assets/work/xyz.jpg"` and set `image: hero`. Next reads
   * the file's size, makes the sized/compressed versions each device needs, and builds the
   * blurred loading preview. Export at ~2x the largest display size; see src/assets/work/README.md.
   */
  image?: StaticImageData;
  /** Several visuals that rotate automatically (home-page card only). Takes over from `image`. */
  slides?: KeySlide[];
}

export interface CaseSection {
  number: string;
  title: string;
  body: string;
  media: MediaSlot[];
}

export interface CaseStudy {
  eyebrow: string;
  summary: string;
  facts: { label: string; value: string }[];
  hero: MediaSlot;
  sections: CaseSection[];
  outcome: { stats: { value: string; label: string }[]; note?: string };
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  tags: string;
  /** Home-page card media. */
  card: MediaSlot;
  /** 1 = full-width card, 2 = half-width. */
  span: 1 | 2;
  case?: CaseStudy;
}

export const projects: Project[] = [
  {
    slug: "samsung-flagship-hub",
    title: "Samsung Flagship Hub",
    tagline: "Galaxy S26 Series · Z Series 8 · Watch Ultra 2 & Watch9",
    tags: "KV · Systems",
    card: {
      caption: "Samsung Flagship Hub key visuals",
      height: 520,
      // Rotates automatically, in this order (file numbers match). All are 2:1 (2880x1440).
      slides: [
        {
          image: kvS26Ultra,
          alt: "Galaxy S26 Ultra key visual: the phone's camera module and S Pen on a violet gradient, with Galaxy AI",
        },
        {
          image: kvFold8,
          alt: "The all-new Galaxy Z Flip8, Fold8 Ultra and Fold8 key visual: three hands each holding a foldable phone",
        },
        {
          image: kvBuds4Pro,
          alt: "Galaxy Buds4 Pro key visual: a close-up of the white earbuds with brushed-metal stems on a soft lavender background",
        },
        {
          image: kvWatchUltra2,
          alt: "Galaxy Watch Ultra 2 key visual: the green-faced watch against black, with the word ULTRA blurred behind it",
        },
        {
          image: kvS26Fe,
          alt: "Galaxy S26 FE key visual: a tilted phone whose screen shows a smiling person in sunglasses, with Galaxy AI",
        },
        {
          image: kvBook6Ultra,
          alt: "Galaxy Book6 Ultra key visual: the open laptop with its keyboard shown as a transparent cut-away on a blue-grey background",
        },
      ],
    },
    span: 1,
    case: {
      eyebrow: "Case study — Samsung Canada",
      summary:
        "One visual system across Galaxy S26 Series, Z Series 8 and Watch Ultra 2 / Watch9 launches — from hero KV to 40+ channel assets.",
      // TODO: timeline is a placeholder in the design.
      facts: [
        { label: "Role", value: "Designer — KV, systems, production" },
        { label: "Team", value: "Cheil Canada · CD, copy, dev" },
        { label: "Timeline", value: "20XX · X weeks" },
        { label: "Deliverables", value: "KVs · CRM · Riverpages · Retail" },
      ],
      hero: { caption: "Full-bleed hero — launch KV", height: 720 },
      sections: [
        {
          number: "01",
          title: "Challenge",
          body: "Four launches, one quarter, two languages. Each product line had its own brief, but channels needed to feel like one Samsung story — and production had to scale without the team drowning in resizes.",
          media: [
            { caption: "Before — fragmented assets", height: 480 },
            { caption: "Brief / constraints board", height: 480 },
          ],
        },
        {
          number: "02",
          title: "System",
          body: "I defined a shared KV grid, type scale and colour logic, then built templated Figma frames for every channel size — bilingual EN / FR-CA from day one.",
          media: [{ caption: "Grid + token diagram", height: 560 }],
        },
        {
          number: "03",
          title: "Craft",
          body: "Compositing, retouching and grade for hero imagery; micro-detail on device reflections and screen content.",
          media: [
            { caption: "Detail crop", height: 420 },
            { caption: "Detail crop", height: 420 },
            { caption: "Detail crop", height: 420 },
          ],
        },
      ],
      outcome: {
        stats: [
          { value: "40+", label: "assets from one system" },
          { value: "2×", label: "faster resize turnaround" },
          { value: "EN/FR", label: "shipped simultaneously" },
        ],
        note: "Placeholder metrics — replace with real numbers",
      },
    },
  },
  {
    slug: "samsung-x-strava",
    title: "Samsung × Strava",
    tagline: "Challenge badges, banners & KV",
    tags: "Brand · Badge",
    card: {
      caption:
        "Samsung and Strava partnership key visual: marathon runners in motion on the road, with the Samsung | Strava logos in white",
      height: 420,
      image: stravaCard,
    },
    span: 2,
  },
  {
    slug: "aion-2",
    title: "AION 2",
    tagline: "North America launch",
    tags: "Launch · Visual",
    card: {
      caption:
        'AION 2 launch key art (French): two characters facing each other beside the title and the tagline "Votre saga prend son envol"',
      height: 420,
      image: aion2Card,
    },
    span: 2,
  },
  {
    slug: "riverpages",
    title: "Riverpages",
    tagline: "Designed + coded flow pages for Bell, Rogers, Telus",
    tags: "Product · Dev",
    card: {
      caption:
        "Five Riverpages side by side, each a long launch page for a Galaxy device (Watch Ultra 2, Z Fold8, Fold8 Ultra, S26 FE, S26 Ultra), cut into columns to show their length",
      height: 360,
      image: riverpagesCard,
    },
    span: 2,
  },
  {
    slug: "cheil-ai-studio",
    title: "Cheil AI Studio",
    tagline: "Internal AI production tool — UX & QA",
    tags: "NDA · Text-led",
    card: { caption: "Abstracted UI — no client data", height: 360 },
    span: 2,
  },
  {
    slug: "galaxy-campus-crew-app",
    title: "Galaxy Campus Crew App",
    tagline: "Campus ambassador app — UX & UI",
    tags: "App · UX",
    card: { caption: "Galaxy Campus Crew app screens", height: 360 },
    span: 2,
  },
  {
    slug: "figma-x-cheil-studio",
    title: "Figma × Cheil Studio",
    tagline: "CRM design system",
    tags: "Systems · CRM",
    card: { caption: "CRM design system — components and templates", height: 360 },
    span: 2,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  // `i` is -1 only for unknown slugs, which callers filter out first.
  return projects[(i + 1) % projects.length]!;
}
