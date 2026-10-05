// Copy for the home page, transcribed from the Figma "PC / Home" frame.
// Items marked TODO are placeholders in the design itself.

export const hero = {
  metaLeft: "Product · Systems · Visual Design",
  metaRight: "Toronto, CA",
  greeting: "Hi, I’m Anurag.",
  // Broken after the comma, as two visual lines.
  tagline: ["I design the work,", "and the system behind it."],
  // The sub-line is split around the linked word so only "Cheil" is bold + clickable.
  subBefore: "Designer at ",
  employer: "Cheil",
  // TODO: placeholder — Cheil's global site. Point this at the right Cheil page.
  employerHref: "https://www.cheil.com",
  subAfter: ", working on Samsung projects.",
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
  // Each row: dates, then the company (bold line), then the job title (grey line).
  // Newest first. `title` = company, `body` = role.
  roles: [
    { dates: "Jan 2026 – Now", title: "Cheil Canada", body: "Designer" },
    { dates: "Dec 2023 – Jul 2025", title: "ICFF", body: "User Experience Designer" },
    { dates: "May 2023 – Aug 2024", title: "Infrar3D", body: "UX Designer" },
    { dates: "Sep 2023 – Nov 2023", title: "Inspiration Digital", body: "UI Designer – Contract" },
    { dates: "Sep 2018 – Dec 2018", title: "Certivity", body: "Graphic Designer – Freelance" },
  ],
  education: [
    { dates: "2023 – 2024", title: "George Brown College", body: "Design Management – Post Graduate" },
    { dates: "2022 – 2023", title: "Humber College", body: "User Experience Design – Post Graduate" },
    { dates: "2017 – 2021", title: "Indian Institute of Information Technology", body: "Bachelor of Design – Visual Design" },
  ],
  skills: [
    {
      group: "Product & UX",
      items: [
        "Quantitative research",
        "Qualitative research",
        "User flows",
        "Wireframing",
        "Prototyping",
        "QA & usability",
      ],
    },
    {
      group: "Interface & Interaction",
      items: ["Interface design", "Interaction design", "Micro-interactions", "Motion design"],
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
      group: "Accessibility",
      items: ["WCAG 2", "AODA"],
    },
    {
      group: "AI",
      items: [
        "Claude",
        "ChatGPT",
        "Nano Banana",
        "AI inside design workflows",
      ],
    },
    {
      group: "Tools",
      items: [
        "Figma",
        "Sketch",
        "Photoshop",
        "Illustrator",
        "InDesign",
        "After Effects",
        "Premiere Pro",
        "HTML/CSS",
        "TouchDesigner",
      ],
    },
  ],
};

export const contact = {
  label: "04 — Contact",
  location: "Mississauga, ON",
};
