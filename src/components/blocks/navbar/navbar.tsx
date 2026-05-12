"use client";

import { useTranslations } from "next-intl";

import { LanguageToggle } from "@/components/blocks/navbar/language-toggle";
import { ModeToggle } from "@/components/blocks/navbar/mode-toggle";
import { Icons } from "@/components/icons";
import { Link as I18nLink, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface NavbarProps {
  languageToggleDisabled?: boolean;
}

interface NavbarItem {
  href: string;
  icon: string;
  label: string;
}

function isStaticFile(href: string) {
  return [
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".svg",
  ].some((extension) => href.endsWith(extension));
}

function isHashLink(href: string) {
  return href.startsWith("/#");
}

function getItemState(pathname: string, href: string) {
  if (isStaticFile(href) || isHashLink(href)) {
    return false;
  }

  return href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function getIconComponent(iconName: string) {
  const iconMap: Record<string, typeof Icons.home> = {
    fileuser: Icons.fileuser,
    home: Icons.home,
    layers3: Icons.layers3,
    notebook: Icons.notebook,
    userround: Icons.userround,
  };

  return iconMap[iconName] || Icons.home;
}

export default function Navbar({
  languageToggleDisabled = false,
}: NavbarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const displayName = t("name.full");
  const brandLabel = t("navbar.brandLabel");
  const navbarItems = t.raw("navbar.items") as NavbarItem[];

  return (
    <>
      <header className="portfolio-shell pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="pointer-events-auto mx-auto mt-4 hidden items-center justify-between rounded-full border border-white/12 bg-black/50 px-3 py-2 shadow-[0_28px_80px_-44px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:flex">
          <I18nLink
            href="/"
            className="group flex items-center gap-3 rounded-full px-3 py-2 transition-colors hover:bg-white/5"
          >
            <span className="brand-grid flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <span className="font-sans text-lg leading-none font-semibold tracking-[-0.08em]">
                CY
              </span>
            </span>
            <span className="flex flex-col">
              <span className="font-sans text-[1rem] leading-none font-semibold tracking-[-0.045em] text-white">
                {displayName}
              </span>
              <span className="text-[0.65rem] tracking-[0.28em] text-white/45 uppercase">
                {brandLabel}
              </span>
            </span>
          </I18nLink>

          <nav className="flex items-center gap-1">
            {navbarItems.map((item) => {
              const IconComponent = getIconComponent(item.icon);
              const isActive = getItemState(pathname, item.href);
              const linkClassName = cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.95rem] font-medium tracking-[-0.01em] transition-all duration-300 hover:-translate-y-0.5",
                isActive
                  ? "bg-white text-black shadow-[0_12px_36px_-18px_rgba(255,255,255,0.7)]"
                  : "text-white/68 hover:bg-white/7 hover:text-white",
              );

              if (isStaticFile(item.href)) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={linkClassName}
                    aria-label={item.label}
                  >
                    <IconComponent className="size-4" />
                    <span>{item.label}</span>
                  </a>
                );
              }

              return (
                <I18nLink
                  key={item.href}
                  href={item.href}
                  className={linkClassName}
                  aria-label={item.label}
                >
                  <IconComponent className="size-4" />
                  <span>{item.label}</span>
                </I18nLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <LanguageToggle disabled={languageToggleDisabled} />
          </div>
        </div>
      </header>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-5 md:hidden">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/12 bg-black/60 p-2 shadow-[0_24px_72px_-40px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
          {navbarItems.map((item) => {
            const IconComponent = getIconComponent(item.icon);
            const isActive = getItemState(pathname, item.href);
            const itemClassName = cn(
              "flex size-11 items-center justify-center rounded-full transition-colors",
              isActive
                ? "bg-white text-black"
                : "text-white/68 hover:bg-white/7 hover:text-white",
            );

            if (isStaticFile(item.href)) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={itemClassName}
                  aria-label={item.label}
                >
                  <IconComponent className="size-4" />
                </a>
              );
            }

            return (
              <I18nLink
                key={item.href}
                href={item.href}
                className={itemClassName}
                aria-label={item.label}
              >
                <IconComponent className="size-4" />
              </I18nLink>
            );
          })}
          <ModeToggle />
          <LanguageToggle disabled={languageToggleDisabled} />
        </div>
      </div>
    </>
  );
}
