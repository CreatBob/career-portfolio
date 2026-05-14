import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Layers3 } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { extractCaseStudySections } from "@/lib/project-case-study";
import {
  getProject,
  getPublishedProjectSummaries,
  isPublishedProject,
} from "@/lib/projects";

export async function generateStaticParams() {
  const enProjects = await getPublishedProjectSummaries("en");
  const zhProjects = await getPublishedProjectSummaries("zh");

  return [...enProjects, ...zhProjects].map((project) => ({
    locale: project.locale,
    slug: project.slug,
  }));
}

export default async function ProjectPage(props: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}) {
  const params = await props.params;
  const locale = params.locale || routing.defaultLocale;
  const t = await getTranslations({ locale });
  const project = await getProject(params.slug, locale);

  if (!isPublishedProject(project)) {
    notFound();
  }

  const relatedProjects = (await getPublishedProjectSummaries(locale))
    .filter((item) => item.slug !== project.slug)
    .sort((left, right) => {
      if (left.metadata.category === project.metadata.category) return -1;
      if (right.metadata.category === project.metadata.category) return 1;
      return 0;
    })
    .slice(0, 2);

  const sections = extractCaseStudySections(project.source);
  const highlights = project.metadata.highlights || [];
  const technologies = project.metadata.technologies || [];
  const links = project.metadata.links || [];
  const metaItems = [
    project.metadata.dates,
    project.metadata.location,
    project.metadata.company,
    project.metadata.role,
  ].filter(Boolean);

  return (
    <div className="portfolio-shell">
      <div className="mx-auto flex w-full max-w-[72rem] flex-col gap-10 sm:gap-12">
        <section className="project-story-stack">
          <header className="project-story-hero">
            <div className="project-story-hero__controls">
              <Link
                href="/projects"
                className="project-story-hero__back text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="size-4" />
                <span>{t("portfolioArchive.backToArchive")}</span>
              </Link>

              <span className="archive-category-chip">
                {t(`portfolioArchive.categories.${project.metadata.category === "ai-app" ? "aiApp" : project.metadata.category === "business-system" ? "businessSystem" : "internalTool"}`)}
              </span>
            </div>

            <div className="project-story-hero__content">
              <h1 className="project-story-title">{project.metadata.title}</h1>
              <p className="project-story-summary">{project.metadata.summary}</p>

              {metaItems.length > 0 ? (
                <p className="project-story-meta-line">
                  {metaItems.map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="project-story-meta-line__item"
                    >
                      {index > 0 ? (
                        <span
                          aria-hidden="true"
                          className="project-story-meta-line__separator"
                        >
                          ·
                        </span>
                      ) : null}
                      <span>{item}</span>
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
          </header>

          <section className="project-story-overview editorial-card">
            <div className="project-story-overview__header">
              <div className="section-kicker">
                {t("portfolioArchive.caseStudy.tldr")}
              </div>
            </div>

            <div className="project-story-overview__body">
              {highlights.length > 0 ? (
                <div className="project-story-overview__section">
                  <div className="project-story-overview__eyebrow">
                    <span className="archive-results-count">
                      {highlights.length.toString().padStart(2, "0")}
                    </span>
                    <span className="project-story-overview__eyebrow-label">
                    核心贡献
                    </span>
                  </div>

                  <div className="project-story-highlight-list">
                    {highlights.map((highlight) => (
                      <div key={highlight} className="project-story-highlight">
                        <CheckCircle2 className="project-story-highlight__icon size-4" />
                        <p>{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="project-story-overview__facts">
                <div className="project-story-overview__fact">
                  <div className="project-story-overview__eyebrow">
                    <span className="project-story-overview__eyebrow-label">
                      {t("portfolioArchive.caseStudy.coreRole")}
                    </span>
                  </div>
                  <p className="project-story-evidence-card__value">
                    {project.metadata.role}
                  </p>
                </div>

                {technologies.length > 0 ? (
                  <div className="project-story-overview__fact">
                    <div className="project-story-overview__eyebrow">
                      <span className="project-story-overview__eyebrow-label">
                        {t("portfolioArchive.caseStudy.techStack")}
                      </span>
                    </div>
                    <div className="project-story-tech-grid">
                      {technologies.map((tech) => (
                        <span key={tech} className="archive-tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {links.length > 0 ? (
                  <div className="project-story-evidence-card__actions">
                    {links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-foreground text-background inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="size-4" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <article className="project-story-article">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className={
                  section.kind === "impact"
                    ? "project-story-section project-story-section--impact"
                    : "project-story-section"
                }
              >
                <div className="project-story-section__header">
                  <span className="archive-results-count">
                    {section.index.toString().padStart(2, "0")}
                  </span>
                  <h2 className="project-story-section__title">{section.title}</h2>
                </div>
                <div
                  className="project-story-body prose prose-neutral dark:prose-invert max-w-none [&_blockquote]:border-l-0 [&_blockquote]:bg-white/60 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:font-serif [&_blockquote]:text-lg [&_blockquote]:leading-8 dark:[&_blockquote]:bg-white/6 [&_h2]:hidden [&_h3]:font-serif [&_h3]:text-[1.35rem] [&_h3]:font-medium [&_h3]:tracking-tight [&_img]:rounded-[1.5rem] [&_p]:text-[1rem] [&_p]:leading-7 [&_ul]:space-y-3 [&_ol]:space-y-3 [&_li]:text-[1rem] [&_li]:leading-7"
                  dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
                />
              </section>
            ))}
          </article>

          {relatedProjects.length > 0 ? (
            <section className="project-story-next">
              <div className="section-kicker">{t("portfolioArchive.nextReading")}</div>
              <div className="project-story-next__grid">
                {relatedProjects.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/projects/${item.slug}`}
                    className="project-story-related block rounded-[1.7rem] px-5 py-5 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="section-kicker">{item.metadata.dates}</div>
                      <Layers3 className="size-4 text-muted-foreground" />
                    </div>
                    <h2 className="mt-3 font-serif text-2xl leading-tight font-medium">
                      {item.metadata.title}
                    </h2>
                    <p className="text-muted-foreground mt-3 text-sm leading-7">
                      {item.metadata.summary}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                      <span>{t("portfolioArchive.openCaseStudy")}</span>
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </div>
  );
}
