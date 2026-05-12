import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CalendarRange,
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
  getPublishedProjects,
  isPublishedProject,
} from "@/lib/projects";

export async function generateStaticParams() {
  const enProjects = await getPublishedProjects("en");
  const zhProjects = await getPublishedProjects("zh");

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

  const relatedProjects = (await getPublishedProjects(locale))
    .filter((item) => item.slug !== project.slug)
    .slice(0, 2);

  return (
    <div className="portfolio-shell">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <Link
          href="/#projects"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>{t("sections.selectedProjects")}</span>
        </Link>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] xl:items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="section-kicker">
                {t("sections.selectedProjects")}
              </div>
              <h1 className="font-serif text-4xl leading-[0.95] font-medium tracking-tight sm:text-5xl lg:text-6xl">
                {project.metadata.title}
              </h1>
              <p className="section-copy max-w-3xl">
                {project.metadata.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(project.metadata.technologies || []).map((tech) => (
                <span
                  key={tech}
                  className="border-border/70 rounded-full border bg-white/72 px-3 py-1 text-[0.72rem] font-medium tracking-[0.16em] uppercase shadow-sm dark:bg-white/6"
                >
                  {tech}
                </span>
              ))}
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
          </div>

          <aside className="editorial-panel overflow-hidden px-6 py-6">
            <div className="space-y-5">
              <div className="grain-mask border-border/60 relative overflow-hidden rounded-[1.8rem] border bg-[linear-gradient(135deg,hsl(var(--spotlight)/0.16),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.58))] p-6 dark:bg-[linear-gradient(135deg,hsl(var(--spotlight)/0.22),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
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
                  <div className="space-y-4">
                    <div className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
                      {project.slug}
                    </div>
                    <div className="text-foreground/90 font-serif text-3xl leading-none font-medium">
                      {project.metadata.title}
                    </div>
                    <div className="text-muted-foreground text-sm leading-7">
                      {project.metadata.summary}
                    </div>
                  </div>
                )}
              </div>

              {(project.metadata.highlights || []).length > 0 ? (
                <div className="space-y-3">
                  {(project.metadata.highlights || []).map((highlight) => (
                    <div
                      key={highlight}
                      className="editorial-card text-muted-foreground rounded-[1.35rem] px-4 py-4 text-sm leading-7"
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              ) : null}

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
            </div>
          </aside>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.4fr)]">
          <article
            className="editorial-panel prose prose-neutral dark:prose-invert max-w-none px-6 py-7 text-base leading-8 sm:px-8 sm:py-8 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:font-medium [&_img]:rounded-[1.5rem]"
            dangerouslySetInnerHTML={{ __html: project.source }}
          />

          {relatedProjects.length > 0 ? (
            <aside className="space-y-4 xl:sticky xl:top-32 xl:self-start">
              {relatedProjects.map((item) => (
                <Link
                  key={item.slug}
                  href={`/projects/${item.slug}`}
                  className="editorial-card block rounded-[1.7rem] px-5 py-5 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="section-kicker">{item.metadata.dates}</div>
                  <h2 className="mt-3 font-serif text-2xl leading-tight font-medium">
                    {item.metadata.title}
                  </h2>
                  <p className="text-muted-foreground mt-3 text-sm leading-7">
                    {item.metadata.summary}
                  </p>
                </Link>
              ))}
            </aside>
          ) : null}
        </section>
      </div>
    </div>
  );
}
