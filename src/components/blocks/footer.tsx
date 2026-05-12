"use client";

import NextLink from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";

import { Icons } from "@/components/icons";
import { siteConfig } from "@/data/site";
import { Link as I18nLink } from "@/i18n/routing";
import { transformSocialData } from "@/lib/social-icons";
import { cn } from "@/lib/utils";

interface FooterLinkProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

function FooterLink({
  href,
  children,
  className,
  ariaLabel,
  icon: Icon,
}: FooterLinkProps) {
  const isInternalLink = href.startsWith("/");
  const isFileLink =
    href.endsWith(".pdf") ||
    href.endsWith(".png") ||
    href.endsWith(".jpg") ||
    href.endsWith(".jpeg");
  const target = isFileLink || !isInternalLink ? "_blank" : undefined;
  const rel = isFileLink || !isInternalLink ? "noopener noreferrer" : undefined;

  const baseClassName = cn(
    "text-muted-foreground inline-flex items-center gap-2 text-sm transition-colors hover:text-foreground",
    className,
  );

  if (isFileLink || !isInternalLink) {
    return (
      <NextLink
        href={href}
        target={target}
        rel={rel}
        className={baseClassName}
        aria-label={ariaLabel}
      >
        {Icon ? <Icon className="size-4" /> : null}
        {children ? <span>{children}</span> : null}
      </NextLink>
    );
  }

  return (
    <I18nLink href={href} className={baseClassName} aria-label={ariaLabel}>
      {Icon ? <Icon className="size-4" /> : null}
      {children ? <span>{children}</span> : null}
    </I18nLink>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations();
  const displayName = t("name.full");

  const socialData = transformSocialData(
    t.raw("social") as Record<
      string,
      {
        name: string;
        url: string;
        icon: string;
        navbar?: boolean;
        content?: boolean;
        footer?: boolean;
      }
    >,
  );
  const footerResources = t.raw("footer.resources") as Array<{
    name: string;
    url: string;
  }>;
  const footerDiscover = t.raw("footer.discover") as Array<{
    name: string;
    url: string;
  }>;
  const githubProfile = socialData.GitHub;
  const translatedNavigationSections = [
    { name: t("footer.navigation.about"), href: "/#about" },
    { name: t("footer.navigation.projects"), href: "/#projects" },
    { name: t("footer.navigation.experience"), href: "/#work" },
    { name: t("footer.navigation.education"), href: "/#education" },
    { name: t("footer.navigation.skills"), href: "/#skills" },
  ];

  return (
    <footer className="portfolio-shell pt-10 pb-24 md:pb-14">
      <div className="editorial-panel overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
          <div className="space-y-5">
            <div className="section-kicker">{t("footer.sections.connect")}</div>
            <div className="space-y-3">
              <h2
                className={cn(
                  "font-sans text-3xl leading-none font-semibold tracking-[-0.05em] sm:text-4xl",
                  /[\u3400-\u9fff]/.test(displayName) &&
                    "script-mark text-[2.45rem] tracking-[0.04em] text-foreground/92 sm:text-[3.05rem]",
                )}
              >
                {displayName}
              </h2>
              <p className="section-copy max-w-xl">{t("headline")}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {Object.values(socialData)
                .filter((social) => social.footer)
                .map((social) => (
                  <FooterLink
                    key={social.name}
                    href={social.url}
                    ariaLabel={social.name}
                    className="editorial-card rounded-full px-4 py-2.5 text-[0.95rem] font-medium tracking-[-0.01em] hover:-translate-y-0.5"
                    icon={social.icon}
                  />
                ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-3">
              <div className="section-kicker">
                {t("footer.sections.quickNavigation")}
              </div>
              <div className="space-y-2">
                {translatedNavigationSections.map((section) => (
                  <FooterLink key={section.name} href={section.href}>
                    {section.name}
                  </FooterLink>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="section-kicker">
                {t("footer.sections.resources")}
              </div>
              <div className="space-y-2">
                {footerResources.map((resource) => (
                  <FooterLink key={resource.name} href={resource.url}>
                    {resource.name}
                  </FooterLink>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="section-kicker">
                {t("footer.sections.discover")}
              </div>
              <div className="space-y-2">
                {footerDiscover.map((item) => (
                  <FooterLink key={item.name} href={item.url}>
                    {item.name}
                  </FooterLink>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-border/60 text-muted-foreground mt-8 flex flex-col gap-4 border-t pt-6 text-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              © {currentYear} {t("name.full")}
            </span>
            <span>{t("footer.legal.allRightsReserved")}</span>
            <span>
              {t("footer.bottom.lastUpdated")}: {siteConfig.lastUpdated}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <FooterLink href="/privacy-policy">
              {t("footer.legal.privacyPolicy")}
            </FooterLink>
            <FooterLink href="/terms-of-service">
              {t("footer.legal.termsDisclaimer")}
            </FooterLink>
            {githubProfile ? (
              <FooterLink
                href={githubProfile.url}
                className="inline-flex items-center gap-1"
              >
                <Icons.github className="size-4" />
                <span>{githubProfile.name}</span>
              </FooterLink>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
