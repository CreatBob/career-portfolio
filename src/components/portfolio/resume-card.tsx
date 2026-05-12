"use client";

import { ChevronRightIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import React from "react";

import { CustomReactMarkdown } from "@/components/react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
  useMarkdown?: boolean;
  location?: string;
}

export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
  useMarkdown = false,
  location,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isTouched, setIsTouched] = React.useState(false);
  const isInteractive = Boolean(description);

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!isInteractive) {
      return;
    }

    e.preventDefault();
    setIsExpanded((value) => !value);
  };

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

  const content = (
    <div
      className={cn(
        "editorial-card group hover:border-foreground/15 flex flex-col gap-4 rounded-[1.5rem] px-5 py-5 transition-all duration-300 hover:-translate-y-1 sm:px-6",
        (isTouched || isExpanded) && "border-foreground/20 shadow-lg",
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="tech-surface size-14 rounded-[1rem]">
            <AvatarImage
              src={logoUrl}
              alt={altText}
              className="object-contain p-2"
            />
            <AvatarFallback className="font-sans text-lg font-semibold tracking-[-0.05em]">
              {altText[0]}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-sans text-xl leading-none font-semibold tracking-[-0.04em]">
                {useMarkdown ? (
                  <CustomReactMarkdown>{title}</CustomReactMarkdown>
                ) : (
                  title
                )}
              </h3>
              {badges?.map((badge) => (
                <Badge
                  key={badge}
                  variant="outline"
                  className="luxury-tag px-2.5 py-1"
                >
                  {badge}
                </Badge>
              ))}
            </div>

            {subtitle ? (
              <div className="text-muted-foreground text-sm leading-6">
                {useMarkdown ? (
                  <CustomReactMarkdown>{subtitle}</CustomReactMarkdown>
                ) : (
                  subtitle
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="luxury-tag px-3 py-1.5 text-right">
            {location ? `${location} · ${period}` : period}
          </div>
          {isInteractive ? (
            <ChevronRightIcon
              className={cn(
                "text-muted-foreground size-4 shrink-0 transition-transform duration-300",
                isExpanded ? "rotate-90" : "group-hover:translate-x-0.5",
              )}
            />
          ) : null}
        </div>
      </div>

      {description ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isExpanded ? 1 : 0,
            height: isExpanded ? "auto" : 0,
          }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="overflow-hidden"
        >
          <div className="border-border/60 text-muted-foreground border-t pt-4 text-sm leading-7">
            {useMarkdown ? (
              <CustomReactMarkdown>{description}</CustomReactMarkdown>
            ) : (
              description
            )}
          </div>
        </motion.div>
      ) : null}
    </div>
  );

  if (!href || href.trim() === "") {
    return (
      <div
        className={cn(isInteractive && "cursor-pointer")}
        onClick={handleClick}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn("block", isInteractive && "cursor-pointer")}
      onClick={handleClick}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {content}
    </Link>
  );
};
