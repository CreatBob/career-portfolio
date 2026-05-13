"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type TypewriterPhase = "typing" | "pausing" | "deleting";

const TYPE_SPEED_MS = 72;
const DELETE_SPEED_MS = 38;
const PAUSE_MS = 1450;

export default function HeroTypewriter({
  phrases,
  className,
}: {
  phrases: string[];
  className?: string;
}) {
  const safePhrases = useMemo(
    () => phrases.map((phrase) => phrase.trim()).filter(Boolean),
    [phrases],
  );
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<TypewriterPhase>("typing");
  const [reducedMotion, setReducedMotion] = useState(false);

  const currentPhrase = safePhrases[phraseIndex] ?? safePhrases[0] ?? "";
  const displayText = currentPhrase.slice(0, visibleCount);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (safePhrases.length === 0) {
      return;
    }

    if (reducedMotion) {
      setPhraseIndex(0);
      setVisibleCount(safePhrases[0].length);
      setPhase("pausing");
      return;
    }

    if (phase === "typing") {
      if (visibleCount < currentPhrase.length) {
        const timeout = window.setTimeout(
          () => setVisibleCount((count) => count + 1),
          TYPE_SPEED_MS,
        );

        return () => window.clearTimeout(timeout);
      }

      if (safePhrases.length === 1) {
        return;
      }

      const timeout = window.setTimeout(() => setPhase("pausing"), PAUSE_MS);
      return () => window.clearTimeout(timeout);
    }

    if (phase === "pausing") {
      const timeout = window.setTimeout(() => setPhase("deleting"), PAUSE_MS);
      return () => window.clearTimeout(timeout);
    }

    if (visibleCount > 0) {
      const timeout = window.setTimeout(
        () => setVisibleCount((count) => count - 1),
        DELETE_SPEED_MS,
      );

      return () => window.clearTimeout(timeout);
    }

    setPhraseIndex((index) => (index + 1) % safePhrases.length);
    setPhase("typing");
  }, [
    currentPhrase,
    phase,
    reducedMotion,
    safePhrases,
    visibleCount,
  ]);

  if (!currentPhrase) {
    return null;
  }

  return (
    <span className={cn("home-typewriter", className)}>
      <span aria-hidden="true">
        {displayText || "\u00a0"}
        <span className="home-typewriter__cursor">|</span>
      </span>
      <span className="sr-only">{currentPhrase}</span>
    </span>
  );
}
