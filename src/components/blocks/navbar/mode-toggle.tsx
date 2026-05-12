"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <Button
      variant="ghost"
      type="button"
      size="icon"
      className="border-border/60 text-foreground relative size-10 rounded-full border bg-white/70 shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"
      onClick={() => setTheme(nextTheme)}
      aria-label={mounted ? `Switch to ${nextTheme} mode` : "Toggle theme"}
      title={mounted ? `Switch to ${nextTheme} mode` : "Toggle theme"}
    >
      <SunIcon
        className={cn(
          "absolute h-[1.1rem] w-[1.1rem] transition-all duration-200",
          isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      />
      <MoonIcon
        className={cn(
          "absolute h-[1.1rem] w-[1.1rem] transition-all duration-200",
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0",
        )}
      />
      <span className="sr-only">
        {mounted ? `Switch to ${nextTheme} mode` : "Toggle theme"}
      </span>
    </Button>
  );
}
