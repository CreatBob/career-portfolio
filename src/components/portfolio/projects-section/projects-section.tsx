"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import { ProjectCard } from "@/components/portfolio/projects-section/project-card";
import { Button } from "@/components/ui/button";

interface ProjectLink {
  readonly icon: React.ReactNode;
  readonly type: string;
  readonly href: string;
}

interface ProjectItem {
  readonly title: string;
  readonly href?: string;
  readonly dates: string;
  readonly active: boolean;
  readonly description: string;
  readonly technologies?: readonly string[];
  readonly authors?: string;
  readonly links?: readonly ProjectLink[];
  readonly image?: string;
  readonly video?: string;
}

interface ProjectsSectionProps {
  projects: readonly ProjectItem[];
  delay?: number;
  mobileDisplayCount?: number;
  desktopDisplayCount?: number;
  showAllText?: string;
  featuredFirst?: boolean;
}

export default function ProjectsSection({
  projects,
  mobileDisplayCount = 6,
  desktopDisplayCount = 6,
  showAllText = "Show All",
  featuredFirst = false,
}: ProjectsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [displayCount, setDisplayCount] = useState(desktopDisplayCount);

  useEffect(() => {
    setMounted(true);

    const updateDisplayCount = () => {
      const isDesktop = window.matchMedia("(min-width: 1280px)").matches;
      setDisplayCount(isDesktop ? desktopDisplayCount : mobileDisplayCount);
    };

    updateDisplayCount();
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    mediaQuery.addEventListener("change", updateDisplayCount);

    return () => {
      mediaQuery.removeEventListener("change", updateDisplayCount);
    };
  }, [mobileDisplayCount, desktopDisplayCount]);

  const displayed = showAll ? projects : projects.slice(0, displayCount);
  const hasMore = projects.length > displayCount;

  const renderProjects = (items: readonly ProjectItem[]) =>
    items.map((project, index) => (
      <ProjectCard
        key={project.title}
        href={project.href}
        title={project.title}
        description={project.description}
        dates={project.dates}
        tags={project.technologies}
        image={project.image}
        video={project.video}
        links={project.links}
        authors={project.authors}
        active={project.active}
        index={index}
        featured={featuredFirst && index === 0}
      />
    ));

  if (!mounted) {
    return (
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 xl:grid-cols-2">
        {renderProjects(projects.slice(0, displayCount))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 xl:grid-cols-2">
        {renderProjects(displayed)}
      </div>
      {hasMore && !showAll ? (
        <div className="flex justify-center pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(true)}
            className="rounded-full px-4"
          >
            <ChevronDown className="h-4 w-4" />
            {showAllText}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
