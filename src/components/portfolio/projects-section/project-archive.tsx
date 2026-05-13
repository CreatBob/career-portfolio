"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProjectCategory } from "@/lib/projects";
import { cn } from "@/lib/utils";

type ArchiveCategory = ProjectCategory | "all";

export interface ProjectArchiveItem {
  slug: string;
  title: string;
  summary: string;
  dates: string;
  role: string;
  company: string;
  location: string;
  category: ProjectCategory;
  technologies: string[];
  highlights: string[];
  featured?: boolean;
  cover?: string;
  href: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
}

interface ProjectArchiveProps {
  categories: Array<{
    value: ArchiveCategory;
    label: string;
  }>;
  categoryLabels: Record<ProjectCategory, string>;
  projects: ProjectArchiveItem[];
  labels: {
    featured: string;
    archive: string;
    role: string;
    company: string;
    location: string;
    openCaseStudy: string;
    visitProject: string;
  };
}

function getProjectYear(dates: string) {
  const match = dates.match(/\d{4}/);
  return match?.[0] ?? dates;
}

function ProjectCover({
  project,
  featured = false,
}: {
  project: ProjectArchiveItem;
  featured?: boolean;
}) {
  if (project.cover) {
    return (
      <div
        className={cn(
          "archive-card-cover relative overflow-hidden rounded-[2rem]",
          featured ? "aspect-[16/10] min-h-[20rem]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes={featured ? "(max-width: 1280px) 100vw, 720px" : "480px"}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "archive-card-cover archive-card-cover--type relative overflow-hidden rounded-[2rem]",
        featured ? "min-h-[20rem]" : "aspect-[4/3]",
      )}
    >
      <div className="archive-card-cover__grid" />
      <div className="archive-card-cover__label">{project.category}</div>
      <div className="archive-card-cover__year">{getProjectYear(project.dates)}</div>
      <div className="archive-card-cover__title">
        <span>{project.title}</span>
      </div>
    </div>
  );
}

function FeaturedProject({
  project,
  labels,
  categoryLabel,
}: {
  project: ProjectArchiveItem;
  labels: ProjectArchiveProps["labels"];
  categoryLabel: string;
}) {
  const firstLink = project.links?.[0];

  return (
    <article className="archive-featured-card">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] xl:items-start">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="section-kicker">{labels.featured}</span>
              <Badge variant="outline" className="archive-category-chip">
                {categoryLabel}
              </Badge>
              <span className="archive-year-mark">{getProjectYear(project.dates)}</span>
            </div>
            <h2 className="archive-featured-title">{project.title}</h2>
            <p className="archive-featured-summary">{project.summary}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 6).map((technology) => (
              <Badge
                key={technology}
                variant="outline"
                className="archive-tech-pill"
              >
                {technology}
              </Badge>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="archive-meta-card">
              <div className="archive-meta-label">{labels.role}</div>
              <div className="archive-meta-value">{project.role}</div>
            </div>
            <div className="archive-meta-card">
              <div className="archive-meta-label">{labels.company}</div>
              <div className="archive-meta-value">{project.company}</div>
            </div>
            <div className="archive-meta-card">
              <div className="archive-meta-label">{labels.location}</div>
              <div className="archive-meta-value">{project.location}</div>
            </div>
          </div>

          {project.highlights.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {project.highlights.slice(0, 4).map((highlight) => (
                <div key={highlight} className="archive-quote-card">
                  {highlight}
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button asChild className="archive-primary-cta rounded-full px-5">
              <Link href={project.href}>
                <span>{labels.openCaseStudy}</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            {firstLink ? (
              <Button
                asChild
                variant="outline"
                className="archive-secondary-cta rounded-full px-5"
              >
                <a href={firstLink.href} target="_blank" rel="noopener noreferrer">
                  <span>{labels.visitProject}</span>
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            ) : null}
          </div>
        </div>

        <ProjectCover project={project} featured={true} />
      </div>
    </article>
  );
}

function ProjectArchiveCard({
  project,
  labels,
  categoryLabel,
}: {
  project: ProjectArchiveItem;
  labels: ProjectArchiveProps["labels"];
  categoryLabel: string;
}) {
  const firstLink = project.links?.[0];

  return (
    <article className="archive-grid-card">
      <Link href={project.href} className="block space-y-5">
        <ProjectCover project={project} />
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-[0.72rem] uppercase">
            <Badge variant="outline" className="archive-category-chip">
              {categoryLabel}
            </Badge>
            <span className="archive-grid-date">{project.dates}</span>
          </div>
          <h3 className="archive-grid-title">{project.title}</h3>
          <p className="archive-grid-summary">{project.summary}</p>
        </div>
      </Link>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.technologies.slice(0, 4).map((technology) => (
          <Badge key={technology} variant="outline" className="archive-tech-pill">
            {technology}
          </Badge>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="ghost" className="archive-inline-link rounded-full px-0">
          <Link href={project.href}>
            <span>{labels.openCaseStudy}</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        {firstLink ? (
          <Button
            asChild
            variant="ghost"
            className="archive-inline-link rounded-full px-0"
          >
            <a href={firstLink.href} target="_blank" rel="noopener noreferrer">
              <span>{labels.visitProject}</span>
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
        ) : null}
      </div>
    </article>
  );
}

export function ProjectArchive({
  categories,
  categoryLabels,
  projects,
  labels,
}: ProjectArchiveProps) {
  const [activeCategory, setActiveCategory] = useState<ArchiveCategory>("all");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") {
      return projects;
    }

    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory, projects]);

  const featuredProject = filteredProjects[0];
  const archivedProjects = filteredProjects.slice(1);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = category.value === activeCategory;

          return (
            <button
              key={category.value}
              type="button"
              onClick={() => setActiveCategory(category.value)}
              className={cn(
                "archive-filter-chip",
                isActive && "archive-filter-chip--active",
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {featuredProject ? (
        <FeaturedProject
          project={featuredProject}
          labels={labels}
          categoryLabel={categoryLabels[featuredProject.category]}
        />
      ) : null}

      {archivedProjects.length > 0 ? (
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="section-kicker">{labels.archive}</div>
            <div className="archive-results-count">
              {String(filteredProjects.length).padStart(2, "0")}
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {archivedProjects.map((project) => (
              <ProjectArchiveCard
                key={project.slug}
                project={project}
                labels={labels}
                categoryLabel={categoryLabels[project.category]}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
