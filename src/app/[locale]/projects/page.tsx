import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ProjectArchive } from "@/components/portfolio/projects-section/project-archive";
import { type Locale, routing } from "@/i18n/routing";
import { generatePersonJsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { getPublishedProjectSummaries } from "@/lib/projects";
import { jsonldScript } from "@/lib/utils";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const locale = (params.locale || routing.defaultLocale) as Locale;
  const t = await getTranslations({ locale });

  return constructMetadata({
    title: t("portfolioArchive.metaTitle"),
    description: t("portfolioArchive.metaDescription"),
    path: "/projects",
    locale,
  });
}

export default async function ProjectsArchivePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const locale = params.locale || routing.defaultLocale;
  const t = await getTranslations({ locale });
  const personJsonLd = await generatePersonJsonLd(locale);
  const projects = await getPublishedProjectSummaries(locale);

  const archiveProjects = projects.map((project) => ({
    slug: project.slug,
    title: project.metadata.title,
    summary: project.metadata.summary,
    dates: project.metadata.dates,
    role: project.metadata.role,
    company: project.metadata.company,
    location: project.metadata.location,
    category: project.metadata.category,
    technologies: project.metadata.technologies || [],
    highlights: project.metadata.highlights || [],
    featured: project.metadata.featured,
    cover: project.metadata.cover,
    links: project.metadata.links,
    href:
      locale === routing.defaultLocale
        ? `/projects/${project.slug}`
        : `/${locale}/projects/${project.slug}`,
  }));

  const categories = [
    { value: "all" as const, label: t("portfolioArchive.categories.all") },
    {
      value: "ai-app" as const,
      label: t("portfolioArchive.categories.aiApp"),
    },
    {
      value: "business-system" as const,
      label: t("portfolioArchive.categories.businessSystem"),
    },
    {
      value: "internal-tool" as const,
      label: t("portfolioArchive.categories.internalTool"),
    },
  ];
  const categoryLabels = {
    "ai-app": t("portfolioArchive.categories.aiApp"),
    "business-system": t("portfolioArchive.categories.businessSystem"),
    "internal-tool": t("portfolioArchive.categories.internalTool"),
  };

  return (
    <main className="portfolio-archive-page relative overflow-hidden pt-28 pb-24 md:pt-32">
      {jsonldScript(personJsonLd)}

      <section className="portfolio-shell">
        <div>
          <ProjectArchive
            categories={categories}
            categoryLabels={categoryLabels}
            projects={archiveProjects}
            labels={{
              archive: t("portfolioArchive.archive"),
            }}
          />
        </div>
      </section>
    </main>
  );
}
