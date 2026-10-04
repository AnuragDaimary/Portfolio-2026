// Site-wide constants. Anything the owner may need to edit lives here, not in components.

export const site = {
  name: "Anurag Daimary",
  email: "anuragdaimary.work@gmail.com",
  description:
    "Designer at Cheil working on Samsung Canada — launch key visuals, bilingual CRM, coded Riverpages and AI production tooling.",
  resumeHref: "/resume.pdf", // TODO: drop the PDF into /public/resume.pdf
  // TODO: replace with the real profile URLs.
  socials: [
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
  ],
  nav: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
    { label: "Experience", href: "/#experience" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;
