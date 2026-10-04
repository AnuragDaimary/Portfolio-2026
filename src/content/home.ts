// Copy for the home page, transcribed from the Figma "PC / Home" frame.
// Items marked TODO are placeholders in the design itself.

export const hero = {
  metaLeft: "Product · Systems · Visual Design",
  metaRight: "Toronto, CA — 43.65°N",
  greeting: "Hi, I’m Anurag.",
  // Broken after the comma, as two visual lines.
  tagline: ["I design the work,", "and the system behind it."],
  // The sub-line is split around the linked word so only "Cheil" is bold + clickable.
  subBefore: "Designer at ",
  employer: "Cheil",
  // TODO: placeholder — Cheil's global site. Point this at the right Cheil page.
  employerHref: "https://www.cheil.com",
  subAfter: ", working on Samsung campaigns, emails, and web pages.",
};

export const work = {
  label: "01 — Selected work",
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

export const about = {
  label: "02 — About",
  paragraphs: [
    "I’m a designer at Cheil, working on Samsung Canada. I’ve designed for product launches and seasonal campaigns across email, web pages, carrier partner pages, and brand guidelines.",
    "What I’m best at is systems. I don’t just design the work. I improve how it gets made, with templates, components, and workflows that help the team produce more with fewer mistakes.",
    "I try new tools early and keep what’s actually useful. Lately that’s meant connecting AI to my workflow to automate repetitive production work.",
    "I also code enough to build what I design, and I can jump in on video, motion, and sound when a project needs it.",
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
