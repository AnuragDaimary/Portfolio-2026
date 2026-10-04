// Copy for the home page, transcribed from the Figma "PC / Home" frame.
// Items marked TODO are placeholders in the design itself.

export const hero = {
  metaLeft: "Product · Systems · Visual Design",
  metaRight: "Toronto, CA — 43.65°N",
  lead: "Designer at Cheil working on Samsung Canada — from flagship launch key visuals to bilingual CRM, coded Riverpages, and the AI tooling that makes production faster.",
};

export const about = {
  label: "01 — How I work",
  statement:
    "I sit between brand, product and production. I build the kit of parts first — grids, tokens, templates, pipelines — so every campaign after the first one gets faster, more consistent, and easier to hand off.",
  statementShort:
    "I build the kit of parts first — grids, tokens, templates, pipelines — so every campaign after the first gets faster.",
  principles: [
    {
      title: "Systems before screens",
      body: "Tokens, grids and component logic that scale across 20+ assets per launch.",
    },
    {
      title: "Craft at production speed",
      body: "Pixel-level KVs, retouching and grading — without losing the deadline.",
    },
    {
      title: "Automate the repetitive",
      body: "Figma MCP + AI pipelines that turn copydecks into built emails.",
    },
    {
      title: "Bilingual by default",
      body: "EN / FR-CA layouts designed for both lengths from day one.",
    },
  ],
};

export const work = {
  label: "02 — Selected work",
  title: "Flagship case studies",
  blurb:
    "Launch work for Samsung Canada and partners. Each case study shows the system, the craft, and the outcome.",
  more: [
    {
      title: "Campaigns",
      body: "Father's Day · Mother's Day · Valentine's · Sustainability · Fall Savings · Back to School",
      count: "06+",
    },
    {
      title: "Email Marketing & CRM",
      body: "Bilingual Samsung Canada emails, Figma → HTML pipeline",
      count: "10",
    },
    {
      title: "Product Playbooks",
      body: "Design & copy guideline docs for Samsung partners",
      count: "—",
    },
    { title: "Archive", body: "Pre-Cheil explorations", count: "—" },
  ],
};

export const experience = {
  label: "03 — Experience & skills",
  labelShort: "03 — Experience",
  title: "Where I’ve worked",
  // TODO: the design uses 20XX placeholders for dates and the last two roles.
  roles: [
    {
      dates: "20XX — Now",
      title: "Creative / Designer — Cheil Canada",
      body: "Samsung Canada launches, CRM, Riverpages, playbooks; UX & QA on Cheil AI Studio.",
    },
    {
      dates: "20XX — 20XX",
      title: "Role title — Previous studio",
      body: "One line on scope and impact.",
    },
    {
      dates: "20XX — 20XX",
      title: "Role title — Freelance",
      body: "UI/UX, video production & colour grading (S-Log3).",
    },
  ],
  skills: [
    {
      group: "Product & UX",
      items: ["User flows", "Wireframing", "Prototyping", "QA & usability"],
    },
    {
      group: "Systems",
      items: [
        "Design tokens",
        "Component libraries",
        "Templates",
        "Figma MCP pipelines",
      ],
    },
    {
      group: "Visual & Motion",
      items: ["Key visuals", "Compositing", "Colour grading", "Typography"],
    },
    {
      group: "Tools",
      items: ["Figma", "Adobe CC", "HTML/CSS", "TouchDesigner", "Claude"],
    },
  ],
};

export const contact = {
  label: "04 — Contact",
  location: "Mississauga, ON",
};
