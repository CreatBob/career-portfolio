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

export default function Navbar({
  languageToggleDisabled = false,
}: NavbarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const displayName = t("name.full");
  const navbarItems = t.raw("navbar.items") as Array<{
    href: string;
    icon: string;
    label: string;
  }>;

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, typeof Icons.home> = {
      home: Icons.home,
      notebook: Icons.notebook,
      fileuser: Icons.fileuser,
    };

    return iconMap[iconName] || Icons.home;
  };

  return (
    <>
      <header className="portfolio-shell pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="border-border/60 pointer-events-auto mx-auto mt-4 hidden items-center justify-between rounded-full border bg-white/72 px-3 py-2 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl md:flex dark:bg-black/25">
          <I18nLink
            href="/"
            className="flex items-center gap-3 rounded-full px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span className="bg-foreground text-background brand-grid flex size-10 items-center justify-center rounded-2xl">
              <span className="font-sans text-lg leading-none font-semibold tracking-[-0.08em]">
                CY
              </span>
            </span>
            <span className="flex flex-col">
              <span
                className={cn(
                  "font-sans text-[1rem] leading-none font-semibold tracking-[-0.045em]",
                  /[\u3400-\u9fff]/.test(displayName) &&
                    "script-mark text-[1.28rem] tracking-[0.06em] text-foreground/90",
                )}
              >
                {displayName}
              </span>
              <span className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.28em] uppercase">
                Personal Brand
              </span>
            </span>
          </I18nLink>

          <nav className="flex items-center gap-1">
            {navbarItems.map((item) => {
              const href = item.href;
              const label = item.label;
              const IconComponent = getIconComponent(item.icon);
              const isStaticFile =
                href.endsWith(".pdf") ||
                href.endsWith(".png") ||
                href.endsWith(".jpg") ||
                href.endsWith(".jpeg");
              const isActive =
                !isStaticFile &&
                (href === "/"
                  ? pathname === href
                  : pathname === href || pathname.startsWith(`${href}/`));

              const linkClassName = cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.95rem] font-medium tracking-[-0.01em] transition-all duration-300 hover:-translate-y-0.5",
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5",
              );

              return isStaticFile ? (
                <a
                  key={href}
                  href={href}
                  className={linkClassName}
                  aria-label={label}
                >
                  <IconComponent className="size-4" />
                  <span>{label}</span>
                </a>
              ) : (
                <I18nLink
                  key={href}
                  href={href}
                  className={linkClassName}
                  aria-label={label}
                >
                  <IconComponent className="size-4" />
                  <span>{label}</span>
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
        <div className="border-border/70 pointer-events-auto flex items-center gap-1 rounded-full border bg-white/82 p-2 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:bg-black/35">
          {navbarItems.map((item) => {
            const href = item.href;
            const label = item.label;
            const IconComponent = getIconComponent(item.icon);
            const isStaticFile =
              href.endsWith(".pdf") ||
              href.endsWith(".png") ||
              href.endsWith(".jpg") ||
              href.endsWith(".jpeg");
            const isActive =
              !isStaticFile &&
              (href === "/"
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`));

            const itemClassName = cn(
              "flex size-11 items-center justify-center rounded-full transition-colors",
              isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5",
            );

            return isStaticFile ? (
              <a
                key={href}
                href={href}
                className={itemClassName}
                aria-label={label}
              >
                <IconComponent className="size-4" />
              </a>
            ) : (
              <I18nLink
                key={href}
                href={href}
                className={itemClassName}
                aria-label={label}
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
