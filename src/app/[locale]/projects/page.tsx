import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ProjectArchive } from "@/components/portfolio/projects-section/project-archive";
import { Button } from "@/components/ui/button";
import { Link, type Locale,routing } from "@/i18n/routing";
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

      <div className="portfolio-archive-page__backdrop pointer-events-none absolute inset-0 -z-10">
        <div className="portfolio-archive-page__glow portfolio-archive-page__glow--left" />
        <div className="portfolio-archive-page__glow portfolio-archive-page__glow--right" />
        <div className="portfolio-archive-page__grid" />
      </div>

      <section className="portfolio-shell">
        <div className="space-y-8">
          <div className="archive-cover-panel">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] xl:items-end">
              <div className="space-y-6">
                <div className="section-kicker">{t("portfolioArchive.kicker")}</div>
                <h1 className="archive-cover-title">
                  {t("portfolioArchive.title")}
                </h1>
                <p className="archive-cover-summary">
                  {t("portfolioArchive.description")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="archive-primary-cta rounded-full px-6">
                    <Link href="/">
                      {t("portfolioArchive.backHome")}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="archive-secondary-cta rounded-full px-6"
                  >
                    <a href="/resume.pdf">{t("portfolioArchive.downloadResume")}</a>
                  </Button>
                </div>
              </div>

              <div className="archive-cover-note">
                <div className="archive-cover-note__label">
                  {t("portfolioArchive.noteLabel")}
                </div>
                <div className="archive-cover-note__body">
                  {t("portfolioArchive.noteBody")}
                </div>
              </div>
            </div>
          </div>

          <ProjectArchive
            categories={categories}
            categoryLabels={categoryLabels}
            projects={archiveProjects}
            labels={{
              featured: t("portfolioArchive.featured"),
              archive: t("portfolioArchive.archive"),
              role: t("portfolioArchive.meta.role"),
              company: t("portfolioArchive.meta.company"),
              location: t("portfolioArchive.meta.location"),
              openCaseStudy: t("portfolioArchive.openCaseStudy"),
              visitProject: t("portfolioArchive.visitProject"),
            }}
          />
        </div>
      </section>
    </main>
  );
}
