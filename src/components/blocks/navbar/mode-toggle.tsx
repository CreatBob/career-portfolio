"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      type="button"
      size="icon"
      className="border-border/60 size-10 rounded-full border bg-white/70 shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <SunIcon className="h-[1.1rem] w-[1.1rem] text-neutral-800 dark:hidden" />
      <MoonIcon className="hidden h-[1.1rem] w-[1.1rem] text-neutral-100 dark:block" />
    </Button>
  );
}
