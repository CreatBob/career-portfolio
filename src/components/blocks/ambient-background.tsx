"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { routing, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type AmbientMode = "showcase" | "default" | "reading";

type AmbientConfig = {
  mode: AmbientMode;
  originX: number;
  originY: number;
  gridShift: number;
  orbShift: number;
  veilShift: number;
};

function normalizePath(pathname: string | null): string {
  if (!pathname) {
    return "/";
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function stripLocalePrefix(pathname: string): string {
  for (const locale of routing.locales) {
    const prefix = `/${locale}`;

    if (pathname === prefix) {
      return "/";
    }

    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || "/";
    }
  }

  return pathname;
}

function getAmbientConfig(pathname: string | null): AmbientConfig {
  const path = stripLocalePrefix(normalizePath(pathname));

  if (
    path === "/" ||
    path === "/blog" ||
    path === "/projects"
  ) {
    return {
      mode: "showcase",
      originX: 0.78,
      originY: 0.18,
      gridShift: 18,
      orbShift: 30,
      veilShift: 44,
    };
  }

  if (
    path.startsWith("/blog/") ||
    path.startsWith("/projects/") ||
    path === "/privacy-policy" ||
    path === "/terms-of-service"
  ) {
    return {
      mode: "reading",
      originX: 0.64,
      originY: 0.16,
      gridShift: 7,
      orbShift: 12,
      veilShift: 22,
    };
  }

  return {
    mode: "default",
    originX: 0.7,
    originY: 0.22,
    gridShift: 12,
    orbShift: 20,
    veilShift: 30,
  };
}

export function AmbientBackground() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(false);

  const config = useMemo(() => getAmbientConfig(pathname), [pathname]);

  const pointerX = useMotionValue(config.originX);
  const pointerY = useMotionValue(config.originY);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 28, mass: 0.35 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 28, mass: 0.35 });

  const spotlightX = useTransform(smoothX, (value) => `${(12 + value * 64).toFixed(2)}%`);
  const spotlightY = useTransform(smoothY, (value) => `${(8 + value * 42).toFixed(2)}%`);
  const echoX = useTransform(smoothX, (value) => `${(88 - value * 48).toFixed(2)}%`);
  const echoY = useTransform(smoothY, (value) => `${(14 + (1 - value) * 34).toFixed(2)}%`);

  const gridX = useTransform(smoothX, [0, 1], [-config.gridShift, config.gridShift]);
  const gridY = useTransform(smoothY, [0, 1], [-config.gridShift * 0.65, config.gridShift * 0.65]);
  const orbPrimaryX = useTransform(smoothX, [0, 1], [-config.orbShift, config.orbShift]);
  const orbPrimaryY = useTransform(smoothY, [0, 1], [-config.orbShift * 0.75, config.orbShift * 0.75]);
  const orbSecondaryX = useTransform(smoothX, [0, 1], [config.orbShift * 0.85, -config.orbShift * 0.85]);
  const orbSecondaryY = useTransform(smoothY, [0, 1], [config.orbShift * 0.45, -config.orbShift * 0.45]);
  const veilX = useTransform(smoothX, [0, 1], [-config.veilShift, config.veilShift]);
  const veilY = useTransform(smoothY, [0, 1], [-config.veilShift * 0.55, config.veilShift * 0.55]);

  const spotlightBackground = useMotionTemplate`
    radial-gradient(circle at ${spotlightX} ${spotlightY}, hsl(var(--spotlight) / 0.34), transparent 42%),
    radial-gradient(circle at ${echoX} ${echoY}, hsl(var(--spotlight-soft) / 0.22), transparent 48%)
  `;

  const veilBackground = useMotionTemplate`
    radial-gradient(circle at ${spotlightX} ${spotlightY}, hsl(var(--spotlight) / 0.08), transparent 55%),
    radial-gradient(circle at ${echoX} ${echoY}, hsl(var(--spotlight-soft) / 0.06), transparent 60%)
  `;

  useEffect(() => {
    pointerX.set(config.originX);
    pointerY.set(config.originY);
  }, [config.originX, config.originY, pointerX, pointerY]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsFinePointer(false);
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updatePointerMode = () => {
      setIsFinePointer(mediaQuery.matches);
    };

    updatePointerMode();
    mediaQuery.addEventListener("change", updatePointerMode);

    return () => mediaQuery.removeEventListener("change", updatePointerMode);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || !isFinePointer) {
      return;
    }

    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      pointerX.set(Math.min(Math.max(event.clientX / window.innerWidth, 0), 1));
      pointerY.set(Math.min(Math.max(event.clientY / window.innerHeight, 0), 1));
    };

    const resetPointer = () => {
      pointerX.set(config.originX);
      pointerY.set(config.originY);
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("blur", resetPointer);

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("blur", resetPointer);
    };
  }, [config.originX, config.originY, isFinePointer, prefersReducedMotion, pointerX, pointerY]);

  return (
    <div
      aria-hidden="true"
      className={cn("site-ambient", `site-ambient--${config.mode}`, {
        "site-ambient--interactive": isFinePointer && !prefersReducedMotion,
        "site-ambient--static": prefersReducedMotion || !isFinePointer,
      })}
    >
      <motion.div
        className="site-ambient__spotlight"
        style={{ backgroundImage: spotlightBackground }}
      />
      <motion.div
        className="site-ambient__veil"
        style={{
          backgroundImage: veilBackground,
          x: veilX,
          y: veilY,
        }}
      />
      <motion.div
        className="site-ambient__grid"
        style={{
          x: gridX,
          y: gridY,
        }}
      />
      <motion.div
        className="site-ambient__orb site-ambient__orb--primary"
        style={{
          x: orbPrimaryX,
          y: orbPrimaryY,
        }}
      />
      <motion.div
        className="site-ambient__orb site-ambient__orb--secondary"
        style={{
          x: orbSecondaryX,
          y: orbSecondaryY,
        }}
      />
      <div className="site-ambient__noise" />
    </div>
  );
}
