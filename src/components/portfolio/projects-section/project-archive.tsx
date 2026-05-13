"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
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
    archive: string;
  };
}

function getProjectYear(dates: string) {
  const match = dates.match(/\d{4}/);
  return match?.[0] ?? dates;
}

function ProjectCover({ project }: { project: ProjectArchiveItem }) {
  if (project.cover) {
    return (
      <div className="archive-card-cover relative aspect-[4/3] overflow-hidden rounded-[2rem]">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes="(max-width: 1024px) 100vw, 480px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  return (
    <div className="archive-card-cover archive-card-cover--type relative aspect-[4/3] overflow-hidden rounded-[2rem]">
      <div className="archive-card-cover__grid" />
      <div className="archive-card-cover__label">{project.category}</div>
      <div className="archive-card-cover__year">{getProjectYear(project.dates)}</div>
      <div className="archive-card-cover__title">
        <span>{project.title}</span>
      </div>
    </div>
  );
}

function ProjectArchiveCard({
  project,
  categoryLabel,
}: {
  project: ProjectArchiveItem;
  categoryLabel: string;
}) {
  return (
    <Link
      href={project.href}
      className="archive-grid-card group block transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3 text-[0.72rem] uppercase">
          <Badge variant="outline" className="archive-category-chip">
            {categoryLabel}
          </Badge>
          <span className="archive-grid-date">{project.dates}</span>
        </div>

        <ProjectCover project={project} />

        <div className="space-y-3">
          <h2 className="archive-grid-title">{project.title}</h2>
          <p className="archive-grid-summary">{project.summary}</p>
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
      </div>
    </Link>
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

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="section-kicker">{labels.archive}</div>
          <div className="archive-results-count">
            {String(filteredProjects.length).padStart(2, "0")}
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectArchiveCard
                key={project.slug}
                project={project}
                categoryLabel={categoryLabels[project.category]}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
