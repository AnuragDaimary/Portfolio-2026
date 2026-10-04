// Project data. The home page cards and /work/[slug] case studies both read from here.
// Only "samsung-flagship-hub" has a written case study in the Figma template; the
// others render a "coming soon" case page until a `case` block is added.

export interface MediaSlot {
  /** Placeholder caption shown until a real asset is wired in. */
  caption: string;
  /** Desktop height in px (mobile heights are handled in CSS). */
  height: number;
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
    card: { caption: "Hero KV — S26 / Z Fold8 composite", height: 520 },
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
    card: { caption: "Badge system — retro patch set", height: 420 },
    span: 2,
  },
  {
    slug: "aion-2",
    title: "AION 2",
    tagline: "North America launch",
    tags: "Launch · Visual",
    card: { caption: "Launch key art", height: 420 },
    span: 2,
  },
  {
    slug: "riverpages",
    title: "Riverpages",
    tagline: "Designed + coded flow pages for Bell, Rogers, Telus",
    tags: "Product · Dev",
    card: { caption: "Riverpage flow — desktop + mobile", height: 360 },
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
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  // `i` is -1 only for unknown slugs, which callers filter out first.
  return projects[(i + 1) % projects.length]!;
}
