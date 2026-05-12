"use client";

import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  disabled?: boolean;
}

export function LanguageToggle({ disabled = false }: LanguageToggleProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const isChinese = locale === "zh";

  const handleLanguageToggle = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    if (typeof window !== "undefined") {
      const scrollPosition = window.scrollY || window.pageYOffset;
      const scrollKey = `scroll-${pathname}`;
      sessionStorage.setItem(scrollKey, scrollPosition.toString());
    }

    router.replace(pathname, { locale: isChinese ? "en" : "zh" });
  };

  const displayText = disabled ? "EN" : isChinese ? "中" : "EN";

  return (
    <Button
      variant="ghost"
      type="button"
      size="icon"
      className={cn(
        "border-border/60 size-10 rounded-full border bg-white/70 text-sm shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10",
        disabled && "cursor-not-allowed opacity-50",
      )}
      onClick={handleLanguageToggle}
      aria-label="Toggle language"
      disabled={disabled}
    >
      <span className="text-sm font-medium">{displayText}</span>
    </Button>
  );
}
