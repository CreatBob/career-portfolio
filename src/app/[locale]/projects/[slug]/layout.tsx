import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MobileTOC } from "@/components/blog/toc/mobile-toc";
import { TableOfContents } from "@/components/blog/toc/table-of-contents";
import type { Locale } from "@/i18n/routing";
import { LOCALES, routing } from "@/i18n/routing";
import { generateProjectCaseStudyJsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getAvailableProjectLocales,
  getProject,
  isPublishedProject,
} from "@/lib/projects";
import { jsonldScript } from "@/lib/utils";

export async function generateMetadata(props: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}): Promise<Metadata | undefined> {
  const params = await props.params;
  const locale = (params.locale || routing.defaultLocale) as Locale;
  const project = await getProject(params.slug, locale);

  if (!isPublishedProject(project)) {
    return undefined;
  }

  const availableLocales = await getAvailableProjectLocales(
    params.slug,
    LOCALES,
  );

  return constructMetadata({
    title: project.metadata.title,
    description: project.metadata.summary,
    path: `/projects/${project.slug}`,
    locale,
    availableLocales,
  });
}

export default async function ProjectLayout(props: {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}) {
  const params = await props.params;
  const locale = params.locale || routing.defaultLocale;
  const project = await getProject(params.slug, locale);

  if (!isPublishedProject(project)) {
    notFound();
  }

  const projectJsonLd = await generateProjectCaseStudyJsonLd(project);

  return (
    <main
      id="project-case-study"
      className="pt-20 pb-16 sm:pt-24 sm:pb-20 md:pt-28 lg:pt-32"
    >
      {jsonldScript(projectJsonLd)}

      <div className="fixed top-32 left-6 z-10 hidden xl:block">
        <TableOfContents content={project.source} />
      </div>

      <MobileTOC content={project.source} />

      {props.children}
    </main>
  );
}
