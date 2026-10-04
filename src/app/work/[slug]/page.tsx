import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudy } from "@/components/case/CaseStudy";
import { getNextProject, getProject, projects } from "@/content/work";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Only slugs from content/work.ts exist; anything else is a 404 at the edge.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.case?.summary ?? project.tagline,
  };
}

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <main id="main">
        <CaseStudy project={project} next={getNextProject(slug)} />
      </main>
    </>
  );
}
