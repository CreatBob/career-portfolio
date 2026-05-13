import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarRange,
  Layers3,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type React from "react";

import { Link } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
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

function DetailMeta({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="editorial-card flex items-center gap-3 rounded-[1.35rem] px-4 py-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm leading-6 font-medium">{value}</span>
    </div>
  );
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

  return (
    <div className="portfolio-shell">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>{t("portfolioArchive.backToArchive")}</span>
        </Link>

        <section className="project-story-hero">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] xl:items-start">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="section-kicker">{t("portfolioArchive.kicker")}</span>
                <span className="archive-category-chip">
                  {t(`portfolioArchive.categories.${project.metadata.category === "ai-app" ? "aiApp" : project.metadata.category === "business-system" ? "businessSystem" : "internalTool"}`)}
                </span>
              </div>
              <div className="space-y-5">
                <h1 className="project-story-title">{project.metadata.title}</h1>
                <p className="project-story-summary">{project.metadata.summary}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailMeta
                  icon={<CalendarRange className="size-4" />}
                  value={project.metadata.dates}
                />
                <DetailMeta
                  icon={<MapPin className="size-4" />}
                  value={project.metadata.location}
                />
                <DetailMeta
                  icon={<Building2 className="size-4" />}
                  value={project.metadata.company}
                />
                <DetailMeta
                  icon={<span className="font-mono text-xs uppercase">Role</span>}
                  value={project.metadata.role}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(project.metadata.technologies || []).map((tech) => (
                  <span key={tech} className="archive-tech-pill">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <aside className="project-story-aside">
              <div className="grain-mask border-border/60 relative overflow-hidden rounded-[2rem] border bg-[linear-gradient(135deg,hsl(var(--spotlight)/0.16),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.58))] p-6 dark:bg-[linear-gradient(135deg,hsl(var(--spotlight)/0.22),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
                {project.metadata.cover ? (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.35rem]">
                    <Image
                      src={project.metadata.cover}
                      alt={project.metadata.title}
                      fill
                      sizes="(max-width: 1280px) 100vw, 420px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
                      {project.slug}
                    </div>
                    <div className="project-story-cover-title">
                      {project.metadata.title}
                    </div>
                    <div className="project-story-cover-copy">
                      {project.metadata.summary}
                    </div>
                  </div>
                )}
              </div>

              {(project.metadata.links || []).length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {(project.metadata.links || []).map((link) => (
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
            </aside>
          </div>
        </section>

        {(project.metadata.highlights || []).length > 0 ? (
          <section className="project-story-spread">
            <div className="project-story-intro">
              <div className="section-kicker">
                {t("portfolioArchive.storySpread")}
              </div>
              <p className="project-story-intro-copy">{project.metadata.summary}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(project.metadata.highlights || []).map((highlight) => (
                <div key={highlight} className="project-story-highlight">
                  {highlight}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.4fr)]">
          <article
            className="project-story-body prose prose-neutral dark:prose-invert max-w-none px-6 py-8 sm:px-8 sm:py-9 [&_blockquote]:border-l-0 [&_blockquote]:bg-white/60 [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:font-serif [&_blockquote]:text-xl [&_blockquote]:leading-9 dark:[&_blockquote]:bg-white/6 [&_h2]:font-serif [&_h2]:text-4xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:font-medium [&_img]:rounded-[1.5rem] [&_p]:text-[1.02rem] [&_p]:leading-8"
            dangerouslySetInnerHTML={{ __html: project.source }}
          />

          {relatedProjects.length > 0 ? (
            <aside className="space-y-4 xl:sticky xl:top-32 xl:self-start">
              <div className="section-kicker">{t("portfolioArchive.nextReading")}</div>
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
            </aside>
          ) : null}
        </section>
      </div>
    </div>
  );
}
