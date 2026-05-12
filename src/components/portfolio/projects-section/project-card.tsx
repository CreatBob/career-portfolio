"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CustomReactMarkdown } from "@/components/react-markdown";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags?: readonly string[];
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  authors?: string;
  active?: boolean;
  featured?: boolean;
  index?: number;
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  image,
  video,
  links,
  authors,
  active = false,
  featured = false,
  index = 0,
  className,
}: Props) {
  const [isTouched, setIsTouched] = useState(false);
  const itemIndex = `${index + 1}`.padStart(2, "0");
  const initials = title
    .split(/[\s/-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleTouchStart = () => {
    if (window.innerWidth < 640) {
      setIsTouched(true);
    }
  };

  const handleTouchEnd = () => {
    if (window.innerWidth < 640) {
      setTimeout(() => setIsTouched(false), 200);
    }
  };

  const media = (
    <div
      className={cn(
        "project-media-surface border-border/70 relative overflow-hidden rounded-[1.4rem] border dark:border-white/10",
        featured ? "h-64 sm:h-72" : "h-52 sm:h-56",
        active
          ? "bg-[linear-gradient(145deg,rgba(56,189,248,0.2),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(232,240,249,0.9))] dark:bg-[linear-gradient(145deg,rgba(56,189,248,0.22),transparent_48%),linear-gradient(180deg,rgba(17,24,39,0.88),rgba(7,10,18,0.96))]"
          : "bg-[linear-gradient(145deg,rgba(16,185,129,0.15),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(236,244,240,0.88))] dark:bg-[linear-gradient(145deg,rgba(16,185,129,0.18),transparent_48%),linear-gradient(180deg,rgba(17,24,39,0.82),rgba(7,10,18,0.94))]",
      )}
    >
      {video ? (
        <>
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-xl"
            aria-hidden
          />
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className={cn(
              "pointer-events-none absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.03]",
              isTouched && "scale-[1.03]",
            )}
          >
            <track
              kind="captions"
              srcLang="en"
              label="English captions"
              default
            />
          </video>
        </>
      ) : null}

      {image ? (
        <>
          <Image
            src={image}
            alt={title}
            aria-hidden
            fill
            sizes="(max-width: 1280px) 100vw, 900px"
            className="pointer-events-none scale-110 object-cover opacity-50 blur-xl"
          />
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 1280px) 100vw, 900px"
            className={cn(
              "pointer-events-none object-contain p-6 transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.03]",
              isTouched && "scale-[1.03]",
            )}
          />
        </>
      ) : null}

      {!image && !video ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,23,42,0.08),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.04),transparent_38%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%)]" />
          <div className="text-foreground/10 absolute bottom-5 left-5 font-sans text-5xl leading-none font-semibold tracking-[-0.08em] sm:text-6xl dark:text-white/10">
            {initials || itemIndex}
          </div>
          <div className="project-chip absolute top-5 right-5 px-3 py-1">
            {itemIndex}
          </div>
        </>
      ) : null}

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
        <div className="project-chip px-3 py-1">
          {dates}
        </div>
        {active ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/12 px-3 py-1 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/12 dark:text-emerald-200">
            <span className="size-1.5 rounded-full bg-current" />
          </span>
        ) : null}
      </div>
    </div>
  );

  const cardBody = (
    <>
      <div className="group block">
        {href ? (
          <Link
            href={href}
            aria-label={`View project: ${title}`}
            className="block"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {media}
          </Link>
        ) : (
          media
        )}
      </div>

      <CardHeader className="space-y-3 px-0 pt-5">
        <div className="space-y-3">
          <CardTitle className="text-foreground font-sans text-2xl leading-tight font-semibold tracking-[-0.045em]">
            {href ? (
              <Link
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={
                  href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="transition-opacity hover:opacity-80"
              >
                <span className="[&_img]:my-0 [&_img]:inline-block [&_img]:h-[1em] [&_img]:w-auto [&_img]:align-baseline">
                  <CustomReactMarkdown>{title}</CustomReactMarkdown>
                </span>
              </Link>
            ) : (
              <span className="[&_img]:my-0 [&_img]:inline-block [&_img]:h-[1em] [&_img]:w-auto [&_img]:align-baseline">
                <CustomReactMarkdown>{title}</CustomReactMarkdown>
              </span>
            )}
          </CardTitle>
          <div className="text-muted-foreground prose max-w-full text-sm leading-7 [&_img]:my-0 [&_img]:inline-block [&_img]:h-[1em] [&_img]:w-auto [&_img]:align-baseline [&_p]:my-0">
            <CustomReactMarkdown>{description}</CustomReactMarkdown>
          </div>
          {authors?.trim() ? (
            <div className="text-muted-foreground/80 prose max-w-full text-sm leading-6 [&_p]:my-0">
              <CustomReactMarkdown>{authors}</CustomReactMarkdown>
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="mt-auto px-0 pt-1">
        {tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="project-chip px-3 py-1"
              >
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>

      {links?.length ? (
        <CardFooter className="px-0 pt-4">
          <div className="flex flex-row flex-wrap items-start gap-2">
            {links.map((link, linkIndex) => (
              <Link
                href={link.href}
                key={`${link.href}-${linkIndex}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge className="project-link-badge flex gap-2 rounded-full px-3 py-1.5 text-[0.7rem]">
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        </CardFooter>
      ) : null}
    </>
  );

  return (
    <Card
      className={cn(
        "project-card-shell flex h-full flex-col rounded-[2rem] p-5 transition-all duration-300 hover:-translate-y-1",
        featured && "xl:col-span-2 xl:p-6",
        isTouched && "border-foreground/18 shadow-lg dark:border-white/18",
        className,
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {cardBody}
    </Card>
  );
}
